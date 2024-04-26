import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import LoginPage from "./pages/auth/Login";
import RootLayout from "./pages/Root";
import HomePage from "./pages/Home";
import ReportsPage from "./pages/Reports";
import PatientsPage from "./pages/patients/Patients";
import ExaminationsPage from "./pages/settings/examination/Examinations";
import UsersView from "./pages/settings/users/Users";
import PrincipleView from "./pages/settings/Principle";
import PasswordView from "./pages/settings/Password";
import MedicineView from "./pages/settings/Medicine";
import DrugTab from "./pages/settings/medicines/Drugs";
import UnitsTab from "./pages/settings/medicines/Units";
import UsagesTab from "./pages/settings/medicines/Usages";
import DiseasesTab from "./pages/settings/medicines/Diseases";
import LoginSuccess from "./pages/auth/LoginSuccess";
import LoginFail from "./pages/auth/LoginFail";
import PatientDetail from "./pages/patients/PatientDetail";
import ExaminationDetail from "./pages/settings/examination/ExaminationDetail";
import PreScriptionTab from "./pages/settings/examination/PrescriptionTab";
import HistoryTab from "./pages/settings/examination/HistoryTab";
import Invoice from "./pages/Invoice/Invoice";
import ErrorPage from "./pages/Error";

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      { index: true, element: <LoginPage /> },
      { path: "/login/success", element: <LoginSuccess /> },
      { path: "/login/fail", element: <LoginFail /> },
      {
        path: "/systems",
        element: <RootLayout />,
        children: [
          {
            path: "home",
            element: <HomePage />,
          },
          { path: "invoice", element: <Invoice /> },
          { path: "reports", element: <ReportsPage /> },
          { path: "patients", element: <PatientsPage /> },
          {
            path: "patients/:patientId",
            element: <PatientDetail />,
          },
          { path: "examinations", element: <ExaminationsPage /> },
          {
            path: "examinations/:appopintmentListPatientId",
            element: <ExaminationDetail />,
            children: [
              {
                path: "prescription",
                element: <PreScriptionTab isEditable={true} />,
              },
              { path: "examhistory", element: <HistoryTab /> },
            ],
          },
          {
            path: "settings",
            children: [
              { path: "users", element: <UsersView /> },
              { path: "principle", element: <PrincipleView /> },
              {
                path: "medicine",
                element: <MedicineView />,
                children: [
                  { path: "drugs", element: <DrugTab /> },
                  { path: "units", element: <UnitsTab /> },
                  { path: "usages", element: <UsagesTab /> },
                  { path: "diseases", element: <DiseasesTab /> },
                ],
              },
              { path: "password", element: <PasswordView /> },
            ],
          },
        ],
      },
    ],
    errorElement: <ErrorPage />,
  },
]);

export const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
