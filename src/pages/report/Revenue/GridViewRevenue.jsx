import { useEffect, useState } from "react";
import TableHeader from "../../../components/TableHeader";
import TableBody from "../../../components/TableBody";
import { faEye, faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import "./GridViewRevenue.scss";

function GridViewRevenue({
  date,
  getDayOfMonth,
  appointmentLists,
  bills,
  timeOption,
  handleSetSelectedBill,
  setIsOpenBillDetail,
}) {
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

  const getDataNew = (month, year) => {
    let newData1 = [];
    let newData2 = [];
    for (let i = 1; i <= getDayOfMonth(month, year); i++) {
      let arr = [];
      let sum = 0;
      let cnt = 0;
      for (let j = 0; j < appointmentLists.length; j++) {
        const tmp = StringToDate(appointmentLists[j].scheduleDate);
        if (tmp.day === i && tmp.month === month && tmp.year === year) {
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
      sum: newData1,
      count: newData2,
    };
  };
  const getDataNewWeek = (date) => {
    let newData1 = [];
    let newData2 = [];
    if (date.ms == date.me) {
      for (let i = date.start; i <= date.end; i++) {
        disTime.push(i + "/" + date.month + "/" + date.year);
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
      for (let i = date.start; i <= getDayOfMonth(date.ms, date.ys); i++) {
        disTime.push(i + "/" + date.ms + "/" + date.ys);
        let arr = [];
        let sum = 0;
        let cnt = 0;
        for (let j = 0; j < appointmentLists.length; j++) {
          const tmp = StringToDate(appointmentLists[j].scheduleDate);
          if (tmp.day === i && tmp.month === date.ms && tmp.year === date.ys) {
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
      for (let i = 1; i <= date.end; i++) {
        disTime.push(i + "/" + date.me + "/" + date.ye);
        let arr = [];
        let sum = 0;
        let cnt = 0;
        for (let j = 0; j < appointmentLists.length; j++) {
          const tmp = StringToDate(appointmentLists[j].scheduleDate);
          if (tmp.day === i && tmp.month === date.me && tmp.year === date.ye) {
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
    }

    return {
      sum: newData1,
      count: newData2,
    };
  };
  const getDataNewYear = (year) => {
    let newData1 = [];
    let newData2 = [];
    for (let i = 1; i <= 12; i++) {
      let arr = [];
      let sum = 0;
      let cnt = 0;
      for (let j = 0; j < appointmentLists.length; j++) {
        const tmp = StringToDate(appointmentLists[j].scheduleDate);
        if (tmp.month === i && tmp.year === year) {
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
      sum: newData1,
      count: newData2,
    };
  };
  const displayTime = (day, month, year) => {
    return day + "/" + month + "/" + year;
  };
  let disTime = [];
  let tmp = [];
  if (timeOption === "Tháng") tmp = getDataNew(date.month, date.year);
  else if (timeOption === "Năm") tmp = getDataNewYear(date.year);
  else tmp = getDataNewWeek(date);
  let SumList = tmp.sum;
  let CountList = tmp.count;
  const total = SumList.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);

  const handleExportReport = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Bảng Báo Cáo");

    worksheet.mergeCells("A2:E2");
    const reportCell2 = worksheet.getCell("A2");
    if (timeOption === "Tháng")
      reportCell2.value = "Tháng: " + date.month + "/" + date.year;
    else if (timeOption == "Năm") reportCell2.value = "Năm: " + date.year;
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

    let dTime = "Ngày";
    if (timeOption === "Năm") dTime = "Tháng";
    worksheet.getRow(3).values = [
      "STT",
      "Ngày",
      "Số bệnh nhân",
      "Doanh thu",
      "Tỉ lệ",
    ];
    const headerRow = worksheet.getRow(3);
    headerRow.values = ["STT", "Ngày", "Số bệnh nhân", "Doanh thu", "Tỉ lệ"];
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
      { header: dTime, key: "ngay", width: 20 },
      { header: "Số bệnh nhân", key: "soBenhNhan", width: 20 },
      { header: "Doanh thu", key: "doanhThu", width: 25 },
      { header: "Tỉ lệ", key: "tiLe", width: 10 },
    ];
    worksheet.mergeCells("A1:E1");
    const reportCell = worksheet.getCell("A1");
    reportCell.value = "Báo Cáo Doanh Thu Theo " + timeOption;
    reportCell.font = { bold: true };
    reportCell.alignment = { vertical: "middle", horizontal: "center" };

    let data = [];
    for (let i = 0; i < SumList.length; i++) {
      let tmpTime = i + 1 + "/" + date.year;
      if (timeOption === "Tháng")
        tmpTime = displayTime(i + 1, date.month, date.year);
      else if (timeOption == "Tuần") tmpTime = disTime[i];
      let tl;
      if (total === 0) tl = "0%";
      else tl = Math.floor((SumList[i] / total) * 10000) / 100 + "%";
      data.push({
        STT: i + 1,
        ngay: tmpTime,
        soBenhNhan: CountList[i],
        doanhThu: SumList[i],
        tiLe: tl,
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
    worksheet.mergeCells(`A${SumList.length + 4}:C${SumList.length + 4}`);
    const LastCell = worksheet.getCell(`A${SumList.length + 4}`);
    LastCell.value = "Tổng doanh thu:";
    LastCell.font = { bold: true };
    LastCell.alignment = { horizontal: "left" };
    LastCell.border = {
      top: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
    };
    worksheet.mergeCells(`D${SumList.length + 4}:E${SumList.length + 4}`);
    const LastCell2 = worksheet.getCell(`D${SumList.length + 4}`);
    LastCell2.value = total;
    LastCell2.font = { bold: false };
    LastCell2.alignment = { horizontal: "left" };
    LastCell2.border = {
      top: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
    };
    let nameExport;
    if (timeOption == "Tháng")
      nameExport = "Bao_Cao_Doanh_Thu_Thang_" + date.month + "/" + date.year;
    else if (timeOption == "Năm")
      nameExport = "Bao_Cao_Doanh_Thu_Nam_" + date.year;
    else
      nameExport =
        "Bao_Cao_Su_Doanh_Thu_Tuan_" +
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

  let STT = 0;
  return (
    <>
      <div className="main-content">
        <div className=" w-100 h-100 overflow-hidden d-flex flex-column">
          <div className="d-flex flex-row justify-content-end mb-3">
            <button className="btn btn-success" onClick={handleExportReport}>
              <FontAwesomeIcon className="icon-export" icon={faFileExcel} />
              <span style={{ marginLeft: "5px" }}>Xuất</span>
            </button>
          </div>
          <TableHeader>
            <div className="text-start" style={{ width: "10%" }}>
              STT
            </div>
            <div className="text-start" style={{ width: "24%" }}>
              {timeOption === "Năm" ? "Tháng" : "Ngày"}
            </div>
            <div className="text-start" style={{ width: "20%" }}>
              Số bệnh nhân
            </div>
            <div className="text-start" style={{ width: "25%" }}>
              Doanh thu
            </div>
            <div className="text-start" style={{ width: "19%" }}>
              Tỷ lệ
            </div>
            <div className="text-start" style={{ width: "1%" }}></div>
          </TableHeader>
          <TableBody>
            {SumList &&
              SumList.map((item, index) => {
                return (
                  CountList[index] > 0 && (
                    <li
                      className="list-group-item list-group-item-primary list-group-item-action w-100 h-80 d-flex flex-row"
                      key={index}
                    >
                      <div
                        className="text-start"
                        style={{ width: "10%" }}
                        data-bs-toggle=""
                        aria-expanded="false"
                      >
                        {++STT}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "25%" }}
                        data-bs-toggle=""
                        aria-expanded="false"
                      >
                        {timeOption === "Tháng" &&
                          displayTime(index + 1, date.month, date.year)}
                        {timeOption === "Năm" && index + 1 + "/" + date.year}
                        {timeOption === "Tuần" && disTime[index]}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "20%" }}
                        data-bs-toggle=""
                        aria-expanded="false"
                      >
                        {CountList[index]}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "25%" }}
                        data-bs-toggle=""
                        aria-expanded="false"
                      >
                        {formatMoney(item)}
                      </div>
                      <div
                        className="text-start"
                        style={{ width: "16%" }}
                        data-bs-toggle=""
                        aria-expanded="false"
                      >
                        {total === 0
                          ? "0"
                          : Math.floor((item / total) * 10000) / 100}
                        %
                      </div>
                      <div
                        className="text-end"
                        style={{ width: "4%" }}
                        data-bs-toggle=""
                        aria-expanded="false"
                      >
                        <FontAwesomeIcon
                          onClick={() => {
                            console.log("click!!!");
                            if (timeOption == "Năm")
                              handleSetSelectedBill({
                                day: 0,
                                month: index + 1,
                                year: date.year,
                              });
                            else if (timeOption == "Tháng")
                              handleSetSelectedBill({
                                day: index + 1,
                                month: date.month,
                                year: date.year,
                              });
                            else {
                              const [day, month, year] =
                                disTime[index].split("/");
                              handleSetSelectedBill({
                                day: parseInt(day),
                                month: parseInt(month),
                                year: parseInt(year),
                              });
                            }
                          }}
                          className="icon-view"
                          icon={faEye}
                        />
                      </div>
                    </li>
                  )
                );
              })}
            {SumList &&
              SumList.filter((item, index) => CountList[index] > 0).length ==
                0 && (
                <div className="position-relative w-100 h-100">
                  <h5 className="position-absolute top-50 start-50 translate-middle fw-bold text-dark">
                    Không có doanh thu
                  </h5>
                </div>
              )}
          </TableBody>
          <div className="total-view">
            <TableHeader>
              <div className="text-start" style={{ width: "55%" }}>
                Tổng doanh thu
              </div>
              <div className="text-start" style={{ width: "25%" }}>
                {formatMoney(total)}
              </div>
            </TableHeader>
          </div>
        </div>
      </div>
    </>
  );
}

export default GridViewRevenue;
