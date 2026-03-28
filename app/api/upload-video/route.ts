import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only MP4, WebM, and MOV are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_VIDEO_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 50MB." },
        { status: 400 }
      );
    }

    // Determine file extension
    const extMap: Record<string, string> = {
      "video/mp4": ".mp4",
      "video/webm": ".webm",
      "video/quicktime": ".mov",
    };
    const ext = extMap[file.type] || ".mp4";
    const fileName = `${randomUUID()}${ext}`;

    // Ensure video directory exists
    const videoDir = path.join(process.cwd(), "uploads", "video");
    await mkdir(videoDir, { recursive: true });

    // Write file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(videoDir, fileName);
    await writeFile(filePath, buffer);

    const url = `/video/${fileName}`;

    return NextResponse.json({ url, fileName });
  } catch {
    return NextResponse.json(
      { error: "Failed to upload video" },
      { status: 500 }
    );
  }
}
