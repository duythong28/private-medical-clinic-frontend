import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchAllBills, deleteBillById, createBill } from "../../services/bill";

import {} from "../../services/patients";

import Card from "../../components/Card";
import TableHeader from "../../components/TableHeader";
import TableBody from "../../components/TableBody";
import MainDialog from "../../components/MainDialog";

function PatientsPage() {
  const searchRef = useRef();
  const dialogRef = useRef();
  const navigate = useNavigate();
  const [dialogState, setDialogState] = useState({
    data: null,
    isEditable: true,
  });

  const billsQuery = useQuery({
    queryKey: ["bills"],
    queryFn: () => {
      return fetchAllBills();
    },
  });

  const bills = billsQuery.data;

  function searchHandler() {
    billsQuery.refetch();
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

  function viewHandler({ id }) {
    // navigate(`${id}`);
  }

  async function editBillHandler({ id, action }) {
    await dialogRef.current.edit({ id, action });
  }

  async function deleteBillHandler({id}) {
  await deleteBillById({ id });
  billsQuery.refetch();
  }

  return (
    <div className="h-100 w-100">
      <Card>
        <div className="w-100 h-100 d-flex flex-column gap-3">
          <div className=" w-100  d-flex flex-row justify-content-around">
            <div className="col fw-bold fs-4">
              <label>Hóa đơn</label>
            </div>
            <div className="col">
              <div className="row">
                <form
                  ref={searchRef}
                  className="row gap-3"
                  onChange={searchHandler}
                >
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
                      placeholder="Tên bệnh nhân"
                      aria-describedby="addon-wrapping"
                    />
                  </div>
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
                      type="search"
                      name="phonenumber"
                      className="form-control"
                      placeholder="Ngày khám"
                      aria-label="medicine"
                      aria-describedby="addon-wrapping"
                    />
                  </div>
                  <div style={{ width: "fit-content" }}>
                    <MainDialog
                      ref={dialogRef}
                      addFn={createBill}
                      onEdit={setData}
                      keyQuery={["bills"]}
                    >
                      {/* <div className="row gap-3">
                        {dialogState.data?.id && (
                          <div className="col">
                            <label
                              htmlFor="fullname"
                              className="col-form-label fw-bold"
                            >
                              Mã bệnh nhân
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="patientId"
                              name="patientId"
                              defaultValue={dialogState.data?.id ?? ""}
                              disabled={true}
                            />
                          </div>
                        )}

                        <div className="col">
                          <label
                            htmlFor="fullname"
                            className="col-form-label fw-bold"
                          >
                            Tên bệnh nhân
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
                        <div className="col">
                          <label
                            htmlFor="phonenumber"
                            className="col-form-label fw-bold"
                          >
                            Số điện thoại
                          </label>
                          <input
                            className="form-control"
                            id="phonenumber"
                            name="phonenumber"
                            defaultValue={dialogState.data?.phoneNumber ?? ""}
                            disabled={!dialogState.isEditable || false}
                            required
                          ></input>
                        </div>
                      </div>
                      <div className="row gap-3">
                        <div className="col">
                          <label
                            htmlFor="gender"
                            className="col-form-label fw-bold"
                          >
                            Giới tính
                          </label>
                          <select
                            className="form-select"
                            id="gender"
                            name="gender"
                            defaultValue={dialogState.data?.gender ?? ""}
                            disabled={!dialogState.isEditable || false}
                            required
                          >
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                          </select>
                        </div>
                        <div className="col">
                          <label
                            htmlFor="birthyear"
                            className="col-form-label fw-bold"
                          >
                            Năm sinh
                          </label>
                          <input
                            className="form-control"
                            id="birthyear"
                            name="birthyear"
                            defaultValue={dialogState.data?.birthYear ?? ""}
                            disabled={!dialogState.isEditable || false}
                            required
                          ></input>
                        </div>
                        <div className="col">
                          <label
                            htmlFor="address"
                            className="col-form-label fw-bold"
                          >
                            Địa chỉ
                          </label>
                          <input
                            className="form-control"
                            id="address"
                            name="address"
                            defaultValue={dialogState.data?.address ?? ""}
                            disabled={!dialogState.isEditable || false}
                            required
                          ></input>
                        </div>
                      </div> */}
                    </MainDialog>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className=" w-100 h-100 overflow-hidden d-flex flex-column gap-3">
            <TableHeader>
              <div className="text-start" style={{ width: "5%" }}>
                STT
              </div>
              <div className="text-start" style={{ width: "15%" }}>
                Mã hóa đơn
              </div>
              <div className="text-start" style={{ width: "14%" }}>
                Mã bệnh nhân
              </div>
              <div className="text-start" style={{ width: "15%" }}>
                Tên bệnh nhân
              </div>
              <div className="text-start" style={{ width: "15%" }}>
                Mã ca khám
              </div>
              <div className="text-start" style={{ width: "10%" }}>
                Ngày khám
              </div>
              <div className="text-start" style={{ width: "15%" }}>
                Tiền thanh toán
              </div>

              <div className="text-center" style={{ width: "10%" }}>
                Thao tác
              </div>
              <div className="text-end" style={{ width: "1%" }}></div>
            </TableHeader>
            <TableBody>
              {bills &&
                bills.map((bill, index) => {
                  return (
                    <li
                      className="list-group-item list-group-item-primary list-group-item-action w-100 d-flex flex-row"
                      key={index}
                    >
                      <div className="text-start" style={{ width: "5%" }}>
                        {index + 1}
                      </div>
                      <div className="text-start" style={{ width: "15%" }}>
                        {bill.id}
                      </div>
                      <div className="text-start" style={{ width: "15%" }}>
                        {bill.patientId}
                      </div>
                      <div className="text-start" style={{ width: "15%" }}>
                        {index}
                      </div>
                      <div className="text-start" style={{ width: "10%" }}>
                        {bill.appointmentListId}
                      </div>
                      <div className="text-start" style={{ width: "15%" }}>
                        {bill.appointmentListId}
                      </div>
                      <div className="text-start" style={{ width: "15%" }}>
                        {bill.drugExpense}
                      </div>
                      <div className="text-end" style={{ width: "10%" }}>
                        <span
                          className="p-2"
                          onClick={() =>
                            viewHandler({
                              id: bill.id,
                            })
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
                            editBillHandler({
                              id: bill.id,
                              action: "edit",
                            })
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
                        <span className="p-2" onClick={()=>deleteBillHandler({id: bill.id})}>
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

export default PatientsPage;
