import { SignUp } from "@clerk/nextjs/app-beta";

export default function Page() {
  return (
    <div className="fixed z-20 top-0 left-0 w-screen h-screen bg-gradient-to-r from-slate-900 to-indigo-950 flex flex-row items-center justify-center">
      <SignUp afterSignUpUrl="/" signInUrl="/sign-in" />
    </div>
  );
}

export const runtime = "experimental-edge";
export const revalidate = 0;
