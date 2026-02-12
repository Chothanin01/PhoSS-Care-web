'use client';
import { InputField } from "@/components/inputfield";
import { SelectField } from "@/components/selectfield";
import { Button } from "@/shadcn/ui/button";
import { StepBack, UserPlus } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";

interface HospitalDataProp {
  onNext: () => void;
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

export default function HospitalData({ onNext, onBack, officer, setOfficer }: HospitalDataProp) {

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

  const handleNext = () => {
      onNext();
  };

  const handleBack = () => {
    onBack();
  }

  return (
    <div className="w-full mx-auto p-4">
      <div className="mb-6 font-semibold text-xl">
          ข้อมูลโรงพยาบาล
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
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
                { label: "เด็กชาย", value: "เด็กชาย" },
                { label: "เด็กหญิง", value: "เด็กหญิง" },
              ]}
              errorMessage={errors.house.title}
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
                { label: "เด็กชาย", value: "เด็กชาย" },
                { label: "เด็กหญิง", value: "เด็กหญิง" },
              ]}
              errorMessage={errors.nurse.title}
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
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="flex justify-start mt-8">
          <Button onClick={handleBack} className="text-Bamboo-100 bg-white border-2 border-Bamboo-100 font-semibold hover:bg-gray-200">
            ย้อนกลับ
            <StepBack className="ml-2"/>
          </Button>
        </div>

        <div className="flex justify-end mt-8">
          <Button
            onClick={handleNext}
            className="text-white bg-Bamboo-100 border-2 border-Bamboo-100 font-semibold hover:bg-gray-200"
            disabled={!isFormValid}
          >
            สร้าง
            <UserPlus className="ml-2"/>
          </Button>
        </div>
      </div>
    </div>
  );
}