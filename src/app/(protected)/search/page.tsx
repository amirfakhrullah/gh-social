import TitleHead from "@/components/heads/TitleHead";

export default function Search() {
  return (
    <>
      <TitleHead title="Search" disableBackButton />
    </>
  );
}

export const runtime = "experimental-edge";
export const revalidate = 0;
