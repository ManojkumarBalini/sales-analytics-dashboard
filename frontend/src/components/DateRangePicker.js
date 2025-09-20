import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateRangePicker = ({ startDate, endDate, onChange }) => {
  const handleStartDateChange = (date) => {
    onChange({ startDate: date, endDate });
  };

  const handleEndDateChange = (date) => {
    onChange({ startDate, endDate: date });
  };

  return (
    <div className="date-range-picker">
      <div className="date-input">
        <label>Start Date</label>
        <DatePicker
          selected={startDate}
          onChange={handleStartDateChange}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          maxDate={endDate}
        />
      </div>
      <div className="date-input">
        <label>End Date</label>
        <DatePicker
          selected={endDate}
          onChange={handleEndDateChange}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          maxDate={new Date()}
        />
      </div>
    </div>
  );
};

export default DateRangePicker;