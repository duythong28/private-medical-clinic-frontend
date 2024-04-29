import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretDown,
  faCaretLeft,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
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
import { fetchAllAppointmentRecordDetails } from "../services/appointmentRecordDetails";
import { fetchAllDrugs } from "../services/drugs";
import { fetchAppointmentRecordById } from "../services/appointmentRecords";
import "./Home.scss";
import { queryClient } from "../App";
import { convertDate } from "../util/date";
import { Link } from "react-router-dom";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const optionschart = {
  scales: {
    y: {
      ticks: {
        maxTicksLimit: 2,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};

const css = `
        .my-today { 
            font-weight: bold;
            color: #d74f4a;
        }
    `;

function HomePage() {
  const getWeek = (day) => {
    const date = new Date(day);
    const dayOfWeek = date.getDay();
    date.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    const startOfWeek = new Date(date);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    return {
      from: startOfWeek,
      to: endOfWeek,
    };
  };
  const preRange = useRef(getWeek(new Date()));
  const [range, setRange] = useState(() => getWeek(new Date()));
  const [range2, setRange2] = useState(() => getWeek(new Date()));
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowModal2, setIsShowModal2] = useState(false);
  const [selectedOption, setOptions] = useState(true);

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

  const compareDate = (date1, date2) => {
    const year1 = date1.getFullYear();
    const month1 = date1.getMonth();
    const day1 = date1.getDate();
    const year2 = date2.getFullYear();
    const month2 = date2.getMonth();
    const day2 = date2.getDate();

    if (year1 > year2) {
      return 1;
    } else if (year1 === year2 && month1 > month2) {
      return 1;
    } else if (year1 === year2 && month1 === month2 && day1 > day2) {
      return 1;
    } else if (year1 === year2 && month1 === month2 && day1 === day2) {
      return 0;
    }
    return -1;
  };

  const getListAppointmentByToDay = (data) => {
    const finalData = data.filter(
      (item) =>
        compareDate(
          new Date(item?.appointmentList.scheduleDate.slice(0, 10)),
          new Date()
        ) === 0
    );
    return finalData;
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

  const getPreListAppointment = (data) => {
    const finalData = data.filter(
      (item) =>
        compareDate(
          new Date(item?.appointmentList.scheduleDate.slice(0, 10)),
          new Date()
        ) < 0
    );
    return finalData;
  };

  const query = optionQuery(
    "allAppointmentListPatients",
    getPreListAppointment
  );
  const query1 = optionQuery("appointmentListToday", getListAppointmentByToDay);
  const query2 = optionQuery(
    "appointmentListSelectedDay",
    getListAppointmentBySelectedDay
  );
  const query3 = optionQuery("appointmentListWeek", getListAppointmentByWeek);

  const preAppointmentListPatientQuery = useQuery(query);
  const appointmentListPatientTodayQuery = useQuery(query1);
  const appointmentListPatientSelectedDayQuery = useQuery(query2);
  const appointmentListPatientWeekQuery = useQuery(query3);

  const appointmentListPatientToday =
    appointmentListPatientTodayQuery.data || [];
  const appointmentListPatientSelectedDay =
    appointmentListPatientSelectedDayQuery.data || [];
  const appointmentListPatientWeek = appointmentListPatientWeekQuery.data || [];
  const preAppointmentListPatient = preAppointmentListPatientQuery.data || [];

  let seenIds = {};

  let patientsToday = [];

  appointmentListPatientToday.forEach((item) => {
    let patientId = item.patient.id;
    if (!seenIds[patientId]) {
      seenIds[patientId] = true;
      patientsToday.push(item);
    }
  });

  const appointmentListUpcoming = appointmentListPatientSelectedDay.filter(
    (item) => !item.appointmentRecordId
  );

  const dataToday = (() => {
    let newPatient = 0;
    let oldPatient = 0;
    for (const item of patientsToday) {
      const preAppointment = preAppointmentListPatient.filter(
        (appointment) => appointment.patient?.id === item.patient?.id
      );
      if (preAppointment.length > 0) {
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

  const appointmentRecordDetails = appointmentRecordDetailsQuery.data || [];
  const drugs = drugsQuery.data || [];

  const [topDrug, setTopDrug] = useState([]);

  const [dataMale, setDataMale] = useState([]);
  const [dataFemale, setDataFemale] = useState([]);

  useEffect(() => {
    const dataMale = [];
    const dataFemale = [];
    for (let i = 0; i < 7; ++i) {
      const cloneDay = new Date(preRange.current.from);
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
        backgroundColor: "#89d0ef",
        borderWidth: 1,
        barThickness: 10,
      },
      {
        data: [...dataFemale],
        backgroundColor: "#eb7474",
        borderWidth: 1,
        barThickness: 10,
      },
    ],
  };

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["appointmentListSelectedDay"] });
  }, [selectedDay]);

  const handleSelectedWeek = (day) => {
    setRange(() => {
      return getWeek(day);
    });
  };
  const handleSelectedWeek2 = (day) => {
    setRange2(() => {
      return getWeek(day);
    });
  };

  const toggleModal = () => {
    setIsShowModal(!isShowModal);
  };

  const handleShowChart = () => {
    queryClient.invalidateQueries({ queryKey: ["appointmentListWeek"] });
    setIsShowModal(!isShowModal);
    preRange.current = range;
  };

  const preState = useRef(
    (() => {
      const month = new Date().getMonth();
      const year = new Date().getFullYear();
      const selectedOption = true;
      return {
        selectedOption,
        month,
        year,
        range: getWeek(new Date()),
      };
    })()
  );

  const handleTopDrug = () => {
    const drugInfo = drugs.map((item) => {
      if (preState.current.selectedOption) {
        const items = appointmentRecordDetails.filter(
          (appointment) =>
            appointment?.drugId === item?.id &&
            compareDate(
              new Date(
                appointment?.record.appointmentList.scheduleDate.slice(0, 10)
              ),
              preState.current.range.from
            ) >= 0 &&
            compareDate(
              new Date(
                appointment?.record.appointmentList.scheduleDate.slice(0, 10)
              ),
              preState.current.range.to
            ) <= 0
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
              appointment?.record.appointmentList.scheduleDate.slice(0, 10)
            ).getMonth() === preState.current.month &&
            new Date(
              appointment?.record.appointmentList.scheduleDate.slice(0, 10)
            ).getFullYear() === preState.current.year
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
    setRange2(preState.current.range);
    setOptions(preState.current.selectedOption);
    setMonth({
      month: preState.current.month,
      year: preState.current.year,
    });
    setYear(preState.current.year);
  };

  const handleConfirmSelection = () => {
    setIsShowModal2(false);
    if (selectedOption) {
      preState.current.range = range2;
    } else {
      preState.current.month = month.month;
      preState.current.year = month.year;
      setYear(month.year);
    }
    preState.current.selectedOption = selectedOption;
    handleTopDrug();
  };

  return (
    <div className="h-100 w-100 overview p-3 gap-3 d-flex flex-col">
        <div className="w-100 d-flex flex-column">
          <div className="h-100 overview-number shadow rounded-2 p-3">
            <div>
              <h6>Số lượng bệnh nhân</h6>
              <h3 className="overview-number-patient">
                {patientsToday.length}
              </h3>
            </div>
            <div className="overview-number-percents">
              <div className="overview-number-percent shadow">
                <p className="overview-number-typepatient">Bệnh nhân mới</p>
                <p>
                  {dataToday.newPatient}
                  <span className="overview-typepatient-percent new">
                    {patientsToday.length > 0
                      ? (
                          (dataToday.newPatient / patientsToday.length) *
                          100
                        ).toFixed(2)
                      : 0}
                    %
                  </span>
                </p>
              </div>
              <div className="overview-number-percent shadow">
                <p className="overview-number-typepatient">Bệnh nhân cũ</p>
                <p>
                  {dataToday.oldPatient}
                  <span className="overview-typepatient-percent old">
                    {patientsToday.length > 0
                      ? (
                          (dataToday.oldPatient / patientsToday.length) *
                          100
                        ).toFixed(2)
                      : 0}
                    %
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="h-100 overview-patient-ofday shadow rounded-2 p-3 ">
            <h6>Số lượng bệnh nhân</h6>
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
              <label className="show-modal" onClick={toggleModal}>
                {convertDate(preRange.current.from) +
                  " - " +
                  convertDate(preRange.current.to.toString())}
                <FontAwesomeIcon
                  className="weeks-icon"
                  icon={faCaretDown}
                ></FontAwesomeIcon>
              </label>
              <input
                id="toggle-modal"
                type="checkbox"
                checked={isShowModal}
              ></input>
              <div className="modal-calendar">
                <label
                  className="modal-calendar-overlay"
                  onClick={() => {
                    toggleModal();
                    setRange(preRange.current);
                  }}
                ></label>
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
                  <button className="btn-modal" onClick={handleShowChart}>
                    Chọn
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="h-100 overview-topmedicine shadow rounded-2 p-3">
            <h6>Thuốc có số lượng bán ra cao nhất</h6>
            <p
              className="show-modal week-or-month-info"
              onClick={() => setIsShowModal2(true)}
            >
              {preState.current.selectedOption
                ? convertDate(preState.current.range.from) +
                  " - " +
                  convertDate(preState.current.range.to.toString())
                : `Tháng ${preState.current.month + 1} ${
                    preState.current.year
                  }`}
              <FontAwesomeIcon
                className="weeks-icon"
                icon={faCaretDown}
              ></FontAwesomeIcon>
            </p>
            <input
              id="toggle-modal-2"
              type="checkbox"
              checked={isShowModal2}
            ></input>
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
                <button className="btn-modal" onClick={handleConfirmSelection}>
                  Chọn
                </button>
              </div>
            </div>
            <div className="table-top-drug">
              <div className="table-header">
                <p>STT</p>
                <p>Tên Thuốc</p>
                <p>Số lượng tồn kho</p>
                <p>Số lượng bán ra</p>
              </div>
              <div className="table-body">
                {topDrug.map((drug, index) => (
                  <div className="table-body-row" key={index}>
                    <p>{index + 1}</p>
                    <p>{drug.drugName}</p>
                    <p>{drug.count}</p>
                    <p>{drug.soldout}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div id="calendar" className="shadow rounded-2 p-3">
          <h6 className="calendar-title">Lịch</h6>
          <style>{css}</style>
          <div className="calendar-container">
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
            <h6 style={{ flex: 1, margin: 0 }}>Các ca khám sắp tới</h6>
            <Link to="/systems/examinations">Xem tất cả</Link>
          </div>
          <div className="patients-list">
            {appointmentListUpcoming.length > 0 ? (
              appointmentListUpcoming.map((item) => {
                return (
                  <div className="patient-item" key={item.id}>
                    <h6 className="patient-name">{item.patient?.fullName}</h6>
                    <h6 className="gender">
                      Giới tính: {item.patient?.gender}
                    </h6>
                  </div>
                );
              })
            ) : (
              <p style={{ marginTop: "12px", textAlign: "center" }}>
                Không có lịch khám
              </p>
            )}
          </div>
        </div>
      </div>
  );
}

export default HomePage;
