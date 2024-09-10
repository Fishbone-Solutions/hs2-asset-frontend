import React from "react";

const MyIcon = ({ IconTxt }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="55"
    height="55"
    viewBox="0 0 267 267"
    style={{ enableBackground: "new 0 0 512 512" }}
    xmlSpace="preserve"
    fillRule="evenodd"
  >
    <g>
      {/* Existing paths */}
      <path
        fill="#d8dfe3"
        d="M50 154.167c56.944 9.876 113.889 9.544 170.833 0V75c0-.902-.292-1.779-.833-2.5l-37.5-50a4.168 4.168 0 0 0-3.333-1.667H62.5a12.501 12.501 0 0 0-12.5 12.5v95.834c0 6.188-1.451 11.433-1.451 15.614 0 5.78 1.451 9.386 1.451 9.386z"
        opacity="1"
        dataOriginal="#d8dfe3"
      />
      <path
        fill="#2d98db"
        d="M25 143.365v89.968a12.501 12.501 0 0 0 12.5 12.5h191.667a12.503 12.503 0 0 0 12.5-12.5v-66.666a12.501 12.501 0 0 0-12.5-12.5H50.02c-5.316 0-25.02-10.802-25.02-10.802z"
        opacity="1"
        dataOriginal="#2d98db"
      />
      <path
        fill="#216896"
        d="M37.5 154.167c-3.804 0-6.581-1.543-8.625-3.443-1.923-1.788-3.875-4.939-3.875-9.057 0-2.643 1.317-6.495 3.661-8.839s5.524-3.661 8.839-3.661H50v25H37.5z"
        opacity="1"
        dataOriginal="#216896"
      />
      <path
        fill="#afbdc7"
        d="M179.167 20.833V62.5a12.501 12.501 0 0 0 12.5 12.5h29.166c0-.902-.292-1.779-.833-2.5l-37.5-50a4.168 4.168 0 0 0-3.333-1.667z"
        opacity="1"
        dataOriginal="#afbdc7"
      />
      <g fill="#d8dfe3">
        <text
          x="50%"
          y="75%"
          fill="#fff"
          fontSize="80"
          fontFamily="Arial"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {IconTxt}
        </text>
      </g>
    </g>
  </svg>
);

export default MyIcon;
