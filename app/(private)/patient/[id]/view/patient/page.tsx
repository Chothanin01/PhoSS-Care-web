"use client";

import PatientCard from "@/app/(private)/patient/_components/patient-viewdata";
import RelativeSection from "@/app/(private)/patient/_components/relative-viewdata";
import OfficerSection from "@/app/(private)/patient/_components/hospital-viewdata";

export default function Page() {
  return (
    <div className="ml-70 px-6 py-28 space-y-3">
      <div className="w-[1190px] bg-white p-6 rounded-lg shadow">
        <PatientCard />
      </div>

      <div className="w-full bg-white p-6 rounded-lg shadow">
        <RelativeSection />
      </div>

      <div className="w-full bg-white p-6 rounded-lg shadow">
        <OfficerSection />
      </div>
    </div>
  );
}