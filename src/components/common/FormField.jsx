function FormField({
  label,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  name,
  as = "input",
  rows = 3,
  options = [],
  ...props
}) {
  const renderInput = () => {
    if (as === "select") {
      return (
        <select className="field" value={value} onChange={onChange} name={name} {...props}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    if (as === "textarea") {
      return <textarea className="field" rows={rows} value={value} onChange={onChange} name={name} placeholder={placeholder} {...props} />;
    }

    return <input className="field" type={type} value={value} onChange={onChange} name={name} placeholder={placeholder} {...props} />;
  };

  return (
    <div>
      {label ? <label>{label}</label> : null}
      {renderInput()}
      {error ? <span className="error-text">{error}</span> : null}
    </div>
  );
}

export default FormField;
