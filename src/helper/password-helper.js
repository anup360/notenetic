

const PasswordValidator = (props) => {


  const numberValidator = (value) => {
    if (value) {
      let formIsValid = true;
      var pattern = new RegExp(/(?=.*[0-9])/);
      if (!pattern.test(value)) {
        formIsValid = false;
      }
      return formIsValid;
    };
  }


  const alphabetValidator = (value) => {
    if (value) {
      let formIsValid = true;
      var pattern = new RegExp(/(?=.*[a-zA-Z])/);
      if (!pattern.test(value)) {
        formIsValid = false;
      }
      return formIsValid;
    };
  }


  const specialCharValidator = (value) => {
    if (value) {
      let formIsValid = true;
      var pattern = new RegExp(/(?=.*[!@#$%^&*])/);
      if (!pattern.test(value)) {
        formIsValid = false;
      }
      return formIsValid;
    };
  }

  return { numberValidator, alphabetValidator, specialCharValidator };
}

export default PasswordValidator;




