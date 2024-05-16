import Card from "../../../components/Card";
import TableHeader from "../../../components/TableHeader";
import TableBody from "../../../components/TableBody";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBorderAll,
  faCaretDown,
  faChartSimple,
  faEye,
  faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import SelectTime from "../../../components/SelectTime";
import * as React from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import { fetchAllAppointmentList } from "../../../services/appointmentList";
import { fetchAllAppointmentRecordDetails } from "../../../services/appointmentRecordDetails";
import { fetchAllAppointmentRecords } from "../../../services/appointmentRecords";

import { useRef, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { queryClient } from "../../../App";
import "./Medicine.scss";
import { fetchAllDrugs, fetchDrugById } from "../../../services/drugs";
import { fetchAllUnit } from "../../../services/units";
import Chart from "chart.js/auto";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { da } from "date-fns/locale";
ChartJS.register(CategoryScale, LinearScale, Title, Tooltip, Legend);

let rememberWeek = dayjs();
let rememberMonth = dayjs();
let rememberYear = dayjs();
let rememberWeek2 = dayjs();
let rememberMonth2 = dayjs();
let rememberYear2 = dayjs();
let stopInitLoad = false;
let setFirstDrug = false;
function Medicine() {
  const drugsQuery = useQuery({
    queryKey: ["drugs"],
    queryFn: () => {
      return fetchAllDrugs({});
    },
  });

  const drugs = drugsQuery.data || [];

  const [listState, setListState] = useState([]);

  const unitsQuery = useQuery({
    queryKey: ["units"],
    queryFn: fetchAllUnit,
  });

  const unitState = unitsQuery.data || [];
  function getUnitName({ id }) {
    if (unitState == null) return;
    const res = unitState.filter((unit) => unit.id === id)[0];
    return res?.unitName || "";
  }

  useEffect(() => {
    setListState(() => drugs);
  }, [drugs]);

  const recorddtQuery = useQuery({
    queryKey: ["recorddetaillist"],
    queryFn: () => {
      return fetchAllAppointmentRecordDetails();
    },
  });
  const recorddt = recorddtQuery.data || [];
  const recordQuery = useQuery({
    queryKey: ["recordlist"],
    queryFn: () => {
      return fetchAllAppointmentRecords();
    },
  });
  const record = recordQuery.data || [];
  const appointmentQuery = useQuery({
    queryKey: ["appointmentlist"],
    queryFn: () => {
      return fetchAllAppointmentList();
    },
  });
  const appointment = appointmentQuery.data || [];
  const billsQuery = useQuery({
    queryKey: ["billlist"],
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

  const billList = ConvernToArray(bills) || [];

  function searchHandler(event) {
    const textSearch = event.target.value.toLowerCase().trim();
    const result = drugs.filter((drug) =>
      drug.drugName.toLowerCase().includes(textSearch)
    );
    setListState(() => result);
  }

  const [selectItem, setSelectItem] = useState(drugs[0]);
  const setDetailItem = (item) => {
    setSelectItem(item);
    console.log("item", item);
    if (timeOption == "Tuần") getDataForChartWeek(valueTime, item);
    else if (timeOption == "Tháng") getDataForChartMonth(valueTime, item);
    else getDataForChartYear(valueTime, item);
  };
  useEffect(() => {
    setSelectItem(drugs[0]);
    getDataForChartWeek(valueTime, drugs[0]);
  }, [drugs]);
  useEffect(() => {
    console.log("item", selectItem);
    getDataForChartWeek(valueTime, selectItem);
  }, [drugs, appointment, record, recorddt]);
  // Select Time
  const [valueTime, setValueTime] = React.useState(dayjs());
  const setNewTime = (value) => {
    setValueTime(value);
    if (timeOption == "Tuần") getDataForChartWeek(value, selectItem);
    else if (timeOption == "Tháng") getDataForChartMonth(value, selectItem);
    else getDataForChartYear(value, selectItem);
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
  const handleOpenCalendar = (value) => {
    setIsOpenCalendar(value);
    setIsOpenTimeOption(false);
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
    if (value === "Tuần") getDataForChartWeek(rememberWeek, selectItem);
    else if (value === "Tháng") getDataForChartMonth(rememberMonth, selectItem);
    else getDataForChartYear(rememberYear, selectItem);
  };
  const [isOpenTimeOption, setIsOpenTimeOption] = React.useState(false);
  const handleOpenTimeOption = (value) => {
    setIsOpenCalendar(false);
    setIsOpenTimeOption(value);
  };
  const countDrugInRecord = (month, year, item) => {
    let arrApt = [];
    let count = 0;
    for (let j = 0; j < appointment.length; j++) {
      const tmp = StringToDate(appointment[j].scheduleDate);
      if ((month == -1 || tmp.month === month) && tmp.year === year)
        arrApt.push(appointment[j].id);
    }
    let arrRec = [];
    for (let j = 0; j < record.length; j++) {
      if (arrApt.includes(record[j].appointmentListId))
        arrRec.push(record[j].id);
    }
    for (let j = 0; j < recorddt.length; j++) {
      if (arrRec.includes(recorddt[j].appointmentRecordId)) {
        if (recorddt[j].drugId === item.id) {
          count += recorddt[j].count;
        }
      }
    }
    return count;
  };

  const countDrugInRecordWeek = (time, item) => {
    let arrApt = [];
    let count = 0;
    const date = formatDate(time);
    if (date.ms != date.ms) {
      for (let j = 0; j < appointment.length; j++) {
        const tmp = StringToDate(appointment[j].scheduleDate);
        if (
          (tmp.month === date.ms &&
            tmp.year === date.ys &&
            tmp.day >= date.start) ||
          (tmp.month === date.me && tmp.year === date.ye && tmp.day <= date.end)
        )
          arrApt.push(appointment[j].id);
      }
    } else {
      for (let j = 0; j < appointment.length; j++) {
        const tmp = StringToDate(appointment[j].scheduleDate);
        if (
          tmp.month === date.month &&
          tmp.year === date.year &&
          tmp.day >= date.start &&
          tmp.day <= date.end
        )
          arrApt.push(appointment[j].id);
      }
    }
    let arrRec = [];
    for (let j = 0; j < record.length; j++) {
      if (arrApt.includes(record[j].appointmentListId))
        arrRec.push(record[j].id);
    }

    for (let j = 0; j < recorddt.length; j++) {
      if (arrRec.includes(recorddt[j].appointmentRecordId)) {
        if (recorddt[j].drugId === item.id) {
          count += recorddt[j].count;
        }
      }
    }
    return count;
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
  };
  const displayTime3 = (date) => {
    const time = formatDate(date);
    if (timeOption == "Tuần") return displayTime(date);
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

  const getDataNewForChartWeek = (time, item) => {
    const date = formatDate(time);
    let newData = [];
    if (date.start < date.end) {
      for (let i = date.start; i <= date.end; i++) {
        let arrApt = [];
        let count = 0;
        for (let j = 0; j < appointment.length; j++) {
          const tmp = StringToDate(appointment[j].scheduleDate);
          if (
            tmp.day === i &&
            tmp.month === date.month &&
            tmp.year === date.year
          )
            arrApt.push(appointment[j].id);
        }
        let arrRec = [];
        for (let j = 0; j < record.length; j++) {
          if (arrApt.includes(record[j].appointmentListId))
            arrRec.push(record[j].id);
        }
        for (let j = 0; j < recorddt.length; j++) {
          if (arrRec.includes(recorddt[j].appointmentRecordId)) {
            if (recorddt[j]?.drugId == item?.id) {
              count = count + recorddt[j].count;
            }
          }
        }
        newData.push(count);
      }
    } else {
      for (let i = date.start; i <= getDayofMonth(date.ms, date.ys); i++) {
        let arrApt = [];
        let count = 0;
        for (let j = 0; j < appointment.length; j++) {
          const tmp = StringToDate(appointment[j].scheduleDate);
          if (tmp.day === i && tmp.month === date.ms && tmp.year === date.ye)
            arrApt.push(appointment[j].id);
        }
        let arrRec = [];
        for (let j = 0; j < record.length; j++) {
          if (arrApt.includes(record[j].appointmentListId))
            arrRec.push(record[j].id);
        }

        for (let j = 0; j < recorddt.length; j++) {
          if (arrRec.includes(recorddt[j].appointmentRecordId)) {
            if (recorddt[j].drugId == item?.id) {
              count = count + recorddt[j].count;
            }
          }
        }
        newData.push(count);
      }
      for (let i = 1; i <= date.end; i++) {
        let arrApt = [];
        let count = 0;
        for (let j = 0; j < appointment.length; j++) {
          const tmp = StringToDate(appointment[j].scheduleDate);
          if (tmp.day === i && tmp.month === date.me && tmp.year === date.ye)
            arrApt.push(appointment[j].id);
        }
        let arrRec = [];
        for (let j = 0; j < record.length; j++) {
          if (arrApt.includes(record[j].appointmentListId))
            arrRec.push(record[j].id);
        }
        for (let j = 0; j < recorddt.length; j++) {
          if (arrRec.includes(recorddt[j].appointmentRecordId)) {
            if (recorddt[j].drugId == item.id) {
              count = count + recorddt[j].count;
            }
          }
        }
        newData.push(count);
      }
    }
    return newData;
  };
  const getDataForChartWeek = (date, item) => {
    let tmp = chartData;
    tmp.labels = getLabelForChartWeek(date);
    const tmp2 = getDataNewForChartWeek(date, item);
    tmp.datasets = [
      {
        label: "Số lượng bán ra",
        data: tmp2,
        backgroundColor: "#3983fa",
        borderWidth: 1,
        barThickness: 10,
        borderRadius: 50,
      },
    ];
    setChartData(tmp);
  };
  const getDataNewForChartMonth = (time, item) => {
    const date = formatDate(time);
    let newData = [];
    for (let i = 1; i <= getDayofMonth(date.month, date.year); i++) {
      let arrApt = [];
      let count = 0;
      for (let j = 0; j < appointment.length; j++) {
        const tmp = StringToDate(appointment[j].scheduleDate);
        if (tmp.day === i && tmp.month === date.month && tmp.year === date.year)
          arrApt.push(appointment[j].id);
      }
      let arrRec = [];
      for (let j = 0; j < record.length; j++) {
        if (arrApt.includes(record[j].appointmentListId))
          arrRec.push(record[j].id);
      }
      for (let j = 0; j < recorddt.length; j++) {
        if (arrRec.includes(recorddt[j].appointmentRecordId)) {
          if (recorddt[j].drugId == item.id) {
            count = count + recorddt[j].count;
          }
        }
      }
      newData.push(count);
    }
    return newData;
  };
  const getDataForChartMonth = (date, item) => {
    let tmp = chartData;
    tmp.labels = getLabelForChartMonth(date);
    const tmp2 = getDataNewForChartMonth(date, item);
    tmp.datasets = [
      {
        label: "Số lượng bán ra",
        data: tmp2,
        backgroundColor: "#3983fa",
        borderWidth: 1,
        barThickness: 10,
        borderRadius: 50,
      },
    ];
    setChartData(tmp);
  };
  const getDataNewForChartYear = (time, item) => {
    const date = formatDate(time);
    let newData = [];
    for (let i = 1; i <= 12; i++) {
      let arrApt = [];
      let count = 0;
      for (let j = 0; j < appointment.length; j++) {
        const tmp = StringToDate(appointment[j].scheduleDate);
        if (tmp.month === i && tmp.year === date.year)
          arrApt.push(appointment[j].id);
      }
      let arrRec = [];
      for (let j = 0; j < record.length; j++) {
        if (arrApt.includes(record[j].appointmentListId))
          arrRec.push(record[j].id);
      }
      for (let j = 0; j < recorddt.length; j++) {
        if (arrRec.includes(recorddt[j].appointmentRecordId)) {
          if (recorddt[j].drugId == item.id) {
            count = count + recorddt[j].count;
          }
        }
      }
      newData.push(count);
    }
    return newData;
  };
  const getDataForChartYear = (date, item) => {
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
    const tmp2 = getDataNewForChartYear(date, item);
    tmp.datasets = [
      {
        label: "Số lượng bán ra",
        data: tmp2,
        backgroundColor: "#3A57E8",
        borderWidth: 1,
        barThickness: 10,
        borderRadius: 50,
      },
    ];
    setChartData(tmp);
  };
  const [chartData, setChartData] = useState({
    labels: [1, 1, 1, 1, 1, 1, 1], // Replace with your category labels
    datasets: [
      {
        label: "Số lượng bán ra",
        data: [0, 0, 0, 0, 0, 9, 0],
        backgroundColor: "#3A57E8",
        borderWidth: 1,
        barThickness: 25,
        borderRadius: 2,
      },
    ],
  });
  useEffect(() => {}, [chartData]);
  // React.useEffect(()=>{
  //     console.log("medicine", appointment.length);
  //     console.log("item", selectItem);
  //     if(appointment.length > 0 && selectItem!=null)
  //     {
  //       console.log("on", getLabelForChartWeek(valueTime));
  //       getDataForChartWeek(valueTime, selectItem);
  //       stopInitLoad = true;
  //     }
  // }, [appointment, stopInitLoad])

  const optionschart1 = {
    title: {
      display: false,
    },
    scales: {
      y: {
        ticks: {
          maxTicksLimit: 5,
          callback: function (value, index, values) {
            return Number.isInteger(value) ? value : "";
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
            return Number.isInteger(value) ? value : "";
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
  /// Main Select Time:
  const [valueTime2, setValueTime2] = React.useState(dayjs());
  const setNewTime2 = (value) => {
    setValueTime2(value);
  };
  const [isOpenCalendar2, setIsOpenCalendar2] = React.useState(false);
  const handleOpenCalendar2 = (value) => {
    setIsOpenCalendar2(value);
    setIsOpenTimeOption2(false);
  };
  const [isOpenTimeOption2, setIsOpenTimeOption2] = React.useState(false);
  const handleOpenTimeOption2 = (value) => {
    setIsOpenCalendar2(false);
    setIsOpenTimeOption2(value);
  };
  const handlerSetNewTime2 = (value) => {
    setNewTime2(value);
    setIsOpenCalendar2(false);
  };
  const handlerSetNewTime = (value) => {
    setNewTime(value);
    setIsOpenCalendar(false);
  };
  const [timeOption2, setTimeOption2] = React.useState("Tháng");
  const handleSetTimeOption2 = (value) => {
    if (timeOption2 === "Tuần") rememberWeek2 = valueTime2;
    else if (timeOption2 === "Tháng") rememberMonth2 = valueTime2;
    else rememberYear2 = valueTime2;
    setTimeOption2(value);
    if (value === "Tuần") setValueTime2(rememberWeek2);
    else if (value === "Tháng") setValueTime2(rememberMonth2);
    else setValueTime2(rememberYear2);
  };
  const displayTime2 = (date) => {
    const time = formatDate(date);
    if (timeOption2 == "Tuần") return displayTime(date);
    if (timeOption2 == "Tháng") {
      return "Thg " + time.month + " " + time.year;
    }
    if (timeOption2 == "Năm") {
      return time.year;
    }
  };
  const getCountInTime = (month, year, item) => {
    let arrApt = [];
    let count = 0;
    for (let j = 0; j < appointment.length; j++) {
      const tmp = StringToDate(appointment[j].scheduleDate);
      if ((month == -1 || tmp.month === month) && tmp.year === year)
        arrApt.push(appointment[j].id);
    }
    let arrRec = [];
    for (let j = 0; j < record.length; j++) {
      if (arrApt.includes(record[j].appointmentListId))
        arrRec.push(record[j].id);
    }

    for (let j = 0; j < recorddt.length; j++) {
      if (arrRec.includes(recorddt[j].appointmentRecordId)) {
        if (recorddt[j].drugId === item.id) {
          count = count + recorddt[j].count;
        }
      }
    }
    return count;
  };
  const getCountInTimeWeek = (time, item) => {
    let arrApt = [];
    let count = 0;
    const date = formatDate(time);
    if (date.ms != date.ms) {
      for (let j = 0; j < appointment.length; j++) {
        const tmp = StringToDate(appointment[j].scheduleDate);
        if (
          (tmp.month === date.ms &&
            tmp.year === date.ys &&
            tmp.day >= date.start) ||
          (tmp.month === date.me && tmp.year === date.ye && tmp.day <= date.end)
        )
          arrApt.push(appointment[j].id);
      }
    } else {
      for (let j = 0; j < appointment.length; j++) {
        const tmp = StringToDate(appointment[j].scheduleDate);
        if (
          tmp.month === date.month &&
          tmp.year === date.year &&
          tmp.day >= date.start &&
          tmp.day <= date.end
        )
          arrApt.push(appointment[j].id);
      }
    }

    let arrRec = [];
    for (let j = 0; j < record.length; j++) {
      if (arrApt.includes(record[j].appointmentListId))
        arrRec.push(record[j].id);
    }

    for (let j = 0; j < recorddt.length; j++) {
      if (arrRec.includes(recorddt[j].appointmentRecordId)) {
        if (recorddt[j].drugId === item.id) {
          count = count + recorddt[j].count;
        }
      }
    }
    return count;
  };
  const handleExportReport = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Bảng Báo Cáo");

    const date = formatDate(valueTime2);
    worksheet.mergeCells("A2:E2");
    const reportCell2 = worksheet.getCell("A2");
    if (timeOption2 === "Tháng")
      reportCell2.value = "Tháng: " + date.month + "/" + date.year;
    else if (timeOption2 == "Năm") reportCell2.value = "Năm: " + date.year;
    else
      reportCell2.value =
        "Tuần: " +
        date.start +
        "/" +
        date.ms +
        "/" +
        date.ys +
        " - " +
        date.end +
        "/" +
        date.me +
        "/" +
        date.ye;
    reportCell2.font = { bold: true };
    reportCell2.alignment = { vertical: "middle", horizontal: "center" };

    worksheet.getRow(3).values = [
      "STT",
      "Thuốc",
      "Đơn vị tính",
      "Số lượng tồn kho",
      "Số lần dùng",
    ];
    const headerRow = worksheet.getRow(3);
    headerRow.values = [
      "STT",
      "Thuốc",
      "Đơn vị tính",
      "Số lượng tồn kho",
      "Số lần dùng",
    ];
    headerRow.eachCell((cell) => {
      cell.font = { bold: true }; // Bold font
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFCCEEFF" },
      }; // Light blue background
      cell.alignment = { horizontal: "left" }; // Left alignment
      cell.border = {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
      };
    });
    worksheet.columns = [
      { header: "STT", key: "STT", width: 5 },
      { header: "Thuốc", key: "thuoc", width: 20 },
      { header: "Đơn vị tính", key: "donVi", width: 15 },
      { header: "Số lượng tồn kho", key: "soLuong", width: 18 },
      { header: "Số lần dùng", key: "soLD", width: 15 },
    ];
    worksheet.mergeCells("A1:E1");
    const reportCell = worksheet.getCell("A1");
    reportCell.value = "Báo Cáo Sử Dụng Thuốc Theo " + timeOption2;
    reportCell.font = { bold: true };
    reportCell.alignment = { vertical: "middle", horizontal: "center" };

    let data = [];
    for (let i = 0; i < drugs.length; i++) {
      let sl;
      if (timeOption2 === "Tháng")
        sl = getCountInTime(
          formatDate(valueTime2).month,
          formatDate(valueTime2).year,
          drugs[i]
        );
      else if (timeOption2 === "Năm")
        sl = getCountInTime(-1, formatDate(valueTime2).year, drugs[i]);
      else sl = getCountInTimeWeek(valueTime2, drugs[i]);
      let sld;
      if (timeOption2 === "Tháng")
        sld = countDrugInRecord(date.month, date.year, drugs[i]);
      else if (timeOption2 === "Năm")
        sld = countDrugInRecord(-1, date.year, drugs[i]);
      else sld = countDrugInRecordWeek(valueTime2, drugs[i]);
      data.push({
        STT: i + 1,
        thuoc: drugs[i].drugName,
        donVi: getUnitName({ id: drugs[i].unitId }),
        soLuong: sl,
        soLD: sld,
      });
    }
    data.forEach((row, rowIndex) => {
      const rowObject = worksheet.getRow(rowIndex + 4);
      rowObject.values = row;
      rowObject.eachCell((cell) => {
        cell.alignment = { horizontal: "left" };
        cell.border = {
          top: { style: "thin", color: { argb: "FF000000" } },
          left: { style: "thin", color: { argb: "FF000000" } },
          right: { style: "thin", color: { argb: "FF000000" } },
          bottom: { style: "thin", color: { argb: "FF000000" } },
        };
      });
    });
    let nameExport;
    if (timeOption2 == "Tháng")
      nameExport =
        "Bao_Cao_Su_Dung_Thuoc_Thang_" + date.month + "/" + date.year;
    else if (timeOption2 == "Năm")
      nameExport = "Bao_Cao_Su_Dung_Thuoc_Nam_" + date.year;
    else
      nameExport =
        "Bao_Cao_Su_Dung_Thuoc_Tuan_" +
        date.start +
        "/" +
        date.ms +
        "_" +
        date.end +
        "/" +
        date.me +
        "/" +
        date.ye;
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), nameExport + ".xlsx");
    });
  };

  function formatMoney(number) {
    const strNumber = String(number);
    const parts = strNumber.split(/(?=(?:\d{3})+(?!\d))/);
    const formattedNumber = parts.join(".");
    return formattedNumber;
  }

  return (
    <div className="d-flex flex-row w-100 h-100 p-3">
      <div className="col-md-8">
        <Card style={{ padding: "0rem 1rem 0rem 0rem" }}>
          <div className=" w-100 h-100 overflow-hidden d-flex flex-column">
            <div className="d-flex flex-row mb-3 justify-content-between">
              <div>
                <div className="select-box-3">
                  <div
                    className="combobox"
                    onClick={() => handleOpenCalendar2(!isOpenCalendar2)}
                  >
                    <p>{displayTime2(valueTime2)}</p>
                    <div className="icon">
                      <FontAwesomeIcon className="icon" icon={faCaretDown} />
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
                {false && (
                  <div className="select-box-2" style={{ marginLeft: "10px" }}>
                    <div
                      className="combobox"
                      onClick={() => handleOpenTimeOption2(!isOpenTimeOption2)}
                    >
                      <p>{timeOption2}</p>
                      <div className="icon">
                        <FontAwesomeIcon className="icon" icon={faCaretDown} />
                      </div>
                    </div>

                    {isOpenTimeOption2 && (
                      <div className="select-time">
                        {/* <div className='item' onClick={() => {handleSetTimeOption2('Tuần');  handleOpenTimeOption2(false)}}>
                                      <p>Tuần</p>
                                  </div> */}
                        {/* <div className='item' onClick={() => {handleSetTimeOption2('Tháng');  handleOpenTimeOption2(false)}}>
                                      <p>Tháng</p>
                                  </div> */}
                        {/* <div className='item' onClick={() => {handleSetTimeOption2('Năm');  handleOpenTimeOption2(false)}}>
                                      <p>Năm</p>
                                  </div> */}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div>
                <button
                  className="btn btn-success"
                  onClick={handleExportReport}
                >
                  <FontAwesomeIcon className="icon-export" icon={faFileExcel} />
                  <span style={{ marginLeft: "5px" }}>Xuất</span>
                </button>
              </div>
            </div>
            <TableHeader>
              <div className="text-start" style={{ width: "30%" }}>
                Tên thuốc
              </div>
              <div className="text-start" style={{ width: "19%" }}>
                Đơn vị
              </div>
              <div className="text-start" style={{ width: "30%" }}>
                Doanh thu
              </div>
              <div className="text-start" style={{ width: "20%" }}>
                Số lần dùng
              </div>
              <div className="text-start" style={{ width: "1%" }}></div>
            </TableHeader>
            <TableBody>
              {listState && listState.length > 0 ? (
                listState.map((drug, index) => {
                  return (
                    <li
                      className="list-group-item list-group-item-primary list-group-item-action w-100 d-flex flex-row"
                      key={index}
                    >
                      <div
                        className="text-start"
                        style={{ width: "30%" }}
                        data-bs-toggle=""
                        aria-expanded="false"
                      >
                        {drug?.drugName}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "20%" }}
                        data-bs-toggle=""
                        aria-expanded="false"
                      >
                        {getUnitName({ id: drug?.unitId })}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "30%" }}
                        data-bs-toggle=""
                        aria-expanded="false"
                      >
                        {timeOption2 === "Tuần" &&
                          formatMoney(
                            countDrugInRecord(
                              formatDate(valueTime2)?.month,
                              formatDate(valueTime2)?.year,
                              drug
                            ) * drug?.price
                          )}
                        {timeOption2 === "Tháng" &&
                          formatMoney(
                            countDrugInRecordWeek(valueTime2, drug) *
                              drug?.price
                          )}
                        {timeOption2 === "Năm" &&
                          formatMoney(
                            countDrugInRecord(
                              -1,
                              formatDate(valueTime2)?.year,
                              drug
                            ) * drug?.price
                          )}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "16%" }}
                        data-bs-toggle=""
                        aria-expanded="false"
                      >
                        {timeOption2 === "Tháng" &&
                          countDrugInRecord(
                            formatDate(valueTime2)?.month,
                            formatDate(valueTime2)?.year,
                            drug
                          )}
                        {timeOption2 === "Năm" &&
                          countDrugInRecord(
                            -1,
                            formatDate(valueTime2)?.year,
                            drug
                          )}
                        {timeOption2 === "Tuần" &&
                          countDrugInRecordWeek(valueTime2?.drug)}
                      </div>
                      <div
                        className="text-end"
                        style={{ width: "4%" }}
                        data-bs-toggle=""
                        aria-expanded="false"
                      >
                        <FontAwesomeIcon
                          onClick={() => setDetailItem(drug)}
                          className="icon-view"
                          icon={faEye}
                        />
                      </div>
                    </li>
                  );
                })
              ) : (
                <div className="position-relative w-100 h-100">
                  <h5 className="position-absolute top-50 start-50 translate-middle fw-bold text-dark">
                    Không có thuốc
                  </h5>
                </div>
              )}
            </TableBody>
          </div>
        </Card>
      </div>
      <div className="col-md-4 d-flex flex-column">
        <div className="row">
          <Card style={{ padding: "0rem 0rem 1rem 0rem" }}>
            <div className="detail-chart">
              <div className="option-time-chart">
                <div className="d-flex justify-content-between">
                  <label className="fw-bold text-dark">Thuốc bán ra</label>
                  <div className="row">
                    <div className="select-box-4">
                      <div
                        className="combobox-chart"
                        onClick={() => handleOpenCalendar(!isOpenCalendar)}
                      >
                        <p>{displayTime3(valueTime)}</p>
                        <div className="icon">
                          <FontAwesomeIcon
                            className="icon"
                            icon={faCaretDown}
                          />
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
                    <div
                      className="select-box-5"
                      style={{ marginLeft: "10px" }}
                    >
                      <div
                        className="combobox"
                        onClick={() => handleOpenTimeOption(!isOpenTimeOption)}
                      >
                        <p>{timeOption}</p>
                        <div className="icon">
                          <FontAwesomeIcon
                            className="icon"
                            icon={faCaretDown}
                          />
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
                </div>
              </div>
              <Bar data={chartData} options={optionschart}></Bar>
            </div>
          </Card>
        </div>
        <div className="row-md-5 h-100">
          <Card>
            <div className="detail-list">
              <label className="fw-bold text-dark mb-2">Chi tiết thuốc</label>
              <div className="detail-item">
                <p>Tên thuốc: {selectItem?.drugName}</p>
              </div>
              <div className="detail-item">
                <p>Đơn vị: {getUnitName({ id: selectItem?.unitId })}</p>
              </div>
              <div className="detail-item">
                <p>Giá bán: {formatMoney(selectItem?.price)}</p>
              </div>
              <div className="detail-item">
                <p>Số lượng tồn kho: {selectItem?.count}</p>
              </div>
              <div className="detail-item">
                <p>Hoạt chất: {selectItem?.note}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Medicine;
