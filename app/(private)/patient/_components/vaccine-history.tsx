"use client";

import { useMemo, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { InputField } from "@/components/inputfield";
import { SelectField } from "@/components/selectfield";
import { Button } from "@/shadcn/ui/button";
import { StepForward } from "lucide-react";
import { fetchWithRefresh } from "@/lib/api";

const DOCTOR_TITLES = [
    { label: "นายเเพทย์", value: "นายแพทย์" },
    { label: "เเพทย์หญิง", value: "แพทย์หญิง" },
];

type VaccineFormData = {
    vaccine_id: string;
    old_vaccine_id: string;
    dose_number: number;
    next_dose_number: number;
    vaccine_doctor_id: string;
    doctor_id: string;
    place: string;
    date: string;
    time_start: string;
    time_end: string;
};

type PatientInfo = {
    fullname: string;
    hn_number: string;
    age_years: number;
    age_months: number;
    age_days: number;
};

type VaccineOption = {
    label: string;
    value: string;
};

type VaccineData = {
    vaccine_id: string;
    type: string;
    effect: string;
    note: string;
    age: string;
    name: string;
};

type Props = {
    formData: VaccineFormData;
    setFormData: React.Dispatch<React.SetStateAction<VaccineFormData>>;
    onNext: () => void;
};

export default function VaccineForm({
    formData,
    setFormData,
    onNext,
}: Props) {
    const params = useParams();
    const appointmentId = params.id as string;

    const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
    const [vaccineOptions, setVaccineOptions] = useState<VaccineOption[]>([]);
    const [vaccineList, setVaccineList] = useState<VaccineData[]>([]);
    const [doctorOptions, setDoctorOptions] = useState< { label: string; value: string }[]>([])
    const selectedVaccine = useMemo(() => {
        if (!formData.vaccine_id) return null;

        return (
            vaccineList.find((v) => v.vaccine_id === formData.vaccine_id) || null
        );
        }, [formData.vaccine_id, vaccineList]);

    useEffect(() => {
        const fetchPatientInfo = async () => {
            try {
                const res = await fetchWithRefresh(
                    `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/patients/${appointmentId}/info`,
                );
                const data = await res.json();
                setPatientInfo(data.data);
            } catch (err) {
                console.error("fetch patient info error", err);
            }
        };

        if (appointmentId) fetchPatientInfo();
    }, [appointmentId]);

    useEffect(() => {
        const fetchVaccines = async () => {
            try {
                const res = await fetchWithRefresh(
                    `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/diseases/vaccines`,
                );
                const data = await res.json();
                const list = data?.data || [];

                setVaccineList(list);

                const options = list.map((v: VaccineData) => ({
                    label: v.name,
                    value: v.vaccine_id,
                }));

                setVaccineOptions(options);
            } catch (err) {
                console.error("fetch vaccine options error", err);
            }
        };

        fetchVaccines();
    }, []);
    useEffect(() => {
        const fetchVaccinationHistory = async () => {
            try {
                const res = await fetchWithRefresh(
                    `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/appointments/${appointmentId}/vaccination`,
                );

                const data = await res.json();

                if (data?.data) {
                    const vaccine = data.data;

                    const autoData = {
                        vaccine_id: vaccine.vaccine_id,
                        type: vaccine.type,
                        effect: vaccine.effect,
                        note: vaccine.note,
                        age: vaccine.age,
                        name: vaccine.name || vaccine.type,
                    };

                    // setSelectedVaccine(autoData);

                    setFormData((prev) => ({
                        ...prev,
                        vaccine_id: vaccine.vaccine_id,
                        old_vaccine_id: vaccine.vaccine_id,
                        dose_number: 2,
                        next_dose_number: 3,
                    }));
                }
            } catch (err) {
                console.error("fetch vaccination history error", err);
            }
        };

        if (appointmentId) {
            fetchVaccinationHistory();
        }
    }, [appointmentId, setFormData]);
    // useEffect(() => {
    //     if (formData.vaccine_id && vaccineList.length > 0) {
    //         const vaccine = vaccineList.find(
    //             (v) => v.vaccine_id === formData.vaccine_id
    //         );

    //         if (vaccine) {
    //             setSelectedVaccine(vaccine);
    //         }
    //     }
    // }, [formData.vaccine_id, vaccineList]);

    useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetchWithRefresh(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/appointments/doctors?role=nurse`
        )

        const data = await res.json()

        const options = (data.data || []).map((doctor: any) => ({
          label: doctor.fullname,
          value: doctor.id,
        }))

        setDoctorOptions(options)

      } catch (err) {
        console.error("fetch doctors error:", err)
      }
    }

    fetchDoctors()
  }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange =
        (field: keyof VaccineFormData) => (value: string) => {
            setFormData((prev) => ({
                ...prev,
                [field]: value,
            }));

            // const vaccine = vaccineList.find((v) => v.vaccine_id === value);

            // if (vaccine) {
            //     setSelectedVaccine(vaccine);
            // }
        };

    const isFormValid = useMemo(() => {
        return (
            formData.vaccine_id &&
            formData.vaccine_doctor_id &&
            formData.date
        );
    }, [formData]);

    return (
        <div className="px-6 py-6">
            <h2 className="text-xl font-semibold">เพิ่มใบนัด</h2>
            <h3 className="text-lg font-semibold mt-3">ประวัติการฉีดวัคซีน</h3>
            {patientInfo && (
                <div className="text-sm font-medium mb-6 mt-3">
                    <div className="flex gap-6 text-sm font-semibold">
                        <p>ชื่อ - นามสกุล {patientInfo.fullname}</p>
                        <p>หมายเลขประจำตัวผู้ป่วย : {patientInfo.hn_number}</p>
                    </div>
                    <p className="mt-1 text-sm font-semibold">
                        อายุ : {patientInfo.age_years} ปี {patientInfo.age_months} เดือน{" "}
                        {patientInfo.age_days} วัน
                    </p>
                </div>
            )}
            <div className="grid grid-cols-2 gap-12">
                <div>
                    <h3 className="font-semibold mb-2">ข้อมูลวัคซีน</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <SelectField
                            id="vaccine_id"
                            label="ชื่อวัคซีน"
                            name="vaccine_id"
                            value={formData.vaccine_id || ""}
                            onValueChange={handleSelectChange("vaccine_id")}
                            options={vaccineOptions}
                            required
                        />
                        <InputField
                            id="vaccine_name"
                            label="ชนิดวัคซีน"
                            value={selectedVaccine?.type || ""}
                            readOnly
                            name="vaccine_name"
                            disabled={!!selectedVaccine}
                        />
                        <InputField
                            id="date"
                            label="วันที่ฉีดวัคซีน"
                            name="date"
                            type="date"
                            value={formData.date || ""}
                            onChange={handleChange}
                            required
                            max={new Date().toISOString().split("T")[0]}
                        />
                        <InputField
                            id="effect"
                            label="ผลข้างเคียง"
                            value={selectedVaccine?.effect || ""}
                            readOnly
                            name=""
                        />
                    </div>
                    <div className="mt-3 w-full">
                        <label className="block mb-2 text-sm font-medium">คำแนะนำ</label>
                        <textarea
                            value={selectedVaccine?.note || ""}
                            readOnly
                            rows={4}
                            className="w-full border rounded-md px-4 py-3 resize-none"
                        />
                    </div>
                </div>
                <div>
                    <h3 className="font-semibold mb-2">เจ้าหน้าที่ฉีดวัคซีน</h3>
                    <div className="grid grid-cols-1">
                        <SelectField
                            id="vaccine_doctor_id"
                            name="vaccine_doctor_id"
                            label="ชื่อเจ้าหน้าที่"
                            placeholder="เลือกเจ้าหน้าที่"
                            value={formData.vaccine_doctor_id}
                            onValueChange={handleSelectChange("vaccine_doctor_id")}
                            options={doctorOptions}
                            required
                        />
                    </div>
                </div>
            </div>
            <div className="flex justify-end mt-10">
                <Button
                    onClick={onNext}
                    disabled={!isFormValid}
                    className="text-Bamboo-100 bg-white border-2 border-Bamboo-100 font-semibold hover:bg-gray-200"
                >
                    ถัดไป
                    <StepForward className="ml-2" />
                </Button>
            </div>
        </div>
    );
}