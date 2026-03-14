"use client";

import { SortTableRequest } from "./_components/approve-table";

export default function Page() {

  return (
    <div className="py-2">
      <div className="w-full bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-4 sm:gap-0">
          <h2 className="text-2xl font-bold">คำขออนุมัติ</h2>
        </div>
        <SortTableRequest />
      </div>
    </div>
  );
}
