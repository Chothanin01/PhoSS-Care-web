"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ProgressNav } from "@/components/progress-nav";
import { ProgressNavItem } from "@/components/progress-nav-item";
import HistoryPatient from "@/app/(private)/patient/_components/medical-history";
import AddAppoint from "@/app/(private)/patient/_components/appoint";
import VaccineHistory from "@/app/(private)/patient/_components/vaccine-history";
import AddVaccineAppoint from "@/app/(private)/patient/_components/appoint-vaccine";
import { FileText, FileCheckCorner } from "lucide-react";
import Cookies from "js-cookie";

const VACCINE_ID = "ac6ba29e-75cf-414c-a599-0e3650b3f94e";

export default function Page() {
  const params = useParams();
  const patientId = params?.id as string;

  const [step, setStep] = useState(0);
  const [isVaccine, setIsVaccine] = useState(false);
  const [oldVaccineId, setOldVaccineId] = useState<string | null>(null);

  useEffect(() => {
    const checkPatientDisease = async () => {
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

        const diseases = Array.isArray(data?.data) ? data.data : [];

        const hasVaccine = diseases.some(
          (d: any) => d.disease_id === VACCINE_ID
        );

        setIsVaccine(hasVaccine);
      } catch (error) {
        console.error("check disease error:", error);
      }
    };

    if (patientId) checkPatientDisease();
  }, [patientId]);

  useEffect(() => {
  const fetchVaccinationRecord = async () => {
    try {
      const token = Cookies.get("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/appointments/${patientId}/vaccination`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      const records = Array.isArray(data?.data) ? data.data : [];

      if (records.length > 0) {
        const last = records[records.length - 1];

        setOldVaccineId(last.id);

        setVaccineHistoryData((prev) => ({
          ...prev,
          vaccine_id: last.vaccine_id, 
          old_vaccine_id: last.id,     
          dose_number: last.dose_number + 1,
          next_dose_number: last.dose_number + 2,
        }));
      }
    } catch (error) {
      console.error("fetch vaccination record error:", error);
    }
  };

  if (patientId) fetchVaccinationRecord();
}, [patientId]);

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

  const [vaccineHistoryData, setVaccineHistoryData] = useState({
    vaccine_id: "",
    old_vaccine_id: "",
    dose_number: 1,
    next_dose_number: 2,
    vaccine_doctor_title: "",
    vaccine_doctor_firstname: "",
    vaccine_doctor_lastname: "",
    doctor_title: "",
    doctor_firstname: "",
    doctor_lastname: "",
    place: "",
    date: "",
    time_start: "",
    time_end: "",
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

  const [vaccineAppointData, setVaccineAppointData] = useState({
    vaccine_id: "",
    old_vaccine_id: "",
    dose_number: 1,
    next_dose_number: 2,
    vaccine_doctor_title: "",
    vaccine_doctor_firstname: "",
    vaccine_doctor_lastname: "",
    doctor_title: "",
    doctor_firstname: "",
    doctor_lastname: "",
    place: "",
    date: "",
    time_start: "",
    time_end: "",
  });

  const handleNext = () => {
    setStep(1);
  };

  const handleBack = () => setStep(0);
  const handleSubmit = async (): Promise<boolean> => {
    try {
      const token = Cookies.get("token");

      if (!token) {
        alert("กรุณา login ใหม่");
        return false;
      }

      let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/appointments`;
      let body: any = {};

      if (isVaccine) {
        apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/appointments/vaccine`;

        body = {
          patient_id: patientId,
          vaccine_id: vaccineHistoryData.vaccine_id,
          old_vaccine_id: vaccineHistoryData.vaccine_id,
          dose_number: vaccineHistoryData.dose_number,
          next_dose_number: vaccineHistoryData.next_dose_number,
          vaccine_doctor_title: vaccineHistoryData.vaccine_doctor_title,
          vaccine_doctor_firstname: vaccineHistoryData.vaccine_doctor_firstname,
          vaccine_doctor_lastname: vaccineHistoryData.vaccine_doctor_lastname,
          doctor_title: vaccineAppointData.doctor_title,
          doctor_firstname: vaccineAppointData.doctor_firstname,
          doctor_lastname: vaccineAppointData.doctor_lastname,
          place: vaccineAppointData.place,
          date: vaccineAppointData.date,
          start_time: vaccineAppointData.time_start,
          end_time: vaccineAppointData.time_end,
        };

        if (oldVaccineId && vaccineHistoryData.dose_number > 1) {
          body.old_vaccine_id = oldVaccineId;
        }
      } else {
        const weight = parseFloat(historyData.weight);
        const height = parseFloat(historyData.height);
        const pulse = parseInt(historyData.pulse);

        const bmi =
          height > 0 ? Number((weight / ((height / 100) ** 2)).toFixed(2)) : 0;

        body = {
          patient_id: patientId,
          disease_id: historyData.disease,
          doctor_title: historyData.doctor_title,
          doctor_firstname: historyData.doctor_firstname || "-",
          doctor_lastname: historyData.doctor_lastname || "-",
          next_doctor_title: appointData.next_doctor_title,
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
      }

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

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

        {step === 0 &&
          (isVaccine ? (
            <VaccineHistory
              formData={vaccineHistoryData}
              setFormData={setVaccineHistoryData}
              onNext={handleNext}
            />
          ) : (
            <HistoryPatient
              formData={historyData}
              setFormData={setHistoryData}
              onNext={handleNext}
            />
          ))}

        {step === 1 &&
          (isVaccine ? (
            <AddVaccineAppoint
              formData={vaccineAppointData}
              setFormData={setVaccineAppointData}
              onNext={handleSubmit}
              onBack={handleBack}
            />
          ) : (
            <AddAppoint
              formData={appointData}
              setFormData={setAppointData}
              onNext={handleSubmit}
              onBack={handleBack}
            />
          ))}
      </div>
    </div>
  );
}