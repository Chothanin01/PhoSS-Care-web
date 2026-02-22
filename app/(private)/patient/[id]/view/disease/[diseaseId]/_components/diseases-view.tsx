"use client";

import { DiseaseHistory, RecordStatus } from "@/app/utils/patient.mock";

type DiseasesViewProps = {
  data: {
    id: string;
    name: string;
    history?: DiseaseHistory[];
  };
};

export default function DiseasesView({ data }: DiseasesViewProps) {
  if (!data.history || data.history.length === 0) {
    return <div className="ml-70 px-6 py-28">ไม่มีประวัติการรักษา</div>;
  }
  const sortedHistory = [...data.history].sort((a, b) => b.visitNo - a.visitNo);

  return (
    <div className="ml-70 px-6 py-28 space-y-3">
      {sortedHistory.map((item) => {
        const statusColor =
          item.status === RecordStatus.NORMAL
            ? "bg-green-500"
            : item.status === RecordStatus.MONITOR
            ? "bg-red-500"
            : "bg-yellow-500";

        return (
          <div
            key={item.visitNo}
            className="w-[1190px] bg-white p-6 rounded-lg shadow px-14 py-14"
          >
            <h2 className="text-xl font-semibold mb-6">
              ประวัติการรักษา{data.name} ครั้งที่ {item.visitNo}
            </h2>

            <div className="grid md:grid-cols-[1fr_1fr] md:gap-12 items-start">
              <div>
                <h3 className="font-semibold mb-3">ข้อมูลทั่วไป</h3>
                <p className="text-sm">
                  วันที่ตรวจ : วันที่ {item.days} เดือน {item.months} ปี{" "}
                  {item.years}
                </p>
                <p className="mt-2 text-sm">
                  นัดครั้งถัดไป : วันที่ {item.nextDaysAppointment} เดือน{" "}
                  {item.nextMonthAppointment} ปี {item.nextyearAppointment}
                </p>
                <p className="mt-2 text-sm">ผู้ตรวจ : {item.examiner}</p>
                <p className="mt-2 text-sm">แพทย์ : {item.doctor}</p>
              </div>

              <div>
                <h3 className="font-semibold">ตรวจร่างกายทั่วไป</h3>

                <div className="grid grid-cols-2 gap-y-2">
                  <p className="mt-2 text-sm">น้ำหนัก : {item.weight} กก.</p>
                  <p className="mt-2 text-sm">ส่วนสูง : {item.height} ซม.</p>

                  <p className="text-sm">ชีพจร : {item.pulse} ครั้ง/นาที</p>
                  <p className="text-sm">
                    ความดัน : {item.bloodPressure} มม.ปรอท
                  </p>

                  <p className="text-sm">ดัชนีมวลกาย : {item.bmi} กก./ม²</p>

                  <p className="text-sm">
                    สถานะ :
                    <span
                      className={`text-white px-3 py-1 rounded-md text-sm ml-2 ${statusColor}`}
                    >
                      {item.status}
                    </span>
                  </p>

                  <p className="text-sm">อาการ : {item.symptom}</p>
                  <p className="text-sm">
                    ระดับน้ำตาล : {item.bloodSugar} มก./ดล.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-sm">
              <p>การรักษา : {item.treatment}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
