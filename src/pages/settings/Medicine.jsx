import { NavLink, Outlet } from "react-router-dom";
import "./Medicine.scss";

function MedicineView() {
  return (
    <div className="col h-100"  style={{ backgroundColor: "#F9F9F9" }}>
      <div className="d-flex flex-column w-100 h-100 medicine-navigation">
        <nav className="nav nav-pills gap-4 justify-content-center border-bottom border-2 p-2">
              <NavLink
                className={({ isActive }) =>
                  isActive
                    ? "nav-link shadow-sm bg-white  nav-bar"
                    : "nav-link   nav-bar-active"
                }
                to="drugs"
              >
                Thuốc
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                  ? "nav-link shadow-sm bg-white  nav-bar"
                  : "nav-link   nav-bar-active"
                }
                to="units"
              >
                Đơn vị
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                  ? "nav-link shadow-sm bg-white  nav-bar"
                  : "nav-link   nav-bar-active"
                }
                to="usages"
              >
                Dùng thuốc
              </NavLink>
              <NavLink
                className={({ isActive }) =>
                  isActive
                  ? "nav-link shadow-sm bg-white  nav-bar"
                  : "nav-link   nav-bar-active"
                }
                to="diseases"
              >
                Bệnh
              </NavLink>
        </nav>
        <div  className="row w-100 h-100 overflow-hidden">
        <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MedicineView;
