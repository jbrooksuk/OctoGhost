#!/usr/bin/env node
var commander = require('commander'),
	fs        = require('fs'),
	path      = require('path'),
	async     = require('async'),
	Store     = require('./Store');
	Kitten    = require('kitten'),
	uuid      = require('node-uuid');

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

	var store = new Store(dbFile);
	octoPosts();
}else{
	console.log('An import file must be passed.'.bold.red);
}

function octoPosts(db) {
	var postDir = path.join(octoDir, '/source/_posts'), ext, postFile, id;

	fs.readdir(postDir, function(err, files) {
		async.eachSeries(files, function(file, callback) {
			postFile = postDir + '/' + file;
			ext = path.extname(file);
			if(ext === '.markdown' || ext === '.md') {
				id = uuid.v4();
				Kitten.load(postFile, function(err, post) {
					if(err) {
						throw err;
					}

					post.created_at = post.date;
					post.updated_at = post.date;
					post.uuid = id;

					store.save(post, function() {
						callback();
					});
				});
			}else{
				callback();
			}
		});
	});
}