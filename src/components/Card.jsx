export default function Card({ children }) {
  return (
    <div className="col  h-100 p-3" style={{ backgroundColor: "#E9ECEF" }}>
      <div
        className="w-100 h-100 shadow rounded-2 p-3 bg-white"
        style={{ border: "1px solid #f0f0f0" }}
      >
        {children}
      </div>
    </div>
  );
}
