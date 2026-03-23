"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";

type VaccineHistory = {
  id: string;
  vaccine_name: string;
  vaccine_type: string;
  recommended_age: string;
  injection_date: string;
  status: string;
  side_effects?: string;
  recommendation?: string;
};

function formatThaiDate(dateString?: string) {
  if (!dateString || dateString.startsWith("0001")) return "-";

  const date = new Date(dateString);

  return date.toLocaleDateString("th-TH-u-ca-buddhist", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function VaccineView() {
  const params = useParams();
  const patientId = params?.id as string;

  const [vaccines, setVaccines] = useState<VaccineHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const token = Cookies.get("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/patients/${patientId}/vaccines`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const result = await res.json();
        const appointmentRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/appointments/${patientId}/vaccination`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const appointmentResult = await appointmentRes.json();
        const appointmentDate = appointmentResult?.data?.date;

        if (result.success) {
          const patientData = result.data[0];
          const flattened: VaccineHistory[] = [];

          patientData.vaccine.forEach((v: any) => {
            v.vaccine.forEach((record: any) => {
              let injectionDate = record.date;

              if (record.date === "0001-01-01" && appointmentDate) {
                injectionDate = appointmentDate;
              }

              flattened.push({
                id: record.record_id,
                vaccine_name: v.name,
                vaccine_type: record.type,
                recommended_age: record.age,
                injection_date: injectionDate,
                status: record.status,
                side_effects: record.effect,
                recommendation: record.note,
              });
            });
          });

          setVaccines(flattened);
        }
      } catch (error) {
        console.error("fetch vaccines error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) fetchVaccines();
  }, [patientId]);

  if (loading) {
    return <div className="ml-70 px-6 py-28">กำลังโหลดข้อมูล...</div>;
  }

  if (!vaccines || vaccines.length === 0) {
    return <div className="ml-70 px-6 py-28">ไม่มีประวัติวัคซีน</div>;
  }

  const sortedHistory = [...vaccines].sort(
    (a, b) =>
      new Date(b.injection_date).getTime() -
      new Date(a.injection_date).getTime()
  );

  return (
    <div className="ml-70 px-6 py-28 space-y-3">
      {sortedHistory.map((item) => {
        const statusColor =
          item.status === "completed"
            ? "bg-green-500"
            : item.status === "pending"
            ? "bg-red-500"
            : "bg-yellow-500";

        return (
          <div
            key={item.id}
            className="w-[1375px] bg-white p-6 rounded-lg shadow px-14 py-14"
          >
            <h2 className="text-xl font-semibold mb-6">
              ประวัติการฉีด {item.vaccine_name}
            </h2>
            <div className="grid md:grid-cols-[1fr_1fr] md:gap-12 items-start">
              <div>
                <h3 className="font-semibold mb-3">ข้อมูลวัคซีน</h3>
                <p className="text-sm">
                  สถานะ :
                  <span
                    className={`text-white px-3 py-1 rounded-md ml-2 text-sm ${statusColor}`}
                  >
                    {item.status}
                  </span>
                </p>
                <p className="mt-2 text-sm">
                  ชนิดวัคซีน : {item.vaccine_type}
                </p>
                <p className="mt-2 text-sm">
                  ชื่อวัคซีน : {item.vaccine_name}
                </p>
                <p className="mt-2 text-sm">
                  อายุที่ควรได้รับ : {item.recommended_age}
                </p>
                <p className="mt-2 text-sm">
                  วันที่ฉีดวัคซีน : {formatThaiDate(item.injection_date)}
                </p>
              </div>
              <div className="mt-6">
                <p className="text-sm">
                  ผลข้างเคียง : {item.side_effects || "-"}
                </p>
                <p className="mt-3 text-sm">
                  คำแนะนำ : {item.recommendation || "-"}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}