"use client";

import * as React from "react";
import { UserRoundPen, UserRoundSearch } from "lucide-react";
import { NavMain } from "./nav-main";
import { Sidebar, SidebarContent } from "@/shadcn/ui/sidebar";
import { useParams } from "next/navigation";

export function AppSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {

    const params = useParams();
    const id = params.id as string;

    const mockPatientDiseases: Record<
      string,
      { id: string; name: string }[]
    > = {
      "1": [
        { id: "d1", name: "โรคเบาหวาน" },
        { id: "d2", name: "วัณโรค" },
      ],
      "2": [
        { id: "d3", name: "โรคความดันโลหิตสูง" },
      ],
      "3": [
        { id: "d1", name: "โรคเบาหวาน" },
        { id: "v1", name: "วัคซีนเด็ก" },
      ],
    };

    const diseases = mockPatientDiseases[id] || [];

    const navMain = React.useMemo(
    () => [
      {
        title: "แก้ไขข้อมูล",
        url: "/patient",
        icon: UserRoundPen,
        items: [
          {
            title: "ข้อมูลผู้ป่วย",
            url: `/patient/${id}/edit/patient`,
          },
          {
            title: "ข้อมูลญาติผู้ป่วย",
            url: `/patient/${id}/edit/relative`,
          },
          {
            title: "ข้อมูลโรงพยาบาล",
            url: `/patient/${id}/edit/hospital`,
          },
          {
            title: "ใบนัดแพทย์",
            url: `/patient/${id}/edit/appointment`,
          },
        ],
      },
      {
        title: "ดูข้อมูลทั้งหมด",
        url: "/patient",
        icon: UserRoundSearch,
        items: [
          {
            title: "ข้อมูลผู้ป่วย",
            url: `/patient/${id}/view/patient`,
          },
          ...diseases.map((disease) => ({
            title: `ประวัติการรักษา${disease.name}`,
            url: `/patient/${id}/view/disease/${disease.id}`,
          })),
          {
            title: "ใบนัดแพทย์",
            url: `/patient/${id}/view/appointment`,
          },
        ],
      },
    ],
    [id, diseases]
  );

  return (
    <Sidebar
      variant="sidebar"
      className="w-64 pt-24 left-6"
      {...props}
    >
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
    </Sidebar>
  );
}
