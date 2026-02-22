"use client";
import { Patient } from "@/app/utils/patient.mock";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  patient: Patient;
};

export default function AppointmentCard({ patient }: Props) {
  const router = useRouter();
  const diseaseWithHistory = patient.diseases?.find(
    (d) =>
      "history" in d &&
      Array.isArray((d as any).history) &&
      (d as any).history.length > 0
  );

  const latestHistory =
    diseaseWithHistory && "history" in diseaseWithHistory
      ? (diseaseWithHistory as any).history[
          (diseaseWithHistory as any).history.length - 1
        ]
      : undefined;

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold mb-6">ใบนัดแพทย์</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        <div>
          <h2 className="font-semibold mb-2">ข้อมูลใบนัดแพทย์ล่าสุด</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 md:gap-x-20 text-sm">
            <p>
              ชื่อ - นามสกุล : {patient.firstName} {patient.lastName}
            </p>

            <p>
              อายุ : {patient.age} ปี {patient.month} เดือน {patient.day} วัน
            </p>
            <p>HN : {patient.hnId}</p>

            <p>สถานที่ : {patient.location}</p>

            {latestHistory?.nextDaysAppointment ? (
              <p className="md:col-span-2">
                นัดครั้งถัดไป : วันที่ {latestHistory.nextDaysAppointment} เดือน{" "}
                {latestHistory.nextMonthAppointment} ปี{" "}
                {latestHistory.nextyearAppointment}
              </p>
            ) : (
              <p className="text-gray-400 md:col-span-2">
                ไม่มีใบนัดครั้งถัดไป
              </p>
            )}
          </div>
          <div className="mt-3 text-sm">
            <p>นัดเพื่อ : {patient.purpostAppointment}</p>
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-4">ผู้นัด</h2>

          <div className="text-sm space-y-2">
            <p>ชื่อ - นามสกุล : {patient.officer.nurse.fullname}</p>

            <h2 className="font-semibold mt-4">แพทย์</h2>
            <p>ชื่อ - นามสกุล : {patient.relative.medicine.fullname}</p>
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
