import React, { useEffect } from "react";

function Redirect({ to }) {
  useEffect(() => {
    window.location.href = to;
  }, [to]);

  return (
    <div>
      <h1>Redirecting...</h1>
      <a href={to}>Go to redirect: {to}</a>
    </div>
  );
}

export default Redirect;
