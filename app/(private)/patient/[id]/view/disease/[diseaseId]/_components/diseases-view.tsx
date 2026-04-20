"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";

type Health = {
  height: number;
  weight: number;
  bmi: number;
  pulse: number;
  sugar: number;
};

type Appointment = {
  no: number;
  date: string;
  symptom: string;
  note: string;
  doctor: string;
  status: string;
  place: string;
  health: Health;
};

type DiseaseData = {
  disease_name: string;
  appointment_info: Appointment[];
};

function formatThaiDate(dateString?: string) {
  if (!dateString || dateString.startsWith("0001")) return "-";

  return new Date(dateString).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function DiseasesView() {
  const params = useParams();
  const id = params.id as string;
  const diseaseId = params.diseaseId as string;

  const [data, setData] = useState<DiseaseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDisease = async () => {
      try {
        const token = Cookies.get("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/patients/${id}/${diseaseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await res.json();

        if (result.success) {
          setData(result.data.data[0]);
        }
      } catch (err) {
        console.error("fetch disease error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id && diseaseId) fetchDisease();
  }, [id, diseaseId]);

  if (loading) {
    return <div className="ml-70 px-6 py-28">กำลังโหลดข้อมูล...</div>;
  }

  if (!data || data.appointment_info.length === 0) {
    return <div className="ml-70 px-6 py-28">ไม่มีประวัติการรักษา</div>;
  }

  const sortedHistory = [...data.appointment_info].sort(
    (a, b) => b.no - a.no
  );

  return (
    <div className="ml-70 px-6 py-28 space-y-6">
      {sortedHistory.map((item) => {
        const statusColor =
          item.status === "completed"
            ? "bg-green-500"
            : item.status === "pending"
              ? "bg-yellow-500"
              : "bg-red-500";

        return (
          <div
            key={item.no}
            className="w-[1360px] bg-white rounded-lg shadow px-14 py-14"
          >
            <h2 className="text-xl font-semibold mb-8">
              ประวัติการรักษา{data.disease_name} ครั้งที่ {item.no}
            </h2>

            <div className="grid grid-cols-2 gap-16">
              <div>
                <h3 className="font-semibold mb-4">ข้อมูลทั่วไป</h3>

                <p className="text-sm">
                  วันที่ตรวจ : {formatThaiDate(item.date)}
                </p>
                <p className="text-sm mt-2">
                  นัดครั้งถัดไป : {formatThaiDate(item.date)}
                </p>
                <p className="text-sm mt-2">
                  ผู้ตรวจ : {formatThaiDate(item.date)}
                </p>
                <p className="text-sm mt-2">
                  แพทย์ : {item.doctor || "-"}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4">ตรวจร่างกายทั่วไป</h3>

                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <p>น้ำหนัก : {item.health?.weight ?? "-"} กก.</p>
                  <p>ส่วนสูง : {item.health?.height ?? "-"} ซม.</p>

                  <p>ชีพจร : {item.health?.pulse ?? "-"} ครั้ง/นาที</p>

                  <p>
                    ความดัน : {item.health?.bmi ?? "-"} กก./ม²
                  </p>

                  <p>
                    ดัชนีมวลกาย : {item.health?.bmi ?? "-"} กก./ม²
                  </p>

                  <p>
                    สถานะ :
                    <span
                      className={`text-white px-3 py-1 rounded-md text-sm ml-2 ${statusColor}`}
                    >
                      {item.status}
                    </span>
                  </p>
                  <p>
                    อาการ : {item.symptom || "-"}
                  </p>
                  <p>
                    ความดัน : {item.symptom || "-"}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 text-sm">
              <p>
                การรักษา : {item.note || "-"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}