import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";

export default function About() {
  // const circle = document.getElementById("NGCircos")
  // const currentPath = (window.location.href);
  // console.log(currentPath)
  // if (currentPath.includes("about")){
  //   circle.style.display = "none"
  // }
  return (
    <Container className="my-4">
      <Card className="shadow">
        <Card.Body>
          <h3>About mCA Explorer</h3>

          <hr />
          <p>
            The mCA Explorer is a publicly available webtool developed and hosted by the Division of Cancer Epidemiology and Genetics (DCEG), 
            National Cancer Institute, National Institutes of Health. 
          </p>

          <p>
           Mosaic chromosomal alterations (mCAs) are large, somatically acquired structural chromosomal changes that drive clonal expansion 
           of affected cells. Detectable mCAs are typically {'>'} 50 Kb in length, and may result in copy number loss, copy number gain,
            or copy neutral loss of heterozygosity (CNLOH). mCAs are most frequently detected as loss of the sex chromosomes 
            (e.g., mosaic loss of the Y chromosome (mLOY) in males and mosaic loss of the X chromosome (mLOX) in females),
             followed by autosomal mCAs. Established risk factors for mCAs include age, with increased prevalence as age advances, 
             and smoking, with the greatest risk observed in current smokers. The presence of mCAs may increase risk for some types of 
             infections and hematologic malignancies.
          </p>
          <p>mCA Explorer is a publicly available tool designed for aggregation, visualization, and analysis of mCAs in population-level genomic datasets. 
            Researchers can examine the distribution and frequencies of mCAs of interest using Circos plots or chromosome-specific 
            plots and compare data across studies or participant attributes using pairwise plots. Descriptive characteristics,
             such as sex, age, genetic similarity, smoking status, prior cancer, and incident hematologic cancer, as well as event characteristics, 
             such as cellular fraction, mCA type (loss, gain, CNLOH), and genomic location, are available for data stratification, visualization, 
             and statistical enrichment testing. </p>

          <p>Presently, mCA Explorer includes data from 690,019 participants across three studies: UK Biobank<sup>1</sup>, 
            the Prostate, Lung, Colorectal, Ovarian Cancer Screening Trial (
            <a target="_blank" href="https://exploregwas.cancer.gov/plco-atlas/#/" style={{ fontWeight: "bold" }}>
              PLCO)
            </a><sup>2</sup>, and BioVU<sup>3</sup>. </p>

          <h5>Data Sources</h5>
          <ol>
            <li>Sudlow, C. et al. UK Biobank: An Open Access Resource for Identifying the Causes of a Wide Range of Complex Diseases of Middle and Old Age. PLoS Med. 12, (2015).</li>
            <li>Black, A. et al. PLCO: Evolution of an Epidemiologic Resource and Opportunities for Future Studies. Rev. Recent Clin. Trials 10, 238–245 (2015).</li>
            <li>Pulley, J., Clayton, E., Bernard, G. R., Roden, D. M. & Masys, D. R. Principles of Human Subjects Protections Applied in an Opt‐Out, De‐identified Biobank. Clin. Transl. Sci. 3, 42–48 (2010).</li>
          </ol>

          <p>
           Please submit any questions or comments regarding mCA Explorer to{" "}
            <a href="mailto:NCImcaExplorerWebAdmin@mail.nih.gov" style={{ fontWeight: "bold" }}>
              NCImcaExplorerWebAdmin@mail.nih.gov
            </a>
            .
          </p>

          <p></p>
        </Card.Body>
      </Card>
    </Container>
  );
}
