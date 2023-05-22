export interface Candidate {
  name: string;
  image: string;
  votes: number;
}

export interface PastVotes {
  timestamp: number;
  votes: Candidate[];
  invalidVotes: number;
  validVotes: number;
  totalVotes: number;
}

export interface ReportConfig {
  schoolName: string;
  boxNo: string;
  format: 'PNG' | 'PDF';
}
