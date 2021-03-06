function isMobile() {
	var userAgent = window.navigator.userAgent;
	if(userAgent.match(/Android/i)
 		|| userAgent.match(/webOS/i)
 		|| userAgent.match(/iPhone/i)
 		|| userAgent.match(/iPad/i)
 		|| userAgent.match(/iPod/i)
 		|| userAgent.match(/BlackBerry/i)
 		|| userAgent.match(/Windows Phone/i)) {
		return true;
	}
}

function togglePageDropdown() {
	if (!isMobile()) {
		return;
	}

	var dropdownList = document.getElementById("pages");
	var memberList = document.getElementById("member_list");
	if (dropdownList.style.display == "block") {
		dropdownList.style.display = "none";
	} else {
		dropdownList.style.display = "block";
		memberList.style.display = "none";
	}
}

function toggleMemberDropdown() {
	if (!isMobile()) {
		return;
	}

	var dropdownList = document.getElementById("pages");
	var memberList = document.getElementById("member_list");
	if (memberList.style.display == "block") {
		memberList.style.display = "none";
	} else {
		memberList.style.display = "block";
		dropdownList.style.display = "none";
	}
}

function setQueryParams() {
	window.location.search = "search=" + document.getElementById("search").value;
}

function myFunction() {
   var urlParams = new URLSearchParams(window.location.search);
   var searchParam = urlParams.get('search');
   if (searchParam == "") {
       return;
   }

  const HTTP = new XMLHttpRequest();
  const url = "https://sleeper-wrapper.herokuapp.com/user/sleeper/" + searchParam;
  //const url = "https://sleeper-wrapper.herokuapp.com/user/espn/" + searchParam;
  HTTP.responseType = 'json';
  HTTP.open("GET", url);
  HTTP.send();

  var transactions = document.getElementById("transaction_list");
  transactions.style.textAlign = "center";
  var loadingRow = document.createElement("div");
  loadingRow.className = "row2";
  loadingRow.textContent = "Getting data...";
  transactions.appendChild(loadingRow);

  HTTP.onreadystatechange=(e)=>{
    var resp = HTTP.response;
    transactions.innerHTML = "";

    if (resp != null) {
      console.log(resp);
      var transactionDetails = resp["transaction_details"];
      var leagueId = resp["league_id"];
      var leagueName = resp["league_name"];
      var leagueMembers = resp["league_members"];
      var previousWeek = -1;
      var weekRow = document.createElement("div");
      weekRow.className = "row";
      var totalScore = 0;

      var leagueDropdown = document.getElementById("league_dropdown");
      leagueDropdown.textContent = leagueName;
      var caret = document.createElement("i");
      caret.className = "fa fa-caret-down";
      leagueDropdown.appendChild(caret);
      leagueDropdown.style.display = "inline";

      var memberList = document.getElementById("member_list");
      memberList.innerHTML = "";
      for(var i = 0; i < leagueMembers.length; i++)
      {
      	var member = document.createElement("a");
	var teamName = leagueMembers[i]["team_name"];
	if (teamName == "") {
		var ownerName = leagueMembers[i]["owner_username"];
		teamName = "Team " + ownerName;
	}
	if (leagueMembers[i]["owner_id"] == searchParam) {
		member.style.fontWeight = "bold";
	}
	member.textContent = teamName;
        member.href = window.location.origin + "?search=" + leagueMembers[i]["owner_id"];
        memberList.appendChild(member);
      }

      for(var i = 0; i < transactionDetails.length; i++) 
      {
        var obj = transactionDetails[i];
		var week = obj["week"];
		var adds = obj["adds"];
		var drops = obj["drops"];
		var score = obj["score"];
		var type = transactionTypeToString(obj["type"]);
		console.log(score);
		totalScore += score;

		if (previousWeek != week) 
		{
			if (previousWeek != -1) 
			{
	        		transactions.appendChild(weekRow);
	      			weekRow = document.createElement("div");
	      			weekRow.className = "row";
			}
			var weekText = createWeekRow(week);
			weekRow.appendChild(weekText);
			previousWeek = week;
		}
		else 
		{
			var divider = document.createElement("hr");
			weekRow.appendChild(divider);
		}

	    var transactionRow = document.createElement("div");
		transactionRow.className = "col-container"
		transactionRow.appendChild(createTransactionColumn(adds, "Added"));
		transactionRow.appendChild(createTransactionDescription(type, score));
		transactionRow.appendChild(createTransactionColumn(drops, "Dropped"));
	    transactionRow.appendChild(document.createElement("br"));
		weekRow.appendChild(transactionRow);
      }
      transactions.appendChild(weekRow);
      transactions.appendChild(createTotalRow(transactionDetails.length, totalScore.toFixed(2)));
    }
  }
}

function transactionTypeToString(type) {
	switch(type) {
	case "free_agent":
		return "FREE AGENT PICKUP"
	case "waiver":
		return "WAIVER PICKUP"
	case "trade":
		return "TRADE";
	default:
		return "";
	}
}

function createWeekRow(week) {
	var weekText = document.createElement("div");
	weekText.textContent = "WEEK " + week;
	weekText.className = "row2";
	return weekText;
}

function createTransactionDescription(type, score) {
	var col = document.createElement("div");
	col.className = "column2";

	var typeRow = document.createElement("h2");
	typeRow.style.fontWeight = "bold";
	typeRow.textContent = type;
	if (score > 0) {
		typeRow.style.color = "green";
	} else if (score < 0) {
		typeRow.style.color = "red";
	}
	col.appendChild(typeRow);

	var scoreRow = document.createElement("h2");
	scoreRow.style.fontWeight = "bold";
	scoreRow.textContent = "Transaction Score: " + score;
	col.appendChild(scoreRow);
	return col;
}

function createTransactionColumn(players, type) {
	var col = document.createElement("div");
	col.className = "column"
	for (var index in players) {
		var player = players[index];
		var id = player.id; //key is the index essentially bc of for loop
		var name = player.name;
		var imageURL = player.image_url;
		var link = player.hyperlink;

		if (id == "waiver") {
			name = "$" + name + " FAAB";
			imageURL = "faab.png";
		}

		var hyperlink = document.createElement("a");

		hyperlink.href = link;
		hyperlink.target = '_blank';

		var hyperlink2 = document.createElement("a");
		hyperlink2.href = link;
		hyperlink2.target = '_blank';

		var image = document.createElement("IMG");
		image.src = imageURL;

		if (isNaN(id)) {
			image.className = "team";
		} else {
			image.className = "player";
		}

		hyperlink.appendChild(image);
		col.appendChild(hyperlink);

		var desc = document.createElement("p");
		desc.className = "row"
		desc.textContent = type;

		col.appendChild(desc);

		var nameDiv = document.createElement("p");
		nameDiv.className = "row"
		nameDiv.style.fontWeight = "bold";
		nameDiv.style.color = "black";
		nameDiv.textContent = name;
		hyperlink2.appendChild(nameDiv);
		col.appendChild(hyperlink2);
		col.appendChild(nameDiv);
	}
	return col;
}

function createTotalRow(totalTransactions, totalScore) {
	var row = document.createElement("div");
	row.className = "row";
	row.backgroundColor = "aliceblue";

	var titleRow = document.createElement("div");
	titleRow.className = "row2";
	titleRow.textContent = "TOTAL";
	titleRow.backgroundColor = "burlywood";
	row.appendChild(titleRow);

	var subtitleRow = document.createElement("div");
	subtitleRow.className = "col-container";

	var col1 = document.createElement("div");
	col1.className = "column3";
	col1.textContent = "Transactions:\n" + totalTransactions;

	var col2 = document.createElement("div");
	col2.className = "column3";
	col2.textContent = "Score:\n" + totalScore;

	var col3 = document.createElement("div");
	col3.className = "column3";
	col3.textContent = "Grade:\n" + calculateGrade(totalScore);

	subtitleRow.appendChild(col1);
	subtitleRow.appendChild(col2);
	subtitleRow.appendChild(col3);
	row.appendChild(subtitleRow);

	return row;
}

function calculateGrade(score) {
	if (score <= 0) {
		return "F";
	} else if (score <= 50) {
		return "D";
	} else if (score <= 200) {
		return "C";
	} else if (score <= 400) {
		return "B";
	}
	return "A";
}