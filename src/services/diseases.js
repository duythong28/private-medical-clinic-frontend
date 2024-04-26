export async function fetchAllDisease() {
  const response = await fetch("http://localhost:8080/api/v1/diseases", {
    credentials: "include",
    headers: {
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
  const diseases = resData.diseases;
  return diseases;
}

export async function createNewDisease(data) {
  const diseaseName = data.diseasename;
  const diseaseID = data?.id ?? null;
  let response;

  if (diseaseID) {
    response = await fetch(
      `http://localhost:8080/api/v1/diseases/${diseaseID}`,
      {
        Credentials: "include",
        method: "PUT",
        body: JSON.stringify({ diseaseName }),
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer",
        },
      }
    );
  } else {
    response = await fetch(`http://localhost:8080/api/v1/diseases`, {
      credentials: "include",
      method: "POST",
      body: JSON.stringify({ diseaseName }),
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
    });
  }

  if (!response.ok) {
    const error = new Error("An error occurred");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { event } = await response.json();

  return event;
}

export async function deleteDisease({ id }) {
  const response = await fetch(`http://localhost:8080/api/v1/diseases/${id}`, {
    credentials: "include",
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer",
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while deleting the disease");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  return response.json();
}
