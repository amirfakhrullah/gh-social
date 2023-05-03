"use client";

import { cn } from "@/lib/utils";
import {
  AiOutlineHome,
  AiFillHome,
  AiFillBell,
  AiOutlineBell,
} from "react-icons/ai";
import { IoSearchOutline, IoSearchSharp } from "react-icons/io5";
import { RiUser3Fill, RiUser3Line } from "react-icons/ri";
import { BiMessageSquareAdd } from "react-icons/bi";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { usePostModalContext } from "@/providers/PostModalProvider";

export default function Sidebar() {
  const { user } = useUser();
  const { handleOpen: handleOpenPostModal } = usePostModalContext();

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

  /**
   * Prefetch routes when first-time rendering this component
   */
  useEffect(() => {
    navs.map((nav) => {
      if (!nav.isActive) router.prefetch(nav.path);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="h-screen md:w-[275px] w-[88px]">
      <div className="fixed z-10 top-0 h-screen md:w-[265px] w-[75px] mt-10 p-2">
        {navs.map(({ Icon, title, isActive, path }) => (
          <div
            key={title}
            className={cn(
              "flex flex-row items-center md:justify-start justify-center p-4 cursor-pointer",
              isActive ? "font-black text-slate-200" : "font-bold"
            )}
            onClick={() => handleRoute(path)}
          >
            <Icon className="text-3xl" />
            <p className="md:block hidden ml-4">{title}</p>
          </div>
        ))}
        <div
          className="font-bold flex flex-row items-center md:justify-start justify-center p-4 cursor-pointer"
          onClick={() => handleOpenPostModal()}
        >
          <BiMessageSquareAdd className="text-3xl" />
          <p className="md:block hidden ml-4">Add Post</p>
        </div>

        <div className="fixed z-20 md:bottom-[20px] bottom-[10px] md:p-6 p-3 flex flex-row items-center justify-center gap-2">
          <UserButton
            afterSignOutUrl="/sign-in"
            appearance={{
              baseTheme: dark,
            }}
          />
          {user && (
            <div className="md:block hidden">
              <p className="text-sm text-slate-200 font-bold">
                {user?.fullName}
              </p>
              <p className="text-sm text-gray-500">@{user?.username}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
