import AlAhlyLogo from "../assets/teams/Al_Ahly_SC_logo_23.svg";
import ZamalekLogo from "../assets/teams/zamalek-sc-footballlogos-org.svg";
import PyramidsLogo from "../assets/teams/pyramids-fc-footballlogos-org.svg";
import ModernLogo from "../assets/teams/modern-sport-footballlogos-org.png";
import MasryLogo from "../assets/teams/al-masry-footballlogos-org.svg";
import ENPPILogo from "../assets/teams/enppi-footballlogos-org.svg";
import CeramicaLogo from "../assets/teams/ceramica-cleopatra-fc-footballlogos-org.png";
import SmouhaLogo from "../assets/teams/smouha-footballlogos-org.png";
import IttihadLogo from "../assets/teams/ittihad-alexandria-footballlogos-org.png";
import GounaLogo from "../assets/teams/El_Gouna_FC_Logo_2017.png";
import IsmailyLogo from "../assets/teams/ismaily-sc-footballlogos-org.svg";
import GaishLogo from "../assets/teams/talaea-el-gaish-footballlogos-org.svg";
import PharcoLogo from "../assets/teams/pharco-fc-footballlogos-org.png";
import BankLogo from "../assets/teams/national-bank-of-egypt-footballlogos-org.png";
import MahallaLogo from "../assets/teams/ghazl-el-mahalla-footballlogos-org.svg";
import MokawloonLogo from "../assets/teams/el-mokawloon-footballlogos-org.png";
import DeglaLogo from "../assets/teams/wadi-degla-footballlogos-org.svg";
import ZedLogo from "../assets/teams/ZED_FC_logo.png";

import Avatar from "../assets/avatar/avatar.jpeg";
import Avatar2 from "../assets/avatar/avatar2.jpeg";

export const standings = [
  {
    position: 1,
    team: {
      id: 1,
      name: "Al Ahly",
      logo: AlAhlyLogo,
      coach: "Jesper Thorup",
      stadium: {
        name: "Cairo International Stadium",
        city: "Cairo",
        capacity: 74100,
      },
      avatar: Avatar,
    },
    played: 14,
    wins: 9,
    draws: 4,
    losses: 1,
    goalsFor: 22,
    goalsAgainst: 10,
    goalDifference: 12,
    points: 31,
  },
  {
    position: 2,
    team: {
      id: 2,
      name: "Zamalek",
      logo: ZamalekLogo,
      coach: "José Peseiro",
      stadium: {
        name: "Cairo International Stadium",
        city: "Cairo",
        capacity: 74100,
      },
    },
    played: 14,
    wins: 8,
    draws: 3,
    losses: 3,
    goalsFor: 20,
    goalsAgainst: 12,
    goalDifference: 8,
    points: 27,
  },
  {
    position: 3,
    team: {
      id: 3,
      name: "Pyramids",
      logo: PyramidsLogo,
      coach: "Krunoslav Jurčić",
      stadium: {
        name: "New Suez Stadium",
        city: "Suez",
        capacity: 27000, // From soccerway [citation:5]
      },
    },
    played: 14,
    wins: 7,
    draws: 4,
    losses: 3,
    goalsFor: 18,
    goalsAgainst: 11,
    goalDifference: 7,
    points: 25,
  },
  {
    position: 4,
    team: {
      id: 4,
      name: "Future FC",
      logo: ModernLogo,
      coach: "Magdy Abdelaaty",
      stadium: {
        name: "WE Al-Ahly Stadium",
        city: "Cairo",
        capacity: 30000, // From soccerway [citation:2]
      },
    },
    played: 14,
    wins: 6,
    draws: 5,
    losses: 3,
    goalsFor: 17,
    goalsAgainst: 13,
    goalDifference: 4,
    points: 23,
  },
  {
    position: 5,
    team: {
      id: 5,
      name: "Al Masry",
      logo: MasryLogo,
      coach: "Tarek El Ashry",
      stadium: {
        name: "Al Masry Club Stadium",
        city: "Port Said",
        capacity: 18000, // Estimated (similar to Borg El Arab smaller stadiums)
      },
    },
    played: 14,
    wins: 6,
    draws: 3,
    losses: 5,
    goalsFor: 15,
    goalsAgainst: 14,
    goalDifference: 1,
    points: 21,
  },
  {
    position: 6,
    team: {
      id: 6,
      name: "ENPPI",
      logo: ENPPILogo,
      coach: "Sayed Yassin",
      stadium: {
        name: "Petrosport Stadium",
        city: "Cairo",
        capacity: 16000, // From Mapcarta [citation:6]
      },
    },
    played: 14,
    wins: 5,
    draws: 5,
    losses: 4,
    goalsFor: 14,
    goalsAgainst: 13,
    goalDifference: 1,
    points: 20,
  },
  {
    position: 7,
    team: {
      id: 7,
      name: "Ceramica Cleopatra",
      logo: CeramicaLogo,
      coach: "Ayman El Ramady",
      stadium: {
        name: "Cairo International Stadium",
        city: "Cairo",
        capacity: 74100,
      },
    },
    played: 14,
    wins: 5,
    draws: 4,
    losses: 5,
    goalsFor: 13,
    goalsAgainst: 14,
    goalDifference: -1,
    points: 19,
  },
  {
    position: 8,
    team: {
      id: 8,
      name: "Smouha",
      logo: SmouhaLogo,
      coach: "Ahmed Samy",
      stadium: {
        name: "Alexandria Stadium",
        city: "Alexandria",
        capacity: 13660, // From Wikipedia [citation:3]
      },
    },
    played: 14,
    wins: 4,
    draws: 6,
    losses: 4,
    goalsFor: 12,
    goalsAgainst: 12,
    goalDifference: 0,
    points: 18,
  },
  {
    position: 9,
    team: {
      id: 9,
      name: "Al Ittihad",
      logo: IttihadLogo,
      coach: "Nabil Abou El Nasr",
      stadium: {
        name: "Alexandria Stadium",
        city: "Alexandria",
        capacity: 13660, // From Wikipedia [citation:3]
      },
    },
    played: 14,
    wins: 4,
    draws: 5,
    losses: 5,
    goalsFor: 11,
    goalsAgainst: 13,
    goalDifference: -2,
    points: 17,
  },
  {
    position: 10,
    team: {
      id: 10,
      name: "El Gouna",
      logo: GounaLogo,
      coach: "Alaa Abdel Aal",
      stadium: {
        name: "Khaled Bichara Stadium",
        city: "El Gouna",
        capacity: 14000, // From Wikipedia [citation:4]
      },
    },
    played: 14,
    wins: 4,
    draws: 4,
    losses: 6,
    goalsFor: 10,
    goalsAgainst: 15,
    goalDifference: -5,
    points: 16,
  },
  {
    position: 11,
    team: {
      id: 11,
      name: "Ismaily",
      logo: IsmailyLogo,
      coach: "Ehab Galal",
      stadium: {
        name: "Ismailia Stadium",
        city: "Ismailia",
        capacity: 30000, // From Wikipedia (upgraded for 2019 AFCON) [citation:10]
      },
    },
    played: 14,
    wins: 3,
    draws: 6,
    losses: 5,
    goalsFor: 9,
    goalsAgainst: 13,
    goalDifference: -4,
    points: 15,
  },
  {
    position: 12,
    team: {
      id: 12,
      name: "Talaea El Gaish",
      logo: GaishLogo,
      coach: "Abdel Hamid Bassiouny",
      stadium: {
        name: "30 June Air Defence Stadium",
        city: "Cairo",
        capacity: 30000, // From foot-africa [citation:7]
      },
    },
    played: 14,
    wins: 3,
    draws: 5,
    losses: 6,
    goalsFor: 8,
    goalsAgainst: 14,
    goalDifference: -6,
    points: 14,
  },
  {
    position: 13,
    team: {
      id: 13,
      name: "Pharco",
      logo: PharcoLogo,
      coach: "Ahmed Khattab",
      stadium: {
        name: "Haras El Hodoud Stadium",
        city: "Alexandria",
        capacity: 12000, // Estimated (smaller Alexandria stadium)
      },
    },
    played: 14,
    wins: 3,
    draws: 4,
    losses: 7,
    goalsFor: 9,
    goalsAgainst: 16,
    goalDifference: -7,
    points: 13,
  },
  {
    position: 14,
    team: {
      id: 14,
      name: "National Bank",
      logo: BankLogo,
      coach: "Tarek Mostafa",
      stadium: {
        name: "Cairo International Stadium",
        city: "Cairo",
        capacity: 74100,
      },
    },
    played: 14,
    wins: 3,
    draws: 3,
    losses: 8,
    goalsFor: 10,
    goalsAgainst: 18,
    goalDifference: -8,
    points: 12,
  },
  {
    position: 15,
    team: {
      id: 15,
      name: "Ghazl El Mahalla",
      logo: MahallaLogo,
      coach: "Eslam Eldewany",
      stadium: {
        name: "Ghazl El Mahalla Stadium",
        city: "El Mahalla El Kubra",
        capacity: 20000, // From Wikipedia [citation:8]
      },
    },
    played: 14,
    wins: 2,
    draws: 5,
    losses: 7,
    goalsFor: 8,
    goalsAgainst: 17,
    goalDifference: -9,
    points: 11,
  },
  {
    position: 16,
    team: {
      id: 16,
      name: "El Mokawloon",
      logo: MokawloonLogo,
      coach: "Mohamed Ouda",
      stadium: {
        name: "Arab Contractors Stadium",
        city: "Cairo",
        capacity: 35000, // From The Free Dictionary [citation:9]
      },
    },
    played: 14,
    wins: 2,
    draws: 4,
    losses: 8,
    goalsFor: 7,
    goalsAgainst: 18,
    goalDifference: -11,
    points: 10,
  },
  {
    position: 17,
    team: {
      id: 17,
      name: "Wadi Degla",
      logo: DeglaLogo,
      coach: "Mohamed Helmy",
      stadium: {
        name: "Petrosport Stadium",
        city: "Cairo",
        capacity: 16000, // Same as ENPPI (shared stadium) [citation:6]
      },
    },
    played: 14,
    wins: 1,
    draws: 5,
    losses: 8,
    goalsFor: 6,
    goalsAgainst: 17,
    goalDifference: -11,
    points: 8,
  },
  {
    position: 18,
    team: {
      id: 18,
      name: "Zed",
      logo: ZedLogo,
      coach: "Magdy Abdelaaty",
      stadium: {
        name: "Cairo International Stadium",
        city: "Cairo",
        capacity: 74100,
      },
    },
    played: 14,
    wins: 1,
    draws: 3,
    losses: 10,
    goalsFor: 5,
    goalsAgainst: 20,
    goalDifference: -15,
    points: 6,
  },
];

export const previousStandings = [
  { team: { id: 1, name: "Al Ahly" }, position: 3 },
  { team: { id: 2, name: "Zamalek" }, position: 1 },
  { team: { id: 3, name: "Pyramids" }, position: 5 },
  { team: { id: 4, name: "Ismaily" }, position: 7 },
  { team: { id: 5, name: "Future FC" }, position: 2 },
  { team: { id: 6, name: "ENPPI" }, position: 8 },
  { team: { id: 7, name: "Ghazl El Mahalla" }, position: 6 },
  { team: { id: 8, name: "Smouha" }, position: 4 },
  { team: { id: 9, name: "Ceramica Cleopatra" }, position: 9 },
  { team: { id: 10, name: "Al Masry" }, position: 10 },
  { team: { id: 11, name: "Pharco" }, position: 11 },
  { team: { id: 12, name: "El Dakhleya" }, position: 12 },
  { team: { id: 13, name: "El Gouna" }, position: 13 },
  { team: { id: 14, name: "Haras El Hodoud" }, position: 14 },
  { team: { id: 15, name: "National Bank" }, position: 15 },
  { team: { id: 16, name: "Baladiyat El Mahalla" }, position: 16 },
  { team: { id: 17, name: "Aswan" }, position: 17 },
  { team: { id: 18, name: "Tala'ea El Gaish" }, position: 18 },
];
