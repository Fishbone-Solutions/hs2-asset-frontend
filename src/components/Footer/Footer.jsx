/* eslint-disable */
import React from "react";
import { Container, Row, Col } from "reactstrap";
import PropTypes from "prop-types";

function Footer(props) {
  return (
    <footer className={"footer" + (props.default ? " footer-default" : "")}>
      <Container fluid={props.fluid ? true : false}>
        <Row className="d-flex align-items-center justify-content-between">
          <Col xs="auto">
            <nav className="footer-nav">
              <ul className="list-unstyled mb-0">
                <li>
                  <a
                    href="https://assetmanagement.fishbonesolutions.co.uk"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    POWERED BY FISH PLATFORM
                  </a>
                </li>
              </ul>
            </nav>
          </Col>
          <Col xs="auto" className="text-end">
            <div className="credits">
              <span className="copyright">
                &copy; {1900 + new Date().getYear()} Fishbone Solutions (Project
                REM Limited)
              </span>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

Footer.propTypes = {
  default: PropTypes.bool,
  fluid: PropTypes.bool,
};

export default Footer;
