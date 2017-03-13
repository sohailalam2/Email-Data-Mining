'use strict';
const test = require('ava').test;
const utils = require('./utils');

test('#print should print', (t) => {
  utils.print('Something to print');
  t.true(true);
});

test('#sortObjectByValue should return sorted values', (t) => {
  const sortedList = utils.sortObjectByValue({one: 1, two: 2, three: 3});
  t.is(sortedList.length, 3);
  t.true(sortedList[0] === 'three');
  t.true(sortedList[1] === 'two');
  t.true(sortedList[2] === 'one');
});
