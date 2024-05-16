import SideBar from "../components/SideBar";
import { Outlet } from "react-router";

function RootLayout() {
  return (
    <>
      <div className="d-flex felx-row h-100">
        <div style={{ width: "280px", height: "100%" }}>
          <SideBar />
        </div>
        <div style={{ width: "100%", height: "100%" }}>
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default RootLayout;
