"use client";

import { useMemo, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import { InputField } from "@/components/inputfield";
import { SelectField } from "@/components/selectfield";
import { Button } from "@/shadcn/ui/button";
import { StepForward } from "lucide-react";

const DOCTOR_TITLES = [
  { label: "นายแพทย์", value: "นายเเพทย์" },
  { label: "แพทย์หญิง", value: "เเพทย์หญิง" },
];

type DoctorTitle = "นายเเพทย์" | "เเพทย์หญิง";

type HistoryFormData = {
  exam_date: string;
  visit_no: string;
  weight: string;
  height: string;
  pulse: string;
  pressure: string;
  bmi: string;
  symptom: string;
  status: string;
  treatment: string;
  doctor_title: string;
  doctor_firstname: string;
  doctor_lastname: string;
  disease: string;
};

type DiseaseOption = {
  label: string;
  value: string;
};

type PatientInfo = {
  fullname: string;
  hn_number: string;
  age_years: number;
  age_months: number;
  age_days: number;
};

type Props = {
  formData: HistoryFormData;
  setFormData: React.Dispatch<React.SetStateAction<HistoryFormData>>;
  onNext: () => void;
};

export default function HistoryPatient({
  formData,
  setFormData,
  onNext,
}: Props) {
  const params = useParams();
  const patientId = params.id as string;

  const [diseaseOptions, setDiseaseOptions] = useState<DiseaseOption[]>([]);
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);

  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        const token = Cookies.get("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/patients/${patientId}/info`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();

        setPatientInfo(data.data);

      } catch (err) {
        console.error("fetch patient info error", err);
      }
    };

    if (patientId) fetchPatientInfo();
  }, [patientId]);
  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const token = Cookies.get("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/patients/${patientId}/diseases`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        console.log("disease api:", data);

        const options = (data.data || []).map((item: any) => ({
          label: item.name,
          value: String(item.disease_id),
        }));

        setDiseaseOptions(options);
      } catch (error) {
        console.error("fetch diseases error:", error);
      }
    };

    if (patientId) fetchDiseases();
  }, [patientId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange =
    (field: keyof HistoryFormData) => (value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  const isFormValid = useMemo(() => {
    return (
      formData.disease &&
      formData.exam_date &&
      formData.doctor_title &&
      formData.doctor_firstname &&
      formData.doctor_lastname &&
      formData.weight &&
      formData.height &&
      formData.pulse &&
      formData.pressure &&
      formData.bmi &&
      formData.symptom &&
      formData.treatment
    );
  }, [formData]);

  return (
    <div className="px-4 py-5">
      <div>
        <h2 className="text-xl font-semibold">เพิ่มใบนัด</h2>
        <h3 className="text-lg font-semibold mt-3">ประวัติการรักษา</h3>
        {patientInfo && (
          <div className="mt-3 text-sm font-semibold">
            <div className="flex gap-10">
              <p>ชื่อ - นามสกุล : {patientInfo.fullname}</p>
              <p>หมายเลขประจำตัวผู้ป่วย : HN{patientInfo.hn_number}</p>
            </div>

            <p className="mt-2">
              อายุ : {patientInfo.age_years} ปี {patientInfo.age_months} เดือน{" "}
              {patientInfo.age_days} วัน
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
        <div>
          <div className="mb-4 font-semibold text-md mt-5">
            ข้อมูลการตรวจ
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              id="disease"
              name="disease"
              label="โรคทั้งหมด"
              placeholder="เลือกโรค"
              value={formData.disease}
              onValueChange={handleSelectChange("disease")}
              options={diseaseOptions}
            />

            <InputField
              id="exam_date"
              name="exam_date"
              label="วันที่ตรวจ"
              type="date"
              required
              value={formData.exam_date}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
            />

            <h2 className="col-span-2 font-medium -mt-3">ผู้ตรวจ</h2>

            <div className="-mt-5">
              <SelectField
                id="doctor_title"
                name="doctor_title"
                label="คำนำหน้า"
                placeholder="เลือกคำนำหน้า"
                value={formData.doctor_title}
                onValueChange={handleSelectChange("doctor_title")}
                options={DOCTOR_TITLES}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 col-span-2">
              <InputField
                id="doctor_firstname"
                name="doctor_firstname"
                label="ชื่อ"
                required
                value={formData.doctor_firstname}
                onChange={handleChange}
              />

              <InputField
                id="doctor_lastname"
                name="doctor_lastname"
                label="นามสกุล"
                required
                value={formData.doctor_lastname}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="mb-4 font-semibold text-md mt-5">
            ตรวจร่างกายทั่วไป
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              id="weight"
              name="weight"
              label="น้ำหนัก"
              type="number"
              endAdornmentLabel="กก."
              required
              value={formData.weight}
              onChange={handleChange}
            />

            <InputField
              id="height"
              name="height"
              label="ส่วนสูง"
              type="number"
              endAdornmentLabel="ซม."
              required
              value={formData.height}
              onChange={handleChange}
            />

            <InputField
              id="pulse"
              name="pulse"
              label="ชีพจร"
              type="number"
              endAdornmentLabel="ครั้ง/นาที"
              required
              value={formData.pulse}
              onChange={handleChange}
            />

            <InputField
              id="pressure"
              name="pressure"
              label="ความดัน"
              type="number"
              endAdornmentLabel="มม.ปรอท"
              required
              value={formData.pressure}
              onChange={handleChange}
            />

            <InputField
              id="bmi"
              name="bmi"
              label="ดัชนีมวลกาย"
              type="number"
              endAdornmentLabel="kg/m²"
              required
              value={formData.bmi}
              onChange={handleChange}
            />

            <InputField
              id="symptom"
              name="symptom"
              label="อาการ"
              required
              value={formData.symptom}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 w-full">
        <label className="block mb-2 text-sm font-medium">
          การรักษา <span className="text-red-500">*</span>
        </label>

        <textarea
          name="treatment"
          value={formData.treatment}
          onChange={handleChange}
          required
          rows={4}
          className="w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
        />
      </div>

      <div className="flex justify-end mt-8">
        <Button
          onClick={onNext}
          disabled={!isFormValid}
          className="text-Bamboo-100 bg-white border-2 border-Bamboo-100 font-semibold hover:bg-gray-200"
        >
          ถัดไป
          <StepForward className="ml-2" />
        </Button>
      </div>
    </div>
  );
}