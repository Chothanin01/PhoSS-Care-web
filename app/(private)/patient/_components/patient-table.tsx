"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/shadcn/ui/button";
import { InputField } from "@/components/inputfield";
import { Edit, EllipsisVertical, FileText, Server } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/shadcn/ui/dropdown-menu";
import { DataTable } from "@/components/data-table";
import { mockPatients } from "@/app/utils/patient.mock";

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
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const totalItems = mockPatients.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedPatients = mockPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const PatientColumn = [
    {
      id: "name",
      header: "ชื่อ - นามสกุล",
      cell: (patient: Patient) => <div className="whitespace-nowrap text-xs">{patient.firstName} {patient.lastName}</div>,
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
                  router.push(`/agent/${patient.id}/edit`);
                }}
                className="cursor-pointer"
              >
                <Edit className="text-Bamboo-100 mr-2 h-4 w-4" /> แก้ไข
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  router.push(`/agent/${patient.id}/appoint`);
                }}
                className="cursor-pointer"
              >
                <FileText className="text-Bamboo-100 mr-2 h-4 w-4" /> เพิ่มใบนัด
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  router.push(`/agent/${patient.id}/patient`);
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
            placeholder="ค้นหารายชื่อ / หมายเลขบัตรประชาชน / หมายเลขประจำตัวผู้ป่วย"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <DataTable<Patient>
        data={paginatedPatients}
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
