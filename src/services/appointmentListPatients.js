import { createAppointmentList } from "./appointmentList";
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

export async function createAppointmentPatientList({
  scheduledate,
  patientInfo,
  appointmentData,
}) {
  const appointmentListData = await createAppointmentList({
    scheduledate,
  });

  const appointmentListId = appointmentListData.id;
  let response;
  if (appointmentData) {
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
  } else {
    const patientData = await addPatient(patientInfo);
    const patientId = patientData.id;

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
  }

  if (!response.ok) {
    const error = new Error(
      "An error occurred while create appointment patient list"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = resData.data;
  return data;
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
    const error = new Error(
      "An error occurred while deleting appointment list patient"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return response.json();
}
