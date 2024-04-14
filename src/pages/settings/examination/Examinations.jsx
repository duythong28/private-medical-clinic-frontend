import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
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

import { convertDate } from "../../../util/date";
import { queryClient } from "../../../App";
import { prescriptionAction } from "../../../store/prescription";

function ExaminationsPage() {
  const navigate = useNavigate();
  const modalRef = useRef();
  const dispatch = useDispatch();

  const appointmentListPatientsQuery = useQuery({
    queryKey: ["appointmentList"],
    queryFn: fetchAllAppointmentListPatients,
  });

  const appointmentListPatients = appointmentListPatientsQuery.data;

  function acceptHandler(data) {
    dispatch(prescriptionAction.removeAll());
    navigate(`${data.id}/prescription`);
  }

  function editAppointmentHandler({ data }) {
    modalRef.current.edit({ data });
  }

  async function deleteAppointmentHandler({ id }) {
    await deleteAppointmentListPatientById({ id });
    queryClient.invalidateQueries({ queryKey: ["appointmentList"] });
  }

  return (
    <div className="h-100 w-100">
      <Card>
        <div className="w-100 h-100 d-flex flex-column gap-3">
          <ExaminationModal ref={modalRef} />
          <div className=" w-100 h-100 overflow-hidden d-flex flex-column gap-3">
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
                      ></div>
                      <div
                        className="text-start"
                        style={{ width: "10%" }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      ></div>

                      <ul className="dropdown-menu">
                        <li className="dropdown-item">
                          <span
                            onClick={() =>
                              acceptHandler(appointmentListPatient)
                            }
                          >
                            Tiếp nhận
                          </span>
                        </li>
                        <li className="dropdown-item">
                          <span>Thanh toán</span>
                        </li>
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
                      </ul>
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

export default ExaminationsPage;
