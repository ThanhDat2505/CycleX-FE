import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

const MIME_TYPES: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".mov": "video/quicktime",
};

/**
 * Serve uploaded files from the uploads/ directory.
 * Next.js production does NOT serve files added to public/ after build time,
 * so this route handles serving user-uploaded images and videos.
 */
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> },
) {
    const segments = (await params).path;

    // Prevent path traversal attacks
    if (segments.some((s) => s === ".." || s.includes("\0"))) {
        return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    const relativePath = path.join(...segments);
    const filePath = path.join(process.cwd(), "uploads", relativePath);

    // Ensure resolved path stays within uploads/
    const uploadsRoot = path.join(process.cwd(), "uploads");
    const resolved = path.resolve(filePath);
    if (!resolved.startsWith(uploadsRoot)) {
        return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    try {
        const fileStat = await stat(resolved);
        if (!fileStat.isFile()) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        const ext = path.extname(resolved).toLowerCase();
        const contentType = MIME_TYPES[ext] || "application/octet-stream";

        const buffer = await readFile(resolved);

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Content-Length": fileStat.size.toString(),
                "Cache-Control": "public, max-age=31536000, immutable",
            },
        });
    } catch {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
}
