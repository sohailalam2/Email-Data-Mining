'use strict';
const ImapClient = require('emailjs-imap-client');
const {print} = require('./utils');

/**
 * Extract tags from the subject line.
 * A tag is assumed to be of the format [tag_name]
 * @method getTagsFromSubject
 * @param  {string}           subject The subject line of the email
 * @return {array}            An array of tags or null
 */
function getTagsFromSubject(subject) {
  // regex defining the tag - format [tag_name]
  const TAG_REGEX = /\[([^\]]*)\]/g;
  return subject.match(TAG_REGEX);
}

/**
 * Given an array of tags, it will count the occurrances of tags
 * and store the value in a global map
 * @method countTags
 * @param  {array}  tags An array of tags or null
 * @param  {object}         stats The stats object containing email statistics
 */
function countTags(tags, stats) {
  // check if tags exists and is an array
  if (Array.isArray(tags)) {
    tags.forEach(t => {
      // count the tags
      if (!stats.tags[t])
        stats.tags[t] = 1;
      else
        stats.tags[t] += 1;
      }
    );
  }
}

/**
 * Given a sender email, it will count the total number of emails received from the sender
 * @method countSenderEmails
 * @param  {string}          from The sender's email id
 * @param  {object}         stats The stats object containing email statistics
 */
function countSenderEmails(from, stats) {
  if (from) {
    if (!stats.from[from])
      stats.from[from] = 1;
    else
      stats.from[from] += 1;
    }
  }

/**
 * Processes an email by extracting valuable statistics and other information
 * @method processEmail
 * @param  {object}     email The email object
 * @param  {object}         stats The stats object containing email statistics
 */
function processEmail(email, stats) {
  const size = email['rfc822.size'];
  const from = email.envelope.from[0].address;
  const subject = email.envelope.subject;

  // store the size of the email
  stats.size.push(size);
  // extract the tags and count them
  const tags = getTagsFromSubject(subject);
  countTags(tags, stats);
  // count the total emails sent by the sender
  countSenderEmails(from, stats);

  /*
  print(`Message: #${email['#']}
        - Size: ${size}
        - Subject: ${subject}
        - From: ${JSON.stringify(from)}
        - Tags: ${tags
    ? tags.join(', ')
    : ''}`);
  */
}

/**
 * Async function to connect to a given IMAP email server
 * @method connectToImapServer
 * @param  {object}            config The configuration object containing the host, port, username, password
 * @return {Promise}                  The email client on awaiting for the connection
 */
async function connectToImapServer(config) {
  // connect to the IMAP email server
  print('Connecting to Email Server');
  const client = new ImapClient(config.host, config.port, {
    // a hack to disable the internal library console logs
    logger: {
      debug: () => {},
      error: () => {}
    },
    // enable TLS by default
    ignoreTLS: config.enableSSL || true,
    // enable compression by default
    enableCompression: config.enableCompression || true,
    // user authentication
    auth: {
      user: config.username,
      pass: config.password
    }
  });

  // error handler for the IMAP client
  client.onerror = (error) => print('ERROR:: ', error);

  // try to connect and wait for the connection in an asynchronous fashion
  await client.connect();
  print(`Successfully connected to Email Server: ${client.serverId.vendor} - with account : ${client.options.auth.user}`);
  return client;
}

/**
 * Close an existing IMAP connection
 * @method closeImapServerConnection
 * @param  {object}                  client The IMAP Client
 * @return {Promise}
 */
async function closeImapServerConnection(client) {
  if (client) {
    print('Logging out of email server');
    // try to logout and then close the connection
    await client.logout();
    await client.close();
    print('Successfully logged out and connection was closed');
  }
}

/**
 * The entry point for the email parsing utility
 * @method initialize
 * @param  {object}   config The IMAP config
 * @return {Promise}
 */
const initialize = async function(config) {
  // A stats object containing information about some email statistics
  const stats = {
    tags: {},
    from: {},
    size: []
  };

  // connect to IMAP email server
  const client = await connectToImapServer(config);

  // list the mail boxes
  const mailboxes = await client.listMailboxes();
  print('Available mailboxes: ', mailboxes.children.map(m => m.name).join(', '));

  // Select the INBOX mailbox
  const inbox = await client.selectMailbox('INBOX');
  print(`Opening Inbox... Found ${inbox.exists} emails`);

  // get all messages from inbox, only care of the message size and metadata
  const messages = await client.listMessages('INBOX', '1:*', ['RFC822.SIZE', 'ENVELOPE']);
  print('Processing emails');

  // process all messages
  messages.forEach(m => processEmail(m, stats));

  // logout and close the connection
  closeImapServerConnection(client);
  return stats;
};

module.exports = {
  initialize
};
