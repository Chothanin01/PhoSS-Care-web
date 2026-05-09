'use client';

import React, { useState, useEffect } from "react";
import { InputField } from "@/components/inputfield";
import { SelectField } from "@/components/selectfield";
import { Button } from "@/shadcn/ui/button";
import { Check, Save  } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shadcn/ui/dialog";
import { fetchWithRefresh } from "@/lib/api";

type Appointment = {
  appoint_id: string
  patient_id?: string
  vaccine_id?: string
  purpose: string
  place: string
  date: string
  startTime: string
  endTime: string
  doctor_id: string
  doctor_name?: string
  officer_title: string
  officer_firstname: string
  officer_lastname: string
  symptom: string
  disease_name:string
  is_vaccine?: boolean
  vaccine_type?: string
  vaccine_name?: string
}

interface Props {
  appointment: Appointment
  onChange: (updated: Appointment) => void
}
export default function EditAppointmentData({ appointment, onChange }: Props) {

  const [openSuccess, setOpenSuccess] = useState(false);
  const [doctorOptions, setDoctorOptions] = useState<{ label: string; value: string }[]>([])

  const updateField = (key: keyof Appointment, value: string) => {
    onChange({
      ...appointment,
      [key]: value
    })
  }

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetchWithRefresh(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/appointments/doctors`
        )

        const data = await res.json()

        const options = (data.data || []).map((doctor: any) => ({
          label: doctor.full_name,
          value: doctor.id,
        }))

        setDoctorOptions(options)

      } catch (err) {
        console.error("fetch doctors error:", err)
      }
    }

    fetchDoctors()
  }, [])

  useEffect(() => {
    if (!appointment.doctor_name || doctorOptions.length === 0) return

    const matchedDoctor = doctorOptions.find(
      (doctor) => doctor.label === appointment.doctor_name
    )

    if (matchedDoctor && appointment.doctor_id !== matchedDoctor.value) {
      onChange({
        ...appointment,
        doctor_id: matchedDoctor.value,
      })
    }
  }, [doctorOptions, appointment.doctor_name])

  useEffect(() => {
    if (openSuccess) {
      const timer = setTimeout(() => {
        setOpenSuccess(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [openSuccess])

  const handleSubmit = async () => {

    let url = `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/appointments`
    let payload:any = {}

    if (appointment.is_vaccine) {

      url = `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/appointments/vaccine`

      payload = {
        appoint_id: appointment.appoint_id,
        vaccine_id: appointment.vaccine_id,
        patient_id: appointment.patient_id,

        place: appointment.place,
        date: appointment.date,
        start_time: appointment.startTime,
        end_time: appointment.endTime,

        doctor_id: appointment.doctor_id
      }

    } else {

      payload = {
        appoint_id: appointment.appoint_id,
        purpose: appointment.purpose,
        place: appointment.place,
        date: appointment.date,
        start_time: appointment.startTime,
        end_time: appointment.endTime,

        doctor_id: appointment.doctor_id
      }

    }

    const res = await fetchWithRefresh(url,{
      method:"PATCH",
      headers:{
        "Content-Type":"application/json",
      },
      body: JSON.stringify(payload)
    })

    if(res.ok){
      setOpenSuccess(true)
    }else{
      console.log(await res.text())
    }
  }

  return (
    <div className="w-full mx-auto p-4">

      <div className="mb-6 font-semibold text-xl">
        {appointment.is_vaccine
          ? "แก้ไขใบนัดวัคซีน"
          : `แก้ไขข้อมูลใบนัด${appointment.disease_name}`}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div>
          {appointment.is_vaccine ? (

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <InputField
                id="vaccine_type"
                name="vaccine_type"
                label="ชนิดวัคซีน"
                value={appointment.vaccine_type || ""}
                onChange={(e)=>updateField("vaccine_type",e.target.value)}
              />

              <InputField
                id="vaccine_name"
                name="vaccine_name"
                label="ชื่อวัคซีน"
                value={appointment.vaccine_name || ""}
                onChange={(e)=>updateField("vaccine_name",e.target.value)}
              />

              <InputField
                id="place"
                name="place"
                label="สถานที่"
                value={appointment.place}
                onChange={(e)=>updateField("place",e.target.value)}
              />

              <InputField
                id="date"
                name="date"
                label="วันที่ได้รับวัคซีน"
                type="date"
                value={appointment.date}
                onChange={(e)=>updateField("date",e.target.value)}
              />

            </div>

          ) : (

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              <InputField
                id="purpose"
                name="purpose"
                label="นัดเพื่อ"
                value={appointment.purpose}
                onChange={(e)=>updateField("purpose",e.target.value)}
              />

              <InputField
                id="place"
                name="place"
                label="สถานที่"
                value={appointment.place}
                onChange={(e)=>updateField("place",e.target.value)}
              />

              <InputField
                id="date"
                name="date"
                label="นัดมาวันที่"
                type="date"
                value={appointment.date}
                onChange={(e)=>updateField("date",e.target.value)}
              />

              <div className="flex items-end gap-3">
                <InputField
                  name="startTime"
                  id="startTime"
                  label="เวลา"
                  type="time"
                  value={appointment.startTime}
                  onChange={(e)=>updateField("startTime",e.target.value)}
                />
                <InputField
                  id="endTime"
                  name="endTime"
                  label=""
                  type="time"
                  value={appointment.endTime}
                  onChange={(e)=>updateField("endTime",e.target.value)}
                />
              </div>

            </div>

          )}
        </div>

        <div>
          <div className="mb-4 font-semibold text-md">
            ผู้นัด
          </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"> 
              <div className="md:col-span-2">
                <div className="w-full md:w-64">
                  <SelectField
                    id="title"
                    name="title"
                    label="คำนำหน้า"
                    placeholder="เลือกคำนำหน้า"
                    value={appointment.officer_title}
                    onValueChange={(v)=>updateField("officer_title",v)}
                    options={[
                      { label: "นาย", value: "นาย" },
                      { label: "นาง", value: "นาง" },
                      { label: "นางสาว", value: "นางสาว" },
                    ]}
                    disabled
                  />
                </div>
              </div>
              
              <InputField
                id="firstname"
                name="firstname"
                label="ชื่อ"
                value={appointment.officer_firstname}
                disabled
              />
              
              <InputField
                id="lastname"
                name="lastname"
                label="นามสกุล"
                value={appointment.officer_lastname}
                disabled
              />
            </div>

            <div className="mb-4 font-semibold text-md">
              แพทย์
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <SelectField
                id="doctor_id"
                name="doctor_id"
                label="ชื่อแพทย์"
                placeholder="เลือกแพทย์"
                value={appointment.doctor_id}
                onValueChange={(v) => updateField("doctor_id", v)}
                options={doctorOptions}
              />
            </div>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <Button 
          onClick={handleSubmit}
          className="text-Bamboo-100 bg-white border-2 border-Bamboo-100 font-semibold hover:bg-gray-200"
        >
            บันทึก
            <Save className="ml-2"/>
        </Button>
      </div>
      <Dialog open={openSuccess} onOpenChange={setOpenSuccess}>
        <DialogContent showCloseButton={false} className="sm:max-w-md text-center">
          <DialogTitle></DialogTitle>
          <DialogDescription/>

          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#b2e0a6]">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-Bamboo-400">
                <Check className="w-8 h-8 text-white" strokeWidth={3} />
              </div>
            </div>
          </div>

          <p className="text-lg font-semibold">
            ระบบได้เเก้ไขข้อมูลเรียบร้อยเเล้ว
          </p>

        </DialogContent>
      </Dialog>
    </div>
  );
}
