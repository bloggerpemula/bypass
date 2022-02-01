var xhr = new XMLHttpRequest();
xhr.open(`GET`, `/cache-enabled`);
xhr.send();
xhr.onload = function() {
  if (xhr.responseText == "true") document.getElementById("cache-enabled").style.display = "inline-block";
}

if (window.location.hash !== "#" && window.location.hash !== "") {
  document.getElementById("url").value = window.location.hash.substring(1);
}

function bypass(incorrect) {
  document.getElementById("success-one").style.display = "none";
  document.getElementById("success-mult").style.display = "none";
  document.getElementById("error").style.display = "none";
  document.getElementById("incorrect-cache-btn").style.display = "none";
  document.getElementById("load").style.display = "";
  document.querySelectorAll("#links a").forEach(function(ele) {
    ele.remove();
  });
  document.querySelectorAll("#links br").forEach(function(ele) {
    ele.remove();
  });
  var url = btoa(document.getElementById("url").value);
  var u = `/api/bypass?url=${url}`;
  if (document.getElementById("has-pw").checked == true) {
    var pw = btoa(document.getElementById("pw").value);
    u = `${u}&pass=${pw}`;
  } 
  if (document.getElementById("igch").checked == true) {
    u = `${u}&bypassCache=true`;
  }
  if (document.getElementById("dnch").checked == true) {
    u = `${u}&allowCache=false`;
  }
  if (incorrect) {
    u = `${u}&incorrectCache=true`;
  }
  var xhr = new XMLHttpRequest();
  xhr.open(`GET`, u);
  xhr.send();
  xhr.onload = function() {
    try {
      var json = JSON.parse(xhr.responseText);
      if (json.success) {
        document.getElementById("load").style.display = "none";
        if (json.cache) {
          document.getElementById("incorrect-cache-btn").style.display = "inline-block";
        }
        if (json.destination) {
          document.getElementById("success-one").style.display = "";
          document.getElementById("link").href = json.destination;
          document.getElementById("link").innerHTML = json.destination;
        } else if (json.destinations) {
          document.getElementById("success-mult").style.display = "";
          for (var c in json.destinations) {
            var a = document.createElement("A");
            if (json.destinations[c] == null) {continue;}
            a.href = json.destinations[c];
            if (json.destinations[c].startsWith("mailto:")) {
              a.innerHTML = json.destinations[c].substring(7);
            } else {
              a.innerHTML = json.destinations[c];
            }
            document.getElementById("links").append(a);
            document.getElementById("links").append(document.createElement("BR"));
          }
        }
      } else {
        document.getElementById("og").href = document.getElementById("url").value;
        document.getElementById("load").style.display = "none";
        document.getElementById("error").style.display = "";
        if (json.err !== "" && json.err !== null && json.err) {
          document.getElementById("err-txt").innerHTML = json.err;
        } else {
          document.getElementById("err-txt").innerHTML = "An unspecified error has occurred. (Server error, no message)";
        }
      }
    } catch(err) {
      document.getElementById("load").style.display = "none";
      document.getElementById("error").style.display = "";
      if (err.message !== "" && err.message) {
        document.getElementById("err-txt").innerHTML = err.message;
      } else {
        document.getElementById("err-txt").innerHTML = "An unspecified error has occurred. (Parsing request error)";
      }
    }
  }
  xhr.onerror = function(err) {
    document.getElementById("load").style.display = "none";
    document.getElementById("error").style.display = "";
    if (err.message !== "" && err.message) {
      document.getElementById("err-txt").innerHTML = err.message;
    } else {
      document.getElementById("err-txt").innerHTML = "An unspecified error has occurred. (Parsing request error)";
    }
  }
  xhr.onabort = function() {
    document.getElementById("load").style.display = "none";
    document.getElementById("error").style.display = "";
    document.getElementById("err-txt").innerHTML = "The request was aborted.";
  }
}

function thisone() {
  document.getElementById("url").value = document.getElementById("link").href;
  bypass(); 
}

function togglePw(c) {
  if (c == true) {
    document.getElementById("pw").style.display = "inline-block";
  } else {
    document.getElementById("pw").style.display = "none";
  }
}