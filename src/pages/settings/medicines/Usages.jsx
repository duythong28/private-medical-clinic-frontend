import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";

import {
  createNewUsage,
  deleteUsage,
  fetchAllUsage,
} from "../../../services/usage";
import { queryClient } from "../../../App";

import TableHeader from "../../../components/TableHeader";
import TableBody from "../../../components/TableBody";
import Card from "../../../components/Card";
import MainDialog from "../../../components/MainDialog";

function UsagesTab() {
  const dialogRef = useRef();
  const [dialogState, setDialogState] = useState({
    data: null,
    isEditable: true,
  });
  const [listState, setListState] = useState([]);

  const usageQuery = useQuery({
    queryKey: ["usages"],
    queryFn: fetchAllUsage,
  });
  const usages = usageQuery.data;

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
    setListState(() => usages);
  }, [usages]);

  function searchHandler(event) {
    const textSearch = event.target.value.toLowerCase().trim();
    const result = usages.filter((usage) =>
      usage.usageDes.toLowerCase().includes(textSearch)
    );
    setListState(() => result);
  }

  function editUnitHandler({ usage, action }) {
    dialogRef.current.edit({ action, data: usage });
  }

  async function deleteUnitHandnler(id) {
    await deleteUsage({ id });
    queryClient.invalidateQueries({ queryKey: ["usages"] });
  }

  return (
    <div className="h-100 w-100">
      <Card>
        <div className="w-100 h-100 d-flex flex-column gap-3">
          <div className=" w-100  d-flex flex-row justify-content-around">
            <div className="col fw-bold fs-4">
              <label>Cách dùng</label>
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
                  placeholder="Dùng thuốc"
                  aria-describedby="addon-wrapping"
                  onInput={searchHandler}
                />
              </div>
              <div style={{ width: "fit-content" }}>
                <MainDialog
                  ref={dialogRef}
                  addFn={createNewUsage}
                  keyQuery={["usages"]}
                  onEdit={setData}
                >
                  <div className="mb-3">
                    <label htmlFor="drugname" className="col-form-label">
                      Cách dùng
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="usagedes"
                      name="usagedes"
                      defaultValue={dialogState.data?.usageDes ?? ""}
                      disabled={!dialogState.isEditable}
                    />
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
              <div className="text-start" style={{ width: "84%" }}>
                Mô tả
              </div>
              <div className="text-start" style={{ width: "10%" }}>
                Thao tác
              </div>
              <div className="text-start" style={{ width: "1%" }}></div>
            </TableHeader>
            <TableBody>
              {listState &&
                listState.map((usage) => {
                  return (
                    <li
                      className=" dropdown-center list-group-item list-group-item-primary list-group-item-action w-100 d-flex flex-row"
                      key={usage.id}
                    >
                      <div
                        className="text-start"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{ width: "5%" }}
                      >
                        {listState.indexOf(usage) + 1}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "85%" }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        {usage.usageDes}
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
                            editUnitHandler({ usage, action: "view" })
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
                            editUnitHandler({ usage, action: "edit" })
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
                          onClick={() => deleteUnitHandnler(usage.id)}
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

export default UsagesTab;
