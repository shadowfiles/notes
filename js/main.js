window.onload = function () {
	var localStorage = window.localStorage;
	if(typeof(Storage) !== "undefined") {
		var session = new NoteSession(localStorage);
		session.load();
		

		// Add event handlers for syncing.
	  var inputs = document.getElementsByClassName("saved");
	  for (var i = 0; i < inputs.length; i++) {
	  	inputs[i].addEventListener("change", session.sync);
	  	inputs[i].addEventListener("click", session.sync);
	  }

	  document.getElementById("prev-page").addEventListener("click", session.prevPage);
	  document.getElementById("next-page").addEventListener("click", session.nextPage);

	  var mousedownTimer; 
	  document.getElementById("prev-page").addEventListener("mousedown", function (e) {
	  	mousedownTimer = setInterval(session.prevPage, 100);
	  });

	  document.getElementById("next-page").addEventListener("mousedown", function (e) {
	  	mousedownTimer = setInterval(session.nextPage, 100);
	  });

	  document.getElementById("prev-page").addEventListener("mouseout", clearTimer);
	  document.getElementById("next-page").addEventListener("mouseout", clearTimer);
	  document.addEventListener("mouseup", clearTimer);

	  function clearTimer (e) {
	  	window.clearInterval(mousedownTimer);
	  }

	} else {
	   // No local storage support! 
	   titleBody.innerHTML = "Your browser does not support local storage!" 
	   											+ " Unfortunately, Notes will not work properly. ";
	}
}

function NoteSession (s) {
	var self = this;
	var storage = s;
	var notebook = new Notebook(); 
	var page = 1; 

	var titleBody = document.getElementById("note-title");
	var textBody = document.getElementById("note-body");

	this.sync = function () {
		notebook.setPageTitle(page, getTitle());
		notebook.setPageContent(page, getText());

		storage.notebook = notebook.serialize();
		storage.page = page;

		updateNoteListing(page);
	}

	this.addPage = function () {
		notebook.addPage(new Note({"title": "Note " + (notebook.pageCount() + 1)}));
		updateNote();
		updatePageNumbers();
		updateNoteList();
		self.sync();
	}

	this.prevPage = function () {
		if (page > 1) {
			self.goToPage(page - 1);
		}
	}

	this.nextPage = function () {
		if (page === notebook.pageCount()) {
			self.addPage();
		}
		if (page < notebook.pageCount()) {
			self.goToPage(page + 1);
		}
	}

	this.goToPage = function (num) {
		if (num <= notebook.pageCount() && num > 0) {
			deselectNoteListing(page);
			selectNoteListing(num);
			page = num;
			updateNote();
			updatePageNumbers();
		}
	}

	this.load = function () {
		if (storage.notebook) {
			page = storage.page * 1;

			notebook = new Notebook(JSON.parse(storage.notebook));
			if (notebook.pageCount() < 1) {
				notebook.addPage(new Note({"title": getTitle(), "content": getText()}));
				page = 1;
			}
		} else {
			notebook = new Notebook({"title": "Default Notebook"});
			notebook.addPage(new Note({"title": getTitle(), "content": getText()}));
		}
		$("#note-list").jScrollPane();
		updateNoteList();
		self.goToPage(page);
	}

	function updateAll () {
		updatePageNumbers();
		updateNote();
		updateNoteList();
	}

	function updatePageNumbers () {
		document.getElementById("prev-page").setAttribute("href", "#note-" + (page - 1));
		document.getElementById("next-page").setAttribute("href", "#note-" + (page + 1));
		document.getElementById("current-page").innerHTML = page;
		document.getElementById("page-count").innerHTML = notebook.pageCount();
	}

	function updateNote () {
		setTitle();
		setText();
	}

	function updateNoteListing (num) {
		var note = document.getElementById("note-" + num);
		note.innerHTML = notebook.getPageTitle(num);
	}

	function selectNoteListing (num) {
		var note = document.getElementById("note-" + num);
		note.setAttribute("class", "selected");
	}

	function deselectNoteListing (num) {
		var note = document.getElementById("note-" + num);
		note.setAttribute("class", "");
	}

	function updateNoteList () {
		$("#note-list").data("jsp").destroy();
		var list = document.getElementById("note-list");
		list.innerHTML = "";
		for (var i = 1; i <= notebook.pageCount(); i++) {
			var title = notebook.getPageTitle(i);
			var link = document.createElement("a");
			link.setAttribute("href", "#note-" + i);
			link.setAttribute("id", "note-" + i);
			link.setAttribute("page", i);
			link.innerHTML = title;
			link.addEventListener("click", function (e) {
				self.goToPage(this.getAttribute("page") * 1);
			});
			list.appendChild(link);
		}
		$("#note-list").jScrollPane();
	}

	function setText () {
		var text = notebook.getPageContent(page);
		textBody.value = text;
		textBody.innerHTML = text;
	}

	function setTitle (title) {
		var title = notebook.getPageTitle(page);
		titleBody.value = title;
	}

	function getText () {
		return textBody.value || textBody.innerHTML;
	}

	function getTitle () {
		return titleBody.value;
	}
}