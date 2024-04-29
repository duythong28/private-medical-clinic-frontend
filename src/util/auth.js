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
    const error = new Error("Thông tin đăng nhập không chính xác");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }
  const headers = response.headers;
  headers.forEach((value, name) => {
    console.log(`${name}: ${value}`);
  });
  console.log(headers.get("Content-Type"));
  const resData = await response.json();
  const refreshToken = resData.user.refreshToken;
  setTimeout(() => {
    localStorage.setItem("refreshToken", refreshToken);
  }, 1000);
  resData.message = "Đăng nhập thành công";
  return resData;
}

export async function logout() {
  const response = await fetch("http://localhost:8080/api/v1/auth/logout", {
    method: "GET",
    credentials: "include",
    headers: {
      authorization: `Bearer`,
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

export async function changePassword({ id, password }) {
  const response = await fetch(
    `http://localhost:8080/api/v1/auth/change-password/${id}`,
    {
      method: "PUT",
      credentials: "include",
      headers: {
        authorization: `Bearer`,
      },
      body: JSON.stringify({ password: password }),
    }
  );
  if (!response.ok) {
    throw new Error(
      { message: "an error occur while changing the password" },
      {
        status: 500,
      }
    );
  }

  const resData = await response.json();
  const data = resData.data;
  return data;
}
