const gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    autoprefixer = require('gulp-autoprefixer'),
    include = require('gulp-file-include'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglifycss = require('gulp-uglifycss'),
    tingpng = require('gulp-tinypng'),
    uncss = require('gulp-uncss'),
    clean = require('gulp-clean'), 
    zip = require('gulp-zip'),
    gcmq = require('gulp-group-css-media-queries');
    sourcemaps = require('gulp-sourcemaps'),
    uglifyEs = require('gulp-uglify-es').default,
    uglify = require('gulp-uglify');

// gulp scss
gulp.task('scss', () => {
    return gulp.src('./src/style.scss')
        .pipe(sass())
        .pipe(autoprefixer({
             overrideBrowserslist: ['last 10 versions'], 
             cascade: false ,
            }))
        .pipe(gulp.dest('./src/css/'))
        .pipe(browserSync.stream())
})

// gulp html 
gulp.task('html', () => {
    return gulp.src('./src/index.html')
        .pipe(include({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('./public/'))
        .pipe(browserSync.stream())
});

// gulp img
gulp.task('img', function() {
    return gulp.src('./src/img/*')
        .pipe(tingpng('LTxmrhnmSzWP3xc5jtVcS882Y69DJl0l'))
        .pipe(gulp.dest('./public/img/'))
        .pipe(browserSync.stream())
})

// gulp copy
gulp.task('copyImg',()=>{
    return gulp.src('./src/img/**')
    .pipe(gulp.dest('./public/img/'))
    .pipe(browserSync.stream())
})
gulp.task('copyFonts',()=>{
    return gulp.src('./src/fonts/*')
    //.pipe(gulp.src('./src/fonts/'))
    .pipe(gulp.dest('./public/fonts/'))
    .pipe(browserSync.stream())
})
gulp.task('copy',gulp.parallel('copyFonts','copyImg'))

// gulp css
gulp.task('css', () => {
    return gulp.src([
        'node_modules/normalize.css/normalize.css',
        'node_modules/bootstrap/dist/css/bootstrap-reboot.min.css',
        './src/css/*.css',
    ]) 
    .pipe(concat('./style.css'))
    .pipe(gulp.dest('./public/css/')) 
    .pipe(rename({
        suffix:'.min'
    }))
    .pipe(uncss({
        html: ['./src/page/**.html']
    }))
    .pipe(gcmq())
    .pipe(uglifycss({
        uglyComments: true 
    }))
    .pipe(gulp.dest('./public/css/'))
    .pipe(browserSync.stream())
})

// gulp JS             
gulp.task('js', () => {
    return gulp.src([
            './node_modules/jquery/dist/jquery.min.js',
            './src/js/app.js',
        ])
        //.pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./public/js/'))
        .pipe(rename({
            suffix:'.min'
        }))
        .pipe(uglify())
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/js/'))
        .pipe(browserSync.stream())
})

// gulp clean
gulp.task('cle', () => {
    return gulp.src([
            './public/**', '!./public',
            './src/scss/**.scss', '!./src/scss/style.scss',
            './src/page/**.html', '!./src/page/index.html',
            '!./src/scss/mixin.scss','!./src/scss/vars.scss', 
        ])
        .pipe(clean());
})

// gulp Zip  
gulp.task('zip', () => {
    return gulp.src('./src/**')
        .pipe(zip('src.zip'))
        .pipe(gulp.dest('./public'))
})

//##########  SERVER   ##########
gulp.task('server', gulp.parallel('scss', 'html', 'js','copy', () => {
    browserSync.init({
        server: { baseDir: './public/' }
    })
    gulp.watch('./src/scss/**.scss', gulp.parallel('scss')) 
    gulp.watch('./src/page/**.html', gulp.parallel('html'))
    //
    gulp.watch('./src/style.scss', gulp.parallel('scss')) 
    gulp.watch('./src/index.html', gulp.parallel('html'))
    //
    gulp.watch('./src/css/*.css', gulp.parallel('css'))
    gulp.watch('./src/js/**.js', gulp.parallel('js'))
    //
    gulp.watch('./src/img/**', gulp.parallel('copy'))
    gulp.watch('./src/fonts/*', gulp.parallel('copy'))
}))
gulp.task('default', gulp.parallel('server'))