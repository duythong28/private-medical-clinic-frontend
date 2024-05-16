import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import {
  fetchAllDrugs,
  deleteDrugById,
  createNewDrug,
  fetchDrugById,
} from "../../../services/drugs";
import { queryClient } from "../../../App";

import TableHeader from "../../../components/TableHeader";
import TableBody from "../../../components/TableBody";
import Card from "../../../components/Card";
import MainDialog from "../../../components/MainDialog";
import { fetchAllUnit } from "../../../services/units";
import NotificationDialog, {
  DialogAction,
} from "../../../components/NotificationDialog";
import { formatNumber } from "../../../util/money";
import useAuth from "../../../hooks/useAuth";

function DrugTab() {
  const { auth } = useAuth();
  const permission = auth?.permission || [];
  const dialogRef = useRef();
  const notiDialogRef = useRef();
  const formRef = useRef();
  const [searchState, setSearchState] = useState({
    state: "1",
    textSearch: "",
  });
  const [dialogState, setDialogState] = useState({
    data: null,
    isEditable: true,
  });

  const unitsQuery = useQuery({
    queryKey: ["units"],
    queryFn: fetchAllUnit,
  });

  const drugsQuery = useQuery({
    queryKey: ["drugs"],
    queryFn: async () => {
      const data = await fetchAllDrugs();

      const searchData = data.filter(
        (item) =>
          item?.drugName.toLowerCase().includes(searchState.textSearch) &&
          checkSearchState({ state: searchState.state, drug: item })
      );

      return searchData;
    },
  });

  const drugs = drugsQuery.data;

  function checkSearchState({ state, drug }) {
    if (state === "1") {
      return drug.isActive === 1 ? true : false;
    } else if (state === "2") {
      return drug.isActive === 0 ? true : false;
    } else {
      return true;
    }
  }

  const unitState = unitsQuery.data;

  function getUnitName({ id }) {
    if (unitState) {
      const res = unitState.filter((unit) => unit.id === id)[0];
      return res?.unitName || "";
    }
    return "";
  }

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
      queryKey: ["drugs"],
    });
  }, [searchState]);

  async function editDrugHandler({ id, action }) {
    await dialogRef.current.edit({ id, action });
  }

  async function deActivateDrugHandler({ id, isActive }) {
    notiDialogRef.current.setDialogData({
      action: DialogAction.DELETE,
      dispatchFn: () => deleteDrugById({ id }),
    });
    if (isActive === 1) {
      notiDialogRef.current.showDialogWarning({
        message: "Xác nhận lưu trữ thuốc?",
      });
    } else {
      notiDialogRef.current.showDialogWarning({
        message: "Xác nhận kích hoạt thuốc?",
      });
    }
  }

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
      <NotificationDialog ref={notiDialogRef} keyQuery={["drugs"]} />
      <Card className="p-3">
        <div className="w-100 h-100 d-flex flex-column gap-3">
          <div className=" w-100  d-flex flex-row justify-content-around">
            <div className="col fw-bold fs-4 text-black">
              <label>Thuốc</label>
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
                      placeholder="Tên thuốc"
                      aria-describedby="addon-wrapping"
                    />
                  </div>
                  <div className="col input-group flex-nowrap">
                    <select
                      className="form-select"
                      name="state"
                      defaultValue={1}
                    >
                      <option value="1">Còn bán</option>
                      <option value="2">Ngưng bán</option>
                      <option value="3">Tất cả</option>
                    </select>
                  </div>
                </div>
              </form>
              <div style={{ width: "fit-content" }}>
                <MainDialog
                  ref={dialogRef}
                  addFn={createNewDrug}
                  editFn={fetchDrugById}
                  onEdit={setData}
                  keyQuery={["drugs"]}
                  addButton={permission?.includes("CDrug") ? true : false}
                >
                  <div className="row gap-3">
                    <div className="col">
                      <label
                        htmlFor="drugname"
                        className="col-form-label  text-dark"
                      >
                        Tên thuốc
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="drugname"
                        name="drugname"
                        defaultValue={dialogState.data?.drugName ?? ""}
                        disabled={!dialogState.isEditable}
                        required
                      />
                    </div>
                    <div className="col">
                      <label
                        htmlFor="note"
                        className="col-form-label  text-dark"
                      >
                        Hoạt chất
                      </label>
                      <input
                        className="form-control"
                        id="note"
                        name="note"
                        defaultValue={dialogState.data?.note ?? ""}
                        disabled={!dialogState.isEditable}
                        required
                      ></input>
                    </div>
                  </div>
                  <div className="row gap-3">
                    <div className="col">
                      <label
                        htmlFor="count"
                        className="col-form-label  text-dark"
                      >
                        Số lượng
                      </label>
                      <input
                        className="form-control"
                        id="count"
                        name="count"
                        defaultValue={dialogState.data?.count ?? ""}
                        disabled={!dialogState.isEditable}
                        required
                      ></input>
                    </div>
                    <div className="col">
                      <label
                        htmlFor="diagnostic"
                        className="col-form-label fw-bold  text-dark"
                      >
                        Đơn vị
                      </label>
                      <select
                        className="form-select"
                        name="unitid"
                        id="unitid"
                        required
                        disabled={!dialogState.isEditable}
                        defaultValue={dialogState.data?.unitId ?? ""}
                      >
                        {unitState &&
                          unitState.map((unit) => {
                            return (
                              <option key={unit.id} value={unit.id}>
                                {unit.unitName}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                    <div className="col">
                      <label
                        htmlFor="price"
                        className="col-form-label  text-dark"
                      >
                        Giá bán
                      </label>
                      <input
                        className="form-control"
                        id="price"
                        name="price"
                        defaultValue={dialogState.data?.price ?? ""}
                        disabled={!dialogState.isEditable}
                        required
                      ></input>
                    </div>
                  </div>
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
                Tên
              </div>
              <div className="text-start" style={{ width: "15%" }}>
                Hoạt chất
              </div>
              <div className="text-start" style={{ width: "15%" }}>
                Số lượng
              </div>
              <div className="text-start" style={{ width: "15%" }}>
                Đơn vị
              </div>
              <div className="text-start" style={{ width: "15%" }}>
                Giá bán
              </div>
              <div className="text-start" style={{ width: "10%" }}>
                Trạng thái
              </div>
              <div className="text-end" style={{ width: "10%" }}>
                Thao tác
              </div>
              <div className="text-start" style={{ width: "1%" }}></div>
            </TableHeader>
            <TableBody>
              {drugs && drugs.length > 0 ? (
                drugs.map((drug, index) => {
                  return (
                    <li
                      className=" dropdown-center list-group-item list-group-item-primary list-group-item-action w-100 d-flex flex-row"
                      key={drug.id}
                    >
                      <div
                        className="text-start"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{ width: "5%" }}
                      >
                        {index + 1}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "15%" }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {drug.drugName}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "15%" }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {drug.note}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "15%" }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {drug.count}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "15%" }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {getUnitName({ id: drug.unitId })}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "15%" }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {formatNumber(drug.price)}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "10%" }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <span
                          className={
                            drug.isActive === 1
                              ? "badge bg-success"
                              : "badge bg-danger"
                          }
                        >
                          {drug.isActive === 1 ? "Còn bán" : "Ngưng bán"}
                        </span>
                      </div>
                      <div
                        className="text-end"
                        style={{ width: "10%" }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {/* <span
                          className="p-2"
                          onClick={() =>
                            editDrugHandler({ id: drug.id, action: "view" })
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="#1B59F8"
                            className="bi bi-eye-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0" />
                            <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7" />
                          </svg>
                        </span> */}
                        {permission?.includes("UDrug") &&
                          drug.isActive === 1 && (
                            <span
                              className="p-2"
                              onClick={() =>
                                editDrugHandler({ id: drug.id, action: "edit" })
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
                        {permission?.includes("DDrug") && (
                          <span
                            className="p-2"
                            onClick={() =>
                              deActivateDrugHandler({
                                id: drug.id,
                                isActive: drug.isActive,
                              })
                            }
                          >
                            {drug.isActive === 1 ? (
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
                    Không có thuốc
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

export default DrugTab;
