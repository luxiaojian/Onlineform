'use strict';

app.controller('headerCtrl', ['$scope', '$location', '$http', 'Auth','$interval' ,function($scope, $location, $http, Auth,$interval) {
    $scope.user = {
        name: 'Maria Shanina',
        email: 'hello@plainwhite.co'
    }

    $http.get('/info').success(function(user) {
        // console.log(user);
        $scope.user = {
            name: user.name,
            email: user.email,
            role: user.role,
            avator: user.avator
        }
        if(user.role == 2){
            $scope.show = true;
        }else{
            $scope.show = false;
        }   
    })

    // $interval(function(){
    // },3000);

    $scope.logout = function() {
        Auth.logout(function() {
            window.location.href = '/';
        }, function() {
            $rootScope.error = "Failed to logout";
        });
    }
}]);
