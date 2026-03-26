"use client";

import { useMemo, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";
import { InputField } from "@/components/inputfield";
import { SelectField } from "@/components/selectfield";
import { Button } from "@/shadcn/ui/button";
import { StepForward } from "lucide-react";

const DOCTOR_TITLES = [
    { label: "นายเเพทย์", value: "นายแพทย์" },
    { label: "เเพทย์หญิง", value: "แพทย์หญิง" },
];

type VaccineFormData = {
    vaccine_id: string;
    old_vaccine_id: string;
    dose_number: number;
    next_dose_number: number;
    vaccine_doctor_title: string;
    vaccine_doctor_firstname: string;
    vaccine_doctor_lastname: string;
    doctor_title: string;
    doctor_firstname: string;
    doctor_lastname: string;
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
    const [selectedVaccine, setSelectedVaccine] = useState<VaccineData | null>(null);

    useEffect(() => {
        const fetchPatientInfo = async () => {
            try {
                const token = Cookies.get("token");

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/patients/${appointmentId}/info`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
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
                const token = Cookies.get("token");

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/diseases/vaccines`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = await res.json();
                const list = data?.data || [];

                setVaccineList(list);

                const options = list.map((v: VaccineData) => ({
                    label: v.type,
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
                const token = Cookies.get("token");

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/appointments/${appointmentId}/vaccination`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json();

                console.log("vaccination history:", data);

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

                    setSelectedVaccine(autoData);

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
    useEffect(() => {
        if (formData.vaccine_id && vaccineList.length > 0) {
            const vaccine = vaccineList.find(
                (v) => v.vaccine_id === formData.vaccine_id
            );

            if (vaccine) {
                setSelectedVaccine(vaccine);
            }
        }
    }, [formData.vaccine_id, vaccineList]);


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

            const vaccine = vaccineList.find((v) => v.vaccine_id === value);

            if (vaccine) {
                setSelectedVaccine(vaccine);
            }
        };

    const isFormValid = useMemo(() => {
        return (
            formData.vaccine_id &&
            formData.vaccine_doctor_title &&
            formData.vaccine_doctor_firstname &&
            formData.vaccine_doctor_lastname &&
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
                            label="ชนิดวัคซีน"
                            name="vaccine_id"
                            placeholder="เลือกวัคซีน"
                            value={formData.vaccine_id || ""}
                            onValueChange={handleSelectChange("vaccine_id")}
                            options={vaccineOptions}
                            disabled={!!selectedVaccine}
                            className="text-black"
                        />
                        <InputField
                            id="vaccine_name"
                            label="ชื่อวัคซีน"
                            value={selectedVaccine?.name || ""}
                            readOnly
                            name=""
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
                    <h3 className="font-semibold -mt-1">เจ้าหน้าที่ฉีดวัคซีน</h3>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                        <SelectField
                            id="vaccine_doctor_title"
                            label="คำนำหน้า"
                            name="vaccine_doctor_title"
                            placeholder="เลือกคำนำหน้า"
                            value={formData.vaccine_doctor_title || ""}
                            onValueChange={handleSelectChange("vaccine_doctor_title")}
                            options={DOCTOR_TITLES}
                        />
                        <div />
                        <InputField
                            id="vaccine_doctor_firstname"
                            label="ชื่อ"
                            name="vaccine_doctor_firstname"
                            value={formData.vaccine_doctor_firstname || ""}
                            onChange={handleChange}
                            required
                        />
                        <InputField
                            id="vaccine_doctor_lastname"
                            label="นามสกุล"
                            name="vaccine_doctor_lastname"
                            value={formData.vaccine_doctor_lastname || ""}
                            onChange={handleChange}
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