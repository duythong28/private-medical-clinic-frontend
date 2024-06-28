export async function fetchAllDrugs() {
  const response = await fetch("http://localhost:8080/api/v1/drugs", {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer",
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching all the drugs");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const drugs = resData.drugs;
  return drugs;
}

export async function createNewDrug(data) {
  const drugName = data.drugname.trim();
  const price = data.price.trim();
  const count = data.count.trim();
  const unitId = data.unitid;
  const drugID = data?.id ?? null;
  const note = data.note.trim();

  let response;
  if (drugID) {
    response = await fetch(`http://localhost:8080/api/v1/drugs/${drugID}`, {
      credentials: "include",
      method: "PUT",
      body: JSON.stringify({ drugName, price, count, unitId, note, }),
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
    });
    if (!response.ok) {
      const error = new Error("Cập nhật thuốc thất bại");
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }

    const resData = await response.json();
    const finalData = {...resData.data};
    finalData.message = "Cập nhật thuốc thành công";
    return finalData;
  } else {
    response = await fetch(`http://localhost:8080/api/v1/drugs`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ drugName, price, count, unitId, note }),
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
    });

    if (!response.ok) {
      const error = new Error("Thêm thuốc thất bại");
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }

    const resData = await response.json();
    const finalData = {...resData.data};
    finalData.message = "Thêm thuốc thành công";
    return finalData;
  }
}

export async function deleteDrugById({ id }) {
  const response = await fetch(`http://localhost:8080/api/v1/drugs/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer",
    },
  });

  if (!response.ok) {
    const error = new Error("Xóa thuốc thất bại");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const data = {};
  data.message = "Xóa thuốc thành công";
  return data;
}

export async function fetchDrugById({ id }) {
  const response = await fetch(`http://localhost:8080/api/v1/drugs/${id}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer",
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the drug");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const drug = resData.drug;
  return drug;
}
