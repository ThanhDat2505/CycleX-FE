"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function InspectorChecklist() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id") || "ID-55555";

  const [score, setScore] = useState<number | "">("");
  const [conclusion, setConclusion] = useState("");

  const [checklist, setChecklist] = useState({
    frame: { result: "", remark: "" },
    paint: { result: "", remark: "" },
    drivetrain: { result: "", remark: "" },
  });

  const [media, setMedia] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newMediaUrls = filesArray.map((file) => URL.createObjectURL(file));
      setMedia((prev) => [...prev, ...newMediaUrls]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setMedia((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = (status: "approve" | "reject" | "need_info") => {
    if (status === "approve" || status === "reject") {
      const reportData = {
        id: idParam,
        score: score || 0,
        conclusion: conclusion || "Không có nhận xét thêm.",
        checklist: checklist,
        media: media,
        status: status,
        date: new Date().toLocaleDateString("vi-VN"),
      };

      sessionStorage.setItem(
        "tempInspectionReport",
        JSON.stringify(reportData),
      );

      alert("Đã lưu biên bản kiểm định thành công!");
      router.push(`/inspector/inspector-summary?id=${idParam}`);
    } else {
      alert("Đã gửi yêu cầu bổ sung thông tin cho Seller!");
      router.push("/inspector/review-required");
    }
  };

  return (
    <main className="main-content">
      <div className="wrap">
        <header className="pageHeader">
          <div className="header">
            <div>
              <h1 className="title">
                Perform Inspection: <span>#{idParam}</span>
              </h1>
              <div className="meta">
                <div className="metaItem">
                  <span className="metaLabel">Listing:</span>
                  <strong>Giant Propel Advanced SL 0 (2025)</strong>
                </div>
              </div>
            </div>
            <div className="rightActions">
              <button className="btnGhost" onClick={() => router.back()}>
                ← Quay lại
              </button>
            </div>
          </div>
        </header>

        <div className="layout">
          <section className="left">
            <div className="box">
              <div className="boxTitle">1. Đánh giá chi tiết (Checklist)</div>

              <table className="styled-table" style={{ marginBottom: "20px" }}>
                <thead>
                  <tr>
                    <th>Hạng mục</th>
                    <th style={{ width: "150px", textAlign: "center" }}>
                      Kết quả
                    </th>
                    <th>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 800 }}>
                      Tình trạng Khung Sườn (Nứt/gãy)
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <select
                        className="select"
                        value={checklist.frame.result}
                        onChange={(e) =>
                          setChecklist({
                            ...checklist,
                            frame: {
                              ...checklist.frame,
                              result: e.target.value,
                            },
                          })
                        }
                      >
                        <option value="">-- Chọn --</option>
                        <option value="pass">PASS</option>
                        <option value="fail">FAIL</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input"
                        placeholder="Nhập ghi chú..."
                        style={{ width: "100%", height: "40px" }}
                        value={checklist.frame.remark}
                        onChange={(e) =>
                          setChecklist({
                            ...checklist,
                            frame: {
                              ...checklist.frame,
                              remark: e.target.value,
                            },
                          })
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 800 }}>Tình trạng Sơn / Decal</td>
                    <td style={{ textAlign: "center" }}>
                      <select
                        className="select"
                        value={checklist.paint.result}
                        onChange={(e) =>
                          setChecklist({
                            ...checklist,
                            paint: {
                              ...checklist.paint,
                              result: e.target.value,
                            },
                          })
                        }
                      >
                        <option value="">-- Chọn --</option>
                        <option value="pass">PASS</option>
                        <option value="fail">FAIL</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input"
                        placeholder="Nhập ghi chú..."
                        style={{ width: "100%", height: "40px" }}
                        value={checklist.paint.remark}
                        onChange={(e) =>
                          setChecklist({
                            ...checklist,
                            paint: {
                              ...checklist.paint,
                              remark: e.target.value,
                            },
                          })
                        }
                      />
                    </td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 800 }}>
                      Bộ truyền động (Drivetrain)
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <select
                        className="select"
                        value={checklist.drivetrain.result}
                        onChange={(e) =>
                          setChecklist({
                            ...checklist,
                            drivetrain: {
                              ...checklist.drivetrain,
                              result: e.target.value,
                            },
                          })
                        }
                      >
                        <option value="">-- Chọn --</option>
                        <option value="pass">PASS</option>
                        <option value="fail">FAIL</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input"
                        placeholder="Nhập ghi chú..."
                        style={{ width: "100%", height: "40px" }}
                        value={checklist.drivetrain.remark}
                        onChange={(e) =>
                          setChecklist({
                            ...checklist,
                            drivetrain: {
                              ...checklist.drivetrain,
                              remark: e.target.value,
                            },
                          })
                        }
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="box">
              <div className="boxTitle">2. Upload Bằng Chứng (Media)</div>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--muted)",
                  marginBottom: "16px",
                }}
              >
                Tải lên hình ảnh các vết xước, lỗi, hoặc video test động
                cơ/chuyển số.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
                {media.map((imgUrl, idx) => (
                  <div
                    key={idx}
                    style={{
                      position: "relative",
                      width: "120px",
                      height: "120px",
                      borderRadius: "12px",
                      border: "1px solid var(--border)",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={imgUrl}
                      alt={`Uploaded ${idx}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      onClick={() => removeImage(idx)}
                      style={{
                        position: "absolute",
                        top: "4px",
                        right: "4px",
                        background: "rgba(0,0,0,0.6)",
                        color: "#fff",
                        border: "none",
                        borderRadius: "50%",
                        width: "24px",
                        height: "24px",
                        cursor: "pointer",
                        fontSize: "12px",
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <input
                  type="file"
                  id="media-upload"
                  accept=".png, .jpg, .jpeg"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />

                <label
                  htmlFor="media-upload"
                  className="img-placeholder"
                  style={{
                    width: "120px",
                    height: "120px",
                    cursor: "pointer",
                    border: "2px dashed var(--border)",
                    background: "var(--bg)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    borderRadius: "12px",
                    transition: "0.2s",
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: "28px", color: "var(--muted)" }}
                  >
                    add_photo_alternate
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 800,
                      color: "var(--muted)",
                    }}
                  >
                    Upload
                  </span>
                </label>
              </div>
            </div>

            <div className="box">
              <div className="boxTitle">3. Kết luận chung</div>
              <div className="field">
                <label className="label">Điểm tổng quan (0 - 100)</label>
                <input
                  type="number"
                  className="input"
                  style={{
                    width: "150px",
                    fontWeight: 900,
                    fontSize: "18px",
                    color: "var(--blue)",
                  }}
                  placeholder="VD: 95"
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                />
              </div>
              <div className="field" style={{ marginTop: "16px" }}>
                <label className="label">Kết luận của Inspector</label>
                <textarea
                  className="textarea"
                  placeholder="Nhập đánh giá tổng quan về chiếc xe..."
                  value={conclusion}
                  onChange={(e) => setConclusion(e.target.value)}
                />
              </div>
            </div>
          </section>

          <aside className="card" style={{ top: "24px" }}>
            <div className="irdHead" style={{ marginBottom: "16px" }}>
              <div className="boxTitle" style={{ marginBottom: 0 }}>
                Hành động
              </div>
              <span className="irdBadge">Action Required</span>
            </div>

            <p
              style={{
                fontSize: "13px",
                color: "var(--muted)",
                marginBottom: "16px",
                lineHeight: 1.5,
              }}
            >
              Hãy kiểm tra kỹ các thông tin trước khi ra quyết định. Biên bản
              sau khi lưu sẽ không thể chỉnh sửa.
            </p>

            <button
              className="actionBtn approve"
              onClick={() => handleSubmit("approve")}
            >
              DUYỆT & LƯU BIÊN BẢN
            </button>
            <button
              className="actionBtn reject"
              onClick={() => handleSubmit("reject")}
              style={{ marginBottom: "12px" }}
            >
              TỪ CHỐI
            </button>
          </aside>
        </div>
      </div>
    </main>
  );
}
