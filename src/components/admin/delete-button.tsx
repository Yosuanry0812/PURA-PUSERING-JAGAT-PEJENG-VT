"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteContent } from "@/app/admin/actions";
export function DeleteButton({
  moduleKey,
  id,
  title,
}: {
  moduleKey: string;
  id: string;
  title: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  function close() {
    if (pending) return;
    dialog.current?.close();
    trigger.current?.focus();
  }
  return (
    <>
      <button
        ref={trigger}
        className="icon-button danger"
        aria-label={"Hapus " + title}
        onClick={() => dialog.current?.showModal()}
      >
        <Trash2 size={17} />
      </button>
      <dialog
        ref={dialog}
        className="confirm-dialog"
        aria-labelledby={"delete-" + id}
        onCancel={(e) => {
          if (pending) e.preventDefault();
        }}
      >
        <h2 id={"delete-" + id}>Hapus konten ini?</h2>
        <p>
          “{title}” akan dihapus dari database dan tidak tampil lagi di website
          publik.
        </p>
        <p className="small muted">
          Berkas media dipertahankan untuk menjaga referensi konten lain.
        </p>
        {error && (
          <p role="alert" className="field-error">
            {error}
          </p>
        )}
        <div className="button-row">
          <button
            className="button button-outline-dark"
            onClick={close}
            disabled={pending}
            autoFocus
          >
            Batal
          </button>
          <button
            className="button button-danger"
            disabled={pending}
            onClick={async () => {
              setPending(true);
              try {
                const r = await deleteContent(moduleKey, id);
                if (r.ok) {
                  dialog.current?.close();
                  router.refresh();
                } else setError(r.message);
              } catch {
                setError("Penghapusan gagal. Periksa koneksi dan sesi.");
              } finally {
                setPending(false);
              }
            }}
          >
            {pending ? "Menghapus…" : "Hapus konten"}
          </button>
        </div>
      </dialog>
    </>
  );
}
