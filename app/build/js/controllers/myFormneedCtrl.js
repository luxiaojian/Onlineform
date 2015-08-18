'use strict';

app.controller('myFormneedCtrl', function ($scope,$http,$stateParams,$location) {
    $http.get('/admin/form/'+ $stateParams.id).success(function(form){
        $scope.form = {
        	form_name: form.form_name,
        	form_fields: form.form_fields,
        	formId: form._id,
            form_creater: form.form_creater
        }
    })
    $scope.submitted = false;
    $scope.submit = function(){
    	$scope.submitted = true;
        $http.post('/admin/answer',$scope.form).success(function(data){
        	if(data.success == 1){
                $location.url('/common/form/finish')
            }
        })
    }
});