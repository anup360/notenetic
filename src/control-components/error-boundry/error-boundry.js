import React from "react";
import { useNavigate } from "react-router-dom";
import APP_ROUTES from "../../helper/app-routes";
import { useL } from "react-router-dom";
import somthingerror from "../../assets/images/something.svg";
import { Link } from "react-router-dom";

function ErrorFallback({ error }) {
  const navigate = useNavigate();

 

  const handleClick = () => {
    navigate(APP_ROUTES.DASHBOARD)
    window.scrollTo(0, 0);
    window.location.reload(false);
  };

  return (
    <div className="dt-background error-page">
      <img src={somthingerror} className="notfound-img" alt="not found page" />
      <div class="my-2 text-center">
        <p class="py-2  m-0">Something went wrong</p>
        <p class="m-0">We're working on it. Sorry for your inconvenience</p>
      </div>
      <button
        onClick={() => handleClick()}
        className="btn blue-primary-outline d-flex align-items-center "
      >
        <i className="fa fa-arrow-left me-2"></i>Back To Dashboard
      </button>
    </div>
  );
}

export default ErrorFallback;
