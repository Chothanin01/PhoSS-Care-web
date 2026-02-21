"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shadcn/ui/button";
import { InputField } from "@/components/inputfield";
import { Edit, EllipsisVertical, FileText, Server } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shadcn/ui/dropdown-menu";
import { DataTable } from "@/components/data-table";
import { PatientFilter } from "@/components/filter";
import type { PatientFilters } from "@/components/filter";

const diseaseColorMap: Record<string, string> = {
  "โรคเบาหวาน": "bg-red-100 text-red-600",
  "วัณโรค": "bg-yellow-100 text-yellow-700",
  "โรคความดันโลหิตสูง": "bg-blue-100 text-blue-600",
  "วัคซีน": "bg-purple-100 text-purple-600",
};

enum AppointmentStatus {
  NONE = "none",
  SCHEDULED = "scheduled",
}

interface Disease {
  name: string;
  appointmentStatus: AppointmentStatus;
}

interface Patient {
  id: number;
  fullName: string;
  firstName: string;
  lastName: string;
  idCard: string;
  hnId: string;
  diseases: Disease[];
}

export function SortTablePatient() {

  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState<PatientFilters>({
    diseases: [],
    appointmentStatus: undefined,
  });

  const [diseaseOptions, setDiseaseOptions] = useState<string[]>([])

  useEffect(() => {
    const fetchDiseases = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v1/diseases`)
      const data = await res.json()

      setDiseaseOptions(data.diseases.map((d: any) => d.name))
    }

    fetchDiseases()
  }, [])

  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true)

        const params = new URLSearchParams()

        params.append("page", currentPage.toString())
        params.append("limit", itemsPerPage.toString())

        if (searchTerm.trim() !== "") {
          params.append("search", searchTerm)
        }

        if (filters.diseases.length > 0) {
          params.append(
            "disease",
            filters.diseases.join(",")
          )
        }

        if (filters.appointmentStatus !== undefined) {
          params.append(
            "appoint",
            filters.appointmentStatus === AppointmentStatus.SCHEDULED
              ? "true"
              : "false"
          )
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/patients?${params.toString()}`
        )

        const data = await res.json()

        const mapped = data.data.map((p: any) => {
        const nameParts = (p.fullname || "").split(" ")

        return {
          id: p.id,
          fullName: p. fullname,
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
          idCard: p.idcard,
          hnId: p.hnnumber,
          diseases: (p.diseases || []).map((d: any) => ({
            name: d.name,
            appointmentStatus: d.has_appointment
              ? AppointmentStatus.SCHEDULED
              : AppointmentStatus.NONE,
          })),
        }
      })

        setPatients(mapped)
        setTotalPages(data.total_pages)

      } catch (err) {
        console.error("fetch patient error", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [currentPage, searchTerm, filters])
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filters])

  const PatientColumn = [
    {
      id: "name",
      header: "ชื่อ - นามสกุล",
      cell: (patient: Patient) => <div className="whitespace-nowrap text-xs">{patient.firstName} <span className="ml-4">{patient.lastName}</span></div>,
    },
    {
      id: "hnId",
      header: "หมายเลขประจำตัวผู้ป่วย",
      cell: (patient: Patient) => <div className="whitespace-nowrap text-xs">{patient.hnId || "-"}</div>,
    },
    {
      id: "idCard",
      header: "หมายเลขที่บัตรประชาชน",
      cell: (patient: Patient) => <div className="whitespace-nowrap text-xs">{patient.idCard || "-"}</div>,
    },
    {
      id: "diseases",
      header: "โรคปัจจุบัน",
      cell: (patient: Patient) => (
        <div className="flex flex-col items-center gap-4 text-center">
          {patient.diseases.map((disease, index) => {
            const colorClass =
              diseaseColorMap[disease.name] ||
              "bg-gray-100 text-gray-600";

            return (
              <span
                key={index}
                className={`text-xs inline-flex items-center justify-center rounded-full px-2 py-1 font-medium ${colorClass}`}
              >
                {disease.name}
              </span>
            );
          })}
        </div>
      ),
    },
    {
      id: "appointmentStatus",
      header: "ใบนัดแพทย์",
      cell: (patient: Patient) => (
        <div className="flex flex-col items-center gap-4 text-center">
          {patient.diseases.map((disease, index) => {
            const isScheduled =
              disease.appointmentStatus === AppointmentStatus.SCHEDULED;

            return (
              <span
                key={index}
                className={`text-xs inline-flex items-center justify-center ${
                  isScheduled
                    ? "font-medium rounded-full bg-green-100 px-2 py-1 text-green-600"
                    : "text-black"
                }`}
              >
                {isScheduled ? "มีใบนัดแพทย์" : "-"}
              </span>
            );
          })}
        </div>
      ),
    },
    {
      id: "action",
      header: "",
      cell: (patient: Patient) => (
        <div className="whitespace-nowrap text-center text-xs">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <EllipsisVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  router.push(`/patient/${patient.id}/edit/patient`);
                }}
                className="cursor-pointer"
              >
                <Edit className="text-Bamboo-100 mr-2 h-4 w-4" /> แก้ไข
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  router.push(`/patient/${patient.id}/appoint`);
                }}
                className="cursor-pointer"
              >
                <FileText className="text-Bamboo-100 mr-2 h-4 w-4" /> เพิ่มใบนัด
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  router.push(`/patient/${patient.id}/view/patient`);
                }}
                className="cursor-pointer"
              >
                <Server className="text-Bamboo-100 mr-2 h-4 w-4" /> ดูข้อมูลทั้งหมด
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="w-full md:w-4/12">
          <InputField
            id="search-term"
            name="search-term"
            label=""
            placeholder="ค้นหารายชื่อ / หมายเลขที่บัตรประชาชน / หมายเลขประจำตัวผู้ป่วย"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <PatientFilter
          diseaseOptions={diseaseOptions}
          value={filters}
          onChange={setFilters}
        />
      </div>

      <DataTable<Patient>
        data={patients}
        columns={PatientColumn}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onSortChange={() => { }}
        currentSortBy=""
        currentSortOrder="asc"
      />

    </div>
  );
}
