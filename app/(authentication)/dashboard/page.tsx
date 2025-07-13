import { auth } from "@/auth";
import { Skeleton } from "@/components/ui/skeleton";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session) {
    redirect(session?.user.role);
  }

  return (
    <div className="w-full flex justify-between gap-x-10">
      <Skeleton className="h-screen w-1/4" />
      <div className="flex flex-col gap-4 w-full">
        <Skeleton className="h-1/2 w-full" />
        <Skeleton className="h-1/2 w-full" />
      </div>
    </div>
  );
}
