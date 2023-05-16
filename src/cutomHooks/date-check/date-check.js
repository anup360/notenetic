import React, { useState } from "react";

const useDateCheck = () => {
  const [dateChecker, setDateChecker] = useState();
  function setDateCheck(date) {
    const currentDate = new Date();
    const getTime = currentDate.getTime();
    const selectedDate = date == "" ? 0 : date.getTime();
    const value = selectedDate >= getTime;
    setDateChecker(value);
  }

  return [dateChecker, setDateCheck];
};

export default useDateCheck;
