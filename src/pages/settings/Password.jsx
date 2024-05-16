import { useEffect, useRef, useState } from "react";
import Card from "../../components/Card";
import { Form } from "react-bootstrap";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../../services/auth";
import PasswordInput from "../../components/PasswordInput";
import NotificationDialog from "../../components/NotificationDialog";
import useAuth from "../../hooks/useAuth";

function PasswordView() {
  const [dataState, setDataState] = useState({
    currentpassword: "",
    newpassword: "",
    retypepassword: "",
    isEditable: false,
    isSubmitable: false,
  });
  const { auth } = useAuth();
  const [validated, setValidated] = useState(false);
  const notiDialogRef = useRef();

  const changePasswordMutate = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      notiDialogRef.current.toastSuccess({
        message: "Thay đổi mật khẩu thành công",
      });
      setDataState(() => {
        return {
          currentpassword: "",
          newpassword: "",
          retypepassword: "",
          isEditable: false,
          isSubmitable: false,
        };
      });
      setValidated(false);
    },
    onError: (data) => {
      notiDialogRef.current.toastError({
        message: data.message,
      });
    },
  });

  useEffect(() => {
    if (
      dataState.currentpassword !== "" &&
      dataState.newpassword !== "" &&
      dataState.retypepassword !== "" &&
      dataState.retypepassword === dataState.newpassword
    ) {
      setDataState((prevState) => {
        return { ...prevState, isSubmitable: true };
      });
    } else {
      setDataState((prevState) => {
        return { ...prevState, isSubmitable: false };
      });
    }
  }, [
    dataState.currentpassword,
    dataState.newpassword,
    dataState.retypepassword,
  ]);

  function editHandler() {
    setDataState((prevState) => {
      return {
        ...prevState,
        isEditable: true,
      };
    });
  }

  function onChangeHandler({ event, name }) {
    setDataState((prevState) => {
      return {
        ...prevState,
        [name]: event.target.value.trim(),
      };
    });
  }

  async function submitHanlder(event) {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    const currentPassword = data.currentpassword;
    const newPassword = data.newpassword;
    const confirmPassword = data.retypepassword;
    const id = auth.id;
    changePasswordMutate.mutate({
      id,
      confirmPassword,
      newPassword,
      currentPassword,
    });
  }

  function cancelHandler() {
    setDataState(() => {
      return {
        currentpassword: "",
        newpassword: "",
        retypepassword: "",
        isEditable: false,
        isSubmitable: false,
      };
    });
  }

  return (
    <div className="col h-100">
      <NotificationDialog ref={notiDialogRef} keyQuery={[]} />
      <div
        className="h-100 position-relative"
        style={{ background: "#F5F6FA" }}
      >
        <div className="position-absolute top-50 mt-50 start-50 translate-middle">
          <Card>
            <div className="col fw-bold fs-4 text-center text-dark">
              <label>Thay đổi mật khẩu</label>
            </div>
            <div>
              <Form
                onSubmit={submitHanlder}
                noValidate
                validated={validated}
                className="h-100"
              >
                <PasswordInput
                  name={"currentpassword"}
                  label={"Mật khẩu hiện tại"}
                  disabled={!dataState.isEditable}
                  value={dataState.currentpassword}
                  onChange={(event) =>
                    onChangeHandler({ event, name: "currentpassword" })
                  }
                />
                <PasswordInput
                  name={"newpassword"}
                  label={"Mật khẩu mới"}
                  disabled={!dataState.isEditable}
                  value={dataState.newpassword}
                  onChange={(event) =>
                    onChangeHandler({ event, name: "newpassword" })
                  }
                />
                <PasswordInput
                  name={"retypepassword"}
                  label={"Nhập lại mật khẩu mới"}
                  disabled={!dataState.isEditable}
                  value={dataState.retypepassword}
                  onChange={(event) =>
                    onChangeHandler({ event, name: "retypepassword" })
                  }
                />
                <div className="d-flex gap-3 mt-3 justify-content-center">
                  {!dataState.isEditable ? (
                    <button
                      type="button"
                      className="btn btn-primary fw-bold"
                      onClick={editHandler}
                    >
                      Chỉnh sửa
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="btn btn-secondary fw-bold"
                        onClick={cancelHandler}
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary fw-bold"
                        disabled={!dataState.isSubmitable}
                      >
                        Lưu
                      </button>
                    </>
                  )}
                </div>
              </Form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default PasswordView;
