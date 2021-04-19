// json list http://data.nba.net/10s/prod/v1/today.json

// TODO variable names are very confusing. Clarify purpose to distinguish between them
let confRank = {}
let init = 0;
let visibleGames = [];
let closeGameReminderTracker = [];
let team;
let mode;
let audio = new Audio('Buzzer_Beater.mp3');
let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
let yyyy = today.getFullYear();
today = yyyy+mm+dd;

let standings = "http://data.nba.net/prod/v1/current/standings_all_no_sort_keys.json";
let standings_conference = "http://data.nba.net/10s/prod/v1/current/standings_conference.json";
// playoffs only uses team ids instead of tricodes or names
let playoffs = "http://data.nba.net/10s/prod/v1/2019/playoffsBracket.json";
let isDone = false;




// TODO reset primary and secondary to originals and add tertiary black or white
let dict = {
    ATL: {
        name: "Atlanta Hawks",
        primary: "#E03A3E",
        secondary: "#C1D32F",
        tertiary: "#FFFFFF"
    },
    BOS: {
        name: "Boston Celtics",
        primary: "#007A33",
        secondary: "#BA9653",
        tertiary: "#FFFFFF"
    },
    BKN: {
        name: "Brooklyn Nets",
        primary: "#000000",
        secondary: "#FFFFFF",
        tertiary: "#FFFFFF"
    },
    CHA: {
        name: "Charlotte Hornets",
        primary: "#1D1160",
        secondary: "#00788C",
        tertiary: "#FFFFFF"
    },
    CHI: {
        name: "Chicago Bulls",
        primary: "#CE1141",
        secondary: "#000000",
        tertiary: "#FFFFFF"
    },
    CLE: {
        name: "Cleveland Cavaliers",
        primary: "#860038",
        secondary: "#041E42",
        tertiary: "#FFFFFF"
    },
    DAL: {
        name: "Dallas Mavericks",
        primary: "#00538C",
        secondary: "#002B5E",
        tertiary: "#FFFFFF"
    },
    DEN: {
        name: "Denver Nuggets",
        primary: "#0E2240",
        secondary: "#FEC524",
        tertiary: "#FFFFFF"
    },
    DET: {
        name: "Detroit Pistons",
        primary: "#C8102E",
        secondary: "#1D42BA",
        tertiary: "#FFFFFF"
    },
    GSW: {
        name: "Golden State Warriors",
        primary: "#1D428A",
        secondary: "#FFC72C",
        tertiary: "#FFFFFF"
    },
    HOU: {
        name: "Houston Rockets",
        primary: "#CE1141",
        secondary: "#000000",
        tertiary: "#FFFFFF"
    },
    IND: {
        name: "Indiana Pacers",
        primary: "#002D62",
        secondary: "#FDBB30",
        tertiary: "#FFFFFF"
    },
    LAC: {
        name: "Los Angeles Clippers",
        primary: "#C8102E",
        secondary: "#1D428A",
        tertiary: "#FFFFFF"
    },
    LAL: {
        name: "Los Angeles Lakers",
        primary: "#552583",
        secondary: "#FDB927",
        tertiary: "#FFFFFF"
    },
    MEM: {
        name: "Memphis Grizzlies",
        primary: "#5D76A9",
        secondary: "#12173F",
        tertiary: "#FFFFFF"
    },
    MIA: {
        name: "Miami Heat",
        primary: "#98002E",
        secondary: "#F9A01B",
        tertiary: "#FFFFFF"
    },
    MIL: {
        name: "Milwaukee Bucks",
        primary: "#00471B",
        secondary: "#EEE1C6",
        tertiary: "#FFFFFF"
    },
    MIN: {
        name: "Minnesota Timberwolves",
        primary: "#0C2340",
        secondary: "#236192",
        tertiary: "#FFFFFF"
    },
    NOP: {
        name: "New Orleans Pelicans",
        primary: "#0C2340",
        secondary: "#C8102E",
        tertiary: "#FFFFFF"
    },
    NYK: {
        name: "New York Knicks",
        primary: "#006BB6",
        secondary: "#F58426",
        tertiary: "#FFFFFF"
    },
    OKC: {
        name: "Oklahoma City Thunder",
        primary: "#007AC1",
        secondary: "#EF3B24",
        tertiary: "#FFFFFF"
    },
    ORL: {
        name: "Orlando Magic",
        primary: "#0077C0",
        secondary: "#C4CED4",
        tertiary: "#FFFFFF"
    },
    PHI: {
        name: "Philadelphia 76ers",
        primary: "#006BB6",
        secondary: "#ED174C",
        tertiary: "#FFFFFF"
    },
    PHX: {
        name: "Phoenix Suns",
        primary: "#1D1160",
        secondary: "#E56020",
        tertiary: "#FFFFFF"
    },
    POR: {
        name: "Portland Trail Blazers",
        primary: "#E03A3E",
        secondary: "#000000",
        tertiary: "#FFFFFF"
    },
    SAC: {
        name: "Sacramento Kings",
        primary: "#5A2D81",
        secondary: "#63727A",
        tertiary: "#FFFFFF"
    },
    SAS: {
        name: "San Antonio Spurs",
        primary: "#000000",
        secondary: "#C4CED4",
        tertiary: "#FFFFFF"
    },
    TOR: {
        name: "Toronto Raptors",
        primary: "#CE1141",
        secondary: "#000000",
        tertiary: "#FFFFFF"
    },
    UTA: {
        name: "Utah Jazz",
        primary: "#002B5C",
        secondary: "#00471B",
        tertiary: "#FFFFFF"
    },
    WAS: {
        name: "Washington Wizards",
        primary: "#002B5C",
        secondary: "#E31837",
        tertiary: "#FFFFFF"
    }
}

let teamIds = new Map();