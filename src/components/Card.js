import React from "react";
import PropTypes from "prop-types";



function Card({ imageSource, title, text, url }) {
  return (
    <div className="card text-center bg-light">
      <div className="overflow">
        <img src={imageSource} alt="a wallpaper" className="card-img-top" width="150" height="300" />
      </div>
      <div className="card-body text-light">
        <h4 className="card-title">{title}</h4>
        <p className="card-text text-secondary">
          {text
            ? text
            : "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Magnam deserunt fuga accusantium."}
        </p>
        <a href={url ? url : "#!"} class="btn btn-primary">ENTRAR</a>
      </div>
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  text: PropTypes.string,
  url: PropTypes.string,
  imageSource: PropTypes.string
};

export default Card;
  