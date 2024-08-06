.mode csv
.output UKLOH.csv
select dataset, sampleId,computedGender,chromosome, beginGrch38,endGrch38,length,pArm,qArm,nSites,type,cf,ancestry from sample where type="CN-LOH" and dataset="UKBB_blood_autosomal_mCAs" and chromosome NOT Like '%X' and chromosome NOT LIKE '%Y' and cf != 'nan' ;
.output stdout
.mode csv
.output UKLoss.csv
select dataset, sampleId,computedGender,chromosome, beginGrch38,endGrch38,length,pArm,qArm,nSites,type,cf,ancestry from sample where type="Loss" and dataset="UKBB_blood_autosomal_mCAs" and chromosome NOT Like '%X' and chromosome NOT LIKE '%Y' and cf != 'nan' ;
.output stdout
.mode csv
.output UKGain.csv
select dataset, sampleId,computedGender,chromosome, beginGrch38,endGrch38,length,pArm,qArm,nSites,type,cf,ancestry from sample where type="Gain" and dataset="UKBB_blood_autosomal_mCAs" and chromosome NOT Like '%X' and chromosome NOT LIKE '%Y' and cf != 'nan' ;
.output stdout
.mode csv
.output UKUndetermined.csv
select dataset, sampleId,computedGender,chromosome, beginGrch38,endGrch38,length,pArm,qArm,nSites,type,cf,ancestry from sample where type="Undetermined" and dataset="UKBB_blood_autosomal_mCAs" and chromosome NOT Like '%X' and chromosome NOT LIKE '%Y' and cf != 'nan' ;
.output stdout

.mode csv
.output plcoLOH.csv
select dataset, sampleId,computedGender,chromosome, beginGrch38,endGrch38,length,pArm,qArm,nSites,type,cf,ancestry from sample where type="CN-LOH" and dataset="PLCO_GSA_blood_autosomal_mCAs" and chromosome NOT Like '%X' and chromosome NOT LIKE '%Y' and cf != 'nan';
.output stdout
.mode csv
.output plcoLoss.csv
select dataset, sampleId,computedGender,chromosome, beginGrch38,endGrch38,length,pArm,qArm,nSites,type,cf,ancestry from sample where type="Loss" and dataset="PLCO_GSA_blood_autosomal_mCAs" and chromosome NOT Like '%X' and chromosome NOT LIKE '%Y' and cf != 'nan';
.output stdout
.mode csv
.output plcoGain.csv
select dataset, sampleId,computedGender,chromosome, beginGrch38,endGrch38,length,pArm,qArm,nSites,type,cf,ancestry from sample where type="Gain" and dataset="PLCO_GSA_blood_autosomal_mCAs" and chromosome NOT Like '%X' and chromosome NOT LIKE '%Y' and cf != 'nan';
.output stdout
.mode csv
.output plcoUndetermined.csv
select dataset, sampleId,computedGender,chromosome, beginGrch38,endGrch38,length,pArm,qArm,nSites,type,cf,ancestry from sample where type="Undetermined" and dataset="PLCO_GSA_blood_autosomal_mCAs" and chromosome NOT Like '%X' and chromosome NOT LIKE '%Y' and cf != 'nan';
.output stdout

.mode csv
.output allLOH.csv
select dataset, sampleId,computedGender,chromosome, beginGrch38,endGrch38,length,pArm,qArm,nSites,type,cf,ancestry from sample where type="CN-LOH" and chromosome NOT Like '%X' and chromosome NOT LIKE '%Y' and cf != 'nan';
.output stdout
.mode csv
.output allLoss.csv
select dataset, sampleId,computedGender,chromosome, beginGrch38,endGrch38,length,pArm,qArm,nSites,type,cf,ancestry from sample where type="Loss" and chromosome NOT Like '%X' and chromosome NOT LIKE '%Y' and cf != 'nan';
.output stdout
.mode csv
.output allGain.csv
select dataset, sampleId,computedGender,chromosome, beginGrch38,endGrch38,length,pArm,qArm,nSites,type,cf,ancestry from sample where type="Gain" and chromosome NOT Like '%X' and chromosome NOT LIKE '%Y' and cf != 'nan';
.output stdout
.mode csv
.output allUndetermined.csv
select dataset, sampleId,computedGender,chromosome, beginGrch38,endGrch38,length,pArm,qArm,nSites,type,cf,ancestry from sample where type="Undetermined" and chromosome NOT Like '%X' and chromosome NOT LIKE '%Y' and cf != 'nan';
.output stdout