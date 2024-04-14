export async function fetchAllAppointmentRecords() {
  const response = await fetch(
    "http://localhost:8080/api/v1/appointmentrecords",
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
      "An error occurred while fetching  all appointment records"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = resData.data;
  return data;
}

export async function createAppointmentRecord(appointmentData) {
  const patientId = appointmentData.patientid;
  const symtoms = appointmentData.symtoms;
  const diseaseId = appointmentData.diseaseid;
  const appoinmentId = appointmentData.appointmentid;

  const response = await fetch(
    "http://localhost:8080/api/v1/appointmentrecords",
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
      body: JSON.stringify({
        patientId,
        symtoms,
        diseaseId,
        appoinmentId,
      }),
    }
  );

  if (!response.ok) {
    const error = new Error(
      "An error occurred while creating neww apponiment record"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.jsobn();
  const data = resData.data;
  return data;
}

export async function updateAppointmentRecordById({ id, appointmentData }) {
  const patientId = appointmentData.patientid;
  const symtoms = appointmentData.symtoms;
  const diseaseId = appointmentData.diseaseid;
  const appoinmentId = appointmentData.appointmentid;

  const response = await fetch(
    `http://localhost:8080/api/v1/appointmentrecords/${id}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
      body: JSON.stringify({
        patientId,
        symtoms,
        diseaseId,
        appoinmentId,
      }),
    }
  );

  if (!response.ok) {
    const error = new Error(
      "An error occurred while updating appointment record"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = resData.data;
  return data;
}

export async function fetchAppointmentRecordById({ id }) {
  const response = await fetch(
    `http://localhost:8080/api/v1/appointmentrecords/${id}`,
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
      "An error occurred while fetching an appointment record"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = resData.data;
  return data;
}

export async function deleteAppointmentRecordById({ id }) {
  const response = await fetch(
    `http://localhost:8080/api/v1/appointmentrecords/${id}`,
    {
      credentials: "include",
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
    }
  );

  if (!response.ok) {
    const error = new Error(
      "An error occurred while deleting appointment record"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = resData.data;
  return data;
}
