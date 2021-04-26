import React, { Component } from "react";
import { ClickableSquare, TextInput, Radio, Checkbox } from "../Form";
import "./Filters.css";
import { Link } from "react-router-dom";
import { FiltersPlaceHolder } from "../PlaceHolder";
class Filters extends Component {
  state = {};

  render_checkbox_filters = (values, name) => {
    var filters = [];
    const { onClick } = this.props;
    const { lang } = this.props;

    values.map((f, k) => {
      let active = this.props[name] ? this.props[name].includes(f.id) : false;
      filters.push(
        <button
          className="option no-button-default"
          key={k}
          aria-label="Filter By Material"
          onClick={() =>
            onClick(name, active, f.id, {
              name,
              title: values[k].title,
              id: f.id
            })
          }
        >
          <div className={`wrap ${lang == "ar" ? "ltr" : ""}`}>
            <Checkbox ischecked={active} /> <span>{f.title}</span>
          </div>
        </button>
      );
    });

    return filters;
  };

  render_radio_filters = values => {
    var filters = [];

    values.map((f, k) => {
      filters.push(
        <div className="option" key={k}>
          <div className="wrap">
            <Radio defaultChecked={true} /> <span>{f.name}</span>
          </div>
        </div>
      );
    });

    return filters;
  };

  render_button_filters = (values, name) => {
    var filters = [];
    const { onClick } = this.props;

    values.map((f, k) => {
      let active = this.props[name] ? this.props[name].includes(f.id) : false;
      var option =
        undefined !== f.image ? (
          <ClickableSquare
            ariaLabel="Filter With Colour"
            key={k}
            color={f.image}
            active={active}
            onClick={() =>
              onClick(name, active, f.id, {
                name,
                image: values[k].image,
                id: f.id
              })
            }
          />
        ) : (
          <ClickableSquare
            ariaLabel="Filter With Sizes"
            withToolTip
            key={k}
            text={f.abbreviation}
            title={f.title}
            active={active}
            onClick={() =>
              onClick(name, active, f.id, {
                name,
                title: values[k].abbreviation,
                id: f.id
              })
            }
          />
        );
      filters.push(option);
    });

    return filters;
  };

  draw_filter_values = (type, values, name) => {
    switch (type) {
      case "button":
        return this.render_button_filters(values, name);

      case "radio":
        return this.render_radio_filters(values);

      default:
        return this.render_checkbox_filters(values, name);
    }
  };

  draw_filters = () => {
    let options = [];

    this.props.data.map((value, i) => {
      let criteriaName =
        value.name.charAt(0).toUpperCase() + value.name.slice(1);

      options.push(
        value.values.length > 1 ? (
          <div
            className={`${value.type !== "button" ? "criteria" : ""}`}
            key={i}
          >
            <h4>{this.props.translation[criteriaName.toLowerCase()]}</h4>

            {this.draw_filter_values(value.type, value.values, value.name)}
          </div>
        ) : null
      );
    });

    return options;
  };

  // draw_filters = () => {
  //   let options = [];

  //   options.push(
  //     this.props.data.map((value, i) => (
  //       <div className="criteria" key={i}>
  //         <h4>
  //           {this.props.data[i].name.charAt(0).toUpperCase() +
  //             this.props.data[i].name.slice(1)}
  //         </h4>

  //         {this.draw_filter_values(
  //           this.props.data[i].type,
  //           this.props.data[i].values,
  //           this.props.data[i].name
  //         )}
  //       </div>
  //     ))
  //   );

  //   return options;
  // };

  render_categories = subcategories => {
    var links = [];

    subcategories.map((c, i) => {
      links.push(
        <Link
          key={i}
          to={`/${this.props.lang}/subcategories/${c.title}`}
          className="mar-left-24"
        >
          {c.title}
        </Link>
      );
    });

    return links;
  };

  render() {
    const {
      department,
      subcategories = [],
      saveToState,
      max_price,
      min_price,
      withSubCategory,
      translation,
      goback,
      is_shop,
      loading,
      lang,
      startFilter = () => {}
    } = this.props;

    return loading ? (
      <FiltersPlaceHolder locale={translation} lang={lang} />
    ) : (
      <div className="filters">
        {withSubCategory && (
          <div className="criteria">
            <button
              className="is-flex aic filters-head"
              style={{ border: `none` }}
              onClick={() => goback()}
            >
              <img
                src={require("../../assets/images/back-arrow.svg")}
                height="13"
                alt="Bac kArrow"
              />
              {department}
            </button>

            {this.render_categories(subcategories)}
          </div>
        )}

        {this.draw_filters()}

        <div className="criteria">
          <h4>{translation.price}</h4>

          <div className="column no-gutter is-ltr">
            <div className="columns is-multiline">
              <div className="column is-half-desktop is-12-tablet">
                <TextInput
                  type="number"
                  placeholder={translation.from}
                  name="min_price"
                  value={min_price}
                  onChange={saveToState}
                  onKeyPress={e => {
                    if (e.key === "Enter") {
                      startFilter();
                    }
                  }}
                />
              </div>

              <div className="column is-half-desktop is-12-tablet">
                <TextInput
                  type="number"
                  placeholder={translation.to}
                  name="max_price"
                  value={max_price}
                  onChange={saveToState}
                  onKeyPress={e => {
                    if (e.key === "Enter") {
                      startFilter();
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Filters;
