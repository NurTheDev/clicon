"use client";

import {
  AlignHorizontalJustifyStart,
  AudioWaveform,
  BadgePlus,
  Binoculars,
  Command,
  Frame,
  GalleryVerticalEnd,
  ImagePlus,
  LayoutList,
  ListPlus,
  Map,
  Menu,
  PieChart,
  ShoppingBasket,
  Slack,
  Puzzle,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
// This is sample data.
const data = {
  user: {
    name: "Nur Islam",
    email: "nur756.islam@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Banners",
      url: "/dashboard/banners",
      icon: ImagePlus,
      isActive: true,
      items: [
        {
          title: "Create New",
          url: "/dashboard/add-banner",
          icon: BadgePlus,
        },
        {
          title: "See All",
          url: "/dashboard/banners",
          icon: Menu,
        },
      ],
    },
    {
      title: "Categories",
      url: "/dashboard/categories",
      icon: LayoutList,
      items: [
        {
          title: "Create New",
          url: "/dashboard/categories/add-category",
          icon: ListPlus,
        },
        {
          title: "See All",
          url: "/dashboard/categories",
          icon: Binoculars,
        },
      ],
    },
    {
      title: "Subcategory",
      url: "/dashboard/subcategories",
      icon: AlignHorizontalJustifyStart,
      items: [
        {
          title: "Create New",
          icon: ListPlus,
          url: "/dashboard/subcategories/add-subcategory",
        },
        {
          title: "See All",
          icon: Binoculars,
          url: "/dashboard/subcategories",
        },
      ],
    },
    {
      title: "Brand",
      url: "/dashboard/brands",
      icon: Slack,
      items: [
        {
          title: "Create New",
          url: "/dashboard/brands/add-brand",
          icon: ListPlus,
        },
        {
          title: "See All",
          icon: Binoculars,
          url: "/dashboard/brands",
        },
      ],
    },
    {
      title: "Products",
      url: "/dashboard/products",
      icon: ShoppingBasket,
      items: [
        {
          title: "Create New",
          url: "/dashboard/products/add-product",
          icon: ListPlus,
        },
        {
          title: "See All",
          icon: Binoculars,
          url: "/dashboard/products",
        },
      ],
    },
    {
      title: "Coupons",
      url: "/dashboard/coupons",
      icon: Puzzle,
      items: [
        {
          title: "Create New",
          url: "/dashboard/coupons/add-coupon",
          icon: ListPlus,
        },
        {
          title: "See All",
          icon: Binoculars,
          url: "/dashboard/coupons",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
