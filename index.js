#!/usr/bin/env node
var commander = require('commander'),
	uuid      = require('node-uuid'),
	moment    = require('moment'),
	sqlite3   = require('sqlite3').verbose(),
	fs        = require('fs'),
	path      = require('path'),
	yaml      = require('js-yaml'),
	async     = require('async');

require('colors');

commander.version('0.0.1')
	     .option('-l, --load [database]', 'Import file')
	     .option('-o, --octopress-dir [directory]', 'Octopress location')
	     .parse(process.argv);

var octoDir;

if(!commander.octopressDir) {
	octoDir = process.cwd();
}else{
	octoDir = commander.octopressDir;
}

if(commander.load) {
	var dbFile = commander.load;
	console.log("Using %s for Ghost database.".blue, dbFile);

	var ghostDB = new sqlite3.Database(dbFile);

	octoPosts();

	ghostDB.close();
}else{
	console.log('An import file must be passed.'.bold.red);
}

function octoPosts(db) {
	var postDir = path.join(octoDir, '/source/_posts'),
		ext;
	fs.readdir(postDir, function(err, files) {
		async.each(files, function(file, callback) {
			ext = path.extname(file);
			if(ext === '.markdown') {
				storePost(file, callback);
			}else{
				callback();
			}
		});
	});
}

function storePost(postFile, callback) {
	var post = parsePost(postFile);
	console.log(post);

	callback();
}

function parsePost(postFile, callback) {
	try {
		var yamlPost = yaml.safeLoad(postFile);
	} catch(e) {
		throw e;
	}
	return yamlPost;
}