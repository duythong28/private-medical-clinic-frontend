export async function createBill(data) {
  const bill = {
    patientId: data?.patientId,
    appointmentListId: data?.appointmentListId,
    drugExpense: data?.drugExpense,
    feeConsult: data?.feeConsult,
  };

  const billId = data?.id ?? null;
  let response;

  if (billId) {
    response = await fetch(`http://localhost:8080/api/v1/bills/${billId}`, {
      credentials: "include",
      method: "PUT",
      body: JSON.stringify(bill),
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
    });
  } else {
    response = await fetch(`http://localhost:8080/api/v1/bills`, {
      credentials: "include",
      method: "POST",
      body: JSON.stringify(bill),
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
    });

    if (!response.ok) {
      const error = new Error("Thanh toán thất bại");
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }
    const resData = await response.json();
    const data = resData.data;
    data.message = "Thanh toán thành công";
    return data;
  }
}

export async function fetchAllBills() {
  const response = await fetch("http://localhost:8080/api/v1/bills", {
    credentials: "include",
    headers: {
      authorization: "Bearer",
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const error = new Error("An error occurred while fetching  all bills");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = resData.data;
  return data;
}

export async function fetchBillById({ id }) {
  const response = await fetch(`http://localhost:8080/api/v1/bills/${id}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer",
    },
  });
  if (!response.ok) {
    const error = new Error("An error occurred while fetching  bill");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = resData.data;
  return data;
}

export async function deleteBillById({ id }) {
  const response = await fetch(`http://localhost:8080/api/v1/bills/${id}`, {
    credentials: "include",
    method: "DELETE",
    headers: {
      authorization: "Bearer",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error("Xóa hóa đơn thất bại");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = { ...resData.data };
  data.message = "Xóa hóa đơn thành công";
  return data;
}
