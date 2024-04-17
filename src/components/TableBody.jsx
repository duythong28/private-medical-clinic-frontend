export default function TableBody({ children }) {
  return (
    <div className="row w-100 h-100 overflow-y-scroll">
      <ul className=" list-group list-group-flush gap-1">{children}</ul>
    </div>
  );
}

