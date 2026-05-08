"use client";

import { useState } from "react";
import EditHospitalData from "../../../_components/edit-hospital-page";
import { INITIAL_OFFICE, Officer } from "../../../_components/hospital-page";

export default function Page() {

  const [officer, setOfficer] = useState<Officer>(INITIAL_OFFICE);

  return (
    <div className="ml-70 py-4">
      <div className="w-full mx-auto bg-white p-6 rounded-lg shadow">
        <EditHospitalData
          officer={officer}
          setOfficer={setOfficer} />
      </div>
    </div>
  );
}
