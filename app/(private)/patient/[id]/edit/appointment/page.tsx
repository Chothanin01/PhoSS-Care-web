"use client"

import { useState, useEffect } from "react"
import EditAppointmentData from "../../../_components/edit-appointment-card"
import Cookies from "js-cookie"
import { useParams } from "next/navigation"

export default function Page() {

  const params = useParams()
  const id = params.id as string

  const [appointments,setAppointments] = useState<any[]>([])

  useEffect(()=>{
    const fetchAppointments = async () => {
      const token = Cookies.get("token")

      const [appointRes, vaccineRes] = await Promise.all([
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/patients/${id}/appointments`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/appointments/${id}/vaccination`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
      ])

      const appointData = await appointRes.json()

      const vaccineData = await vaccineRes.json()

      const list = appointData.data?.[0]?.appointments || []

      const diseaseMapped = list.flatMap((d: any) =>
        (d.appointments || []).map((appoint: any) => {

          const officer = appoint.officer || ""

          let officer_title = ""
          let officer_firstname = ""
          let officer_lastname = ""

          if (officer.startsWith("Mr.")) {
            officer_title = "นาย"

            const fullname = officer.replace("Mr.", "").trim()
            const parts = fullname.split(" ")

            officer_firstname = parts[0] || ""
            officer_lastname = parts.slice(1).join(" ") || ""

          } else if (officer.startsWith("Mrs.")) {
            officer_title = "นาง"

            const fullname = officer.replace("Mrs.", "").trim()
            const parts = fullname.split(" ")

            officer_firstname = parts[0] || ""
            officer_lastname = parts.slice(1).join(" ") || ""

          } else if (officer.startsWith("Ms.")) {
            officer_title = "นางสาว"

            const fullname = officer.replace("Ms.", "").trim()
            const parts = fullname.split(" ")

            officer_firstname = parts[0] || ""
            officer_lastname = parts.slice(1).join(" ") || ""

          }

          return {
            appoint_id: appoint.id,
            purpose: appoint.purpose || "",
            place: appoint.place || "",
            date: appoint.date || "",
            startTime: appoint.start_time || "",
            endTime: appoint.end_time || "",

            doctor_id: appoint.doctor_id || "",
            doctor_name: appoint.doctor || "",

            officer_title,
            officer_firstname,
            officer_lastname,

            symptom: appoint.symptom || "",
            disease_name: d.disease_name,

            is_vaccine: false
          }
        })
      )

      const vaccine = vaccineData?.data

      let finalAppointments = diseaseMapped

      if (vaccine) {
        finalAppointments = [
          {
            ...diseaseMapped[0],

            is_vaccine: true,
            purpose: "",

            vaccine_type: vaccine.type || "",
            vaccine_name: vaccine.name || "",
            date: vaccine.date || "",

            patient_id: id,
            vaccine_id: vaccine.vaccine_id
          }
        ]
      }

      setAppointments(finalAppointments)
    }

    if(id) fetchAppointments()

  },[id])


  const updateAppointment = (index:number, updated:any)=>{
    const copy = [...appointments]
    copy[index] = updated
    setAppointments(copy)
  }


  return (
    <div className="ml-70 py-4">
      <div className="w-full mx-auto space-y-6">
        {appointments.length === 0 ? (
          <div className="bg-white p-10 rounded-lg border text-center">
            <div className="text-lg font-semibold text-gray-600 mb-2">
              ผู้ป่วยรายนี้ยังไม่มีข้อมูลใบนัดในระบบ
            </div>
          </div>
        ) : (
          appointments.map((appoint, index) => (
            <div
              key={`${appoint.appoint_id}-${index}`}
              className="bg-white p-6 rounded-lg border"
            >
              <EditAppointmentData
                appointment={appoint}
                onChange={(updated) =>
                  updateAppointment(index, updated)
                }
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
