"use client";

import EditPatientData from "../../../_components/edit-patient-page";
import { useState } from "react";
import { PATIENT_INITIAL, Patient } from "../../../_components/patient-page";

export default function Page() {

  const [patient, setPatient] = useState<Patient>(PATIENT_INITIAL);

  return (
    <div className="ml-70 px-6 py-28">
      <div className="w-full mx-auto bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-4 sm:gap-0">
          <EditPatientData
            patient={patient}
            setPatient={setPatient} />
        </div>
      </div>
    </div>
  );
}
