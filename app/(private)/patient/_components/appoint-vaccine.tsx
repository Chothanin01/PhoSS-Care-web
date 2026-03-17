"use client";

import { useState, useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

import { InputField } from "@/components/inputfield";
import { SelectField } from "@/components/selectfield";
import { Button } from "@/shadcn/ui/button";

import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/shadcn/ui/dialog";

import { StepBack, UserPlus, Check } from "lucide-react";

type VaccineData = {
  vaccine_id: string;
  type: string;
  effect: string;
  note: string;
  name: string;
};

type VaccineFormData = {
  vaccine_id: string;
  old_vaccine_id: string;

  dose_number: number;
  next_dose_number: number;

  vaccine_doctor_title: string;
  vaccine_doctor_firstname: string;
  vaccine_doctor_lastname: string;

  doctor_title: string;
  doctor_firstname: string;
  doctor_lastname: string;

  place: string;
  date: string;
  time_start: string;
  time_end: string;
};

type Props = {
  formData: VaccineFormData;
  setFormData: React.Dispatch<React.SetStateAction<VaccineFormData>>;
  onNext: () => Promise<boolean>;
  onBack: () => void;
};

const DOCTOR_TITLES = [
  { label: "นายแพทย์", value: "นายแพทย์" },
  { label: "แพทย์หญิง", value: "แพทย์หญิง" },
];

export default function AddVaccineAppoint({
  formData,
  setFormData,
  onNext,
  onBack,
}: Props) {

  const router = useRouter();
  const [openSuccess, setOpenSuccess] = useState(false);
  const [vaccineList, setVaccineList] = useState<VaccineData[]>([]);
  const [vaccineOptions, setVaccineOptions] = useState<any[]>([]);
  const [selectedVaccine, setSelectedVaccine] = useState<VaccineData | null>(null);
  const [timeError, setTimeError] = useState("");

  useEffect(() => {
    const fetchVaccines = async () => {
      const token = Cookies.get("token");
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/diseases/vaccines`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      const list = data?.data || [];
      setVaccineList(list);

      const options = list.map((v: VaccineData) => ({
        label: v.type,
        value: v.vaccine_id,
      }));

      setVaccineOptions(options);
    };

    fetchVaccines();

  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (updated.time_start && updated.time_end) {
        if (updated.time_end <= updated.time_start) {
          setTimeError("เวลาสิ้นสุดต้องมากกว่าเวลาเริ่ม");
        } else {
          setTimeError("");
        }
      }
      return updated;
    });
  };

  const handleSelectChange = (value: string) => {
    const vaccine = vaccineList.find((v) => v.vaccine_id === value);

    if (vaccine) {
      setSelectedVaccine(vaccine);
      setFormData((prev) => ({
        ...prev,
        vaccine_id: vaccine.vaccine_id,
        old_vaccine_id: vaccine.vaccine_id,
      }));

    }

  };
  const isFormValid = useMemo(() => {
    return (
      formData.vaccine_id &&
      formData.place &&
      formData.date &&
      formData.time_start &&
      formData.time_end &&
      !timeError &&
      formData.doctor_title &&
      formData.doctor_firstname &&
      formData.doctor_lastname
    );

  }, [formData, timeError]);

  const handleCreate = async () => {

    const success = await onNext();
    if (success) {
      setOpenSuccess(true);
      setTimeout(() => {
        router.push("/patient");
      }, 3000);
    }
  };

  return (

    <div className="px-6 py-6">
      <h2 className="text-xl font-semibold">เพิ่มใบนัด</h2>
      <h3 className="text-lg font-semibold mt-2">เพิ่มใบนัดครั้งถัดไป</h3>
      <div className="grid grid-cols-2 gap-20 mt-5">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-6">
            <SelectField
              id="vaccine_id"
              label="ชนิดวัคซีน"
              placeholder="เลือกวัคซีน"
              required
              value={formData.vaccine_id}
              onValueChange={handleSelectChange}
              options={vaccineOptions}
              name="vaccine_id"
            />
            <InputField
              id="vaccine_name"
              label="ชื่อวัคซีน"
              value={selectedVaccine?.name || ""}
              readOnly
              name="vaccine_name"
              className="text-black"
            />
            <InputField
              id="date"
              label="วันที่นัด"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split("T")[0]}
            />
            <div>
              <div className="grid grid-cols-2 gap-1">
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
            <InputField
              id="place"
              label="สถานที่"
              name="place"
              required
              value={formData.place}
              onChange={handleChange}
            />
            <InputField
              id="effect"
              label="ผลข้างเคียง"
              value={selectedVaccine?.effect || ""}
              readOnly
              name=""
              className="text-black"
            />
          </div>
          <div className="mt-3 w-full">
            <label className="block mb-2 text-sm font-medium text-gray-500">
              คำแนะนำ
            </label>
            <textarea
              name="note"
              value={selectedVaccine?.note || ""}
              readOnly
              rows={4}
              className="w-full border rounded-md px-4 py-3 focus:outline-none resize-none"
            />
          </div>
        </div>
        <div className="-mt-6">
          <h4 className="font-medium">แพทย์</h4>
          <div className="grid grid-cols-2 gap-6">
            <SelectField
              id="doctor_title"
              label="คำนำหน้า"
              required
              placeholder="เลือกคำนำหน้า"
              value={formData.doctor_title}
              onValueChange={(v) =>
                setFormData((prev) => ({ ...prev, doctor_title: v }))
              }
              options={DOCTOR_TITLES}
              name="doctor_title"
            />
            <div />
            <InputField
              id="doctor_firstname"
              label="ชื่อ"
              required
              name="doctor_firstname"
              value={formData.doctor_firstname}
              onChange={handleChange}
            />
            <InputField
              id="doctor_lastname"
              label="นามสกุล"
              required
              name="doctor_lastname"
              value={formData.doctor_lastname}
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
            onClick={handleCreate}
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
          <DialogTitle />
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