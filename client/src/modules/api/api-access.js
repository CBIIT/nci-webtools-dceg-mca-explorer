
import Container from "react-bootstrap/Container";
import SwaggerUI from "swagger-ui-react";

const defaultStudy = [
  { value: "plco", label: "PLCO" },
  { value: "ukbb", label: "UK Biobank" },
  { value: "biovu", label: "BioVU" },
  "",
  "",
];

const mcaResponseFields = ["chromosome", "sex", "type", "cf", "beginGrch38", "endGrch38", "array"];
const isMcaEndpoint =
  (url) => typeof url === "string" && (url.includes("/api/opensearch/mca") || url.includes("/api/opensearch/chromosome"));

const normalizeStudySelection = (study) => {
  if (!Array.isArray(study)) return [];
  return study.filter(
    (item) => item && typeof item === "object" && typeof item.value === "string" && item.value.trim().length > 0
  );
};

export default function ApiAccess() {
  const requestInterceptor = (request) => {
    try {
      if (isMcaEndpoint(request.url) && request.body) {
        const parsedBody = typeof request.body === "string" ? JSON.parse(request.body) : { ...request.body };
        const defaultStudySelection = normalizeStudySelection(defaultStudy);
        const selectedStudy = normalizeStudySelection(parsedBody.study);
        parsedBody.study = selectedStudy.length > 0 ? selectedStudy : defaultStudySelection;
        request.body = JSON.stringify(parsedBody);
      }
    } catch (error) {}
    return request;
  };
  const responseInterceptor = (response) => {
    if (!isMcaEndpoint(response?.url)) return response;
    let payload = response.obj;

    if (!payload && response.data && typeof response.data === "object") {
      payload = response.data;
    }

    if (!payload && typeof response.data === "string") {
      try {
        payload = JSON.parse(response.data);
      } catch (error) {
        return response;
      }
    }

    if (!payload || !Array.isArray(payload.merged)) return response;

    const filteredRows = payload.merged.map((row) => {
      const filtered = {};
      mcaResponseFields.forEach((field) => {
        if (Object.prototype.hasOwnProperty.call(row, field)) {
          filtered[field] = row[field];
        }
      });
      return filtered;
    });

    const filteredPayload = { merged: filteredRows };
    const filteredText = JSON.stringify(filteredPayload, null, 2);
    response.obj = filteredPayload;
    response.data = filteredText;
    response.text = filteredText;
    response.body = filteredText;
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
