const validateSignUp = (values) => {
  let errors = {};

  if (!values.lastName) {
    errors.lastName = "Please enter your last name";
  } else if (!/^[A-Za-z]+$/.test(values.lastName)) {
    errors.lastName = "Please enter a valid last name";
  }

  if (!values.firstName) {
    errors.firstName = "Please enter your first name";
  } else if (!/^[A-Za-z]+$/.test(values.firstName)) {
    errors.firstName = "Please enter a valid first name";
  }

  if (!values.email) {
    errors.email = "Please enter an email address";
  } else if (
    !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      values.email
    )
  ) {
    errors.email = "Please enter a valid email address";
  }

  if (!values.phone) {
    errors.phone = "Phone number is required";
  } else if (!/^(0|\+33)[1-9]([-. ]?[0-9]{2}){4}$/.test(values.phone)) {
    errors.phone = "Please enter a valid phone number (without spaces)";
  }

  if (!values.password) {
    errors.password = "Please enter a valid password";
  } else if (
    !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[-#!$@%^&*()_+|~=`{}\[\]:";'<>?,.\/ ]).{8,}$/.test(
      values.password
    )
  ) {
    errors.password =
      "Your password must contain at least 8 characters, one lowercase letter, one uppercase letter, one special character, and one number.";
  }

  return errors;
};

export default validateSignUp;
