"use client";

import { useState } from "react";
import { INITIAL_RELATIVE, Relative } from "../../../_components/relative-page";
import EditRelativeData from "../../../_components/edit-relative-page";

export default function Page() {
  const [relative, setRelative] = useState<Relative>(INITIAL_RELATIVE);

  return (
    <div className="ml-70 py-4">
      <div className="w-full bg-white p-6 rounded-lg shadow">
        <EditRelativeData
          relative={relative}
          setRelative={setRelative}
        />
      </div>
    </div>
  );
}