"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ProgressNav } from "@/components/progress-nav";
import { ProgressNavItem } from "@/components/progress-nav-item";
import HistoryPatient from "@/app/(private)/patient/_components/medical-history";
import AddAppoint from "@/app/(private)/patient/_components/appoint";
import { FileText, FileCheckCorner } from "lucide-react";

export default function Page() {

  const params = useParams();
  const patientId = params?.id;

  const [step, setStep] = useState(0);

  const [historyData, setHistoryData] = useState({
    exam_date: "",
    visit_no: "",
    weight: "",
    height: "",
    pulse: "",
    pressure: "",
    bmi: "",
    symptom: "",
    status: "",
    treatment: "",
    doctor_title: "",
    doctor_firstname: "",
    doctor_lastname: "",
    disease: "",
  });

  const [appointData, setAppointData] = useState({
    purpose: "",
    date: "",
    time_start: "",
    time_end: "",
    place: "",
    doctor_title: "",
    doctor_firstname: "",
    doctor_lastname: "",
  });

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 1));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    try {

      const token = localStorage.getItem("token");

      const body = {
        patient_id: patientId,
        disease_id: historyData.disease,
        doctor_title: historyData.doctor_title,
        doctor_firstname: historyData.doctor_firstname,
        doctor_lastname: historyData.doctor_lastname,
        symptom: historyData.symptom,
        note: historyData.treatment,
        place: appointData.place,
        time: `${appointData.time_start} - ${appointData.time_end}`,
        date: appointData.date,
        purpose: appointData.purpose,
        health: {
          weight: Number(historyData.weight),
          height: Number(historyData.height),
          pulse: Number(historyData.pulse),
          sugar: 0,
          bmi: Number(historyData.bmi),
        },
      };

      console.log("Sending API:", body);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/appointments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      console.log("API Response:", data);

      if (!res.ok) {
        throw new Error(data.message || "Create appointment failed");
      }

      alert("สร้างใบนัดสำเร็จ");

      setStep(0);

    } catch (error) {
      console.error("API Error:", error);
      alert("เกิดข้อผิดพลาดในการสร้างใบนัด");
    }
  };

  return (
    <div className="py-2">
      <div className="w-full bg-white p-6 rounded-lg shadow">
        <div className="mb-6">
          <ProgressNav withChevron>
            <ProgressNavItem
              icon={FileText}
              completedIcon={FileCheckCorner}
              label="ประวัติการรักษา"
              isActive={step === 0}
              isCompleted={step > 0}
            />
            <ProgressNavItem
              icon={FileText}
              completedIcon={FileCheckCorner}
              label="เพิ่มใบนัด"
              isActive={step === 1}
              isCompleted={step > 1}
            />
          </ProgressNav>
        </div>
        <div className="border-t border-gray-300 mb-6"></div>
        {step === 0 && (
          <HistoryPatient
            formData={historyData}
            setFormData={setHistoryData}
            onNext={handleNext}
          />
        )}
        {step === 1 && (
          <AddAppoint
            formData={appointData}
            setFormData={setAppointData}
            onNext={handleSubmit}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}