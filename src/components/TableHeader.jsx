export default function TableHeader({ children }) {
  return (
    <div
      className="row list-group-item  list-group-item-action d-flex flex-row w-100 fw-bold"
      style={{
        padding: "8px 15px",
        color: "#36383A",
        background: "#F1F4F9",
        border: "1px solid #F1F4F9",
        borderRadius: "6px",
        zIndex: 0,
      }}
    >
      {children}
    </div>
  );
}
