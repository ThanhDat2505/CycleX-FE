"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Listing, ListingStatus } from "@/app/types/types";
import ListingsTable from "./ListingsTable";

type Filter = "ALL" | ListingStatus;

export default function DashboardClient({ listings }: { listings: Listing[] }) {
  const router = useRouter();

  const [filter, setFilter] = useState<Filter>("ALL");
  const [hasInteracted, setHasInteracted] = useState(false);
  const [active, setActive] = useState<Filter>("PENDING");

  const clickFilter = (f: Filter) => {
    setHasInteracted(true);
    setActive(f);
    setFilter(f);
  };

  const pillActive = !hasInteracted || active === "ALL";
  const statActive = (f: Filter) => hasInteracted && active === f;

  return (
    <>
      <h1 className="page-title">Inspector Dashboard</h1>

      <Link className="action-btn" href="/inspector/pending-list">
        <span className="material-symbols-outlined">format_list_bulleted</span>
        <span className="btn-text">Vào danh sách chờ duyệt</span>
      </Link>

      <div className="filters-row">
        <button
          className={`filter-pill${pillActive ? " is-active" : ""}`}
          type="button"
          data-filter="ALL"
          onClick={() => clickFilter("ALL")}
        >
          <span className="material-symbols-outlined">apps</span>
          Tất cả
        </button>
      </div>

      <section className="stats-grid">
        <button
          className={`stat-card stat-filter${
            statActive("PENDING") ? " is-active" : ""
          }`}
          type="button"
          data-filter="PENDING"
          onClick={() => clickFilter("PENDING")}
        >
          <div className="icon-circle icon-circle--yellow">
            <span className="material-symbols-outlined">schedule</span>
          </div>
          <div className="stat-number">15</div>
          <div className="stat-label">Tin chờ duyệt</div>
        </button>

        <button
          className={`stat-card stat-filter${
            statActive("NEED_MORE_INFO") ? " is-active" : ""
          }`}
          type="button"
          data-filter="NEED_MORE_INFO"
          onClick={() => clickFilter("NEED_MORE_INFO")}
        >
          <div className="icon-circle icon-circle--blue">
            <span className="material-symbols-outlined">article</span>
          </div>
          <div className="stat-number">5</div>
          <div className="stat-label">Cần bổ sung</div>
        </button>

        <button
          className={`stat-card stat-filter${
            statActive("DISPUTE") ? " is-active" : ""
          }`}
          type="button"
          data-filter="DISPUTE"
          onClick={() => clickFilter("DISPUTE")}
        >
          <div className="icon-circle icon-circle--red">
            <span className="material-symbols-outlined">warning</span>
          </div>
          <div className="stat-number">2</div>
          <div className="stat-label">Cần xem xét</div>
        </button>

        <button
          className={`stat-card stat-filter${
            statActive("FLAGGED") ? " is-active" : ""
          }`}
          type="button"
          data-filter="FLAGGED"
          onClick={() => clickFilter("FLAGGED")}
        >
          <div className="icon-circle icon-circle--gray">
            <span className="material-symbols-outlined">flag</span>
          </div>
          <div className="stat-number">1</div>
          <div className="stat-label">Bị flag</div>
        </button>

        <button
          className={`stat-card stat-filter${
            statActive("DONE") ? " is-active" : ""
          }`}
          type="button"
          data-filter="DONE"
          onClick={() => clickFilter("DONE")}
        >
          <div className="icon-circle icon-circle--green">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
          <div className="stat-number">32</div>
          <div className="stat-label">Đã duyệt</div>
        </button>
      </section>

      <h2 className="section-title">Listings to Review</h2>

      <ListingsTable rows={listings} filter={filter} />
    </>
  );
}
