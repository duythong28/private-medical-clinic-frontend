export async function fetchAllUnit() {
  const response = await fetch("http://localhost:8080/api/v1/units", {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer",
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching all the units");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const units = resData.units;
  return units;
}

export async function createNewUnit(data) {
  const unitName = data.unitname;
  const unitID = data?.id ?? null;
  let response;

  if (unitID) {
    response = await fetch(`http://localhost:8080/api/v1/units/${unitID}`, {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify({ unitName }),
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
    });
    if (!response.ok) {
      const error = new Error("Cập nhật đơn vị thất bại");
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }

    const resData = await response.json();
    const finalData = {...resData.data};
    finalData.message = "Cập nhật đơn vị thành công";
    return finalData;
  } else {
    response = await fetch(`http://localhost:8080/api/v1/units`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ unitName }),
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
    });
    if (!response.ok) {
      const error = new Error("Thêm đơn vị thất bại");
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }

    const resData = await response.json();
    const finalData = {...resData.data};
    finalData.message = "Thêm đơn vị thành công";
    return finalData;
  }
}

export async function deleteUnit({ id }) {
  const response = await fetch(`http://localhost:8080/api/v1/units/${id}`, {
    credentials: "include",
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer",
    },
  });

  if (!response.ok) {
    const error = new Error("Xóa đơn vị thất bại");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = {...resData.data};
  data.message = "Xóa đơn vị thành công";
  return data;
}

export async function fetchUnitById({ id }) {
  const response = await fetch(`http://localhost:8080/api/v1/units/${id}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer",
    },
  });
  if (!response.ok) {
    if (!response.ok) {
      throw new Error("can not fetch all patients");
    }
  }
  const resData = await response.json();
  const data = resData.data;
  return data;
}
