"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { InputField } from "@/components/inputfield";
import { SelectField } from "@/components/selectfield";
import { Button } from "@/shadcn/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/shadcn/ui/dialog";
import { StepBack, UserPlus, Check } from "lucide-react";
import { fetchWithRefresh } from "@/lib/api";

type AppointmentFormData = {
  purpose: string;
  date: string;
  time_start: string;
  time_end: string;
  place: string;
  next_doctor_id: string;
  prepare: string;
};

type Props = {
  formData: AppointmentFormData;
  setFormData: React.Dispatch<React.SetStateAction<AppointmentFormData>>;
  onNext: () => Promise<boolean> | void;
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
  const [doctorOptions, setDoctorOptions] = useState<{ label: string; value: string }[]>([])

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetchWithRefresh(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/appointments/doctors?role=doctor`
        )

        const data = await res.json()

        const options = (data.data || []).map((doctor: any) => ({
          label: doctor.fullname,
          value: doctor.id,
        }))

        setDoctorOptions(options)

      } catch (err) {
        console.error("fetch doctors error:", err)
      }
    }

    fetchDoctors()
  }, [])

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

  const timeError = useMemo(() => {
    if (formData.time_start && formData.time_end) {
      if (formData.time_end <= formData.time_start) {
        return "ไม่สามารถเลือกเวลาสิ้นสุดก่อนเวลาเริ่มต้นได้";
      }
    }
    return "";
  }, [formData.time_start, formData.time_end]);

  const isFormValid = useMemo(() => {
    return (
      formData.purpose &&
      formData.date &&
      formData.time_start &&
      formData.time_end &&
      !timeError &&
      formData.place &&
      formData.next_doctor_id &&
      formData.prepare
    );
  }, [formData, timeError]);

  const handleSubmit = async () => {
    if (!isFormValid) return;

    const success = await onNext();

    if (success) {
      setOpenSuccess(true);

      setTimeout(() => {
        setOpenSuccess(false);
        router.push("/patient");
      }, 2000);
    }
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
            value={formData.purpose || ""}
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
                  <InputField
                    id="time_end"
                    name="time_end"
                    label=""
                    type="time"
                    value={formData.time_end}
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
            id="place"
            name="place"
            label="สถานที่"
            required
            value={formData.place || ""}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-6">
          <h4 className="font-medium mb-2 -mt-8">แพทย์</h4>
          <div className="grid grid-cols-2">
            <SelectField
              id="next_doctor_id"
              name="next_doctor_id"
              label="ชื่อแพทย์"
              placeholder="เลือกแพทย์"
              value={formData.next_doctor_id}
              onValueChange={handleSelectChange("next_doctor_id")}
              options={doctorOptions}
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-muted-foreground">
              การเตรียมตัวก่อนพบแพทย์ <span className="text-red-500">*</span>
            </label>

            <textarea
              id="prepare"
              name="prepare"
              rows={4}
              value={formData.prepare || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  prepare: e.target.value,
                }))
              }
              className="w-full border rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-300 resize-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-8">
        <Button
          onClick={onBack}
          className="text-Bamboo-100 bg-white border-2 border-Bamboo-100 font-semibold hover:bg-gray-200"
        >
          <StepBack />
          ย้อนกลับ
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={!isFormValid}
          className="text-Bamboo-100 bg-white border-2 border-Bamboo-100 font-semibold hover:bg-gray-200 disabled:opacity-50"
        >
          สร้าง
          <UserPlus className="ml-2" />
        </Button>
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