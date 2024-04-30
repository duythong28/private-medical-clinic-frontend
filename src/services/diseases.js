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

  if (diseaseID !== null) {
    response = await fetch(
      `http://localhost:8080/api/v1/diseases/${diseaseID}`,
      {
        credentials: "include",
        method: "PUT",
        body: JSON.stringify({ diseaseName }),
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer",
        },
      }
    );

    if (!response.ok) {
      const error = new Error("Cập nhật bệnh thất bại");
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }
  
    const resData = await response.json();
    const finalData = {...resData.data};
    finalData.message = "Cập nhật bệnh thành công";
    return finalData;
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

    if (!response.ok) {
      const error = new Error("Thêm bệnh thất bại");
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }
  
    const resData = await response.json();
    const finalData = {...resData.data};
    finalData.message ="Thêm bệnh thành công";
    return finalData;
  }

 
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
    const error = new Error("Xóa bệnh thất bại");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = {...resData.data};
  data.message = "Xóa bệnh thành công";
  return data;
}
