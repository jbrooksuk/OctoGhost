var sqlite3 = require('sqlite3').verbose(),
	_       = require('underscore');

function Store(db) {
	this.db = new sqlite3.Database(db);
}

Store.prototype.save = function(data) {
	var query = this.db.run("INSERT INTO posts (uuid, title, slug, featured, page, status, language, author_id, created_at, created_by) VALUES (?, ?, ?, 0, 0, 'published', 'en_GB', 1, ?, 1)", data.uuid, data.title, data.slug, data.timestamp);
};

Store.prototype.close = function() {
	this.db.close();
}

module.exports = exports = Store;