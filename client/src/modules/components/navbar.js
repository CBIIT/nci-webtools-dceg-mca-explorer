import BootstrapNavbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";

export default function Navbar({ links = [], className, children }) {
  return (
    <BootstrapNavbar expand="lg" bg="white" variant="light" className={className}>
      <BootstrapNavbar.Toggle aria-controls="responsive-navbar-nav" className="ml-3_5">
        <span class="navbar-toggler-icon"></span>
      </BootstrapNavbar.Toggle>
      <BootstrapNavbar.Collapse id="responsive-navbar-nav">
        <div className="ml-3_5">
          {children}
          <Nav >
            {links?.map((link) => (
              <NavLink
                to={link.path}
                key={link.path}
                // activeClassName="active"
                className="nav-link px-1 mx-4 nav-font"
                exact={link.exact}>
                {link.title}
              </NavLink>
            ))}
          </Nav>
        </div>
      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
  );
}
