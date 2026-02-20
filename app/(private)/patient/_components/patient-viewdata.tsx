"use client";
import { Patient, Gender } from "@/app/utils/patient.mock";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  patient: Patient;
};

export default function PatientCard({ patient }: Props) {
  const router = useRouter();
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">ข้อมูลผู้ป่วย</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-80">
        <div>
          <h2 className="text-lg font-semibold mb-4">ข้อมูลส่วนตัว</h2>

          <div className="flex items-center gap-6 mb-4 ">
            <label className="flex items-center gap-2 =">
              <input
                type="radio"
                className="accent-Bamboo-100"
                checked={patient.gender === Gender.MALE}
                readOnly
              />
              ผู้ชาย
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                className="accent-Bamboo-100"
                checked={patient.gender === Gender.FEMALE}
                readOnly
              />
              ผู้หญิง
            </label>
          </div>

          <div className="space-y-2 text-sm">
            <p>
              ชื่อ - นามสกุล : {patient.firstName} {patient.lastName}
            </p>

            <p>
              อายุ : {patient.age} ปี {patient.month} เดือน {patient.day} วัน
            </p>

            <p>HN : {patient.hnId}</p>
            <p>เลขบัตรประชาชน : {patient.nationalId}</p>
            <p>สิทธิการรักษา : {patient.right}</p>

            <div className="flex gap-50">
              <p>สัญชาติ : {patient.nationality}</p>
              <p>เชื้อชาติ : {patient.ethnicity}</p>
            </div>

            <div className="flex gap-46">
              <p>น้ำหนัก : {patient.weight} กก.</p>
              <p>ส่วนสูง : {patient.height} ซม.</p>
            </div>

            <p>การแพ้ยา : {patient.allergy}</p>
            <p>เบอร์โทรศัพท์ : {patient.phone}</p>
          </div>
        </div>
        <div className="">
          <h2 className="text-lg font-semibold mb-4">ที่อยู่</h2>

          <div className="grid grid-cols-2 gap-y-2 text-sm gap-20">
            <p>เลขที่ : {patient.address.house_number}</p>
            <p>หมู่ที่ : {patient.address.village}</p>
            <p>ถนน : {patient.address.road}</p>
            <p>อำเภอ : {patient.address.district}</p>
            <p>ตำบล : {patient.address.subDistrict}</p>
            <p>จังหวัด : {patient.address.province}</p>
            <p>รหัสไปรษณีย์ : {patient.address.postalCode}</p>
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
