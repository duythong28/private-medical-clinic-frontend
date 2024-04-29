import * as React from 'react';
import dayjs from 'dayjs';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { YearCalendar } from '@mui/x-date-pickers/YearCalendar';
import { styled } from '@mui/material/styles';
import { MonthCalendar } from '@mui/x-date-pickers/MonthCalendar';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import './SelectTime.scss'
dayjs.extend(isBetweenPlugin);

const CustomPickersDay = styled(PickersDay, {
    shouldForwardProp: (prop) => prop !== 'isSelected' && prop !== 'isHovered',
  })(({ theme, isSelected, isHovered, day }) => ({
    borderRadius: 0,
    ...(isSelected && {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      '&:hover, &:focus': {
        backgroundColor: theme.palette.primary.main,
      },
    }),
    ...(isHovered && {
      backgroundColor: theme.palette.primary[theme.palette.mode],
      '&:hover, &:focus': {
        backgroundColor: theme.palette.primary[theme.palette.mode],
      },
    }),
    ...(day.day() === 0 && {
      borderTopLeftRadius: '50%',
      borderBottomLeftRadius: '50%',
    }),
    ...(day.day() === 6 && {
      borderTopRightRadius: '50%',
      borderBottomRightRadius: '50%',
    }),
  }));
  
  const isInSameWeek = (dayA, dayB) => {
    if (dayB == null) {
      return false;
    }
  
    return dayA.isSame(dayB, 'week');
  };
  
  function Day(props) {
    const { day, selectedDay, hoveredDay, ...other } = props;
  
    return (
      <CustomPickersDay
        {...other}
        day={day}
        sx={{ px: 2.5 }}
        disableMargin
        selected={false}
        isSelected={isInSameWeek(day, selectedDay)}
        isHovered={isInSameWeek(day, hoveredDay)}
      />
    );
  }
  

function SelectTime({setNewTime, value }) {
    const SelectMonth = (month) => {
        // console.log('Year ' + month);
    }
    const [hoveredDay, setHoveredDay] = React.useState(null);
    
    
    return ( 
    <LocalizationProvider className='container' dateAdapter={AdapterDayjs}>
      <DemoContainer components={['YearCalendar', 'MonthCalendar']}>
        <div className='container'>
            
            <DemoItem>
            <div className='year-calendar'>
                <DateCalendar
                style={{ width: 300, height: 300 }}
                    value={value}
                    onChange={(newValue) => setNewTime(newValue)}
                    onYearChange={(newValue) => setNewTime(newValue)}
                    onMonthChange={(newValue) => setNewTime(newValue)}
                    showDaysOutsideCurrentMonth
                    slots={{ day: Day }}
                    slotProps={{
                        day: (ownerState) =>
                        ({
                            selectedDay: value,
                            hoveredDay,
                            onPointerEnter: () => {setHoveredDay(ownerState.day)},
                            onPointerLeave: () => setHoveredDay(null),
                        }),
                    }}
                    />
            </div>
            </DemoItem>
        </div>
      </DemoContainer>
    </LocalizationProvider>
    
     );
}

export default SelectTime;