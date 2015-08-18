'use strict';

app.controller('labDetailCtrl', function($scope, $http, $stateParams) {
    $http.get('/admin/lab/list').success(function(labs) {
        $scope.labs = [].concat(labs);
    })
    //表示是否显示添加实验室表单
    $scope.showMode = false;
    
    $scope.form= {};
    $scope.form.members =[];
    if($stateParams.id){
        $http.get('/admin/lab/update/'+$stateParams.id).success(function(lab){
            $scope.form._id = lab._id;
            $scope.form.name = lab.name;
            $scope.form.desc = lab.desc;
            $scope.form.phone = lab.phone;
            $scope.members = [].concat(lab.members);
            $scope.members = $scope.members.map(function(x){
                return Object.defineProperty(x,'selected',{value:true,writable: true,enumerable: true});
            })
        })
    }else{
        $http.get('/admin/lab/addMember').success(function(users){
            $scope.members = [].concat(users);
            $scope.members = $scope.members.map(function(x){
                return Object.defineProperty(x,'selected',{value:false,writable: true,enumerable: true});
            })
        })
    }

    //显示添加实验室的表单
    $scope.add = function(){
        $scope.showMode = true;
    }

    $scope.form.submit = function(){
        $http.post('/admin/lab',$scope.form).success(function(data){
            if(data.success === 1){
                $http.get('/admin/lab/list').success(function(labs) {
                    $scope.labs = [].concat(labs);
                    $scope.showMode = false;
                })
            }
        })
    }
    $scope.delete = function($index){
    	$http({
            method: 'POST',
            url: '/admin/lab/list',
            data: $scope.labs[$index]
        }).success(function(data){
    		if(data.success == 1){
		    	$scope.labs.splice($index,1);
    		}
    	})
    }
});
