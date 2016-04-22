var fs = require('fs'),
    path = require('path'),
    // UglifyJS = require("uglify-js"),
    child = require('child_process');
// smushit = require('node-smushit');

var FileNum = 0,
    JsFileNum = 0,
    LessFileNum = 0;

//js压缩
var minify_js = function(file) {
    FileNum++;
    JsFileNum++;
    console.log('NO:' + FileNum + '-------------------');
    console.log('源文件:', file);
    //生成目标文件名
    var newfile = file.replace('.js', '.min.js');
    //压缩js文件
    var result = UglifyJS.minify(file);
    //生成目标文件
    fs.writeFile(newfile, result.code, function(err) {});
    console.log('目标文件:', newfile);
}

//less编译
var minify_css = function(file) {
    FileNum++;
    LessFileNum++;
    console.log('NO:' + FileNum + '-------------------');
    console.log('源文件:', file);
    //生成目标文件名
    var newfile = file.replace(/\/less\//gi, '\/css\/').replace('.less', '.css');
    //生成目标文件
    child.exec('lessc ' + file + ' ' + newfile + ' --compress');
    // child.spawn('lessc',[file,newfile,'--clean-css']);
    console.log('目标文件:', newfile);
}

//图片压缩
// var minify_img = function(file){
//  console.log('img:',file);
//  smushit.smushit(file,{ recursive: true });
// }

//遍历该文件夹下所有文件
function readfile(_path) {
    fs.readdir(_path, function(err, files) {
        for (var i = 0; i < files.length; i++) {
            var file = files[i],
                newpath = _path + path.sep + file;

            var stat = fs.statSync(newpath);
            // console.log('文件名:',file,'路径:',newpath,'是否文件夹:',stat.isDirectory());
            if (stat.isDirectory()) {
                readfile(newpath);
            } else {
                var date = new Date(),
                    localTime = date.getTime() / (1000 * 3600),
                    editTime = stat.mtime.getTime() / (1000 * 3600),
                    descTime = localTime - editTime;
                // if (descTime < 24) {
                    if (file.indexOf('.less') > -1 && newpath.indexOf(path.sep + 'lib' + path.sep) < 0) {
                        minify_css(newpath);
                    }
                    if (file.indexOf('.js') > -1 && file.indexOf('.json') < 0 && file.indexOf('.min.js') < 0 && newpath.indexOf(path.sep + 'dialog' + path.sep) < 0 ) {
                        // minify_js(newpath);
                    }
                // }
            }
        }
    })
}

console.log('开始压缩-----------------------------------------');

var filepath = '.';
readfile(filepath);
// minify_img(filepath);
