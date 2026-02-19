"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/shadcn/ui/button";
import { UserRoundPlus } from "lucide-react";
import { SortTablePatient } from "./_components/patient-table";

export default function Page() {
  const router = useRouter();
  
  return (
    <div className="py-2">
      <div className="w-full bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-4 sm:gap-0">
          <h2 className="text-2xl font-bold">รายชื่อผู้ป่วย</h2>
          <Button
            onClick={() => router.push("/patient/new")}
            className="bg-Bamboo-100 hover:bg-gray-300 text-white text-md font-semibold w-full sm:w-auto shadow-[0_10px_20px_rgba(5,84,141,0.15)]"
          >
            สร้างบัญชี
            <UserRoundPlus className="ml-2" />
          </Button>
        </div>
        <SortTablePatient />
      </div>
    </div>
  );
}
