if (!window.location.hash || window.location.hash == "#") {
  window.open("/", "_self");
} else {
  document.getElementById("loading").style.display = "block";
  var x = new XMLHttpRequest();
  var u = `/api/bypass?url=${btoa(window.location.hash.substring(1))}`;
  x.open("GET", u);
  x.send();
  x.onload = function() {
    try {
      var json = JSON.parse(x.responseText);
      if (json.success) {
        document.getElementById("loading").style.display = "none";
        if (json.destination) {
          document.getElementById("loaded-one").style.display = "block";
          window.open(json.destination, "_self");
        } else if (json.destinations) {
          for (var c in json.destinations) {
            document.getElementById("loaded-mult").style.display = "block";
            var a = document.createElement("A");
            if (json.destinations[c] == null) {continue;}
            a.href = json.destinations[c];
            if (json.destinations[c].startsWith("mailto:")) {
              a.innerHTML = json.destinations[c].substring(7);
            } else {
              a.innerHTML = json.destinations[c];
            }
            document.getElementById("loaded-mult").append(a);
            document.getElementById("loaded-mult").append(document.createElement("BR"));
          }
        } else {
          document.getElementById("load").style.display = "none";
          document.getElementById("error").style.display = "";
          if (json.err !== "" && json.err !== null && json.err) {
            document.getElementById("err-txt").innerHTML = json.err;
          } else {
            document.getElementById("err-txt").innerHTML = "An unspecified error has occurred. (Server error, no message)";
          }
        }
      } else {
        document.getElementById("load").style.display = "none";
        document.getElementById("error").style.display = "";
        if (json.err !== "" && json.err !== null && json.err) {
          document.getElementById("error").innerHTML = json.err;
        } else {
          document.getElementById("error").innerHTML = "An unspecified error has occurred. (Server error, no message)";
        }
      }
    } catch(err) {
      document.getElementById("loading").style.display = "none";
      document.getElementById("error").style.display = "";
      if (err.message !== "" && err.message) {
        document.getElementById("error").innerHTML = err.message;
      } else {
        document.getElementById("error").innerHTML = "An unspecified error has occurred. (Parsing request error)";
      }
    }
  }
}