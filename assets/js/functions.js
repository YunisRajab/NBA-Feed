// TODO function names are too similar and confusing. Clarify names
// TODO improve flow of functions. Remove the use of a function within a function
// TODO make functions serve a clear single purpose

// TODO save json and keep track of session history
// instead of pinging the server on history back/forward

// blend two hex colors together by an amount
function blendColors(colorA, colorB, amount) {
  let [rA, gA, bA] = colorA.match(/\w\w/g).map((c) => parseInt(c, 16));
  let [rB, gB, bB] = colorB.match(/\w\w/g).map((c) => parseInt(c, 16));
  let r = Math.round(rA + (rB - rA) * amount)
    .toString(16)
    .padStart(2, "0");
  let g = Math.round(gA + (gB - gA) * amount)
    .toString(16)
    .padStart(2, "0");
  let b = Math.round(bA + (bB - bA) * amount)
    .toString(16)
    .padStart(2, "0");
  return "#" + r + g + b;
}

function getQuery() {
  let searchQuery = Object.fromEntries(
    new URLSearchParams(location.search.substring(1))
  );
  today = !searchQuery.date ? yyyy + mm + dd : searchQuery.date;
  team = !searchQuery.team ? "all" : searchQuery.team;
  mode = !searchQuery.mode ? "day" : searchQuery.mode;
  if (mode == "playoffs") {
    getPlayoffs();
  } else $(".section-playoffs").hide();
}

function changeDate(value) {
  dd = parseInt(today.substring(6));
  mm = parseInt(today.substring(4, 6));
  yyyy = parseInt(today.substring(0, 4));

  dd = dd + value;
  if (dd == 0) {
    //negative
    mm = mm - 1;
    if (mm == 0) {
      yyyy = yyyy - 1;
      mm = 12;
      dd = 31;
    } else if (mm == 2) {
      if (yyyy % 4 == 0) {
        dd = 29;
      } else {
        dd = 28;
      }
    } else if (mm == 4 || mm == 6 || mm == 9 || mm == 11) {
      dd = 30;
    } else {
      dd = 31;
    }
  } else if (mm == 2) {
    //positive
    if (yyyy % 4 == 0 && dd == 30) {
      dd = 1;
      mm = mm + 1;
    } else if (dd == 29) {
      dd = 1;
      mm = mm + 1;
    }
  } else if ((mm == 4 || mm == 6 || mm == 9 || mm == 11) && dd == 31) {
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

  dd = String(dd).padStart(2, "0");
  mm = String(mm).padStart(2, "0");
  yyyy = String(yyyy).padStart(2, "0");
  today = yyyy + mm + dd;
}

function getJson() {
  $(".panel").show();
  console.log("Getting Json...");
  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  fetch(
    proxyurl + "http://data.nba.net/10s/prod/v1/" + today + "/scoreboard.json"
  )
    .then((response) => response.text())
    .then((contents) => parse(contents))
    .catch((e) => console.log(e));
}

function parse(jstring) {
  if (init == 0) initUi(jstring);
  refreshStats(jstring);
}

function getStandings(url) {
  console.log("Getting Standings...");
  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  fetch(proxyurl + url)
    .then((response) => response.text())
    .then((contents) => parseStandigs(contents))
    .catch((e) => console.log(e));
}

function getStandingsConf(url) {
  console.log("Getting Standings...");
  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  fetch(proxyurl + url)
    .then((response) => response.text())
    .then((contents) => parseStandigsConf(contents))
    .catch((e) => console.log(e));
}

function getPlayoffs() {
  console.log("Getting Standings...");
  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  fetch(proxyurl + playoffs)
    .then((response) => response.text())
    .then((contents) => parsePlayoffs(contents))
    .catch((e) => console.log(e));
}

function parseStandigsConf(data) {
  let east = JSON.parse(data).league.standard.conference.east;
  let west = JSON.parse(data).league.standard.conference.west;
  let left = $("#west img");
  let right = $("#east img");

  west.forEach((team) => {
    left[team.confRank - 1].src =
      "assets/icons/" + team.teamSitesOnly.teamTricode + ".png";
    teamIds.set(team.teamId, team.teamSitesOnly.teamTricode);
  });
  east.forEach((team) => {
    right[team.confRank - 1].src =
      "assets/icons/" + team.teamSitesOnly.teamTricode + ".png";
    teamIds.set(team.teamId, team.teamSitesOnly.teamTricode);
  });
  // document.querySelector("#west").style = "background-color: #FFFFFF";
  // document.querySelector("#east").style = "background-color: #FFFFFF";
  // document.querySelector("#west").style =
  //   "background-color: " + blendColors("#17408b", "#c9082a", 0.25);
  // document.querySelector("#east").style =
  //   "background-color: " + blendColors("#17408b", "#c9082a", 0.75);
  parseStandigs(data);
  getJson();
}

function parsePlayoffs(jstring) {
  let json = JSON.parse(jstring);
  let counter = 0;

  json.series.forEach((series) => {
    let top, bottom;
    if (counter < 8) {
      top = $(".bracket__quarter")
        .find(".matchup")
        .eq(counter)
        .find(".matchup__row:first");
      bottom = $(".bracket__quarter")
        .find(".matchup")
        .eq(counter)
        .find(".matchup__row:last");
    } else if (counter < 12) {
      top = $(".bracket__semi")
        .find(".matchup")
        .eq(counter - 8)
        .find(".matchup__row:first");
      bottom = $(".bracket__semi")
        .find(".matchup")
        .eq(counter - 8)
        .find(".matchup__row:last");
    } else if (counter < 14) {
      top = $(".bracket__conf__final")
        .find(".matchup")
        .eq(counter - 12)
        .find(".matchup__row:first");
      bottom = $(".bracket__conf__final")
        .find(".matchup")
        .eq(counter - 12)
        .find(".matchup__row:last");
    } else {
      top = $(".bracket__final").find(".matchup").find(".matchup__row:first");
      bottom = $(".bracket__final").find(".matchup").find(".matchup__row:last");
    }

    if (series.topRow.teamId !== "") {
      top.css(
        "background-color",
        dict[teamIds.get(series.topRow.teamId)].primary
      );
      top
        .find("span")
        .text(teamIds.get(series.topRow.teamId) + " " + series.topRow.wins);
      top
        .find("img")
        .attr(
          "src",
          "assets/icons/" + teamIds.get(series.topRow.teamId) + ".png"
        );
    }
    if (series.bottomRow.teamId !== "") {
      bottom.css(
        "background-color",
        dict[teamIds.get(series.bottomRow.teamId)].primary
      );
      bottom
        .find("span")
        .text(
          teamIds.get(series.bottomRow.teamId) + " " + series.bottomRow.wins
        );
      bottom
        .find("img")
        .attr(
          "src",
          "assets/icons/" + teamIds.get(series.bottomRow.teamId) + ".png"
        );
    }
    counter++;
  });

  $(".section-playoffs").show();
  $(".section-playoffs").css("display", "flex");
}

function parseStandigs(data) {
  // let teams = JSON.parse(data).league.standard.teams;
  let west = JSON.parse(data).league.standard.conference.west;
  let east = JSON.parse(data).league.standard.conference.east;
  let eastIndex = 0;

  let hrCounter = -1;
  west.forEach((team, index) => {
    let whileRepeat = false;
    let bottomEast = false;

    do {
      whileRepeat = false;
      if (!bottomEast) {
        if (eastIndex < 15 && west[index].winPct < east[eastIndex].winPct) {
          team = east[eastIndex];
          eastIndex++;
          whileRepeat = true;
        } else {
          team = west[index];
          whileRepeat = false;
        }
      }
      bottomEast = false;

      dict[team.teamSitesOnly.teamTricode].teamId = team.teamId;
      dict[team.teamSitesOnly.teamTricode].confRank = team.confRank;

      let clonedDiv = $(".teamRow:first").clone();
      clonedDiv.insertAfter("div.teamRow:last");
      let lastTeam = $(".team:last div");

      if (++hrCounter % 8 == 0)
        $(".teamRow:last hr").css({
          background: "linear-gradient(to left, #17408b 0%, #c9082a 100%)",
        });
      lastTeam
        .eq(1)
        .find("img")
        .attr("src", "assets/icons/" + team.teamSitesOnly.teamTricode + ".png");
      $(".team:last a").attr(
        "href",
        "http://google.com/search?q=" +
          dict[team.teamSitesOnly.teamTricode].name
      );
      lastTeam.eq(1).find("p").text(team.teamSitesOnly.teamNickname);
      lastTeam.eq(2).text(team.win);
      lastTeam.eq(3).text(team.loss);
      lastTeam.eq(4).text(team.winPct);
      lastTeam.eq(5).text(team.gamesBehind);
      lastTeam.eq(6).text(team.confWin + "-" + team.confLoss);
      lastTeam.eq(7).text(team.homeWin + "-" + team.homeLoss);
      lastTeam.eq(8).text(team.awayWin + "-" + team.awayLoss);
      lastTeam.eq(9).text(team.lastTenWin + "-" + team.lastTenLoss);
      lastTeam.eq(10).text((team.isWinStreak ? "W" : "L") + team.streak);
      $(".team:last").css({
        "background-color": dict[team.teamSitesOnly.teamTricode].primary,
        "border-radius": "10px",
      });
      if (index == 14 && !whileRepeat) {
        if (eastIndex < 15) {
          team = east[eastIndex];
          eastIndex++;
          whileRepeat = true;
          bottomEast = true;
        }
      }
    } while (whileRepeat);
  });
  $(".teamRow:first").hide();
}

function initUi(jstring) {
  console.log("Initializing...");
  // infiniteInterval = setInterval(getJson, 60000, getScoreboard);
  let json = jstring;
  // localStorage.setItem('json', json);
  // obj = JSON.parse(localStorage.getItem('json'));
  let games = JSON.parse(json).games;

  games.forEach((game) => addTeam(game));

  $(".match:last").hide();
  init = 1;
  console.log("Done!");
}

function addTeam(game) {
  let vTeam = game.vTeam;
  let hTeam = game.hTeam;

  if (
    team === "all" ||
    (game.isGameActivated && game.period.current > 4) ||
    hTeam.triCode == team ||
    vTeam.triCode == team ||
    (dict[hTeam.triCode].confRank <= 4 && dict[vTeam.triCode].confRank <= 8) ||
    (dict[hTeam.triCode].confRank <= 8 && dict[vTeam.triCode].confRank <= 4)
  ) {
    if (
      (dict[hTeam.triCode].confRank <= 4 &&
        dict[vTeam.triCode].confRank <= 8) ||
      (dict[hTeam.triCode].confRank <= 8 && dict[vTeam.triCode].confRank <= 4)
    ) {
      $(".match:last").addClass("match-highlight");
    }

    visibleGames.push(hTeam.triCode);
    let clonedDiv = $(".match:first").clone();
    clonedDiv.insertAfter("div.match:last");
  }
}

function resetUi() {
  $(".match").not(":first").remove();
  $(".match:first").removeClass("match-highlight");
  visibleGames = [];
  init = 0;
}

function refreshStats(jstring) {
  let json = jstring;
  localStorage.setItem("json", json);
  obj = JSON.parse(localStorage.getItem("json"));

  let counter = 0;
  let games = obj.games;
  games.forEach((game) => {
    let vTeam = game.vTeam;
    let hTeam = game.hTeam;
    let period = game.period;
    let clock = game.clock;
    let startTime = game.startTimeEastern.substring(
      0,
      game.startTimeEastern.length - 6
    );

    if (visibleGames.includes(hTeam.triCode)) {
      let matches = $(".match");
      let mid = matches[counter].querySelectorAll(".mid p");
      let vLine = matches[counter]
        .querySelectorAll(".mid div")[1]
        .querySelectorAll("p");
      let hLine = matches[counter]
        .querySelectorAll(".mid div")[2]
        .querySelectorAll("p");
      let vText = matches[counter].querySelectorAll(".vTeam p");
      let hText = matches[counter].querySelectorAll(".hTeam p");
      let reminder = matches[counter].querySelector("#reminder");
      let nugget = matches[counter].querySelector("#nugget");

      nugget.textContent = game.nugget.text;
      matches[counter].style = `background: linear-gradient(to right, ${
        dict[vTeam.triCode].primary
      } 20%, ${dict[hTeam.triCode].primary} 80%);`;

      vLine[0].textContent = vTeam.triCode;
      hLine[0].textContent = hTeam.triCode;
      if (game.isGameActivated || vTeam.score != 0) {
        reminder.style.display = "none";
        mid[0].textContent = clock;
        mid[1].textContent = vTeam.score + " - " + hTeam.score;
        if (vTeam.linescore !== undefined && vTeam.linescore.length != 0) {
          vLine[1].textContent = vTeam.linescore[0].score;
          vLine[2].textContent = vTeam.linescore[1].score;
          vLine[3].textContent = vTeam.linescore[2].score;
          vLine[4].textContent = vTeam.linescore[3].score;
          hLine[1].textContent = hTeam.linescore[0].score;
          hLine[2].textContent = hTeam.linescore[1].score;
          hLine[3].textContent = hTeam.linescore[2].score;
          hLine[4].textContent = hTeam.linescore[3].score;
          if (vTeam.linescore[4] == undefined) {
            matches[counter].querySelector(
              ".mid .row p"
            ).style = `color: ${blendColors(
              dict[vTeam.triCode].primary,
              dict[hTeam.triCode].primary,
              0.33
            )};`;
          }
        }
        if (period.current != 0) {
          let quarters = matches[counter].querySelectorAll(".quarter");
          quarters[0].style = "color: white;";
          quarters[1].style = "color: white;";
          quarters[2].style = "color: white;";
          quarters[3].style = "color: white;";
          if (game.isGameActivated) {
            period.current > 4
              ? (matches[counter].querySelector(".mid .row p").style =
                  "color: yellow;")
              : (quarters[period.current - 1].style = "color: yellow;");

            if (
              period.current > 3 &&
              Math.abs(parseInt(vTeam.score) - parseInt(hTeam.score)) < 10 &&
              !closeGameReminderTracker.includes(hTeam.triCode)
            ) {
              closeGameReminderTracker.push(hTeam.triCode);
              audio.play();
            }
          }
        }
      } else {
        reminder.style.display = "";
        mid[0].textContent = startTime + " PM";
      }

      // linescore for quarters. seriesWin for winner
      matches[counter]
        .querySelector(".vTeam img")
        .setAttribute("src", "assets/icons/" + vTeam.triCode + ".png");
      vText[0].textContent = dict[vTeam.triCode].name;
      vText[1].firstChild.nodeValue = `${vTeam.win} - ${vTeam.loss} `;
      vText[1].querySelector("span").textContent = `(${
        dict[vTeam.triCode].confRank
      })`;
      // if (confRank[vTeam.triCode] <= 8) vText[1].querySelector("span").style = `color: ${dict[vTeam.triCode].secondary};`;

      matches[counter]
        .querySelector(".hTeam img")
        .setAttribute("src", "assets/icons/" + hTeam.triCode + ".png");
      hText[0].textContent = dict[hTeam.triCode].name;
      hText[1].firstChild.nodeValue = `${hTeam.win} - ${hTeam.loss} `;
      hText[1].querySelector("span").textContent = `(${
        dict[hTeam.triCode].confRank
      })`;
      // if (confRank[hTeam.triCode] <= 8) hText[1].querySelector("span").style = `color: ${dict[hTeam.triCode].secondary};`;

      let mailParams = {
        v: dict[vTeam.triCode].name,
        h: dict[hTeam.triCode].name,
        t: startTime,
        d: today,
      };
      reminder.onclick = () => {
        gameReminder(
          reminder,
          startTime,
          team === "all" ? hTeam.triCode : team
        );
        if (confirm("Set reminder?")) {
          let suffix;
          let day;
          switch (today.substring(7)) {
            case "1":
              suffix = "st";
              break;
            case "2":
              suffix = "nd";
              break;
            case "3":
              suffix = "rd";
              break;
            default:
              suffix = "th";
          }
          if (today.substring(6, 7) == "1") suffix = "th";
          if (today.substring(6, 7) == "0") day = today.substring(7);
          else day = today.substring(6);
          window.open(
            "http://google.com/search?q=" +
              "remind me " +
              mailParams.v +
              " vs " +
              mailParams.h +
              " at " +
              mailParams.t +
              " pm on the " +
              day +
              suffix,
            "_blank"
          );
        }
      };

      counter++;
    }
  });
  $(".match:last").hide();
  $(".panel").hide();
  isDone = true;
}

function imageTag() {
  $.each($(".matchSection img"), (i, obj) => {
    if (obj.getAttribute("src") != null) {
      const parent = obj.closest(".row");
      const triCodeH = parent
        .querySelector(".hTeam img")
        .getAttribute("src")
        .substring(13, 16);
      const triCodeV = parent
        .querySelector(".vTeam img")
        .getAttribute("src")
        .substring(13, 16);
      const nameH = dict[triCodeH].name.split(" ").join("-").toLowerCase();
      const nameV = dict[triCodeV].name.split(" ").join("-").toLowerCase();
      const url = `http://bilasport.net/game/${nameH}-vs-${nameV}-1.html`;

      obj.parentNode.setAttribute("href", url);
      // home-team-vs-away-team-1.html
      // http://bilasport.net/game/brooklyn-nets-vs-milwaukee-bucks-1.html
      // http://nba-streams.xyz/stream/los-angeles-lakers-live-stream/
    }
  });
  $("#btnToday").removeClass("btn-primary");
  $("#btnToday").addClass("btn-success");
}

function gameReminder(reminder, startTime, triCode) {
  // TODO BUG: always unhides the hidden last match div. refreshStats fixes it after a minute
  reminder.classList.remove("btn-primary");
  reminder.classList.add("btn-warning");
  let modName = dict[triCode].name.split(" ").join("-");
  let openTime = new Date(
    today.substring(0, 4),
    today.substring(4, 6) - 1,
    today.substring(6),
    parseInt(startTime.split(":")[0]) + 12,
    startTime.split(":")[1],
    0,
    0
  );
  let countdown = openTime - new Date();
  console.log(`Opening ${triCode} in ${countdown / 60000} minutes`);
  if (countdown >= 0)
    setTimeout(() => {
      audio.play();
      window.open(
        "http://nba-streams.xyz/stream/" + modName + "-live-stream/",
        "_blank"
      );
    }, countdown);
}

function checkFlag() {
  if (!isDone) {
    window.setTimeout(
      checkFlag,
      100
    ); /* this checks the flag every 100 milliseconds*/
  } else {
    imageTag();
  }
}

function updateUi() {
  getQuery();
  if (mode != "playoffs") {
    resetUi();
    getJson();
  }
}
