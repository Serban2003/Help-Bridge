"use client";

import React from "react";
import Button from "react-bootstrap/Button";

import "./Banner.css";
import "./../globals.css";

interface BannerProps {
  imageUrl: string;
  title: string;
  buttonText?: string;
  onClick?: () => void;
}

const Banner = ({ imageUrl, title, buttonText, onClick }: BannerProps) => {
  return (
    <div
      className="banner-container"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="banner-overlay">
        <div className="banner-text text-center text-white">
          <h2>{title}</h2>
          {buttonText && (
            <Button variant="light" className="outline-button-custom mt-3 px-4 py-2" onClick={onClick}>
              {buttonText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Banner;
