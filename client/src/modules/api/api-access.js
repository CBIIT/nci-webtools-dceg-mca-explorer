import Container from "react-bootstrap/Container";
import SwaggerUI from "swagger-ui-react";

export default function ApiAccess() {
  return (
    <div className="h-100 bg-white">
      <Container className="py-5">
        <h1 className="display-6 text-muted text-center text-uppercase ">API Access</h1>
        <hr />
        <h2 className="h5 text-center">
          The mCA API provides programmatic access to endpoints which allow users to search a The following resources
          are available:
        </h2>
        <hr></hr>
        <SwaggerUI url={process.env.PUBLIC_URL + "/api"} />
      </Container>
    </div>
  );
}
