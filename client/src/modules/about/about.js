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
            Background and Significance: Mosaic chromosomal alterations (mCAs) 
            are the clonal expansion of cells harboring large chromosomal alterations 
            that differ from the inherited germline genome.1 mCAs are large (usually {'>'} 2 Mb) 
            somatic structural mutations characterized by genomic deletions, 
            amplifications, or copy neutral loss of heterozygosity (LOH).
            2 Commonly detected mCAs include loss of chromosome Y (LOY; 
            frequency 10-20%+) in men, loss of chromosome X (LOX, frequency 5-8%) in women, 
            and autosomal mCAs (frequency 3-5%) such as 20q deletions and chromosome 12 amplifications. 
            During aging, cellular expansion and selective forces shape the clonal trajectory 
            of mutated cells resulting in a dynamic process of clonal growth with observable increases 
            and decreases in mutated cellular fraction over time that can lead to increased risk of 
            hematologic malignancies and infections.2,3 Despite an expanding number of recent i
            nvestigations with large numbers of individuals characterized, to date, 
            no public repositories exist that catalog mCAs. In addition, interactive mCA visualization 
            and analysis tools are lacking that can be useful for identifying genomic regions of 
            enrichment as well as subgroup specific events.
                     
          </p>
          <p>
           This webtool that allows for aggregation, visualization, and analysis of mCAs in large populations
          </p>
         

          <p>
            Features of mCA Explorer include:
          
          </p>

          <p>
            The data from mCA Explorer are derived from the{" "}
            <a
              target="_blank"
              href="https://exploregwas.cancer.gov/plco-atlas/#/"
              style={{ fontWeight: "bold" }}>
              PLCO
            </a>{" "}
            
          </p>

          <p>
            Please submit comments and questions regarding mCA Explorer to{" "}
            <a
              href="mailto:NCImosaicTilerWebAdmin@mail.nih.gov"
              style={{ fontWeight: "bold" }}>
              NCImosaicTilerWebAdmin@mail.nih.gov
            </a>
            .
          </p>

          <p>
          </p>
        </Card.Body>
      </Card>
    </Container>
  );
}
