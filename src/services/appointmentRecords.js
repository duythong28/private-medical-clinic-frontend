export async function createAppointmentRecord({
  patientId,
  appointmentListId,
  symptoms,
  diseaseId,
}) {
  const response = await fetch(
    "http://localhost:8080/api/v1/appointmentrecords",
    {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
      body: JSON.stringify({
        patientId,
        appointmentListId,
        symptoms,
        diseaseId,
      }),
    }
  );

  if (!response.ok) {
    const error = new Error("Ca khám chưa hoàn thành");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = {...resData.data};
  data.message = "Hoàn thành ca khám";
  return data;
}

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

export async function fetchAppointmentRecordByPatientId({ patientId }) {
  const response = await fetch(
    `http://localhost:8080/api/v1/appointmentrecords?patientId=${patientId}`,
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

export async function fetchAppointmentRecordByBill({ bill }) {
  console.log("bill api", bill);
  const patientId = bill.patientId;
  const appointmentListId = bill.appointmentListId;

  const response = await fetch(
    `http://localhost:8080/api/v1/appointmentrecords?patientId=${patientId}&&appointmentListId=${appointmentListId}`,
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
      "An error occurred while fetching  appointment record"
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
        authorization: "Bearer",
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = new Error("Xóa phiếu khám bệnh thất bại");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = { ...resData.data };
  data.message = "Xóa phiếu khám bệnh thành công";

  return data;
}
