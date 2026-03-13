"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Cookies from "js-cookie";

export default function RelativeSection() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [relative, setRelative] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const fetchRelative = async () => {
      try {
        const token = Cookies.get("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/patients/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        const r = data?.data?.[0]?.relative;

        setRelative(r);
      } catch (err) {
        console.error("fetch relative error", err);
      }
    };

    fetchRelative();
  }, [id]);

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return "-";
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  };

  const InfoBlock = ({
    title,
    person,
  }: {
    title: string;
    person: any;
  }) => (
    <div className="pt-3 mt-3">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-30">
        <div>
          <h4 className="text-sm font-semibold mb-2">ข้อมูลส่วนตัว</h4>
          <div className="space-y-3">
            <p>ชื่อ - นามสกุล : {person?.fullname || "-"}</p>
            <p>เบอร์โทรศัพท์ : {formatPhoneNumber(person?.phonenumber)}</p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-2">ที่อยู่</h4>

          <div className="grid grid-cols-2 gap-x-20 text-sm gap-y-2 mb-2">
            <p>เลขที่ : {person?.address?.house_number || "-"}</p>
            <p>หมู่ที่ : {person?.address?.village_number || "-"}</p>
            <p>ตรอก/ซอย : {person?.address?.alley || "-"}</p>
            <p>ถนน : {person?.address?.road || "-"}</p>
            <p>อำเภอ : {person?.address?.district || "-"}</p>
            <p>ตำบล : {person?.address?.subdistrict || "-"}</p>
            <p>จังหวัด : {person?.address?.province || "-"}</p>
            <p>เลขไปรษณีย์ : {person?.address?.zipcode || "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );

  if (!relative) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold">ข้อมูลญาติผู้ป่วย</h2>

      <div className="text-sm">
        <InfoBlock title="" person={relative.kin} />
      </div>

      <div className="border-t mt-8 pt-1 text-sm">
        <InfoBlock
          title="ผู้ดูแลกำกับการกินยา"
          person={relative.caretaker}
        />
      </div>

      <div className="border-t mt-8 pt-1 text-sm">
        <InfoBlock
          title="ผู้รับยาผู้ป่วย"
          person={relative.medicine}
        />
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={() => router.push(`/patient/${id}/edit/relative`)}
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