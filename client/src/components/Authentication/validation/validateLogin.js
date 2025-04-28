const validateLogin = (values) => {
  let errors = {};

  if (!values.email) {
    errors.email = "Please enter your email address";
  } else if (
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      values.email
    )
  ) {
    errors.email = "Please enter a valid email address";
  }

  if (!values.password) {
    errors.password = "Please enter your password";
  }
  return errors;
};

export default validateLogin;
