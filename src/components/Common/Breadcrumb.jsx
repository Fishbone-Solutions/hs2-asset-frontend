import React from "react";
import PropTypes from "prop-types";
import { Breadcrumb, BreadcrumbItem } from "reactstrap";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const BreadcrumbComponent = ({ items }) => {
  return (
    <Breadcrumb>
      {items.map((item, index) => (
        <BreadcrumbItem key={index} active={index === items.length - 1}>
          {index !== items.length - 1 ? (
            <Link to={item.to}>{item.label}</Link>
          ) : (
            item.label
          )}
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
};

BreadcrumbComponent.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      to: PropTypes.string,
    })
  ).isRequired,
};

export default BreadcrumbComponent;
