const validatePassword = (values) => {
  let errors = {};

  if (!values.password) {
    errors.password = "Please enter a valid password.";
  } else if (
    !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-#!$@%^&*()_+|~=`{}\[\]:";'<>?,.\/ ]).{8,}$/.test(
      values.password
    )
  ) {
    errors.password =
      "Your password must be at least 8 characters long, and include at least one lowercase letter, one uppercase letter, one special character, and one number.";
  }

  if (!values.confirmPswd) {
    errors.confirmPswd = "Please confirm your password.";
  } else if (values.confirmPswd !== values.password) {
    errors.confirmPswd = "Passwords do not match.";
  }

  return errors;
};

export default validatePassword;
