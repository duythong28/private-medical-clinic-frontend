import * as React from "react";
import { useQuery } from "@tanstack/react-query";

import { useState, useLayoutEffect } from "react";
import dayjs from "dayjs";
import Card from "../../../components/Card";
import "./Revenue.scss";

import GridViewRevenue from "./GridViewRevenue";

import { fetchAllPatients } from "../../../services/patients";
import { fetchAllAppointmentList } from "../../../services/appointmentList";
import { fetchAllBills } from "../../../services/bill";

import { Bar, Line } from "react-chartjs-2";
import SelectTime from "../../../components/SelectTime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  faBorderAll,
  faCaretDown,
  faChartSimple,
} from "@fortawesome/free-solid-svg-icons";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Revenue() {
  const patientsQuery = useQuery({
    queryKey: ["patientlist"],
    queryFn: () => {
      return fetchAllPatients({ name: "", phoneNumber: "" });
    },
  });
  const patients = patientsQuery.data;

  const appointmentListsQuery = useQuery({
    queryKey: ["appointmentlist"],
    queryFn: () => {
      return fetchAllAppointmentList();
    },
  });
  const appointmentLists = appointmentListsQuery.data;

  const billsQuery = useQuery({
    queryKey: ["billlist"],
    queryFn: () => {
      return fetchAllBills();
    },
  });
  const bills = billsQuery.data;
  const ConvernToArray = (obj) => {
    let arr = [];
    if (obj != null)
      obj.map((apt) => {
        arr.push(apt);
      });
    return arr;
  };

  const aptList = ConvernToArray(appointmentLists);
  const billList = ConvernToArray(bills);
  const patientList = ConvernToArray(patients);

  const StringToDate = (str) => {
    if (str != null) {
      const date = new Date(str);
      return {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      };
    }
    return null;
  };
  const [valueTime, setValueTime] = React.useState(dayjs());
  const setNewTime = (value) => {
    setValueTime(value);
    if (timeOption === "Tuần") getDataForChartWeek(value);
    else if (timeOption === "Tháng") getDataForChartMonth(value);
  };
  const getWeekStartAndEnd = (selectedDay) => {
    const startOfWeek = selectedDay.startOf("week");
    const endOfWeek = startOfWeek.add(6, "days");
    return { start: startOfWeek, end: endOfWeek };
  };
  const [isOpenCalendar, setIsOpenCalendar] = React.useState(false);
  const handleOpenCalendar = (value) => {
    setIsOpenCalendar(value);
    setIsOpenTimeOption(false);
  };
  const [isOpenTimeOption, setIsOpenTimeOption] = React.useState(false);
  const handleOpenTimeOption = (value) => {
    setIsOpenCalendar(false);
    setIsOpenTimeOption(value);
  };
  const [timeOption, setTimeOption] = React.useState("Tuần");
  const handleSetTimeOption = (value, sV) => {
    setTimeOption(value);
    if (sV === 1) return;
    if (value === "Tuần") getDataForChartWeek(valueTime);
    else if (value === "Tháng") getDataForChartMonth(valueTime);
  };
  const [selectView, setSelectView] = useState(0);
  const handleSetSelectView = (value) => {
    setSelectView(value);
    if (value == 1) handleSetTimeOption("Tháng", 1);
    else handleSetTimeOption("Tuần", 0);
  };
  const formatDate = (date) => {
    const day = getWeekStartAndEnd(date);
    return {
      start: day.start.date(),
      ms: day.start.month() + 1,
      ys: day.start.year(),
      end: day.end.date(),
      me: day.end.month() + 1,
      ye: day.end.year(),
      month: date.month() + 1,
      year: date.year(),
    };
  };
  const displayTime = (date) => {
    const time = formatDate(date);
    if (timeOption == "Tuần") {
      return (
        time.start +
        "/" +
        time.ms +
        "/" +
        time.ys +
        " - " +
        time.end +
        "/" +
        time.me +
        "/" +
        time.ye
      );
    }
    if (timeOption == "Tháng") {
      if (selectView == 0) return time.year;
      else return "Thg " + time.month + " " + time.year;
    }
    if (timeOption == "Năm") {
      return time.year;
    }
  };
  const isLeapYear = (year) => {
    if (year % 4 !== 0) {
      return false;
    } else if (year % 100 === 0 && year % 400 !== 0) {
      return false;
    } else {
      return true;
    }
  };
  const getDayofMonth = (month, year) => {
    if (
      month === 1 ||
      month === 3 ||
      month === 5 ||
      month === 7 ||
      month === 8 ||
      month === 10 ||
      month === 12
    )
      return 31;
    if (month === 2) {
      if (isLeapYear(year)) return 29;
      return 28;
    }
    return 30;
  };
  const getLabelForChartWeek = (time) => {
    let arr = [];
    const date = formatDate(time);
    if (date.start < date.end) {
      for (let i = date.start; i <= date.end; i++)
        arr.push(i + "/" + date.month);
    } else {
      for (let i = date.start; i <= getDayofMonth(date.ms, date.ys); i++)
        arr.push(i + "/" + date.ms);
      for (let i = 1; i <= date.end; i++) arr.push(i + "/" + date.me);
    }
    return arr;
  };

  const getDataNewForChartWeek = (time) => {
    let newData1 = [];
    let newData2 = [];
    const date = formatDate(time);
    if (date.start < date.end) {
      for (let i = date.start; i <= date.end; i++) {
        let arr = [];
        let sum = 0;
        let cnt = 0;
        for (let j = 0; j < aptList.length; j++) {
          const tmp = StringToDate(aptList[j].scheduleDate);
          if (
            tmp.day === i &&
            tmp.month === date.month &&
            tmp.year === date.year
          ) {
            arr.push(aptList[j].id);
          }
        }
        for (let j = 0; j < billList.length; j++) {
          if (arr.includes(billList[j].appointmentListId)) {
            sum = sum + billList[j].drugExpense;
            cnt++;
          }
        }
        newData1.push(sum);
        newData2.push(cnt);
      }
    } else {
      for (let i = date.start; i <= getDayofMonth(date.ms, date.ys); i++) {
        let arr = [];
        let sum = 0;
        let cnt = 0;
        for (let j = 0; j < aptList.length; j++) {
          const tmp = StringToDate(aptList[j].scheduleDate);
          if (tmp.day === i && tmp.month === date.ms && tmp.year === date.ys)
            arr.push(aptList[j].id);
        }
        for (let j = 0; j < billList.length; j++) {
          if (arr.includes(billList[j].appointmentListId)) {
            sum = sum + billList[j].drugExpense;
            cnt++;
          }
        }
        newData1.push(sum);
        newData2.push(cnt);
      }

      for (let i = 1; i <= date.end; i++) {
        let arr = [];
        let sum = 0;
        let cnt = 0;
        for (let j = 0; j < aptList.length; j++) {
          const tmp = StringToDate(aptList[j].scheduleDate);
          if (tmp.day === i && tmp.month === date.me && tmp.year === date.ye)
            arr.push(aptList[j].id);
        }
        for (let j = 0; j < billList.length; j++) {
          if (arr.includes(billList[j].appointmentListId)) {
            sum = sum + billList[j].drugExpense;
            cnt++;
          }
        }
        newData1.push(sum);
        newData2.push(cnt);
      }
    }
    return {
      sum: newData2,
      count: newData1,
    };
  };
  const getDataNewForChartMonth = (time) => {
    let newData1 = [];
    let newData2 = [];
    const date = formatDate(time);
    for (let i = 1; i <= 12; i++) {
      let arr = [];
      let sum = 0;
      let cnt = 0;
      for (let j = 0; j < aptList.length; j++) {
        const tmp = StringToDate(aptList[j].scheduleDate);
        if (tmp.month === i && tmp.year === date.year) {
          arr.push(aptList[j].id);
        }
      }
      for (let j = 0; j < billList.length; j++) {
        if (arr.includes(billList[j].appointmentListId)) {
          sum = sum + billList[j].drugExpense;
          cnt++;
        }
      }
      newData1.push(sum);
      newData2.push(cnt);
    }

    return {
      sum: newData2,
      count: newData1,
    };
  };
  const getDataForChartWeek = (date) => {
    let tmp = chartData;
    tmp.labels = getLabelForChartWeek(date);
    const tmp2 = getDataNewForChartWeek(date);
    tmp.datasets = [
      {
        label: "Doanh thu",
        data: tmp2.count, // Replace with your variable 2 data
        backgroundColor: "red",
        borderWidth: 1,
        barThickness: 30,
        borderRadius: 2,
      },
    ];
    setChartData(tmp);
  };
  const getDataForChartMonth = (date) => {
    let tmp = chartData;
    tmp.labels = [
      "Thg 1",
      "Thg 2",
      "Thg 3",
      "Thg 4",
      "Thg 5",
      "Thg 6",
      "Thg 7",
      "Thg 8",
      "Thg 9",
      "Thg 10",
      "Thg 11",
      "Thg 12",
    ];
    const tmp2 = getDataNewForChartMonth(date);
    tmp.datasets = [
      {
        label: "Doanh thu",
        data: tmp2.count, // Replace with your variable 2 data
        backgroundColor: "red",
        borderWidth: 1,
        barThickness: 30,
        borderRadius: 2,
      },
    ];
    setChartData(tmp);
  };
  const [chartData, setChartData] = useState({
    labels: getLabelForChartWeek(valueTime), // Replace with your category labels
    datasets: [
      {
        label: "Doanh thu",
        data: getDataNewForChartWeek(valueTime).count, // Replace with your variable 2 data
        backgroundColor: "red",
        borderWidth: 1,
        barThickness: 30,
        borderRadius: 2,
      },
    ],
  });

  const optionschart = {
    title: {
      display: true,
      text: "Biểu đồ doanh thu 2 cột",
    },
    scales: {
      y: {
        ticks: {
          maxTicksLimit: 5,
        },
      },
    },
    plugins: {
      legend: {
        display: true, // Ẩn chú thích màu
      },
    },
    elements: {
      bar: {
        barThickness: 50, // Độ dày của cột màu
      },
    },
  };

  return (
    <Card>
      <div className=" w-100 h-100 overflow-hidden">
        <div className="position-relative">
          <div className="row">
            <div className="d-flex col-md-6 justify-content-start">
              <div className="select-box-3">
                <div
                  className="combobox"
                  onClick={() => handleOpenCalendar(!isOpenCalendar)}
                >
                  <p>{displayTime(valueTime)}</p>
                  <div className="icon">
                    <FontAwesomeIcon className="icon" icon={faCaretDown} />
                  </div>
                </div>
                {isOpenCalendar && (
                  <div className="calendar">
                    <SelectTime
                      setNewTime={setNewTime}
                      value={valueTime}
                    ></SelectTime>
                  </div>
                )}
              </div>
              <div className="select-box-2" style={{ marginLeft: "10px" }}>
                <div
                  className="combobox"
                  onClick={() => handleOpenTimeOption(!isOpenTimeOption)}
                >
                  <p>{timeOption}</p>
                  <div className="icon">
                    <FontAwesomeIcon className="icon" icon={faCaretDown} />
                  </div>
                </div>
                {isOpenTimeOption && selectView == 0 && (
                  <div className="select-time">
                    <div
                      className="item"
                      onClick={() => {
                        handleSetTimeOption("Tuần", selectView);
                        handleOpenTimeOption(false);
                      }}
                    >
                      <p>Tuần</p>
                    </div>
                    <div
                      className="item"
                      onClick={() => {
                        handleSetTimeOption("Tháng", selectView);
                        handleOpenTimeOption(false);
                      }}
                    >
                      <p>Tháng</p>
                    </div>
                    {/* <div className='item' onClick={() => {handleSetTimeOption('Năm');  handleOpenTimeOption(false)}}>
                                    <p>Năm</p>
                                </div> */}
                  </div>
                )}
                {isOpenTimeOption && selectView == 1 && (
                  <div className="select-time">
                    {/* <div className='item' onClick={() => {handleSetTimeOption('Tuần');  handleOpenTimeOption(false)}}>
                                    <p>Tuần</p>
                                </div> */}
                    <div
                      className="item"
                      onClick={() => {
                        handleSetTimeOption("Tháng", selectView);
                        handleOpenTimeOption(false);
                      }}
                    >
                      <p>Tháng</p>
                    </div>
                    <div
                      className="item"
                      onClick={() => {
                        handleSetTimeOption("Năm", selectView);
                        handleOpenTimeOption(false);
                      }}
                    >
                      <p>Năm</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="d-flex col-md-6 justify-content-end">
              <FontAwesomeIcon
                onClick={() => handleSetSelectView(0)}
                className="icon"
                icon={faChartSimple}
              />
              <FontAwesomeIcon
                onClick={() => handleSetSelectView(1)}
                className="icon"
                icon={faBorderAll}
              />
            </div>
          </div>
        </div>

        <div className="chart h-100">
          {selectView === 0 && <Bar data={chartData} options={optionschart} />}
          {selectView === 1 && (
            <GridViewRevenue
              date={formatDate(valueTime)}
              getDayOfMonth={getDayofMonth}
              aptList={aptList}
              billList={billList}
              timeOption={timeOption}
            ></GridViewRevenue>
          )}
        </div>
      </div>
    </Card>
  );
}

export default Revenue;
