import React, { useEffect, useState } from "react";
import Header from "../header/header";
import MenuHeader from "../menu-header/menu-header";
import Drawer from "../drawer/drawer";
import Footer from "../footer-bottom/footer";
import ChangePassword from "../header/changePassword";


const Layout = ({ children }) => {

  let getTempPwdStatus = parseInt(localStorage.getItem("isTemp"));

  if(getTempPwdStatus === 1){
    return <ChangePassword onClose={()=>null} isTemp={getTempPwdStatus} />
  }

  console.log(window.location.pathname,"pathname")

  return (
    <div className="main_wrapper">
      <Header />
      {}<MenuHeader />
      <div className={window.location.pathname=="/landing" ? "landing_main_inner" :"inner-content-bottom"}>
        <div className="container-fluid">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
