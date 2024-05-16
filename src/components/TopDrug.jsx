import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCaretLeft,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useQuery } from "@tanstack/react-query";
import { vi } from "date-fns/locale";

import { fetchAllAppointmentRecordDetails } from "../services/appointmentRecordDetails";
import { fetchAllDrugs } from "../services/drugs";
import { fetchAppointmentRecordById } from "../services/appointmentRecords";
import { fetchAllBills } from "../services/bill";
import "../pages/Home.scss";
import { convertDate } from "../util/date";
import { compareDate, getWeek } from "../components/SelectDayContext";

function TopDrug() {
  const [range2, setRange2] = useState(() => getWeek(new Date()));
  const [isShowModal2, setIsShowModal2] = useState(false);
  const [selectedOption, setOptions] = useState(true);

  const appointmentRecordDetailsQuery = useQuery({
    queryKey: ["appointmentRecordDetails"],
    queryFn: async () => {
      const data = await fetchAllAppointmentRecordDetails();
      const finalData = await Promise.all(
        data.map(async (item) => {
          const record = await fetchAppointmentRecordById({
            id: item.appointmentRecordId,
          });
          return {
            ...item,
            record,
          };
        })
      );
      return finalData;
    },
  });

  const drugsQuery = useQuery({
    queryKey: ["druglist"],
    queryFn: async () => {
      const data = await fetchAllDrugs();
      return data;
    },
  });

  const billsQuery = useQuery({
    queryKey: ["billlist"],
    queryFn: async () => {
      const data = await fetchAllBills();
      return data;
    },
  });

  const appointmentRecordDetails = appointmentRecordDetailsQuery.data || [];
  const drugs = drugsQuery.data || [];
  const billList = billsQuery.data || [];

  const [topDrug, setTopDrug] = useState([]);

  const handleSelectedWeek2 = (day) => {
    setRange2(() => {
      return getWeek(day);
    });
    setIsShowModal2(false);
  };

  // const preState = useRef(
  //   (() => {
  //     const month = new Date().getMonth();
  //     const year = new Date().getFullYear();
  //     const selectedOption = true;
  //     return {
  //       selectedOption,
  //       month,
  //       year,
  //       range: getWeek(new Date()),
  //     };
  //   })()
  // );

  const handleTopDrug = () => {
    const drugInfo = drugs.map((item) => {
      if (
        // preState.current.selectedOption
        selectedOption
      ) {
        const items = appointmentRecordDetails.filter(
          (appointment) =>
            appointment?.drugId === item?.id &&
            compareDate(
              new Date(
                appointment?.record.appointmentList.scheduleDate?.slice(0, 10)
              ),
              // preState.current.range.from
              range2.from
            ) >= 0 &&
            compareDate(
              new Date(
                appointment?.record.appointmentList.scheduleDate?.slice(0, 10)
              ),
              // preState.current.range.to
              range2.to
            ) <= 0 &&
            billList.find(
              (bill) =>
                bill.appointmentListId ===
                  appointment.record.appointmentListId &&
                bill.patientId === appointment.record.patientId
            )
        );
        let soldout = 0;
        for (const detail of items) {
          soldout += detail?.count;
        }

        return {
          ...item,
          soldout,
        };
      } else {
        const items = appointmentRecordDetails.filter(
          (appointment) =>
            appointment?.drugId === item?.id &&
            new Date(
              appointment?.record.appointmentList.scheduleDate?.slice(0, 10)
            ).getMonth() ===
              // preState.current.month &&
              month.month &&
            new Date(
              appointment?.record.appointmentList.scheduleDate?.slice(0, 10)
            ).getFullYear() ===
              // preState.current.year &&
              month.year &&
            billList.find(
              (bill) =>
                bill.appointmentListId ===
                  appointment.record.appointmentListId &&
                bill.patientId === appointment.record.patientId
            )
        );
        let soldout = 0;
        for (const detail of items) {
          soldout += detail?.count;
        }
        return {
          ...item,
          soldout,
        };
      }
    });

    drugInfo.sort((a, b) => b.soldout - a.soldout);
    const topDrug = drugInfo.slice(0, 5);
    const finalTopDrug = topDrug.filter((drug) => drug.soldout > 0);
    setTopDrug(finalTopDrug);
  };

  useEffect(() => {
    handleTopDrug();
  }, [appointmentRecordDetails]);

  const [month, setMonth] = useState({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  });
  const [year, setYear] = useState(new Date().getFullYear());

  const incrementYear = () => {
    setYear((pre) => pre + 1);
  };

  const decrementYear = () => {
    setYear((pre) => pre - 1);
  };

  const handleCloseModal = () => {
    setIsShowModal2(false);
    // setRange2(preState.current.range);
    // setOptions(preState.current.selectedOption);
    // setMonth({
    //   month: preState.current.month,
    //   year: preState.current.year,
    // });
    // setYear(preState.current.year);
    setYear(month.year);
  };

  // const handleConfirmSelection = () => {
  //   setIsShowModal2(false);
  //   if (selectedOption) {
  //     preState.current.range = range2;
  //   } else {
  //     preState.current.month = month.month;
  //     preState.current.year = month.year;
  //     setYear(month.year);
  //   }
  //   preState.current.selectedOption = selectedOption;
  //   handleTopDrug();
  // };

  useEffect(() => {
    handleTopDrug();
  }, [month, range2, selectedOption]);

  return (
    <div
      className="h-100 overview-topmedicine rounded-3 p-3"
      style={{ border: "1px solid #B9B9B9" }}
    >
      <label className="fw-bold text-dark">Thuốc bán chạy</label>
      <p
        className="show-modal week-or-month-info"
        onClick={() => setIsShowModal2(true)}
      >
        {selectedOption
          ? convertDate(range2.from) + " - " + convertDate(range2.to.toString())
          : `Tháng ${month.month + 1} ${month.year}`}
        <FontAwesomeIcon
          className="weeks-icon"
          icon={faCaretDown}
        ></FontAwesomeIcon>
      </p>
      <input id="toggle-modal-2" type="checkbox" checked={isShowModal2}></input>
      <div className="modal-calendar">
        <label
          className="modal-calendar-overlay"
          onClick={handleCloseModal}
        ></label>
        <div className="modal-calendar-content hg-lg">
          <div className="option-container">
            <p
              className={`selected-option ${!selectedOption && "active"}`}
              onClick={() => setOptions(false)}
            >
              Tháng
            </p>
            <p
              className={`selected-option ${selectedOption && "active"}`}
              onClick={() => setOptions(true)}
            >
              Tuần
            </p>
          </div>
          {selectedOption && (
            <DayPicker
              locale={vi}
              weekStartsOn={1}
              defaultMonth={new Date()}
              selected={range2}
              onDayClick={handleSelectedWeek2}
              mode="range"
              showOutsideDays
            />
          )}
          {!selectedOption && (
            <div className="month-picker">
              <div className="select-year">
                <FontAwesomeIcon
                  className="icon-month"
                  icon={faCaretLeft}
                  onClick={decrementYear}
                />
                <p>{year}</p>
                <FontAwesomeIcon
                  className="icon-month"
                  icon={faCaretRight}
                  onClick={incrementYear}
                />
              </div>
              <div className="month-container">
                {[...Array(12)].map((_, index) => (
                  <p
                    onClick={() => {
                      setMonth({
                        month: index,
                        year: year,
                      });
                      setIsShowModal2(false);
                    }}
                    key={index}
                    className={
                      index === month.month &&
                      year === month.year &&
                      "month-selected"
                    }
                  >{`Tháng ${index + 1}`}</p>
                ))}
              </div>
            </div>
          )}
          {/* <button className="btn-modal" onClick={handleConfirmSelection}>
                  Chọn
                </button> */}
        </div>
      </div>
      <div className="table-top-drug">
        <div className="table-header">
          <p>STT</p>
          <p>Tên Thuốc</p>
          <p>Số lượng tồn kho</p>
          <p>Số lượng bán ra</p>
        </div>
        <div
          className="table-body"
          style={{
            scrollbarWidth: "thin",
          }}
        >
          {topDrug.length > 0 ? (
            topDrug.map((drug, index) => (
              <div className="table-body-row" key={index}>
                <p>{index + 1}</p>
                <p>{drug.drugName}</p>
                <p>{drug.count}</p>
                <p>{drug.soldout}</p>
              </div>
            ))
          ) : (
            <p
              style={{ textAlign: "center", marginTop: "12px" }}
            >{`Không có thuốc bán ra trong ${
              selectedOption ? "tuần" : "tháng"
            }`}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopDrug;
