import { useEffect } from "react";

function LoginFail() {
  useEffect(() => {
    setTimeout(() => {
      window.close();
    }, 1000);
  }, []);

  return <></>;
}

export default LoginFail;
