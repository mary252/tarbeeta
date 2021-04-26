import React, { Component } from "react";
import "./Form.css";

class DropDown extends Component {
  render() {
    const {
      onSelect,
      name,
      options,
      selected,
      defaultValue,
      ariaLabel
    } = this.props;
    return (
      <div className="custom-select">
        <select name={name} onChange={onSelect} aria-label={ariaLabel}>
          {defaultValue && <option value="">{defaultValue}</option>}
          {options.map((option, i) => (
            <option
              value={undefined !== option.value ? option.value : option.id}
              key={i}
              selected={
                selected ==
                (undefined !== option.value ? option.value : option.id)
                  ? "selected"
                  : ""
              }
            >
              {undefined !== option.title ? option.title : option.name}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export { DropDown };
