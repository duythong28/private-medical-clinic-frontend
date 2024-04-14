export async function login(userData) {
  let response;

  if (userData) {
    //login with username and password
    response = await fetch("http://localhost:8080/api/v1/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Access-Control-Allow-Credentials": true,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
  } else {
    //login with google
    response = await fetch("http://localhost:8080/api/v1/auth/success");
  }

  if (!response.ok) {
    throw new Error(
      { message: "could not login" },
      {
        status: 500,
      }
    );
  }
  const headers = response.headers;
  headers.forEach((value, name) => {
    console.log(`${name}: ${value}`);
  });
  console.log(headers.get("Content-Type"));
  const resData = await response.json();
  const refreshToken = resData.user.refreshToken;
  localStorage.setItem("refreshToken", refreshToken);

  return resData;
}

export async function logout() {
  const response = await fetch("http://localhost:8080/api/v1/auth/logout", {
    method: "GET",
    headers: {
      authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
    },
  });
  if (!response.ok) {
    throw new Error(
      { message: "could not logout" },
      {
        status: 500,
      }
    );
  }

  const resData = await response.json();
  localStorage.removeItem("refreshToken");
  return resData;
}
