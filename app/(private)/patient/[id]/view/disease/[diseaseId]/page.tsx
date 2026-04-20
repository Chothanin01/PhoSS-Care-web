import DiseasesView from "./_components/diseases-view";
import VaccineView from "./_components/vaccine-view";
import { cookies } from "next/headers";

type PageProps = {
  params: Promise<{
    id: string;
    diseaseId: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { id, diseaseId } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/patients/${id}/${diseaseId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  const result = await res.json();
  const disease = result?.data?.data?.[0];

  if (!disease) {
    return <div className="ml-70 px-6 py-28">ไม่พบข้อมูล</div>;
  }

  if (disease.disease_name?.includes("วัคซีน")) {
    return <VaccineView />;
  }

  return <DiseasesView />;
}