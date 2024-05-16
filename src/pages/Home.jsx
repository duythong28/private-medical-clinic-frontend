import "./Home.scss";
import CalendarSelectDay from "../components/CalendarSelectDay";
import { MyProvider } from "../components/SelectDayContext";
import PatientOfDay from "../components/PatientOfDay";
import NumberOfPatient from "../components/NumberOfPatient";
import TopDrug from "../components/TopDrug";

function HomePage() {
  return (
    <div className="h-100 w-100 overview p-3 gap-3 d-flex flex-col">
      <div className="w-100 d-flex flex-column">
        <MyProvider>
          <PatientOfDay />
        </MyProvider>
        <NumberOfPatient />
        <TopDrug />
      </div>
      <MyProvider>
        <CalendarSelectDay />
      </MyProvider>
    </div>
  );
}

export default HomePage;
