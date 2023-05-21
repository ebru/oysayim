import { FC, useState, useEffect, ChangeEvent } from 'react';
import {
  Button,
  Container,
  Typography,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Radio
} from '@mui/material';
import jsPDF from 'jspdf';
import domtoimage from 'dom-to-image';

import ErdoganImage from './assets/images/Erdogan.png';
import KilicdarogluImage from './assets/images/Kilicdaroglu.png';

interface Candidate {
  name: string;
  image: string;
  votes: number;
}

interface PastVotes {
  timestamp: number;
  votes: Candidate[];
  invalidVotes: number;
  validVotes: number;
  totalVotes: number;
}

interface ReportConfigType {
  schoolName: string;
  boxNo: string;
  outputFormat: 'png' | 'pdf';
  includeHistory: boolean;
};

const candidateData: Candidate[] = [
  { name: "RECEP TAYYİP ERDOĞAN", image: ErdoganImage, votes: 0 },
  { name: "KEMAL KILIÇDAROĞLU", image: KilicdarogluImage, votes: 0 },
];

const initialReportConfig: ReportConfigType = {
  schoolName: '',
  boxNo: '',
  outputFormat: 'png',
  includeHistory: false,
};

const App: FC = () => {
  const [candidates, setCandidates] = useState(candidateData);
  const [invalidVotes, setInvalidVotes] = useState(0);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [actionType, setActionType] = useState<'reset' | 'clear' | null>(null);
  const [pastVotes, setPastVotes] = useState<PastVotes[]>([]);
  const [logOpen, setLogOpen] = useState(false);
  const [reportConfigOpen, setReportConfigOpen] = useState(false);
  const [reportConfig, setReportConfig] = useState<ReportConfigType>(initialReportConfig);

  useEffect(() => {
    const savedVotes = localStorage.getItem("votes");
    const savedInvalidVotes = localStorage.getItem("invalidVotes");
    const savedPastVotes = localStorage.getItem("pastVotes");

    if (savedVotes) {
      const votes = JSON.parse(savedVotes);
      setCandidates(candidateData.map((candidate, index) => ({ ...candidate, votes: votes[index] })));
    }
    if (savedInvalidVotes) {
      setInvalidVotes(Number(savedInvalidVotes));
    }
    if (savedPastVotes) {
      setPastVotes(JSON.parse(savedPastVotes));
    }
  }, []);

  const handleVote = (index: number) => {
    const newCandidates = [...candidates];
    newCandidates[index].votes++;
    setCandidates(newCandidates);
    localStorage.setItem("votes", JSON.stringify(newCandidates.map(candidate => candidate.votes)));
  };

  const handleRemoveVote = (index: number) => {
    const newCandidates = [...candidates];
    if (newCandidates[index].votes > 0) {
      newCandidates[index].votes--;
      setCandidates(newCandidates);
      localStorage.setItem("votes", JSON.stringify(newCandidates.map(candidate => candidate.votes)));
    }
  };

  const handleInvalidVote = () => {
    setInvalidVotes(prevInvalidVotes => prevInvalidVotes + 1);
    localStorage.setItem("invalidVotes", String(invalidVotes + 1));
  };

  const handleRemoveInvalidVote = () => {
    if (invalidVotes > 0) {
      setInvalidVotes(prevInvalidVotes => prevInvalidVotes - 1);
      localStorage.setItem("invalidVotes", String(invalidVotes - 1));
    }
  };

  const handleReset = () => {
    const validVotes = candidates.reduce((acc, candidate) => acc + candidate.votes, 0);
    const totalVotes = validVotes + invalidVotes;

    const newPastVotes = { timestamp: Date.now(), votes: [...candidates], invalidVotes, validVotes, totalVotes };
    setPastVotes(prevPastVotes => {
      const updatedPastVotes = [newPastVotes, ...prevPastVotes];
      localStorage.setItem("pastVotes", JSON.stringify(updatedPastVotes)); // Storing in local storage
      return updatedPastVotes;
    });

    const resetCandidates = candidates.map(candidate => ({ ...candidate, votes: 0 }));
    setCandidates(resetCandidates);
    setInvalidVotes(0);

    localStorage.removeItem("votes");
    localStorage.removeItem("invalidVotes");
  };

  const handleClearPastVotes = () => {
    setPastVotes([]);
    localStorage.removeItem('pastVotes');
  };

  const handleResetClick = () => {
    setActionType('reset');
    setOpenConfirmation(true);
  }

  const handleClearPastVotesClick = () => {
    setActionType('clear');
    setOpenConfirmation(true);
  }

  const handleConfirmationClose = (confirmed: boolean) => {
    setOpenConfirmation(false);
    if (confirmed) {
      if (actionType === 'reset') {
        handleReset();
      } else if (actionType === 'clear') {
        handleClearPastVotes();
      }
    }
    setActionType(null);
  };

  const handleInputChange = (prop: keyof ReportConfigType) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setReportConfig({ ...reportConfig, [prop]: event.target.value });
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setReportConfig({ ...reportConfig, includeHistory: event.target.checked });
  };

  const handleGenerateReport = () => {
    // const content;  create content to print

    // if (reportConfig.outputFormat === 'pdf') {
    //   const pdf = new jsPDF();
    //   pdf.text(`School Name: ${reportConfig.schoolName}`, 10, 10);
    //   pdf.text(`Box No: ${reportConfig.boxNo}`, 10, 20);
    //   pdf.text(`Include History: ${reportConfig.includeHistory ? 'Yes' : 'No'}`, 10, 30);
    //   pdf.save('rapor.pdf');
    // } else {
    //   domtoimage.toPng(content)
    //     .then((dataUrl) => {
    //       const link = document.createElement('a');
    //       link.download = 'rapor.png';
    //       link.href = dataUrl;
    //       link.click();
    //     })
    //     .catch((error) => {
    //       console.error('oops, something went wrong!', error);
    //     });
    // }
  }


  return (
    <Container style={{
      maxWidth: 600,
      padding: 20,
      textAlign: 'center',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10,
        marginBottom: 20,
      }}>
        <Typography variant="h6" style={{
          fontWeight: 700,
          fontSize: 24,
          textAlign: 'left',
        }}>
          Cumhurbaşkanlığı Oy Sayım Çetelesi 2023
        </Typography>
        <Button variant="contained" color="error" onClick={handleResetClick}>
          Sıfırla
        </Button>
      </div>

      <Dialog open={openConfirmation} onClose={() => handleConfirmationClose(false)} maxWidth="xs" fullWidth>
        <DialogTitle style={{ fontWeight: 700 }}>Onay</DialogTitle>
        <DialogContent>
          <Typography>Emin misiniz? Bu işlem geri alınamaz.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirmationClose(false)}>İptal</Button>
          <Button onClick={() => handleConfirmationClose(true)} autoFocus style={{ fontWeight: 700 }}>
            Onayla
          </Button>
        </DialogActions>
      </Dialog>

      <Grid item xs={12}>
        <div style={{
          marginTop: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 10,
          borderTop: '2px solid black',
          marginBottom: -10,
        }}>
          <Typography variant="h6" style={{
            fontWeight: 700,
            marginBottom: -10,
          }}>
            TOPLAM OY
          </Typography>
          <Typography style={{
            fontSize: 48,
            fontWeight: 700,
          }}>
            {invalidVotes + candidates.reduce((acc, candidate) => acc + candidate.votes, 0)}
          </Typography>
          <div style={{
            display: 'flex',
            gap: 10,
          }}>
          </div>
        </div>
      </Grid>

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
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 5,
              }}>
                <Button variant="contained" color="primary" size="large" onClick={() => handleVote(index)} style={{
                  fontWeight: 700,
                  padding: '15px 10px',
                  fontSize: 20,
                  marginBottom: 20,
                  width: 120,
                }}>
                  Oy Ekle
                </Button>
                <Button variant="outlined" color="error" size="small" onClick={() => handleRemoveVote(index)} style={{
                  padding: '5px',
                }}>
                  Oy Çıkar
                </Button>
              </div>
            </div>
          </Grid>
        ))}
        <Grid item xs={12}>
          <div style={{
            marginTop: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 10,
            borderTop: '2px solid black',
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
              {invalidVotes}
            </Typography>
            <div style={{
              display: 'flex',
              gap: 10,
            }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleInvalidVote}
                style={{
                  fontWeight: 700,
                  fontSize: 20,
                }}
              >
                Oy Ekle
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={handleRemoveInvalidVote}
              >
                Oy Çıkar
              </Button>
            </div>
          </div>
        </Grid>
      </Grid>

      {logOpen && (
        <div style={{
          marginTop: 20,
          display: 'flex',
          flexDirection: 'column',
          paddingTop: 10,
          borderTop: '2px solid black',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
          }}>
            <Typography variant="h6" style={{
              fontWeight: 700,
            }}>
              GEÇMİŞ VERİLER
            </Typography>
            <Button onClick={() => setLogOpen(false)} style={{ fontWeight: 700 }}>Kapat</Button>
          </div>
          <div style={{ marginBottom: 10, textAlign: 'left' }}>
            Her sıfırlama esnasındaki son verileri göstermektedir.
          </div>

          {pastVotes.map((pastVote, index) => (
            <div key={index} style={{ borderBottom: '1px solid black', paddingBottom: 10, paddingTop: 10 }}>
              <Typography style={{ fontWeight: 700 }}>{new Date(pastVote.timestamp).toLocaleString('en-GB')}</Typography>
              {pastVote.votes.map((candidate, candidateIndex) => (
                <div key={candidateIndex}>
                  <Typography>{candidate.name}: {candidate.votes}</Typography>
                </div>
              ))}
              <Typography>GEÇERLİ OYLAR: {pastVote.validVotes}</Typography>
              <Typography>GEÇERSİZ OYLAR: {pastVote.invalidVotes}</Typography>
              <Typography>TOPLAM OYLAR: {pastVote.totalVotes}</Typography>
            </div>
          ))}

          {pastVotes.length > 0 ? (
            <div style={{ marginTop: 10 }}>
              <Button variant="contained" color="error" onClick={handleClearPastVotesClick}>
                GEÇMİŞİ TEMİZLE
              </Button>
            </div>
          ) : (
            <Typography style={{ color: '#999' }}>Geçmiş veri bulunmuyor.</Typography>
          )}
        </div>
      )}

      {!logOpen && (
        <div style={{
          marginTop: 20,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 10,
          borderTop: '2px solid black',
        }}>
          <Button onClick={() => setLogOpen(true)} style={{ fontWeight: 700, fontSize: 18 }}>
            GEÇMİŞ VERİLERİ GÖSTER
          </Button>
        </div>
      )}

      <div style={{
        marginTop: 20,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        borderTop: '2px solid black',
      }}>
        <Button style={{ fontWeight: 700, fontSize: 18 }} onClick={() => setReportConfigOpen(true)}>
          RAPOR OLUŞTUR
        </Button>
      </div>

      <Dialog open={reportConfigOpen} onClose={() => setReportConfigOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle style={{ fontWeight: 700 }}>Rapor Ayarları</DialogTitle>
        <DialogContent>
          <TextField
            label="Okul İsmi"
            value={reportConfig.schoolName}
            onChange={handleInputChange('schoolName')}
            fullWidth
            size={'small'}
            margin="normal"
          />
          <TextField
            label="Sandık No"
            value={reportConfig.boxNo}
            size={'small'}
            onChange={handleInputChange('boxNo')}
            fullWidth
            margin="normal"
          />
          <FormControl component="fieldset" style={{ marginTop: 10 }}>
            <FormLabel component="legend">Çıktı Biçimi</FormLabel>
            <RadioGroup
              value={reportConfig.outputFormat}
              onChange={handleInputChange('outputFormat')}
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <FormControlLabel value="png" control={<Radio />} label="PNG" />
              <FormControlLabel value="pdf" control={<Radio />} label="PDF" />
            </RadioGroup>
          </FormControl>
          <div>
            <FormControlLabel
              control={<Checkbox checked={reportConfig.includeHistory} onChange={handleCheckboxChange} />}
              label="Geçmişi Dahil Et"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportConfigOpen(false)}>İptal</Button>
          <Button onClick={handleGenerateReport} autoFocus style={{ fontWeight: 700 }}>
            Rapor Oluştur
          </Button>
        </DialogActions>
      </Dialog>

      <div style={{ marginTop: 40, marginBottom: 40, textAlign: 'left' }}>
        Resmi bir belge değildir ve girdiler kendi cihazınız dışında farklı bir yerde kayıt altına alınmamaktadır. Parti bağımsız, tüm müşahitlerin oy sayımı sırasında hızlı bir şekilde kontrol yapabilmelerini kolaylaştırmak amacıyla açık kaynak olarak geliştirilmiştir.
        <br />
        <br />
        <a href="https://github.com/ebru/oysayim" target="_blank" rel="noreferrer" style={{
          fontWeight: 700,
          color: 'black'
        }}>Kaynak</a>
      </div>
    </Container>
  );
};

export default App;
