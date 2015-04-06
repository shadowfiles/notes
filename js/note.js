function Note (d) {
	var title = "";
	var content = "";

	if (d) {
		if (d.title) {
			title = d.title;
		}
		if (d.content) {
			content = d.content;
		}
	}

	this.getContent = function () {
		return content;
	}

	this.getTitle = function () {
		return title;
	}

	this.setContent = function (c) {
		content = c;
	}

	this.setTitle = function (t) {
		title = t;
	}

	this.data = function () {
		return {'title' : title, 'content' : content};
	}

	this.serialize = function () {
		return JSON.stringify(this.data());
	}
}

function Notebook (d) {
	var title; 
	var pages = [];

	if (d) {
		if (d.title) {
			title = d.title;
		}
		if (d.pages && d.pages.length > 0) {
			parsePages(d.pages);
		}
	}

	this.addPage = function (page) {
		pages[pages.length] = page;
	}

	this.getPages = function () {
		return pages;
	}

	this.getPage = function (num) {
		return pages[num - 1];
	}

	this.getPageTitle = function (num) {
		return this.getPage(num).getTitle();
	}

	this.getPageContent = function (num) {
		return this.getPage(num).getContent();
	}

	this.setPageTitle = function (num, title) {
		this.getPage(num).setTitle(title);
	}

	this.setPageContent = function (num, content) {
		this.getPage(num).setContent(content);
	}

	this.pageCount = function () {
		return pages.length;
	}

	this.data = function () {
		return {"title" : title, "pages" : serializePages()};
	}

	this.serialize = function () {
		return JSON.stringify(this.data());
	}

	function serializePages () {
		var temp = [];
		for (var i = 0; i < pages.length; i++) {
			temp[i] = pages[i].data();
		}
		return temp;
	}

	function parsePages (p) {
		for (var i = 0; i < p.length; i++) {
			pages[i] = new Note(p[i]);
		}
	}
}