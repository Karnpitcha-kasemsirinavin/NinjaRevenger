import React from "react";
import "./style.css";

const buttonStyle = {
  border: "none",
  borderRadius: "10px",
  fontSize: "12px",
  padding: "1rem 32px",
  marginBottom: "12px",
};

function Button() {
  return (
    <div>
      <button className="button">click</button>
    </div>
  );
}

export default Button;
