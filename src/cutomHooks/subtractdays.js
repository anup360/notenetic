import { useState } from "react"


const useSubTractdays = () => {
  const [day, setDay] = useState()

  function subtractDays(numOfDays, date = new Date()) {
    const dateCopy = new Date(date.getTime())
    dateCopy.setDate(dateCopy.getDate() - numOfDays);
    setDay(dateCopy)
  }
  return [day, subtractDays];
}

export default useSubTractdays