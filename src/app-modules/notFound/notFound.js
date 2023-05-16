import React, { Component, useEffect, useState } from "react";
import imgerror from "../../assets/images/404error.png";

function notFound() {
  return (
    <div className="dt-background">
      <img src={imgerror} className="notfound-img" />
    </div>
  );
}
export default notFound;
