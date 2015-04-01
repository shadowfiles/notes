window.onload = function () {
	var titleBody = document.getElementById("note-title");
	var textBody = document.getElementById("note-body");
	var localStorage = window.localStorage;
	if(typeof(Storage) !== "undefined") {
		if (localStorage.title) 
  	  titleBody.value = localStorage.title;
  	if (localStorage.text) {
	    textBody.innerHTML = localStorage.text;
	    textBody.value = localStorage.text;
  	}

	  titleBody.addEventListener("change", function (e) {
	  	localStorage.title = this.value;
	  });

	  textBody.addEventListener("change", function (e) {
	  	localStorage.text = this.value;
	  });
	} else {
	   // No local storage support! 
	   titleBody.innerHTML = "Your browser does not support local storage!" 
	   											+ " Unfortunately, Notes will not work properly. ";
	}
}