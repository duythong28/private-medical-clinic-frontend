import { useState, useRef, useEffect } from "react";

import Card from "../../../components/Card";
import NotificationDialog from "../../../components/NotificationDialog";
import { useNavigate, useParams } from "react-router";
import { Form } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createGroup, fetchGroupById } from "../../../services/group";
import { fetchAllFeatures } from "../../../services/features";
import PermissionArea from "./PermissionArea";

function RoleDetail() {
  const { roleId } = useParams();
  const formRef = useRef();
  const notiDialogRef = useRef();
  const navigate = useNavigate();
  const [dataState, setDataState] = useState({
    data: null,
    isEditable: false,
    isSubmitable: false,
    isActive: false,
  });

  const allFeatures = {
    Examination: [
      "RAppointment",
      "CAppointment",
      "UAppointment",
      "DAppointment",
      "CRecord",
      "CInvoice",
    ],
    Patient: ["RPatient", "CPatient", "UPatient", "RRecord"],
    Invoice: ["RInvoice"],
    Report: ["RReport"],
    User: [
      "RUser",
      "CUser",
      "UUser",
      "DUser",
      "UUserGroup",
      "RUserGroup",
      "CUserGroup",
      "DUserGroup",
    ],
    Medicine: ["RDrug", "CDrug", "DDrug", "UDrug"],
    Principle: ["RArgument", "UArgument"],
  };

  const [permissionState, setPermissionState] = useState({});
  const roleQuery = useQuery({
    queryKey: ["groups", roleId],
    queryFn: async () => {
      const resData = await fetchGroupById({ id: roleId });
      return resData;
    },
    enabled: roleId !== undefined,
  });

  const featureQuery = useQuery({
    queryKey: ["feature"],
    queryFn: fetchAllFeatures,
  });

  useEffect(() => {
    setDataState((prevState) => {
      if (roleId !== undefined) {
        return {
          ...prevState,
          data: roleQuery.data?.groupUser.groupName,
          isActive:
            roleQuery.data?.groupUser.id !== 1 &&
            roleQuery.data?.groupUser.isActive === 1
              ? true
              : false,
          isSubmitable: true,
        };
      } else {
        return {
          ...prevState,
          data: "",
          isSubmitable: false,
          isActive: true,
          isEditable: true,
        };
      }
    });
  }, [roleQuery.data, dataState.isEditable]);

  useEffect(() => {
    if (featureQuery.data !== undefined) {
      const featureData = {
        Examination: {
          group: "Examination",
          featName: "Ca khám",
          children: [],
        },
        Patient: {
          group: "Patient",
          featName: "Bệnh nhân",
          children: [],
          isCheckedAll: false,
        },
        Invoice: {
          group: "Invoice",
          featName: "Hóa đơn",
          children: [],
          isCheckedAll: false,
        },
        Report: {
          group: "Report",
          featName: "Báo cáo",
          children: [],
          isCheckedAll: false,
        },
        User: {
          group: "User",
          featName: "Người dùng",
          children: [],
          isCheckedAll: false,
        },
        Medicine: {
          group: "Medicine",
          featName: "Thuốc",
          children: [],
          isCheckedAll: false,
        },
        Principle: {
          group: "Principle",
          featName: "Quy định",
          children: [],
          isCheckedAll: false,
        },
      };

      featureQuery.data.map((feature) => {
        const isChecked =
          roleId &&
          roleQuery.data &&
          roleQuery.data.allAllowedPermissions.includes(feature.id);
        const mapFeature = { ...feature, isChecked };
        for (const groupPermission in allFeatures) {
          if (allFeatures[groupPermission].includes(mapFeature.loadedElement)) {
            featureData[groupPermission].children.push(mapFeature);
          }
        }

        for (const groupPermission in allFeatures) {
          let checkedCount = 0;
          featureData[groupPermission].children.map((feature) => {
            if (feature.isChecked === true) {
              checkedCount++;
            }
          });
          if (allFeatures[groupPermission].length === checkedCount) {
            featureData[groupPermission].isCheckedAll = true;
          }
        }
      });
      setPermissionState(() => {
        return featureData;
      });
    }
  }, [featureQuery.data, roleQuery.data, dataState.isEditable]);

  function changeHandler({ group, data }) {
    setPermissionState((prevState) => {
      return {
        ...prevState,
        [group]: data,
      };
    });
  }

  const addRoleMutate = useMutation({
    mutationFn: createGroup,
    onSuccess: (data) => {
      notiDialogRef.current.toastSuccess({ message: data.message });
      setTimeout(() => {
        navigate("/users/roles");
      }, 500);
    },
    onError: (data) => {
      notiDialogRef.current.toastError({ message: data.message });
    },
  });

  function submitHandler() {
    const form = formRef.current;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    const groupName = data.groupname.trim();
    const allAllowedPermissions = [];
    for (const groupPermission in permissionState) {
      permissionState[groupPermission].children.map((permit) => {
        if (permit.isChecked === true) allAllowedPermissions.push(permit.id);
      });
    }

    addRoleMutate.mutate({ groupName, id: roleId, allAllowedPermissions });
  }

  function changeNameHandler(event) {
    event.preventDefault();
    const groupName = event.target.value;
    if (groupName.trim() !== "") {
      setDataState((prevState) => {
        return {
          ...prevState,
          data: groupName,
          isSubmitable: true,
        };
      });
    } else {
      setDataState((prevState) => {
        return {
          ...prevState,
          data: groupName,
          isSubmitable: false,
        };
      });
    }
  }

  function updateHandler() {
    setDataState((prevState) => {
      return {
        ...prevState,
        isEditable: true,
      };
    });
  }

  function cancelHandler() {
    if (roleId !== undefined)
      setDataState((prevState) => {
        return {
          ...prevState,
          isEditable: false,
        };
      });
    else {
      navigate("/users/roles");
    }
  }

  return (
    <div
      className="h-100 w-100 d-flex flex-row"
    >
      <NotificationDialog ref={notiDialogRef} keyQuery={["member"]} />
      <div className="h-100" style={{ width: "30%" }}>
        <Card className="p-3">
          <Form className=" h-100 d-flex flex-column gap-3" ref={formRef}>
            <div className=" w-100  d-flex flex-row justify-content-around">
              <div className="col fw-bold fs-4 text-black">
                <label>Thêm mới vai trò</label>
              </div>
            </div>
            <div className=" w-100 h-100 d-flex flex-column gap-3">
              <div className="row">
                <label
                  htmlFor="groupname"
                  className="col-form-label fw-bold text-dark"
                >
                  Tên vai trò
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="groupname"
                  name="groupname"
                  onChange={changeNameHandler}
                  value={dataState.data || ""}
                  disabled={!dataState.isEditable}
                  required
                />
              </div>
              {dataState.isActive ? (
                dataState.isEditable ? (
                  <div className="d-flex gap-3 mt-3 justify-content-center">
                    <button
                      type="button"
                      className="btn btn-outline-secondary shadow-sm"
                      style={{ minWidth: "100px" }}
                      onClick={cancelHandler}
                    >
                      hủy
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary  shadow-sm"
                      style={{ minWidth: "100px" }}
                      onClick={submitHandler}
                      disabled={!dataState.isSubmitable}
                    >
                      Lưu
                    </button>
                  </div>
                ) : (
                  <div className="d-flex gap-3 mt-3 justify-content-center">
                    <button
                      type="button"
                      className="btn btn-primary  shadow-sm"
                      style={{ minWidth: "100px" }}
                      onClick={updateHandler}
                    >
                      Chỉnh sửa
                    </button>
                  </div>
                )
              ) : (
                <></>
              )}
            </div>
          </Form>
        </Card>
      </div>
      <div className="h-100" style={{ width: "70%" }}>
        <Card style={{ padding: "1rem 1rem 1rem 0rem" }}>
          <div className="h-100 d-flex flex-column gap-3">
            <div className=" w-100  d-flex flex-row justify-content-around">
              <div className="col fw-bold fs-4 text-black">
                <label>Phân quyền chi tiết</label>
              </div>
            </div>
            <div className=" w-100 h-100 overflow-y-scroll gap-3">
              <PermissionArea
                data={permissionState.Examination}
                onChange={changeHandler}
                disabled={!dataState.isEditable}
              />
              <PermissionArea
                data={permissionState.Patient}
                onChange={changeHandler}
                disabled={!dataState.isEditable}
              />
              <PermissionArea
                data={permissionState.Invoice}
                onChange={changeHandler}
                disabled={!dataState.isEditable}
              />
              <PermissionArea
                data={permissionState.Report}
                onChange={changeHandler}
                disabled={!dataState.isEditable}
              />
              <PermissionArea
                data={permissionState.User}
                onChange={changeHandler}
                disabled={!dataState.isEditable}
              />
              <PermissionArea
                data={permissionState.Medicine}
                onChange={changeHandler}
                disabled={!dataState.isEditable}
              />
              <PermissionArea
                data={permissionState.Principle}
                onChange={changeHandler}
                disabled={!dataState.isEditable}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default RoleDetail;
