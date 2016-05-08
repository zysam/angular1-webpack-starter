'use strict'

const path = require('path')
const yargs = require('yargs')
const gulp = require('gulp')
const $ = require('gulp-load-plugins')({lazy: true})

const root = 'client'
const paths = {
  blankComponetTemplates: path.join(__dirname, 'generator', 'component/**/*.**'),
  blankPageTemplates: path.join(__dirname, 'generator', 'page/**/*.**')
}
gulp.task('component', () => {
  generate('component')
})

gulp.task('pages', () => {
  generate('pages')
})

function generate (type) {
  const cap = (val) => {
    return val.charAt(0).toUpperCase() + val.slice(1)
  }
  const name = yargs.argv.name
  const parentPath = yargs.argv.parent || ''
  const destPath = path.join(root, 'app', type, parentPath, name)

  return gulp.src(paths.blankTemplates)
    .pipe($.template({
      name: name,
      upCaseName: cap(name)
    }))
    .pipe($.rename((path) => {
      path.basename = path.basename.replace('temp', name)
    }))
    .pipe(gulp.dest(destPath))
}
