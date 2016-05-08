'use strict'

const gulp = require('gulp')
const del = require('del')
const paths = require('./config')
const $ = require('gulp-load-plugins')({lazy: true})

gulp.task('clean', (cb) => {
  del([paths.dest]).then(function (paths) {
    $.gutil.log('[clean]', paths)
    cb()
  })
})
