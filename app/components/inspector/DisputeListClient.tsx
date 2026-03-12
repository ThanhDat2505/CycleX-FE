"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  disputeService,
  type DisputeListResult,
  type DisputeListRow,
} from "@/app/services/inspectorDisputeService";
import { getErrorMessage } from "@/app/services/errorUtils";

const STATUS_OPTIONS = [
  { value: "ALL", label: "Tất cả" },
  { value: "OPEN", label: "Đang mở" },
  { value: "IN_PROGRESS", label: "Đang xử lý" },
  { value: "RESOLVED", label: "Đã giải quyết" },
  { value: "REJECTED", label: "Đã từ chối" },
];

const SORT_OPTIONS = [
  { value: "createdAt:DESC", label: "Mới nhất" },
  { value: "createdAt:ASC", label: "Cũ nhất" },
  { value: "updatedAt:DESC", label: "Cập nhật gần đây" },
  { value: "status:ASC", label: "Trạng thái A-Z" },
  { value: "disputeId:DESC", label: "Dispute ID giam dan" },
];

function localizeErrorMessage(message: string): string {
  if (message.trim().toLowerCase() === "internal server error") {
    return "Internal server error";
  }
  return message;
}

function statusBadgeClass(status: string): string {
  const normalized = String(status).toUpperCase();
  if (normalized === "RESOLVED") return "badge badgeApproved";
  if (normalized === "OPEN") return "badge badgeDanger";
  if (normalized === "IN_PROGRESS") return "badge badgeInfo";
  if (normalized === "REJECTED") return "badge";
  return "badge";
}

export default function DisputeListClient() {
  const [items, setItems] = useState<DisputeListRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [status, setStatus] = useState("ALL");
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [qInput, setQInput] = useState("");
  const [qDebounced, setQDebounced] = useState("");
  const [sort, setSort] = useState("createdAt:DESC");

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [sortBy, sortDir] = sort.split(":") as [
    "createdAt" | "updatedAt" | "status" | "disputeId",
    "ASC" | "DESC",
  ];

  const canPrevious = page > 0;
  const canNext = page + 1 < totalPages;

  const isAdmin = useMemo(() => {
    const context = disputeService.getCurrentUserContext();
    return context.role === "ADMIN";
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setQDebounced(qInput);
    }, 400);

    return () => window.clearTimeout(timeoutId);
  }, [qInput]);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const result: DisputeListResult = await disputeService.getDisputes({
          status,
          createdFrom,
          createdTo,
          assigneeId: isAdmin ? assigneeId : undefined,
          q: qDebounced.trim() || undefined,
          sortBy,
          sortDir,
          page,
          limit: pageSize,
        });

        if (!mounted) return;
        setItems(result.items);
        setPage(result.page);
        setPageSize(result.pageSize);
        setTotalItems(result.totalItems);
        setTotalPages(Math.max(1, result.totalPages));
      } catch (err: unknown) {
        if (!mounted) return;
        setError(getErrorMessage(err, "Khong tai duoc danh sach tranh chap"));
        setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [
    status,
    createdFrom,
    createdTo,
    assigneeId,
    qDebounced,
    sortBy,
    sortDir,
    page,
    pageSize,
    isAdmin,
  ]);

  const assigneeSuggestions = useMemo(() => {
    const unique = new Set<string>();
    items.forEach((item) => {
      if (item.assigneeName && item.assigneeName !== "Chua phan cong") {
        unique.add(item.assigneeName);
      }
    });
    return Array.from(unique);
  }, [items]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="page-title">Dispute Queue</h1>

      <div className="filterCard">
        <div className="filterRow">
          <div className="filterField">
            <label className="filterLabel">Trạng thái</label>
            <select
              className="filterInput"
              value={status}
              onChange={(e) => {
                setPage(0);
                setStatus(e.target.value);
              }}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filterField">
            <label className="filterLabel">Từ ngày tạo</label>
            <input
              className="filterInput"
              type="date"
              value={createdFrom}
              onChange={(e) => {
                setPage(0);
                setCreatedFrom(e.target.value);
              }}
            />
          </div>

          <div className="filterField">
            <label className="filterLabel">Đến ngày tạo</label>
            <input
              className="filterInput"
              type="date"
              value={createdTo}
              onChange={(e) => {
                setPage(0);
                setCreatedTo(e.target.value);
              }}
            />
          </div>

          {isAdmin && (
            <div className="filterField filterGrow">
              <label className="filterLabel">Người phụ trách</label>
              <input
                list="dispute-assignee-suggestions"
                className="filterInput"
                placeholder="Assignee ID (Admin)"
                value={assigneeId}
                onChange={(e) => {
                  setPage(0);
                  setAssigneeId(e.target.value);
                }}
              />
              <datalist id="dispute-assignee-suggestions">
                {assigneeSuggestions.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
            </div>
          )}
          <div className="filterField filterGrow">
            <label className="filterLabel">Tìm theo ID</label>
            <input
              className="filterInput"
              placeholder="disputeId / transactionId / listingId"
              value={qInput}
              onChange={(e) => {
                setPage(0);
                setQInput(e.target.value);
              }}
            />
          </div>

          <div className="filterField">
            <label className="filterLabel">Sắp xếp</label>
            <select
              className="filterInput"
              value={sort}
              onChange={(e) => {
                setPage(0);
                setSort(e.target.value);
              }}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="filterActions">
          <button
            className="btn btnGhost"
            type="button"
            onClick={() => {
              setStatus("ALL");
              setCreatedFrom("");
              setCreatedTo("");
              setAssigneeId("");
              setQInput("");
              setQDebounced("");
              setSort("createdAt:DESC");
              setPage(0);
            }}
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>

      <div className="dataTable">
        {loading && <div className="p-5">Dang tai dispute...</div>}
        {!loading && error && (
          <div className="p-5 text-red-700">{localizeErrorMessage(error)}</div>
        )}

        {!loading && !error && (
          <div className="historyTable">
            <div className="tableHeader disputeTableHeader">
              <span>Dispute ID</span>
              <span>Transaction</span>
              <span>Listing</span>
              <span className="center">Trang thai</span>
              <span>Ly do</span>
              <span>Ngay tao</span>
              <span>Nguoi phu trach</span>
              <span className="right">Hanh dong</span>
            </div>

            {items.map((row) => (
              <div key={row.id} className="tableRow disputeTableRow">
                <div className="cell font-bold">#{row.id}</div>
                <div className="cell">TX-{row.transactionId}</div>
                <div className="cell name">{row.listingTitle}</div>
                <div className="cell center">
                  <span className={statusBadgeClass(row.status)}>
                    {row.status}
                  </span>
                </div>
                <div className="cell noteCell">{row.reason}</div>
                <div className="cell">{row.createdAt}</div>
                <div className="cell">{row.assigneeName}</div>
                <div className="cell right">
                  <Link
                    href={`/inspector/disputes/${encodeURIComponent(row.id)}`}
                    className="actionLink"
                  >
                    Xem chi tiet
                  </Link>
                </div>
              </div>
            ))}

            {!items.length && (
              <div
                style={{ padding: 24, textAlign: "center", color: "#6b7280" }}
              >
                Khong co dispute nao phu hop bo loc hien tai.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="disputePaginationBar">
        <div>
          Tổng <strong>{totalItems}</strong> tranh chấp
        </div>

        <div className="disputePaginationActions">
          <label className="disputePageSizeLabel">
            Mỗi trang
            <select
              className="filterInput"
              value={pageSize}
              onChange={(e) => {
                setPage(0);
                setPageSize(Number(e.target.value) || 10);
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </label>

          <button
            type="button"
            className="btn btnGhost"
            onClick={() =>
              canPrevious && setPage((prev) => Math.max(prev - 1, 0))
            }
            disabled={!canPrevious}
          >
            Trước
          </button>

          <span>
            Trang <strong>{page + 1}</strong> / {Math.max(totalPages, 1)}
          </span>

          <button
            type="button"
            className="btn btnGhost"
            onClick={() => canNext && setPage((prev) => prev + 1)}
            disabled={!canNext}
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}
