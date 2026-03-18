"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Cookies from "js-cookie";

type Appointment = {
  appointment_id: string;
  disease_id: string;
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

type Vaccination = {
  vaccine_id: string;
  name: string;
  type: string;
};

export default function AppointmentCard() {
  const router = useRouter();
  const params = useParams();
  const patientId = params?.id as string;

  const [patient, setPatient] = useState<any>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [vaccinations, setVaccinations] = useState<
    Record<string, Vaccination | null>
  >({});

  const Status = ({
    color,
    children,
  }: {
    color: "green" | "yellow" | "blue";
    children: React.ReactNode;
  }) => {
    const styles = {
      green: "text-green-700 bg-green-100 border-green-300",
      yellow: "text-yellow-700 bg-yellow-100 border-yellow-300",
      blue: "text-blue-700 bg-blue-100 border-blue-300",
    };

    return (
      <div
        className={`mb-4 border px-4 py-2 rounded-md text-sm ${styles[color]}`}
      >
        {children}
      </div>
    );
  };

  const formatThaiDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchAppointments = async () => {
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

            return appointmentDate >= today && a.status === "ongoing";
          });

          if (futureAppointments.length === 0) return;

          const nextAppointment = futureAppointments.sort(
            (a: any, b: any) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
          )[0];

          validAppointments.push({
            appointment_id: nextAppointment.id,
            disease_id: disease.disease_id,
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

        const vaccinationMap: Record<string, Vaccination | null> = {};
        await Promise.all(
          validAppointments.map(async (appointment) => {
            if (appointment.disease_name !== "วัคซีน") {
              vaccinationMap[appointment.appointment_id] = null;
              return;
            }

            try {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/appointments/${patientId}/vaccination`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              const data = await res.json();

              if (data.success && data.data) {
                vaccinationMap[appointment.appointment_id] = data.data;
              } else {
                vaccinationMap[appointment.appointment_id] = null;
              }
            } catch {
              vaccinationMap[appointment.appointment_id] = null;
            }
          })
        );

        setVaccinations(vaccinationMap);
      } catch (error) {
        console.error("fetch appointment error:", error);
      }
    };

    if (patientId) fetchAppointments();
  }, [patientId]);

  if (!patient) return <div className="p-8">Loading...</div>;

  return (
    <>
      {appointments.map((appointment, index) => {
        const vaccination = vaccinations[appointment.appointment_id];

        return (
          <div key={appointment.appointment_id ?? index} className="p-5">
            {index !== 0 && <hr className="border-gray-300 mb-8" />}

            <h1 className="text-xl font-semibold mb-6">
              ใบนัดแพทย์ {appointment.disease_name}
            </h1>

            {appointment.status === "delay" && (
              <Status color="yellow">ใบนัดกำลังมีการขอเลื่อนนัด</Status>
            )}

            {appointment.status === "ongoing" && !appointment.delay && (
              <Status color="green">ใบนัดกำลังดำเนินการ</Status>
            )}

            {appointment.status === "ongoing" && appointment.delay && (
              <Status color="blue">ใบนัดเคยขอเลื่อนนัดแล้ว</Status>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
              <div>
                <h2 className="font-semibold mb-3">ข้อมูลใบนัด</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 text-sm gap-x-10 py-2">
                  <p>ชื่อ - นามสกุล : {patient.fullname}</p>
                  <p>หมายเลขประจำตัวผู้ป่วย : HN{patient.hnnumber}</p>
                  {vaccination && (
                    <>
                      <p>ชื่อวัคซีน : {vaccination.name}</p>
                      <p>ชนิดวัคซีน : {vaccination.type}</p>
                    </>
                  )}
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
                  router.push(
                    `/patient/${patientId}/edit/patient?appointmentId=${appointment.appointment_id}&diseaseId=${appointment.disease_id}`
                  )
                }
                className="flex items-center gap-2 px-4 py-2 text-Bamboo-100 bg-white border-2 border-Bamboo-100 font-semibold rounded-lg hover:bg-Bamboo-100 hover:text-white"
              >
                แก้ไขข้อมูล
                <Pencil size={16} />
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
}