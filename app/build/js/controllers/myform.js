'use strict';

app.controller('myFormCtrl', function ($scope,$http) {
    $http.get('/admin/form/list').success(function(forms){
        $scope.forms = [].concat(forms);
    })

    $scope.delete = function($index){
        $http.post('/admin/form/list?id=' + $scope.forms[$index]._id).success(function(data){
            if(data.success === 1){
                $scope.forms.splice($index, 1);
            }
        }) 
    }
});