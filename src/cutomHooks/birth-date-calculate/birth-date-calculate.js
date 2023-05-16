import { useState } from "react";

const useBirthDateCalculor = () => {
  const [calculatedAge, setCalculatedAge] = useState();
  function handleAge(dob) {
    var birthDate = new Date(dob);
    var difference = Date.now() - birthDate.getTime();
    var ageDate = new Date(difference);
    var calculatedAge = Math.abs(ageDate.getUTCFullYear() - 1970);

    setCalculatedAge(calculatedAge);
  }
  return [calculatedAge, handleAge];
};

export default useBirthDateCalculor;
