import Cookies from "js-cookie";
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
    response = await fetch("http://localhost:8080/api/v1/auth/success", {
      method: "GET",
      credentials: "include",
      headers: {
        authorization: `Bearer`,
      },
    });
    if (!response.ok) {
      const error = new Error("Đăng nhập thất bại");
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }
  }

  // const headers = response.headers;
  // headers.forEach((value, name) => {
  //   console.log(`${name}: ${value}`);
  // });
  // console.log(headers.get("Content-Type"));
  const resData = await response.json();
  const refreshToken = resData.user.refreshToken;
  Cookies.set("refreshToken", refreshToken);

  resData.message = "Đăng nhập thành công";
  return resData;
}

export async function loginWithGoogle() {
  const response = await fetch("http://localhost:8080/api/v1/auth/success", {
    method: "GET",
    credentials: "include",
    headers: {
      authorization: `Bearer`,
    },
  });
  if (!response.ok) {
    const error = new Error("Đăng nhập thất bại");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  // const headers = response.headers;
  // headers.forEach((value, name) => {
  //   console.log(`${name}: ${value}`);
  // });
  // console.log(headers.get("Content-Type"));
  const resData = await response.json();
  const refreshToken = resData.user.refreshToken;
  Cookies.set("refreshToken", refreshToken);

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
  Cookies.remove("refreshToken");
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
  const response = await fetch(`http://localhost:8080/api/v1/auth/check-otp`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify({ email, code }),
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer",
    },
  });
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

export async function resetPasswordById({ id, newPassword, confirmPassword }) {
  const response = await fetch(
    `http://localhost:8080/api/v1/auth/reset-password-by-id`,
    {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ id, newPassword, confirmPassword }),
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
    }
  );
  if (!response.ok) {
    const error = new Error("Thay đổi mật khẩu không thành công");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = resData.data;

  return {
    ...data,
    message: "Thiết lập lại mật khẩu thành công",
    sendUserInfoByUserId: true,
    id: id,
    password: newPassword.trim(),
  };
}
