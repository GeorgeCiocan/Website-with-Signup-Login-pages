import React, { Fragment } from "react";

const FormInput = ({
  label,
  name,
  type,
  placeholder,
  required,
  minLength,
  match,
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
    if (minLength) {
      if (value.length < minLength) {
        setError(`You need to enter at least ${minLength} characters`);
        return;
      } else {
        setError("");
      }
    }
    if (match) {
      if (!value.match(match) && type === "email") {
        setError("You must enter a valid email address");
        return;
      } else {
        setError("");
      }
      if (type === "password") {
        if (!value.match(match[0])) {
          setError("The password must contain at least one capital letter");
          return;
        }
        if (!value.match(match[1])) {
          setError("The password must contain at least one small letter");
          return;
        } else if (!value.match(match[2])) {
          setError("The password must contain at least one digit");
          return;
        } else {
          setError("");
        }
      }
    }
  };

  return (
    <Fragment>
      <label htmlFor={name}>{label}</label>
      <span className="error">{submitError ? submitError : error}</span>
      <input
        className={error ? "error" : ""}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onValueChange}
        onBlur={handleError}
      />
    </Fragment>
  );
};

export default FormInput;
