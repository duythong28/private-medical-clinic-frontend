import { useEffect } from "react";
import TableHeader from "../../../components/TableHeader";
import TableBody from "../../../components/TableBody";
import { faFileExcel } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import "./GridViewRevenue.scss";

function GridViewRevenue({
  date,
  getDayOfMonth,
  aptList,
  billList,
  timeOption,
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
      for (let j = 0; j < aptList.length; j++) {
        const tmp = StringToDate(aptList[j].scheduleDate);
        if (tmp.day === i && tmp.month === month && tmp.year === year) {
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
      for (let j = 0; j < aptList.length; j++) {
        const tmp = StringToDate(aptList[j].scheduleDate);
        if (tmp.month === i && tmp.year === year) {
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
      sum: newData1,
      count: newData2,
    };
  };
  const displayTime = (day, month, year) => {
    return day + "/" + month + "/" + year;
  };
  let tmp = [];
  if (timeOption === "Tháng") tmp = getDataNew(date.month, date.year);
  else tmp = getDataNewYear(date.year);
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
    else reportCell2.value = "Năm: " + date.year;
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
      });
    });
    let nameExport;
    if (timeOption == "Tháng")
      nameExport = "Bao_Cao_Doanh_Thu_Thang_" + date.month + "/" + date.year;
    else nameExport = "Bao_Cao_Doanh_Thu_Nam_" + date.year;
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(new Blob([buffer]), nameExport + ".xlsx");
    });
  };
  return (
    <>
      <div className=" w-100 h-100 overflow-hidden d-flex flex-column gap-3">
        <div className="export-button">
          <button onClick={handleExportReport}>
            <FontAwesomeIcon className="icon-export" icon={faFileExcel} />
            Export
          </button>
        </div>
        <TableHeader>
          <div className="text-start" style={{ width: "10%" }}>
            STT
          </div>
          <div className="text-start" style={{ width: "25%" }}>
            {timeOption === "Tháng" ? "Ngày" : "Tháng"}
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
                <li
                  className=" dropdown-center list-group-item list-group-item-primary list-group-item-action w-100 d-flex flex-row"
                  key={index}
                >
                  <div
                    className="text-start"
                    style={{ width: "10%" }}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {index + 1}
                  </div>
                  <div
                    className="text-start"
                    style={{ width: "25%" }}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {timeOption === "Tháng" &&
                      displayTime(index + 1, date.month, date.year)}
                    {timeOption === "Năm" && index + 1 + "/" + date.year}
                  </div>
                  <div
                    className="text-start"
                    style={{ width: "20%" }}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {CountList[index]}
                  </div>
                  <div
                    className="text-start"
                    style={{ width: "25%" }}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {item}
                  </div>
                  <div
                    className="text-start"
                    style={{ width: "20%" }}
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {Math.floor((item / total) * 10000) / 100} %
                  </div>
                </li>
              );
            })}
        </TableBody>
      </div>
    </>
  );
}

export default GridViewRevenue;
