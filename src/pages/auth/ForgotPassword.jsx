import loginImage from "../../assets/login-background.png";
import NotificationDialog from "../../components/NotificationDialog";
import { useEffect, useRef, useState } from "react";
import PasswordInput from "../../components/PasswordInput";
import { Form } from "react-bootstrap";
import Card from "../../components/Card";
import "./Login.scss";
import { useMutation } from "@tanstack/react-query";
import { checkMail, checkOTP, resetPassword, sendOTP } from "../../util/auth";
import { Navigate, redirect, useNavigate } from "react-router";

const resetStep = {
  CHECKMAIL: "check mail",
  SENDOTP: "send otp",
  CHECKOTP: "check otp",
  RESET: "reset password",
};

function ForgotPassword() {
  const notiDialogRef = useRef();
  const formRef = useRef();
  const navigate = useNavigate();
  const [validated, setValidated] = useState(false);
  const [resetState, setResetState] = useState(resetStep.CHECKMAIL);
  const [dataState, setDataState] = useState({
    newpassword: "",
    confirmpassword: "",
    isSubmitable: false,
  });

  const checkMailMutate = useMutation({
    mutationFn: checkMail,
    onSuccess: async (data) => {
      if (data === true) {
        const email = localStorage.getItem("email");
        setResetState(resetStep.CHECKOTP);
        notiDialogRef.current.toastSuccess({
          message: "Chúng tôi đã gửi mã OTP đến email " + email,
        });
        await sendOTP({ email });
      }
    },
    onError: (data) => {
      notiDialogRef.current.toastError({ message: data.message });
    },
  });

  const checkOPTMutate = useMutation({
    mutationFn: checkOTP,
    onSuccess: () => {
      setResetState(resetStep.RESET);
      notiDialogRef.current.toastSuccess({
        message: "Xác nhận thành công",
      });
    },
    onError: (data) => {
      notiDialogRef.current.toastError({ message: data.message });
    },
  });

  const resetPasswordMutate = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      notiDialogRef.current.toastSuccess({
        message: "Cài đặt mật khẩu mới thành công",
      });
      setTimeout(() => {
        navigate("/");
      }, 500);
    },
    onError: (data) => {
      notiDialogRef.current.toastError({ message: data.message });
    },
  });

  function onChangeHandler({ event, name }) {
    setDataState((prevState) => {
      return {
        ...prevState,
        [name]: event.target.value.trim(),
      };
    });
  }

  useEffect(() => {
    if (
      dataState.confirmpassword !== "" &&
      dataState.newpassword !== "" &&
      dataState.confirmpassword === dataState.newpassword
    ) {
      setDataState((prevState) => {
        return { ...prevState, isSubmitable: true };
      });
    } else {
      setDataState((prevState) => {
        return { ...prevState, isSubmitable: false };
      });
    }
  }, [dataState.newpassword, dataState.confirmpassword]);

  async function submitHandler(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }
    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData);
    if (resetState === resetStep.CHECKMAIL) {
      const email = data.email.trim();
      checkMailMutate.mutate({ email });
    } else if (resetState === resetStep.CHECKOTP) {
      const email = localStorage.getItem("email");
      const code = data.code.trim();
      checkOPTMutate.mutate({ email, code });
    } else if (resetState === resetStep.RESET) {
      const email = localStorage.getItem("email");
      const newPassword = data.newpassword.trim();
      const confirmPassword = data.confirmpassword.trim();
      resetPasswordMutate.mutate({ email, newPassword, confirmPassword });
    }
    setValidated(false);
  }

  function navigateToLoginHandler() {
    navigate("/");
  }

  return (
    <>
      <NotificationDialog ref={notiDialogRef} />
      <div className="d-flex flex-row h-100">
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
                    <div>
                      {resetState === resetStep.CHECKMAIL && (
                        <div className="col fw-bold fs-4 mb-4 text-center text-dark">
                          <label>Tìm Kiếm Email</label>
                        </div>
                      )}
                      {resetState === resetStep.CHECKOTP && (
                        <div className="col fw-bold fs-4 mb-4 text-center text-dark">
                          <label>Xác Thực Mã OTP</label>
                        </div>
                      )}
                        {resetState === resetStep.RESET && (
                        <div className="col fw-bold fs-4 mb-4 text-center text-dark">
                          <label>Thiết Lập Mật Khẩu</label>
                        </div>
                      )}
                      <hr />
                      <Form
                        method="post"
                        onSubmit={submitHandler}
                        noValidate
                        validated={validated}
                        ref={formRef}
                        className="h-100"
                      >
                        {resetState === resetStep.CHECKMAIL && (
                          <div className="form-floating mb-3">
                            <input
                              type="email"
                              className="form-control rounded-3"
                              id="email"
                              placeholder="email"
                              name="email"
                              required
                            />
                            <label htmlFor="email">Email</label>
                          </div>
                        )}
                        {resetState === resetStep.CHECKOTP && (
                          <div>
                            <label
                              htmlFor="code"
                              className="col-form-label fw-bold  text-dark"
                            >
                              Mã OTP
                            </label>
                            <div>
                              <input
                                className="form-control"
                                type="number"
                                name="code"
                                id="code"
                                required
                              ></input>
                            </div>
                          </div>
                        )}
                        {resetState === resetStep.RESET && (
                          <>
                            <PasswordInput
                              name={"newpassword"}
                              label={"Mật khẩu mới"}
                              value={dataState.newpassword}
                              onChange={(event) =>
                                onChangeHandler({ event, name: "newpassword" })
                              }
                            />
                            <PasswordInput
                              name={"confirmpassword"}
                              label={"Nhập lại mật khẩu mới"}
                              value={dataState.confirmpassword}
                              onChange={(event) =>
                                onChangeHandler({
                                  event,
                                  name: "confirmpassword",
                                })
                              }
                            />
                          </>
                        )}
                        <div className="forgot-password">
                          <a
                            className="fw-bold nav-link  mt-2 text-end"
                            onClick={navigateToLoginHandler}
                          >
                            Đăng nhập với mật khẩu
                          </a>
                        </div>
                        {resetState === resetStep.CHECKMAIL && (
                          <button
                            className="w-100 mb-3 mt-4 btn rounded-3 btn-primary shadow"
                            type="submit"
                          >
                            Tìm kiếm
                          </button>
                        )}
                        {resetState === resetStep.CHECKOTP && (
                          <button
                            className="w-100 mb-3 mt-4 btn rounded-3 btn-primary shadow"
                            type="submit"
                          >
                            Xác nhận
                          </button>
                        )}
                        {resetState === resetStep.RESET && (
                          <button
                            className="w-100 mb-3 mt-4 btn rounded-3 btn-primary shadow"
                            type="submit"
                            disabled={!dataState.isSubmitable}
                          >
                            Xác nhận
                          </button>
                        )}
                      </Form>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
        <div className="col w-100 h-100">
          <img src={loginImage} className="w-100 h-100" />
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
