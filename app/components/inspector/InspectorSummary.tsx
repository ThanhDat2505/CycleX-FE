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
        <button onClick={() => router.push("/review-required")}>
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
      <div className="summary-actions">
        <button className="summary-btn" onClick={() => router.back()}>
          ← Back to Inspection Detail
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
