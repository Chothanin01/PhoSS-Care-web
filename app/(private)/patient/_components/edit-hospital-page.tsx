'use client';
import { InputField } from "@/components/inputfield";
import { SelectField } from "@/components/selectfield";
import { Button } from "@/shadcn/ui/button";
import { Check, Save } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shadcn/ui/dialog";
import { useParams } from "next/navigation"
import Cookies from "js-cookie";

interface HospitalDataProp {
  officer: Officer;
  setOfficer: React.Dispatch<React.SetStateAction<Officer>>;
}

export type OfficerData = {
  title: string;
  firstname: string;
  lastname: string;
};

export type Officer = {
  house: OfficerData;
  nurse: OfficerData;
};

const createOfficerData = (): OfficerData => ({
  title: "",
  firstname: "",
  lastname: "",
});

export const INITIAL_OFFICE: Officer = {
  house: createOfficerData(),
  nurse: createOfficerData(),
};

type ErrorState = {
  house: Partial<Record<keyof OfficerData , string>>;
  nurse: Partial<Record<keyof OfficerData , string>>;
};

export default function EditHospitalData({ officer, setOfficer }: HospitalDataProp) {

  const params = useParams()
  const id = params.id as string
  const [openSuccess, setOpenSuccess] = useState(false);

  useEffect(() => {
    const fetchOfficer = async () => {
      const token = Cookies.get("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/patients/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!res.ok) {
        throw new Error("API error")
      }

      const result = await res.json()

      const p = result.data[0]

      const mapOfficer = (rel: any): OfficerData => {
        const fullname = rel.fullname || ""

        const titleList = ["เด็กหญิง","เด็กชาย","นางสาว","นาย","นาง"]
          .sort((a,b)=> b.length - a.length)

        let extractedTitle = ""
        let remainingName = fullname

        for (const t of titleList) {
          if (fullname.startsWith(t)) {
            extractedTitle = t
            remainingName = fullname.replace(t, "").trim()
            break
          }
        }

        const nameParts = remainingName.split(" ")

        return {
          title: extractedTitle,
          firstname: nameParts[0] || "",
          lastname: nameParts.slice(1).join(" ") || "",
        }
      }

      setOfficer({
        nurse: mapOfficer(p.officer.nurse),
        house: mapOfficer(p.officer.house),
      })
    }

    if (id) fetchOfficer()
  }, [id])

  const handleSubmit = async () => {
    const token = Cookies.get("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/patients/${id}/officer`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          house: officer.house,
          nurse: officer.nurse,
        }),
      }
    )

    if (res.ok) {
      setOpenSuccess(true)
      setTimeout(() => setOpenSuccess(false), 3000)
    }
  }

  const [errors, setErrors] = useState<ErrorState>({
    house: {},
    nurse: {},
  });

  const fieldLabels: Record<string, string> = {
    firstname: "ชื่อ",
    lastname: "นามสกุล",
  };

  const handleSelectChange = (
    section: keyof Officer,
    field: keyof OfficerData,
    value: string
  ) => {
    const label = fieldLabels[field as string] || field;

    setOfficer(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));

    setErrors(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]:
          value.trim() === ""
            ? `กรุณากรอก${label}`
            : "",
      },
    }));
  };

  const handleChange = (
    section: keyof Officer,
    field: keyof OfficerData,
    value: string
  ) => {
    const label = fieldLabels[field as string] || field;

    setOfficer(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));

    setErrors(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]:
          value.trim() === ""
            ? `กรุณากรอก${label}`
            : "",
      },
    }));
  };

  const isFormValid = useMemo(() => {
    const sections = ["house", "nurse"] as const;

    return sections.every(section => {
      const p = officer[section];

      return (
        p.firstname &&
        p.lastname
      );
    });
  }, [officer]);

  return (
    <div className="w-full p-4">
      <div className="mb-6 font-semibold text-xl">
          แก้ไขข้อมูลโรงพยาบาล
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-18">
        <div>
          <div className="mb-4 font-semibold text-md">
            เจ้าหน้าที่เยี่ยมบ้าน
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <SelectField
              id="title"
              name="title"
              label="คำนำหน้า"
              placeholder="เลือกคำนำหน้า"
              value={officer.house.title}
              onValueChange={(value) =>
                handleSelectChange("house", "title", value)
              }
              options={[
                { label: "นาย", value: "นาย" },
                { label: "นาง", value: "นาง" },
                { label: "นางสาว", value: "นางสาว" },
              ]}
              errorMessage={errors.house.title}
              className="w-64"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              id="firstname"
              name="firstname"
              label="ชื่อ"
              required
              value={officer.house.firstname}
              onChange={(e) =>
                handleChange("house", "firstname", e.target.value)
              }
              errorMessage={errors.house.firstname}
              className="w-64"
            />

            <InputField
              id="lastname"
              name="lastname"
              label="นามสกุล"
              required
              value={officer.house.lastname}
              onChange={(e) =>
                handleChange("house", "lastname", e.target.value)
              }
              errorMessage={errors.house.lastname}
              className="w-64"
            />  
          </div>
        </div>
        
        <div>
          <div className="mb-4 font-semibold text-md">
            เจ้าหน้าที่
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <SelectField
              id="title"
              name="title"
              label="คำนำหน้า"
              placeholder="เลือกคำนำหน้า"
              value={officer.nurse.title}
              onValueChange={(value) =>
                handleSelectChange("nurse", "title", value)
              }
              options={[
                { label: "นาย", value: "นาย" },
                { label: "นาง", value: "นาง" },
                { label: "นางสาว", value: "นางสาว" },
              ]}
              errorMessage={errors.nurse.title}
              className="w-64"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              id="firstname"
              name="firstname"
              label="ชื่อ"
              required
              value={officer.nurse.firstname}
              onChange={(e) =>
                handleChange("nurse", "firstname", e.target.value)
              }
              errorMessage={errors.nurse.firstname}
              className="w-64"
            />

            <InputField
              id="lastname"
              name="lastname"
              label="นามสกุล"
              required
              value={officer.nurse.lastname}
              onChange={(e) =>
                handleChange("nurse", "lastname", e.target.value)
              }
              errorMessage={errors.nurse.lastname}
              className="w-64"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <Button 
          onClick={handleSubmit}
          className="text-Bamboo-100 bg-white border-2 border-Bamboo-100 font-semibold hover:bg-gray-200"
          disabled={!isFormValid}
        >
            บันทึก
            <Save className="ml-2"/>
        </Button>
      </div>
      
      <Dialog open={openSuccess} onOpenChange={setOpenSuccess}>
        <DialogContent showCloseButton={false} className="sm:max-w-md text-center">
          <DialogTitle></DialogTitle>
          <DialogDescription/>

          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#b2e0a6]">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-Bamboo-400">
                <Check className="w-8 h-8 text-white" strokeWidth={3} />
              </div>
            </div>
          </div>

          <p className="text-lg font-semibold">
            ระบบได้เเก้ไขข้อมูลเรียบร้อยเเล้ว
          </p>

        </DialogContent>
      </Dialog>
    </div>
  );
}