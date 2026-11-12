import { NextResponse } from "next/server";
import { configured } from "@/lib/supabase/config";
import { serverClient } from "@/lib/supabase/server";
export const dynamic = "force-dynamic";
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const value = path.join("/");
  if (
    !configured() ||
    !/^([a-z-]+)\/[0-9a-f-]{36}\.(jpg|png|webp)$/.test(value)
  )
    return new NextResponse(null, { status: 404 });
  const client = await serverClient();
  const { data, error } = await client.storage
    .from("temple-media")
    .download(value);
  if (error || !data)
    return new NextResponse(null, {
      status: 404,
      headers: { "Cache-Control": "private, no-store" },
    });
  return new NextResponse(data, {
    headers: {
      "Content-Type": data.type,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'; sandbox",
      "X-Robots-Tag": "noindex",
    },
  });
}
