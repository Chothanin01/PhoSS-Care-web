'use client';
import { InputField } from "@/components/inputfield";
import { SelectField } from "@/components/selectfield";
import { Button } from "@/shadcn/ui/button";
import { StepForward, StepBack } from "lucide-react";
import React, { useState, useMemo } from "react";
import { Separator } from "@/shadcn/ui/separator";

interface RelativeDataProp {
  onNext: () => void;
  onBack: () => void;
  relative: Relative;
  setRelative: React.Dispatch<React.SetStateAction<Relative>>;
}

export type RelativeData = {
  title: string;
  firstname: string;
  lastname: string;
  phonenumber: string;
  address: {
    house_number: string;
    village_number: string;
    alley: string;
    road: string;
    subdistrict: string;
    district: string;
    province: string;
    zipcode: string;
  }
};

export type Relative = {
  kin: RelativeData;
  caretaker: RelativeData;
  medicine: RelativeData;
};

const createRelativeData = (): RelativeData => ({
  title: "",
  firstname: "",
  lastname: "",
  phonenumber: "",
  address: {
    house_number: "",
    village_number: "",
    alley: "",
    road: "",
    subdistrict: "",
    district: "",
    province: "",
    zipcode: "",
  },
});

export const INITIAL_RELATIVE: Relative = {
  kin: createRelativeData(),
  caretaker: createRelativeData(),
  medicine: createRelativeData(),
};

type ErrorState = {
  kin: Partial<Record<keyof RelativeData | keyof RelativeData["address"], string>>;
  caretaker: Partial<Record<keyof RelativeData | keyof RelativeData["address"], string>>;
  medicine: Partial<Record<keyof RelativeData | keyof RelativeData["address"], string>>;
};

const TITLE_OPTIONS = [
  { label: "นาย", value: "นาย" },
  { label: "นาง", value: "นาง" },
  { label: "นางสาว", value: "นางสาว" },
  { label: "เด็กชาย", value: "เด็กชาย" },
  { label: "เด็กหญิง", value: "เด็กหญิง" },
];

const fieldLabels: Record<string, string> = {
  firstname: "ชื่อ",
  lastname: "นามสกุล",
  phonenumber: "เบอร์โทรศัพท์",
  house_number: "บ้านเลขที่",
  village_number: "หมู่",
  subdistrict: "เขต/อำเภอ",
  district: "แขวง/ตำบล",
  province: "จังหวัด",
  zipcode: "รหัสไปรษณีย์",
};

function AddressFields({
  data,
  section,
  errors,
  onAddressChange,
}: {
  data: RelativeData["address"];
  section: keyof Relative;
  errors: Partial<Record<string, string>>;
  onAddressChange: (section: keyof Relative, field: keyof RelativeData["address"], value: string) => void;
}) {
  const f = (field: keyof RelativeData["address"]) => (
    <InputField
      id={field}
      name={field}
      label={fieldLabels[field] ?? field}
      value={data[field]}
      onChange={(e) => onAddressChange(section, field, e.target.value)}
      errorMessage={errors[field]}
    />
  );
  const fRequired = (field: keyof RelativeData["address"]) => (
    <InputField
      id={field}
      name={field}
      label={fieldLabels[field] ?? field}
      required
      value={data[field]}
      onChange={(e) => onAddressChange(section, field, e.target.value)}
      errorMessage={errors[field]}
    />
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {fRequired("house_number")}
      {fRequired("village_number")}
      {f("alley")}
      {f("road")}
      {fRequired("subdistrict")}
      {fRequired("district")}
      {fRequired("province")}
      {fRequired("zipcode")}
    </div>
  );
}

function PersonalFields({
  data,
  section,
  errors,
  required,
  onSelectChange,
  onChange,
}: {
  data: RelativeData;
  section: keyof Relative;
  errors: Partial<Record<string, string>>;
  required?: boolean;
  onSelectChange: (section: keyof Relative, field: keyof RelativeData, value: string) => void;
  onChange: (section: keyof Relative, field: keyof RelativeData, value: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="w-full sm:w-1/2">
        <SelectField
          id="title"
          name="title"
          label="คำนำหน้า"
          placeholder="เลือกคำนำหน้า"
          value={data.title}
          onValueChange={(v) => onSelectChange(section, "title", v)}
          options={TITLE_OPTIONS}
          errorMessage={errors.title}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <InputField
          id="firstname"
          name="firstname"
          label="ชื่อ"
          required={required}
          value={data.firstname}
          onChange={(e) => onChange(section, "firstname", e.target.value)}
          errorMessage={errors.firstname}
        />

        <InputField
          id="lastname"
          name="lastname"
          label="นามสกุล"
          required={required}
          value={data.lastname}
          onChange={(e) => onChange(section, "lastname", e.target.value)}
          errorMessage={errors.lastname}
        />

        <InputField
          id="phonenumber"
          name="phonenumber"
          label="เบอร์โทรศัพท์"
          required={required}
          value={data.phonenumber}
          onChange={(e) => onChange(section, "phonenumber", e.target.value)}     
          errorMessage={errors.phonenumber}
        />
      </div>
    </div>
  );
}

function RelativeSection({
  sectionLabel,
  data,
  section,
  errors,
  required,
  onSelectChange,
  onChange,
  onAddressChange,
}: {
  sectionLabel?: string;
  data: RelativeData;
  section: keyof Relative;
  errors: Partial<Record<string, string>>;
  required?: boolean;
  onSelectChange: (section: keyof Relative, field: keyof RelativeData, value: string) => void;
  onChange: (section: keyof Relative, field: keyof RelativeData, value: string) => void;
  onAddressChange: (section: keyof Relative, field: keyof RelativeData["address"], value: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24 mb-8">
      <div>
        {sectionLabel && (
          <div className="mb-2 font-semibold text-md">{sectionLabel}</div>
        )}
        <div className="mb-4 font-semibold text-md">ข้อมูลส่วนตัว</div>
        <PersonalFields
          data={data}
          section={section}
          errors={errors}
          required={required}
          onSelectChange={onSelectChange}
          onChange={onChange}
        />
      </div>

      <div>
        <div className="mb-4 font-semibold text-md mt-0 lg:mt-10">ที่อยู่</div>
        <AddressFields
          data={data.address}
          section={section}
          errors={errors}
          onAddressChange={onAddressChange}
        />
      </div>
    </div>
  );
}

export default function RelativeData({ onNext, onBack, relative, setRelative }: RelativeDataProp) {
  const [errors, setErrors] = useState<ErrorState>(
    { kin: {},
      caretaker: {},
      medicine: {}
    });

  const handleSelectChange = (
    section: keyof Relative,
    field: keyof RelativeData,
    value: string
  ) => {
    setRelative((prev) => ({
      ...prev, [section]:{ ...prev[section], [field]: value } }));
    setErrors((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value.trim() === "" ? `กรุณากรอก${fieldLabels[field] ?? field}` : "" } }));
    };

  const handleChange = (
    section: keyof Relative,
    field: keyof RelativeData,
    value: string
  ) => {
    let newValue = value;
    if (field === "phonenumber") newValue = value.replace(/\D/g, "");
      setRelative((prev) => ({ ...prev, [section]: { ...prev[section], [field]: newValue } }));
      setErrors((prev) => ({ ...prev, [section]: { ...prev[section], [field]: newValue.trim() === "" ? `กรุณากรอก${fieldLabels[field] ?? field}` : "" } }));
    };

  const handleAddressChange = (section: keyof Relative, field: keyof RelativeData["address"], value: string) => {
    setRelative((prev) => ({ ...prev, [section]: { ...prev[section], address: { ...prev[section].address, [field]: value } } }));
    setErrors((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value.trim() === "" ? `กรุณากรอก${fieldLabels[field] ?? field}` : "" } }));
  };

  const isFormValid = useMemo(() => {
    const p = relative.kin;
    return !!(p.firstname && p.lastname && p.phonenumber &&
      p.address.house_number && p.address.village_number &&
      p.address.subdistrict && p.address.district &&
      p.address.province && p.address.zipcode);
  }, [relative]);

  return (
    <div className="w-full mx-auto p-4">
      <div className="mb-6 font-semibold text-xl">ข้อมูลญาติผู้ป่วย</div>

      <RelativeSection
        data={relative.kin}
        section="kin"
        errors={errors.kin}
        required
        onSelectChange={handleSelectChange}
        onChange={handleChange}
        onAddressChange={handleAddressChange}
      />

      <Separator className="mb-8" />

      <RelativeSection
        sectionLabel="ผู้ดูแลกำกับการกินยา"
        data={relative.caretaker}
        section="caretaker"
        errors={errors.caretaker}
        onSelectChange={handleSelectChange}
        onChange={handleChange}
        onAddressChange={handleAddressChange}
      />

      <Separator className="mb-8" />

      <RelativeSection
        sectionLabel="ผู้ป้อนยาผู้ป่วย"
        data={relative.medicine}
        section="medicine"
        errors={errors.medicine}
        onSelectChange={handleSelectChange}
        onChange={handleChange}
        onAddressChange={handleAddressChange}
      />

      <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 mt-8">
        <Button
          onClick={onBack}
          className="text-Bamboo-100 bg-white border-2 border-Bamboo-100 font-semibold hover:bg-gray-200 w-full sm:w-auto"
        >
          <StepBack className="mr-2" />
          ย้อนกลับ
        </Button>

        <Button
          onClick={onNext}
          className="text-Bamboo-100 bg-white border-2 border-Bamboo-100 font-semibold hover:bg-gray-200 w-full sm:w-auto"
          disabled={!isFormValid}
        >
          ถัดไป
          <StepForward className="ml-2" />
        </Button>
      </div>
    </div>
  );
}