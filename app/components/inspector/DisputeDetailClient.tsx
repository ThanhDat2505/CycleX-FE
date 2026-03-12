"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  disputeService,
  type DisputeDetail,
  type DisputeEvidence,
} from "@/app/services/inspectorDisputeService";
import { getErrorMessage } from "@/app/services/errorUtils";

function evidenceIcon(type: DisputeEvidence["type"]): string {
  if (type === "IMAGE") return "image";
  if (type === "VIDEO") return "videocam";
  if (type === "FILE") return "description";
  return "notes";
}

function getEvidenceLabel(item: DisputeEvidence): string {
  return item.name || item.text || item.url || "Evidence";
}

export default function DisputeDetailClient({
  disputeId,
}: {
  disputeId: string;
}) {
  const [detail, setDetail] = useState<DisputeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openingEvidenceIndex, setOpeningEvidenceIndex] = useState<
    number | null
  >(null);

  const handleOpenEvidence = async (item: DisputeEvidence, index: number) => {
    if (!item.url) return;
    try {
      setOpeningEvidenceIndex(index);
      const blobUrl = await disputeService.getEvidenceBlobUrl(item.url);
      window.open(blobUrl, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Khong mo duoc bang chung private"));
    } finally {
      setOpeningEvidenceIndex(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await disputeService.getDisputeDetail(disputeId);
        if (!mounted) return;
        setDetail(data);
      } catch (err: unknown) {
        if (!mounted) return;
        setError(getErrorMessage(err, "Khong tai duoc chi tiet tranh chap"));
        setDetail(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [disputeId]);

  const priceVnd = useMemo(() => {
    const value = detail?.listing.priceVnd || 0;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  }, [detail?.listing.priceVnd]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        Dang tai chi tiet dispute...
      </div>
    );
  }

  if (!detail || error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-700">{error || "Khong tim thay dispute"}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="disputeHeaderBar">
        <div>
          <Link href="/inspector/disputes" className="actionLink">
            ← Quay lai danh sach
          </Link>
          <h1 className="page-title" style={{ marginTop: 8 }}>
            Dispute #{detail.id}
          </h1>
          <p className="text-gray-600">
            Trang thai: {detail.status} • Tao: {detail.createdAt}
          </p>
        </div>

        <Link
          href={`/inspector/disputes/${encodeURIComponent(detail.id)}/resolution`}
          className="btn btn-primary"
        >
          Resolve Dispute
        </Link>
      </div>

      <section className="box">
        <h3 className="boxTitle">Thong tin giao dich (Transaction)</h3>
        <div className="disputeGrid2">
          <div className="specItem">
            <span className="specLabel">Transaction ID</span>
            <span className="specValue">TX-{detail.transaction.id}</span>
          </div>
          <div className="specItem">
            <span className="specLabel">Trang thai</span>
            <span className="specValue">{detail.transaction.status}</span>
          </div>
          <div className="specItem">
            <span className="specLabel">Ngay tao</span>
            <span className="specValue">{detail.transaction.createdAt}</span>
          </div>
          <div className="specItem">
            <span className="specLabel">Cap nhat cuoi</span>
            <span className="specValue">{detail.transaction.updatedAt}</span>
          </div>
        </div>
      </section>

      <section className="box">
        <h3 className="boxTitle">Listing xe</h3>
        <div className="disputeListingCard">
          <div className="disputeListingThumb">
            {detail.listing.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={detail.listing.imageUrl} alt={detail.listing.title} />
            ) : (
              <span className="material-symbols-outlined">two_wheeler</span>
            )}
          </div>
          <div>
            <div className="font-bold">{detail.listing.title}</div>
            <div className="text-gray-600">Listing ID: {detail.listing.id}</div>
            <div className="text-gray-600">Gia: {priceVnd}</div>
            <div className="text-gray-600">
              Trang thai listing: {detail.listing.status}
            </div>
          </div>
        </div>
      </section>

      <section className="box">
        <h3 className="boxTitle">Buyer / Seller</h3>
        <div className="disputeGrid3">
          <div className="specItem">
            <span className="specLabel">Buyer</span>
            <span className="specValue">{detail.buyer.name}</span>
            <span className="text-gray-600">{detail.buyer.email}</span>
          </div>
          <div className="specItem">
            <span className="specLabel">Seller</span>
            <span className="specValue">{detail.seller.name}</span>
            <span className="text-gray-600">{detail.seller.email}</span>
          </div>
          <div className="specItem">
            <span className="specLabel">Nguoi phu trach</span>
            <span className="specValue">{detail.assignee.name}</span>
            <span className="text-gray-600">{detail.assignee.email}</span>
          </div>
        </div>
      </section>

      <section className="box">
        <h3 className="boxTitle">Ly do khieu nai</h3>
        <div className="specItem">
          <span className="specLabel">Reason Code</span>
          <span className="specValue">{detail.reasonCode}</span>
        </div>
        <div className="specItem" style={{ marginTop: 10 }}>
          <span className="specLabel">Reason</span>
          <span className="specValue">{detail.reasonText}</span>
        </div>
        <div className="specItem" style={{ marginTop: 10 }}>
          <span className="specLabel">Mo ta chi tiet</span>
          <span className="specValue">{detail.description}</span>
        </div>
      </section>

      <section className="box">
        <h3 className="boxTitle">Bang chung dinh kem</h3>
        <div className="disputeEvidenceGrid">
          {detail.evidence.length ? (
            detail.evidence.map((item, index) => (
              <button
                key={index}
                type="button"
                className="disputeEvidenceCard"
                onClick={() => void handleOpenEvidence(item, index)}
                disabled={!item.url || openingEvidenceIndex === index}
                title={item.url ? "Mo bang chung" : "Khong co URL bang chung"}
              >
                <span className="material-symbols-outlined">
                  {evidenceIcon(item.type)}
                </span>
                <span>
                  {getEvidenceLabel(item)}
                  {item.uploaderRole ? ` (${item.uploaderRole})` : ""}
                </span>
              </button>
            ))
          ) : (
            <div className="text-gray-500">Khong co bang chung dinh kem.</div>
          )}
        </div>
      </section>
    </div>
  );
}
