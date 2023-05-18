import { FC, useState, useEffect } from 'react';
import { Button, Container, Typography, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ErdoganImage from './assets/images/Erdogan.png';
import KilicdarogluImage from './assets/images/Kilicdaroglu.png';

interface Candidate {
  name: string;
  image: string;
  votes: number;
}

const candidateData: Candidate[] = [
  { name: "RECEP TAYYİP ERDOĞAN", image: ErdoganImage, votes: 0 },
  { name: "KEMAL KILIÇDAROĞLU", image: KilicdarogluImage, votes: 0 },
];

const App: FC = () => {
  const [candidates, setCandidates] = useState(candidateData);
  const [schoolName, setSchoolName] = useState('');
  const [boxNo, setBoxNo] = useState('');
  const [invalidVotes, setInvalidVotes] = useState(0);
  const [openConfirmation, setOpenConfirmation] = useState(false);

  useEffect(() => {
    const savedVotes = localStorage.getItem("votes");

    if (savedVotes) {
      const votes = JSON.parse(savedVotes);
      setCandidates(candidateData.map((candidate, index) => ({ ...candidate, votes: votes[index] })));
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

  const handleSchoolNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    setSchoolName(newName);
    localStorage.setItem("schoolName", newName);
  };

  const handleBoxNoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newBoxNo = event.target.value;
    setBoxNo(newBoxNo);
    localStorage.setItem("boxNo", newBoxNo);
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
    const resetCandidates = candidates.map(candidate => ({ ...candidate, votes: 0 }));
    setCandidates(resetCandidates);
    setSchoolName('');
    setBoxNo('');
    setInvalidVotes(0);
    localStorage.removeItem("votes");
    localStorage.removeItem("schoolName");
    localStorage.removeItem("boxNo");
    localStorage.removeItem("invalidVotes");
  };

  const handleResetClick = () => {
    setOpenConfirmation(true);
  }

  const handleConfirmationClose = (confirmed: boolean) => {
    setOpenConfirmation(false);
    if (confirmed) {
      handleReset();
    }
  };

  useEffect(() => {
    const savedVotes = localStorage.getItem("votes");
    const savedSchoolName = localStorage.getItem("schoolName");
    const savedBoxNo = localStorage.getItem("boxNo");
    const savedInvalidVotes = localStorage.getItem("invalidVotes");

    if (savedVotes) {
      const votes = JSON.parse(savedVotes);
      setCandidates(candidateData.map((candidate, index) => ({ ...candidate, votes: votes[index] })));
    }

    if (savedSchoolName) {
      setSchoolName(savedSchoolName);
    }

    if (savedBoxNo) {
      setBoxNo(savedBoxNo);
    }

    if (savedInvalidVotes) {
      setInvalidVotes(Number(savedInvalidVotes));
    }
  }, []);

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

      {/* <Grid container spacing={3}>
        <Grid item xs={12}>
          <div style={{ marginBottom: 10 }}>
            <TextField
              label="Okul İsmi"
              size='small'
              variant="outlined"
              value={schoolName}
              onChange={handleSchoolNameChange}
              fullWidth
            />
          </div>
          <div>
            <TextField
              label="Sandık No"
              size='small'
              variant="outlined"
              value={boxNo}
              onChange={handleBoxNoChange}
              fullWidth
            />
          </div>
        </Grid>
      </Grid> */}
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
            paddingTop: 20,
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
        <Grid item xs={12}>
          <div style={{
            marginTop: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: 20,
            borderTop: '2px solid black',
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
              {invalidVotes + candidates.reduce((acc, candidate) => acc + candidate.votes, 0)}
            </Typography>
            <div style={{
              display: 'flex',
              gap: 10,
            }}>
            </div>
          </div>
        </Grid>
      </Grid>
      <div style={{ marginTop: 40, marginBottom: 40, textAlign: 'left' }}>
        Resmi bir belge değildir ve girdiler kayıt altına alınmamaktadır. Parti bağımsız, tüm müşahitlerin oy sayımı sırasında hızlı bir şekilde kontrol yapabilmelerini kolaylaştırmak amacıyla açık kaynak olarak geliştirilmiştir.
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
