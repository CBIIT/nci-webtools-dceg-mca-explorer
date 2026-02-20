
import Container from "react-bootstrap/Container";
import SwaggerUI from "swagger-ui-react";
import { useRef } from "react";
export default function ApiAccess() {
  const mcaSourceFieldsRef = useRef(null);
  const requestInterceptor = (request) => {
    try {
      if (request.url && request.url.includes("/api/opensearch/mca") && request.body) {
        const parsedBody = JSON.parse(request.body);
        const sourceFields = Array.isArray(parsedBody?.sourceFields)
          ? parsedBody.sourceFields.filter((field) => typeof field === "string" && field.trim().length > 0)
          : null;
        mcaSourceFieldsRef.current = sourceFields && sourceFields.length > 0 ? sourceFields : null;
      }
    } catch (error) {
      mcaSourceFieldsRef.current = null;
    }
    return request;
  };
  const responseInterceptor = (response) => {
    if (!response?.url || !response.url.includes("/api/opensearch/mca")) return response;
    const sourceFields = mcaSourceFieldsRef.current;
    if (!sourceFields || sourceFields.length === 0) return response;
    if (!response.obj || !Array.isArray(response.obj.merged)) return response;
    const filteredRows = response.obj.merged.map((row) => {
      const filtered = {};
      sourceFields.forEach((field) => {
        if (Object.prototype.hasOwnProperty.call(row, field)) {
          
          filtered[field] = row[field];
        }
      });
      return filtered;
    });
    response.obj = { ...response.obj, merged: filteredRows };
    if (typeof response.data === "string") {
      response.data = JSON.stringify(response.obj, null, 2);
    }
    return response;
  };
  return (
    <div className="h-100 bg-white">
      <Container className="py-5">
        <h1 className="display-6 text-muted text-center text-uppercase ">API Access</h1>
        <hr />
        <h5 className="text-center">
          The mCA API provides programmatic access to endpoints which allow users to do the search by calling the API. The following resources
          are available:
        </h5>
        <hr></hr>
        <SwaggerUI
          url={process.env.PUBLIC_URL + "/api"}
          requestInterceptor={requestInterceptor}
          responseInterceptor={responseInterceptor}
        />
      </Container>
    </div>
  );
}
