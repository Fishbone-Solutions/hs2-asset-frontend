import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

const DateRangePicker = ({
  inputName,
  label,
  labelType = "floating",
  onChange,
  mode = "range",
}) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (dates) => {
    if (mode === "range") {
      const [start, end] = dates;
      setStartDate(start);
      setEndDate(end);
      onChange(
        moment(start).format("DD/MM/YYYY"),
        end ? moment(end).format("DD/MM/YYYY") : null
      );
    } else {
      setStartDate(dates);
      onChange(moment(dates).format("DD/MM/YYYY"));
    }
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
          className={`${labelType === "floating" ? "floating-label" : ""} ${
            startDate || (mode === "range" && endDate) ? "active" : ""
          }`}
        >
          {label}
        </label>
        <DatePicker
          className="datepicker-input"
          name={inputName}
          dateFormat="d/MM/YYYY"
          selected={startDate}
          onChange={handleChange}
          startDate={mode === "range" ? startDate : null}
          endDate={mode === "range" ? endDate : null}
          selectsRange={mode === "range"}
          placeholderText={label}
          onSelect={() => setIsOpen(false)} // Close the date picker after selection
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
