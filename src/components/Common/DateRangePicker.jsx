import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "assets/css/date-picker.css";
import moment from "moment";

const DateRangePicker = ({
  inputName,
  label,
  labelType = "floating",
  requireLabel = false,
  onChange,
  mode = "range",
  clearDates = false,
  selectedDate, // Single date passed from parent for non-range mode
  selectedRange, // Date range passed from parent for range mode
}) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Validate the date before using moment
  const formatDate = (date) => {
    if (moment(date).isValid()) {
      return moment(date).format("DD MMM yy");
    }
    return null;
  };

  // Handle date changes from DatePicker
  const handleChange = (dates) => {
    if (mode === "range") {
      const [start, end] = dates || [];
      setStartDate(start || null);
      setEndDate(end || null);
      onChange(formatDate(start), formatDate(end));
    } else {
      setStartDate(formatDate(dates) || null);
      onChange(formatDate(dates));
    }
  };

  // Handle clearing the date selection
  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    onChange(null, null); // Notify parent about clearing the date range
  };

  // Update state when selectedDate or selectedRange props change
  useEffect(() => {
    if (mode === "range" && selectedRange) {
      const [start, end] = selectedRange;
      // Only update if different from current state to avoid overriding user input
      if (
        !startDate ||
        !moment(startDate).isSame(moment(start, "dd MMM yy")) ||
        !endDate ||
        !moment(endDate).isSame(moment(end, "dd MMM yy"))
      ) {
        setStartDate(
          moment(start, "dd MMM yy", true).isValid()
            ? moment(start, "dd MMM yy").toDate()
            : null
        );
        setEndDate(
          moment(end, "dd MMM yy", true).isValid()
            ? moment(end, "dd MMM yy").toDate()
            : null
        );
      }
    } else if (
      selectedDate &&
      (!startDate || !moment(startDate).isSame(moment(selectedDate)))
    ) {
      setStartDate(selectedDate);
    }
  }, [selectedDate, selectedRange, mode, startDate, endDate]);

  // Clear dates if the clearDates prop is toggled
  useEffect(() => {
    if (clearDates) {
      handleClear();
    }
  }, [clearDates]);

  // Close the date picker when clicking outside
  const handleClickOutside = (event) => {
    if (event.target.closest(".datepicker-wrapper") === null) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="floating-label-container">
      <div className="floating-label-group">
        <label
          className={`${labelType === "floating" ? "floating-label" : ""} ${
            startDate || (mode === "range" && endDate) ? "active" : ""
          } ${requireLabel ? "required" : ""}`}
        >
          {label}
        </label>
        <DatePicker
          className="datepicker-input"
          name={inputName}
          dateFormat="dd MMM yy"
          selected={startDate}
          onChange={handleChange}
          startDate={mode === "range" ? startDate : null}
          endDate={mode === "range" ? endDate : null}
          selectsRange={mode === "range"}
          placeholderText={label}
          onSelect={() => setIsOpen(false)} // Close the date picker after selection
          dropdownMode="select"
          showMonthDropdown
          showYearDropdown
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
