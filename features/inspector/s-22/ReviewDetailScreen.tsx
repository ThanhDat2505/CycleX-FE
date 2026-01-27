import ReviewDetailClient from "./ReviewDetailClient";
import { getListingById, listings } from "@/data/inspectorListings";

export default function ReviewDetailScreen({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const id = typeof searchParams?.id === "string" ? searchParams.id : undefined;
  const listing = getListingById(id) ?? listings[0];

  return <ReviewDetailClient listing={listing} />;
}
