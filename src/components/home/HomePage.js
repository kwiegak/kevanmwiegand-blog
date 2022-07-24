import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => (
  <div className="jumbotron">
    <h1>Kevan Mathias Wiegand</h1>
    <p>Software Engineer, Author, and Musician.</p>
    <Link to="photos" className="btn btn-primary btn-lg">
      See Photos
    </Link>
  </div>
); 

export default HomePage;
