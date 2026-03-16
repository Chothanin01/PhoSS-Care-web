'use client';
import { InputField } from "@/components/inputfield";
import { SelectField } from "@/components/selectfield";
import { Button } from "@/shadcn/ui/button";
import { Save, Check } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { Separator } from "@/shadcn/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shadcn/ui/dialog";
import { useParams } from "next/navigation"
import Cookies from "js-cookie";

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

export default function EditRelativeData({ relative, setRelative }: RelativeDataProp) {

  const [errors, setErrors] = useState<ErrorState>({
    kin: {},
    caretaker: {},
    medicine: {},
  });
  const fieldLabels: Record<string, string> = {
    firstname: "ชื่อ",
    lastname: "นามสกุล",
    phonenumber: "เบอร์โทรศัพท์",
    house_number: "บ้านเลขที่",
    village_number: "หมู่",
    subdistrict: "เขต/อำเภอ",
    district: "แขวง/ตำบล",
    province: "จังหวัด",
    zipcode: "รหัสไปรษณีย์",
  };

  const params = useParams()
  const id = params.id as string
  const [openSuccess, setOpenSuccess] = useState(false);

  useEffect(() => {
    const fetchRelative = async () => {
      const token = Cookies.get("token");

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/patients/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!res.ok) {
        throw new Error("API error")
      }

      const result = await res.json()

      const p = result.data[0]

      const mapRelative = (rel: any): RelativeData => {
        const fullname = rel.fullname || ""

        const titleList = ["เด็กหญิง","เด็กชาย","นางสาว","นาย","นาง"]
          .sort((a,b)=> b.length - a.length)

        let extractedTitle = ""
        let remainingName = fullname

        for (const t of titleList) {
          if (fullname.startsWith(t)) {
            extractedTitle = t
            remainingName = fullname.replace(t, "").trim()
            break
          }
        }

        const nameParts = remainingName.split(" ")

        return {
          title: extractedTitle,
          firstname: nameParts[0] || "",
          lastname: nameParts.slice(1).join(" ") || "",
          phonenumber: rel.phonenumber || "",
          address: {
            house_number: rel.address?.house_number || "",
            village_number: rel.address?.village_number || "",
            alley: rel.address?.alley || "",
            road: rel.address?.road || "",
            subdistrict: rel.address?.subdistrict || "",
            district: rel.address?.district || "",
            province: rel.address?.province || "",
            zipcode: rel.address?.zipcode || "",
          }
        }
      }

      setRelative({
        kin: mapRelative(p.relative.kin),
        caretaker: mapRelative(p.relative.caretaker),
        medicine: mapRelative(p.relative.medicine),
      })
    }

    if (id) fetchRelative()
  }, [id])

  const handleSelectChange = (
    section: keyof Relative,
    field: keyof RelativeData,
    value: string
  ) => {
    const label = fieldLabels[field as string] || field;

    setRelative(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));

    setErrors(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]:
          value.trim() === ""
            ? `กรุณากรอก${label}`
            : "",
      },
    }));
  };

  const handleChange = (
    section: keyof Relative,
    field: keyof RelativeData,
    value: string
  ) => {
    const label = fieldLabels[field as string] || field;
    let newValue = value;

    if (field === "phonenumber") {
      newValue = value.replace(/\D/g, "");

      setRelative(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          phonenumber: newValue,
        },
      }));

      setErrors(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          phonenumber:
            newValue.trim() === ""
              ? "กรุณากรอกเบอร์โทรศัพท์"
              : "",
        },
      }));

      return;
    }

    setRelative(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));

    setErrors(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]:
          value.trim() === ""
            ? `กรุณากรอก${label}`
            : "",
      },
    }));
  };

  const handleAddressChange = (
    section: keyof Relative,
    field: keyof RelativeData["address"],
    value: string
  ) => {
    const label = fieldLabels[field as string] || field;

    setRelative(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        address: {
          ...prev[section].address,
          [field]: value,
        },
      },
    }));

    setErrors(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]:
          value.trim() === ""
            ? `กรุณากรอก${label}`
            : "",
      },
    }));
  };

  const isFormValid = useMemo(() => {
    const sections = ["kin"] as const;

    return sections.every(section => {
      const p = relative[section];

      return (
        p.firstname &&
        p.lastname &&
        p.phonenumber &&
        p.address.house_number &&
        p.address.village_number &&
        p.address.subdistrict &&
        p.address.district &&
        p.address.province &&
        p.address.zipcode
      );
    });
  }, [relative]);

  const handleSubmit = async () => {
    const token = Cookies.get("token");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/patients/${id}/relatives`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          kin: relative.kin,
          caretaker: relative.caretaker,
          medicine: relative.medicine,
        }),
      }
    )

    if (res.ok) {
      setOpenSuccess(true)
    }

  }

  useEffect(() => {
    if (openSuccess) {
      const timer = setTimeout(() => {
        setOpenSuccess(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [openSuccess])


  return (
    <div className="w-full mx-auto p-4">

      <div className="mb-6 font-semibold text-xl">
        แก้ไขข้อมูลญาติผู้ป่วย
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-24 mb-8">
        <div>
          <div className="mb-4 font-semibold text-md">
            ข้อมูลส่วนตัว
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <SelectField
              id="title"
              name="title"
              label="คำนำหน้า"
              placeholder="เลือกคำนำหน้า"
              value={relative.kin.title}
              onValueChange={(value) =>
                handleSelectChange("kin", "title", value)
              }
              options={[
                { label: "นาย", value: "นาย" },
                { label: "นาง", value: "นาง" },
                { label: "นางสาว", value: "นางสาว" },
                { label: "เด็กชาย", value: "เด็กชาย" },
                { label: "เด็กหญิง", value: "เด็กหญิง" },
              ]}
              errorMessage={errors.kin.title}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              id="firstname"
              name="firstname"
              label="ชื่อ"
              required
              value={relative.kin.firstname}
              onChange={(e) =>
                handleChange("kin", "firstname", e.target.value)
              }
              errorMessage={errors.kin.firstname}
              className="w-62"
            />

            <InputField
              id="lastname"
              name="lastname"
              label="นามสกุล"
              required
              value={relative.kin.lastname}
              onChange={(e) =>
                handleChange("kin", "lastname", e.target.value)
              }
              errorMessage={errors.kin.lastname}
              className="w-62"
            />

            <InputField
              id="phonenumber"
              name="phonenumber"
              label="เบอร์โทรศัพท์"
              required
              value={relative.kin.phonenumber}
              onChange={(e) =>
                handleChange("kin", "phonenumber", e.target.value)
              }
              errorMessage={errors.kin.phonenumber}
              className="w-62"
            />
          </div>
        </div>

        <div>
          <div className="mb-4 font-semibold text-md">
            ที่อยู่
          </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6.5"> 
              <InputField
                id="house_number"
                name="house_number"
                label="บ้านเลขที่"
                required
                value={relative.kin.address.house_number}
                onChange={(e) =>
                  handleAddressChange("kin", "house_number", e.target.value)
                }
                errorMessage={errors.kin.house_number}
                className="w-62"
              />
              
              <InputField
                id="village_number"
                name="village_number"
                label="หมู่"
                required
                value={relative.kin.address.village_number}
                onChange={(e) =>
                  handleAddressChange("kin", "village_number", e.target.value)
                }
                errorMessage={errors.kin.village_number}
                className="w-62"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6.5"> 
              <InputField
                id="alley"
                name="alley"
                label="ตรอก/ซอย"
                value={relative.kin.address.alley}
                onChange={(e) =>
                  handleAddressChange("kin", "alley", e.target.value)
                }
                className="w-62"
              />
              
              <InputField
                id="road"
                name="road"
                label="ถนน"
                value={relative.kin.address.road}
                onChange={(e) =>
                  handleAddressChange("kin", "road", e.target.value)
                }
                className="w-62"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6.5"> 
              <InputField
                id="subdistrict"
                name="subdistrict"
                label="เขต/อำเภอ"
                required
                value={relative.kin.address.subdistrict}
                onChange={(e) =>
                  handleAddressChange("kin", "subdistrict", e.target.value)
                }
                errorMessage={errors.kin.subdistrict}
                className="w-62"
              />
              
              <InputField
                id="district"
                name="district"
                label="แขวง/ตำบล"
                required
                value={relative.kin.address.district}
                onChange={(e) =>
                  handleAddressChange("kin", "district", e.target.value)
                }
                errorMessage={errors.kin.district}
                className="w-62"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
              <InputField
                id="province"
                name="province"
                label="จังหวัด"
                required
                value={relative.kin.address.province}
                onChange={(e) =>
                  handleAddressChange("kin", "province", e.target.value)
                }
                errorMessage={errors.kin.province}
                className="w-62"
              />
              
              <InputField
                id="zipcode"
                name="zipcode"
                label="รหัสไปรษณีย์"
                required
                value={relative.kin.address.zipcode}
                onChange={(e) =>
                  handleAddressChange("kin", "zipcode", e.target.value)
                }
                errorMessage={errors.kin.zipcode}
                className="w-62"
              />
            </div>
        </div>
      </div>

      <Separator className="mb-8"/>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-24 mb-8">
        <div>
          <div className="mb-4 font-semibold text-md">
            ผู้ดูแลกำกับการกินยา
          </div>
          <div className="mb-4 font-semibold text-md">
            ข้อมูลส่วนตัว
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <SelectField
              id="title"
              name="title"
              label="คำนำหน้า"
              placeholder="เลือกคำนำหน้า"
              value={relative.caretaker.title}
              onValueChange={(value) =>
                handleSelectChange("caretaker", "title", value)
              }
              options={[
                { label: "นาย", value: "นาย" },
                { label: "นาง", value: "นาง" },
                { label: "นางสาว", value: "นางสาว" },
                { label: "เด็กชาย", value: "เด็กชาย" },
                { label: "เด็กหญิง", value: "เด็กหญิง" },
              ]}
              errorMessage={errors.caretaker.title}
            />
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputField
                id="firstname"
                name="firstname"
                label="ชื่อ"
                value={relative.caretaker.firstname}
                onChange={(e) =>
                  handleChange("caretaker", "firstname", e.target.value)
                }
                errorMessage={errors.caretaker.firstname}
                className="w-62"
              />

              <InputField
                id="lastname"
                name="lastname"
                label="นามสกุล"
                value={relative.caretaker.lastname}
                onChange={(e) =>
                  handleChange("caretaker", "lastname", e.target.value)
                }
                errorMessage={errors.caretaker.lastname}
                className="w-62"
              />

              <InputField
                id="phonenumber"
                name="phonenumber"
                label="เบอร์โทรศัพท์"
                value={relative.caretaker.phonenumber}
                onChange={(e) =>
                  handleChange("caretaker", "phonenumber", e.target.value)
                }
                errorMessage={errors.caretaker.phonenumber}
                className="w-62"
              />
            </div>
        </div>

        <div>
          <div className="mb-4 font-semibold text-md mt-10">
            ที่อยู่
          </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6.5"> 
              <InputField
                id="house_number"
                name="house_number"
                label="บ้านเลขที่"
                value={relative.caretaker.address.house_number}
                onChange={(e) =>
                  handleAddressChange("caretaker", "house_number", e.target.value)
                }
                errorMessage={errors.caretaker.house_number}
                className="w-62"
              />
              
              <InputField
                id="village_number"
                name="village_number"
                label="หมู่"
                value={relative.caretaker.address.village_number}
                onChange={(e) =>
                  handleAddressChange("caretaker", "village_number", e.target.value)
                }
                errorMessage={errors.caretaker.village_number}
                className="w-62"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6.5"> 
              <InputField
                id="alley"
                name="alley"
                label="ตรอก/ซอย"
                value={relative.caretaker.address.alley}
                onChange={(e) =>
                  handleAddressChange("caretaker", "alley", e.target.value)
                }
                className="w-62"
              />
              
              <InputField
                id="road"
                name="road"
                label="ถนน"
                value={relative.caretaker.address.road}
                onChange={(e) =>
                  handleAddressChange("caretaker", "road", e.target.value)
                }
                className="w-62"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6.5"> 
              <InputField
                id="subdistrict"
                name="subdistrict"
                label="เขต/อำเภอ"
                value={relative.caretaker.address.subdistrict}
                onChange={(e) =>
                  handleAddressChange("caretaker", "subdistrict", e.target.value)
                }
                errorMessage={errors.caretaker.subdistrict}
                className="w-62"
              />
              
              <InputField
                id="district"
                name="district"
                label="แขวง/ตำบล"
                value={relative.caretaker.address.district}
                onChange={(e) =>
                  handleAddressChange("caretaker", "district", e.target.value)
                }
                errorMessage={errors.caretaker.district}
                className="w-62"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
              <InputField
                id="province"
                name="province"
                label="จังหวัด"
                value={relative.caretaker.address.province}
                onChange={(e) =>
                  handleAddressChange("caretaker", "province", e.target.value)
                }
                errorMessage={errors.caretaker.province}
                className="w-62"
              />
              
              <InputField
                id="zipcode"
                name="zipcode"
                label="รหัสไปรษณีย์"
                value={relative.caretaker.address.zipcode}
                onChange={(e) =>
                  handleAddressChange("caretaker", "zipcode", e.target.value)
                }
                errorMessage={errors.caretaker.zipcode}
                className="w-62"
              />
            </div>
        </div>
      </div>

      <Separator className="mb-8"/>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-24 mb-8">
        <div>
          <div className="mb-4 font-semibold text-md">
            ผู้ป้อนยาผู้ป่วย
          </div>
          <div className="mb-4 font-semibold text-md">
            ข้อมูลส่วนตัว
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <SelectField
              id="title"
              name="title"
              label="คำนำหน้า"
              placeholder="เลือกคำนำหน้า"
              value={relative.medicine.title}
              onValueChange={(value) =>
                handleSelectChange("medicine", "title", value)
              }
              options={[
                { label: "นาย", value: "นาย" },
                { label: "นาง", value: "นาง" },
                { label: "นางสาว", value: "นางสาว" },
                { label: "เด็กชาย", value: "เด็กชาย" },
                { label: "เด็กหญิง", value: "เด็กหญิง" },
              ]}
              errorMessage={errors.medicine.title}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              id="firstname"
              name="firstname"
              label="ชื่อ"
              value={relative.medicine.firstname}
              onChange={(e) =>
                handleChange("medicine", "firstname", e.target.value)
              }
              errorMessage={errors.medicine.firstname}
              className="w-62"
            />

            <InputField
              id="lastname"
              name="lastname"
              label="นามสกุล"
              value={relative.medicine.lastname}
              onChange={(e) =>
                handleChange("medicine", "lastname", e.target.value)
              }
              errorMessage={errors.medicine.lastname}
              className="w-62"
            />

            <InputField
              id="phonenumber"
              name="phonenumber"
              label="เบอร์โทรศัพท์"
              value={relative.medicine.phonenumber}
              onChange={(e) =>
                handleChange("medicine", "phonenumber", e.target.value)
              }
              errorMessage={errors.medicine.phonenumber}
              className="w-62"
            />
          </div>
        </div>

        <div>
          <div className="mb-4 font-semibold text-md mt-10">
            ที่อยู่
          </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6.5"> 
              <InputField
                id="house_number"
                name="house_number"
                label="บ้านเลขที่"
                value={relative.medicine.address.house_number}
                onChange={(e) =>
                  handleAddressChange("medicine", "house_number", e.target.value)
                }
                errorMessage={errors.medicine.house_number}
                className="w-62"
              />
              
              <InputField
                id="village_number"
                name="village_number"
                label="หมู่"
                value={relative.medicine.address.village_number}
                onChange={(e) =>
                  handleAddressChange("medicine", "village_number", e.target.value)
                }
                errorMessage={errors.medicine.village_number}
                className="w-62"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6.5"> 
              <InputField
                id="alley"
                name="alley"
                label="ตรอก/ซอย"
                value={relative.medicine.address.alley}
                onChange={(e) =>
                  handleAddressChange("medicine", "alley", e.target.value)
                }
                className="w-62"
              />
              
              <InputField
                id="road"
                name="road"
                label="ถนน"
                value={relative.medicine.address.road}
                onChange={(e) =>
                  handleAddressChange("medicine", "road", e.target.value)
                }
                className="w-62"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6.5"> 
              <InputField
                id="subdistrict"
                name="subdistrict"
                label="เขต/อำเภอ"
                value={relative.medicine.address.subdistrict}
                onChange={(e) =>
                  handleAddressChange("medicine", "subdistrict", e.target.value)
                }
                errorMessage={errors.medicine.subdistrict}
                className="w-62"
              />
              
              <InputField
                id="district"
                name="district"
                label="แขวง/ตำบล"
                value={relative.medicine.address.district}
                onChange={(e) =>
                  handleAddressChange("medicine", "district", e.target.value)
                }
                errorMessage={errors.medicine.district}
                className="w-62"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
              <InputField
                id="province"
                name="province"
                label="จังหวัด"
                value={relative.medicine.address.province}
                onChange={(e) =>
                  handleAddressChange("medicine", "province", e.target.value)
                }
                errorMessage={errors.medicine.province}
                className="w-62"
              />
              
              <InputField
                id="zipcode"
                name="zipcode"
                label="รหัสไปรษณีย์"
                value={relative.medicine.address.zipcode}
                onChange={(e) =>
                  handleAddressChange("medicine", "zipcode", e.target.value)
                }
                errorMessage={errors.medicine.zipcode}
                className="w-62"
              />
            </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-8">
        <Button 
          onClick={handleSubmit}
          className="text-Bamboo-100 bg-white border-2 border-Bamboo-100 font-semibold hover:bg-gray-200"
          disabled={!isFormValid}
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