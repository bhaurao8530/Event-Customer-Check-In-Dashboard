export const validateEmail = (email) => /.+@.+\..+/.test(email);

export const validateRequired = (value) => value && String(value).trim().length > 0;

export const getLoginErrors = (form) => {
  const errors = {};

  if (!validateEmail(form.email)) {
    errors.email = "Enter a valid email";
  }

  if (!validateRequired(form.password) || form.password.length < 4) {
    errors.password = "Password must be at least 4 characters";
  }

  return errors;
};

export const getCustomerErrors = (form) => {
  const errors = {};

  if (!validateRequired(form.name)) errors.name = "Customer name is required";
  if (!validateRequired(form.mobile)) errors.mobile = "Mobile number is required";
  if (!validateEmail(form.email)) errors.email = "Enter a valid email";
  if (!validateRequired(form.projectName)) errors.projectName = "Project name is required";

  return errors;
};
