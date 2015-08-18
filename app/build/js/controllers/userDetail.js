'use strict';

app.controller('userDetailCtrl', function($scope, $http, $stateParams) {
    $http.get('/admin/user/list').success(function(users) {
        $scope.users = [].concat(users);
    })
    
    $scope.delete = function($index){
    	$http.post('/admin/user/list?id='+ $scope.users[$index]._id).success(function(data){
    		if(data.success == 1){
		    	$scope.users.splice($index,1);
    		}
    	})
    }
    //表示是否显示添加用户
    $scope.showMode = false;

    $scope.lab = undefined;
    $scope.newUsers = [];
    $scope.disable = false;

    //动态获取服务端的实验室名字
    $scope.getlabs = function(val){
        return $http.get('/admin/lab?name='+ val).then(function(response){
            // console.log(response);
            if(response.status === 204){
                $scope.disable = true;
                var data = ['没有找到相关实验室']
                return data;
            }else{
                $scope.disable = false;
                $scope.labs = [].concat(response.data);
                return response.data.map(function(item){
                    return item.name;
                });  
            }
        })
    }
    //显示添加用户面板
    $scope.add = function(){
        $scope.showMode = true;
    }

    $scope.close = function(){
        $scope.showMode = false;
    }

    $scope.submit = function(){
        $scope.labs.map(function(item){
            if(item.name == $scope.lab){
                $scope.labId = item._id;
            }
        })
        $scope.newUsers.map(function(item){
            item.lab= $scope.labId,
            item.password = $scope.password
        })

        $http.post('/admin/user/add',$scope.newUsers).success(function(data){
            if(data.success == 1){
                $scope.disable = true;
                $scope.success = true;
                $scope.users = $scope.users.concat($scope.newUsers);
                $scope.msg = '已经成功添加用户！'
                 $http.get('/admin/user/list').success(function(users) {
                    $scope.users = [].concat(users);
                })
            }else if(data.error == 1){
                $scope.error = true;
                var str = [],error = {};
                error = data.msg.filter(function(x){
                    return typeof x === 'object';
                })[0];
                str = data.msg.filter(function(x){
                    return typeof x === 'string';
                });

                $scope.disable = true;
                $scope.msg= error.name+ '用户数据库已经存在,添加失败,'+str.join(',')+'等用户添加成功！';
                $http.get('/admin/user/list').success(function(users) {
                    $scope.users = [].concat(users);
                })
            }
        })
    }
});
