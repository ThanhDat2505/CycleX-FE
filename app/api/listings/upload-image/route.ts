import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function sanitizeFileName(fileName: string): string {
    return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
}

function inferExtension(fileName: string, mimeType: string): string {
    const extFromName = path.extname(fileName || "").toLowerCase();
    if (extFromName) {
        return extFromName;
    }

    if (mimeType === "image/png") return ".png";
    if (mimeType === "image/jpeg") return ".jpg";
    if (mimeType === "image/webp") return ".webp";
    if (mimeType === "image/gif") return ".gif";
    return ".jpg";
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");
        const listingIdRaw = formData.get("listingId");

        if (!(file instanceof File)) {
            return NextResponse.json({ message: "File is required" }, { status: 400 });
        }

        const listingId = String(listingIdRaw || "temp").replace(/[^0-9a-zA-Z_-]/g, "");
        if (!listingId) {
            return NextResponse.json({ message: "Invalid listingId" }, { status: 400 });
        }

        const baseName = sanitizeFileName(path.basename(file.name || "image"));
        const extension = inferExtension(baseName, file.type);
        const nameWithoutExt = baseName.replace(/\.[^/.]+$/, "") || "image";
        const savedFileName = `${Date.now()}-${nameWithoutExt}${extension}`;

        // Save as /public/public/{listingId}/{fileName} so it is served at /public/{listingId}/{fileName}
        const relativeDir = path.join("public", "public", listingId);
        const outputDir = path.join(process.cwd(), relativeDir);
        await mkdir(outputDir, { recursive: true });

        const bytes = Buffer.from(await file.arrayBuffer());
        const outputPath = path.join(outputDir, savedFileName);
        await writeFile(outputPath, bytes);

        return NextResponse.json(
            { url: `/public/${listingId}/${savedFileName}` },
            { status: 201 }
        );
    } catch {
        return NextResponse.json(
            { message: "Failed to upload image" },
            { status: 500 }
        );
    }
}
