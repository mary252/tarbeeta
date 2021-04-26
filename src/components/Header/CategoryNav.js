import React, { Component, Fragment } from "react";
import "./Header.css";
import { Link } from "react-router-dom";

class CategoryNav extends Component {
  draw_depatment = () =>
    this.props.departments
      ? this.props.departments.map((dept, i) => (
          <li key={i}>
            {/* <a href={`/${this.props.lang}/categories/${dept.department_name}`}> */}
            <a href={`/${this.props.lang}/search?k=${dept.department_name}`}>
              {dept.department_name}
            </a>
            <div className="buyer-navigation">
              {dept.categories.length > 0 &&
                dept.categories.map((category, j) => (
                  <ul key={j}>
                    <Fragment key={j}>
                      <a
                        href={`/${this.props.lang}/subcategory/${dept.department_name}/${category.name}`}
                      >
                        {category.name}
                      </a>
                      {category.subcategories.map((sub, k) => (
                        <Fragment key={k}>
                          <li key={k}>
                            <a
                              href={`/${this.props.lang}/subcategory/${dept.department_name}/${category.name}/${sub.subcategory_name}`}
                            >
                              {sub.subcategory_name}
                            </a>
                          </li>
                        </Fragment>
                      ))}
                    </Fragment>
                  </ul>
                ))}
              {/* <li>{dept.department_name}</li> */}
            </div>
          </li>
        ))
      : null;

  render() {
    return (
      <div className="cat-nav is-hidden-touch">
        <div className="container">
          <div className="columns is-vcentered is-mobile">
            {/*<div className="column is-1-desktop">
              <Link
                className={`prod-sec  ${
                  this.props.lang == "ar" ? `mar-left-0` : `mar-right-0`
                }`}
                to={`/${this.props.lang}/department`}
              >
                {this.props.locale.Fashion}
              </Link>
              </div>*/}

            {/* <div className="column is-1" /> */}

            <div className="column is-11-desktop">
              <ul className="category-nav">{this.draw_depatment()}</ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CategoryNav;
