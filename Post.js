var _       = require('underscore'),
	async   = require('async'),
	moment  = require('moment'),
	yaml    = require('js-yaml'),
	uuid    = require('node-uuid');

var Tag = require('./Tag');

String.prototype.trim = function(){return this.replace(/^\s+|\s+$/g, '');};

function Post(content) {
	this.ids      = [];
	this.tags     = [];
	this.metadata = {};
	this.content  = null;
	
	this.init(content);

	return this;
}

Post.prototype.init = function(raw) {
	var metaData = raw.split(/-{3}/g);
	this.content = raw;

	try {
		this.metadata = yaml.load(metaData[1]);
	} catch(e) {
		throw e;
	}
};

Post.prototype.slug = function() {
	return this.title();
};

Post.prototype.title = function() {
	return this.metadata.title;
};

Post.prototype.content = function() {
	var content = this.content;
	content = this.removeMore(content);
	content = this.fixImages(content);
	content = this.stripNewLines(content);
	content = this.fixBlockQuotes(content);

	return content;
};

Post.prototype.timestamp = function() {
	return this.metadata.timestamp;
};

Post.prototype.removeMore = function(content) {
	return content.replace('<!-- more -->', '');
};

Post.prototype.fixImages = function(content) {
	content = content.replace(/\{% img.*?(\/.*?) \d+ \d+\s?(.*?) %}/g, '![$2]($1)');
	return content.replace(/images/g, 'content/images');
};

Post.prototype.stripNewLines = function(content) {
	return content.replace(/(\r\n|\n|\r)/gm, '');
};

Post.prototype.fixBlockQuotes = function(content) {
	return content.replace(/{% blockquote %}(.*?){% endblockquote %}/g, '> $1');
};

module.exports = exports = Post;