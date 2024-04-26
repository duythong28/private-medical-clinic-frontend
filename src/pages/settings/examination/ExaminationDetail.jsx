import { NavLink, Outlet, useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import Form from "react-bootstrap/Form";

import "./ExaminationDetail.scss";
import Card from "../../../components/Card";
import MainInput from "../../../components/MainInput";
import MainSelect from "../../../components/MainSelect";
import MainTextarea from "../../../components/MainTextarea";

import { inputDateFormat } from "../../../util/date";
import { prescriptionAction } from "../../../store/prescription";

import { fetchAppointentListPatientById } from "../../../services/appointmentListPatients";
import { createAppointmentRecordDetail } from "../../../services/appointmentRecordDetails";
import { createAppointmentRecord } from "../../../services/appointmentRecords";
import { fetchAllDisease } from "../../../services/diseases";

export default function ExaminationDetail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [validated, setValidated] = useState(false);
  const { appopintmentListPatientId } = useParams();
  const [dataState, setDataState] = useState({
    data: null,
    isEditable: true,
  });

  const diseasesQuery = useQuery({
    queryKey: ["diseases"],
    queryFn: fetchAllDisease,
  });

  const prescriptionState = useSelector((state) => state.prescription);
  const diseaseState = diseasesQuery.data;

  function getDiseaseName({ id }) {
    const res = diseaseState.filter((disease) => {
      return disease.id == id;
    })[0];
    return res?.diseaseName || "";
  }

  const appointmentListPatientQuery = useQuery({
    queryKey: ["appointmentlistpatient", appopintmentListPatientId],
    queryFn: () =>
      fetchAppointentListPatientById({ id: appopintmentListPatientId }),
  });
  const appointmentListPatientData = appointmentListPatientQuery.data;
  const recordDetailMutate = useMutation({
    mutationFn: createAppointmentRecordDetail,
  });

  const appointmentRecordMutate = useMutation({
    mutationFn: createAppointmentRecord,
    onSuccess: (data) => {
      prescriptionState.map((drug) => {
        const appointmentRecordId = data.id;
        const drugId = drug.id;
        const count = drug.amount;
        const usageId = drug.usageId;
        recordDetailMutate.mutate({
          appointmentRecordId,
          drugId,
          count,
          usageId,
        });
      });
      dispatch(prescriptionAction.removeAll());
      navigate("/systems/examinations");
    },
  });

  function finishExamHandler(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(true);
      return;
    }

    const formData = new FormData(form);
    const examData = Object.fromEntries(formData);
    const symptoms = examData.symptoms.trim();
    const diseaseId = examData.diagnostic;
    const patientId = appointmentListPatientData.patientId;
    const appointmentListId = appointmentListPatientData.appointmentListId;
    appointmentRecordMutate.mutate({
      symptoms,
      diseaseId,
      patientId,
      appointmentListId,
    });
    setValidated(false);
  }

  function changeFormHandler(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const examData = Object.fromEntries(formData);
    const symptoms = examData.symptoms.trim();
    setDataState((prevState) => {
      return {
        isEditable: prevState.isEditable,
        data: {
          ...prevState.data,
          symptoms,
        },
      };
    });
  }

  return (
    <Card>
      <Form
        className="w-100 h-100 d-flex flex-row  gap-3"
        onSubmit={finishExamHandler}
        noValidate
        onChange={changeFormHandler}
        validated={validated}
      >
        <div style={{ width: "40%" }}>
          <div className="row">
            <label className="col-form-label fw-bold">
              THÔNG TIN BỆNH NHÂN
            </label>
          </div>
          <div className="row gap-3">
            <MainInput
              name={"patientid"}
              isEditable={false}
              defaultValue={
                appointmentListPatientData &&
                appointmentListPatientData.patientId
              }
              label={"Mã bệnh nhân"}
            />
            <MainInput
              name={"fullname"}
              isEditable={false}
              defaultValue={
                appointmentListPatientData &&
                appointmentListPatientData.patient.fullName
              }
              label={"Tên bệnh nhân"}
            />

            <MainInput
              name={"phonenumber"}
              isEditable={false}
              defaultValue={
                appointmentListPatientData &&
                appointmentListPatientData.patient.phoneNumber
              }
              label={"Số điện thoại"}
            />
          </div>
          <div className="row gap-3">
            <MainInput
              name={"gender"}
              isEditable={false}
              defaultValue={
                appointmentListPatientData &&
                appointmentListPatientData.patient.gender
              }
              label={"Giới tính"}
            />
            <MainInput
              name={"birthyear"}
              isEditable={false}
              defaultValue={
                appointmentListPatientData &&
                appointmentListPatientData.patient.birthYear
              }
              label={"Năm sinh"}
            />
            <MainInput
              name={"address"}
              isEditable={false}
              defaultValue={
                appointmentListPatientData &&
                appointmentListPatientData.patient.address
              }
              label={"Địa chỉ"}
            />
          </div>
          <div className="row">
            <label className="col-form-label fw-bold">THÔNG TIN CA KHÁM</label>
          </div>
          <div className="row gap-3">
            <MainInput
              name={"appointmentid"}
              isEditable={false}
              defaultValue={
                appointmentListPatientData && appointmentListPatientData.id
              }
              label={"Mã ca khám"}
            />
            <MainInput
              name="scheduledate"
              defaultValue={
                appointmentListPatientData &&
                inputDateFormat(
                  appointmentListPatientData.appointmentList.scheduleDate
                )
              }
              isEditable={false}
              label={"Ngày khám"}
              type={"date"}
            />
            <div className="col"></div>
          </div>
          <div className="row">
            <MainTextarea
              name="symptoms"
              defaultValue={
                appointmentListPatientData &&
                appointmentListPatientData.symptoms
              }
              isEditable={dataState.isEditable}
              label={"Triệu chứng"}
            />
          </div>
          <div className="row">
            <MainSelect
              name={"diagnostic"}
              defaultValue={
                appointmentListPatientData &&
                appointmentListPatientData.diseaseId
              }
              isEditable={dataState.isEditable}
              label={"Chuẩn đoán"}
              options={
                diseaseState &&
                diseaseState.map((disease) => {
                  return (
                    <option key={disease.id} value={disease.id}>
                      {disease.diseaseName}
                    </option>
                  );
                })
              }
              text={
                appointmentListPatientData &&
                getDiseaseName({
                  id: appointmentListPatientData.diseaseId,
                })
              }
            />
          </div>
        </div>
        <div
          className="h-100 d-flex flex-column gap-3"
          style={{ width: "60%" }}
        >
          <div
            className="row d-flex flex-row justify-content-between border-bottom appointment-navigation"
            style={{ height: "fit-content" }}
          >
            <nav
              className="col nav gap-3 text-start"
              style={{ width: "fit-content" }}
            >
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "nav-link nav-bar-active  border-bottom border-3 border-primary"
                    : "nav-link nav-bar "
                }
                to="prescription"
              >
                Đơn thuốc
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "nav-link  nav-bar-active  border-bottom border-3 border-primary"
                    : "nav-link nav-bar "
                }
                to="examhistory"
              >
                Lịch sử
              </NavLink>
            </nav>
            <div className="col text-end">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={dataState.data?.symptoms ? false : true}
              >
                Hoàn thành
              </button>
            </div>
          </div>
          <div className="row w-100 h-100 overflow-hidden">
            <Outlet />
          </div>
        </div>
      </Form>
    </Card>
  );
}
