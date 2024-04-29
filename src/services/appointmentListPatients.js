import { localFormat } from "../util/date";
import { createAppointmentList } from "./appointmentList";
import { fetchMaxNumberOfPatients } from "./argument";
import { addPatient } from "./patients";

export async function fetchAllAppointmentListPatients() {
  const response = await fetch(
    "http://localhost:8080/api/v1/appointmentlistpatients",
    {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
    }
  );
  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching  all appointment list patients"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = resData.data;
  return data;
}

export async function fetchAllAppointmentListByPatientId({ patientId }) {
  const response = await fetch(
    `http://localhost:8080/api/v1/appointmentlistpatients?patientId=${patientId}`,
    {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
    }
  );
  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching  all appointment list patients"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = resData.data;
  return data;
}

export async function fetchAllAppointmentListByAppointmentListId({
  appointmentListId,
}) {
  const response = await fetch(
    `http://localhost:8080/api/v1/appointmentlistpatients?appointmentListId=${appointmentListId}`,
    {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
    }
  );
  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching  all appointment list patients"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = resData.data;
  return data;
}

export async function createAppointmentPatientList({
  scheduledate,
  patientInfo,
  appointmentData,
}) {
  const appointmentListData = await createAppointmentList({
    scheduledate,
  });

  const appointmentListId = appointmentListData.id;
  //check number of patient in schedule date
  const appointmentListPatientDate =
    await fetchAllAppointmentListByAppointmentListId({ appointmentListId });
  const maxNumberPerDay = await fetchMaxNumberOfPatients();
  if (maxNumberPerDay <= appointmentListPatientDate.length) {
    const error = new Error(
      `Ngày ${localFormat(scheduledate)} đã đủ ${maxNumberPerDay} bệnh nhân`
    );
    throw error;
  }

  let response;
  if (appointmentData) {
    // update appointment list patient
    const id = appointmentData.id;
    const patientId = appointmentData.patientId;
    response = await fetch(
      `http://localhost:8080/api/v1/appointmentlistpatients/${id}`,
      {
        credentials: "include",
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer",
        },
        body: JSON.stringify({ patientId, appointmentListId }),
      }
    );
    if (!response.ok) {
      const error = new Error("Cập nhật lịch khám thất bại");
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }

    const resData = await response.json();
    const data = resData.data;
    data.message = "Cập nhật lịch khám thành công";
    return data;
  } else {
    //create new appointment list patient
    let patientId;
    if (patientInfo && !patientInfo.patientid) {
      //create new patient
      const patientData = await addPatient(patientInfo);
      patientId = patientData.id;
    } else {
      patientId = patientInfo.patientid;
      const appointmentListPatientData =
        await fetchAllAppointmentListByPatientId({ patientId });
      const unfinishExam = appointmentListPatientData.filter(
        (appointment) => !appointment.billId
      );

      //check unfinish examination of patient
      if (unfinishExam.length > 0) {
        const error = new Error("Bệnh nhân có lịch khám chưa hoàn thành");
        throw error;
      }

      //check examination at scheduledate
      const finishExamAtScheduleDate = appointmentListPatientData.filter(
        (appointment) => appointment.appointmentListId === appointmentListId
      );
      if (finishExamAtScheduleDate.length > 0) {
        const error = new Error(
          `Bệnh nhân đã khám ngày ${localFormat(scheduledate)}`
        );
        throw error;
      }
    }

    response = await fetch(
      "http://localhost:8080/api/v1/appointmentlistpatients",
      {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer",
        },
        body: JSON.stringify({ patientId, appointmentListId }),
      }
    );

    if (!response.ok) {
      const error = new Error("Đăng ký lịch khám thất bại");
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }

    const resData = await response.json();
    const data = resData.data;
    data.message = "Đăng ký lịch khám thành công";
    return data;
  }
}

export async function fetchAppointentListPatientById({ id }) {
  const response = await fetch(
    `http://localhost:8080/api/v1/appointmentlistpatients/${id}`,
    {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
    }
  );
  if (!response.ok) {
    if (!response.ok) {
      throw new Error("can not fetch appointment list patient");
    }
  }
  const resData = await response.json();
  const data = resData.data;
  return data;
}

export async function deleteAppointmentListPatientById({ id }) {
  const response = await fetch(
    `http://localhost:8080/api/v1/appointmentlistpatients/${id}`,
    {
      credentials: "include",
      method: "DELETE",
      headers: {
        authorization: "Bearer",
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = new Error("Hủy lịch khám thất bại");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = {...resData.data};
  data.message = "Hủy lịch khám thành công";

  return data;
}
