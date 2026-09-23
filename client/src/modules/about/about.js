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
            or copy neutral loss of heterozygosity (CN-LOH). mCAs are most frequently detected as loss of the sex chromosomes 
            (e.g., mosaic loss of the Y chromosome (mLOY) in males and mosaic loss of the X chromosome (mLOX) in females),
             followed by autosomal mCAs. Established risk factors for mCAs include age, with increased prevalence as age advances, 
             and smoking, with the greatest risk observed in current smokers. The presence of mCAs may increase risk for some types of 
             infections and hematologic malignancies.
          </p>
          <p>mCA Explorer is a publicly available tool designed for aggregation, visualization, and analysis of mCAs in population-level genomic datasets. 
            Researchers can examine the distribution and frequencies of mCAs of interest using Circos plots or chromosome-specific 
            plots and compare data across participant attributes using pairwise plots. Descriptive characteristics,
             such as sex, age, genetic similarity, smoking status, prior cancer, and incident hematologic cancer, as well as event characteristics, 
             such as cellular fraction, mCA type (loss, gain, CN-LOH), and genomic location, are available for data stratification, visualization, 
             and statistical enrichment testing. </p>

          <p>Presently, mCA Explorer includes data from 765,521 participants across ten studies: BioBank Japan<sup>1</sup>, 
            BioVU<sup>2</sup>, Colorectal, Estonian Biobank<sup>3</sup>, IORRA (Institute of Rheumatology, Rheumatoid Arthritis)<sup>4</sup>, 
            Lung, Ovarian Cancer Screening Trial(
            <a target="_blank" href="https://exploregwas.cancer.gov/plco-atlas/#/" style={{ fontWeight: "bold" }}>
              PLCO)
            </a><sup>5</sup>, the Prostate, Trans-Omics for Precision Medicine (TOPMed)<sup>6</sup>, and UK Biobank<sup>7</sup>. </p>

           <p>
           Please submit any questions or comments regarding mCA Explorer to{" "}
            <a href="mailto:NCImcaExplorerWebAdmin@mail.nih.gov" style={{ fontWeight: "bold" }}>
              NCImcaExplorerWebAdmin@mail.nih.gov
            </a>
            .
          </p>
          <br></br>

          <h5>Data Sources</h5>
          <ol>
            <li>Terao, C. et al. Chromosomal alterations among age-related haematopoietic clones in Japan. Nature 584, 130–135 (2020).</li>
            <li>Pulley, J., Clayton, E., Bernard, G. R., Roden, D. M. & Masys, D. R. Principles of Human Subjects Protections Applied in an Opt‐Out, De‐identified Biobank. Clin. Transl. Sci. 3, 42–48 (2010).</li>
            <li>Leitsalu, L. et al. Cohort profile: Estonian biobank of the Estonian genome center, University of Tartu. Int. J. Epidemiol. 44, 1137–1147 (2015).</li>
            <li>Uchiyama, S. et al. Mosaic loss of chromosome Y characterises late-onset rheumatoid arthritis and contrasting associations of polygenic risk score based on age at onset. Ann. Rheum. Dis. 84, 1313–1323 (2025).</li>
            <li>Black, A. et al. PLCO: Evolution of an Epidemiologic Resource and Opportunities for Future Studies. Rev. Recent Clin. Trials 10, 238–245 (2015).</li>
            <li>
              Trans-Omics for Precision Medicine (TOPMed):
              <ol type="a">
                <li>Mitchell, B. D. et al. The genetic response to short-term interventions affecting cardiovascular function: rationale and design of the Heredity and Phenotype Intervention (HAPI) Heart Study. Am. Heart J. 155, 823–828 (2008).</li>
                <li>Hughes, G. H. et al. Recruitment in the Coronary Artery Disease Risk Development in Young Adults (CARDIA) Study. Control. Clin. Trials 8, 68S–73S (1987).</li>
                <li>Fried, L. P. et al. The Cardiovascular Health Study: design and rationale. Ann. Epidemiol. 1, 263–276 (1991).</li>
                <li>Regan, E. A. et al. Genetic epidemiology of COPD (COPDGene) study design. COPD 7, 32–43 (2010).</li>
                <li>Sorlie, P. D. et al. Design and implementation of the Hispanic Community Health Study/Study of Latinos. Ann. Epidemiol. 20, 629–641 (2010).</li>
                <li>Taylor, H. A. Jr et al. Toward resolution of cardiovascular health disparities in African Americans: design and methods of the Jackson Heart Study. Ethn. Dis. 15, S6-4–S6-17 (2005).</li>
                <li>Bild, D. E. et al. Multi-Ethnic Study of Atherosclerosis: objectives and design. Am. J. Epidemiol. 156, 871–881 (2002).</li>
                <li>The Women's Health Initiative Study Group. Design of the Women's Health Initiative clinical trial and observational study. Control. Clin. Trials 19, 61–109 (1998).</li>
                <li>Jakubek, Y. A. et al. Mosaic chromosomal alterations in blood across ancestries using whole-genome sequencing. Nat. Genet. 55, 1912–1919 (2023).</li>
              </ol>
            </li>
            <li>Sudlow, C. et al. UK Biobank: An Open Access Resource for Identifying the Causes of a Wide Range of Complex Diseases of Middle and Old Age. PLoS Med. 12, (2015).</li>
          </ol>

         

          <p></p>
        </Card.Body>
      </Card>
    </Container>
  );
}
