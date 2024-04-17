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
  const drugName = data.drugname;
  const price = data.price;
  const count = data.count;
  const unitId = data.unitid;
  const drugID = data?.id ?? null;

  let response;
  if (drugID) {
    response = await fetch(`http://localhost:8080/api/v1/drugs/${drugID}`, {
      credentials: "include",
      method: "PUT",
      body: JSON.stringify({ drugName, price, count, unitId }),
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
    });
  } else {
    response = await fetch(`http://localhost:8080/api/v1/drugs`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ drugName, price, count, unitId }),
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
    });
  }

  if (!response.ok) {
    const error = new Error("An error occurred while creating the drugs");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { event } = await response.json();

  return event;
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
    const error = new Error("An error occurred while deleting the drug");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return response.json();
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
