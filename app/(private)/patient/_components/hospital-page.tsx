'use client';
import { InputField } from "@/components/inputfield";
import { SelectField } from "@/components/selectfield";
import { Button } from "@/shadcn/ui/button";
import { StepBack, UserPlus } from "lucide-react";
import React, { useState, useMemo } from "react";

interface HospitalDataProp {
  onSubmit: () => void;
  onBack: () => void;
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

const TITLE_OPTIONS = [
  { label: "นาย", value: "นาย" },
  { label: "นาง", value: "นาง" },
  { label: "นางสาว", value: "นางสาว" },
];

const fieldLabels: Record<string, string> = {
  firstname: "ชื่อ",
  lastname: "นามสกุล",
};

export default function HospitalData({ onSubmit, onBack, officer, setOfficer }: HospitalDataProp) {
  const [errors, setErrors] = useState<ErrorState>({ house: {}, nurse: {} });

  const handleSelectChange = (
    section: keyof Officer,
    field: keyof OfficerData,
    value: string
  ) => {
    setOfficer(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    setErrors((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]:
          value.trim() === ""
            ? `กรุณากรอก${fieldLabels[field] ?? field}`
            : "",
      },
    }));
  };

  const handleChange = (
    section: keyof Officer,
    field: keyof OfficerData,
    value: string
  ) => {
    setOfficer(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    setErrors((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]:
          value.trim() === ""
            ? `กรุณากรอก${fieldLabels[field] ?? field}`
            : "",
      },
    }));
  };

  const isFormValid = useMemo(() => {
    return (["house", "nurse"] as const).every(
      (s) => officer[s].firstname && officer[s].lastname
    );
  }, [officer]);

  return (
    <div className="w-full mx-auto p-4">
      <div className="mb-6 font-semibold text-xl">ข้อมูลโรงพยาบาล</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24">

        <div>
          <div className="mb-4 font-semibold text-md">เจ้าหน้าที่เยี่ยมบ้าน</div>

          <div className="w-full sm:w-1/2 mb-6">
            <SelectField
              id="house-title"
              name="title"
              label="คำนำหน้า"
              placeholder="เลือกคำนำหน้า"
              value={officer.house.title}
              onValueChange={(v) => handleSelectChange("house", "title", v)}
              options={TITLE_OPTIONS}
              errorMessage={errors.house.title}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField
              id="house-firstname"
              name="firstname"
              label="ชื่อ"
              required
              value={officer.house.firstname}
              onChange={(e) =>
                handleChange("house", "firstname", e.target.value)
              }
              errorMessage={errors.house.firstname}
            />

            <InputField
              id="house-lastname"
              name="lastname"
              label="นามสกุล"
              required
              value={officer.house.lastname}
              onChange={(e) =>
                handleChange("house", "lastname", e.target.value)
              }
              errorMessage={errors.house.lastname}
            />  
          </div>
        </div>

        <div>
          <div className="mb-4 font-semibold text-md">
            เจ้าหน้าที่
          </div>

          <div className="w-full sm:w-1/2 mb-6">
            <SelectField
              id="nurse-title"
              name="title"
              label="คำนำหน้า"
              placeholder="เลือกคำนำหน้า"
              value={officer.nurse.title}
              onValueChange={(v) => handleSelectChange("nurse", "title", v)}
              options={TITLE_OPTIONS}
              errorMessage={errors.nurse.title}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField
              id="nurse-firstname"
              name="firstname"
              label="ชื่อ"
              required
              value={officer.nurse.firstname}
              onChange={(e) =>
                handleChange("nurse", "firstname", e.target.value)
              }
              errorMessage={errors.nurse.firstname}
            />

            <InputField
              id="nurse-lastname"
              name="lastname"
              label="นามสกุล"
              required
              value={officer.nurse.lastname}
              onChange={(e) =>
                handleChange("nurse", "lastname", e.target.value)
              }
              errorMessage={errors.nurse.lastname}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 mt-8">
        <Button
          onClick={onBack}
          className="text-Bamboo-100 bg-white border-2 border-Bamboo-100 font-semibold hover:bg-gray-200 w-full sm:w-auto"
        >
          <StepBack className="mr-2" />
          ย้อนกลับ
        </Button>

        <Button
          onClick={onSubmit}
          className="text-white bg-Bamboo-100 border-2 border-Bamboo-100 font-semibold hover:bg-gray-200 w-full sm:w-auto"
          disabled={!isFormValid}
        >
          สร้าง
          <UserPlus className="ml-2" />
        </Button>
      </div>
    </div>
  );
}