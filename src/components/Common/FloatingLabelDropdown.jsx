import React, { useState } from "react";
import { FormGroup, Label } from "reactstrap";
import Select from "react-select";
import "../../assets/css/floating-label.css";

const MyFloatingLabelSelect = ({ label, options, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);

  const handleSelectChange = (selectedOption) => {
    setSelectedValue(selectedOption);
    onChange(selectedOption); // Pass selected option to parent component
  };

  return (
    <FormGroup className="floating-label-select">
      <Label
        for="selectStatus"
        className={`floating-label ${
          isFocused || selectedValue ? "floating-label-focused" : ""
        }`}
      >
        {label}
      </Label>
      <Select
        id="selectStatus"
        className="react-select primary"
        classNamePrefix="react-select"
        name="statuscode"
        menuPlacement="top"
        value={selectedValue}
        onChange={handleSelectChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        options={options}
        styles={{
          control: (provided) => ({
            ...provided,
            minHeight: "40px",
          }),
          menu: (provided) => ({
            ...provided,
            zIndex: 9999,
          }),
          valueContainer: (provided) => ({
            ...provided,
            padding: "0 8px",
          }),
        }}
      />
    </FormGroup>
  );
};

export default MyFloatingLabelSelect;
