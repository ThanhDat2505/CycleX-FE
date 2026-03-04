import ReviewDetailClient from "@/app/components/inspector/ReviewDetailClient";
import {
  getListingById,
  listings,
} from "@/app/mocks/inspector/inspectorListings";

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
  const listing = getListingById(id) ?? listings[0];

  return <ReviewDetailClient listing={listing} />;
}
