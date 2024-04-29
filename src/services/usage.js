export async function fetchAllUsage() {
  const response = await fetch("http://localhost:8080/api/v1/usage", {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer",
    },
  });

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching all the diseases"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const usages = resData.data;
  return usages;
}

export async function createNewUsage(data) {
  const usageDes = data.usagedes;
  const usageId = data?.id ?? null;
  let response;

  if (usageId) {
    response = await fetch(`http://localhost:8080/api/v1/usage/${usageId}`, {
      credentials: "include",
      method: "PUT",
      body: JSON.stringify({ usageDes }),
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
    });
    if (!response.ok) {
      const error = new Error("Cập nhật cách dùng thất bại");
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }

    const resData = await response.json();
    const finalData = {...resData.data};
    finalData.message = "Cập nhật cách dùng thành công";
    return finalData;
  } else {
    response = await fetch(`http://localhost:8080/api/v1/usage`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ usageDes }),
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
    });
    if (!response.ok) {
      const error = new Error("Thêm cách dùng thất bại");
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }

    const resData = await response.json();
    const finalData = {...resData.data};
    finalData.message = "Thêm cách dùng thành công";
    return finalData;
  }
}

export async function deleteUsage({ id }) {
  const response = await fetch(`http://localhost:8080/api/v1/usage/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer",
    },
  });

  if (!response.ok) {
    const error = new Error("Xóa cách dùng thất bại");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = {...resData.data};
  data.message = "Xóa cách dùng thành công";
  return data;
}
