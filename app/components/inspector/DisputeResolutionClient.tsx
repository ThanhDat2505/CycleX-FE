"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  disputeService,
  type DisputeDetail,
  type DisputeResolutionPayload,
} from "@/app/services/inspectorDisputeService";
import { getErrorMessage } from "@/app/services/errorUtils";

const RESOLUTION_OPTIONS: Array<{
  value: DisputeResolutionPayload["action"];
  label: string;
  helper: string;
}> = [
  {
    value: "REFUND_BUYER",
    label: "Hoan tien",
    helper: "Hoan tien cho buyer va dong dispute.",
  },
  {
    value: "RELEASE_FUND_SELLER",
    label: "Giai ngan cho seller",
    helper: "Xac nhan seller hop le, giai ngan va ket thuc tranh chap.",
  },
  {
    value: "CLOSE_CASE",
    label: "Dong case",
    helper: "Dong tranh chap sau khi da xac minh va chot ket qua.",
  },
];

export default function DisputeResolutionClient({
  disputeId,
}: {
  disputeId: string;
}) {
  const router = useRouter();
  const [detail, setDetail] = useState<DisputeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [action, setAction] = useState<DisputeResolutionPayload["action"] | "">(
    "",
  );
  const [resolutionNote, setResolutionNote] = useState("");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await disputeService.getDisputeDetail(disputeId);
        if (!mounted) return;
        setDetail(data);

        if (data.status === "RESOLVED" || data.status === "REJECTED") {
          setError("Dispute này đã được xử lý. Không thể resolve lại.");
        }
      } catch (err: unknown) {
        if (!mounted) return;
        setError(getErrorMessage(err, "Khong tai duoc dispute de resolve"));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [disputeId]);

  const selectedOption = RESOLUTION_OPTIONS.find((opt) => opt.value === action);
  const canSubmit =
    !submitting &&
    !loading &&
    !error &&
    !!action &&
    resolutionNote.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit || !action) return;

    try {
      setSubmitting(true);
      await disputeService.resolveDispute(disputeId, {
        action,
        resolutionNote: resolutionNote.trim(),
      });
      router.push("/inspector/disputes");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Resolve dispute that bai"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="disputeHeaderBar">
        <div>
          <Link
            href={`/inspector/disputes/${encodeURIComponent(disputeId)}`}
            className="actionLink"
          >
            ← Quay lai chi tiet dispute
          </Link>
          <h1 className="page-title" style={{ marginTop: 8 }}>
            Dispute Resolution #{disputeId}
          </h1>
          {detail && (
            <p className="text-gray-600">
              Transaction: TX-{detail.transaction.id}
            </p>
          )}
        </div>
      </div>

      {loading && <div className="box">Dang tai du lieu resolve...</div>}

      {!loading && (
        <section className="box">
          <h3 className="boxTitle">Phan quyet cuoi cung</h3>

          {error && <div className="text-red-700 mb-4">{error}</div>}

          <div className="disputeResolutionGrid">
            <label className="field">
              <span className="filterLabel">Huong giai quyet</span>
              <select
                className="select"
                value={action}
                onChange={(e) =>
                  setAction(
                    e.target.value as DisputeResolutionPayload["action"] | "",
                  )
                }
                disabled={!!error}
              >
                <option value="">-- Chon huong giai quyet --</option>
                {RESOLUTION_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="field">
              <span className="filterLabel">Ly do phan xu (bat buoc)</span>
              <textarea
                className="textarea"
                rows={5}
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="Nhap ly do phan xu ro rang de cap nhat dispute va transaction"
                disabled={!!error}
              />
            </label>
          </div>

          {selectedOption && (
            <div className="disputeResolutionHint">{selectedOption.helper}</div>
          )}

          <div className="disputeResolutionActions">
            <Link
              href={`/inspector/disputes/${encodeURIComponent(disputeId)}`}
              className="btn btnGhost"
            >
              Huy
            </Link>
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              {submitting ? "Dang gui..." : "Confirm Resolution"}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
