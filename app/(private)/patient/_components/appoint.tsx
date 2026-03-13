"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Patient } from "@/app/utils/patient.mock";
import { InputField } from "@/components/inputfield";
import { SelectField } from "@/components/selectfield";
import { Button } from "@/shadcn/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/shadcn/ui/dialog";
import { StepBack, UserPlus, Check } from "lucide-react";

type AppointmentFormData = {
  purpose: string;
  appointmentDate: string;
  timeStart: string;
  timeEnd: string;
  location: string;
  doctorTitle: string;
  doctorFirstName: string;
  doctorLastName: string;
};

type Props = {
  patient: Patient;
  formData: AppointmentFormData;
  setFormData: React.Dispatch<React.SetStateAction<AppointmentFormData>>;
  onNext: () => void;
  onBack: () => void;
};

export default function AddAppoint({
  patient,
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
    if (formData.timeStart && formData.timeEnd) {
      if (formData.timeEnd <= formData.timeStart) {
        setTimeError("ไม่สามารถเลือกเวลาสิ้นสุดก่อนเวลาเริ่มต้นได้");
      } else {
        setTimeError("");
      }
    } else {
      setTimeError("");
    }
  }, [formData.timeStart, formData.timeEnd]);

  const isFormValid = useMemo(() => {
    return (
      formData.purpose &&
      formData.appointmentDate &&
      formData.timeStart &&
      formData.timeEnd &&
      !timeError &&
      formData.location &&
      formData.doctorTitle &&
      formData.doctorFirstName &&
      formData.doctorLastName
    );
  }, [formData, timeError]);

  const handleSubmit = () => {
    if (!isFormValid) return;

    setOpenSuccess(true);

    setTimeout(() => {
      setOpenSuccess(false);
      router.push("/patient");
    }, 2000);
  };

  return (
    <div className="px-6 py-6">
      <h2 className="text-xl font-semibold">เพิ่มใบนัด</h2>
      <h3 className="text-md font-semibold mt-2">เพิ่มใบนัดครั้งถัดไป</h3>

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
              id="appointmentDate"
              name="appointmentDate"
              label="นัดหมายวันที่"
              type="date"
              required
              value={formData.appointmentDate}
              onChange={handleChange}
            />

            <div>
              <div className="grid grid-cols-2 gap-3">
                <InputField
                  id="timeStart"
                  name="timeStart"
                  label="เวลา"
                  type="time"
                  required
                  value={formData.timeStart}
                  onChange={handleChange}
                  className={timeError ? "border-red-500" : ""}
                />

                <div className="mt-5">
                  <InputField
                    id="timeEnd"
                    name="timeEnd"
                    label=""
                    type="time"
                    value={formData.timeEnd}
                    onChange={handleChange}
                    className={timeError ? "border-red-500" : ""}
                  />
                </div>
              </div>

              {timeError && (
                <p className="text-red-500 text-sm mt-2">{timeError}</p>
              )}
            </div>
          </div>

          <InputField
            id="location"
            name="location"
            label="สถานที่"
            required
            value={formData.location}
            onChange={handleChange}
          />
        </div>
        <div>
          <h4 className="font-medium mb-2 -mt-8">แพทย์</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SelectField
              id="doctorTitle"
              name="doctorTitle"
              label="คำนำหน้า"
              placeholder="เลือกคำนำหน้า"
              value={formData.doctorTitle}
              onValueChange={handleSelectChange("doctorTitle")}
              options={[
                { label: "นายแพทย์", value: "นายแพทย์" },
                { label: "แพทย์หญิง", value: "แพทย์หญิง" },
              ]}
            />

            <div></div>

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
        </DialogContent>
      </Dialog>
    </div>
  );
}
