/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type ChecklistItem = {
  result: string;
  remark: string;
};

type ReportData = {
  id: string;
  score: number;
  conclusion: string;
  checklist: {
    frame: ChecklistItem;
    paint: ChecklistItem;
    drivetrain: ChecklistItem;
  };
  media: string[];
  status: "approve" | "reject";
  date: string;
};

export default function InspectorSummary() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idParam = searchParams.get("id");

  const [report, setReport] = useState<ReportData | null>(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const saved = sessionStorage.getItem("tempInspectionReport");

    if (saved) {
      const parsed = JSON.parse(saved);

      if (!idParam || parsed.id === idParam) {
        setReport(parsed);

        let start = 0;
        const interval = setInterval(() => {
          start += 2;
          if (start >= parsed.score) {
            start = parsed.score;
            clearInterval(interval);
          }
          setAnimatedScore(start);
        }, 15);
      }
    }
  }, [idParam]);

  if (!report) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>Không tìm thấy biên bản kiểm định</h2>
        <button
          onClick={() => router.push("/inspector/review-required")}
          className="text-sm font-extrabold text-gray-500 hover:text-gray-900 transition-colors inline-flex items-center gap-1 bg-transparent border-none p-0 cursor-pointer mt-4"
        >
          <span className="material-symbols-outlined text-[18px]">
            arrow_back
          </span>
          Quay lại
        </button>
      </div>
    );
  }

  const getScoreColor = () => {
    if (report.score >= 80) return "green";
    if (report.score >= 60) return "orange";
    return "red";
  };

  return (
    <div className="summary-container fade-in">
      <div className="meta" style={{ marginBottom: "16px", marginTop: "16px", padding: "0 40px" }}>
        <button
          onClick={() => router.back()}
          className="text-sm font-extrabold text-gray-500 hover:text-gray-900 transition-colors inline-flex items-center gap-1 bg-transparent border-none p-0 cursor-pointer"
          style={{ textDecoration: "none" }}
        >
          <span className="material-symbols-outlined text-[18px]">
            arrow_back
          </span>
          Quay lại
        </button>
      </div>

      <h1 className="summary-title">Inspection Summary #{report.id}</h1>

      <div className="summary-grid">
        <div className="summary-card hover-card">
          <h2>
            <strong>1. Thông tin kiểm định</strong>
          </h2>

          <div className="info-row">
            <span>Ngày:</span>
            <strong>{report.date}</strong>
          </div>

          <div className="info-row">
            <span>Trạng thái:</span>
            <span
              className={
                report.status === "approve" ? "badge-pass" : "badge-fail"
              }
            >
              {report.status === "approve" ? "PASS" : "FAIL"}
            </span>
          </div>

          <div className="score-section">
            <div className="score-header">
              <span>Overall Score</span>
              <strong>{animatedScore}/100</strong>
            </div>

            <div className="progress-bar">
              <div
                className={`progress-fill ${getScoreColor()}`}
                style={{ width: `${animatedScore}%` }}
              />
            </div>
          </div>

          <div className="info-row">
            <span>Kết luận:</span>
            <strong>{report.conclusion}</strong>
          </div>
        </div>

        <div className="summary-card hover-card">
          <h2>
            <strong>2. Checklist kiểm định</strong>
          </h2>

          <table className="summary-table">
            <thead>
              <tr>
                <th>Hạng mục</th>
                <th>Kết quả</th>
                <th>Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {(["frame", "paint", "drivetrain"] as const).map((key) => (
                <tr key={key}>
                  <td>
                    {key === "frame"
                      ? "Khung sườn"
                      : key === "paint"
                        ? "Sơn / Decal"
                        : "Drivetrain"}
                  </td>
                  <td>
                    <span
                      className={
                        report.checklist[key].result === "pass"
                          ? "badge-pass"
                          : "badge-fail"
                      }
                    >
                      {report.checklist[key].result.toUpperCase()}
                    </span>
                  </td>
                  <td>{report.checklist[key].remark}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="summary-card media-card hover-card">
        <h2>
          <strong>3. Hình ảnh kiểm định</strong>
        </h2>

        <div className="summary-media-grid">
          {report.media.map((img, idx) => (
            <img key={idx} src={img} alt={`media-${idx}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
