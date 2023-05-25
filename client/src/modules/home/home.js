import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import genomeImage from "./mosaic2.jpeg";
import downloadsimg from "./downloads.svg";
import gwasimg from "./gwas.svg";
import { Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./home.scss";
export default function Home({ links }) {
  return (
    <>
      <div style={{ marginTop: "-5px", padding: "0px" }} className="banner-container text-center d-none d-md-block">
        <img src={genomeImage} alt="genome" style={{ width: "100%", height: "100%" }}></img>
      </div>
      <Container fluid className=" py-8 align-middle text-cernter" style={{ display: "block", width: "50%" }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
      </Container>
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
          <h4 className="container mt-3 text-dark" style={{ fontSize: "16pt" }}>
            Mosaic Explorer, an interactive mCA visualization and analysis tools that allows for aggregation,
            visualization, and analysis of mCAs in large populations. The tool will require a standard data input format
            including mCA location (e.g., chromosome and bp position), mCA type (e.g., loss, gain, neutral), and cell
            fraction (e.g., percentage of cells impacted by the event).
          </h4>
        </div>
      </div>
      <div className="bg-egg py-4">
        <div className="container my-3 text-dark">
          <h2 className="h4">Credits</h2>
          <p>
            Mitchell Machiela, Neal Freedman, Wen-Yi Huang, Wendy Wong, Sonja Berndt, Mustapha Abubakar, Jonas De
            Almeida, Jada Hislop, Erikka Loftfield, Jennifer Loukissas, Joshua Sampson, Montse Garcia-Closas, Stephen
            Chanock and colleagues at the{" "}
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
            ; Eric Miller, Paul Pinsky, Neeraj Saxena, Claire Zhu, Lori Minasian and colleagues at the{" "}
            <a href="https://prevention.cancer.gov/" target="_blank">
              Division of Cancer Prevention, NCI, NIH
            </a>
            ; Michael Furr, Jerome Mabie, Shannon Merkle, Craig Williams, Patrick Wright, Thomas Riley and staff at{" "}
            <a href="https://www.imsweb.com/" target="_blank">
              Information Management Services, Inc.
            </a>
            ; Bari Ballew, Casey Dagnall, Jia Liu, Kristine Jones, Cameron Palmer, Aurelie Vogt, Meredith Yeager, Bin
            Zhu, Amy Hutchinson, Belynda Hicks and staff at the{" "}
            <a href="https://dceg.cancer.gov/about/organization/cgr" target="_blank">
              Cancer Genomics Research Laboratory, DCEG, NCI
            </a>
            ,{" "}
            <a href="https://frederick.cancer.gov/" target="_blank">
              Frederick National Laboratory for Cancer Research (FNLCR)
            </a>
            ,{" "}
            <a href="https://www.leidos.com/company/subsidiaries/leidos-biomedical-research" target="_blank">
              Leidos Biomedical Research, Inc.
            </a>
            ; Norma Diaz-Mayoral and staff at the{" "}
            <a href="https://ncifrederick.cancer.gov/Programs/Science/Csp/Lab.aspx?Id=27" target="_blank">
              BioProcessing and Trial Logistics Laboratory, FNLCR, Leidos Biomedical Research, Inc.
            </a>
            ; Mary Ferrell, Erik Neidinger and staff at the NCI at{" "}
            <a href="https://frederick.cancer.gov/science/nci-frederick-central-repository" target="_blank">
              Frederick Central Repository
            </a>
            , <a href="https://www.atcc.org/">American Type Culture Collection</a>; Kevin Jiang, Brian Park, Kai-Ling
            Chen and staff at{" "}
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
    </>
  );
}
