import React from "react";
import { Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

import "./styles.css";

const Footer = () => {
  return (
    <footer className="container-footer">
      <Container fluid className="d-flex flex-column align-items-center justify-content-center text-white text-center">
        <div className="d-flex align-items-center mb-2">
          <a
            className="mhq text-white text-decoration-none"
            target="_blank"
            rel="noopener noreferrer"
            href="https://danjancreative.netlify.app/"
          >
            Made with love by DanJan Creative
          </a>
        </div>
        <a
          className="view-code text-white text-decoration-none"
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/Sanjana2070"
        >

        View code on GitHub <FontAwesomeIcon className="ml-2" icon={faGithub} />
        
        </a>
      </Container>
    </footer>
  );
};

export default Footer;

