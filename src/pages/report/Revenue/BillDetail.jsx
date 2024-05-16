import { faClose } from "@fortawesome/free-solid-svg-icons";
import "./BillDetail.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TableHeader from "../../../components/TableHeader";
import TableBody from "../../../components/TableBody";
import { fetchAllAppointmentListById } from "../../../services/appointmentList";
import {
  convertDate,
  compareDates,
  inputToDayFormat,
} from "../../../util/date";
import { formatNumber } from "../../../util/money";
import { queryClient } from "../../../App";
import { fetchFeeConsult } from "../../../services/argument";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Modal } from "react-bootstrap";

function BillDetail({
  timeoption,
  date,
  bills,
  appointmentLists,
  setIsOpenBillDetail,
}) {
  let option;
  if (timeoption == "Năm") option = "Tháng";
  else option = "Ngày";
  const getAptById = (id) => {
    return appointmentLists.find((item) => item.id == id);
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
  const checkDate = (str) => {
    const time = StringToDate(str);
    if (option == "Ngày") {
      return (
        time.day == date.day &&
        time.month == date.month &&
        date.year == time.year
      );
    } else if (option == "Tháng") {
      if (time.month == date.month && time.year == date.year) return true;
    }
    return false;
  };

  const filterBillList = () => {
    const tmp = appointmentLists.filter((item) => checkDate(item.scheduleDate));
    const tmpId = tmp.map((item) => item.id);
    return bills.filter((item) => tmpId.includes(item.appointmentListId));
  };
  filterBillList();
  const newBill = filterBillList();
  const displayDate = (str) => {
    if (str == null) return null;
    const date = StringToDate(str);
    return date.day + "/" + date.month + "/" + date.year;
  };
  return (
    <Modal  show={true} centered size="xl">
      <div className="h-100 w-100 d-flex flex-column p-3">
        <div className="header">
          <div className="title">
            {option == "Ngày" && (
              <p>
                Hóa đơn ngày {date.day}/{date.month}/{date.year}
              </p>
            )}
            {option == "Tháng" && (
              <p>
                Hóa đơn tháng {date.month}/{date.year}
              </p>
            )}
          </div>
          <div className="close">
            <button
              className="close-button"
              onClick={() => setIsOpenBillDetail(false)}
            >
              <FontAwesomeIcon className="icon-close" icon={faClose} />
            </button>
          </div>
        </div>
        <div className="linee"></div>
        <div className="body">
          <div className=" w-100 h-100 overflow-hidden d-flex flex-column gap-3">
            <TableHeader>
              <div className="text-start" style={{ width: "10%" }}>
                STT
              </div>
              <div className="text-start" style={{ width: "29%" }}>
                Mã hóa đơn
              </div>
              <div className="text-start" style={{ width: "40%" }}>
                Ngày Thu
              </div>
              <div className="text-start" style={{ width: "20%" }}>
                Tổng tiền
              </div>

              <div className="text-end" style={{ width: "1%" }}></div>
            </TableHeader>
            <div className="data-body">
              <TableBody>
                {newBill &&
                  newBill.map((bill, index) => {
                    return (
                      <li
                        className="list-group-item list-group-item-primary list-group-item-action w-100 d-flex flex-row"
                        key={index}
                      >
                        <div className="text-start" style={{ width: "10%" }}>
                          {index + 1}
                        </div>
                        <div className="text-start" style={{ width: "30%" }}>
                          {bill?.id}
                        </div>
                        <div className="text-start" style={{ width: "40%" }}>
                          {displayDate(
                            getAptById(bill?.appointmentListId)?.scheduleDate
                          )}
                        </div>
                        <div className="text-start" style={{ width: "20%" }}>
                          {formatNumber(bill?.drugExpense + bill?.feeConsult)}
                        </div>
                      </li>
                    );
                  })}
              </TableBody>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default BillDetail;
