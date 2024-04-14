import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

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

function DrugTab() {
  const dialogRef = useRef();
  const [dialogState, setDialogState] = useState({
    data: null,
    isEditable: true,
  });
  const [listState, setListState] = useState([]);

  const unitState = useSelector((state) => state.unit);

  function getUnitName({ id }) {
    const res = unitState.filter((unit) => unit.id === id)[0];
    return res?.unitName;
  }

  const drugsQuery = useQuery({
    queryKey: ["drugs"],
    queryFn: fetchAllDrugs,
  });
  const drugs = drugsQuery.data;

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
    setListState(() => drugs);
  }, [drugs]);

  function searchHandler(event) {
    const textSearch = event.target.value.toLowerCase().trim();
    const result = drugs.filter((drug) =>
      drug.drugName.toLowerCase().includes(textSearch)
    );
    setListState(() => result);
  }

  async function editDrugHandler({ id, action }) {
    await dialogRef.current.edit({ id, action });
  }

  async function deleteDrugHandler(id) {
    await deleteDrugById({ id });
    queryClient.invalidateQueries({ queryKey: ["drugs"] });
  }

  return (
    <div className="h-100 w-100">
      <Card>
        <div className="w-100 h-100 d-flex flex-column gap-3">
          <div className=" w-100  d-flex flex-row justify-content-around">
            <div className="col fw-bold fs-4">
              <label>Thuốc</label>
            </div>
            <div className="row gap-3">
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
                  onInput={searchHandler}
                />
              </div>
              <div style={{ width: "fit-content" }}>
                <MainDialog
                  ref={dialogRef}
                  addFn={createNewDrug}
                  editFn={fetchDrugById}
                  onEdit={setData}
                  keyQuery={["drugs"]}
                >
                  <div className="row gap-3">
                    <div className="col">
                      <label htmlFor="drugname" className="col-form-label">
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
                      <label htmlFor="price" className="col-form-label">
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
                  <div className="row gap-3">
                    <div className="col">
                      <label htmlFor="count" className="col-form-label">
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
                        className="col-form-label fw-bold"
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
                  </div>
                </MainDialog>
              </div>
            </div>
          </div>
          <div className=" w-100 h-100 overflow-hidden d-flex flex-column gap-3">
            <TableHeader>
              <div className="text-start" style={{ width: "5%" }}>
                STT
              </div>
              <div className="text-start" style={{ width: "24%" }}>
                Tên
              </div>
              <div className="text-start" style={{ width: "20%" }}>
                Đơn vị
              </div>
              <div className="text-start" style={{ width: "20%" }}>
                Giá bán
              </div>
              <div className="text-start" style={{ width: "20%" }}>
                Số lượng
              </div>
              <div className="text-start" style={{ width: "10%" }}>
                Thao tác
              </div>
              <div className="text-start" style={{ width: "1%" }}></div>
            </TableHeader>
            <TableBody>
              {listState &&
                listState.map((drug) => {
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
                        {listState.indexOf(drug) + 1}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "25%" }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {drug.drugName}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "20%" }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {getUnitName({ id: drug.unitId })}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "20%" }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {drug.price}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "20%" }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {drug.count}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "10%" }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <span
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
                        </span>
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
                            fill="#1B59F8"
                            className="bi bi-pencil-square"
                            viewBox="0 0 16 16"
                          >
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                          </svg>
                        </span>
                        <span
                          className="p-2"
                          onClick={() => deleteDrugHandler(drug.id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="#1B59F8"
                            className="bi bi-archive-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M12.643 15C13.979 15 15 13.845 15 12.5V5H1v7.5C1 13.845 2.021 15 3.357 15zM5.5 7h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1M.8 1a.8.8 0 0 0-.8.8V3a.8.8 0 0 0 .8.8h14.4A.8.8 0 0 0 16 3V1.8a.8.8 0 0 0-.8-.8z" />
                          </svg>
                        </span>
                      </div>
                    </li>
                  );
                })}
            </TableBody>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default DrugTab;
