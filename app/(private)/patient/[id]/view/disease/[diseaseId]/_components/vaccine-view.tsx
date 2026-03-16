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

export default function VaccineView() {
  const params = useParams();
  const id = params.id as string;

  const [vaccines, setVaccines] = useState<VaccineHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVaccines = async () => {
      try {
        const token = Cookies.get("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/patients/${id}/vaccines`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await res.json();

        if (result.success) {
          setVaccines(result.data);
        }
      } catch (error) {
        console.error("fetch vaccines error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVaccines();
    }
  }, [id]);

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
        const date = new Date(item.injection_date);

        const statusColor =
          item.status === "completed"
            ? "bg-green-500"
            : item.status === "pending"
            ? "bg-red-500"
            : "bg-gray-500";

        return (
          <div
            key={item.id}
            className="w-[1190px] bg-white p-6 rounded-lg shadow px-14 py-14"
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
                  วันที่ฉีดวัคซีน : {date.toLocaleDateString("th-TH")}
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