import "server-only";
import { redirect } from "next/navigation";
import { configured } from "./supabase/config";
import { serverClient } from "./supabase/server";
export async function adminIdentity() {
  if (!configured()) return null;
  const client = await serverClient();
  const {
    data: { user },
    error,
  } = await client.auth.getUser();
  if (error || !user) return null;
  const { data: admin } = await client
    .from("admin_users")
    .select("display_name")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single();
  return admin
    ? { client, user, displayName: admin.display_name as string }
    : null;
}
export async function requireAdmin() {
  const admin = await adminIdentity();
  if (!admin) redirect("/admin/login?reason=access");
  return admin;
}
