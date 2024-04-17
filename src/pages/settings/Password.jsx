import { useEffect, useState } from "react";
import Card from "../../components/Card";
import { Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../../util/auth";
import PasswordInput from "../../components/PasswordInput";

function PasswordView() {
  const [dataState, setDataState] = useState({
    currentpassword: "",
    newpassword: "",
    retypepassword: "",
    isEditable: false,
    isSubmitable: false,
  });

  const [validated, setValidated] = useState(false);
  const user = useSelector((state) => state.user);

  const changePasswordMutate = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
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
  });

  useEffect(() => {
    if (
      dataState.currentpassword !== "" &&
      dataState.newpassword !== "" &&
      dataState.currentpassword !== "" &&
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

    // const currentpassword = data.currentpassword;
    // const username = user.username;
    // const userData = {
    //   username: username,
    //   password: currentpassword,
    // };

    // const authData = await login(userData);
    // if (!authData.user) {
    //   return;
    // }

    // const newpassword = data.newpassword;
    // changePasswordMutate.mutate({ id: user.id, password: newpassword });
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
      <div
        className="h-100 position-relative"
        style={{ backgroundColor: "#F9F9F9" }}
      >
        <div className="position-absolute top-50 mt-50 start-50 translate-middle">
          <Card>
            <div className="col fw-bold fs-4 text-center">
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
