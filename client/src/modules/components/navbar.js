import BootstrapNavbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { NavLink } from "react-router-dom";

export default function Navbar({ links = [], className, children }) {
  return (
    <BootstrapNavbar expand="lg" bg="white" variant="light" className={className}>
      <BootstrapNavbar.Toggle aria-controls="responsive-navbar-nav">
        <span class="navbar-toggler-icon"></span>
      </BootstrapNavbar.Toggle>
      <BootstrapNavbar.Collapse id="responsive-navbar-nav">
        <Container style={{ flex: 1 }}>
          {children}
          <Nav className="mx-auto">
            {links?.map((link) => (
              <NavLink
                to={link.path}
                key={link.path}
                // activeClassName="active"
                className="nav-link mx-1"
                exact={link.exact}>
                {link.title}
              </NavLink>
            ))}
          </Nav>
        </Container>
      </BootstrapNavbar.Collapse>
    </BootstrapNavbar>
  );
}
