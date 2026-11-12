// @vitest-environment jsdom
import { it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ContentForm } from "@/components/forms/content-form";
import { DeleteButton } from "@/components/admin/delete-button";
const actions = vi.hoisted(() => ({
  save: vi.fn(),
  upload: vi.fn(),
  remove: vi.fn(),
  refresh: vi.fn(),
  replace: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh: actions.refresh, replace: actions.replace }),
}));
vi.mock("@/app/admin/actions", () => ({
  saveContent: actions.save,
  uploadMedia: actions.upload,
  deleteContent: actions.remove,
}));
beforeEach(() => {
  vi.clearAllMocks();
});
function historyForm() {
  render(<ContentForm moduleKey="sejarah" />);
  fireEvent.change(screen.getByLabelText("Judul", { exact: false }), {
    target: { value: "Narasi yang diperiksa" },
  });
  fireEvent.change(screen.getByLabelText("Slug", { exact: false }), {
    target: { value: "narasi-diperiksa" },
  });
  fireEvent.change(screen.getByLabelText("Isi sejarah", { exact: false }), {
    target: { value: "Teks sejarah untuk pengujian form." },
  });
}
it("form mengirim draft ke Server Action dan memakai ID tersimpan pada perubahan berikutnya", async () => {
  actions.save.mockResolvedValue({
    ok: true,
    message: "Perubahan tersimpan di Supabase.",
    id: "record-id",
  });
  historyForm();
  fireEvent.click(screen.getByRole("button", { name: "Simpan perubahan" }));
  await waitFor(() =>
    expect(actions.save).toHaveBeenCalledWith(
      "sejarah",
      undefined,
      expect.objectContaining({ slug: "narasi-diperiksa", status: "draft" }),
    ),
  );
  await waitFor(() =>
    expect(screen.getByRole("status")).toHaveTextContent(
      "tersimpan di Supabase",
    ),
  );
  fireEvent.click(screen.getByRole("button", { name: "Simpan perubahan" }));
  await waitFor(() =>
    expect(actions.save).toHaveBeenLastCalledWith(
      "sejarah",
      "record-id",
      expect.any(Object),
    ),
  );
});
it("form menampilkan penolakan server dan tetap dapat diperbaiki", async () => {
  actions.save.mockResolvedValue({
    ok: false,
    message: "Penyimpanan gagal. Periksa izin dan sesi.",
  });
  historyForm();
  fireEvent.click(screen.getByRole("button", { name: "Simpan perubahan" }));
  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent("Penyimpanan gagal"),
  );
  expect(
    screen.getByRole("button", { name: "Simpan perubahan" }),
  ).not.toBeDisabled();
});
it("form menolak slug berbahaya sebelum memanggil server", async () => {
  historyForm();
  fireEvent.change(screen.getByLabelText("Slug", { exact: false }), {
    target: { value: "../invalid" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Simpan perubahan" }));
  await waitFor(() =>
    expect(screen.getByRole("alert")).toHaveTextContent("Periksa isian"),
  );
  expect(actions.save).not.toHaveBeenCalled();
});
it("hapus memerlukan dialog konfirmasi sebelum action dipanggil", async () => {
  actions.remove.mockResolvedValue({ ok: true, message: "Dihapus" });
  render(<DeleteButton moduleKey="sejarah" id="id-uji" title="Narasi uji" />);
  fireEvent.click(screen.getByRole("button", { name: "Hapus Narasi uji" }));
  expect(screen.getByRole("dialog")).toBeVisible();
  expect(actions.remove).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Batal" }));
  expect(actions.remove).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Hapus Narasi uji" }));
  fireEvent.click(screen.getByRole("button", { name: "Hapus konten" }));
  await waitFor(() =>
    expect(actions.remove).toHaveBeenCalledWith("sejarah", "id-uji"),
  );
  await waitFor(() => expect(actions.refresh).toHaveBeenCalled());
});
