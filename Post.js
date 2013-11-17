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
	var metaData = raw.split(/[---]+/).filter(function(e) {
		return e.trim().length > 0;
	});
	// this.content = metaData[metaData.length - 1];
	this.content = metaData;

	console.log(this.content);
};

Post.prototype.slug = function() {
	return this.title();
};

Post.prototype.title = function() {
	return this.metadata.title;
};

Post.prototype.timestamp = function() {
	return this.metadata.timestamp;
};

Post.prototype.removeMore = function() {
	this.content.replace('<!-- more -->', '');
};

Post.prototype.fixImages = function() {
	this.content.replace(/\{% img.*?(\/.*?) \d+ \d+\s?(.*?) %}/g, '![$2]($1)');
	this.content.replace(/images/g, 'content/images');
};

Post.prototype.stripNewLines = function() {
	this.content = this.content.replace(/(\r\n|\n|\r)/gm, '');
};

Post.prototype.fixBlockQuotes = function() {
	this.content = this.content.replace(/{% blockquote %}(.*?){% endblockquote %}/g, '> $1');
};

module.exports = exports = Post;