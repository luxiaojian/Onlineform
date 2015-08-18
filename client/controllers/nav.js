exports.pageIn = function(req,res,next){
    res.locals.activeNav = function(nav){
        var result = '';
        var _path = req.path;
        console.log('_path:'+req.path);
        if(nav == _path){
            result = 'active';
        }else{
            result = '';
        }
        return result;
    }
    next();
}