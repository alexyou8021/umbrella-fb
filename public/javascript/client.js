function myFunction() {
  const HTTP = new XMLHttpRequest();
  const url = "https://sleeper-wrapper.herokuapp.com/user/" + document.getElementById("fname").value;
  HTTP.responseType = 'json';
  HTTP.open("GET", url);
  HTTP.send();
  HTTP.onreadystatechange=(e)=>{
    var resp = HTTP.response;
    document.getElementById("demo").innerHTML = "";
    var transactions = document.getElementById("transaction_list")
    if (resp != null) {
      for(var i = 0; i < resp.length; i++) {
        var obj = resp[i];
        var li = document.createElement("transaction" + i.toString());
        li.innerHTML = JSON.stringify(obj) + "<br>";
        transactions.appendChild(li);
        console.log(obj);
      }
    }
  }
}
