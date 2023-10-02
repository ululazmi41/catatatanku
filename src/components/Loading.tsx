import React from "react";

function Loading({ isNoBlur = false }) {
  let wrapperClass = "loading-wrapper";

  if (isNoBlur) {
    wrapperClass += " tw-bg-100";
  } else {
    wrapperClass += " tw-bg-40";
  }

  return (
    <div className={wrapperClass}>
      <div className="dots-bars-6 loading"></div>
    </div>
  );
}

export default Loading;
