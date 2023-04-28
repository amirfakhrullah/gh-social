import { SignUp } from "@clerk/nextjs/app-beta";

interface PageProps {
  searchParams: {
    [key: string]: unknown;
  };
}
export default function Page({ searchParams }: PageProps) {
  const { redirect_url: redirectUrlFromParams } = searchParams || {};

  let redirectUrl = "/";
  if (redirectUrlFromParams && typeof redirectUrlFromParams === "string") {
    redirectUrl = redirectUrlFromParams;
  }

  return <SignUp signInUrl="/sign-in" redirectUrl={redirectUrl} />;
}

export const runtime = "experimental-edge";
export const revalidate = 0;
