'use client';
import { InputField } from "@/components/inputfield";
import { SelectField } from "@/components/selectfield";
import { Button } from "@/shadcn/ui/button";
import { Save, Check } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { Separator } from "@/shadcn/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shadcn/ui/dialog";
import { useParams } from "next/navigation"
import { fetchWithRefresh } from "@/lib/api";

interface RelativeDataProp {
  relative: Relative;
  setRelative: React.Dispatch<React.SetStateAction<Relative>>;
}

export type RelativeData = {
  title: string;
  firstname: string;
  lastname: string;
  phonenumber: string;
  address: {
    house_number: string;
    village_number: string;
    alley: string;
    road: string;
    subdistrict: string;
    district: string;
    province: string;
    zipcode: string;
  }
};

export type Relative = {
  kin: RelativeData;
  caretaker: RelativeData;
  medicine: RelativeData;
};

const createRelativeData = (): RelativeData => ({
  title: "",
  firstname: "",
  lastname: "",
  phonenumber: "",
  address: {
    house_number: "",
    village_number: "",
    alley: "",
    road: "",
    subdistrict: "",
    district: "",
    province: "",
    zipcode: "",
  },
});

export const INITIAL_RELATIVE: Relative = {
  kin: createRelativeData(),
  caretaker: createRelativeData(),
  medicine: createRelativeData(),
};

type ErrorState = {
  kin: Partial<Record<keyof RelativeData | keyof RelativeData["address"], string>>;
  caretaker: Partial<Record<keyof RelativeData | keyof RelativeData["address"], string>>;
  medicine: Partial<Record<keyof RelativeData | keyof RelativeData["address"], string>>;
};

const TITLE_OPTIONS = [
  { label: "นาย", value: "นาย" }, { label: "นาง", value: "นาง" },
  { label: "นางสาว", value: "นางสาว" }, { label: "เด็กชาย", value: "เด็กชาย" },
  { label: "เด็กหญิง", value: "เด็กหญิง" },
];

const fieldLabels: Record<string, string> = {
  firstname: "ชื่อ", lastname: "นามสกุล", phonenumber: "เบอร์โทรศัพท์",
  house_number: "บ้านเลขที่", village_number: "หมู่", subdistrict: "เขต/อำเภอ",
  district: "แขวง/ตำบล", province: "จังหวัด", zipcode: "รหัสไปรษณีย์",
};

function RelativeSection({
  sectionLabel,
  data,
  section,
  errors,
  required,
  onSelectChange,
  onChange,
  onAddressChange,
}: {
  sectionLabel?: string;
  data: RelativeData;
  section: keyof Relative;
  errors: Partial<Record<string, string>>;
  required?: boolean;
  onSelectChange: (s: keyof Relative, f: keyof RelativeData, v: string) => void;
  onChange: (s: keyof Relative, f: keyof RelativeData, v: string) => void;
  onAddressChange: (s: keyof Relative, f: keyof RelativeData["address"], v: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24 mb-8">
      <div>
        {sectionLabel && <div className="mb-2 font-semibold text-md">{sectionLabel}</div>}
        <div className="mb-4 font-semibold text-md">ข้อมูลส่วนตัว</div>

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
            required={required}
            value={data.firstname}
            onChange={(e) => onChange(section, "firstname", e.target.value)}
            errorMessage={errors.firstname}
          />
          <InputField
            id={`${section}-lastname`}
            name="lastname" label="นามสกุล"
            required={required}
            value={data.lastname}
            onChange={(e) => onChange(section, "lastname", e.target.value)}
            errorMessage={errors.lastname}
          />
          <InputField
            id={`${section}-phonenumber`}
            name="phonenumber"
            label="เบอร์โทรศัพท์"
            required={required}
            value={data.phonenumber}
            onChange={(e) => onChange(section, "phonenumber", e.target.value)}
            errorMessage={errors.phonenumber}
          />
        </div>
      </div>

      <div>
        <div className="mb-4 font-semibold text-md mt-0 lg:mt-10">
          ที่อยู่
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField id={`${section}-house_number`}
            name="house_number"
            label="บ้านเลขที่"
            required={required}
            value={data.address.house_number}
            onChange={(e) => onAddressChange(section, "house_number", e.target.value)}
            errorMessage={errors.house_number}
          />

          <InputField
            id={`${section}-village_number`}
            name="village_number" label="หมู่"
            required={required}
            value={data.address.village_number}
            onChange={(e) => onAddressChange(section, "village_number", e.target.value)}
            errorMessage={errors.village_number}
          />

          <InputField id={`${section}-alley`}
            name="alley"
            label="ตรอก/ซอย"
            value={data.address.alley}
            onChange={(e) => onAddressChange(section, "alley", e.target.value)}
          />

          <InputField
            id={`${section}-road`}
            name="road"
            label="ถนน"
            value={data.address.road}
            onChange={(e) => onAddressChange(section, "road", e.target.value)}
          />

          <InputField
            id={`${section}-subdistrict`}
            name="subdistrict"
            label="เขต/อำเภอ"
            required={required}
            value={data.address.subdistrict}
            onChange={(e) => onAddressChange(section, "subdistrict", e.target.value)}
            errorMessage={errors.subdistrict}
          />

          <InputField
          id={`${section}-district`}
          name="district"
          label="แขวง/ตำบล"
          required={required}
          value={data.address.district}
          onChange={(e) => onAddressChange(section, "district", e.target.value)}
          errorMessage={errors.district}
          />
          <InputField
            id={`${section}-province`}
            name="province"
            label="จังหวัด"
            required={required}
            value={data.address.province}
            onChange={(e) => onAddressChange(section, "province", e.target.value)}
            errorMessage={errors.province}
          />
          <InputField
            id={`${section}-zipcode`}
            name="zipcode"
            label="รหัสไปรษณีย์"
            required={required}
            value={data.address.zipcode}
            onChange={(e) => onAddressChange(section, "zipcode", e.target.value)}
            errorMessage={errors.zipcode}
          />
        </div>
      </div>
    </div>
  );
}

export default function EditRelativeData({ relative, setRelative }: RelativeDataProp) {
  const [errors, setErrors] = useState<ErrorState>({ kin: {}, caretaker: {}, medicine: {} });
  const params = useParams();
  const id = params.id as string;
  const [openSuccess, setOpenSuccess] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchRelative = async () => {
      const res = await fetchWithRefresh(`${process.env.NEXT_PUBLIC_API_URL}/v1/admins/patients/${id}`);
      if (!res.ok) throw new Error("API error");
      const result = await res.json();
      const p = result.data[0];

      const mapRelative = (rel: any): RelativeData => {
        const fullname = rel.fullname || "";
        const titleList = ["เด็กหญิง", "เด็กชาย", "นางสาว", "นาย", "นาง"].sort((a, b) => b.length - a.length);
        let extractedTitle = "";
        let remainingName = fullname;
        for (const t of titleList) {
          if (fullname.startsWith(t)) { extractedTitle = t; remainingName = fullname.replace(t, "").trim(); break; }
        }
        const nameParts = remainingName.split(" ");
        return {
          title: extractedTitle, firstname: nameParts[0] || "", lastname: nameParts.slice(1).join(" ") || "",
          phonenumber: rel.phonenumber || "",
          address: {
            house_number: rel.address?.house_number || "", village_number: rel.address?.village_number || "",
            alley: rel.address?.alley || "", road: rel.address?.road || "",
            subdistrict: rel.address?.subdistrict || "", district: rel.address?.district || "",
            province: rel.address?.province || "", zipcode: rel.address?.zipcode || "",
          },
        };
      };

      setRelative({ kin: mapRelative(p.relative.kin), caretaker: mapRelative(p.relative.caretaker), medicine: mapRelative(p.relative.medicine) });
    };
    fetchRelative();
  }, [id]);

  useEffect(() => {
    if (!openSuccess) return;
    const timer = setTimeout(() => setOpenSuccess(false), 3000);
    return () => clearTimeout(timer);
  }, [openSuccess]);

  const handleSelectChange = (
    section: keyof Relative,
    field: keyof RelativeData,
    value: string) => {
      setRelative((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
      setErrors((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value.trim() === "" ? `กรุณากรอก${fieldLabels[field] ?? field}` : "" } }));
    };

  const handleChange = (
    section: keyof Relative,
    field: keyof RelativeData,
    value: string) => {
      const newValue = field === "phonenumber" ? value.replace(/\D/g, "") : value;
      setRelative((prev) => ({ ...prev, [section]: { ...prev[section], [field]: newValue } }));
      setErrors((prev) => ({ ...prev, [section]: { ...prev[section], [field]: newValue.trim() === "" ? `กรุณากรอก${fieldLabels[field] ?? field}` : "" } }));
    };

  const handleAddressChange = (
    section: keyof Relative,
    field: keyof RelativeData["address"],
    value: string) => {
      setRelative((prev) => ({ ...prev, [section]: { ...prev[section], address: { ...prev[section].address, [field]: value } } }));
      setErrors((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value.trim() === "" ? `กรุณากรอก${fieldLabels[field] ?? field}` : "" } }));
    };

  const isFormValid = useMemo(() => {
    const p = relative.kin;
    return !!(p.firstname && p.lastname && p.phonenumber &&
      p.address.house_number && p.address.village_number &&
      p.address.subdistrict && p.address.district && p.address.province && p.address.zipcode);
  }, [relative]);

  const handleSubmit = async () => {
    const res = await fetchWithRefresh(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/patients/${id}/relatives`, 
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kin: relative.kin, caretaker: relative.caretaker, medicine: relative.medicine }),
      });

    if (res.ok) setOpenSuccess(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4">
      <div className="mb-6 font-semibold text-xl">แก้ไขข้อมูลญาติผู้ป่วย</div>

      <RelativeSection
        data={relative.kin}
        section="kin"
        errors={errors.kin}
        required
        onSelectChange={handleSelectChange}
        onChange={handleChange}
        onAddressChange={handleAddressChange}
      />

      <Separator className="mb-8" />

      <RelativeSection
        sectionLabel="ผู้ดูแลกำกับการกินยา"
        data={relative.caretaker}
        section="caretaker"
        errors={errors.caretaker}
        onSelectChange={handleSelectChange}
        onChange={handleChange}
        onAddressChange={handleAddressChange}
      />

      <Separator className="mb-8" />

      <RelativeSection
        sectionLabel="ผู้ป้อนยาผู้ป่วย"
        data={relative.medicine}
        section="medicine"
        errors={errors.medicine}
        onSelectChange={handleSelectChange}
        onChange={handleChange}
        onAddressChange={handleAddressChange}
      />

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
