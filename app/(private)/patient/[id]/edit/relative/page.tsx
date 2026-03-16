"use client";

import { useState } from "react";
import { INITIAL_RELATIVE, Relative } from "../../../_components/relative-page";
import EditRelativeData from "../../../_components/edit-relative-page";

export default function Page() {

  const [relative, setRelative] = useState<Relative>(INITIAL_RELATIVE);

  return (
    <div className="ml-70 px-6 py-28">
      <div className="w-full bg-white p-6 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-4 sm:gap-0">
          <EditRelativeData
            relative={relative}
            setRelative={setRelative}/>
        </div>
      </div>
    </div>
  );
}
