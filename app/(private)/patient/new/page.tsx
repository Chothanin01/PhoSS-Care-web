"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, FileCheckCorner, Check } from "lucide-react";
import { ProgressNav } from "@/components/progress-nav";
import { ProgressNavItem } from "@/components/progress-nav-item";
import PatientData, { PATIENT_INITIAL, Patient } from "../_components/patient-page";
import RelativeData, { INITIAL_RELATIVE, Relative } from "../_components/relative-page";
import HospitalData, { INITIAL_OFFICE, Officer } from "../_components/hospital-page";
import { Separator } from "@/shadcn/ui/separator";
import { Dialog, DialogContent, DialogTitle } from "@/shadcn/ui/dialog";


export default function Page() {
  const router = useRouter();
  const [patient, setPatient] = useState<Patient>(PATIENT_INITIAL);
  const [relative, setRelative] = useState<Relative>(INITIAL_RELATIVE);
  const [officer, setOfficer] = useState<Officer>(INITIAL_OFFICE);
  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => Math.max(0, prevStep - 1));
  };
  const [step, setStep] = useState(0);
  const [openSuccess, setOpenSuccess] = useState(false);

  const handleCreate = () => {
    setOpenSuccess(true);
  };

  useEffect(() => {
    if (openSuccess) {
      const timer = setTimeout(() => {
        // reset state
        setPatient(PATIENT_INITIAL);
        setRelative(INITIAL_RELATIVE);
        setOfficer(INITIAL_OFFICE);
        setStep(0);

        router.push("/patient");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [openSuccess]);
  
  const mainPageStepper = (
  <ProgressNav withChevron>
    <ProgressNavItem
      icon={FileText}
      completedIcon={FileCheckCorner}
      label="ข้อมูลผู้ป่วย"
      isActive={step === 0}
      isCompleted={step > 0}
      withMonoInactive
    />
    <ProgressNavItem
      icon={FileText}
      completedIcon={FileCheckCorner}
      label="ข้อมูลญาติผู้ป่วย"
      isActive={step === 1}
      isCompleted={step > 1}
      withMonoInactive
    />
    <ProgressNavItem
      icon={FileText}
      completedIcon={FileCheckCorner}
      label="ข้อมูลโรงพยาบาล"
      isActive={step === 2}
      isCompleted={step > 2}
      withMonoInactive
    />  
  </ProgressNav>
);
  
  return (
    <div className="ml-14 px-6 py-28">
      <div className="w-full bg-white p-6 rounded-lg shadow">

        {step < 3 && (
          <div className="mb-6">
            {mainPageStepper}
          </div>
        )}
        {step < 3 && <Separator className="mt-6 border-t border-gray-300" />}

        <div>
          {step === 0 && (
            <PatientData 
              onNext={handleNext}
              patient={patient}
              setPatient={setPatient}
            />
          )}

          {step === 1 && 
            <RelativeData
              onNext={handleNext}
              onBack={handleBack}
              relative={relative}
              setRelative={setRelative}
            />
          }

          {step === 2 &&
          <HospitalData
            onNext={handleCreate}
            onBack={handleBack}
            officer={officer}
            setOfficer={setOfficer}
            />
          }
        </div>
      </div>

      <Dialog open={openSuccess}>
        <DialogContent showCloseButton={false} className="sm:max-w-md text-center pointer-events-none">
          <DialogTitle></DialogTitle>

          <div className="flex justify-center mb-6">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#b2e0a6]">
              <div className="flex items-center justify-center w-14 h-14 rounded-full bg-Bamboo-400">
                <Check className="w-8 h-8 text-white" strokeWidth={3} />
              </div>
            </div>
          </div>

          <p className="text-lg font-semibold">
            ระบบได้สร้างบัญชีผู้ใช้เรียบร้อยแล้ว
          </p>

        </DialogContent>
      </Dialog>
    </div>
  );
}
