
// json list http://data.nba.net/10s/prod/v1/today.json
// cors https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe/43881141#43881141
// make own server eventually refering to above link

addText("http://nba-streams.xyz/stream/los-angeles-lakers-live-stream/");
var dict = {
    ATL: "Atlanta Hawks",
    BKN: "Brooklyn Nets",
    BOS: "Boston Celtics",
    CHA: "Charlotte Hornets",
    CHI: "Chicago Bulls",
    CLE: "Cleveland Cavaliers",
    DAL: "Dallas Mavericks",
    DEN: "Denver Nuggets",
    DET: "Detroit Pistons",
    GSW: "Golden State Warriors",
    HOU: "Houston Rockets",
    IND: "Indiana Pacers",
    LAC: "Los Angeles Clippers",
    LAL: "Los Angeles Lakers",
    MEM: "Memphis Grizzlies",
    MIA: "Miami Heat",
    MIL: "Milwaukee Bucks",
    MIN: "Minnesota Timberwolves",
    NOP: "New Orleans Pelicans",
    NYK: "New York Knicks",
    OKC: "Oklahoma City Thunder",
    ORL: "Orlando Magic",
    PHI: "Philadelphia 76ers",
    PHX: "Phoenix Suns",
    POR: "Portland Trail Blazers",
    SAC: "Sacramento Kings",
    SAS: "San Antonio Spurs",
    TOR: "Toronto Raptors",
    UTA: "Utah Jazz",
    WAS: "Washington Wizards"
}

let init = 0;
let visibleGames = [];
let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
let yyyy = today.getFullYear();

today = yyyy+mm+dd;

const queryString = decodeURIComponent(window.location.search).substring(0);
if (queryString != "") {
    today = queryString.substring(1);
}


$("#btnToday").on("click", () => {
    today = yyyy+mm+dd;
    window.location.search = "?" + today;
})
$("#btnPrevious").on("click", () => {
    changeDate(-1);
    window.location.search = "?" + today;
})
$("#btnNext").on("click", () => {
    changeDate(1);
    window.location.search = "?" + today;
})

function changeDate (value) {
    dd = parseInt(today.substring(6));
    mm = parseInt(today.substring(4, 6));
    yyyy = parseInt(today.substring(0, 4));

    dd = dd + value;
    if (dd == 0) { //negative
        mm = mm - 1;
        if (mm == 0) {
            yyyy = yyyy - 1;
            mm = 12;
            dd = 31
        } else if (mm == 2) {
            if (yyyy % 4 == 0) {
                dd = 29
            } else {
                dd = 28;
            }
        } else if ((mm == 4) || (mm == 6)|| (mm == 9)|| (mm == 11)) {
            dd = 30;
        } else {
            dd = 31;
        }
    } else if (mm == 2) { //positive
        if ((yyyy % 4 == 0) && (dd == 30)) {
            dd = 1;
            mm = mm + 1;
        } else if (dd == 29) {
            dd = 1;
            mm = mm + 1;
        }
    } else if (((mm == 4) || (mm == 6)|| (mm == 9)|| (mm == 11)) && (dd == 31)) {
        dd = 1;
        mm = mm + 1;
    } else if (dd == 32) {
        dd = 1;
        mm = mm + 1;
        if (mm == 13) {
            mm = 1;
            yyyy = yyyy + 1;
        }
    }

    dd = String(dd).padStart(2, '0');
    mm = String(mm).padStart(2, '0');
    yyyy = String(yyyy).padStart(2, '0');
    today = yyyy+mm+dd;
}

let url = "http://data.nba.net/10s/prod/v1/" + today + "/scoreboard.json"

getJson(url);
let infiniteInterval = setInterval(getJson, 60000, url);
let isDone = false;

function checkFlag() {
    if(isDone == false) {
       window.setTimeout(checkFlag, 100); /* this checks the flag every 100 milliseconds*/
    } else {
      imageTag();
    }
}
checkFlag();

function getJson(url) {
    addText("Getting Json...");
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    fetch(proxyurl + url)
    .then(response => response.text())
    .then(contents => parse(contents))
    .catch((e) => addText(e))
}


function parse(jstring) {
    if (init == 0) initUi(jstring);
    else refreshStats(jstring);
}

function initUi(jstring) {
    addText("Parsing Json...");
    let json = jstring;
    localStorage.setItem('json', json);
    obj = JSON.parse(localStorage.getItem('json'));
    let games = obj.games;

    games.forEach(element => { 
        let vTeam = element.vTeam;
        let hTeam = element.hTeam;

        if ((hTeam.triCode == "LAL") || (vTeam.triCode == "LAL") || ((parseInt(hTeam.win) > parseInt(hTeam.loss)) && (parseInt(vTeam.win) > parseInt(vTeam.loss)))) {
            visibleGames.push(hTeam.triCode);
            let clonedDiv = $('.match:first').clone();
            clonedDiv.insertAfter("div.match:last");
        }
    });
    $('.match:last').hide();
    init = 1;
    addText("Done!");
    refreshStats(jstring);
}

function refreshStats(jstring) {

    let json = jstring;
    localStorage.setItem('json', json);
    obj = JSON.parse(localStorage.getItem('json'));

    let counter = 0;
    let games = obj.games;
    games.forEach(element => { 
        let vTeam = element.vTeam;
        let hTeam = element.hTeam;
        let period = element.period;
        let clock = element.clock;
        let startTime = element.startTimeEastern;

        if (visibleGames.includes(hTeam.triCode)) {
            let matches = $('.match');
            let mid = matches[counter].querySelectorAll(".mid p");
            let vText = matches[counter].querySelectorAll(".vTeam p");
            let hText = matches[counter].querySelectorAll(".hTeam p");
            let reminder = matches[counter].querySelector("#reminder");
    
            if (element.isGameActivated || vTeam.score != 0) {
                reminder.style.display = "none";
                mid[0].textContent = clock;
                mid[1].textContent = vTeam.score + " - " + hTeam.score;
                if (period.isHalftime) {
                    mid[2].textContent = "Halftime";
                } else {
                    if (period.isEndOfPeriod) {
                        mid[2].textContent = "Quarter: " + period.current + " End";
                    } else {
                        if (period.type) {
                            mid[2].textContent = "Overtime";
                        } else {
                            mid[2].textContent = "Quarter: " + period.current;
                        }
                    }
                }
            } else {
                reminder.style.display = "";
                mid[0].textContent = startTime;
            }
            
            // linescore for quarters. seriesWin for winner
            
            matches[counter].querySelector(".vTeam img").setAttribute("src", "icons/"+vTeam.triCode+".png");
            vText[0].textContent = dict[vTeam.triCode];
            vText[1].textContent = vTeam.win+" - "+vTeam.loss
            
            matches[counter].querySelector(".hTeam img").setAttribute("src", "icons/"+hTeam.triCode+".png");
            hText[0].textContent = dict[hTeam.triCode];
            hText[1].textContent = hTeam.win+" - "+hTeam.loss;

            let mailParams = {
                v: dict[vTeam.triCode],
                h: dict[hTeam.triCode],
                t: startTime.substring(0, startTime.length - 2),
                d: today
            };
            reminder.onclick = () => {
                window.open('http://google.com/search?q=' + 'remind me ' + mailParams.v + " vs " + mailParams.h + " at " + mailParams.t + " on the " + today.substring(6) + "th", '_blank');
                // emailjs.send("gmail", "nba_template", mailParams)
                // .then((reply) => {
                //     addText(reply.status + " " + reply.text)
                // }, (err) => {
                //     addText(err);
                // })
            }
    
            counter++;
        }
    });
    $('.match:last').hide();
    isDone = true;
}

function imageTag () {
    $.each($(".matchSection img"), (i, obj) => {
        if(obj.getAttribute("src") != null) {
            var triCode = obj.getAttribute("src").substring(6, 9);
            var modName = dict[triCode].split(' ').join("-");
            obj.parentNode.setAttribute("href", "http://nba-streams.xyz/stream/" + modName + "-live-stream/");
            // http://nba-streams.xyz/stream/los-angeles-lakers-live-stream/
        }
    })
    $("#btnToday").removeClass("btn-primary");
    $("#btnToday").addClass("btn-success");
}

function addText(val) {
    document.getElementById("console").value += val + "\n";
    console.log(val);
}
