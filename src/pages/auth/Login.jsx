import loginImage from "../../assets/login-background.png";
import { Navigate, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import GoogleButton from "react-google-button";
import { login } from "../../util/auth";
import NotificationDialog from "../../components/NotificationDialog";
import { useRef, useState } from "react";
import PasswordInput from "../../components/PasswordInput";
import { Form } from "react-bootstrap";
import Card from "../../components/Card";
import "./Login.scss";

function LoginPage() {
  const navigate = useNavigate();
  const notiDialogRef = useRef();
  const [validated, setValidated] = useState(false);
  localStorage.removeItem("email");

  const { mutate } = useMutation({
    mutationKey: ["login"],
    mutationFn: login,
    onSuccess: (data) => {
      notiDialogRef.current.toastSuccess({ message: data.message });
      setTimeout(() => {
        navigate("/systems/home");
        setValidated(false);
      }, 500);
    },
    onError: (data) => {
      if (data.message !== "cancel-login") {
        notiDialogRef.current.toastError({ message: data.message });
      }
    },
  });

  const isAuth = localStorage.getItem("refreshToken");
  if (isAuth) {
    return <Navigate to="/systems/home" />;
  }

  async function localLoginHandler(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    const formData = new FormData(event.target);
    const username = formData.get("username").trim();
    const password = formData.get("password").trim();
    if (username && password) {
      const userData = {
        username,
        password,
      };
      mutate(userData);
    }
  }

  async function loginWithGoogleHandler() {
    const newWindow = openCenteredWindow(
      "http://localhost:8080/api/v1/auth/google",
      500,
      550
    );
    mutate();

    // if (newWindow) {
    //   const timer = setInterval(() => {
    //     if (newWindow.closed) {
    //       mutate();
    //       if (timer) clearInterval(timer);
    //     }
    //   });
    // }
  }

  function navigateToForgotPassHandler() {
    navigate("/forgotpassword");
  }

  return (
    <>
      <NotificationDialog ref={notiDialogRef} />
      <div className="d-flex flex-row h-100">
        <div className="col w-100 h-100">
          <img src={loginImage} className="w-100 h-100" />
        </div>

        <div
          className="col h-100 position-relative"
          style={{ backgroundColor: "#E9ECEF" }}
        >
          <div className="col h-100">
            <div
              className="h-100 position-relative"
              style={{ backgroundColor: "#E9ECEF" }}
            >
              <div
                className="position-absolute top-50 mt-50 start-50 translate-middle"
                style={{ width: "70%" }}
              >
                <Card>
                  <div className="p-4">
                    <div className="col fw-bold fs-4 mb-4 text-center text-dark">
                      <label>Đăng Nhập</label>
                    </div>
                    <div>
                      <div
                        className="position-relative border shadow border-1"
                        style={{
                          height: "40px",
                          overflow: "hidden",
                          background: "rgb(66 133 244)",
                          borderColor: "rgb(66 133 244)",
                        }}
                      >
                        <GoogleButton
                          className="position-absolute top-50 start-50 translate-middle w-100"
                          style={{
                            marginLeft: "-1px",
                          }}
                          label="Đăng nhập với Google"
                          onClick={loginWithGoogleHandler}
                        />
                      </div>

                      <hr />
                      <Form
                        method="post"
                        onSubmit={localLoginHandler}
                        noValidate
                        validated={validated}
                        className="h-100"
                      >
                        <div className="col">
                          <label
                            htmlFor="username"
                            className="col-form-label fw-bold  text-dark"
                          >
                            Tên đăng nhập
                          </label>
                          <div>
                            <input
                              className="form-control"
                              type="text"
                              name="username"
                              id="username"
                              placeholder="Tên đăng nhập"
                              required
                            ></input>
                          </div>
                        </div>
                        <PasswordInput name={"password"} label={"Mật khẩu"} />
                        <div className="forgot-password">
                          <a
                            className="fw-bold nav-link  mt-2 text-end"
                            onClick={navigateToForgotPassHandler}
                          >
                            Quên mật khẩu
                          </a>
                        </div>
                        <button
                          className="w-100 mb-3 mt-4 btn rounded-3 btn-primary shadow"
                          type="submit"
                        >
                          Đăng nhập
                        </button>
                      </Form>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function openCenteredWindow(url, width, height) {
  const screenWidth = screen.width;
  const screenHeight = screen.height;
  const left = (screenWidth - width) / 2;
  const top = (screenHeight - height) / 2;
  const windowFeatures = `width=${width},height=${height},top=${top},left=${left}`;
  return window.open(url, "_blank", windowFeatures);
}

export default LoginPage;
