import React from "react";
import { Helmet } from "react-helmet";
import { IPageContainerProps } from "./IpageContainer";

export const PageContainer: React.FC<IPageContainerProps> = (props) => {
  const { title, description } = props;

  return (
    <div>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      {props.children}
    </div>
  );
};
