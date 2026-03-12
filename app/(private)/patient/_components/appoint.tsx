"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { InputField } from "@/components/inputfield";
import { SelectField } from "@/components/selectfield";
import { Button } from "@/shadcn/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/shadcn/ui/dialog";
import { StepBack, UserPlus, Check } from "lucide-react";

type AppointmentFormData = {
  purpose: string;
  date: string;
  time_start: string;
  time_end: string;
  place: string;
  next_doctor_title: string;
  next_doctor_firstname: string;
  next_doctor_lastname: string;
};

type Props = {
  formData: AppointmentFormData;
  setFormData: React.Dispatch<React.SetStateAction<AppointmentFormData>>;
  onNext: () => Promise<boolean>;
  onBack: () => void;
};

export default function AddAppoint({
  formData,
  setFormData,
  onNext,
  onBack,
}: Props) {
  const router = useRouter();
  const [openSuccess, setOpenSuccess] = useState(false);
  const [timeError, setTimeError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange =
    (field: keyof AppointmentFormData) => (value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    };

  useEffect(() => {
    if (formData.time_start && formData.time_end) {
      if (formData.time_end <= formData.time_start) {
        setTimeError("ไม่สามารถเลือกเวลาสิ้นสุดก่อนเวลาเริ่มต้นได้");
      } else {
        setTimeError("");
      }
    } else {
      setTimeError("");
    }
  }, [formData.time_start, formData.time_end]);
  useEffect(() => {
    if (openSuccess) {
      const timer = setTimeout(() => {
        router.push("/patient");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [openSuccess, router]);

  const isFormValid = useMemo(() => {
    return (
      formData.purpose !== "" &&
      formData.date !== "" &&
      formData.time_start !== "" &&
      formData.time_end !== "" &&
      formData.place !== "" &&
      formData.next_doctor_title !== "" &&
      formData.next_doctor_firstname !== "" &&
      formData.next_doctor_lastname !== "" &&
      !timeError
    );
  }, [formData, timeError]);

  const handleSubmit = async () => {
    if (!isFormValid) return;

    const success = await onNext();

    if (success) {
      setOpenSuccess(true);
    }
  };

  return (
    <div className="px-6 py-6">
      <h2 className="text-xl font-semibold">เพิ่มใบนัด</h2>
      <h3 className="text-md font-semibold mt-2">
        เพิ่มใบนัดครั้งถัดไป
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mt-5">
        <div className="space-y-6">
          <InputField
            id="purpose"
            name="purpose"
            label="นัดเพื่อ"
            required
            value={formData.purpose}
            onChange={handleChange}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              id="date"
              name="date"
              label="นัดหมายวันที่"
              type="date"
              required
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
            />

            <div>
              <div className="grid grid-cols-2 gap-3">
                <InputField
                  id="time_start"
                  name="time_start"
                  label="เวลา"
                  type="time"
                  required
                  value={formData.time_start}
                  onChange={handleChange}
                  className={timeError ? "border-red-500" : ""}
                />

                <div className="mt-5">
                  <InputField id="time_end" name="time_end" type="time" value={formData.time_end} onChange={handleChange} className={timeError ? "border-red-500" : ""} />
                </div>
              </div>

              {timeError && (
                <p className="text-red-500 text-sm mt-2">
                  {timeError}
                </p>
              )}
            </div>

            <InputField
              id="place"
              name="place"
              label="สถานที่"
              required
              value={formData.place}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2 -mt-8">
            แพทย์
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              id="doctor_title"
              name="doctor_title"
              label="คำนำหน้า"
              placeholder="เลือกคำนำหน้า"
              value={formData.next_doctor_title}
              onValueChange={handleSelectChange("next_doctor_title")}
              options={[
                { label: "นายแพทย์", value: "นายเเพทย์" },
                { label: "แพทย์หญิง", value: "เเพทย์หญิง" },
              ]}
            />

            <div></div>

            <InputField
              id="doctor_firstname"
              name="doctor_firstname"
              label="ชื่อ"
              required
              value={formData.next_doctor_firstname}
              onChange={handleChange}
            />

            <InputField
              id="doctor_lastname"
              name="doctor_lastname"
              label="นามสกุล"
              required
              value={formData.next_doctor_lastname}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 mt-8">
        <div className="flex justify-start">
          <Button
            onClick={onBack}
            className="text-Bamboo-100 bg-white border-2 border-Bamboo-100 font-semibold hover:bg-gray-200"
          >
            <StepBack />
            ย้อนกลับ
          </Button>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="text-Bamboo-100 bg-white border-2 border-Bamboo-100 font-semibold hover:bg-gray-200 disabled:opacity-50"
          >
            สร้าง
            <UserPlus className="ml-2" />
          </Button>
        </div>
      </div>

      <Dialog open={openSuccess}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-md text-center"
        >
          <DialogTitle></DialogTitle>

          <div className="flex justify-center mb-6 mt-4">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#b2e0a6]">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-Bamboo-400">
                <Check className="w-8 h-8 text-white" strokeWidth={3} />
              </div>
            </div>
          </div>

          <p className="text-lg font-semibold">
            ระบบได้สร้างใบนัดเรียบร้อยแล้ว
          </p>

          <p className="text-sm text-gray-500 mt-2">
            กำลังกลับไปหน้าผู้ป่วยใน 3 วินาที...
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}