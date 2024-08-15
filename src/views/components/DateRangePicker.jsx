import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FormGroup, Label } from "reactstrap";
import moment from "moment";

const DateRangePicker = ({ label, onChange }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    onChange(
      moment(start).format("DD/MM/YYYY"),
      moment(end).format("DD/MM/YYYY")
    );
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
          {label}
        </label>
        <DatePicker
          className="datepicker-input"
          selected={startDate}
          onChange={handleChange}
          startDate={startDate}
          endDate={endDate}
          selectsRange
          placeholderText={label}
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
