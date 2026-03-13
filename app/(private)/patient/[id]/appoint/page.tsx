"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ProgressNav } from "@/components/progress-nav";
import { ProgressNavItem } from "@/components/progress-nav-item";
import HistoryPatient from "@/app/(private)/patient/_components/medical-history";
import AddAppoint from "@/app/(private)/patient/_components/appoint";
import { FileText, FileCheckCorner } from "lucide-react";
import Cookies from "js-cookie";

export default function Page() {
  const params = useParams();
  const patientId = params?.id as string;

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
    next_doctor_title: "",
    next_doctor_firstname: "",
    next_doctor_lastname: "",
  });

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 1));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const mapDoctorTitle = (title: string) => {
    if (title === "นายแพทย์") return "Dr.";
    if (title === "แพทย์หญิง") return "Dr.";
    return title;
  };

  const handleSubmit = async (): Promise<boolean> => {
    try {
      const token = Cookies.get("token");

      if (!token) {
        alert("กรุณา login ใหม่");
        return false;
      }

      if (!patientId) {
        alert("ไม่พบ patient id");
        return false;
      }

      if (!historyData.disease) {
        alert("กรุณาเลือกโรค");
        return false;
      }

      const weight = parseFloat(historyData.weight);
      const height = parseFloat(historyData.height);
      const pulse = parseInt(historyData.pulse);
      const bmi =
        height > 0 ? Number((weight / ((height / 100) ** 2)).toFixed(2)) : 0;
      const body = {
        patient_id: patientId,
        disease_id: historyData.disease,
        doctor_title: mapDoctorTitle(historyData.doctor_title),
        doctor_firstname: historyData.doctor_firstname || "-",
        doctor_lastname: historyData.doctor_lastname || "-",
        next_doctor_title: mapDoctorTitle(appointData.next_doctor_title),
        next_doctor_firstname: appointData.next_doctor_firstname || "-",
        next_doctor_lastname: appointData.next_doctor_lastname || "-",
        purpose: appointData.purpose || "-",
        place: appointData.place || "-",
        date: appointData.date,
        start_time: appointData.time_start,
        end_time: appointData.time_end,
        symptom: historyData.symptom || "-",
        note: historyData.treatment || "-",
        health: {
          weight: weight || 0,
          height: height || 0,
          bmi,
          pulse: pulse || 0,
          sugar: 0,
        },
      };

      console.log("Sending API Body:", JSON.stringify(body, null, 2));

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
      return true;
    } catch (error) {
      console.error("API Error:", error);
      alert("เกิดข้อผิดพลาดในการสร้างใบนัด");
      return false;
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