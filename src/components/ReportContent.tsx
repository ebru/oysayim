import React from 'react';
import domtoimage from 'dom-to-image';
import { Grid, Typography } from '@mui/material';
import { jsPDF } from 'jspdf';
import { saveAs } from 'file-saver';

import { Candidate, ReportConfig } from '../Types';
import PieChart from './PieChart';

interface ReportContentProps {
  reportConfig: ReportConfig,
  candidates: Candidate[];
  invalidVotes: number;
}

const ReportContent: React.FC<ReportContentProps> = ({
  reportConfig,
  candidates,
  invalidVotes,
}) => {
  const validVotes = candidates.reduce((acc, candidate) => acc + candidate.votes, 0);
  const totalVotes = validVotes + invalidVotes;

  // First chart: candidate votes and invalid votes according to total votes
  const totalVotesData = {
    labels: [...candidates.map(candidate => candidate.name), 'GEÇERSİZ OY'],
    datasets: [{
      data: [...candidates.map(candidate => candidate.votes), invalidVotes],
      backgroundColor: ['#0A86D8', '#DB2325', '#777777'],
      borderColor: '#fff'
    }],
  };

  // Second chart: candidate votes according to valid votes
  const validVotesData = {
    labels: candidates.map(candidate => candidate.name),
    datasets: [{
      data: candidates.map(candidate => candidate.votes),
      backgroundColor: ['#0A86D8', '#DB2325'],
      borderColor: '#fff'
    }],
  };

  return (
    <div id="reportContent" style={{
      padding: 10,
      backgroundColor: 'white',
      display: "none",
      width: 800,
      height: 1132,
    }}>
      <h2>Cumhurbaşkanlığı Oy Sayım Çetelesi 2023</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 10 }}>
        {reportConfig.schoolName && <span><strong>Okul İsmi:</strong> {reportConfig.schoolName}</span>}
        {reportConfig.boxNo && <span><strong>Sandık No:</strong> {reportConfig.boxNo}</span>}
      </div>
      <div>
        <Grid container spacing={3}>
          {candidates.map((candidate, index) => (
            <Grid item xs={6} key={index}>
              <div style={{
                paddingRight: (index !== candidates.length - 1) ? 40 : undefined,
                borderRight: (index !== candidates.length - 1) ? '2px solid black' : undefined,
                minWidth: 130,
              }}>
                <img alt={candidate.name} src={candidate.image} width={100} />
                <Typography style={{
                  fontWeight: 700
                }}>
                  {candidate.name}
                </Typography>
                <Typography style={{
                  fontSize: 60,
                  fontWeight: 700,
                }}>
                  {candidate.votes}
                </Typography>
              </div>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3} style={{
          paddingTop: 10,
          borderTop: '2px solid black',
          width: '100%',
          marginTop: 10,
        }}>
          <Grid item xs={4}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <Typography variant="h6" style={{
                fontWeight: 700,
              }}>
                TOPLAM OY
              </Typography>
              <Typography style={{
                fontSize: 48,
                fontWeight: 700,
              }}>
                {totalVotes.toString()}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <Typography variant="h6" style={{
                fontWeight: 700,
              }}>
                GEÇERLİ OY
              </Typography>
              <Typography style={{
                fontSize: 48,
                fontWeight: 700,
              }}>
                {validVotes.toString()}
              </Typography>
            </div>
          </Grid>
          <Grid item xs={4}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <Typography variant="h6" style={{
                fontWeight: 700,
              }}>
                GEÇERSİZ OY
              </Typography>
              <Typography style={{
                fontSize: 48,
                fontWeight: 700,
              }}>
                {invalidVotes.toString()}
              </Typography>
            </div>
          </Grid>
        </Grid>

        <Grid container spacing={3} style={{
          paddingTop: 10,
          borderTop: '2px solid black',
          width: '100%',
          marginTop: 20,
        }}>
          <Grid item xs={6} style={{
            paddingRight: 40,
            borderRight: '2px solid black',
            minWidth: 130,
          }}>
            <Typography variant="h6" style={{
              fontWeight: 700,
            }}>
              TÜM OYLAR
            </Typography>
            <center>
              <PieChart data={totalVotesData} />
            </center>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6" style={{
              fontWeight: 700,
            }}>
              GEÇERLİ OYLAR
            </Typography>
            <center>
              <PieChart data={validVotesData} />
            </center>
          </Grid>
        </Grid>
      </div>

      <div style={{ marginTop: 40, marginBottom: 40, textAlign: 'left' }}>
        Resmi bir belge değildir ve girdiler kayıt altına alınmamaktadır. Parti bağımsız, tüm müşahitlerin oy sayımı sırasında hızlı bir şekilde kontrol yapabilmelerini kolaylaştırmak amacıyla açık kaynak olarak geliştirilmiştir.
        <br />
        <br />
        <span style={{ fontWeight: 600 }}>https://oysayim.netlify.app | https://oysayim.vercel.app</span>
      </div>

    </div>
  )
}

export const generateReport = (reportConfig: ReportConfig): Promise<void> => {
  const reportContent = document.getElementById('reportContent');

  if (reportContent) {
    reportContent.style.display = 'block';

    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (reportConfig.format === 'PNG') {
          domtoimage.toBlob(reportContent)
            .then((blob) => {
              saveAs(blob!, `OyRaporu_${new Date().getTime()}.png`);
              reportContent.style.display = 'none';
              resolve();
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          domtoimage.toPng(reportContent)
            .then((dataUrl) => {
              const pdf = new jsPDF();
              const imgProps = pdf.getImageProperties(dataUrl);
              const pdfWidth = pdf.internal.pageSize.getWidth();
              const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
              pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
              pdf.save(`OyRaporu_${new Date().getTime()}.pdf`);
              reportContent.style.display = 'none';
              resolve();
            })
            .catch((error) => {
              reject(error);
            });
        }
      }, 2000);
    });
  } else {
    return Promise.reject(new Error('Report content element not found.'));
  }
};

export default ReportContent;
