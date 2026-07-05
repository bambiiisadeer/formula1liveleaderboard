export interface Driver {
  name: string;
  photo: string;
}

export interface Team {
  key: string;
  name: string;
  color: string;
  logo: string;
  drivers: Driver[];
}

export const TEAMS: Team[] = [
  {
    key: "mercedes",
    name: "Mercedes",
    color: "#75F1D3",
    logo: "src/assets/images/Mercedes/mercedeslogo.png",
    drivers: [
      {
        name: "George Russell",
        photo: "src/assets/images/Mercedes/george.png",
      },
      { name: "Kimi Antonelli", photo: "src/assets/images/Mercedes/kimi.png" },
    ],
  },
  {
    key: "ferrari",
    name: "Ferrari",
    color: "#D52E37",
    logo: "src/assets/images/Ferrari/ferrarilogo.png",
    drivers: [
      {
        name: "Charles Leclerc",
        photo: "src/assets/images/Ferrari/charles.png",
      },
      { name: "Lewi Hamilton", photo: "src/assets/images/Ferrari/lewis.png" },
    ],
  },
  {
    key: "mclaren",
    name: "McLaren",
    color: "#ef8733",
    logo: "src/assets/images/McLaren/mclarenlogo.png",
    drivers: [
      {
        name: "Lando Norris",
        photo: "src/assets/images/McLaren/lando.png",
      },
      { name: "Oscar Piastri", photo: "src/assets/images/McLaren/oscar.png" },
    ],
  },
  {
    key: "redbull",
    name: "Red Bull",
    color: "#4570C0",
    logo: "src/assets/images/RedBull/redbulllogo.png",
    drivers: [
      {
        name: "Max Verstappen",
        photo: "src/assets/images/RedBull/max.png",
      },
      { name: "Isack Hadjar", photo: "src/assets/images/RedBull/isack.png" },
    ],
  },
  {
    key: "alpine",
    name: "Alpine",
    color: "#479FE2",
    logo: "src/assets/images/Alpine/alpinelogo.png",
    drivers: [
      {
        name: "Pierre Gasly",
        photo: "src/assets/images/Alpine/pierre.png",
      },
      { name: "Franco Colapinto", photo: "src/assets/images/Alpine/franco.png" },
    ],
  },
  {
    key: "racingbulls",
    name: "Racing Bulls",
    color: "#6692FF",
    logo: "src/assets/images/RacingBulls/racingbullslogo.png",
    drivers: [
      {
        name: "Liam Lawson",
        photo: "src/assets/images/RacingBulls/liam.png",
      },
      { name: "Arvid Lindblad", photo: "src/assets/images/RacingBulls/arvid.png" },
    ],
  },
  {
    key: "haas",
    name: "Haas",
    color: "#DEE1E2",
    logo: "src/assets/images/Haas/haaslogo.png",
    drivers: [
      {
        name: "Esteban Ocon",
        photo: "src/assets/images/Haas/esteban.png",
      },
      { name: "Oliver Bearman", photo: "src/assets/images/Haas/oliver.png" },
    ],
  },
  {
    key: "williams",
    name: "Williams",
    color: "#1868DB",
    logo: "src/assets/images/Williams/williamslogo.png",
    drivers: [
      {
        name: "Carlos Sainz",
        photo: "src/assets/images/Williams/carlos.png",
      },
      { name: "Alexander Albon", photo: "src/assets/images/Williams/alexander.png" },
    ],
  },
  {
    key: "audi",
    name: "Audi",
    color: "#FF2D00",
    logo: "src/assets/images/Audi/audilogo.png",
    drivers: [
      {
        name: "Nico Hülkenberg",
        photo: "src/assets/images/Audi/nico.png",
      },
      { name: "Gabriel Aubry", photo: "src/assets/images/Audi/gabriel.png" },
    ],
  },
  {
    key: "astonmartin",
    name: "Aston Martin",
    color: "#229971",
    logo: "src/assets/images/AstonMartin/astonmartinlogo.png",
    drivers: [
      {
        name: "Fernando Alonso",
        photo: "src/assets/images/AstonMartin/fernando.png",
      },
      { name: "Lance Stroll", photo: "src/assets/images/AstonMartin/lance.png" },
    ],
  },
  {
    key: "cadillac",
    name: "Cadillac",
    color: "#AAAAAD",
    logo: "src/assets/images/Cadillac/cadillaclogo.png",
    drivers: [
      {
        name: "Sergio Perez",
        photo: "src/assets/images/Cadillac/sergio.png",
      },
      { name: "Valtteri Bottas", photo: "src/assets/images/Cadillac/valtteri.png" },
    ],
  },
];