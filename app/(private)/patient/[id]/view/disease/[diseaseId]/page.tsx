import DiseasesView from "./_components/diseases-view";
import VaccineView from "./_components/vaccine-view";
import { mockPatients } from "@/app/utils/patient.mock";
type PageProps = {
  params: {
    id: string;
    diseaseId: string;
  };
};

export default async function Page({ params }: PageProps) {
  const { id, diseaseId } = await params;

  const data = await mockFetchDisease(id, diseaseId);

  if (data.type === "vaccine") {
    return <VaccineView data={data} />;
  }

  return <DiseasesView data={data} />;
}

async function mockFetchDisease(id: string, diseaseId: string) {
  const patientId = Number(id);

  const patient = mockPatients.find((p) => p.id === patientId);

  if (!patient) {
    throw new Error("Patient not found");
  }

  const disease = patient.diseases.find((d) => d.id === diseaseId);

  if (!disease) {
    throw new Error("Disease not found");
  }

  return disease;
}
