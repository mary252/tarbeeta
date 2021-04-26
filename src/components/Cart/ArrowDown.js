import React from "react";
import { faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default ({ color }) => (
  <FontAwesomeIcon icon={faChevronUp} style={{ color: color || "red" }} />
);
