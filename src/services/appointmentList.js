export async function fetchAllAppointmentList() {
  const response = await fetch(
    "http://localhost:8080/api/v1/appointmentlists",
    {
      credentials: "include",
      headers: {
        authorization: "Bearer",
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching  all appointment lists"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const appointmentLists = resData.data;
  return appointmentLists;
}

export async function createAppointmentList({ scheduledate }) {
  const scheduleDate = scheduledate;
  const response = await fetch(
    "http://localhost:8080/api/v1/appointmentlists",
    {
      credentials: "include",
      method: "POST",
      headers: {
        authorization: "Bearer",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ scheduleDate }),
    }
  );

  if (!response.ok) {
    const error = new Error(
      "An error occurred while creating an appointment list"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const appointmentLists = resData.data;
  return appointmentLists;
}
