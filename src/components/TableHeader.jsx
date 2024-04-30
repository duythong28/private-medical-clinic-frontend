export default function TableHeader({ children }) {
  return (
    <div
      className="row list-group-item list-group-item-primary list-group-item-action d-flex flex-row w-100 fw-bold"
      style={{ padding: "8px 15px", color: "#1B59F8" }}
    >
      {children}
    </div>
  );
}
