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
import PatientDetail from "./pages/patients/PatientDetail";
import ExaminationDetail from "./pages/settings/examination/ExaminationDetail";
import PreScriptionTab from "./pages/settings/examination/PrescriptionTab";
import HistoryTab from "./pages/settings/examination/HistoryTab";
import Invoice from "./pages/Invoice/Invoice";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ErrorPage from "./pages/Error";
import MemberTab from "./pages/settings/users/MemberTab";
import RoleTab from "./pages/settings/users/RoleTab";
import RoleDetail from "./pages/settings/users/RoleDetail";
import useAuth from "./hooks/useAuth";

const allRouter = [
  {
    path: "/",
    children: [
      { index: true, element: <LoginPage />, isPrivate: false },
      { path: "/login/success", element: <LoginSuccess />, isPrivate: false },
      {
        path: "/forgotpassword",
        element: <ForgotPassword />,
        isPrivate: false,
      },
      {
        element: <RootLayout />,
        isPrivate: true,
        children: [
          { path: "/home", element: <HomePage />, isPrivate: true },
          { path: "/password", element: <PasswordView />, isPrivate: true },

          {
            path: "/principle",
            element: <PrincipleView />,
            isPrivate: true,
            permission: "RArgument",
          },
          {
            path: "/invoice",
            element: <Invoice />,
            isPrivate: true,
            permission: "RInvoice",
          },
          {
            path: "/reports",
            element: <ReportsPage />,
            isPrivate: true,
            permission: "RReport",
          },
          {
            path: "/patients",
            element: <PatientsPage />,
            isPrivate: true,
            permission: "RPatient",
          },
          {
            path: "/patients/:patientId",
            element: <PatientDetail />,
            isPrivate: true,
            permission: "RPatient",
          },
          {
            path: "/examinations",
            element: <ExaminationsPage />,
            isPrivate: true,
            permission: "RAppointment",
          },
          {
            path: "/examinations/:appopintmentListPatientId",
            element: <ExaminationDetail />,
            isPrivate: true,
            permission: "CRecord",
            children: [
              {
                path: "prescription",
                element: <PreScriptionTab isEditable={true} />,
                isPrivate: true,
                permission: "RDrug",
              },
              {
                path: "examhistory",
                element: <HistoryTab />,
                isPrivate: true,
                permission: "RRecord",
              },
            ],
          },
          {
            path: "/users",
            element: <UsersView />,
            isPrivate: true,
            permission: "RUser",
            children: [
              {
                path: "members",
                element: <MemberTab />,
                isPrivate: true,
                permission: "RUser",
              },
              {
                path: "roles",
                element: <RoleTab />,
                isPrivate: true,
                permission: "RUser",
              },
              {
                path: "roles/new",
                element: <RoleDetail />,
                isPrivate: true,
                permission: "RUser",
              },
              {
                path: "roles/:roleId",
                element: <RoleDetail />,
                isPrivate: true,
                permission: "RUser",
              },
            ],
          },
          {
            path: "/medicine",
            element: <MedicineView />,
            isPrivate: true,
            permission: "RDrug",
            children: [
              {
                path: "drugs",
                element: <DrugTab />,
                isPrivate: true,
                permission: "RDrug",
              },
              {
                path: "units",
                element: <UnitsTab />,
                isPrivate: true,
                permission: "RDrug",
              },
              {
                path: "usages",
                element: <UsagesTab />,
                isPrivate: true,
                permission: "RDrug",
              },
              {
                path: "diseases",
                element: <DiseasesTab />,
                isPrivate: true,
                permission: "RDrug",
              },
            ],
          },
        ],
      },
    ],
    errorElement: <ErrorPage />,
  },
];

export const queryClient = new QueryClient();

function App() {
  const { auth } = useAuth();
  const permission = auth?.permission || [];
  const isAuth = auth?.roleId || false;
  const authRoutes = [
    {
      ...allRouter[0],
      children: getRoute({
        children: allRouter[0].children,
        isAuth,
        permission,
      }),
    },
  ];
  const router = createBrowserRouter(authRoutes);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;

function getRoute({ children, isAuth, permission }) {
  const accessRoutes = children.map((route) => {
    if (!route.isPrivate && !isAuth) {
      if (route?.children) {
        return {
          ...route,
          children: getRoute({ children: route.children, isAuth, permission }),
        };
      }
      return route;
    } else if (route.isPrivate && isAuth) {
      if (route?.permission && permission.includes(route.permission)) {
        if (route?.children)
          return {
            ...route,
            children: getRoute({
              children: route.children,
              isAuth,
              permission,
            }),
          };
        return route;
      } else if (route?.permission && !permission.includes(route.permission)) {
        return null;
      } else {
        if (route?.children)
          return {
            ...route,
            children: getRoute({
              children: route.children,
              isAuth,
              permission,
            }),
          };
        return route;
      }
    } else {
      return null;
    }
  });
  const nonNullRoutes = accessRoutes.filter((route) => route !== null);
  return nonNullRoutes;
}
