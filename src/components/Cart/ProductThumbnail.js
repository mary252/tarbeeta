import React from "react";
import { Link } from "react-router-dom";

const ProductThumbnail = ({
  link,
  to,
  width = 66,
  height = 66,
  borderColor = "#ececec"
}) => (
  <Link
    aria-label="Product"
    className="prduct-thumbnail"
    src={link}
    to={to}
    style={{
      width,
      height,
      backgroundImage: `url(${link})`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "cover",
      border: ` 1px solid ${borderColor}`,
      borderRadius: 5
    }}
  />
);

export { ProductThumbnail };
