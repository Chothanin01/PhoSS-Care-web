"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchWithRefresh } from "@/lib/api";

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
  color_status?: string;
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


const getColorStatus = (maxLevel?: number) => {
  switch (maxLevel) {
    case 3:
      return "dark_green";
    case 4:
      return "yellow";
    case 5:
      return "orange";
    case 6:
      return "red";
    default:
      return "none";
  }
};

const getStatusLabel = (color: string) => {
  switch (color) {
    case "dark_green":
      return "สีเขียวเข้ม";
    case "yellow":
      return "สีเหลือง";
    case "orange":
      return "สีส้ม";
    case "red":
      return "สีแดง";
    default:
      return "ไม่ระบุ";
  }
};

const getStatusColorHex = (color: string) => {
  switch (color) {
    case "dark_green":
      return "#468432";
    case "yellow":
      return "#FFD57B";
    case "orange":
      return "#FF9800";
    case "red":
      return "#FF0505";
    default:
      return "#E5E7EB";
  }
};

export default function DiseasesView() {
  const params = useParams();
  const id = params.id as string;
  const diseaseId = params.diseaseId as string;

  const [data, setData] = useState<DiseaseData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDisease = async () => {
      try {
        const res = await fetchWithRefresh(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/patients/${id}/${diseaseId}`,
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
    return (
      <div className="ml-70 py-4">
        <div className="bg-white p-10 rounded-lg border text-center">
          <div className="text-lg font-semibold text-gray-600 mb-2">
            ผู้ป่วยรายนี้ยังไม่มีข้อมูลประวัติการรักษาในระบบ
          </div>
        </div>
      </div>
    );
  }

  const sortedHistory = [...data.appointment_info].sort(
    (a, b) => b.no - a.no
  );

  const isTuberculosis =
    data.disease_name === "วัณโรค" ||
    data.disease_name?.toLowerCase().includes("tuberculosis");

  return (
    <div className="ml-70 py-4">
      {sortedHistory.map((item) => {
        const color = item.color_status || "none";
        const label = getStatusLabel(color);
        const bgColor = getStatusColorHex(color);

        return (
          <div
            key={item.no}
            className="w-full bg-white p-6 rounded-lg shadow mb-4"
          >
            <h2 className="text-xl font-semibold mb-6">
              ประวัติการรักษา {data.disease_name} ครั้งที่ {item.no}
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
                  ผู้ตรวจ : {item.doctor || "-"}
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4">
                  ตรวจร่างกายทั่วไป
                </h3>

                <div className="grid grid-cols-2 gap-y-2 text-sm">
                  <p>น้ำหนัก : {item.health?.weight ?? "-"} กก.</p>
                  <p>ส่วนสูง : {item.health?.height ?? "-"} ซม.</p>
                  <p>ชีพจร : {item.health?.pulse ?? "-"} ครั้ง/นาที</p>
                   <p>
                    ความดัน : {item.symptom || "-"}
                  </p>
                  <p>ดัชนีมวลกาย : {item.health?.bmi ?? "-"} kg/m²</p>

                  {!isTuberculosis && (
                    <p>
                      สถานะ :
                      <span
                        className="text-blackc px-3 py-1 rounded-md text-sm ml-2"
                        style={{ backgroundColor: bgColor }}
                      >
                        {label}
                      </span>
                    </p>
                  )}

                  <p>อาการ : {item.symptom || "-"}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-sm">
              <p>การรักษา : {item.note || "-"}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}