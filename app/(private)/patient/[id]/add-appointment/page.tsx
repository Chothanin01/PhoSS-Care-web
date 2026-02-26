"use client";

import { useState } from "react";
import { ProgressNav } from "@/components/progress-nav";
import { ProgressNavItem } from "@/components/progress-nav-item";
import HistoryPatient from "@/app/(private)/patient/_components/medical-history";
import AddAppoint from "@/app/(private)/patient/_components/add-appoint";
import { FileText, FileCheckCorner } from "lucide-react";
import { mockPatients } from "@/app/utils/patient.mock";

export default function Page() {
  const [step, setStep] = useState(0);
  const patient = mockPatients[0];

  // ✅ เพิ่ม historyData
  const [historyData, setHistoryData] = useState({
    examDate: "",
    visitNo: "",
    weight: "",
    height: "",
    pulse: "",
    pressure: "",
    bmi: "",
    status: "",
    treatment: "",
    doctorTitle: "",
    doctorFirstName: "",
    doctorLastName: "",
    disease: "",
  });

  // ใบนัด
  const [appointData, setAppointData] = useState({
    purpose: "",
    appointmentDate: "",
    timeStart: "",
    timeEnd: "",
    location: "",
    doctorTitle: "",
    doctorFirstName: "",
    doctorLastName: "",
  });

  const handleNext = () => {
    setStep((prev) => Math.min(prev + 1, 1));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 0));
  };

  if (!patient) return <div>ไม่พบข้อมูลผู้ป่วย</div>;

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
            patient={patient}
            formData={historyData}
            setFormData={setHistoryData}
            onNext={handleNext}
          />
        )}

        {step === 1 && (
          <AddAppoint
            patient={patient}
            formData={appointData}
            setFormData={setAppointData}
            onNext={() => console.log("submit data:", appointData)}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}
