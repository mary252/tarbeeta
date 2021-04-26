import React, { Component } from "react";
import { ColorButton } from "../Form";
import "../../containers/Products/AddProduct/css/EN.css";

class PlateColors extends Component {
  render() {
    const {
      variations,
      colours,
      selectColor,
      className,
      selectedColorMethod
    } = this.props;
    return colours.map((colour, i) => {
      let isSelected =
        variations.findIndex(el => el.colour_id === colour.id) > -1;

      return (
        <div className={className} key={i}>
          <button
            className="color-button-warper no-button-default"
            onClick={() => selectColor(isSelected, colour)}
            aria-label="Select Colour"
          >
            <ColorButton
              colour={colour.image}
              isSelected={isSelected}
              selectedColorMethod={selectedColorMethod}
            />
          </button>
        </div>
      );
    });
  }
}

export default PlateColors;
