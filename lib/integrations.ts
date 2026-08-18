import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { createClient } from "@supabase/supabase-js";

const algorithm = "aes-256-gcm";
function key() { const value = process.env.INTEGRATION_ENCRYPTION_KEY; if (!value || !/^[a-f0-9]{64}$/i.test(value)) throw new Error("Integration encryption is not configured."); return Buffer.from(value, "hex"); }
function client() { const service = process.env.SUPABASE_SERVICE_ROLE_KEY; if (!service) throw new Error("Supabase service access is not configured."); return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, service); }
export function encryptConfig(value: unknown) { const iv = randomBytes(12), cipher = createCipheriv(algorithm, key(), iv); const data = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]); return [iv.toString("base64"), cipher.getAuthTag().toString("base64"), data.toString("base64")].join("."); }
export function decryptConfig<T>(value: string): T { const [iv, tag, data] = value.split("."); const decipher = createDecipheriv(algorithm, key(), Buffer.from(iv, "base64")); decipher.setAuthTag(Buffer.from(tag, "base64")); return JSON.parse(Buffer.concat([decipher.update(Buffer.from(data, "base64")), decipher.final()]).toString("utf8")) as T; }
export async function getIntegration<T>(provider: string) { const { data, error } = await client().from("integration_settings").select("encrypted_config").eq("provider", provider).maybeSingle(); if (error || !data) return null; return decryptConfig<T>(data.encrypted_config); }
export async function saveIntegration(provider: string, value: unknown, actorId: string) { const { error } = await client().from("integration_settings").upsert({ provider, encrypted_config: encryptConfig(value), updated_by: actorId }, { onConflict: "provider" }); if (error) throw error; }
