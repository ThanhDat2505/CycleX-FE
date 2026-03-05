"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Sender = "INSPECTOR" | "SELLER" | "SYSTEM";
type ListingStatus = "ACTIVE" | "ARCHIVED";

type Message = {
  id: string;
  sender: Sender;
  content: string;
  images?: string[];
  timestamp: string;
};

export default function InspectorChat() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const reqId = searchParams.get("req") || "REQ-Unknown";
  const listingId = searchParams.get("id") || "ID-Unknown";

  const [messages, setMessages] = useState<Message[]>([]);

  const [input, setInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [listingStatus] = useState<ListingStatus>("ACTIVE");

  const isLocked = listingStatus === "ARCHIVED";
  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadedImageUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    return () => {
      uploadedImageUrlsRef.current.forEach((imageUrl) => {
        URL.revokeObjectURL(imageUrl);
      });
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isLocked) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: "INSPECTOR",
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || isLocked) return;

    const previewUrl = URL.createObjectURL(file);
    uploadedImageUrlsRef.current.push(previewUrl);

    setIsUploading(true);
    setTimeout(() => {
      const newMsg: Message = {
        id: Date.now().toString(),
        sender: "INSPECTOR",
        content: "",
        images: [previewUrl],
        timestamp: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, newMsg]);
      setIsUploading(false);
      e.target.value = "";
    }, 1000);
  };

  return (
    <div className="chat-window">
      <aside className="chat-info-sidebar">
        <div className="chat-side-header">
          <button className="back-circle-btn" onClick={() => router.back()}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h3>Kiểm định</h3>
        </div>

        <div className="info-group">
          <div className="info-card">
            <p className="info-label">Mã yêu cầu</p>
            <p className="info-val">#{reqId}</p>
          </div>
          <div className="info-card">
            <p className="info-label">Mã tin đăng</p>
            <p className="info-val">{listingId}</p>
          </div>
          <div className="info-card status">
            <p className="info-label">Trạng thái</p>
            <span
              className={`status-pill-chat ${isLocked ? "locked" : "active"}`}
            >
              {isLocked ? "Đã khóa" : "Đang mở"}
            </span>
          </div>
        </div>

        <div className="chat-guide">
          <span className="material-symbols-outlined">info</span>
          <p>
            Mọi tin nhắn đều được ghi lại để làm bằng chứng giải quyết khiếu
            nại.
          </p>
        </div>
      </aside>

      <main className="chat-content">
        <div className="chat-top-bar">
          <div className="user-profile">
            <div className="avatar-box">S</div>
            <div>
              <p className="user-name">Người bán (Seller)</p>
              <p className="user-status">Trực tuyến</p>
            </div>
          </div>
        </div>

        <div className="chat-messages-area">
          {messages.map((msg) => {
            const isMe = msg.sender === "INSPECTOR";
            const isSystem = msg.sender === "SYSTEM";

            if (isSystem)
              return (
                <div key={msg.id} className="msg-system">
                  <span>{msg.content}</span>
                </div>
              );

            return (
              <div key={msg.id} className={`msg-row ${isMe ? "me" : "other"}`}>
                <div className="msg-bubble-container">
                  {msg.images?.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      className="msg-img"
                      alt="attachment"
                    />
                  ))}
                  {msg.content.trim() && (
                    <div className="msg-bubble">
                      {msg.content}
                      <span className="msg-time">{msg.timestamp}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>

        <div className="chat-input-container">
          {isLocked ? (
            <div className="chat-locked-msg">
              Cuộc hội thoại này đã kết thúc và được lưu trữ.
            </div>
          ) : (
            <div className="input-wrapper">
              <input
                type="file"
                accept=".jpg, .jpeg, .png"
                className="hidden-file-input"
                ref={fileInputRef}
                onChange={handleFileUpload}
              />
              <button
                className="attach-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="material-symbols-outlined">image</span>
              </button>
              <input
                className="main-chat-input"
                placeholder="Nhập nội dung trao đổi..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                className="send-btn"
                onClick={handleSend}
                disabled={!input.trim()}
              >
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
