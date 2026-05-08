"use client";

import Appointment from "@/app/(private)/patient/_components/appointment-viewdata";

export default function Page() {
  return (
    <div className="ml-70 py-4">
      <div className="w-full md:w-full bg-white p-6 rounded-lg shadow">
        <Appointment />
      </div>
    </div>
  );
}