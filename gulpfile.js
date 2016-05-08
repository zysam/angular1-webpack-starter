'use strict'

const gulp = require('gulp')
var $ = require('gulp-load-plugins')({lazy: true})

require('./gulp/clean')
require('./gulp/generator')
// require('./gulp/webpack')

// gulp.task('watch', ['serve'])
// gulp.task('default', ['watch'])

gulp.task('default', ['help'])
gulp.task('help', $.taskListing)
