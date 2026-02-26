"use client";

import { useMemo } from "react";
import { Patient } from "@/app/utils/patient.mock";
import { InputField } from "@/components/inputfield";
import { SelectField } from "@/components/selectfield";
import { Button } from "@/shadcn/ui/button";
import { StepForward } from "lucide-react";

type HistoryFormData = {
  examDate: string;
  visitNo: string;
  weight: string;
  height: string;
  pulse: string;
  pressure: string;
  bmi: string;
  status: string;
  treatment: string;
  doctorTitle: string;
  doctorFirstName: string;
  doctorLastName: string;
  disease: string;
};

type Props = {
  patient: Patient;
  formData: HistoryFormData;
  setFormData: React.Dispatch<React.SetStateAction<HistoryFormData>>;
  onNext: () => void;
};

export default function HistoryPatient({
  patient,
  formData,
  setFormData,
  onNext,
}: Props) {
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
      formData.examDate &&
      formData.doctorTitle &&
      formData.doctorFirstName &&
      formData.doctorLastName &&
      formData.weight &&
      formData.height &&
      formData.pulse &&
      formData.pressure &&
      formData.bmi &&
      formData.treatment
    );
  }, [formData]);

  return (
    <div className="px-4 py-5">
      <div>
        <h2 className="text-xl font-semibold">เพิ่มใบนัด</h2>
        <h3 className="text-lg font-semibold mt-3">ประวัติการรักษา</h3>

        <p className="font-semibold mt-5">
          ชื่อ - นามสกุล {patient.firstName} {patient.lastName}
          &nbsp;&nbsp; หมายเลขประจำตัวผู้ป่วย : {patient.hnId}
        </p>

        <p className="mt-1 font-semibold">
          อายุ : {patient.age} ปี {patient.month} เดือน {patient.day} วัน
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
        <div>
          <div className="mb-4 font-semibold text-md mt-5">ข้อมูลการตรวจ</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              id="disease"
              name="disease"
              label="โรคทั้งหมด"
              placeholder="เลือกโรค"
              value={formData.disease}
              onValueChange={handleSelectChange("disease")}
              options={[
                { label: "โรคเบาหวาน", value: "diabetes" },
                { label: "ความดันโลหิตสูง", value: "hypertension" },
                { label: "วัณโรค", value: "tuberculosis" },
                { label: "วัคซีนเด็ก", value: "child_vaccine" },
              ]}
            />

            <InputField
              id="examDate"
              name="examDate"
              label="วันที่ตรวจ"
              type="date"
              required
              value={formData.examDate}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
            />
            <h2 className="col-span-2 font-medium -mt-3">ผู้ตรวจ</h2>
            <div className="-mt-5">
              <SelectField
                id="doctorTitle"
                name="doctorTitle"
                label="คำนำหน้า"
                placeholder="เลือกคำนำหน้า"
                value={formData.doctorTitle}
                onValueChange={handleSelectChange("doctorTitle")}
                options={[
                  { label: "นายเเพทย์", value: "นาย" },
                  { label: "เเพทย์หญิง", value: "นาง" },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 col-span-2">
              <InputField
                id="doctorFirstName"
                name="doctorFirstName"
                label="ชื่อ"
                required
                value={formData.doctorFirstName}
                onChange={handleChange}
              />

              <InputField
                id="doctorLastName"
                name="doctorLastName"
                label="นามสกุล"
                required
                value={formData.doctorLastName}
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
            <div className="mt-3">
              <InputField
                id="pulse"
                name="pulse"
                label="ชีพจร"
                endAdornmentLabel="ครั้ง/นาที"
                required
                value={formData.pulse}
                onChange={handleChange}
              />
            </div>
            <div className="mt-3">
              <InputField
                id="pressure"
                name="pressure"
                label="ความดัน"
                endAdornmentLabel="มม.ปรอท"
                required
                value={formData.pressure}
                onChange={handleChange}
              />
            </div>
            <div className="mt-1">
              <InputField
                id="bmi"
                name="bmi"
                label="ดัชนีมวลกาย"
                endAdornmentLabel="kg/m²"
                required
                value={formData.bmi}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <InputField
          id="treatment"
          name="treatment"
          label="การรักษา"
          required
          value={formData.treatment}
          onChange={handleChange}
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
