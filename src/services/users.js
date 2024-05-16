export async function createUser(data) {
  let response;
  const userId = data?.id ?? null;

  if (userId) {
    const user = {
      userName: data?.username.trim(),
      email: data?.email.trim(),
      fullName: data?.fullname.trim(),
      userGroupId: data?.usergroupid.trim(),
    };
    response = await fetch(`http://localhost:8080/api/v1/users/${userId}`, {
      credentials: "include",
      method: "PUT",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
    });

    if (response.status === 400) {
      const error = new Error(
        "Tên người dùng hoặc email đã tồn tại, vui lòng chọn email và tên người dùng khác"
      );
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }

    if (!response.ok) {
      const error = new Error("Cập nhật người dùng thất bại");
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }

    const resData = await response.json();
    const finalData = { ...resData.data };
    finalData.message = "Cập nhật người dùng thành công";
    return finalData;
  } else {
    const user = {
      userName: data?.username.trim(),
      email: data?.email.trim(),
      password: data?.password.trim(),
      fullName: data?.fullname.trim(),
      userGroupId: data?.usergroupid.trim(),
    };

    response = await fetch(`http://localhost:8080/api/v1/users`, {
      credentials: "include",
      method: "POST",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
    });

    if (response.status === 400) {
      const error = new Error(
        "Tên người dùng hoặc email đã tồn tại, vui lòng chọn email và tên người dùng khác"
      );
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }

    if (!response.ok) {
      const error = new Error("Thêm người dùng thất bại");
      error.code = response.status;
      error.info = await response.json();
      throw error;
    }

    const resData = await response.json();
    const finalData = resData.data;
    finalData.message = "Thêm người dùng mới thành công";
    finalData.sendUserInfo = true;
    finalData.password = data?.password.trim();
    return finalData;
  }
}

export async function sendUserInfo(data) {
  const userInfo = {
    userName: data?.userName.trim(),
    email: data?.email.trim(),
    password: data?.password.trim(),
    fullName: data?.fullName.trim(),
  };
  const response = await fetch(`http://localhost:8080/api/v1/users/send-info`, {
    credentials: "include",
    method: "POST",
    body: JSON.stringify(userInfo),
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer",
    },
  });

  if (!response.ok) {
    const error = new Error("Gửi email thất bại");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const finalData = resData.data;
  finalData.message = "Thông tin đăng nhập đã được gửi đến email";
  return finalData;
}

export async function sendUserInfoByUserId(data) {
  const userInfo = {
    id: data.id,
    password: data.password,
  };
  const response = await fetch(
    `http://localhost:8080/api/v1/users/send-info-by-id`,
    {
      credentials: "include",
      method: "POST",
      body: JSON.stringify(userInfo),
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer",
      },
    }
  );

  if (!response.ok) {
    const error = new Error("Gửi email thất bại");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const finalData = resData.data;
  return finalData;
}

export async function fetchAllUsers() {
  const response = await fetch("http://localhost:8080/api/v1/users", {
    credentials: "include",
    headers: {
      authorization: "Bearer",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error("An error occurred while fetching  all users");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();

  const data = resData.data;
  return data;
}

export async function fetchUserById({ id }) {
  console.log("thisi id in fetch", id);
  const response = await fetch(`http://localhost:8080/api/v1/users/${id}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      authorization: "Bearer",
    },
  });
  if (!response.ok) {
    const error = new Error("An error occurred while fetching  user");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();

  const data = resData.data;
  return data;
}

export async function deleteUserById({ id }) {
  const response = await fetch(`http://localhost:8080/api/v1/users/${id}`, {
    credentials: "include",
    method: "DELETE",
    headers: {
      authorization: "Bearer",
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = new Error("Xóa người dùng thất bại");
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const resData = await response.json();
  const data = { ...resData.data };
  data.message = "Xóa người dùng thành công";
  return data;
}
