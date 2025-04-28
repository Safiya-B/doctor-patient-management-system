import React from "react";

import { Link } from "react-router-dom";
import "./css/NotFound.css";

const NotFound = () => {
  return (
    <div className="main">
      <h1>404</h1>
      <h2>Sorry, we couldn't find that page</h2>
      <div className="button">
        <Link to="/">Return home</Link>
      </div>
    </div>
  );
};

export default NotFound;
