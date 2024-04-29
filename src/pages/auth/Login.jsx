import loginImage from "../../assets/login-background.png";
import { Navigate, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import GoogleButton from "react-google-button";
import { login } from "../../util/auth";
import { useDispatch } from "react-redux";
import { userAction } from "../../store/user";
import NotificationDialog from "../../components/NotificationDialog";
import { useRef, useState } from "react";
import PasswordInput from "../../components/PasswordInput";
import { Form } from "react-bootstrap";
import Card from "../../components/Card";
import MainInput from "../../components/MainInput";

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const notiDialogRef = useRef();
  const [validated, setValidated] = useState(false);

  const { mutate } = useMutation({
    mutationKey: ["login"],
    mutationFn: login,
    onSuccess: (data) => {
      const user = data?.user?.user;
      dispatch(userAction.setUser(user));
      notiDialogRef.current.toastSuccess({ message: data.message });
      setTimeout(() => {
        setValidated(false);
        navigate("/systems/home");
      }, 500);
    },
    onError: (data) => {
      notiDialogRef.current.toastError({ message: data.message });
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
    const newWindow = window.open(
      "http://localhost:8080/api/v1/auth/google",
      "_blank",
      "width=500, height=600"
    );

    if (newWindow) {
      const timer = setInterval(() => {
        if (newWindow.closed) {
          mutate();
          if (timer) clearInterval(timer);
        }
      });
    }
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
          style={{ backgroundColor: "#F9F9F9" }}
        >
          <div className="col h-100">
            <div
              className="h-100 position-relative"
              style={{ backgroundColor: "#F9F9F9" }}
            >
              <div
                className="position-absolute top-50 mt-50 start-50 translate-middle"
                style={{ width: "60%" }}
              >
                <Card>
                  <div className="col fw-bold fs-4 mb-4 text-center text-dark">
                    <label>Đăng nhập</label>
                  </div>
                  <div>
                    <GoogleButton
                      className="w-100  mb-4"
                      onClick={loginWithGoogleHandler}
                    />
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
                      <button
                        className="w-100 mb-4 mt-3 btn rounded-3 btn-primary shadow"
                        type="submit"
                      >
                        Đăng nhập
                      </button>
                    </Form>
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

export default LoginPage;
