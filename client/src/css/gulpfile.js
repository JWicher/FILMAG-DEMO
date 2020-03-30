const gulp = require('gulp');
const sass= require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', () => {
    return gulp.src('./sass/main.scss')
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'expanded'}))
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('../'))
});

gulp.task('watch', () => {
    gulp.watch('./sass/*/*.scss', gulp.series('sass'))
});