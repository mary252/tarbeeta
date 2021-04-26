import React from "react";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default ({ color }) => (
  <FontAwesomeIcon icon={faChevronDown} style={{ color: color || "red" }} />
);
