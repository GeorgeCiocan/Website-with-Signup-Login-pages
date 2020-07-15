import React, { Fragment } from "react";

const TextArea = ({
  label,
  name,
  rows,
  placeholder,
  required,
  onValueChange,
  value,
  submitError,
}) => {
  const [error, setError] = React.useState("");

  const handleError = () => {
    if (required) {
      if (value === "") {
        setError("This field is required");
        return;
      } else {
        setError("");
      }
    }
  };

  return (
    <Fragment>
      <label htmlFor={name}>{label}</label>
      <span className="error">{submitError ? submitError : error}</span>
      <textarea
        className={error ? "error" : ""}
        name={name}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={onValueChange}
        onBlur={handleError}
      />
    </Fragment>
  );
};

export default TextArea;
