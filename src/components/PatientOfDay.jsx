import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchAllAppointmentListById } from "../services/appointmentList";
import { fetchPatientById } from "../services/patients";
import { fetchAllAppointmentListPatients } from "../services/appointmentListPatients";
import "../pages/Home.scss";
import { queryClient } from "../App";
import { useMyContext, compareDate } from "../components/SelectDayContext";

function PatientOfDay() {
  const { selectedDay } = useMyContext();

  const optionQuery = function (queryKey, optionFilter = (data) => data) {
    return {
      queryKey: [queryKey],
      queryFn: async () => {
        const data = await fetchAllAppointmentListPatients();
        const finalData = await Promise.all(
          data.map(async (item) => {
            const patient = await fetchPatientById({ id: item.patientId });
            const appointmentList = await fetchAllAppointmentListById({
              id: item.appointmentListId,
            });

            return {
              ...item,
              patient,
              appointmentList,
            };
          })
        );
        const searchData = optionFilter(finalData);
        return searchData;
      },
    };
  };

  const getListAppointmentBySelectedDay = (data) => {
    const finalData = data.filter(
      (item) =>
        compareDate(
          new Date(item?.appointmentList.scheduleDate.slice(0, 10)),
          selectedDay
        ) === 0
    );
    return finalData;
  };

  const query2 = optionQuery(
    "appointmentListSelectedDay",
    getListAppointmentBySelectedDay
  );

  const appointmentListPatientSelectedDayQuery = useQuery(query2);

  const appointmentListPatientSelectedDay =
    appointmentListPatientSelectedDayQuery.data || [];

  let seenIds = {};

  let patientsToday = [];

  appointmentListPatientSelectedDay.forEach((item) => {
    let patientId = item.patient.id;
    if (!seenIds[patientId]) {
      seenIds[patientId] = true;
      patientsToday.push(item);
    }
  });
  const dataToday = (() => {
    let newPatient = 0;
    let oldPatient = 0;
    for (const item of patientsToday) {
      if (compareDate(new Date(item.patient.createdAt), new Date()) !== 0) {
        ++oldPatient;
      } else {
        ++newPatient;
      }
    }
    return {
      newPatient,
      oldPatient,
    };
  })();

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["appointmentListSelectedDay"] });
  }, [selectedDay]);

  return (
      // <div class="e-card playing rounded-3 p-3 h-100">
          <div
            className="h-100 overview-number rounded-3 p-3"
            style={{ border: "1px solid #B9B9B9" }}
          >
              <div >
                <label className="fw-bold" style={{margin: 0, fontSize: "1rem"}}>Số lượng bệnh nhân trong ngày</label>
                <h3 className="overview-number-patient ">{patientsToday.length}</h3>
              </div>
              <div className="overview-number-percents z-2">
                  <div>
                    <p className="txt-center">Bệnh nhân mới</p>
                    <p className="txt-center">{patientsToday.length > 0 ? dataToday.newPatient : 0}</p>
                    <p className="txt-center">{patientsToday.length > 0
                        ? ((dataToday.newPatient / patientsToday.length) * 100).toFixed(
                            2
                          )
                        : 0}%
                    </p>
                  </div>
                 
                  <div>
                    <p className="txt-center">Bệnh nhân cũ</p>
                    <p className="txt-center">{patientsToday.length > 0 ? dataToday.oldPatient : 0}</p>
                    <p className="txt-center">{patientsToday.length > 0
                        ? ((dataToday.oldPatient / patientsToday.length) * 100).toFixed(
                            2
                          )
                        : 0}%
                    </p>
                  </div>
                 
              </div>
            </div>
      // </div>
  );
}

export default PatientOfDay;
