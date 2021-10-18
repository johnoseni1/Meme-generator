import React from "react";
import "../styles/Styles.css";

const Meme = (meme) => {
  if (!meme) {
    return <div>Please select a meme to get started.</div>;
  }
  return (
    <img alt={"temp"} className="ui large image max-size" src={meme.meme.url} />
  );
};

export default Meme;
