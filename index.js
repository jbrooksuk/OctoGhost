#!/usr/bin/env node
var commander = require('commander'),
	fs        = require('fs'),
	path      = require('path'),
	async     = require('async'),
	Post      = require('./Post');

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

	octoPosts();
}else{
	console.log('An import file must be passed.'.bold.red);
}

function octoPosts(db) {
	var postDir = path.join(octoDir, '/source/_posts'),
		ext, post;
	fs.readdir(postDir, function(err, files) {
		async.each(files, function(file, callback) {
			ext = path.extname(file);
			if(ext === '.markdown') {
				fs.readFile(path.join(postDir, file), 'utf8', function(err, content) {
					if(err) {
						throw err;
					}
					post = new Post(content);
					process.exit(0);
				});
			}else{
				callback();
			}
		});
	});
}