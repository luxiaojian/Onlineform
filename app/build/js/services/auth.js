'use strict';


app.factory('Auth', ['$http','$cookieStore',function ($http,$cookieStore) {
	var accessLevels = routingConfig.accessLevels
	    , userRoles = routingConfig.userRoles
	    , currentUser = $cookieStore.get('user') || { username: '', role: userRoles.public };
	// $cookieStore.remove('user');

	function changeUser(user){
		console.log('开始改变cookie!');
		angular.extend(currentUser, user);
	}

	return {
		authorize: function(accessLevel,role){
			if(role === undefined){
				role = currentUser.role;
			}
			// console.log(accessLevel.bitMask & role.bitMask);
			return accessLevel.bitMask & role.bitMask;
		},
		isAdmin: function(role){
			if(role === undefined){
				role = currentUser.role;
			}
			if(role.bitMask == '4'){
				return true;
			}
		},
		isLoggedIn: function(user) {
		    if(user === undefined) {
		        user = currentUser;
		    }
		    return user.role.title === userRoles.user.title || user.role.title === userRoles.admin.title;
		    // console.log(user.role.title === userRoles.user.title || user.role.title === userRoles.admin.title);
		},
		register: function(user, success, error) {
		    $http.post('/user/signup', user).success(function(user) {
		        changeUser(user);
		        success(user);
		    }).error(error);
		},
		login: function(user, success, error) {
		    $http.post('/user/signin', user).success(function(user){
		    	console.log(user);
		        changeUser(user);
		        success(user);
		    }).error(function(err){
		    	error(err)
		    });
		},
		logout: function(success, error) {
		    $http.get('/logout').success(function(){
		        $cookieStore.remove('user');
		        success();
		    }).error(error);
		},
		accessLevels: accessLevels,
		userRoles: userRoles,
		user: currentUser
	};
}])