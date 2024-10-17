const AttentionIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={props.width}
    height={props.height}
    x="0"
    y="0"
    viewBox="0 0 64 64"
    style={{ enableBackground: "new 0 0 512 512" }}
    xmlSpace="preserve"
    className={props.className}
  >
    <g>
      <path
        fill="#ffd21e"
        d="M8.008 55.78a3.002 3.002 0 0 1-2.6-4.503L29.4 9.722a3.002 3.002 0 0 1 5.2 0l23.992 41.556a3.002 3.002 0 0 1-2.6 4.503z"
        opacity="1"
      />
      <g fill="#373737">
        <path
          d="M32 9.22a1.966 1.966 0 0 1 1.733 1l23.993 41.558a2.002 2.002 0 0 1-1.733 3.002H8.007a2.002 2.002 0 0 1-1.733-3.002L30.267 10.22A1.966 1.966 0 0 1 32 9.22m0-2a3.964 3.964 0 0 0-3.465 2.001L4.542 50.777a4.001 4.001 0 0 0 3.465 6.003h47.986a4.001 4.001 0 0 0 3.465-6.002L35.465 9.22A3.964 3.964 0 0 0 32 7.22z"
          opacity="1"
        />
        <circle cx="32" cy="46.993" r="2" opacity="1" />
        <rect width="4" height="20" x="30" y="20.993" rx="2" opacity="1" />
      </g>
    </g>
  </svg>
);

export default AttentionIcon;
