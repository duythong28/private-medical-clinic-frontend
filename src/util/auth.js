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

    if (!response.ok) {
      const error = new Error("Thông tin đăng nhập không chính xác");
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }
  } else {
    //login with google
    response = await fetch("http://localhost:8080/api/v1/auth/success");
    if (!response.ok) {
      const error = new Error("cancel-login");
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }
  }

  const headers = response.headers;
  headers.forEach((value, name) => {
    console.log(`${name}: ${value}`);
  });
  console.log(headers.get("Content-Type"));
  const resData = await response.json();
  const refreshToken = resData.user.refreshToken;
  setTimeout(() => {
    const user = resData.user.user;
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("refreshToken", refreshToken);
  }, 500);
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
  localStorage.removeItem("user");
  localStorage.removeItem("refreshToken");
  return resData;
}

export async function changePassword({
  id,
  confirmPassword,
  newPassword,
  currentPassword,
}) {
  const response = await fetch(
    `http://localhost:8080/api/v1/auth/change-password/${id}`,
    {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ confirmPassword, newPassword, currentPassword }),
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
    }
  );
  if (!response.ok) {
    const error = new Error("Thông tin không chính xác");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = resData.data;
  return data;
}

export async function checkMail({ email }) {
  const response = await fetch(
    `http://localhost:8080/api/v1/auth/check-email`,
    {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
    }
  );
  if (!response.ok) {
    const error = new Error("Không tìm thấy email người dùng");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = resData.data;
  localStorage.setItem("email", email);
  return data;
}

export async function sendOTP({ email }) {
  const response = await fetch(
    `http://localhost:8080/api/v1/auth/reset-password/send-otp`,
    {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ email }),
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
    }
  );
  if (!response.ok) {
    const error = new Error("Không tìm thấy email người dùng");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = resData.data;
  return data;
}

export async function checkOTP({ email, code }) {
  const response = await fetch(
    `http://localhost:8080/api/v1/auth/check-otp`,
    {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ email, code }),
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
    }
  );
  if (!response.ok) {
    const error = new Error("Mã OPT không chính xác, vui lòng kiểm tra lại");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = resData.data;
  return data;
}

export async function resetPassword({ email, newPassword, confirmPassword }) {
  const response = await fetch(
    `http://localhost:8080/api/v1/auth/reset-password`,
    {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ email, newPassword, confirmPassword }),
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
    }
  );
  if (!response.ok) {
    const error = new Error("Cài đặt mật khẩu không thành công");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  localStorage.removeItem("email");
  const resData = await response.json();
  const data = resData.data;
  return data;
}
