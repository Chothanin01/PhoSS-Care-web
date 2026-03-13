"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Cookies from "js-cookie";

export default function PatientCard() {
  const router = useRouter();
  const params = useParams();
  const patientId = params.id;
  console.log("id:", patientId);

  const [patient, setPatient] = useState<any>(null);

  useEffect(() => {
    if (!patientId) return

    const fetchPatient = async () => {
      try {
        const token = Cookies.get("token")

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/patients/${patientId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

        const data = await res.json()

        console.log("patient api:", data)

        const p = data?.data?.[0]?.patient
        if (!p) return

        setPatient({
          id: patientId,
          gender: p.sex,
          firstName: p.fullname.split(" ")[0],
          lastName: p.fullname.split(" ").slice(1).join(" "),
          age: p.age_years,
          month: p.age_months,
          day: p.age_days,
          sex: p.sex,
          hnId: p.hnnumber,
          nationalId: p.idcard,
          right: p.rights,
          nationality: p.nationality,
          ethnicity: p.ethnicity,
          weight: p.weight,
          height: p.height,
          allergy: p.allergy,
          phone: p.phone_number,
          address: {
            house_number: p.address.house_number,
            village: p.address.village_number,
            road: p.address.road,
            district: p.address.district,
            subDistrict: p.address.subdistrict,
            province: p.address.province,
            postalCode: p.address.zipcode,
          },
        })
      } catch (err) {
        console.error("fetch patient error", err)
      }
    }

    fetchPatient()
  }, [patientId])

  if (!patient) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-xl font-semibold mb-6">ข้อมูลผู้ป่วย</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-30">
        <div>
          <h2 className="font-semibold mb-2">ข้อมูลส่วนตัว</h2>

          <div className="flex items-center gap-6 mb-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                className="accent-Bamboo-100"
                checked
                readOnly
              />
              {patient.sex === "Male" ? "ผู้ชาย" : "ผู้หญิง"}
            </label>
          </div>
          <div className="space-y-3 text-sm">
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
              <p className="px-1">ส่วนสูง : {patient.height} ซม.</p>
            </div>

            <p>การแพ้ยา : {patient.allergy}</p>
            <p>เบอร์โทรศัพท์ : {patient.phone}</p>
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-4">ที่อยู่</h2>

          <div className="grid grid-cols-2 gap-x-20 text-sm space-y-3">
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