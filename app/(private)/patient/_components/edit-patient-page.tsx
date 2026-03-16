'use client';

import React, { useState, useMemo, useEffect } from "react";
import { RadioGroup, RadioGroupItem } from "@/shadcn/ui/radio-group";
import { InputField } from "@/components/inputfield";
import { SelectField } from "@/components/selectfield";
import { Button } from "@/shadcn/ui/button";
import { Check, Save, CircleX, CircleCheck } from "lucide-react";
import DiseaseSelector from './select-disease';
import { useParams } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shadcn/ui/dialog";
import Cookies from "js-cookie";

interface PatientDataProp {
  patient: Patient;
  setPatient: React.Dispatch<React.SetStateAction<Patient>>;
}

export type Patient = {
  sex: string;
  title: string;
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
  disease_id: string
  name: string
}

export default function EditPatientData({
  patient,
  setPatient,
  }: PatientDataProp) {

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [diseaseOptions, setDiseaseOptions] = useState<Disease[]>([])
  const params = useParams()
  const id = params.id as string
  const [openSuccess, setOpenSuccess] = useState(false);
  const [originalDiseases, setOriginalDiseases] = useState<Disease[]>([])
  const [openConfirmDisease, setOpenConfirmDisease] = useState(false)

  useEffect(() => {
    const fetchPatient = async () => {
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
      const fullname = p.patient.fullname || ""
      const titleList = [ "เด็กหญิง", "เด็กชาย","นางสาว", "นาย", "นาง", ].sort((a, b) => b.length - a.length)
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

      setPatient({
        sex: p.patient.sex,
        title: extractedTitle,
        firstname: nameParts[0] || "",
        lastname: nameParts.slice(1).join(" ") || "",
        dob: p.patient.dob || "",
        weight: p.patient.weight?.toString() || "",
        height: p.patient.height?.toString() || "",
        idcard: p.patient.idcard || "",
        nationality: p.patient.nationality || "",
        healthCoverage: p.patient.rights || "",
        ethnicity: p.patient.ethnicity || "",
        phonenumber: p.patient.phone_number || "",
        allergy: p.patient.allergy || "",
        address: {
          house_number: p.patient.address.house_number || "",
          village_number: p.patient.address.village_number || "",
          alley: p.patient.address.alley || "",
          road: p.patient.address.road || "",
          subdistrict: p.patient.address.subdistrict || "",
          district: p.patient.address.district || "",
          province: p.patient.address.province || "",
          zipcode: p.patient.address.zipcode || "",
        },
        diseases: []
      })
    }

    if (id) fetchPatient()
  }, [id])

  useEffect(() => {
    const fetchDiseases = async () => {
      const token = Cookies.get("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/diseases`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await res.json()

      setDiseaseOptions(data.diseases || [])
    }

    fetchDiseases()
  }, [])

  useEffect(() => {
    const fetchPatientDiseases = async () => {
      const token = Cookies.get("token")

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/patients/${id}/diseases?type=active`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await res.json()

      const diseases = (data.data || []).map((d: Disease) => ({
        disease_id: d.disease_id,
        name: d.name,
      }))

      setOriginalDiseases(diseases)

      setPatient((prev) => ({
        ...prev,
        diseases: diseases,
      }))
    }

    if (id) fetchPatientDiseases()
  }, [id])

  const isDiseaseChanged = () => {
    const oldIds = originalDiseases.map(d => d.disease_id).sort()
    const newIds = patient.diseases.map(d => d.disease_id).sort()

    return JSON.stringify(oldIds) !== JSON.stringify(newIds)
  }

  const fieldLabels: Record<string, string> = {
    sex: "เพศ",
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

  const handleSubmit = async () => {

    if (isDiseaseChanged()) {
      setOpenConfirmDisease(true)
      return
    }

    await submitUpdate()
  }

  const submitUpdate = async () => {

    const token = Cookies.get("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/patients/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: patient.title,
          firstname: patient.firstname,
          lastname: patient.lastname,
          sex: patient.sex,
          dob: patient.dob,
          idcard: patient.idcard,
          rights: patient.healthCoverage,
          nationality: patient.nationality,
          ethnicity: patient.ethnicity,
          phonenumber: patient.phonenumber,
          weight: Number(patient.weight),
          height: Number(patient.height),
          diseases: patient.diseases,
          address: patient.address
        })
      }
    )

    if (res.ok) {
      setOpenSuccess(true)
    }

  }

  useEffect(() => {
    if (openSuccess) {
      const timer = setTimeout(() => {
        setOpenSuccess(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [openSuccess])

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
        แก้ไขข้อมูลผู้ป่วย
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

            <div className="col-span-2 flex">
              <div className="w-78">
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
              </div>
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

      <Dialog open={openConfirmDisease} onOpenChange={setOpenConfirmDisease}>
        <DialogContent
          className="sm:max-w-md text-center"
          showCloseButton={false}
        >
          <DialogTitle className="text-lg font-semibold">
            ยืนยันการเปลี่ยนแปลงโรคของผู้ป่วย
          </DialogTitle>
          <DialogDescription />

          <div className="mt-6 text-sm">
            <p className="mb-3 font-medium">จาก</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {originalDiseases.map((d) => (
                <span
                  key={d.disease_id}
                  className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-medium"
                >
                  {d.name}
                </span>
              ))}
            </div>

            <p className="mt-6 mb-3 font-medium">เป็น</p>

            <div className="flex flex-wrap gap-2 justify-center">
              {patient.diseases.map((d) => (
                <span
                  key={d.disease_id}
                  className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium"
                >
                  {d.name}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <Button
              className="w-full bg-Bamboo-200 text-red-500 font-medium border-red-500 border-2 hover:bg-red-100"
              onClick={() => setOpenConfirmDisease(false)}
            >
              <CircleX className="mr-2 w-4 h-4"/>
              ยกเลิก
            </Button>

            <Button
              className="w-full font-medium bg-Bamboo-200 border-Bamboo-100 border-2 text-Bamboo-100 hover:bg-gray-400"
              onClick={async () => {
                setOpenConfirmDisease(false)
                await submitUpdate()
              }}
            >
              <CircleCheck className="mr-2 w-4 h-4"/>
              ยืนยัน
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
