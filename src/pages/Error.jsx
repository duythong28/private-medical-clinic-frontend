import { Navigate, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  const isAuth = localStorage.getItem("refreshToken");
  if (!isAuth) {
    return <Navigate to="/" />;
  }

  let title = "An error occurred!";
  let message = "Something went wrong!";
  if (error.status === 500) {
    message = error.message;
  }

  if (error.status === 404) {
    title = "Not found!";
    message = "Could not find resource or page.";
  }

  return (
    <div className="col h-100">
      <div
        className="h-100 position-relative"
        style={{ backgroundColor: "#F9F9F9" }}
      >
        <div
          className="position-absolute start-50 translate-middle text-center"
          style={{ top: "40%" }}
        >
          <h1>{title}</h1>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
}
