export default function Card({ children, className, style }) {
  return (
    <div
      className={"col h-100 " + className}
      style={{ backgroundColor: "transparent", ...style }}
    >
      <div
        className="w-100 h-100  rounded-3 p-3 bg-white"
        style={{ border: "1px solid #B9B9B9" }}
      >
        {children}
      </div>
    </div>
  );
}
