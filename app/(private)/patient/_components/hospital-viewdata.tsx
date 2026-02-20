"use client";
import { Patient } from "@/app/utils/patient.mock";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  patient: Patient;
};

export default function OfficerSection({ patient }: Props) {
  const router = useRouter();

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-8">ข้อมูลโรงพยาบาล</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-30">
        <div>
          <h3 className="font-semibold mb-2">เจ้าหน้าที่เยี่ยมบ้าน</h3>
          <p className="text-sm">
            ชื่อ - นามสกุล : {patient.officer.house.fullname}
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">เจ้าหน้าที่</h3>
          <p className="text-sm">
            ชื่อ - นามสกุล : {patient.officer.nurse.fullname}
          </p>
        </div>
      </div>

      <div className="flex justify-end mt-10">
        <button
          onClick={() => router.push(`/patient/${patient.id}/edit/officer`)}
          className="flex items-center gap-2 px-4 py-2 
          border-2 border-Bamboo-100 text-Bamboo-100
          rounded-lg font-semibold
          hover:bg-Bamboo-100 hover:text-white transition"
        >
          แก้ไขข้อมูล
          <Pencil size={16} />
        </button>
      </div>
    </div>
  );
}
