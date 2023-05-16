/**
 * App.js Layout Start Here
 */
import React, { Component, useEffect, useState } from 'react';
import { Loader } from "@progress/kendo-react-indicators";


function Loading({ }) {
    return (<Loader
        style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
        }}
        size="large"
        type={"converging-spinner"}
    />
    );
}
export default Loading;



