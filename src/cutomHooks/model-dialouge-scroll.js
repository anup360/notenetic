import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const useModelScroll = () => {
  const [scrollValue, setScrollValue] = useState();

  useEffect(() => {
    window.onpopstate = () => {
      setScrollValue(document.body.style.overflow = 'unset')
    }
  })

  function handleAge(value) {
    if (value == true) {
      setScrollValue(document.body.style.overflow = 'hidden')
    } else {
      setScrollValue(document.body.style.overflow = 'unset')
    }
    setScrollValue(scrollValue);
  }
  return [setScrollValue, handleAge];
};

export default useModelScroll;
