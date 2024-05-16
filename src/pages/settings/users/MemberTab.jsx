import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";

import TableHeader from "../../../components/TableHeader";
import TableBody from "../../../components/TableBody";
import Card from "../../../components/Card";
import MainDialog from "../../../components/MainDialog";
import NotificationDialog, {
  DialogAction,
} from "../../../components/NotificationDialog";
import {
  createUser,
  deleteUserById,
  fetchAllUsers,
  fetchUserById,
} from "../../../services/users";
import { fetchAllGroups } from "../../../services/group";
import PasswordInput from "../../../components/PasswordInput";
import { resetPasswordById } from "../../../services/auth";
import useAuth from "../../../hooks/useAuth";
import { queryClient } from "../../../App";

function MemberTab() {
  const { auth } = useAuth();
  const permission = auth?.permission || [];
  const dialogRef = useRef();
  const notiDialogRef = useRef();
  const formRef = useRef();
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const [searchState, setSearchState] = useState({
    state: "1",
    textSearch: "",
  });
  const [dialogState, setDialogState] = useState({
    data: null,
    isEditable: true,
  });

  const membersQuery = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const data = await fetchAllUsers();

      const searchData = data.filter(
        (item) =>
          item?.fullName.toLowerCase().includes(searchState.textSearch) &&
          checkSearchState({ state: searchState.state, user: item })
      );

      return searchData;
    },
  });

  function checkSearchState({ state, user }) {
    if (state === "1") {
      return user.isActive === 1 ? true : false;
    } else if (state === "2") {
      return user.isActive === 0 ? true : false;
    } else {
      return true;
    }
  }

  const members = membersQuery.data;

  const groupQuery = useQuery({
    queryKey: ["group"],
    queryFn: async () => {
      const data = await fetchAllGroups();
      const activeGroup = data.filter((item) => item.isActive === 1);
      return activeGroup;
    },
  });

  const groups = groupQuery.data;

  function setData({ data, isEditable }) {
    setDialogState((prevState) => {
      return {
        ...prevState,
        data: data,
        isEditable: isEditable,
      };
    });
  }

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["members"],
    });
  }, [searchState]);

  async function editUserHandler({ id, action }) {
    console.log("this isi id ", id);
    setIsPasswordChanged(() => false);
    await dialogRef.current.edit({ id, action });
  }

  async function changePasswordHandler({ id, action }) {
    setIsPasswordChanged(() => true);
    await dialogRef.current.edit({ id, action });
  }

  async function deActivateUserHandler({ id, isActive }) {
    if (id === 1) {
      let adminCount = 0;
      members.map((member) => {
        if (member.id === 1) {
          adminCount++;
        }
      });

      if (adminCount <= 1) {
        notiDialogRef.current.toastError({
          message: "Không thể xóa admin duy nhất",
        });
        return;
      }
    }

    notiDialogRef.current.setDialogData({
      action: DialogAction.DELETE,
      dispatchFn: () => deleteUserById({ id }),
    });
    if (isActive === 1)
      notiDialogRef.current.showDialogWarning({
        message: "Xác nhận lưu trữ thành viên?",
      });
    else
      notiDialogRef.current.showDialogWarning({
        message: "Xác nhận kích hoạt thành viên?",
      });
  }

  function onSubmitPassword({ data, addMutate }) {
    const newPassword = data.newpassword;
    const confirmPassword = data.retypepassword;
    const id = data.id;
    addMutate.mutate({
      id,
      confirmPassword,
      newPassword,
    });
  }

  const editUserInfoElement = (
    <>
      {dialogState.data?.id && (
        <div className="row">
          <label htmlFor="memberid" className="col-form-label fw-bold">
            Mã nhân viên
          </label>
          <input
            type="text"
            className="form-control"
            id="memberid"
            name="memberid"
            defaultValue={dialogState.data?.id ?? ""}
            disabled={true}
          />
        </div>
      )}
      <div className="row">
        <label htmlFor="fullname" className="col-form-label fw-bold">
          Họ và tên
        </label>
        <input
          type="text"
          className="form-control"
          id="fullname"
          name="fullname"
          defaultValue={dialogState.data?.fullName ?? ""}
          disabled={!dialogState.isEditable || false}
          required
        />
      </div>
      <div className="row gap-3">
        <div className="col">
          <label htmlFor="email" className="col-form-label fw-bold">
            Email
          </label>
          <input
            className="form-control"
            id="email"
            name="email"
            type="email"
            defaultValue={dialogState.data?.email ?? ""}
            disabled={!dialogState.isEditable || false}
            required
          ></input>
        </div>
        <div className="col">
          <label htmlFor="usergroupid" className="col-form-label fw-bold">
            Vai trò
          </label>
          <select
            className="form-select"
            id="usergroupid"
            name="usergroupid"
            defaultValue={dialogState.data?.userGroupId ?? ""}
            disabled={!dialogState.isEditable || false}
            required
          >
            {groups &&
              groups.map((group) => {
                return (
                  <option key={group.id} value={group.id}>
                    {group.groupName}
                  </option>
                );
              })}
          </select>
        </div>

        <div className="row">
          <label htmlFor="username" className="col-form-label fw-bold">
            Tên người dùng
          </label>
          <input
            className="form-control"
            id="username"
            name="username"
            defaultValue={dialogState.data?.userName ?? ""}
            disabled={!dialogState.isEditable || false}
            required
          ></input>
        </div>
        {!dialogState.data?.id && (
          <div className="row">
            <PasswordInput
              name={"password"}
              label={"Mật khẩu"}
              disabled={!dialogState.isEditable || false}
            />
          </div>
        )}
      </div>
    </>
  );

  const changePasswordElement = (
    <>
      <div className="row">
        <label htmlFor="username" className="col-form-label fw-bold text-dark">
          Tên người dùng
        </label>
        <input
          className="form-control"
          id="username"
          name="username"
          defaultValue={dialogState.data?.userName ?? ""}
          disabled={true}
          required
        ></input>
      </div>
      <PasswordInput
        name={"newpassword"}
        label={"Mật khẩu mới"}
        disabled={!dialogState.isEditable}
        value={dialogState.newpassword}
      />
      <PasswordInput
        name={"retypepassword"}
        label={"Nhập lại mật khẩu mới"}
        disabled={!dialogState.isEditable}
        value={dialogState.retypepassword}
      />
    </>
  );

  function changeFormHandler() {
    const formData = new FormData(formRef.current);
    const searchData = Object.fromEntries(formData);
    const textSearch = searchData.name.trim();
    const state = searchData.state;
    setSearchState({
      textSearch: textSearch,
      state: state,
    });
  }

  return (
    <div className="h-100 w-100">
      <NotificationDialog ref={notiDialogRef} keyQuery={["members"]} />
      <Card className="p-3">
        <div className="w-100 h-100 d-flex flex-column gap-3">
          <div className=" w-100  d-flex flex-row justify-content-around">
            <div className="col fw-bold fs-4 text-black">
              <label>Quản lý thành viên</label>
            </div>
            <div className="row gap-3">
              <form className="col" onChange={changeFormHandler} ref={formRef}>
                <div className="row gap-3" style={{ width: "fit-content" }}>
                  <div className="col input-group flex-nowrap">
                    <span
                      className="input-group-text"
                      id="addon-wrapping"
                      style={{ backgroundColor: "white" }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        className="bi bi-search"
                        viewBox="0 0 16 16"
                      >
                        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                      </svg>
                    </span>
                    <input
                      name="name"
                      type="search"
                      className="form-control"
                      placeholder="Họ và tên"
                      aria-describedby="addon-wrapping"
                    />
                  </div>
                  <div className="col input-group flex-nowrap">
                    <select
                      className="form-select"
                      name="state"
                      defaultValue={1}
                    >
                      <option value="1">Hoạt động</option>
                      <option value="2">Nghỉ việc</option>
                      <option value="3">Tất cả</option>
                    </select>
                  </div>
                </div>
              </form>
              <div style={{ width: "fit-content" }}>
                <MainDialog
                  ref={dialogRef}
                  addFn={isPasswordChanged ? resetPasswordById : createUser}
                  editFn={fetchUserById}
                  onEdit={setData}
                  keyQuery={["members"]}
                  isPasswordChanged={isPasswordChanged}
                  setIsPasswordChanged={setIsPasswordChanged}
                  onSubmit={isPasswordChanged ? onSubmitPassword : null}
                  addButton={permission?.includes("CUser") ? true : false}
                >
                  {isPasswordChanged
                    ? changePasswordElement
                    : editUserInfoElement}
                </MainDialog>
              </div>
            </div>
          </div>
          <div className=" w-100 h-100 overflow-hidden d-flex flex-column">
            <TableHeader>
              <div className="text-start" style={{ width: "5%" }}>
                STT
              </div>
              <div className="text-start" style={{ width: "14%" }}>
                Họ và tên
              </div>
              <div className="text-start" style={{ width: "20%" }}>
                Tên người dùng
              </div>
              <div className="text-start" style={{ width: "25%" }}>
                Email
              </div>
              <div className="text-start" style={{ width: "15%" }}>
                Vai trò
              </div>
              <div className="text-start" style={{ width: "10%" }}>
                Trạng thái
              </div>
              <div className="text-end" style={{ width: "10%" }}>
                Thao tác
              </div>
              <div className="text-end" style={{ width: "1%" }}></div>
            </TableHeader>
            <TableBody>
              {members && members.length > 0 ? (
                members.map((user, index) => {
                  return (
                    <li
                      className=" dropdown-center list-group-item list-group-item-primary list-group-item-action w-100 d-flex flex-row"
                      key={user.id}
                    >
                      <div
                        className="text-start"
                        aria-expanded="false"
                        style={{ width: "5%" }}
                      >
                        {index + 1}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "15%" }}
                        aria-expanded="false"
                      >
                        {user.fullName}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "20%" }}
                        aria-expanded="false"
                      >
                        {user.userName}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "25%" }}
                        aria-expanded="false"
                      >
                        {user.email}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "15%" }}
                        aria-expanded="false"
                      >
                        {user.userGroup.groupName}
                      </div>
                      <div
                        className={"text-start"}
                        style={{ width: "10%" }}
                        aria-expanded="false"
                      >
                        <span
                          className={
                            user.isActive === 1
                              ? "badge bg-success"
                              : "badge bg-danger"
                          }
                        >
                          {user.isActive === 1 ? "Hoạt động" : "Nghỉ việc"}
                        </span>
                      </div>
                      <div
                        className="text-end"
                        style={{ width: "10%" }}
                        aria-expanded="false"
                      >
                        {permission?.includes("UUser") &&
                          user.isActive === 1 && (
                            <span
                              className="p-2"
                              onClick={() =>
                                editUserHandler({ id: user.id, action: "edit" })
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="#646565"
                                className="bi bi-pencil-square"
                                viewBox="0 0 16 16"
                              >
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                <path d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                              </svg>
                            </span>
                          )}
                        {permission?.includes("UUser") &&
                          user.isActive === 1 && (
                            <span
                              className="p-2"
                              onClick={() =>
                                changePasswordHandler({
                                  id: user.id,
                                  action: "edit",
                                })
                              }
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="#646565"
                                className="bi bi-lock-fill"
                                viewBox="0 0 16 16"
                              >
                                <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2" />
                              </svg>
                            </span>
                          )}
                        {permission?.includes("DUser") && (
                          <span
                            className="p-2"
                            onClick={() =>
                              deActivateUserHandler({
                                id: user.id,
                                isActive: user.isActive,
                              })
                            }
                          >
                            {user.isActive === 1 ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="#EF3826"
                                className="bi bi-trash"
                                viewBox="0 0 16 16"
                              >
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="#EF3826"
                                className="bi bi-arrow-counterclockwise"
                                viewBox="0 0 16 16"
                              >
                                <path d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z" />
                                <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466" />
                              </svg>
                            )}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })
              ) : (
                <div className="position-relative w-100 h-100">
                  <h5 className="position-absolute top-50 start-50 translate-middle fw-bold text-dark">
                    Không có thành viên
                  </h5>
                </div>
              )}
            </TableBody>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default MemberTab;
