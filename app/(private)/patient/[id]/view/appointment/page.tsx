"use client";

import { useParams } from "next/navigation";
import Appointment from "@/app/(private)/patient/_components/appointment-viewdata";
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
      <div className="w-[1200px] bg-white p-6 rounded-lg shadow ">
        <Appointment patient={patient} />
      </div>
    </div>
  );
}
