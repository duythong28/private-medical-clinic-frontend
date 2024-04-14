export async function fetchMaxNumberOfPatients() {
  const response = await fetch(
    "http://localhost:8080/api/v1/arguments/maxnumofpatients",
    {
      credentials: "include", // Include cookies for cross-origin requests
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer ",
      },
    }
  );

  if (!response.ok) {
    const error = new Error(
      "An error occurred while fetching max number of patients"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();

  const maxNumberOfPatients = resData.maxNumOfPatients[0].maxNumberOfPatients;
  return maxNumberOfPatients;
}

export async function fetchFeeConsult() {
  const response = await fetch(
    "http://localhost:8080/api/v1/arguments/feeConsult",
    {
      credentials: "include",
      headers: {
        Authorization: "Bearer ",
      },
    },
    {
      credentials: "include",
    }
  );
  if (!response.ok) {
    const error = new Error("An error occurred while fetching  fee consult");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const feeConsult = resData.feeConsult[0].feeConsult;
  return feeConsult;
}

export async function updateMaxNumberOfPatients({ maxNumberOfPatients }) {
  const response = await fetch(
    "http://localhost:8080/api/v1/arguments/maxnumofpatients",
    {
      credentials: "include",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
      body: JSON.stringify({ maxNumberOfPatients }),
    },
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    const error = new Error(
      "An error occurred while updating max number of patients"
    );
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  return resData;
}

export async function updateFeeConsult({ feeConsult }) {
  const response = await fetch(
    "http://localhost:8080/api/v1/arguments/feeConsult",
    {
      credentials: "include",
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
      body: JSON.stringify({ feeConsult }),
    },
    {
      credentials: "include",
    }
  );

  if (!response.ok) {
    const error = new Error("An error occurred while updateing fee consult");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  return resData;
}
