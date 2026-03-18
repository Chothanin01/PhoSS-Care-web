"use client";

import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import Cookies from "js-cookie";

export default function OfficerSection() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [officer, setOfficer] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const fetchOfficer = async () => {
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

        const o = data?.data?.[0]?.officer;

        setOfficer(o);
      } catch (err) {
        console.error("fetch officer error", err);
      }
    };

    fetchOfficer();
  }, [id]);

  if (!officer) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold mb-8">ข้อมูลโรงพยาบาล</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-30">
        <div>
          <h3 className="font-semibold mb-2">เจ้าหน้าที่เยี่ยมบ้าน</h3>
          <p className="text-sm">
            ชื่อ - นามสกุล : {officer?.house?.fullname || "-"}
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">เจ้าหน้าที่</h3>
          <p className="text-sm">
            ชื่อ - นามสกุล : {officer?.nurse?.fullname || "-"}
          </p>
        </div>
      </div>

      <div className="flex justify-end mt-10">
        <button
          onClick={() => router.push(`/patient/${id}/edit/officer`)}
          className="flex items-center gap-2 px-4 py-2 
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