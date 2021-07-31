if (window.location.hash !== "#" && window.location.hash !== "") {
  document.getElementById("url").value = window.location.hash.substring(1);
}

function bypass() {
  document.getElementById("success").style.display = "none";
  document.getElementById("error").style.display = "none";
  document.getElementById("load").style.display = "";
  var url = btoa(document.getElementById("url").value);
  var xhr = new XMLHttpRequest();
  xhr.open(`GET`, `/api/bypass?url=${url}`);
  xhr.send();
  xhr.onload = function() {
    try {
      var json = JSON.parse(xhr.responseText);
      if (json.success) {
        document.getElementById("load").style.display = "none";
        document.getElementById("success").style.display = "";
        document.getElementById("link").href = json.destination;
        document.getElementById("link").innerHTML = json.destination;
      } else {
        document.getElementById("load").style.display = "none";
        document.getElementById("error").style.display = "";
        if (json.err !== "" && json.err) {
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