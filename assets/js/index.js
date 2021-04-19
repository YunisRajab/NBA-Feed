// cors https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe/43881141#43881141
// make own server eventually refering to above link

// TODO use media queries wtf!
let smallMode = false;
if ($(window).width() < "1200") {
  smallMode = true;
  triggerResize();
}
$(window).resize(function () {
  if ($(this).width() < "1200" && !smallMode) {
    smallMode = true;
    triggerResize();
  }
  if ($(this).width() > "1200" && smallMode) {
    smallMode = false;
    triggerResize();
  }
});
function triggerResize() {
  $(".mobile").toggleClass("col-1");
  $(".mobile").toggleClass("col-2");
  $(".match").toggleClass("col-10");
  $(".match").toggleClass("col-12");
  $(".matchRow").toggleClass("col-8");
  $(".matchRow").toggleClass("col-10");
}

getQuery();

$("#date").text(
  String(
    new Date(
      today.substr(0, 4),
      parseInt(today.substr(4, 2)) - 1,
      today.substr(6)
    )
  ).substr(0, 15)
);

// if (searchQuery.team != null) team = searchQuery.team;
// if (team == "") {
//     team = "all";
// } else if (!(team in dict)) {
//     team = "LAL";
// }

window.addEventListener("popstate", () => updateUi());

for (let key in dict) {
  let clonedOption = $("#selectTeam option:last").clone();
  clonedOption.attr("value", key);
  clonedOption.text(dict[key].name);
  clonedOption.insertAfter("#selectTeam option:last");

  $("#selectTeam").val(team);
  $("#inputDate").val(
    `${today.substr(0, 4)}-${today.substr(4, 2)}-${today.substr(6, 2)}`
  );
}

// TODO going from All to a team shouldn't query again
// Also save the All info to go back and forth without a query
$("#selectMode").change(() => {
  window.history.pushState(
    {},
    document.title,
    `http://yunis.xyz/NBA/?date=${$("#inputDate").val().split("-").join("")}` +
      `&team=${$("#selectTeam").val()}&mode=${$("#selectMode").val()}`
  );
  updateUi();
});

$("#selectTeam").change(() => {
  window.history.pushState(
    {},
    document.title,
    `http://yunis.xyz/NBA/?date=${$("#inputDate").val().split("-").join("")}` +
      `&team=${$("#selectTeam").val()}`
  );
  updateUi();
});

$("#inputDate").change(() => {
  window.history.pushState(
    {},
    document.title,
    `http://yunis.xyz/NBA/?date=${$("#inputDate").val().split("-").join("")}` +
      `&team=${$("#selectTeam").val()}`
  );
  updateUi();
});

$("#btnUpdate").on("click", () => {
  // let todaySelection = $("#inputDate").val().split("-").join("");
  // let teamSelection= $("#selectTeam").val();
  // if ((today != todaySelection) || (team != teamSelection))
  //     location.search = `date=${todaySelection}&team=${teamSelection}`;
  // else getJson();
  getJson();
  // TODO setTimeout to prevent rapid clicks and server overload
});

$("#btnToday").on("click", () => {
  if (today != yyyy + mm + dd) {
    // today = yyyy+mm+dd;
    // location.search = "?date=" + today + "&team=" + team;
    location.search = "";
  } else {
    team = "all";
    location.search = "team=" + team;
  }
});
$("#btnPrevious").on("click", () => {
  changeDate(-1);
  location.search = "?date=" + today + "&team=" + team;
});
$("#btnNext").on("click", () => {
  changeDate(1);
  location.search = "?date=" + today + "&team=" + team;
});
$(".conference img").click((o) => {
  team = o.currentTarget.src.substr(-7, 3);
  window.history.pushState(
    {},
    document.title,
    `http://yunis.xyz/NBA/?date=${today}` + `&team=${team}`
  );
  updateUi();
});

checkFlag();
getStandingsConf(standings_conference);

// testing

// fetch("scoreboard_sample.json")
// .then(response => response.text())
// .then(contents => parse(contents))
// .catch((e) => console.log(e))

// fetch("standings_conference.json")
// .then(response => response.text())
// .then(contents => parseStandigsConf(contents))
// .catch((e) => console.log(e))

// fetch("playoffsBracket.json")
// .then(response => response.text())
// .then(contents => parsePlayoffs(contents))
// .catch((e) => console.log(e))

// fetch("scoreboard_sample2.json")
// .then(response => response.text())
// .then(contents => parse(contents))
// .catch((e) => console.log(e))
