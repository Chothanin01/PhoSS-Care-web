"use client";

import { useMemo } from "react";
import { InputField } from "@/components/inputfield";
import { SelectField } from "@/components/selectfield";
import { Button } from "@/shadcn/ui/button";
import { StepForward } from "lucide-react";

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
              options={[
                { label: "โรคเบาหวาน", value: "diabetes" },
                { label: "ความดันโลหิตสูง", value: "hypertension" },
                { label: "วัณโรค", value: "tuberculosis" },
                { label: "วัคซีนเด็ก", value: "child_vaccine" },
              ]}
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
                options={[
                  { label: "นายแพทย์", value: "Dr." },
                  { label: "แพทย์หญิง", value: "Dr." },
                ]}
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

            <div className="mt-3"> <InputField id="pulse" name="pulse" label="ชีพจร" endAdornmentLabel="ครั้ง/นาที" required value={formData.pulse} onChange={handleChange} /> </div>

            <div className="mt-3"> <InputField id="pressure" name="pressure" label="ความดัน" endAdornmentLabel="มม.ปรอท" required value={formData.pressure} onChange={handleChange} /> </div>
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
            <div className="mt-1">
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
      </div>

      <div className="mt-8 w-full">
        <label className="block mb-2 text-sm font-medium">
          การรักษา
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