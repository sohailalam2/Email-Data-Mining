'use strict';

const ava = require('gulp-ava');
const gulp = require('gulp');
const jsdoc = require('gulp-jsdoc3');

/**
 * $ gulp test
 * description: runs the tests for the project
 */
gulp.task('test', () => {
  return gulp.src('src/**/*.spec.js').pipe(ava({verbose: true, nyc: true, require: ['babel-register'], babel: 'inherit'}));
});

gulp.task('docs', () => {
  const config = require('./jsdoc.json');
  return gulp.src(['README.md', './src/**/*.js'], {read: false})
        .pipe(jsdoc(config));
});

gulp.task('default', ['test', 'docs']);
