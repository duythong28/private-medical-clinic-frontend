import { useEffect, useState, createContext, useContext } from "react";
const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [selectedDay, setSelectedDay] = useState(new Date());

  return (
    <MyContext.Provider value={{ selectedDay, setSelectedDay }}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  const context = useContext(MyContext);
  return context;
};

export const compareDate = (date1, date2) => {
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

export const getWeek = (day) => {
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

export function convertDate(from, to) {
  const fromDate = new Date(from);
  const toDate = new Date(to);

  const fromDay = fromDate.getDate();
  const fromMonth = fromDate.getMonth() + 1; 
  const toDay = toDate.getDate();
  const toMonth = toDate.getMonth() + 1;
  const toYear = toDate.getFullYear();

  return `${fromDay}/${fromMonth} - ${toDay}/${toMonth}/${toYear}`;
}