"use client";

import EditPatientData from "../../../_components/edit-patient-page";
import { useState } from "react";
import { PATIENT_INITIAL, Patient } from "../../../_components/patient-page";

export default function Page() {

  const [patient, setPatient] = useState<Patient>(PATIENT_INITIAL);

  return (
    <div className="ml-70 py-4">
      <div className="w-full mx-auto bg-white p-6 rounded-lg shadow">
        <EditPatientData
          patient={patient}
          setPatient={setPatient} />
      </div>
    </div>
  );
}
