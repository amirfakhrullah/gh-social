import SearchSection from "@/components/SearchSection";
import TitleHead from "@/components/heads/TitleHead";

export default function Search() {
  return (
    <>
      <TitleHead title="Search" disableBackButton />
      <SearchSection />
    </>
  );
}

export const revalidate = 0;
