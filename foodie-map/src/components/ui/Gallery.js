import React, { useEffect, useState } from "react";
import classes from "./Gallery.module.css";

const libraries = ["places"];

function Gallery(props) {
  return (
    <div className={classes.gallery}>
      {props.photoURLs.map((url, index) => (
        <img className={classes.card} src={url} key={index} alt={index} />
      ))}
      <link></link>
    </div>
  );
}

export default Gallery;
