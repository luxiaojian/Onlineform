'use strict';

app.controller('submitFormListItemCtrl', function($scope, $http,$stateParams) {
    $http.get('/common/answer/detail?id='+ $stateParams.id).success(function(answer) {
        $scope.answer = answer;
    })
});
