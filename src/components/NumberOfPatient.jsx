import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useQuery } from "@tanstack/react-query";
import { vi } from "date-fns/locale";

import { fetchAllAppointmentListById } from "../services/appointmentList";
import { fetchPatientById } from "../services/patients";
import { fetchAllAppointmentListPatients } from "../services/appointmentListPatients";
import "../pages/Home.scss";
import { queryClient } from "../App";
import { compareDate, convertDate, getWeek } from "../components/SelectDayContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function NumberOfPatient() {
  // const preRange = useRef(getWeek(new Date()));
  const [range, setRange] = useState(() => getWeek(new Date()));
  const [isShowModal, setIsShowModal] = useState(false);

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

  const getListAppointmentByWeek = (data) => {
    const finalData = data.filter(
      (item) =>
        compareDate(
          new Date(item?.appointmentList.scheduleDate.slice(0, 10)),
          range.from
        ) >= 0 &&
        compareDate(
          new Date(item?.appointmentList.scheduleDate.slice(0, 10)),
          range.to
        ) <= 0
    );
    return finalData;
  };

  const query3 = optionQuery("appointmentListWeek", getListAppointmentByWeek);

  const appointmentListPatientWeekQuery = useQuery(query3);

  const appointmentListPatientWeek = appointmentListPatientWeekQuery.data || [];

  const [dataMale, setDataMale] = useState([]);
  const [dataFemale, setDataFemale] = useState([]);

  useEffect(() => {
    const dataMale = [];
    const dataFemale = [];
    for (let i = 0; i < 7; ++i) {
      const cloneDay = new Date(range.from);
      // new Date(preRange.current.from);
      cloneDay.setDate(cloneDay.getDate() + i);
      const dayData = appointmentListPatientWeek.filter(
        (item) =>
          compareDate(
            new Date(item?.appointmentList?.scheduleDate.slice(0, 10)),
            cloneDay
          ) === 0
      );
      let seenIds = {};
      let finalDayData = [];
      dayData.forEach((item) => {
        let patientId = item.patient.id;
        if (!seenIds[patientId]) {
          seenIds[patientId] = true;
          finalDayData.push(item);
        }
      });
      dataMale.push(
        finalDayData.filter((item) => item?.patient?.gender === "Nam").length
      );
      dataFemale.push(
        finalDayData.filter((item) => item?.patient?.gender === "Nữ").length
      );
    }
    setDataMale(dataMale);
    setDataFemale(dataFemale);
  }, [appointmentListPatientWeek]);

  const dataOfChart = {
    labels: ["Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy", "CN"],
    datasets: [
      {
        data: [...dataMale],
        backgroundColor: "#3a57e8",
        borderWidth: 1,
        barThickness: 10,
        borderRadius: 10,
      },
      {
        data: [...dataFemale],
        backgroundColor: "#85f4fa",
        borderWidth: 1,
        barThickness: 9,
        borderRadius: 10,
      },
    ],
  };

  let maxValue = 1;
  for (let i = 0; i < 7; ++i) {
    if (dataMale[i] + dataFemale[i] > maxValue) {
      maxValue = dataMale[i] + dataFemale[i];
    }
  }

  const optionschart = {
    scales: {
      y: {
        max: maxValue,
        ticks: {
          maxTicksLimit: 2,
        },
        stacked: true,
      },
      x: {
        stacked: true,
      },
    },
    // responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const handleSelectedWeek = (day) => {
    setRange(() => {
      return getWeek(day);
    });
    setIsShowModal(!isShowModal);
  };

  const toggleModal = () => {
    setIsShowModal(!isShowModal);
  };

  // const handleShowChart = () => {
  //   queryClient.invalidateQueries({ queryKey: ["appointmentListWeek"] });
  //   setIsShowModal(!isShowModal);
  //   // preRange.current = range;
  // };
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["appointmentListWeek"] });
  }, [range]);

  return (
    <div
      className="overview-patient-ofday rounded-3 p-3"
      style={{ border: "1px solid #B9B9B9", marginLeft: "16px"}}
    >
      <label className="fw-bold text-dark">Số lượng bệnh nhân</label>
      <div className="overview-patient-chart">
        <Bar
          data={dataOfChart}
          options={optionschart}
          width={600}
          className="overview-chart"
        />
        <div className="chart-note">
          <div className="note">
            <p className="male">Nam</p>
          </div>
          <div className="note">
            <p className="female">Nữ</p>
          </div>
        </div>
      </div>
      <div className="weeks-selection">
        <p className="show-modal" onClick={toggleModal} style={{border: "1px solid #d5d5d5", color: "#555555"}}>
          {convertDate(range.from, range.to)}
          <FontAwesomeIcon
            className="weeks-icon"
            icon={faCaretDown}
          ></FontAwesomeIcon>
        </p>
        <input id="toggle-modal" type="checkbox" checked={isShowModal}></input>
        <div className="modal-calendar">
          <label
            className="modal-calendar-overlay"
            onClick={() => {
              toggleModal();
              // setRange(preRange.current);
            }}
          ></label>
          {isShowModal && (
            <div className="modal-calendar-content">
              <DayPicker
                locale={vi}
                weekStartsOn={1}
                defaultMonth={new Date()}
                selected={range}
                onDayClick={handleSelectedWeek}
                mode="range"
                showOutsideDays
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NumberOfPatient;
