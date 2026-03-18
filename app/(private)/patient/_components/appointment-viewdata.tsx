"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Cookies from "js-cookie";

type Appointment = {
  disease_name: string;
  date: string;
  start_time: string;
  end_time: string;
  place: string;
  purpose: string;
  doctor: string;
  status?: string;
  delay?: boolean;
};

export default function AppointmentCard() {
  const router = useRouter();
  const params = useParams();
  const patientId = params?.id as string;

  const [patient, setPatient] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const formatThaiDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const token = Cookies.get("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/patients/${patientId}/appointments`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        const patientData = data?.data?.[0];
        if (!patientData) return;

        setPatient({
          fullname: patientData.fullname,
          hnnumber: patientData.hnnumber,
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const validAppointments: Appointment[] = [];

        patientData.appointments?.forEach((disease: any) => {
          const diseaseAppointments = disease.appointments;

          if (!diseaseAppointments?.length) return;

          const futureAppointments = diseaseAppointments.filter((a: any) => {
            const appointmentDate = new Date(a.date);
            appointmentDate.setHours(0, 0, 0, 0);
            return appointmentDate >= today;
          });

          if (futureAppointments.length === 0) return;

          const nextAppointment = futureAppointments.sort(
            (a: any, b: any) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          )[0];

          validAppointments.push({
            disease_name: disease.disease_name,
            date: nextAppointment.date,
            start_time: nextAppointment.start_time,
            end_time: nextAppointment.end_time,
            place: nextAppointment.place,
            purpose: nextAppointment.purpose,
            doctor: nextAppointment.doctor,
            status: nextAppointment.status,
            delay: nextAppointment.delay,
          });
        });

        setAppointments(validAppointments);
      } catch (error) {
        console.error("fetch appointment error:", error);
      }
    };

    if (patientId) fetchAppointment();
  }, [patientId]);

  if (!patient) return <div className="p-8">Loading...</div>;

  return (
    <>
      {appointments.map((appointment, index) => (
        <div key={index} className="p-5">
          {index !== 0 && <hr className="border-gray-300 mb-8" />}

          <h1 className="text-xl font-semibold mb-6">
            ใบนัดแพทย์{appointment.disease_name}
          </h1>
          {appointment.status === "delay" && (
            <div className="mb-4 text-yellow-700 bg-yellow-100 border border-yellow-300 px-4 py-2 rounded-md text-sm">
              ใบนัดกำลังมีการขอเลื่อน
            </div>
          )}
          {appointment.delay === true && (
            <div className="mb-4 text-blue-700 bg-blue-100 border border-blue-300 px-4 py-2 rounded-md text-sm">
              เป็นนัดที่เลื่อนมาแล้ว
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-30">
            <div>
              <h2 className="font-semibold mb-2">ข้อมูลใบนัด</h2>
              <div className="space-y-3 text-sm">
                <p>ชื่อ - นามสกุล : {patient.fullname}</p>
                <p>หมายเลขประจำตัวผู้ป่วย : {patient.hnnumber}</p>
                <p>นัดมาวันที่ : {formatThaiDate(appointment.date)}</p>
                <p>
                  เวลา : {appointment.start_time} - {appointment.end_time} น.
                </p>
                <p>นัดเพื่อ : {appointment.purpose}</p>
                <p>สถานที่ : {appointment.place}</p>
              </div>
            </div>

            <div>
              <h2 className="font-semibold mb-4">แพทย์</h2>
              <div className="text-sm space-y-2">
                <p>ชื่อ - นามสกุล : {appointment.doctor}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              onClick={() =>
                router.push(`/patient/${patientId}/edit/patient`)
              }
              className="flex items-center gap-2 px-4 py-2 text-Bamboo-100 bg-white border-2 border-Bamboo-100 font-semibold rounded-lg hover:bg-Bamboo-100 hover:text-white"
            >
              แก้ไขข้อมูล
              <Pencil size={16} />
            </button>
          </div>
        </div>
      ))}
    </>
  );
}