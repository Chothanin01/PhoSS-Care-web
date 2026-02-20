"use client";
import { Patient } from "@/app/utils/patient.mock";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  patient: Patient;
};

export default function RelativeSection({ patient }: Props) {
  const router = useRouter();
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "-";
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  };
  const InfoBlock = ({
    title,
    person,
  }: {
    title: string;
    person: {
      fullname: string;
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
      };
    };
  }) => (
    <div className=" pt-3 mt-3">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-30 ">
        <div>
          <h4 className="font-semibold mb-2 gap-y-2 mb-2">ข้อมูลส่วนตัว</h4>
          <p>ชื่อ - นามสกุล : {person.fullname}</p>
          <p>เบอร์โทรศัพท์ : {formatPhoneNumber(person.phonenumber)}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">ที่อยู่</h4>
          <div className="grid grid-cols-2 gap-x-20 text-sm gap-y-2 mb-2">
            <p>เลขที่ : {person.address.house_number}</p>
            <p>หมู่ที่ : {person.address.village_number || "-"}</p>
            <p>ตรอก/ซอย : {person.address.alley || "-"}</p>
            <p>ถนน : {person.address.road || "-"}</p>
            <p>อำเภอ : {person.address.district}</p>
            <p>ตำบล : {person.address.subdistrict}</p>
            <p>จังหวัด : {person.address.province}</p>
            <p>เลขไปรษณีย์ : {person.address.zipcode}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold">ข้อมูลญาติผู้ป่วย</h2>

      <InfoBlock title="" person={patient.relative.kin} />
      <div className="border-t mt-8 pt-1">
        <InfoBlock
          title="ผู้ดูแลกำกับการกินยา"
          person={patient.relative.caretaker}
        />
      </div>
      <div className="border-t mt-8 pt-1">
        <InfoBlock title="ผู้รับยาผู้ป่วย" person={patient.relative.medicine} />
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={() => router.push(`/patient/${patient.id}/edit/relative`)}
          className="flex items-center gap-2 px-4 py-2 mt-8
          border-2 border-Bamboo-100 text-Bamboo-100
          rounded-lg font-semibold
          hover:bg-Bamboo-100 hover:text-white transition"
        >
          แก้ไขข้อมูล
          <Pencil size={16} />
        </button>
      </div>
    </div>
  );
}
