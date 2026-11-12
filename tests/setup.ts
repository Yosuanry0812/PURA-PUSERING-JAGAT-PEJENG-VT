import { afterEach, vi } from "vitest";
if (typeof window !== "undefined") {
  await import("@testing-library/jest-dom/vitest");
  const { cleanup } = await import("@testing-library/react");
  afterEach(() => cleanup());
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
    value: function () {
      this.setAttribute("open", "");
    },
  });
  Object.defineProperty(HTMLDialogElement.prototype, "close", {
    value: function () {
      this.removeAttribute("open");
    },
  });
}
afterEach(() => {
  vi.useRealTimers();
});
