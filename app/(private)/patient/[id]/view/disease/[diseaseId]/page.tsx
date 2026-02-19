import DiseasesView from "./_components/diseases-view";
import VaccineView from "./_components/vaccine-view";

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
  const mockDB: any = {
    d1: { id: "d1", name: "เบาหวาน"},
    d2: { id: "d2", name: "วัณโรค"},
    d3: { id: "d3", name: "ความดันโลหิตสูง"},
    v1: { id: "v1", name: "วัคซีนเด็ก"},
  };

  return mockDB[diseaseId];
}
