"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams  } from "next/navigation";
import { ProgressNav } from "@/components/progress-nav";
import { ProgressNavItem } from "@/components/progress-nav-item";
import HistoryPatient from "@/app/(private)/patient/_components/medical-history";
import AddAppoint from "@/app/(private)/patient/_components/appoint";
import VaccineHistory from "@/app/(private)/patient/_components/vaccine-history";
import AddVaccineAppoint from "@/app/(private)/patient/_components/appoint-vaccine";
import { FileText, FileCheckCorner } from "lucide-react";
import { fetchWithRefresh } from "@/lib/api";

export default function Page() {
  const params = useParams();
  const searchParams = useSearchParams();
  const patientId = params?.id as string;

  const [step, setStep] = useState(0);

  const isVaccine = searchParams.get("vaccine") === "true";

  useEffect(() => { if (!patientId || !isVaccine) return;

    const fetchVaccinationRecord = async () => {
      try {

        const res = await fetchWithRefresh(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/appointments/${patientId}/vaccination`,
        );

        const data = await res.json();
        const record = data?.data;

        if (record) {

          setVaccineHistoryData((prev) => ({
            ...prev,
            vaccine_id: record.vaccine_id,
            old_vaccine_id: record.id,
            dose_number: record.dose_number + 1,
            next_dose_number: record.dose_number + 2,
          }));
        }

      } catch (error) {
        console.error("fetch vaccination record error:", error);
      }
    };

    fetchVaccinationRecord();
  }, [patientId, isVaccine]);

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
    doctor_id: "",
    disease: "",
    old_appoint_id: "",
    sugar: "",
  });

  const [appointData, setAppointData] = useState({
    purpose: "",
    date: "",
    time_start: "",
    time_end: "",
    place: "",
    next_doctor_id: "",
    prepare: "",
  });

  const [vaccineHistoryData, setVaccineHistoryData] = useState({
    vaccine_id: "",
    old_vaccine_id: "",
    dose_number: 1,
    next_dose_number: 2,
    vaccine_doctor_id: "",
    doctor_id: "",
    place: "",
    date: "",
    time_start: "",
    time_end: "",
  });

  const [vaccineAppointData, setVaccineAppointData] = useState({
    vaccine_id: "",
    old_vaccine_id: "",
    dose_number: 1,
    next_dose_number: 2,
    vaccine_doctor_id: "",
    doctor_id: "",
    place: "",
    date: "",
    time_start: "",
    time_end: "",
  });

  const handleNext = () => setStep(1);
  const handleBack = () => setStep(0);

  const handleSubmit = async () => {
    try {

      let apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/appointments`;
      let body: any = {};

      if (isVaccine) {
        apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/appointments/vaccine`;

        body = {
          patient_id: patientId,
          vaccine_id: vaccineHistoryData.vaccine_id,
          old_vaccine_id: vaccineHistoryData.vaccine_id,
          dose_number: vaccineHistoryData.dose_number,
          vaccine_doctor_id:
            vaccineHistoryData.vaccine_doctor_id,
          doctor_id:
            vaccineAppointData.doctor_id,
          place: vaccineAppointData.place,
          date: vaccineHistoryData.date,
          next_date: vaccineAppointData.date,
          start_time: vaccineAppointData.time_start,
          end_time: vaccineAppointData.time_end,
        };
      } else {
        const weight = parseFloat(historyData.weight);
        const height = parseFloat(historyData.height);
        const pulse = parseInt(historyData.pulse);
        const bmi = parseFloat(historyData.bmi);
        const sugar = parseInt(historyData.sugar);

        body = {
          patient_id: patientId,
          disease_id: historyData.disease,
          old_appoint_id: historyData.old_appoint_id || null,
          doctor_id: historyData.doctor_id,
          old_date: historyData.exam_date,
          next_doctor_id: appointData.next_doctor_id,
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
            bmi: bmi || 0,
            pulse: pulse || 0,
            sugar: sugar || 0,
            pressure: parseInt(historyData.pressure) || 0,
          },
          prepare: appointData.prepare || "-",
        };
      }

      const res = await fetchWithRefresh(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Create appointment failed");
      
      return true;
    } catch (error) {
      console.error(error);
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