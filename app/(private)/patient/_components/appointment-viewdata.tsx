"use client";
import { Patient, Gender } from "@/app/utils/patient.mock";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  patient: Patient;
};

export default function AppointmentCard({ patient }: Props) {
  const router = useRouter();
  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold mb-6">ใบนัดเเพดทย์</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-30">
        <div>
          <h2 className="font-semibold mb-2">ข้อมูลใบนัดเเพทย์ล่าสุด</h2>

          <div className="space-y-2 text-sm">
            <p>
              ชื่อ - นามสกุล : {patient.firstName} {patient.lastName}
            </p>

            <p>
              อายุ : {patient.age} ปี {patient.month} เดือน {patient.day} วัน
            </p>

            <p>HN : {patient.hnId}</p>
            <p>สถานที่ : {patient.location} </p>
            <p>
              วันที่นัด : วันที่ {patient.day} เดือน {patient.month} ปี{" "}
              {patient.year}
            </p>
          </div>
        </div>
        <div className="">
          <h2 className=" font-semibold mb-4">ผู้นัด</h2>

          <div className="gap-x-20 text-sm gap-y-2">
            <p className="text-sm">
              ชื่อ - นามสกุล : {patient.officer.nurse.fullname}
            </p>
            <h2 className="font-semibold mb-4 mt-4">เเพทย์</h2>
            <p className="text-sm">
              ชื่อ - นามสกุล : {patient.relative.medicine.fullname}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={() => router.push(`/patient/${patient.id}/edit/patient`)}
          className="flex items-center gap-2 px-4 py-2 text-Bamboo-100 bg-white border-2 border-Bamboo-100 font-semibold rounded-lg hover:bg-Bamboo-100 hover:text-white"
        >
          แก้ไขข้อมูล
          <Pencil size={16} />
        </button>
      </div>
    </div>
  );
}
