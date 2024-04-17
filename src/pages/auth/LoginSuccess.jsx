import { useEffect } from "react";

function LoginSuccess() {
  useEffect(() => {
    setTimeout(() => {
      window.close();
    }, 1000);
  },[]);

  return (
    <>
      <div>Log In Success!</div>
    </>
  );
}

export default LoginSuccess;
