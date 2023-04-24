"use client";

import { api } from "@/lib/api/client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface Props {
  isOpened: boolean;
  setIsOpened: React.Dispatch<React.SetStateAction<boolean>>;
}
const Followers = ({ isOpened, setIsOpened }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data } = api.github.followers.useQuery(
    {
      page: currentPage,
    },
    {
      enabled: isOpened,
    }
  );
  console.log(data)
  

  return (
    <Dialog open={isOpened} onOpenChange={() => setIsOpened(!isOpened)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Followers</DialogTitle>
        </DialogHeader>
        {JSON.stringify(data)}
      </DialogContent>
    </Dialog>
  );
};

export default Followers;
