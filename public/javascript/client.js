function myFunction() {
  const HTTP = new XMLHttpRequest();
  const url = "https://sleeper-wrapper.herokuapp.com/user/" + document.getElementById("fname").value;
  HTTP.open("GET", url);
  HTTP.send();
  HTTP.onreadystatechange=(e)=>{
    document.getElementById("demo").innerHTML = HTTP.responseText;
  }
}
