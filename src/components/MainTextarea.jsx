import "./MainInput.scss";

export default function MainTextarea({
  name,
  isEditable,
  defaultValue,
  label,
}) {
  return (
    <div className="col">
      <label htmlFor={name} className="col-form-label fw-bold  text-dark">
        {label}
      </label>
      <div className={isEditable ? "" : "input-visible"}>
        <textarea
          className="form-control"
          type="text"
          name={name}
          id={name}
          defaultValue={defaultValue}
          rows="3"
          visibility={isEditable ? "visible" : "hidden"}
          required
        ></textarea>
      </div>
      <div className={!isEditable ? "" : "input-visible"}>
        <p>{defaultValue}</p>
      </div>
    </div>
  );
}
