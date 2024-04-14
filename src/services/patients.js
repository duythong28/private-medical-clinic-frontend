export async function fetchAllPatients({ name, phoneNumber }) {
  const fullName = name.toLowerCase().trim();
  const phone = phoneNumber.trim();
  const response = await fetch(`http://localhost:8080/api/v1/patients`, {
    credentials: "include", // Include cookies for cross-origin requests
    headers: {
      authorization: "Bearer ",
    },
  });

  if (!response.ok) {
    throw new Error("can not fetch all patients");
  }

  const resData = await response.json();
  let patients;
  if (fullName !== "" || phone !== "") {
    patients = resData.data.filter(
      (patient) =>
        patient.fullName.toLowerCase().includes(fullName) &&
        patient.phoneNumber.toLowerCase().includes(phone)
    );
  } else {
    patients = resData.data;
  }
  return patients;
}

export async function fetchOnePatient({ name, phoneNumber }) {
  const fullName = name.toLowerCase().trim();
  const phone = phoneNumber.trim();
  const response = await fetch(`http://localhost:8080/api/v1/patients`, {
    credentials: "include", // Include cookies for cross-origin requests
    headers: {
      authorization: "Bearer",
    },
  });

  if (!response.ok) {
    throw new Error("can not fetch all patients");
  }

  const resData = await response.json();
  let patients;
  if (fullName !== "" || phone !== "") {
    patients = resData.data.filter(
      (patient) =>
        patient.fullName.toLowerCase().includes(fullName) &&
        patient.phoneNumber.toLowerCase().includes(phone)
    );
  } else {
    patients = [];
  }
  return patients;
}

export async function addPatient(patientData) {
  const fullName = patientData.fullname;
  const address = patientData.address;
  const birthYear = patientData.birthyear;
  const gender = patientData.gender;
  const phoneNumber = patientData.phonenumber;
  const patientID = patientData?.id ?? patientData?.patientid ?? null;
  let response;

  if (patientID) {
    response = await fetch(
      "http://localhost:8080/api/v1/patients/" + patientID,
      {
        method: "PUT",
        credentials: "include", // Include cookies for cross-origin requests
        headers: {
          authorization: "Bearer",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          address,
          birthYear,
          gender,
          phoneNumber,
        }),
      }
    );
  } else {
    response = await fetch("http://localhost:8080/api/v1/patients", {
      method: "POST",
      credentials: "include", // Include cookies for cross-origin requests
      headers: {
        authorization: "Bearer",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        address,
        birthYear,
        gender,
        phoneNumber,
      }),
    });
  }

  if (!response.ok) {
    throw new Error("can not fetch all patients");
  }

  const resData = await response.json();
  const data = resData.data;
  return data;
}

export async function fetchPatientById({ id }) {
  const response = await fetch(`http://localhost:8080/api/v1/patients/${id}`, {
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
  const patientData = resData.data;
  return patientData;
}

export async function deletePatientById({ id }) {
  const response = await fetch(`http://localhost:8080/api/v1/patients/${id}`, {
    method: "DELETE",
    credentials: "include", // Include cookies for cross-origin requests
    headers: {
      authorization: "Bearer",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("can not delete patient");
  }

  return response.json();
}
