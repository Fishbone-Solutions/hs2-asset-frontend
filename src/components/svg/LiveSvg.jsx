import * as React from "react";
 
const SvgComponent = (props) => (
<svg
    xmlns="http://www.w3.org/2000/svg"
    style={{
      enableBackground: "new 0 0 256 256",
    }}
    viewBox="0 0 58 40"
    {...props}
    width="50"
    height="35"
>
  <g fill="none" transform="translate(0 -1)">
    <path
      fill="#e64c3c"
      d="M40.769 20.925a4.006 4.006 0 0 1 1.231.968V36a4.056 4.056 0 0 1-2.53 3.71c-.952.417.683.29-35.47.29a8.026 8.026 0 0 1-4-4V21a4 4 0 0 1 4-4h31.107a29 29 0 0 1 .968 1.231 3.987 3.987 0 0 0 4.694 4.694z"
    />
    <text
      x="35%"
      y="55%"
      fill="#fff"
      style={{
        fontFamily: "Montserrat",
        fontSize: "0.7rem",
        fontWeight: 600,
        textAnchor: "middle",
        dominantBaseline: "text-before-edge",
      }}
    >
      {"LIVE"}
    </text>
    <path
      fill="#84b5cb"
      d="M29.337 9.94a13.993 13.993 0 1 1 20.028 19.454 2 2 0 1 0 2.657 2.982A17.988 17.988 0 1 0 26.281 7.364a2 2 0 1 0 3.056 2.576z"
    />
    <path
      fill="#3b97d3"
      d="M36.494 14.129a6 6 0 0 1 8.334 8.425 1.955 1.955 0 0 0-.09 2.145 2 2 0 0 0 3.322.212 9.995 9.995 0 0 0-13.886-14.036 1.989 1.989 0 0 0 .323 3.373 1.939 1.939 0 0 0 1.997-.119z"
    />
    <circle cx={40} cy={19} r={2} fill="#2980ba" />
  </g>
</svg>

);
 
export default SvgComponent;