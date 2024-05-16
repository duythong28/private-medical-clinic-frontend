import "./Home.scss";
import CalendarSelectDay from "../components/CalendarSelectDay";
import { MyProvider } from "../components/SelectDayContext";
import PatientOfDay from "../components/PatientOfDay";
import NumberOfPatient from "../components/NumberOfPatient";
import TopDrug from "../components/TopDrug";

function HomePage() {
  return (
    <div className="h-100 w-100 overview p-3 gap-3 d-flex flex-col ">
      <div className="w-100 d-flex flex-column">
        <div className="h-100 w-80 rounded-3 p-3 playing e-card" style={{ border: "1px solid #B9B9B9"}}>
          <div class="wave"></div>
          <div class="wave"></div>
          <div class="wave"></div>
        </div>
        <div className="d-flex h-100 w-100" style={{marginTop: "16px"}}>
          <MyProvider>
            <PatientOfDay />
          </MyProvider>
          <NumberOfPatient />
        </div>
          <TopDrug />
      </div>
      <MyProvider>
        <CalendarSelectDay />
      </MyProvider>
    </div>
  );
}

export default HomePage;
