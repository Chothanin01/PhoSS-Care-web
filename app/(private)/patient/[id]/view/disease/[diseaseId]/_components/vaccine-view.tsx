"use client";

import { Vaccine, VaccineHistory } from "@/app/utils/patient.mock";

type VaccineViewProps = {
  data: Vaccine;
};

export default function VaccineView({ data }: VaccineViewProps) {
  if (!data.vaccineHistory || data.vaccineHistory.length === 0) {
    return <div className="ml-70 px-6 py-28">ไม่มีประวัติวัคซีน</div>;
  }

  const sortedHistory = [...data.vaccineHistory].sort(
    (a, b) =>
      new Date(b.injectionDate).getTime() - new Date(a.injectionDate).getTime()
  );

  return (
    <div className="ml-70 px-6 py-28 space-y-3">
      {sortedHistory.map((item: VaccineHistory, index: number) => {
        const statusColor =
          item.status === "ได้รับวัคซีนแล้ว"
            ? "bg-green-500"
            : item.status === "ยังไม่ได้รับวัคซีน"
            ? "bg-red-500"
            : "bg-gray-500";

        return (
          <div
            key={item.id}
            className="w-[1190px] bg-white p-6 rounded-lg shadow px-14 py-14"
          >
            <h2 className="text-xl font-semibold mb-6">
              ประวัติการฉีด{item.vaccineName}
            </h2>

            <div className="grid md:grid-cols-2 gap-20">
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

                <p className="mt-2 text-sm">ชนิดวัคซีน : {item.vaccineType}</p>
                <p className="mt-2 text-sm">ชื่อวัคซีน : {item.vaccineName}</p>
                <p className="mt-2 text-sm">
                  อายุที่ควรได้รับ : {item.recommendedAge}
                </p>
                <p className="mt-2 text-sm">
                  วันที่ฉีดวัคซีน : วันที่ {item.days} เดือน {item.months} ปี{" "}
                  {item.years}
                </p>
              </div>

              <div className="mt-6">
                <p className="text-sm">
                  ผลข้างเคียง : {item.sideEffects || "-"}
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
