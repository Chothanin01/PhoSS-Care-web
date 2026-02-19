"use client";

type VaccineViewProps = {
  data: any;
};

export default function Page({ data }: VaccineViewProps) {

  return (
    <div className="ml-70 px-6 py-28">
      <div className="w-full bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-4 sm:gap-0">
          <h2 className="text-2xl font-bold">ประวัติวัคซีน</h2>
        </div>
      </div>
    </div>
  );
}
