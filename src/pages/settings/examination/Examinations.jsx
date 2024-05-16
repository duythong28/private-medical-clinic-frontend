import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import Card from "../../../components/Card";
import TableHeader from "../../../components/TableHeader";
import TableBody from "../../../components/TableBody";
import ExaminationModal from "./ExaminationModal";

import {
  deleteAppointmentListPatientById,
  fetchAllAppointmentListPatients,
} from "../../../services/appointmentListPatients";
import { convertDate, inputToDayFormat } from "../../../util/date";
import { queryClient } from "../../../App";
import { prescriptionAction } from "../../../store/prescription";
import { fetchPatientById } from "../../../services/patients";
import { fetchAllAppointmentListById } from "../../../services/appointmentList";
import { compareDates } from "../../../util/date";
import RescordHistoryModal from "./RecordHistoryModal";
import InvoiceDetail from "../../Invoice/InvoiceDetail";
import NotificationDialog, {
  DialogAction,
} from "../../../components/NotificationDialog";
import useAuth from "../../../hooks/useAuth";

function ExaminationsPage() {
  const navigate = useNavigate();
  const modalRef = useRef();
  const payModalRef = useRef();
  const invoiceRef = useRef();
  const notiDialogRef = useRef();
  const dispatch = useDispatch();
  const { auth } = useAuth();
  const permission = auth?.permission || [];
  const [examState, setExamState] = useState({
    name: "",
    date: inputToDayFormat(),
    state: 1,
  });

  const appointmentListPatientQuery = useQuery({
    queryKey: ["appointmentList"],
    queryFn: async () => {
      const data = await fetchAllAppointmentListPatients();
      const finalData = await Promise.all(
        data.map(async (item) => {
          const patient = await fetchPatientById({ id: item.patientId });
          const appointmentList = await fetchAllAppointmentListById({
            id: item.appointmentListId,
          });

          return {
            ...item,
            patient,
            appointmentList,
          };
        })
      );
      const searchData = finalData.filter(
        (item) =>
          item?.patient.fullName.toLowerCase().includes(examState.name) &&
          compareDates(item?.appointmentList.scheduleDate, examState.date) &&
          checkExamState(examState.state, item?.billId)
      );
      return searchData;
    },
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["appointmentList"] });
  }, [examState]);

  function checkExamState(state, billId) {
    if (state == 1) {
      return !billId;
    } else if (state == 2) {
      return billId;
    } else if (state == 3) {
      return true;
    }
  }

  const appointmentListPatients = appointmentListPatientQuery.data;

  function acceptHandler(data) {
    dispatch(prescriptionAction.removeAll());
    if (permission?.includes("RDrug")) navigate(`${data.id}/prescription`);
    else if (permission?.includes("RRecord"))
      navigate(`${data.id}/examhistory`);
    else navigate(`${data.id}`);
  }

  function payHandler({ id }) {
    invoiceRef.current.show({ id });
  }

  function editAppointmentHandler({ data }) {
    modalRef.current.edit({ data });
  }

  async function deleteAppointmentHandler({ id }) {
    async function deletefunction() {
      await deleteAppointmentListPatientById({ id });
    }
    notiDialogRef.current.setDialogData({
      action: DialogAction.DELETE,
      dispatchFn: deletefunction,
    });
    notiDialogRef.current.showDialogWarning({
      message: "Xác nhận hủy ca khám?",
    });
  }

  function setSearchData({ name, date, state }) {
    setExamState(() => {
      return {
        name,
        date,
        state,
      };
    });
  }

  return (
    <>
      <RescordHistoryModal ref={payModalRef} />
      <InvoiceDetail ref={invoiceRef} />
      <NotificationDialog ref={notiDialogRef} keyQuery={["appointmentList"]} />
      <div className="h-100 w-100">
        <Card className="p-3">
          <div className="w-100 h-100 d-flex flex-column gap-3">
            <ExaminationModal ref={modalRef} setSearchData={setSearchData} />
            <div className=" w-100 h-100 overflow-hidden d-flex flex-column">
              <TableHeader>
                <div className="text-start" style={{ width: "5%" }}>
                  STT
                </div>
                <div className="text-start" style={{ width: "14%" }}>
                  Mã ca khám
                </div>
                <div className="text-start" style={{ width: "15%" }}>
                  Họ và tên
                </div>
                <div className="text-start" style={{ width: "15%" }}>
                  Năm sinh
                </div>
                <div className="text-start" style={{ width: "15%" }}>
                  Số điện thoại
                </div>
                <div className="text-start" style={{ width: "15%" }}>
                  Ngày khám
                </div>
                <div className="text-start" style={{ width: "10%" }}>
                  Trạng thái
                </div>
                <div className="text-end" style={{ width: "10%" }}>
                  Thanh toán
                </div>
                <div className="text-start" style={{ width: "1%" }}></div>
              </TableHeader>
              <TableBody>
                {appointmentListPatients &&
                appointmentListPatients.length > 0 ? (
                  appointmentListPatients.map((appointmentListPatient) => {
                    return (
                      <li
                        className=" dropdown-center list-group-item list-group-item-primary list-group-item-action w-100 d-flex flex-row"
                        key={appointmentListPatient.id}
                      >
                        <div
                          className="text-start"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          style={{ width: "5%" }}
                        >
                          {appointmentListPatients.indexOf(
                            appointmentListPatient
                          ) + 1}
                        </div>
                        <div
                          className="text-start"
                          style={{ width: "15%" }}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {appointmentListPatient.id}
                        </div>
                        <div
                          className="text-start"
                          style={{ width: "15%" }}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {appointmentListPatient.patient?.fullName}
                        </div>
                        <div
                          className="text-start"
                          style={{ width: "15%" }}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {appointmentListPatient.patient?.birthYear}
                        </div>
                        <div
                          className="text-start"
                          style={{ width: "15%" }}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {appointmentListPatient.patient?.phoneNumber}
                        </div>
                        <div
                          className="text-start"
                          style={{ width: "15%" }}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          {convertDate(
                            appointmentListPatient.appointmentList?.scheduleDate
                          )}
                        </div>
                        <div
                          className="text-start"
                          style={{ width: "10%" }}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <span
                            className={
                              appointmentListPatient.appointmentRecordId
                                ? "badge bg-success"
                                : "badge bg-danger"
                            }
                          >
                            {appointmentListPatient.appointmentRecordId
                              ? "Hoàn thành"
                              : "Chưa khám"}
                          </span>
                        </div>
                        <div
                          className="text-end"
                          style={{ width: "10%" }}
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <span
                            className={
                              appointmentListPatient.billId
                                ? "badge bg-success"
                                : "badge bg-danger"
                            }
                          >
                            {appointmentListPatient.billId
                              ? "Đã thanh toán"
                              : "Chưa thanh toán"}
                          </span>
                        </div>
                        {!appointmentListPatient.billId && (
                          <ul className="dropdown-menu">
                            {permission?.includes("CRecord") && (
                              <li className="dropdown-item">
                                {!appointmentListPatient.appointmentRecordId && (
                                  <span
                                    onClick={() =>
                                      acceptHandler(appointmentListPatient)
                                    }
                                  >
                                    Tiếp nhận
                                  </span>
                                )}
                              </li>
                            )}

                            {appointmentListPatient.appointmentRecordId &&
                              permission?.includes("CInvoice") && (
                                <li className="dropdown-item">
                                  <span
                                    onClick={() =>
                                      payHandler({
                                        id: appointmentListPatient.appointmentRecordId,
                                      })
                                    }
                                  >
                                    Thanh toán
                                  </span>
                                </li>
                              )}
                            {!appointmentListPatient.appointmentRecordId && (
                              <>
                                {permission?.includes("UAppointment") && (
                                  <li className="dropdown-item">
                                    <span
                                      onClick={() =>
                                        editAppointmentHandler({
                                          data: appointmentListPatient,
                                        })
                                      }
                                    >
                                      Cập nhật
                                    </span>
                                  </li>
                                )}
                                {permission?.includes("DAppointment") && (
                                  <li className="dropdown-item">
                                    <span
                                      onClick={() =>
                                        deleteAppointmentHandler({
                                          id: appointmentListPatient.id,
                                        })
                                      }
                                    >
                                      Hủy
                                    </span>
                                  </li>
                                )}
                              </>
                            )}
                          </ul>
                        )}
                      </li>
                    );
                  })
                ) : (
                  <div className="position-relative w-100 h-100">
                    <h5 className="position-absolute top-50 start-50 translate-middle fw-bold text-dark">
                      Không có ca khám
                    </h5>
                  </div>
                )}
              </TableBody>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

export default ExaminationsPage;
