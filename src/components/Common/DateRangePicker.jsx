import React, { useState, useEffect, forwardRef } from "react";
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
  isdisabled = false,
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

  useEffect(() => {
    if (mode === "range" && selectedRange) {
      const [start, end] = selectedRange;
      console.log(start, end);

      // Parse the start and end dates with proper format validation
      const parsedStart = moment(start, "DD/MM/YYYY", true);
      const parsedEnd = moment(end, "DD/MM/YYYY", true);

      // Check if both dates are valid
      const isStartValid = parsedStart.isValid();
      const isEndValid = parsedEnd.isValid();

      // Only update state if the parsed dates are valid and different from the current state
      if (
        (!startDate || !moment(startDate).isSame(parsedStart)) &&
        isStartValid
      ) {
        console.log("Updating startDate");
        setStartDate(parsedStart.toDate());
      }

      if ((!endDate || !moment(endDate).isSame(parsedEnd)) && isEndValid) {
        console.log("Updating endDate");
        setEndDate(parsedEnd.toDate());
      }
    } else if (
      selectedDate &&
      (!startDate || !moment(startDate).isSame(moment(selectedDate)))
    ) {
      console.log("Updating single date mode");
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

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <input
      ref={ref}
      value={value}
      onClick={onClick}
      readOnly // Prevent typing in the input field
      disabled={isdisabled}
      placeholder={labelType === "floating" ? label : ""}
      className="datepicker-input"
      style={{ cursor: isdisabled ? "not-allowed" : "pointer" }} // Optional: changes the cursor to a pointer
    />
  ));

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
          className="form-control datepicker-input"
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
          isClearable={isdisabled ? false : true}
          disabled={isdisabled}
          customInput={<CustomInput />} // Use custom input to prevent typing
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
