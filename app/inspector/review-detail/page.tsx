import ReviewDetailClient from "@/app/components/inspector/ReviewDetailClient";
import "@/app/components/inspector/inspector.css";

export const metadata = {
  title: "CycleX - Review History",
};

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const id =
    typeof resolvedParams?.id === "string" ? resolvedParams.id : undefined;

  return <ReviewDetailClient listingId={id} />;
}
