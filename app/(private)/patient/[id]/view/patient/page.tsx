"use client";

import PatientCard from "@/app/(private)/patient/_components/patient-viewdata";
import RelativeSection from "@/app/(private)/patient/_components/relative-viewdata";
import OfficerSection from "@/app/(private)/patient/_components/hospital-viewdata";

export default function Page() {
  return (
    <div className="ml-70 py-4">
      <div className="w-full md:w-full bg-white p-6 rounded-lg shadow mb-6">
        <PatientCard />
      </div>

      <div className="w-full md:w-full bg-white p-6 rounded-lg shadow mb-6">
        <RelativeSection />
      </div>

      <div className="w-full md:w-full bg-white p-6 rounded-lg shadow">
        <OfficerSection />
      </div>
    </div>
  );
}