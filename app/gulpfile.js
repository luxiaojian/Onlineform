var gulp = require('gulp');
var wiredep = require('wiredep');
var $ = require('gulp-load-plugins')();

var config = { 
    sassPath: './resources/sass',
     bowerDir: './bower_components' 
}


gulp.task('copy-js', function() {
    gulp.src(wiredep().js)
        .pipe(gulp.dest('./lib/js/'))
});

gulp.task('copy-css', function() {
    return gulp.src(wiredep().css)
        .pipe(gulp.dest('./lib/css/'));
});
gulp.task('bower', function() { 
    return $.bower() .pipe(gulp.dest(config.bowerDir)) 
});


//复制字体
gulp.task("font",function(){
	gulp.src(['./bower_components/bootstrap/dist/fonts/**','./bower_components/flat-ui/dist/fonts/**','./bower_components/fontawesome/fonts/**'])
		.pipe(gulp.dest('./lib/fonts/'));
});
//在html中自动插入链接
gulp.task("html", function() {
    gulp.src('./**.html')
        .pipe(wiredep.stream({
            fileTypes: {
                html: {
                    replace: {
                        js: function(filePath) {
                            return '<script src="' + './lib/js/' + filePath.split('/').pop() + '"></script>';
                        },
                        css: function(filePath) {
                            return '<link rel="stylesheet" href="' + './lib/css/' + filePath.split('/').pop() + '"/>';
                        }
                    }
                }
            }
        }))
        .pipe($.inject(
          gulp.src(['./build/js/**/**'], { read: false }), {
            addRootSlash: false,
            transform: function(filePath, file, i, length) {
              return '<script src="' + filePath.replace() + '"></script>';
            }
          }))
        
        .pipe($.inject(
          gulp.src(['./build/css/**.css'], { read: false }), {
            addRootSlash: false,
            transform: function(filePath, file, i, length) {
              return '<link rel="stylesheet" href="' + filePath.replace() + '"/>';
            }
          }))
        .pipe(gulp.dest('./'))
});

gulp.task("build",['copy-js','copy-css','font','html'])
gulp.task('default',['build'],function(){
    gulp.watch('./app/js/**/**.js',['html'])
})
