function myFunction() {
  const HTTP = new XMLHttpRequest();
  const url = "https://sleeper-wrapper.herokuapp.com/user/" + document.getElementById("search").value;
  HTTP.responseType = 'json';
  HTTP.open("GET", url);
  HTTP.send();
  HTTP.onreadystatechange=(e)=>{
    var resp = HTTP.response;
    var transactions = document.getElementById("transaction_list")
    transactions.innerHTML = "";
    if (resp != null) {
      var previousWeek = -1;
      var weekRow = document.createElement("div");
      weekRow.className = "row";
      for(var i = 0; i < resp.length; i++) {
        var obj = resp[i];
	var week = obj["week"];
	var adds = obj["adds"];
	var drops = obj["drops"];
	var score = obj["score"];

	if (previousWeek != week) {
		if (previousWeek != -1) {
        		transactions.appendChild(weekRow);
      			weekRow = document.createElement("div");
      			weekRow.className = "row";
		}
      		var weekText = document.createElement("div");
		weekText.textContent = "Week " + week;
      		weekText.className = "row2";
		weekText.style.fontWeight = "bold";
      		weekText.style.backgroundColor = "gray";
		weekRow.appendChild(weekText);
		previousWeek = week;
	}
	else {
		var divider = document.createElement("hr");
		weekRow.appendChild(divider);
	}

        var transactionRow = document.createElement("div");
	transactionRow.className = "col-container"
	var addCol = document.createElement("div");
	addCol.className = "column"
	for (var key in adds) { //adds is a map of all players/defenses that were added
		var id = adds[key]; //key is the index essentially bc of for loop
		var splitName = key.split(" "); //
console.log(id);
console.log(key);
console.log(splitName);



		var formattedName = splitName[0].replace(/\./g, "-") + "-" + splitName[1];
		formattedName = formattedName.replace(/'/g, "-");
console.log(formattedName);		
		formattedName = formattedName.replace("--", "-");
console.log(formattedName);
		var hyperlink = document.createElement("a");
		if (isNaN(id)) {
			id = id.toLowerCase()
			var image = document.createElement("IMG");
			image.className = "reduced";
			image.setAttribute("src", "https://sleepercdn.com/images/team_logos/nfl/" + id + ".png");
			hyperlink.href = "https://www.nfl.com/teams/" + formattedName + "/stats";
		    hyperlink.target = '_blank';
		}
		else {
			var image = document.createElement("IMG");
			image.src = "https://sleepercdn.com/content/nfl/players/" + id + ".jpg";
			hyperlink.href = "https://www.nfl.com/players/" + formattedName + "/stats/logs";
            hyperlink.target = '_blank';

		}

		hyperlink.appendChild(image);
		console.log(hyperlink);

		addCol.appendChild(hyperlink);

		var desc = document.createElement("div");
		desc.className = "row"
		desc.textContent = "Added";
		addCol.appendChild(desc);

		var name = document.createElement("div");
		name.className = "row"
		name.style.fontWeight = "bold";
		name.textContent = key;
		addCol.appendChild(name);
	}
	transactionRow.appendChild(addCol);

	var scoreCol = document.createElement("div");
	scoreCol.className = "column2";
	scoreCol.style.fontWeight = "bold";
	scoreCol.textContent = score;
	transactionRow.appendChild(scoreCol);

	var dropCol = document.createElement("div");
	dropCol.className = "column"
	for (var key in drops) {
		var id = drops[key];
		var splitName = key.split(" ");
		var formattedName = splitName[0].replace(/\./g, "-") + "-" + splitName[1];
		formattedName = formattedName.replace(/'/g, "-");
		formattedName = formattedName.replace("--", "-");
		var hyperlink = document.createElement("a");
		if (isNaN(id)) {
			id = id.toLowerCase()
			var image = document.createElement("IMG");
			image.className = "reduced";
			image.setAttribute("src", "https://sleepercdn.com/images/team_logos/nfl/" + id + ".png");
			hyperlink.href = "https://www.nfl.com/teams/" + formattedName + "/stats";
		    hyperlink.target = '_blank';
		}
		else {
			var image = document.createElement("IMG");
			image.src = "https://sleepercdn.com/content/nfl/players/" + id + ".jpg";
			hyperlink.href = "https://www.nfl.com/players/" + formattedName + "/stats/logs";
	        hyperlink.target = '_blank';
	
		}

		hyperlink.appendChild(image);
		dropCol.appendChild(hyperlink);

		var desc = document.createElement("div");
		desc.className = "row"
		desc.textContent = "Dropped";
		dropCol.appendChild(desc);

		var name = document.createElement("div");
		name.className = "row"
		name.style.fontWeight = "bold";
		name.textContent = key;
		dropCol.appendChild(name);
	}
	transactionRow.appendChild(dropCol);
        transactionRow.innerHTML += "<br>";
	weekRow.appendChild(transactionRow);
      }
      transactions.appendChild(weekRow);
    }
  }
}
