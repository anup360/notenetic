import { useState } from "react";

const useNPI = () => {
  const [npi, setNPI] = useState();

  function validateNPI(npi) {
    // remove any whitespace or dashes from the input string
    npi = npi.replace(/\s+|-/g, "");

    // NPI must be exactly 10 digits long
    if (npi.length !== 10) {
      return false;
    }

    // reverse the input string for easier processing
    npi = npi.split("").reverse().join("");

    let sum = 0;
    for (let i = 1; i < npi.length; i++) {
      let digit = parseInt(npi[i], 10);
      // multiply every other digit by 2, starting with the second to last
      if (i % 2 === 1) {
        digit *= 2;
      }
      // if the doubled digit is greater than 9, sum its digits (i.e., 10 becomes 1+0=1)
      if (digit > 9) {
        digit = digit
          .toString()
          .split("")
          .reduce((a, b) => parseInt(a) + parseInt(b));
      }
      sum += digit;
    }
    // the NPI is valid if the sum of its digits is divisible by 10
    const nextMultipleOfTen = Math.ceil((sum + 24) / 10) * 10;
    const calculatedCheckDigit = nextMultipleOfTen - (sum + 24);
    setNPI(
      calculatedCheckDigit ===
        parseInt(npi.split("").reverse().join("").slice(-1))
    );
  }
  return [npi, validateNPI];
};

export default useNPI;
