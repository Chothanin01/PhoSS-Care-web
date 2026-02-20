"use client";

import { useParams } from "next/navigation";
import PatientCard from "@/app/(private)/patient/_components/patient-viewdata";
import RelativeSection from "@/app/(private)/patient/_components/relative-viewdata";
import OfficerSection from "@/app/(private)/patient/_components/hospital-viewdata";
import { mockPatients } from "@/app/utils/patient.mock";

export default function Page() {
  const params = useParams();
  const id = Number(params.id);

  const patient = mockPatients.find((p) => p.id === id);

  if (!patient) {
    return (
      <div className="ml-70 px-6 py-28">
        <div className="w-full bg-white p-6 rounded-lg shadow">
          ไม่พบข้อมูลผู้ป่วย
        </div>
      </div>
    );
  }

  return (
    <div className="ml-70 px-6 py-28 space-y-3">
      <div className="w-full bg-white p-6 rounded-lg shadow ">
        <PatientCard patient={patient} />
      </div>
      <div className="w-full bg-white p-6 rounded-lg shadow">
        <RelativeSection patient={patient} />
      </div>
      <div className="w-full bg-white p-6 rounded-lg shadow">
        <OfficerSection patient={patient} />
      </div>
    </div>
  );
}
