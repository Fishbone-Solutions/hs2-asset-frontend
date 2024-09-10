import React from "react";

const DocsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="45"
    height="45"
    viewBox="0 0 512 512"
    style={{ enableBackground: "new 0 0 512 512" }}
    xmlSpace="preserve"
  >
    <defs>
      <linearGradient
        id="a"
        x1="260.916"
        x2="123.347"
        y1="296"
        y2="296"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#fff" />
        <stop offset="1" stopColor="#e6e7e8" />
      </linearGradient>
    </defs>
    <g>
      <path fill="#231f20" d="M297.941 48H96v416h320V166.059z" opacity="1" />
      <path fill="#ffffff" d="M392 440H120V72h168l104 104z" opacity="1" />
      <path fill="#6d6e71" d="M288 176V72l104 104z" opacity="1" />
      <path fill="#e6e7e8" d="m288 176 104 104V176z" opacity="1" />
      <path fill="#231f20" d="M48 176h72v240H48z" opacity="1" />
      <path fill="url(#a)" d="M120 176h144v240H120z" opacity="1" />
      <path fill="#3164bc" d="M72 200h192v192H72z" opacity="1" />
      <path
        fill="#ffffff"
        d="m216 240-18.286 64L184 240h-32l-13.714 64L120 240H96l32 112h24l16-72 16 72h24l32-112z"
        opacity="1"
      />
      <g fill="#e6e7e8">
        <path d="M264 248h56v16h-56zM264 288h56v16h-56zM264 328h56v16h-56zM264 368h56v16h-56zM264 208h56v16h-56z" />
      </g>
    </g>
  </svg>
);

export default DocsIcon;
