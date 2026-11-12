"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Save, Upload, Eye, ArrowUpRight } from "lucide-react";
import { modules, moduleSchema, type Field } from "@/lib/modules";
import type { ContentRow } from "@/lib/content";
import {
  saveContent,
  uploadMedia,
  type ActionState,
} from "@/app/admin/actions";
import { Media, Prose } from "@/components/public/ui";
import { safeHttps } from "@/lib/urls";
import { allowsReference, referencePhotos } from "@/lib/reference-media";
export function ContentForm({
  moduleKey,
  initial,
  objects = [],
  saved = false,
}: {
  moduleKey: string;
  initial?: ContentRow;
  objects?: { id: string; name: string }[];
  saved?: boolean;
}) {
  const m = modules[moduleKey];
  const router = useRouter();
  const [id, setId] = useState<string | undefined>(
    initial ? String(initial.id) : undefined,
  );
  const [values, setValues] = useState<
    Record<string, string | number | boolean>
  >(() =>
    Object.fromEntries(
      m.fields.map((f) => [
        f.name,
        initial?.[f.name] ??
          (f.type === "checkbox"
            ? false
            : f.type === "number"
              ? 0
              : f.type === "select"
                ? (f.options?.[0] ?? "")
                : ""),
      ]),
    ),
  );
  const [pending, setPending] = useState(false);
  const [uploading, setUploading] = useState("");
  const [feedback, setFeedback] = useState<ActionState>({
    ok: saved,
    message: saved ? "Perubahan tersimpan di Supabase." : "",
  });
  const [preview, setPreview] = useState(false);
  const feedbackRef = useRef<HTMLDivElement>(null);
  function change(f: Field, value: string | number | boolean) {
    setValues((v) => ({ ...v, [f.name]: value }));
  }
  async function upload(f: Field, file: File | undefined) {
    if (!file) return;
    setUploading(f.name);
    setFeedback({ ok: false, message: "" });
    try {
      const form = new FormData();
      form.set("file", file);
      const result = await uploadMedia(moduleKey, form);
      setFeedback(result);
      if (result.ok && result.id) change(f, result.id);
    } catch {
      setFeedback({
        ok: false,
        message: "Upload terputus. Periksa koneksi atau login kembali.",
      });
    } finally {
      setUploading("");
    }
  }
  async function submit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const check = moduleSchema(m).safeParse(values);
    if (!check.success) {
      setFeedback({
        ok: false,
        message: "Periksa isian yang ditandai.",
        errors: check.error.flatten().fieldErrors,
      });
      setTimeout(() => feedbackRef.current?.focus(), 0);
      return;
    }
    setPending(true);
    setFeedback({ ok: false, message: "" });
    try {
      const result = await saveContent(moduleKey, id, values);
      setFeedback(result);
      if (result.ok) {
        setId(result.id);
        if (!m.single && !id && result.id) {
          router.replace(
            "/admin/" + moduleKey + "?edit=" + result.id + "&saved=1",
          );
        } else {
          router.refresh();
        }
      }
    } catch {
      setFeedback({
        ok: false,
        message: "Penyimpanan terputus. Periksa koneksi dan sesi admin.",
      });
    } finally {
      setPending(false);
      setTimeout(() => feedbackRef.current?.focus(), 0);
    }
  }
  const disabled = pending || Boolean(uploading);
  return (
    <form className="content-form" onSubmit={submit}>
      <div className="form-toolbar">
        <p>
          {m.single ? "Konten halaman" : "Informasi konten"} ·{" "}
          {initial ? "Edit data" : "Data baru"}
        </p>
        <button
          className="button button-small button-outline-dark"
          type="button"
          onClick={() => setPreview(!preview)}
        >
          <Eye size={16} />
          {preview ? "Tutup preview" : "Preview isi"}
        </button>
      </div>
      {preview && (
        <section className="form-preview" aria-label="Preview konten">
          <p className="eyebrow">PRATINJAU · BELUM TENTU TERPUBLIKASI</p>
          {m.fields
            .filter(
              (f) =>
                values[f.name] &&
                (f.type === "textarea" ||
                  f.name === "title" ||
                  f.name === "name" ||
                  f.type === "image"),
            )
            .map((f) => (
              <div key={f.name}>
                {f.type === "image" ? (
                  <Media
                    path={values[f.name]}
                    alt={String(values.image_alt ?? f.label)}
                  />
                ) : (
                  <>
                    <h3>{f.label}</h3>
                    <Prose value={String(values[f.name])} />
                  </>
                )}
              </div>
            ))}
          {moduleKey === "virtual-tour" &&
            safeHttps(String(values.tour_url)) && (
              <a
                className="text-link"
                href={String(values.tour_url)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Buka pratinjau URL
                <ArrowUpRight size={15} />
              </a>
            )}
        </section>
      )}
      <fieldset disabled={disabled}>
        <legend className="sr-only">{m.title}</legend>
        <div className="form-grid">
          {m.fields.map((f) => {
            const fieldId = "field-" + f.name;
            const errors = feedback.errors?.[f.name];
            const options =
              f.name === "temple_object_id"
                ? objects.map((o) => ({ value: o.id, label: o.name }))
                : f.options?.map((o) => ({
                    value: o,
                    label:
                      o === "published"
                        ? "Terbit"
                        : o === "draft"
                          ? "Draft"
                          : o,
                  }));
            return (
              <div
                className={
                  "field " +
                  (f.type === "textarea" || f.type === "image"
                    ? "field-wide"
                    : "") +
                  (f.type === "checkbox" ? " field-check" : "")
                }
                key={f.name}
              >
                <label htmlFor={fieldId}>
                  {f.type === "checkbox" ? (
                    <input
                      id={fieldId}
                      type="checkbox"
                      checked={Boolean(values[f.name])}
                      onChange={(e) => change(f, e.target.checked)}
                    />
                  ) : null}
                  {f.label}
                  {f.required && <span aria-hidden="true"> *</span>}
                </label>
                {f.type === "textarea" ? (
                  <textarea
                    id={fieldId}
                    rows={5}
                    required={f.required}
                    maxLength={20000}
                    value={String(values[f.name])}
                    onChange={(e) => change(f, e.target.value)}
                    aria-invalid={Boolean(errors)}
                    aria-describedby={errors ? fieldId + "-error" : undefined}
                  />
                ) : f.type === "select" ? (
                  <select
                    id={fieldId}
                    required={f.required}
                    value={String(values[f.name])}
                    onChange={(e) => change(f, e.target.value)}
                  >
                    <>
                      {f.name === "temple_object_id" && (
                        <option value="">Tanpa objek terkait</option>
                      )}
                      {options?.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </>
                  </select>
                ) : f.type === "image" ? (
                  <div className="upload-field">
                    {allowsReference(m.table) &&
                      !["logo_url", "favicon_url"].includes(f.name) && (
                        <label className="reference-select">
                          Foto referensi sementara
                          <select
                            value={
                              String(values[f.name]).startsWith("reference/")
                                ? String(values[f.name])
                                : ""
                            }
                            onChange={(e) => {
                              if (e.target.value) {
                                change(f, e.target.value);
                                const altField = m.fields.find(
                                  (x) =>
                                    x.name ===
                                    (f.name === "hero_image_url"
                                      ? "hero_image_alt"
                                      : f.name === "intro_image_url"
                                        ? "intro_image_alt"
                                        : f.name === "cover_image_url"
                                          ? "cover_image_alt"
                                          : "image_alt"),
                                );
                                if (altField)
                                  change(
                                    altField,
                                    referencePhotos.find(
                                      (p) => p.path === e.target.value,
                                    )?.title ?? "",
                                  );
                              }
                            }}
                          >
                            <option value="">
                              Gunakan unggahan sendiri / tanpa pilihan referensi
                            </option>
                            {referencePhotos.map((p) => (
                              <option key={p.path} value={p.path}>
                                {p.title}
                              </option>
                            ))}
                          </select>
                          <small>
                            Foto berlisensi terbuka ini merupakan aset publik.
                            Gunakan upload privat untuk dokumentasi sendiri.
                          </small>
                        </label>
                      )}
                    {values[f.name] && (
                      <Media
                        path={values[f.name]}
                        alt={String(values.image_alt ?? f.label)}
                      />
                    )}
                    <label className="upload-label" htmlFor={fieldId}>
                      <Upload size={18} />
                      {uploading === f.name ? "Mengunggah…" : "Pilih gambar"}
                      <input
                        id={fieldId}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={(e) => void upload(f, e.target.files?.[0])}
                      />
                    </label>
                    <small>
                      JPEG, PNG, WebP · maksimum 3 MiB · disimpan privat
                    </small>
                    {Boolean(values[f.name]) && (
                      <button
                        type="button"
                        className="text-link"
                        onClick={() => change(f, "")}
                      >
                        Lepaskan gambar dari konten
                      </button>
                    )}
                  </div>
                ) : f.type !== "checkbox" ? (
                  <input
                    id={fieldId}
                    type={
                      f.type === "number"
                        ? "number"
                        : f.type === "email"
                          ? "email"
                          : f.type === "url"
                            ? "url"
                            : "text"
                    }
                    required={f.required}
                    maxLength={500}
                    min={f.type === "number" ? 0 : undefined}
                    max={f.type === "number" ? 999999 : undefined}
                    value={String(values[f.name])}
                    onChange={(e) =>
                      change(
                        f,
                        f.type === "number"
                          ? Number(e.target.value)
                          : e.target.value,
                      )
                    }
                    aria-invalid={Boolean(errors)}
                    aria-describedby={errors ? fieldId + "-error" : undefined}
                  />
                ) : null}
                {f.help && <small>{f.help}</small>}
                {errors && (
                  <p className="field-error" id={fieldId + "-error"}>
                    {errors.join(" ")}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </fieldset>
      <div
        ref={feedbackRef}
        tabIndex={-1}
        className={
          feedback.message
            ? "form-feedback " + (feedback.ok ? "success" : "error")
            : ""
        }
        role={feedback.ok ? "status" : "alert"}
      >
        {feedback.message}
      </div>
      <div className="form-submit">
        <span>Perubahan publik akan berlaku setelah disimpan.</span>
        <button className="button button-green" disabled={disabled}>
          {pending ? (
            <LoaderCircle size={17} className="spin" />
          ) : (
            <Save size={17} />
          )}
          {pending ? "Menyimpan…" : "Simpan perubahan"}
        </button>
      </div>
    </form>
  );
}
