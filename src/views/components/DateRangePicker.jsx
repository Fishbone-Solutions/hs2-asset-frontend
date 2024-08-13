import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FormGroup, Label } from "reactstrap";

const DateRangePicker = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleClickOutside = (event) => {
    if (event.target.closest(".datepicker-wrapper") === null) {
      setIsOpen(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="floating-label-container">
      <div className="floating-label-group">
        <label
          className={`floating-label ${startDate || endDate ? "active" : ""}`}
        >
          Availability
        </label>
        <DatePicker
          className="datepicker-input"
          selected={startDate}
          onChange={handleChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          placeholderText="Availability"
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
