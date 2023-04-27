"use client";

import { useRouter } from "next/navigation";
import { AiOutlineArrowLeft } from "react-icons/ai";

const PostIdHead = () => {
  const router = useRouter();
  const navigateBack = () => router.back();

  return (
    <div className="font-bold text-lg md:p-5 p-2 border-b border-slate-700 flex flex-row items-center gap-3">
      <div className="cursor-pointer" onClick={navigateBack}>
        <AiOutlineArrowLeft />
      </div>
      <p>Thread</p>
    </div>
  );
};

export default PostIdHead;
