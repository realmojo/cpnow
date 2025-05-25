import {
  Shirt,
  Sparkles,
  Baby,
  Utensils,
  CookingPot,
  Lamp,
  Tv,
  Dumbbell,
  Car,
  Book,
  Gamepad2,
  PencilRuler,
  PawPrint,
  HeartPulse,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "패션의류/잡화",
    categoryId: "564653",
    icon: Shirt,
  },
  {
    title: "뷰티",
    categoryId: "176522",
    icon: Sparkles,
  },
  {
    title: "출산/유아동",
    categoryId: "221934",
    icon: Baby,
  },
  {
    title: "식품",
    categoryId: "194276",
    icon: Utensils,
  },
  {
    title: "주방용품",
    categoryId: "185669",
    icon: CookingPot,
  },
  {
    title: "생활용품",
    categoryId: "115673",
    icon: Lamp,
  },
  {
    title: "홈인테리어",
    categoryId: "184555",
    icon: Lamp,
  },
  {
    title: "가전디지털",
    categoryId: "178255",
    icon: Tv,
  },
  {
    title: "스포츠/레저",
    categoryId: "317778",
    icon: Dumbbell,
  },
  {
    title: "자동차용품",
    categoryId: "184060",
    icon: Car,
  },
  {
    title: "도서/음반/DVD",
    categoryId: "317777",
    icon: Book,
  },
  {
    title: "완구/취미",
    categoryId: "317779",
    icon: Gamepad2,
  },
  {
    title: "문구/오피스",
    categoryId: "177295",
    icon: PencilRuler,
  },
  {
    title: "반려동물용품",
    categoryId: "115674",
    icon: PawPrint,
  },
  {
    title: "헬스/건강식품",
    categoryId: "305798",
    icon: HeartPulse,
  },
];

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>메뉴</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={`/categories/${item.categoryId}`}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
