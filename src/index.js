'use strict';

const http = require('http');
const serveStatic = require('serve-static');
const finalhandler = require('finalhandler');
const emailProcessor = require('./email-processor');
const {print, sortObjectByValue} = require('./utils');
const {imap, server_port} = require('../config/config.json');

/**
 * Helper function to parse and display some email statistics
 * @method displayStats
 * @param  {object}     stats The stats object with size, from and tags properties
 */
function displayStats(stats) {
  // average size of the enails
  const avgSize = stats.size.reduce((acc, val) => acc + val) / stats.size.length;
  // from list sorted by number of emails sent by the user
  let sortedFromList = sortObjectByValue(stats.from);
  // tags list sorted by the number of occurances
  let sortedTagList = sortObjectByValue(stats.tags);

  // Top 5 senders
  if(sortedFromList.length > 5) sortedFromList = sortedFromList.slice(0, 5);

  // Top 5 tags
  if(sortedTagList.length > 5) sortedTagList = sortedTagList.slice(0, 5);

  // print the statistics
  print(`
        Email Stats:
        -----------
        - Total Emails      : ${stats.size.length}
        - Avg Size of email : ${((avgSize)/1024).toFixed(2)} KB
        - Top 5 Senders     : ${sortedFromList.join(', ')}
        - Top 5 Tags        : ${sortedTagList.join(', ')}
        - Tags Counter      : ${JSON.stringify(stats.tags)}
        - Senders Counter   : ${JSON.stringify(stats.from)}
  `);
}

(() => {
  /* Self executing function */

  // IMAP username/password from environment variables
  imap.username = process.env.IMAP_USERNAME;
  imap.password = process.env.IMAP_PASSWORD;

  if(!imap.username || !imap.password)
    throw new Error('IMAP username/password not provided as environment variables');

  // Initialize and process emails
  emailProcessor.initialize(imap).then(stats => displayStats(stats));

  // create a http server and serve some static html files for code coverage and jsdoc etc.

  // Serve up public/ftp folder
  const serve = serveStatic('../public/', {'index': ['index.html', 'index.htm']});

  // Create server
  const server = http.createServer((req, res) => serve(req, res, finalhandler(req, res)));

  // Listen on the given port
  const port = process.env.PORT || 8080;
  server.listen(port, '0.0.0.0');
  print(`<><><> Listening on http://0.0.0.0:${port} <><><>`);
})();
