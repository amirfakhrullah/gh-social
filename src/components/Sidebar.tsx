"use client";

import { cn } from "@/lib/utils";
import {
  AiOutlineHome,
  AiFillHome,
  AiFillBell,
  AiOutlineBell,
  AiFillMessage,
  AiOutlineMessage,
} from "react-icons/ai";
import { IoSearchOutline, IoSearchSharp } from "react-icons/io5";
import { RiUser3Fill, RiUser3Line } from "react-icons/ri";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

export default function Sidebar() {
  const location = usePathname();
  const router = useRouter();

  const handleRoute = (route: string) => router.push(route);

  const navs = useMemo(() => {
    const basePath = location?.split("/")?.[1];

    const routes = [
      {
        Active: AiFillHome,
        InActive: AiOutlineHome,
        title: "Home",
        path: "/",
      },
      {
        Active: IoSearchSharp,
        InActive: IoSearchOutline,
        title: "Search",
        path: "/search",
      },
      {
        Active: AiFillBell,
        InActive: AiOutlineBell,
        title: "Notifications",
        path: "/notifications",
      },
      {
        Active: AiFillMessage,
        InActive: AiOutlineMessage,
        title: "Messages",
        path: "/messages",
      },
      {
        Active: RiUser3Fill,
        InActive: RiUser3Line,
        title: "Profile",
        path: "/profile",
      },
    ];
    if (location === "/") {
      return [
        {
          Icon: routes[0].Active,
          title: routes[0].title,
          path: routes[0].path,
          isActive: true,
        },
        ...routes.slice(1).map((route) => ({
          Icon: route.InActive,
          title: route.title,
          path: route.path,
          isActive: false,
        })),
      ];
    } else {
      return routes.map((route, idx) => {
        const isActive = idx !== 0 && `/${basePath}`.includes(route.path);
        return {
          Icon: isActive ? route.Active : route.InActive,
          title: route.title,
          path: route.path,
          isActive,
        };
      });
    }
  }, [location]);

  return (
    <div className="h-screen md:w-[275px] w-[88px]">
      <div className="fixed z-10 top-0 h-screen md:w-[265px] w-[75px] mt-10 p-2">
        {navs.map(({ Icon, title, isActive, path }) => (
          <div
            key={title}
            className="flex flex-row items-center md:justify-start justify-center p-4 cursor-pointer"
            onClick={() => handleRoute(path)}
          >
            <Icon className="text-3xl" />
            <p
              className={cn(
                "md:block hidden ml-4",
                isActive ? "font-black" : "font-bold"
              )}
            >
              {title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
