import { useEffect } from "react";

function LoginSuccess() {
  useEffect(() => {
    setTimeout(() => {
      window.close();
    }, 1000);
  }, []);

  return <></>;
}

export default LoginSuccess;
