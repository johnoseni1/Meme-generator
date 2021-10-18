import React from "react";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

//For navigation to work, the App needs to be wrapped in BrowserRouter one level up
const Root = () => {
  return (
    <BrowserRouter>
      <App></App>
    </BrowserRouter>
  );
};

export default Root;
