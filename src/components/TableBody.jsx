export default function TableBody({ children, isEditable }) {
  return (
    <div className={isEditable ? "row w-100 h-100" : "row w-100 h-100  overflow-y-scroll"}>
      <ul className=" list-group list-group-flush gap-1">{children}</ul>
    </div>
  );
}

