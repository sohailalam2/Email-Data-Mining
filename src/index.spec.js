'use strict';
const rewire = require('rewire');
const test = require('ava').test;
const index = rewire('./index');

test('#displayStats should display stats', (t) => {
  const displayStats = index.__get__('displayStats');
  const stats = {
    'tags': {
      '[test]': 4,
      '[foo]': 2,
      '[info]': 1,
      '[check]': 1,
      '[tags]': 1,
      '[bar]': 2,
      '[te]': 1,
      '[sting]': 1
    },
    'from': {
      'mail-noreply@google.com': 3,
      'karel.kremer@tenforce.com': 5,
      'karel.kremer@gmail.com': 3,
      'no-reply@accounts.google.com': 10,
      'hamadatayeh@hotmail.com': 2,
      'test@test.com': 2
    },
    'size': [
      6933,
      4849,
      7763,
      3821,
      3888,
      3755,
      1529940,
      3637,
      3644,
      3643,
      3550,
      12342,
      10288,
      8567,
      8402,
      10628,
      13006,
      10191,
      10647,
      13009,
      10442,
      10465,
      10219
    ]
  };
  displayStats(stats);
  t.true(true);
});
