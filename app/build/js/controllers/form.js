'use strict';

app.controller('FormCtrl', function ($scope,$http,$stateParams) {
    $http.get('/admin/form/'+$stateParams.id).success(function(form){
        $scope.form = form;
    })
});