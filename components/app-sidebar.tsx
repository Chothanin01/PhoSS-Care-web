"use client";

import * as React from "react";
import { UserRoundPen, UserRoundSearch } from "lucide-react";
import { NavMain } from "./nav-main";
import { Sidebar, SidebarContent } from "@/shadcn/ui/sidebar";
import { useParams } from "next/navigation";
import Cookies from "js-cookie";

export function AppSidebar(
  props: React.ComponentProps<typeof Sidebar>
) {
  const params = useParams();
  const id = params.id as string;

  const [diseases, setDiseases] = React.useState<
    { id: string; name: string }[]
  >([]);

  React.useEffect(() => {
    const fetchDiseases = async () => {
      try {
        const token = Cookies.get("token");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/v1/admins/patients/${id}/diseases`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await res.json();

        if (result.success) {
          const mapped = result.data.map((d: any) => ({
            id: d.disease_id,
            name: d.name,
          }));

          setDiseases(mapped);
        }
      } catch (error) {
        console.error("fetch diseases error:", error);
      }
    };

    if (id) {
      fetchDiseases();
    }
  }, [id]);

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
    <Sidebar variant="sidebar" className="w-64 pt-24 left-6" {...props}>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
    </Sidebar>
  );
}