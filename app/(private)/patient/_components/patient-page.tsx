'use client';

import React, { useState, useMemo  } from "react";
import { RadioGroup, RadioGroupItem } from "@/shadcn/ui/radio-group";
import { InputField } from "@/components/inputfield";
import { SelectField } from "@/components/selectfield";
import { Button } from "@/shadcn/ui/button";
import { StepForward } from "lucide-react";
import DiseaseSelector from './select-disease';

interface PatientDataProp {
  onNext: () => void;
  patient: Patient;
  setPatient: React.Dispatch<React.SetStateAction<Patient>>;
}

export type Patient = {
  sex: string;
  title: string;
  age: string;
  firstname: string;
  lastname: string;
  dob: string;
  weight: string;
  height: string;
  idcard: string;
  nationality: string;
  healthCoverage: string;
  ethnicity: string;
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
  allergy: string;
  diseases: Disease[]
};

export const PATIENT_INITIAL: Patient = {
  sex: "",
  title: "",
  age: "",
  firstname: "",
  lastname: "",
  dob: "",
  weight: "",
  height: "",
  idcard: "",
  nationality: "",
  healthCoverage: "",
  ethnicity: "",
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
  allergy: "",
  diseases: [],
};

type Disease = {
  disease_id: number
  name: string
}

export default function PatientData({
  onNext,
  patient,
  setPatient,
  }: PatientDataProp) {

  const [errors, setErrors] = useState<Record<string, string>>({});

  const diseaseOptions: Disease[] = [
    { disease_id: 2, name: "โรคเบาหวาน" },
    { disease_id: 1, name: "โรคความดันโลหิตสูง" },
    { disease_id: 3, name: "วัณโรค" },
    { disease_id: 4, name: "วัคซีนเด็ก" },
  ]

  const fieldLabels: Record<string, string> = {
    sex: "เพศ",
    age: "อายุ",
    firstname: "ชื่อ",
    lastname: "นามสกุล",
    dob: "วันเกิด",
    weight: "น้ำหนัก",
    height: "ส่วนสูง",
    idcard: "เลขบัตรประชาชน",
    nationality: "สัญชาติ",
    healthCoverage: "สิทธิ์การรักษา",
    ethnicity: "เชื้อชาติ",
    phonenumber: "เบอร์โทรศัพท์",
    allergy: "ประวัติแพ้ยา",
    house_number: "บ้านเลขที่",
    village_number: "หมู่",
    subdistrict: "เขต/อำเภอ",
    district: "แขวง/ตำบล",
    province: "จังหวัด",
    zipcode: "รหัสไปรษณีย์",
  };

  const handleSelectChange = (field: keyof typeof patient) => (value: string) => {
    setPatient((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const label = fieldLabels[id] || id;

    let newValue = value;

    if (id === "idcard") {
      newValue = value.replace(/\D/g, "");

      if (newValue.length > 13) return;

      setPatient((prev) => ({
        ...prev,
        idcard: newValue,
      }));

      setErrors((prev) => ({
        ...prev,
        idcard:
          newValue.length !== 13
            ? "กรุณากรอกเลขบัตรประชาชนให้ครบ 13 หลัก"
            : "",
      }));

      return;
    }

    if (id === "phonenumber") {
      newValue = value.replace(/\D/g, "");

      setPatient((prev) => ({
        ...prev,
        phonenumber: newValue,
      }));

      setErrors((prev) => ({
        ...prev,
        phonenumber:
          newValue.trim() === ""
            ? "กรุณากรอกเบอร์โทรศัพท์"
            : "",
      }));

      return;
    }

    if (id === "age") {
      newValue = value.replace(/\D/g, "");

      setPatient((prev) => ({
        ...prev,
        age: newValue,
      }));

      setErrors((prev) => ({
        ...prev,
        age:
        newValue.trim() === ""
          ? "กรุณากรอกอายุ"
          : "",
      }));

      return;
    }

    const errorMessage =
      newValue.trim() === "" ? `กรุณากรอก${label}` : "";

    setPatient((prev) => ({
      ...prev,
      [id]: newValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [id]: errorMessage,
    }));
  };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { id, value } = e.target;
    const label = fieldLabels[id] || id;
    const errorMessage =
      value.trim() === "" ? `กรุณากรอก${label}` : "";

    setPatient((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [id]: value,
      },
    }));
    setErrors((prev) => ({
      ...prev,
      [id]: errorMessage,
    }));
  };

  const isFormValid = useMemo(() => {
    return (
      patient.sex &&
      patient.age &&
      patient.firstname &&
      patient.lastname &&
      patient.dob &&
      patient.weight &&
      patient.height &&
      patient.idcard &&
      patient.nationality &&
      patient.healthCoverage &&
      patient.ethnicity &&
      patient.phonenumber &&
      patient.allergy &&
      patient.address.house_number &&
      patient.address.village_number &&
      patient.address.subdistrict &&
      patient.address.district &&
      patient.address.province &&
      patient.address.zipcode &&
      patient.diseases.length > 0 
    );
  }, [patient]);

  const updatePatient = (key: keyof Patient, value: any) => {
    setPatient((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <div className="w-full mx-auto p-4">

      <DiseaseSelector
        options={diseaseOptions}
        value={patient.diseases}
        onChange={(val) =>
          setPatient((prev) => ({
            ...prev,
            diseases: val,
          }))
        }
      />

      <div className="mb-6 font-semibold text-xl">
        ข้อมูลผู้ป่วย
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
        <div>
          <div className="mb-4 font-semibold text-md">
            ข้อมูลส่วนตัว
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="text-muted-foreground text-sm font-medium">
                เพศ<span className="text-red-500">*</span>
              </label>

              <RadioGroup
                value={patient.sex}
                onValueChange={(val) => updatePatient("sex", val)}
                className="flex gap-6 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <label htmlFor="male" className="text-sm cursor-pointer">
                    ผู้ชาย
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <label htmlFor="female" className="text-sm cursor-pointer">
                    ผู้หญิง
                  </label>
                </div>
              </RadioGroup>
            </div>

            <SelectField
              id="title"
              name="title"
              label="คำนำหน้า"
              placeholder="เลือกคำนำหน้า"
              value={patient.title}
              onValueChange={handleSelectChange("title")}
              options={[
                { label: "นาย", value: "นาย" },
                { label: "นาง", value: "นาง" },
                { label: "นางสาว", value: "นางสาว" },
                { label: "เด็กชาย", value: "เด็กชาย" },
                { label: "เด็กหญิง", value: "เด็กหญิง" },
              ]}
              errorMessage={errors.title}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                id="age"
                name="age"
                label="อายุ"
                required
                value={patient.age}
                onChange={handleChange}
                errorMessage={errors.age}
                endAdornmentLabel="ปี"
              />
            </div>

            <InputField
              id="firstname"
              name="firstname"
              label="ชื่อ"
              required
              value={patient.firstname}
              onChange={handleChange}
              errorMessage={errors.firstname}
            />

            <InputField
              id="lastname"
              name="lastname"
              label="นามสกุล"
              required
              value={patient.lastname}
              onChange={handleChange}
              errorMessage={errors.lastname}
            />

            <InputField
              id="dob"
              name="dob"
              label="วันเกิด"
              type="date"
              required
              value={patient.dob}
              onChange={handleChange}
              errorMessage={errors.dob}
              max={new Date().toISOString().split("T")[0]}
            />  

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                id="weight"
                name="weight"
                label="น้ำหนัก"
                type="number"
                min={1}
                endAdornmentLabel="กก."
                required
                value={patient.weight}
                onChange={handleChange}
                errorMessage={errors.weight}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e") {
                    e.preventDefault();
                  }
                }}
              />

              <InputField
                id="height"
                name="height"
                label="ส่วนสูง"
                endAdornmentLabel="ซม."
                type="number"
                min={1}
                required
                value={patient.height}
                onChange={handleChange}
                errorMessage={errors.height}
                onKeyDown={(e) => {
                  if (e.key === "-" || e.key === "e") {
                    e.preventDefault();
                  }
                }}
              />
            </div>

            <InputField
              id="idcard"
              name="idcard"
              label="เลขบัตรประชาชน"
              required
              value={patient.idcard}
              onChange={handleChange}
              errorMessage={errors.idcard}
            />

            <InputField
              id="healthCoverage"
              name="healthCoverage"
              label="สิทธิ์การรักษา"
              required
              value={patient.healthCoverage}
              onChange={handleChange}
              errorMessage={errors.healthCoverage}
            />

            <InputField
              id="ethnicity"
              name="ethnicity"
              label="เชื้อชาติ"
              required
              value={patient.ethnicity}
              onChange={handleChange}
              errorMessage={errors.ethnicity}
            />

            <InputField
              id="nationality"
              name="nationality"
              label="สัญชาติ"
              required
              value={patient.nationality}
              onChange={handleChange}
              errorMessage={errors.nationality}
            />

            <InputField
              id="allergy"
              name="allergy"
              label="การแพ้ยา"
              required
              value={patient.allergy}
              onChange={handleChange}
              errorMessage={errors.allergy}
            />

            <InputField
              id="phonenumber"
              name="phonenumber"
              label="เบอร์โทรศัพท์"
              required
              value={patient.phonenumber}
              onChange={handleChange}
              errorMessage={errors.phonenumber}
            />
          </div>
        </div>

        <div>
          <div className="mb-4 font-semibold text-md mt-10">
            ที่อยู่
          </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6.5"> 
              <InputField
                id="house_number"
                name="house_number"
                label="บ้านเลขที่"
                required
                value={patient.address.house_number}
                onChange={handleAddressChange}
                errorMessage={errors.house_number}
              />
              
              <InputField
                id="village_number"
                name="village_number"
                label="หมู่"
                required
                value={patient.address.village_number}
                onChange={handleAddressChange}
                errorMessage={errors.village_number}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6.5"> 
              <InputField
                id="alley"
                name="alley"
                label="ตรอก/ซอย"
                value={patient.address.alley}
                onChange={handleAddressChange}
              />
              
              <InputField
                  id="road"
                  name="road"
                  label="ถนน"
                  value={patient.address.road}
                  onChange={handleAddressChange}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6.5"> 
              <InputField
                id="subdistrict"
                name="subdistrict"
                label="เขต/อำเภอ"
                required
                value={patient.address.subdistrict}
                onChange={handleAddressChange}
                errorMessage={errors.subdistrict}
              />
              
              <InputField
                id="district"
                name="district"
                label="แขวง/ตำบล"
                required
                value={patient.address.district}
                onChange={handleAddressChange}
                errorMessage={errors.district}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
              <InputField
                id="province"
                name="province"
                label="จังหวัด"
                required
                value={patient.address.province}
                onChange={handleAddressChange}
                errorMessage={errors.province}
              />
              
              <InputField
                id="zipcode"
                name="zipcode"
                label="รหัสไปรษณีย์"
                required
                value={patient.address.zipcode}
                onChange={handleAddressChange}
                errorMessage={errors.zipcode}
              />
            </div>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <Button 
          onClick={handleNext}
          className="text-Bamboo-100 bg-white border-2 border-Bamboo-100 font-semibold hover:bg-gray-200"
          disabled={!isFormValid}
        >
            ถัดไป
            <StepForward className="ml-2"/>
        </Button>
      </div>
    </div>
  );
}
