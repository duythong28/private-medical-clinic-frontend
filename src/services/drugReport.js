export async function fetchAllDrugReportData() {
    const response = await fetch("http://localhost:8080/api/v1/drugusagereports", {
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
    const drugs = resData.data;
    return drugs;
  }