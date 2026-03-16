"use client";

import { useState } from "react";
import EditHospitalData from "../../../_components/edit-hospital-page";
import { INITIAL_OFFICE, Officer } from "../../../_components/hospital-page";

export default function Page() {

  const [officer, setOfficer] = useState<Officer>(INITIAL_OFFICE);

  return (
    <div className="ml-70 px-6 py-28">
      <div className="w-full mx-auto bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-4 sm:gap-0">
          <EditHospitalData
            officer={officer}
            setOfficer={setOfficer} />
        </div>
      </div>
    </div>
  );
}
