export async function fetchDataFromGoogleSheets() {
  const response = await fetch(
    "http://localhost:8080/api/v1/bookingappointmentlist/fetchDataFromGoogleSheets",
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
      "An error occurred while fetchDataFromGoogleSheets"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  return resData;
}

export async function getBookingAppointmentListByDate({ bookingDate }) {
  const response = await fetch(
    `http://localhost:8080/api/v1/bookingappointmentlist/bookingAppointmentListByDate?bookingDate=${bookingDate}`,
    {
      credentials: "include",
      headers: {
        "Content-Type": "example/query",
        authorization: "Bearer",
      },
    }
  );
  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching  bookingAppointmentListByDate"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = resData.bookingAppointmentList;
  return data;
}

export async function getAllBookingAppointmentList() {
  const response = await fetch(
    `http://localhost:8080/api/v1/bookingappointmentlist`,
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
      "An error occurred while fetching  all bookingAppointmentList"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = resData.bookingAppointmentList;
  return data;
}

export async function deleteBookingAppointmentById({ id }) {
  const response = await fetch(
    `http://localhost:8080/api/v1/bookingappointmentlist/${id}`,
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
    const error = new Error("Hủy lịch hẹn thất bại");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }
  const data = {
    message: "Hủy lịch hẹn thành công",
  };
  return data;
}

export async function createBookingAppointment(data) {
  const bookingDate = data.bookingDate;
  const fullName = data.fullName.trim();
  const phone = data.phone.trim();
  const gender = data.gender.trim();
  const address = data.address.trim();
  const bookingAppointment = data.bookingAppointment;
  const bookingID = data?.id || null;
  let response;
  if (bookingID) {
    response = await fetch(
      `http://localhost:8080/api/v1/bookingappointmentlist/${bookingID}`,
      {
        credentials: "include",
        method: "PUT",
        body: JSON.stringify({
          bookingAppointment,
        }),
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer",
        },
      }
    );
    if (!response.ok) {
      const error = new Error("Cập nhật lịch hẹn thất bại");
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }

    const resData = await response.json();
    const finalData = { ...resData.data };
    finalData.message = "Cập nhật lịch hẹn thành công";
    return finalData;
  } else {
    response = await fetch(
      `http://localhost:8080/api/v1/bookingappointmentlist`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          bookingDate,
          fullName,
          phone,
          gender,
          address,
          bookingAppointment,
        }),
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer",
        },
      }
    );

    if (!response.ok) {
      const error = new Error("Tạo lịch hẹn thất bại");
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }

    const resData = await response.json();
    const finalData = { ...resData.data };
    finalData.message = "Tạo lịch hẹn thành công";
    return finalData;
  }
}
