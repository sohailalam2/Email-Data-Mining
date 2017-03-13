'use strict';

/**
 * Nice printing function
 * @method print
 * @param  {object} data Spread arguments
 */
function print(...data) {
  console.log('');
  console.log('>> ', ...data);
}

/**
 * Sort a given object of key-value pairs, which needs to be sorted by value and
 * the sorted result needs to contain the keys in order as an array
 * @method sortObjectByValue
 * @param  {object}          obj The object key-value pairs that needs to be sorted
 * @return {array}               The sorted array containing the keys
 */
function sortObjectByValue(obj) {
  return Object.keys(obj).sort((a,b) => obj[a] < obj[b]);
}

module.exports = {
  print,
  sortObjectByValue
};
