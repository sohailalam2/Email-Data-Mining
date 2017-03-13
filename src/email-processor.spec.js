'use strict';
const rewire = require('rewire');
const test = require('ava').test;
const emailProcessor = rewire('./email-processor');
const config = require('../config/config.json');

let imap;
test.before(()=>{
  imap = config.imap;
  imap.username = process.env.IMAP_USERNAME;
  imap.password = process.env.IMAP_PASSWORD;
});

test('#getTagsFromSubject should return tags', (t) => {
  const text = 'Hello [World] ... This is an [amazing] [World] in which [we] live in';
  const getTagsFromSubject = emailProcessor.__get__('getTagsFromSubject');
  const tags = getTagsFromSubject(text);

  t.is(tags.length, 4);
  t.true(tags.indexOf('[World]') >= 0);
  t.true(tags.indexOf('[we]') >= 0);
  t.true(tags.indexOf('[amazing]') >= 0);
  t.true(tags.indexOf('[not found]') === -1);
});

test('#countTags should count tags', (t) => {
  const text = 'Hello [World] ... This is an [amazing] [World] in which [we] live in';
  const getTagsFromSubject = emailProcessor.__get__('getTagsFromSubject');
  const tags = getTagsFromSubject(text);
  const countTags = emailProcessor.__get__('countTags');
  const stats = {
    tags: {}
  };
  countTags(tags, stats);

  t.is(stats.tags['[World]'], 2);
  t.is(stats.tags['[we]'], 1);
  t.is(stats.tags['[amazing]'], 1);
  t.is(stats.tags['[not found]'], undefined);
});

test('#countSenderEmails should count sender emails', (t) => {
  const countSenderEmails = emailProcessor.__get__('countSenderEmails');
  const from = 'test@test.com';
  const stats = {
    from: {}
  };
  countSenderEmails(from, stats);

  t.is(stats.from['test@test.com'], 1);
  t.is(stats.from['notfound@notfound.com'], undefined);
});

test('#countSenderEmails should count sender emails 2', (t) => {
  const countSenderEmails = emailProcessor.__get__('countSenderEmails');
  const from = 'test@test.com';
  const stats = {
    from: {}
  };
  countSenderEmails(from, stats);
  countSenderEmails(from, stats);

  t.is(stats.from['test@test.com'], 2);
});

test('#processEmail should process a given email and produce some stats', (t) => {
  const processEmail = emailProcessor.__get__('processEmail');
  const stats = {
    from: {},
    tags: {},
    size: []
  };
  const email = {
    '#': 20,
    'rfc822.size': 13009,
    'envelope': {
      'date': 'Thu, 9 Feb 2017 22:03:09 +0000 (GMT)',
      'subject': 'New sign-in from [Chrome] on [Mac]',
      'from': [
        {
          'address': 'no-reply@accounts.google.com',
          'name': 'Google'
        }
      ],
      'sender': [
        {
          'address': 'no-reply@accounts.google.com',
          'name': 'Google'
        }
      ],
      'reply-to': [
        {
          'address': 'no-reply@accounts.google.com',
          'name': 'Google'
        }
      ],
      'to': [
        {
          'address': 'maildude.tenforce@gmail.com',
          'name': ''
        }
      ],
      'message-id': '<XUCovkACcABh9TAAgp9dQg@notifications.google.com>'
    }
  };
  processEmail(email, stats);

  t.is(stats.from['no-reply@accounts.google.com'], 1);
  t.is(stats.tags['[Chrome]'], 1);
  t.is(stats.tags['[Mac]'], 1);
  t.is(stats.size[0], 13009);
});

test('#connectToImapServer should successfully connect to IMAP email server', async(t) => {
  const connectToImapServer = emailProcessor.__get__('connectToImapServer');
  try {
    const client = await connectToImapServer(imap);

    t.true(typeof client === 'object');
    t.true(typeof client.logout === 'function');
    t.true(typeof client.close === 'function');
    client.logout();
    client.close();
  } catch (e) {
    t.true(typeof e === 'undefined');
  }
});

test('#connectToImapServer should fail to connect to IMAP email server', async(t) => {
  const connectToImapServer = emailProcessor.__get__('connectToImapServer');
  try {
    const config = {};
    for (let k in imap) {
      if (imap.hasOwnProperty(k)) {
        config[k] = imap[k];
      }
    }
    config.username = 'test@gmail.com';
    const client = await connectToImapServer(imap);
  } catch (e) {
    t.true(typeof e !== 'undefined');
  }
});

test('#closeImapServerConnection should close IMAP email connection successfully', async(t) => {
  const connectToImapServer = emailProcessor.__get__('connectToImapServer');
  const closeImapServerConnection = emailProcessor.__get__('closeImapServerConnection');
  try {
    const client = await connectToImapServer(imap);
    await closeImapServerConnection(client);
    t.true(true);
  } catch (e) {
    t.true(typeof e === 'undefined');
  }
});

test('#initialize should connect to IMAP email server and process emails and produce stats', async(t) => {
  try {
    const stats = await emailProcessor.initialize(imap);

    t.true(stats.tags['[test]'] > 0);
    t.true(stats.from['mail-noreply@google.com'] > 0);
    t.true(stats.size.length > 0);
  } catch (e) {
    t.true(typeof e === 'undefined');
  }
});
