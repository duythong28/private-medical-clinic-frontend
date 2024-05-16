import { useEffect, useState, createContext, useContext } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useQuery } from "@tanstack/react-query";
import { vi } from "date-fns/locale";

import { fetchAllAppointmentListById } from "../services/appointmentList";
import { fetchPatientById } from "../services/patients";
import { fetchAllAppointmentListPatients } from "../services/appointmentListPatients";
import "../pages/Home.scss";
import { queryClient } from "../App";
import { Link } from "react-router-dom";
import { useMyContext, compareDate } from "./SelectDayContext";

const css = `
        .my-today { 
            font-weight: bold;
            color: #d74f4a;
        }
    `;

function CalendarSelectDay() {
  const { selectedDay, setSelectedDay } = useMyContext();

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
          new Date(item?.appointmentList.scheduleDate?.slice(0, 10)),
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
  const appointmentListUpcoming = appointmentListPatientSelectedDay.filter(
    (item) => !item.appointmentRecordId
  );

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["appointmentListSelectedDay"] });
  }, [selectedDay]);

  return (
    <div
      id="calendar"
      className=" rounded-3 p-3 w-20"
      style={{ border: "1px solid #B9B9B9" }}
    >
      {/* <h6 className="calendar-title">Lịch</h6> */}
      {/* <style>{css}</style> */}
      <div className="calendar-container mb-2">
        <DayPicker
          locale={vi}
          weekStartsOn={1}
          defaultMonth={new Date()}
          selected={selectedDay}
          onSelect={setSelectedDay}
          mode="single"
          modifiersClassNames={{
            today: "my-today",
          }}
          showOutsideDays
        ></DayPicker>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h6 className="fw-bold text-dark" style={{ flex: 1, margin: 0 }}>
          Ca khám sắp tới
        </h6>
        <Link to="/examinations" className="link-all">
          Xem tất cả
        </Link>
      </div>
      <div className="patients-list">
        {appointmentListUpcoming.length > 0 ? (
          appointmentListUpcoming.map((item) => {
            return (
              <div className="patient-item gap-2" key={item.id}>
                <div className="image">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="2.4rem"
                    fill="#0177FB"
                    className="bi bi-arrow-up-square-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0" />
                  </svg>
                </div>
                <div className="d-flex flex-column justify-content-between">
                  <h6 className="patient-name row">{item.patient?.fullName}</h6>
                  <h6 className="gender row">
                    Giới tính: {item.patient?.gender}
                  </h6>
                </div>
              </div>
            );
          })
        ) : (
          <div className="position-relative w-100 h-100">
            <div className="position-absolute top-50 start-50 translate-middle fw-bold text-dark">
              <p style={{ width: "max-content" }}>Không có ca khám</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CalendarSelectDay;
