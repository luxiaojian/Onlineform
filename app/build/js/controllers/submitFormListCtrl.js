'use strict';

app.controller('submitFormListCtrl', function($scope, $http, $interval) {
    $http.get('/common/form/finish').success(function(answers) {
        $scope.answers = [].concat(answers);
    })
    // $interval(function(){
    // },2000)
    $scope.del = function($index){
    	$http({
            method: 'POST',
            url: '/common/answer/list',
            params: {
                'formId': $scope.answers[$index].formId._id,
                '_id': $scope.answers[$index]._id
            }

        }).success(function(data){
    		if(data.success == 1){
		    	$scope.answers.splice($index,1);
    		}
    	})
    }
});
