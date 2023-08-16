import Container from "react-bootstrap/Container";
import genomeImage from "./mca1.jpeg";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import "./home.scss";
//text-light to text-dark
export default function Home({ links }) {
  return (
    <>
      <div className="">
        <div className="cover-image" style={{ height: "600px", width: "100%", backgroundImage: `url(${genomeImage})` }}>
          <Container>
            <Row>
              <Col md={6}>
                <div className="d-flex h-100 align-items-center my-4">
                  <div style={{ marginTop: "20px" }}>
                    <h2 className="font-title text-dark mb-3">Mosaic Chromosomal Alteration Explorer</h2>
                    <hr className="border-dark" />
                    <p className="lead text-dark">
                      An interactive mCA visualization and analysis tools that allows for aggregation, visualization,
                      and analysis of mCAs in large populations.The tool will require a standard data input format
                      including mCA location (e.g., chromosome and bp position), mCA type (e.g., loss, gain, neutral),
                      and cell fraction (e.g., percentage of cells impacted by the event).
                    </p>
                    <Link to="/mosaic" className="btn btn-outline-dark text-decoration-none">
                      Explore mosaic
                    </Link>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      <div className="bg-light py-4">
        {/* <Container>
          <Row>
            <Col>
              <p>
                An interactive mCA visualization and analysis tools that allows for aggregation, visualization, and
                analysis of mCAs in large populations.The tool will require a standard data input format including mCA
                location (e.g., chromosome and bp position), mCA type (e.g., loss, gain, neutral), and cell fraction
                (e.g., percentage of cells impacted by the event).
              </p>
            </Col>
          </Row>
        </Container> */}
        <div className="bg-egg ">
          <div className="container  text-dark">
            <h2 className="h4">Credits</h2>
            <p>
              Mitchell Machiela, Hubbard Aubrey, Chapman Lesley and colleagues at the{" "}
              <a href="https://dceg.cancer.gov/" target="_blank">
                Division of Cancer Epidemiology and Genetics (DCEG)
              </a>
              ,{" "}
              <a href="https://www.cancer.gov/" target="_blank">
                National Cancer Institute (NCI)
              </a>
              ,{" "}
              <a href="https://www.nih.gov/" target="_blank">
                National Institutes of Health (NIH)
              </a>
              , <a href="https://www.atcc.org/">American Type Culture Collection</a>; Brian Park, Xiaozheng Yao, Ben
              Chen, Madhu Kanigicherla, Kai-Ling Chen and staff at{" "}
              <a href="https://www.essential-soft.com/" target="_blank">
                Essential Software Inc.
              </a>
              ,{" "}
              <a href="https://datascience.cancer.gov/" target="_blank">
                Center for Biomedical Informatics and Information Technology, NCI.
              </a>
            </p>
            {/* Citation: TBD
          <br /> */}
            Mosaic Explorer's{" "}
            <a href="https://github.com/CBIIT/nci-webtools-dceg-plco-atlas" target="_blank" alt="Link to open GitHub">
              source code
            </a>{" "}
            is available under the{" "}
            <a href="./assets/license.txt" target="_blank" alt="Link to MIT license">
              MIT license
            </a>
            , an{" "}
            <a href="https://opensource.org" target="_blank" alt="Link to open source initiative">
              Open Source Initiative
            </a>{" "}
            approved license.
          </div>
        </div>
      </div>
      {/* 
      <div className="bg-white text-center">
        <div
          className="bg-light text-light text-center"
          style={{
            height: "50px",
            clipPath: "polygon(50% 100%, 0 0, 100% 0)",
          }}></div>
        <div className="py-5">
          <h3 style={{ color: "#545871" }}>
            <b>OUR FOCUS</b>
          </h3>
          <h4 className="container mt-3 text-dark" style={{ fontSize: "16pt" }}></h4>
        </div>
      </div> */}
    </>
  );
}
