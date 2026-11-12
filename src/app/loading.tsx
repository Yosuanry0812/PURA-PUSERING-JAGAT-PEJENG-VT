export default function Loading() {
  return (
    <div
      className="container section"
      role="status"
      aria-label="Memuat halaman"
    >
      <div className="skeleton" />
      <div className="skeleton" />
    </div>
  );
}
