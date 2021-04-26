import React from "react";
import { Helmet } from "react-helmet";

export default props => (
  <div>
    <Helmet>
      <title>{props.title}</title>
      <meta name="description" content={props.description} />
      <meta property="og:type" content="website" />
      <meta
        property="og:url"
        content={`www.tarbeeta.com${props.location.pathname}${
          props.location.search
        }`}
      />
      <meta property="og:title" content={props.title} />
      <meta property="og:description" content={props.description} />
      <meta property="og:image" content={props.currPic} />
    </Helmet>
    {/* but BreadCrumb here */}
    <main className="main-pages">{props.children}</main>

    {/* but footer here */}
  </div>
);
