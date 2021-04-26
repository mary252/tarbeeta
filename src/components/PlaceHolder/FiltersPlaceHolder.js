import React, { Component } from "react";
import HorizontalLines from "./HorizontalLines";
import "./PlaceHolder.css";
class FiltersPlaceHolder extends Component {
  render() {
    const { locale, lang } = this.props;

    return (
      <div className="filters">
        <div className={`criteria`}>
          <h4>{locale.color}</h4>

          <HorizontalLines lang={lang} />
        </div>

        <div className={`criteria`}>
          <h4>{locale.size}</h4>

          <HorizontalLines lang={lang} />
        </div>

        <div className={`criteria`}>
          <h4>{locale.material}</h4>

          <HorizontalLines lang={lang} />
        </div>
        <div className="criteria">
          <h4>{locale.price}</h4>

          <div className="column no-gutter">
            <div className="columns is-multiline">
              <div className="column is-10-desktop is-12-tablet line1 animated-background" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export { FiltersPlaceHolder };
