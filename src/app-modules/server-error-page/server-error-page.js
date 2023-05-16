import React, { Component, useEffect, useState } from "react";
import servererror from "../../assets/images/wrong.svg";

function ServerError() {
  return (
    <div className="dt-background error-page">
      <img src={servererror} className="notfound-img" />
      <p>Sorry for your inconvenience.</p>
    </div>
  );
}
export default ServerError;
