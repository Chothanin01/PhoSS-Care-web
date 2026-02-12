'use client';
import { InputField } from "@/components/inputfield";
import { SelectField } from "@/components/selectfield";
import { Button } from "@/shadcn/ui/button";
import { StepForward, StepBack } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { Separator } from "@/shadcn/ui/separator";

interface RelativeDataProp {
  onNext: () => void;
  onBack: () => void;
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

export default function RelativeData({ onNext, onBack, relative, setRelative }: RelativeDataProp) {

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
    const sections = ["kin", "caretaker", "medicine"] as const;

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

  const handleNext = () => {
    onNext();
  };

  const handleBack = () => {
    onBack();
  }

  return (
    <div className="w-full mx-auto p-4">

      <div className="mb-6 font-semibold text-xl">
        ข้อมูลญาติผู้ป่วย
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
              />
              
              <InputField
                id="road"
                name="road"
                label="ถนน"
                value={relative.kin.address.road}
                onChange={(e) =>
                  handleAddressChange("kin", "road", e.target.value)
                }
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
                required
                value={relative.caretaker.firstname}
                onChange={(e) =>
                  handleChange("caretaker", "firstname", e.target.value)
                }
                errorMessage={errors.caretaker.firstname}
              />

              <InputField
                id="lastname"
                name="lastname"
                label="นามสกุล"
                required
                value={relative.caretaker.lastname}
                onChange={(e) =>
                  handleChange("caretaker", "lastname", e.target.value)
                }
                errorMessage={errors.caretaker.lastname}
              />

              <InputField
                id="phonenumber"
                name="phonenumber"
                label="เบอร์โทรศัพท์"
                required
                value={relative.caretaker.phonenumber}
                onChange={(e) =>
                  handleChange("caretaker", "phonenumber", e.target.value)
                }
                errorMessage={errors.caretaker.phonenumber}
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
                required
                value={relative.caretaker.address.house_number}
                onChange={(e) =>
                  handleAddressChange("caretaker", "house_number", e.target.value)
                }
                errorMessage={errors.caretaker.house_number}
              />
              
              <InputField
                  id="village_number"
                  name="village_number"
                  label="หมู่"
                  required
                  value={relative.caretaker.address.village_number}
                  onChange={(e) =>
                    handleAddressChange("caretaker", "village_number", e.target.value)
                  }
                  errorMessage={errors.caretaker.village_number}
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
              />
              
              <InputField
                id="road"
                name="road"
                label="ถนน"
                value={relative.caretaker.address.road}
                onChange={(e) =>
                  handleAddressChange("caretaker", "road", e.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6.5"> 
              <InputField
                id="subdistrict"
                name="subdistrict"
                label="เขต/อำเภอ"
                required
                value={relative.caretaker.address.subdistrict}
                onChange={(e) =>
                  handleAddressChange("caretaker", "subdistrict", e.target.value)
                }
                errorMessage={errors.caretaker.subdistrict}
              />
              
              <InputField
                id="district"
                name="district"
                label="แขวง/ตำบล"
                required
                value={relative.caretaker.address.district}
                onChange={(e) =>
                  handleAddressChange("caretaker", "district", e.target.value)
                }
                errorMessage={errors.caretaker.district}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
              <InputField
                id="province"
                name="province"
                label="จังหวัด"
                required
                value={relative.caretaker.address.province}
                onChange={(e) =>
                  handleAddressChange("caretaker", "province", e.target.value)
                }
                errorMessage={errors.caretaker.province}
              />
              
              <InputField
                id="zipcode"
                name="zipcode"
                label="รหัสไปรษณีย์"
                required
                value={relative.caretaker.address.zipcode}
                onChange={(e) =>
                  handleAddressChange("caretaker", "zipcode", e.target.value)
                }
                errorMessage={errors.caretaker.zipcode}
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
              required
              value={relative.medicine.firstname}
              onChange={(e) =>
                handleChange("medicine", "firstname", e.target.value)
              }
              errorMessage={errors.medicine.firstname}
            />

            <InputField
              id="lastname"
              name="lastname"
              label="นามสกุล"
              required
              value={relative.medicine.lastname}
              onChange={(e) =>
                handleChange("medicine", "lastname", e.target.value)
              }
              errorMessage={errors.medicine.lastname}
            />

            <InputField
              id="phonenumber"
              name="phonenumber"
              label="เบอร์โทรศัพท์"
              required
              value={relative.medicine.phonenumber}
              onChange={(e) =>
                handleChange("medicine", "phonenumber", e.target.value)
              }
              errorMessage={errors.medicine.phonenumber}
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
                required
                value={relative.medicine.address.house_number}
                onChange={(e) =>
                  handleAddressChange("medicine", "house_number", e.target.value)
                }
                errorMessage={errors.medicine.house_number}
              />
              
              <InputField
                id="village_number"
                name="village_number"
                label="หมู่"
                required
                value={relative.medicine.address.village_number}
                onChange={(e) =>
                  handleAddressChange("medicine", "village_number", e.target.value)
                }
                errorMessage={errors.medicine.village_number}
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
              />
              
              <InputField
                id="road"
                name="road"
                label="ถนน"
                value={relative.medicine.address.road}
                onChange={(e) =>
                  handleAddressChange("medicine", "road", e.target.value)
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6.5"> 
              <InputField
                id="subdistrict"
                name="subdistrict"
                label="เขต/อำเภอ"
                required
                value={relative.medicine.address.subdistrict}
                onChange={(e) =>
                  handleAddressChange("medicine", "subdistrict", e.target.value)
                }
                errorMessage={errors.medicine.subdistrict}
              />
              
              <InputField
                id="district"
                name="district"
                label="แขวง/ตำบล"
                required
                value={relative.medicine.address.district}
                onChange={(e) =>
                  handleAddressChange("medicine", "district", e.target.value)
                }
                errorMessage={errors.medicine.district}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
              <InputField
                id="province"
                name="province"
                label="จังหวัด"
                required
                value={relative.medicine.address.province}
                onChange={(e) =>
                  handleAddressChange("medicine", "province", e.target.value)
                }
                errorMessage={errors.medicine.province}
              />
              
              <InputField
                id="zipcode"
                name="zipcode"
                label="รหัสไปรษณีย์"
                required
                value={relative.medicine.address.zipcode}
                onChange={(e) =>
                  handleAddressChange("medicine", "zipcode", e.target.value)
                }
                errorMessage={errors.medicine.zipcode}
              />
            </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="flex justify-start mt-8">
          <Button onClick={handleBack} className="text-Bamboo-100 bg-white border-2 border-Bamboo-100 font-semibold hover:bg-gray-200">
            ย้อนกลับ
            <StepBack className="ml-2"/>
          </Button>
        </div>

        <div className="flex justify-end mt-8">
          <Button 
            onClick={handleNext}
            className="text-Bamboo-100 bg-white border-2 border-Bamboo-100 font-semibold hover:bg-gray-200"
            disabled={!isFormValid}
          >
            ถัดไป
            <StepForward className="ml-2"/>
          </Button>
        </div>
      </div>
    </div>
  );
}