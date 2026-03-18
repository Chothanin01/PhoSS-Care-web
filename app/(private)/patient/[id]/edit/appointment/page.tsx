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

          const doctor = appoint.doctor || ""
          const [first, last] = doctor.split(" ")

          let doctor_title = ""
          let doctor_firstname = ""

          if (first?.startsWith("แพทย์หญิง")) {
            doctor_title = "แพทย์หญิง"
            doctor_firstname = first.replace("แพทย์หญิง", "")
          } 
          else if (first?.startsWith("นายแพทย์")) {
            doctor_title = "นายแพทย์"
            doctor_firstname = first.replace("นายแพทย์", "")
          }

          const doctor_lastname = last || ""

          const officer = appoint.officer || ""
          const [ofirst, olast] = officer.split(" ")

          let officer_title = ""
          let officer_firstname = ""

          if (ofirst?.startsWith("นาย")) {
            officer_title = "นาย"
            officer_firstname = ofirst.replace("นาย", "")
          } 
          else if (ofirst?.startsWith("นางสาว")) {
            officer_title = "นางสาว"
            officer_firstname = ofirst.replace("นางสาว", "")
          } 
          else if (ofirst?.startsWith("นาง")) {
            officer_title = "นาง"
            officer_firstname = ofirst.replace("นาง", "")
          }

          const officer_lastname = olast || ""

          return {
            appoint_id: appoint.id,
            purpose: appoint.purpose || "",
            place: appoint.place || "",
            date: appoint.date || "",
            startTime: appoint.start_time || "",
            endTime: appoint.end_time || "",

            doctor_title,
            doctor_firstname,
            doctor_lastname,

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
    <div className="ml-70 px-6 py-28">

      <div className="w-full mx-auto space-y-6">
        {appointments.map((appoint,index)=>(
          <div
            key={`${appoint.appoint_id}-${index}`}
            className="bg-white p-6 rounded-lg shadow border"
          >
            <EditAppointmentData
              appointment={appoint}
              onChange={(updated)=>updateAppointment(index,updated)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
