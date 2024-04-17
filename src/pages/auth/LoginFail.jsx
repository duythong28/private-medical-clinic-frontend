import { useEffect } from "react";

function LoginFail() {
  useEffect(() => {
    setTimeout(() => {
      window.close();
    }, 1000);
  },[]);

  return (
    <>
      <div>Log In Fail!</div>
    </>
  );
}

export default LoginFail;
