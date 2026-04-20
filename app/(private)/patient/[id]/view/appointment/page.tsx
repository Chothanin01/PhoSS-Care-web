"use client";

import Appointment from "@/app/(private)/patient/_components/appointment-viewdata";

export default function Page() {
  return (
    <div className="ml-70 px-6 py-28 space-y-3">
      <div className="w-[1190px] bg-white p-6 rounded-lg shadow">
        <Appointment />
      </div>
    </div>
  );
}