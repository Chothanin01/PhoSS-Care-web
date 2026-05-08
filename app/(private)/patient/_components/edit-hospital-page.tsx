'use client';
import { InputField } from "@/components/inputfield";
import { SelectField } from "@/components/selectfield";
import { Button } from "@/shadcn/ui/button";
import { Check, Save } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shadcn/ui/dialog";
import { useParams } from "next/navigation";
import { fetchWithRefresh } from "@/lib/api";

interface HospitalDataProp {
  officer: Officer;
  setOfficer: React.Dispatch<React.SetStateAction<Officer>>;
}

export type OfficerData = { title: string; firstname: string; lastname: string };
export type Officer = { house: OfficerData; nurse: OfficerData };

const createOfficerData = (): OfficerData => ({ title: "", firstname: "", lastname: "" });

export const INITIAL_OFFICE: Officer = { house: createOfficerData(), nurse: createOfficerData() };

type ErrorState = {
  house: Partial<Record<keyof OfficerData, string>>;
  nurse: Partial<Record<keyof OfficerData, string>>;
};

const TITLE_OPTIONS = [
  { label: "นาย", value: "นาย" },
  { label: "นาง", value: "นาง" },
  { label: "นางสาว", value: "นางสาว" },
];

const fieldLabels: Record<string, string> = { firstname: "ชื่อ", lastname: "นามสกุล" };

function OfficerSection({
  label,
  data,
  section,
  errors,
  onSelectChange,
  onChange,
}: {
  label: string;
  data: OfficerData;
  section: keyof Officer;
  errors: Partial<Record<keyof OfficerData, string>>;
  onSelectChange: (s: keyof Officer, f: keyof OfficerData, v: string) => void;
  onChange: (s: keyof Officer, f: keyof OfficerData, v: string) => void;
}) {
  return (
    <div>
      <div className="mb-4 font-semibold text-md">{label}</div>

      <div className="w-full sm:w-1/2 mb-6">
        <SelectField
          id={`${section}-title`}
          name="title"
          label="คำนำหน้า"
          placeholder="เลือกคำนำหน้า"
          value={data.title}
          onValueChange={(v) => onSelectChange(section, "title", v)}
          options={TITLE_OPTIONS}
          errorMessage={errors.title}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <InputField
          id={`${section}-firstname`}
          name="firstname"
          label="ชื่อ"
          required
          value={data.firstname}
          onChange={(e) => onChange(section, "firstname", e.target.value)}
          errorMessage={errors.firstname}
        />
        <InputField
          id={`${section}-lastname`}
          name="lastname"
          label="นามสกุล"
          required
          value={data.lastname}
          onChange={(e) => onChange(section, "lastname", e.target.value)}
          errorMessage={errors.lastname}
        />
      </div>
    </div>
  );
}

export default function EditHospitalData({ officer, setOfficer }: HospitalDataProp) {
  const params = useParams();
  const id = params.id as string;
  const [openSuccess, setOpenSuccess] = useState(false);
  const [errors, setErrors] = useState<ErrorState>({ house: {}, nurse: {} });

  useEffect(() => {
    if (!id) return;
    const fetchOfficer = async () => {
      const res = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/v1/admins/patients/${id}`);
      if (!res.ok) throw new Error("API error");
      const result = await res.json();
      const p = result.data[0];

      const mapOfficer = (rel: any): OfficerData => {
        const fullname = rel.fullname || "";
        const titleList = ["เด็กหญิง", "เด็กชาย", "นางสาว", "นาย", "นาง"].sort((a, b) => b.length - a.length);
        let extractedTitle = "";
        let remainingName = fullname;
        for (const t of titleList) {
          if (fullname.startsWith(t)) { extractedTitle = t; remainingName = fullname.replace(t, "").trim(); break; }
        }
        const nameParts = remainingName.split(" ");
        return { title: extractedTitle, firstname: nameParts[0] || "", lastname: nameParts.slice(1).join(" ") || "" };
      };

      setOfficer({ nurse: mapOfficer(p.officer.nurse), house: mapOfficer(p.officer.house) });
    };
    fetchOfficer();
  }, [id]);

  const handleSelectChange = (section: keyof Officer, field: keyof OfficerData, value: string) => {
    setOfficer((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
    setErrors((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value.trim() === "" ? `กรุณากรอก${fieldLabels[field] ?? field}` : "" } }));
  };

  const handleChange = (section: keyof Officer, field: keyof OfficerData, value: string) => {
    setOfficer((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
    setErrors((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value.trim() === "" ? `กรุณากรอก${fieldLabels[field] ?? field}` : "" } }));
  };

  const isFormValid = useMemo(() => (
    (["house", "nurse"] as const).every((s) => officer[s].firstname && officer[s].lastname)
  ), [officer]);

  const handleSubmit = async () => {
    const res = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/v1/admins/patients/${id}/officer`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ house: officer.house, nurse: officer.nurse }),
    });
    if (res.ok) { setOpenSuccess(true); setTimeout(() => setOpenSuccess(false), 3000); }
  };

  return (
    <div className="w-full p-4">
      <div className="mb-6 font-semibold text-xl">แก้ไขข้อมูลโรงพยาบาล</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24">
        <OfficerSection
          label="เจ้าหน้าที่เยี่ยมบ้าน"
          data={officer.house}
          section="house"
          errors={errors.house}
          onSelectChange={handleSelectChange}
          onChange={handleChange}
        />
        <OfficerSection
          label="เจ้าหน้าที่"
          data={officer.nurse}
          section="nurse"
          errors={errors.nurse}
          onSelectChange={handleSelectChange}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end mt-8">
        <Button
          onClick={handleSubmit}
          className="text-Bamboo-100 bg-white border-2 border-Bamboo-100 font-semibold hover:bg-gray-200 w-full sm:w-auto"
          disabled={!isFormValid}
        >
          บันทึก
          <Save className="ml-2" />
        </Button>
      </div>

      <Dialog open={openSuccess} onOpenChange={setOpenSuccess}>
        <DialogContent showCloseButton={false} className="w-[90vw] max-w-md text-center">
          <DialogTitle />
          <DialogDescription />
          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#b2e0a6]">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-Bamboo-400">
                <Check className="w-8 h-8 text-white" strokeWidth={3} />
              </div>
            </div>
          </div>
          <p className="text-lg font-semibold">ระบบได้เเก้ไขข้อมูลเรียบร้อยเเล้ว</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}