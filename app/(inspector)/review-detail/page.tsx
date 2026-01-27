import ReviewDetailScreen from "@/features/inspector/s-22/ReviewDetailScreen";

export default function Page({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  return <ReviewDetailScreen searchParams={searchParams} />;
}
