import * as React from "react";
import { useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useState, useLayoutEffect } from "react";
import dayjs from "dayjs";
import Card from "../../../components/Card";
import "./Revenue.scss";

import GridViewRevenue from "./GridViewRevenue";

import { fetchAllPatients } from "../../../services/patients";
import { fetchAllAppointmentList } from "../../../services/appointmentList";
import { fetchAllBills } from "../../../services/bill";

import { Bar, Doughnut } from "react-chartjs-2";
import SelectTime from "../../../components/SelectTime";
import BillDetail from "./BillDetail";

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

let rememberWeek = dayjs();
let rememberMonth = dayjs();
let rememberYear = dayjs();
let rememberWeek2 = dayjs();
let rememberMonth2 = dayjs();
let rememberYear2 = dayjs();
let stopInitLoad = false;

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
  const appointmentLists = appointmentListsQuery.data || [];

  const billsQuery = useQuery({
    queryKey: ["bills"],
    queryFn: () => {
      return fetchAllBills();
    },
  });
  const bills = billsQuery.data || [];
  const ConvernToArray = (obj) => {
    let arr = [];
    if (obj != null)
      obj.map((apt) => {
        arr.push(apt);
      });
    return arr;
  };

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
  };
  const [valueTime2, setValueTime2] = React.useState(dayjs());
  const setNewTime2 = (value) => {
    setValueTime2(value);
    if (timeOption2 === "Tuần") {
      getDataForChartWeek(value);
      setNewDataForDonutChart(value, "Week");
    } else if (timeOption2 === "Tháng") {
      getDataForChartMonth(value);
      setNewDataForDonutChart(value, "Month");
    } else {
      getDataForChartYear(value);
      setNewDataForDonutChart(value, "Year");
    }
  };
  const getFirstDayOfWeek = (date) => {
    const startOfWeek = dayjs(date).startOf("week");
    if (startOfWeek.day() === 0) {
      return startOfWeek.add(1, "day");
    }
    return startOfWeek;
  };
  const getWeekStartAndEnd = (selectedDay) => {
    const startOfWeek = getFirstDayOfWeek(selectedDay);
    const endOfWeek = startOfWeek.add(6, "days");
    return { start: startOfWeek, end: endOfWeek };
  };
  const [isOpenCalendar, setIsOpenCalendar] = React.useState(false);
  const handlerSetNewTime = (value) => {
    setNewTime(value);
    setIsOpenCalendar(false);
  };
  const handleOpenCalendar = (value) => {
    setIsOpenCalendar(value);
    setIsOpenTimeOption(false);
  };
  const [isOpenCalendar2, setIsOpenCalendar2] = React.useState(false);
  const handlerSetNewTime2 = (value) => {
    setNewTime2(value);
    setIsOpenCalendar2(false);
  };
  const handleOpenCalendar2 = (value) => {
    setIsOpenCalendar2(value);
    setIsOpenTimeOption2(false);
  };
  const [isOpenTimeOption2, setIsOpenTimeOption2] = React.useState(false);
  const handleOpenTimeOption2 = (value) => {
    setIsOpenCalendar2(false);
    setIsOpenTimeOption2(value);
  };
  const [isOpenTimeOption, setIsOpenTimeOption] = React.useState(false);
  const handleOpenTimeOption = (value) => {
    setIsOpenCalendar(false);
    setIsOpenTimeOption(value);
  };
  const [timeOption, setTimeOption] = React.useState("Tuần");
  const handleSetTimeOption = (value) => {
    if (timeOption === "Tuần") rememberWeek = valueTime;
    else if (timeOption === "Tháng") rememberMonth = valueTime;
    else rememberYear = valueTime;
    setTimeOption(value);
    if (value === "Tuần") setValueTime(rememberWeek);
    else if (value === "Tháng") setValueTime(rememberMonth);
    else setValueTime(rememberYear);
  };

  const [timeOption2, setTimeOption2] = React.useState("Tuần");
  const handleSetTimeOption2 = (value) => {
    if (timeOption2 === "Tuần") rememberWeek2 = valueTime2;
    else if (timeOption2 === "Tháng") rememberMonth2 = valueTime2;
    else rememberYear2 = valueTime2;
    setTimeOption2(value);
    if (value === "Tuần") setValueTime2(rememberWeek2);
    else if (value === "Tháng") setValueTime2(rememberMonth2);
    else setValueTime2(rememberYear2);
    if (value === "Tuần") {
      getDataForChartWeek(rememberWeek2);
      setNewDataForDonutChart(rememberWeek2, "Week");
    } else if (value === "Tháng") {
      getDataForChartMonth(rememberMonth2);
      setNewDataForDonutChart(rememberMonth2, "Month");
    } else {
      getDataForChartYear(rememberYear2);
      setNewDataForDonutChart(rememberYear2, "Month");
    }
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
  const displayTime2 = (date) => {
    const time = formatDate(date);
    if (timeOption2 == "Tuần") {
      return (
        time.start +
        "/" +
        time.ms +
        " - " +
        time.end +
        "/" +
        time.me +
        "/" +
        time.ye
      );
    }
    if (timeOption2 == "Tháng") {
      return "Thg " + time.month + " " + time.year;
    }
    if (timeOption2 == "Năm") {
      return time.year;
    }
  };
  const displayTime = (date) => {
    const time = formatDate(date);
    if (timeOption == "Tuần") {
      return (
        time.start +
        "/" +
        time.ms +
        " - " +
        time.end +
        "/" +
        time.me +
        "/" +
        time.ye
      );
    }
    if (timeOption == "Tháng") {
      return "Thg " + time.month + " " + time.year;
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
      for (let i = date.start; i <= date.end; i++) arr.push(i);
    } else {
      for (let i = date.start; i <= getDayofMonth(date.ms, date.ys); i++)
        arr.push(i);
      for (let i = 1; i <= date.end; i++) arr.push(i);
    }
    return arr;
  };
  const getLabelForChartMonth = (time) => {
    let arr = [];
    const date = formatDate(time);
    for (let i = 1; i <= getDayofMonth(date.month, date.year); i++) {
      arr.push(i);
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
        for (let j = 0; j < appointmentLists.length; j++) {
          const tmp = StringToDate(appointmentLists[j].scheduleDate);
          if (
            tmp.day === i &&
            tmp.month === date.month &&
            tmp.year === date.year
          ) {
            arr.push(appointmentLists[j].id);
          }
        }
        for (let j = 0; j < bills.length; j++) {
          if (arr.includes(bills[j].appointmentListId)) {
            sum = sum + bills[j].drugExpense + bills[j].feeConsult;
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
        for (let j = 0; j < appointmentLists.length; j++) {
          const tmp = StringToDate(appointmentLists[j].scheduleDate);
          if (tmp.day === i && tmp.month === date.ms && tmp.year === date.ys)
            arr.push(appointmentLists[j].id);
        }
        for (let j = 0; j < bills.length; j++) {
          if (arr.includes(bills[j].appointmentListId)) {
            sum = sum + bills[j].drugExpense + bills[j].feeConsult;
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
        for (let j = 0; j < appointmentLists.length; j++) {
          const tmp = StringToDate(appointmentLists[j].scheduleDate);
          if (tmp.day === i && tmp.month === date.me && tmp.year === date.ye)
            arr.push(appointmentLists[j].id);
        }
        for (let j = 0; j < bills.length; j++) {
          if (arr.includes(bills[j].appointmentListId)) {
            sum = sum + bills[j].drugExpense + bills[j].feeConsult;
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
  const getDataNewForChartYear = (time) => {
    let newData1 = [];
    let newData2 = [];

    const date = formatDate(time);
    for (let i = 1; i <= 12; i++) {
      let arr = [];
      let sum = 0;
      let cnt = 0;
      for (let j = 0; j < appointmentLists.length; j++) {
        const tmp = StringToDate(appointmentLists[j].scheduleDate);
        if (tmp.month === i && tmp.year === date.year) {
          arr.push(appointmentLists[j].id);
        }
      }
      for (let j = 0; j < bills.length; j++) {
        if (arr.includes(bills[j].appointmentListId)) {
          sum = sum + bills[j].drugExpense + bills[j].feeConsult;
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
  const getDataNewForChartMonth = (time) => {
    let newData1 = [];
    let newData2 = [];

    const date = formatDate(time);
    for (let i = 1; i <= getDayofMonth(date.month, date.year); i++) {
      let arr = [];
      let sum = 0;
      let cnt = 0;
      for (let j = 0; j < appointmentLists.length; j++) {
        const tmp = StringToDate(appointmentLists[j].scheduleDate);
        if (
          tmp.day === i &&
          tmp.month == date.month &&
          tmp.year === date.year
        ) {
          arr.push(appointmentLists[j].id);
        }
      }
      for (let j = 0; j < bills.length; j++) {
        if (arr.includes(bills[j].appointmentListId)) {
          sum = sum + bills[j].drugExpense + bills[j].feeConsult;
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
        backgroundColor: "#3A57E8",
        borderWidth: 1,
        barThickness: 10,
        borderRadius: 50,
      },
    ];
    setChartData(tmp);
  };
  const getDataForChartMonth = (date) => {
    let tmp = chartData;
    tmp.labels = getLabelForChartMonth(date);
    const tmp2 = getDataNewForChartMonth(date);
    tmp.datasets = [
      {
        label: "Doanh thu",
        data: tmp2.count, // Replace with your variable 2 data
        backgroundColor: "#3A57E8",
        borderWidth: 1,
        barThickness: 10,
        borderRadius: 50,
      },
    ];
    setChartData(tmp);
  };
  const getDataForChartYear = (date) => {
    let tmp = chartData;
    tmp.labels = [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
    ];
    const tmp2 = getDataNewForChartYear(date);
    tmp.datasets = [
      {
        label: "Doanh thu",
        data: tmp2.count, // Replace with your variable 2 data
        backgroundColor: "#3A57E8",
        borderWidth: 1,
        barThickness: 10,
        borderRadius: 50,
      },
    ];
    setChartData(tmp);
  };
  React.useEffect(() => {
    setChartData({
      labels: getLabelForChartWeek(valueTime), // Replace with your category labels
      datasets: [
        {
          label: "Doanh thu",
          data: getDataNewForChartWeek(valueTime).count, // Replace with your variable 2 data
          backgroundColor: "#3A57E8",
          borderWidth: 1,
          barThickness: 10,
          borderRadius: 50,
        },
      ],
    });
    setNewDataForDonutChart(valueTime2, "Week");
  }, [bills]);

  // React.useEffect(()=>{
  //     if(appointmentLists.length > 0)
  //     {
  //       setChartData({
  //         labels: getLabelForChartWeek(valueTime), // Replace with your category labels
  //         datasets: [
  //           {
  //             label: "Doanh thu",
  //             data: getDataNewForChartWeek(valueTime).count, // Replace with your variable 2 data
  //             backgroundColor: "#3983fa",
  //             borderWidth: 1,
  //             barThickness: 10,
  //             borderRadius: 50,
  //           },
  //         ],
  //       })
  //       stopInitLoad = true;
  //     }
  // }, [appointmentLists])

  const [chartData, setChartData] = useState({
    labels: getLabelForChartWeek(valueTime), // Replace with your category labels
    datasets: [
      {
        label: "Doanh thu",
        data: getDataNewForChartWeek(valueTime).count, // Replace with your variable 2 data
        backgroundColor: "#3983fa",
        borderWidth: 1,
        barThickness: 10,
        borderRadius: 50,
      },
    ],
  });
  function formatNumberY(number) {
    if (number <= 999) return number;
    if (number <= 999999) return Math.floor(number / 1000) + "K";
    if (number <= 999999999) {
      if (Math.floor(number / 1000000) >= 100)
        return Math.floor(number / 1000000) + "M";
      else
        return (
          Math.floor(number / 1000000) +
          "," +
          Math.floor((number % 1000000) / 100000) +
          "M"
        );
    }
    if (number <= 999999999999) {
      if (Math.floor(number / 1000000000) >= 100)
        return Math.floor(number / 1000000000) + "B";
      else
        return (
          Math.floor(number / 1000000000) +
          "," +
          Math.floor((number % 1000000000) / 100000000) +
          "B"
        );
    }
    if (number <= 999999999999999) {
      if (Math.floor(number / 1000000000000) >= 100)
        return Math.floor(number / 1000000000000) + "T";
      else
        return (
          Math.floor(number / 1000000000000) +
          "," +
          Math.floor((number % 1000000000000) / 100000000000) +
          "T"
        );
    }
  }

  const optionschart = {
    title: {
      display: false,
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 16,
        },
      },
      y: {
        ticks: {
          maxTicksLimit: 5,
          callback: function (value, index, values) {
            return formatNumberY(value); // Format x-axis labels as well
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Ẩn chú thích màu
      },
    },
    elements: {
      bar: {
        barThickness: 50, // Độ dày của cột màu
      },
    },
  };
  function formatMoney(number) {
    const strNumber = String(number);
    const parts = strNumber.split(/(?=(?:\d{3})+(?!\d))/);
    const formattedNumber = parts.join(".");
    return formattedNumber;
  }

  // DONUT CHART CHART -----------
  const data = {
    labels: ["Tiền khám", "Tiền thuốc"],
    datasets: [
      {
        // label: "Doanh thu",
        data: [20, 10],
        backgroundColor: ["rgba(58, 87, 232, 0.2)", "rgba(133, 244, 250, 0.2)"],
        borderColor: ["rgba(58, 87, 232, 1)", "rgba(133, 244, 250, 1)"],
        borderWidth: 1,
      },
    ],
  };

  const [isSetAvailable, setIsSetAvailable] = useState(true);
  const [dataDonut, setDataDonut] = useState({
    labels: ["Tiền khám", "Tiền thuốc"],
    datasets: [
      {
        // label: "Doanh thu",
        data: [20, 10],
        backgroundColor: ["rgba(133, 244, 250, 0.2)", "rgba(58, 87, 232, 0.2)"],
        borderColor: ["rgba(133, 244, 250, 1)", "rgba(58, 87, 232, 1)"],
        borderWidth: 1,
      },
    ],
  });
  const [donutText, setDonutText] = useState("Doanh thu");
  const [donutCost, setDonutCost] = useState(
    dataDonut.datasets[0].data[0] + dataDonut.datasets[0].data[1]
  );
  const [donutColor, setDonutColor] = useState("#555555");
  const [totalDonutCost, setTotalDonutCost] = useState(0);

  const optionsDn = {
    plugins: {
      tooltip: {
        enabled: false, // Tắt tooltip
      },
      legend: {
        display: false, // Ẩn chú thích màu
      },
    },
    responsive: true,
    onHover: (event, elements) => {
      if (elements.length && isSetAvailable) {
        const hoveredElementIndex = elements[0].index;
        const label = dataDonut.labels[hoveredElementIndex];
        const value = dataDonut.datasets[0].data[hoveredElementIndex];
        setDonutText(label);
        setDonutCost(value);
        // console.log("cost3",value);

        if (hoveredElementIndex == 0) setDonutColor("#85f4fa");
        else setDonutColor("#3a57e8");
      } else {
        setDonutColor("#555555");
        setDonutText("Doanh thu");
        setDonutCost(
          dataDonut.datasets[0].data[0] + dataDonut.datasets[0].data[1]
        );
        // console.log("cost1",dataDonut.datasets[0].data[0] + dataDonut.datasets[0].data[1]);
      }
    },
  };
  const chartRef = useRef(null);
  useEffect(() => {
    const chartInstance = chartRef.current;
    if (chartInstance) {
      const canvas = chartInstance.canvas;
      const handleMouseOut = () => {
        setIsSetAvailable(false);
        setDonutColor("#555555");
        setDonutText("Doanh thu");
        const newData = getDataForDonutChart(valueTime2, timeOption2);
        setDonutCost(newData.sumDrug + newData.sumFee);
        console.log("cost4", newData.sumDrug + newData.sumFee);
      };

      canvas.addEventListener("mouseout", handleMouseOut);

      return () => {
        canvas.removeEventListener("mouseout", handleMouseOut);
      };
    }
  }, [chartRef, appointmentLists, bills]);
  useEffect(() => {
    const chartInstance = chartRef.current;
    if (chartInstance) {
      const canvas = chartInstance.canvas;
      const handleMouseOver = () => {
        setIsSetAvailable(true);
      };
      canvas.addEventListener("mouseover", handleMouseOver);
      return () => {
        canvas.removeEventListener("mouseover", handleMouseOver);
      };
    }
  }, [chartRef]);
  function formatMoneyForDonutChart(number) {
    if (number <= 999999999) return formatMoney(number);

    if (number <= 999999999999) {
      if (Math.floor(number / 1000000000) >= 100)
        return Math.floor(number / 1000000000) + "B";
      else
        return (
          Math.floor(number / 1000000000) +
          "," +
          Math.floor((number % 1000000000) / 100000000) +
          "B"
        );
    }
    if (number <= 999999999999999) {
      if (Math.floor(number / 1000000000000) >= 100)
        return Math.floor(number / 1000000000000) + "T";
      else
        return (
          Math.floor(number / 1000000000000) +
          "," +
          Math.floor((number % 1000000000000) / 100000000000) +
          "T"
        );
    }
  }

  // GET DATA FOR DOUGHNUT CHART
  const setNewDataForDonutChart = (time, option) => {
    const newData = getDataForDonutChart(time, option);
    setDonutText("Doanh thu");
    setDonutCost(newData.sumDrug + newData.sumFee);
    // console.log("cost2",newData.sumDrug + newData.sumFee);

    setDonutColor("#555555");
    setDataDonut({
      labels: ["Tiền khám", "Tiền thuốc"],
      datasets: [
        {
          label: "Doanh thu",
          data: [newData.sumFee, newData.sumDrug],
          backgroundColor: [
            "rgba(133, 244, 250, 0.2)",
            "rgba(58, 87, 232, 0.2)",
          ],
          borderColor: ["rgba(133, 244, 250, 1)", "rgba(58, 87, 232, 1)"],
          borderWidth: 1,
        },
      ],
    });
  };
  const getDataForDonutChart = (time, option) => {
    let arr = [];
    let sumFee = 0;
    let sumDrug = 0;
    const date = formatDate(time);
    if (option == "Month") {
      const cntDay = getDayofMonth(date.month, date.year);
      for (let i = 0; i < appointmentLists.length; i++) {
        const tmp = StringToDate(appointmentLists[i].scheduleDate);
        if (
          1 <= tmp.day &&
          tmp.day <= cntDay &&
          tmp.month == date.month &&
          tmp.year == date.year
        ) {
          arr.push(appointmentLists[i].id);
        }
      }
    } else if (option == "Year") {
      for (let i = 0; i < appointmentLists.length; i++) {
        const tmp = StringToDate(appointmentLists[i].scheduleDate);
        if (1 <= tmp.month && tmp.month <= 12 && tmp.year == date.year) {
          arr.push(appointmentLists[i].id);
        }
      }
    } else {
      for (let i = 0; i < appointmentLists.length; i++) {
        const tmp = StringToDate(appointmentLists[i].scheduleDate);
        if (
          (date.ms == date.me &&
            date.start <= tmp.day &&
            tmp.day <= date.end &&
            tmp.month == date.month &&
            tmp.year == date.year) ||
          (date.ms != date.me &&
            ((date.start <= tmp.day &&
              tmp.month == date.ms &&
              tmp.year == date.ys) ||
              (tmp.day <= date.end &&
                tmp.month == date.me &&
                tmp.year == date.ye)))
        ) {
          arr.push(appointmentLists[i].id);
        }
      }
    }
    for (let j = 0; j < bills.length; j++) {
      if (arr.includes(bills[j].appointmentListId)) {
        sumFee = sumFee + bills[j].feeConsult;
        sumDrug = sumDrug + bills[j].drugExpense;
      }
    }
    return {
      sumFee: sumFee,
      sumDrug: sumDrug,
    };
  };

  // BILL DETAILS
  const [selectedBill, setSelectedBill] = useState({});
  const [isOpenBillDetail, setIsOpenBillDetail] = useState(false);
  const handleSetSelectedBill = (newValue) => {
    setSelectedBill(newValue);
    setIsOpenBillDetail(true);
  };
  return (
    <div className="d-flex flex-row w-100 h-100 maincontainer p-3">
      {isOpenBillDetail && (
        <div className=" bill-detail">
          <BillDetail
            bills={bills}
            appointmentLists={appointmentLists}
            timeoption={timeOption}
            date={selectedBill}
            setIsOpenBillDetail={setIsOpenBillDetail}
          ></BillDetail>
        </div>
      )}
      <div className="col-md-8">
        <Card style={{ padding: "0rem 1rem 0rem 0rem" }}>
          <div className=" w-100 h-100 overflow-hidden">
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
                      timeOption={timeOption}
                      handlerSetNewTime={handlerSetNewTime}
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
                {isOpenTimeOption && (
                  <div className="select-time">
                    <div
                      className="item"
                      onClick={() => {
                        handleSetTimeOption("Tuần");
                        handleOpenTimeOption(false);
                      }}
                    >
                      <p>Tuần</p>
                    </div>
                    <div
                      className="item"
                      onClick={() => {
                        handleSetTimeOption("Tháng");
                        handleOpenTimeOption(false);
                      }}
                    >
                      <p>Tháng</p>
                    </div>
                    <div
                      className="item"
                      onClick={() => {
                        handleSetTimeOption("Năm");
                        handleOpenTimeOption(false);
                      }}
                    >
                      <p>Năm</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="w-100 h-100">
              <div className="chart ">
                <GridViewRevenue
                  date={formatDate(valueTime)}
                  getDayOfMonth={getDayofMonth}
                  appointmentLists={appointmentLists}
                  bills={bills}
                  timeOption={timeOption}
                  handleSetSelectedBill={handleSetSelectedBill}
                  setIsOpenBillDetail={setIsOpenBillDetail}
                ></GridViewRevenue>
              </div>
            </div>
          </div>
        </Card>
      </div>
      <div className="col-md-4 d-flex flex-column">
        <div className="row">
          <Card style={{ padding: "0rem 0rem 1rem 0rem" }}>
            <div className="chartbar-area">
              <div className="option-time-chart">
                <div className="d-flex justify-content-between">
                  <label className="fw-bold text-dark">Doanh thu</label>
                  <div className="row">
                    <div className="select-box-4">
                      <div
                        className="combobox-chart"
                        onClick={() => handleOpenCalendar2(!isOpenCalendar2)}
                      >
                        <p>{displayTime2(valueTime2)}</p>
                        <div className="icon">
                          <FontAwesomeIcon
                            className="icon"
                            icon={faCaretDown}
                          />
                        </div>
                      </div>
                      {isOpenCalendar2 && (
                        <div className="calendar">
                          <SelectTime
                            setNewTime={setNewTime2}
                            value={valueTime2}
                            timeOption={timeOption2}
                            handlerSetNewTime={handlerSetNewTime2}
                          ></SelectTime>
                        </div>
                      )}
                    </div>
                    <div
                      className="select-box-5"
                      style={{ marginLeft: "10px" }}
                    >
                      <div
                        className="combobox"
                        onClick={() =>
                          handleOpenTimeOption2(!isOpenTimeOption2)
                        }
                      >
                        <p>{timeOption2}</p>
                        <div className="icon">
                          <FontAwesomeIcon
                            className="icon"
                            icon={faCaretDown}
                          />
                        </div>
                      </div>
                      {isOpenTimeOption2 && (
                        <div className="select-time">
                          <div
                            className="item"
                            onClick={() => {
                              handleSetTimeOption2("Tuần");
                              handleOpenTimeOption2(false);
                            }}
                          >
                            <p>Tuần</p>
                          </div>
                          <div
                            className="item"
                            onClick={() => {
                              handleSetTimeOption2("Tháng");
                              handleOpenTimeOption2(false);
                            }}
                          >
                            <p>Tháng</p>
                          </div>
                          <div
                            className="item"
                            onClick={() => {
                              handleSetTimeOption2("Năm");
                              handleOpenTimeOption2(false);
                            }}
                          >
                            <p>Năm</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <Bar data={chartData} options={optionschart} />
            </div>
          </Card>
        </div>
        <div className="row h-100">
          <Card>
            <label className="fw-bold text-dark">Chi tiết doanh thu</label>
            <div className="chartdonut-area">
              <div className="donut-chart">
                <div className="Chart">
                  <Doughnut
                    ref={chartRef}
                    className="Donut"
                    data={dataDonut}
                    options={optionsDn}
                  ></Doughnut>
                  <div className="Text-doughnut">
                    <p>{donutText}</p>
                    <p>{formatMoneyForDonutChart(donutCost)}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Revenue;
