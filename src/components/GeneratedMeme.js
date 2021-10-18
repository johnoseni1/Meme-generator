import React from "react";
import { useLocation } from "react-router-dom";

export const GeneratedMeme = () => {
  const location = useLocation();
  const url = new URLSearchParams(location.search).get("url");
  return (
    <div>{url && <img className="ui large image max-size" src={url} />}</div>
  );
};
