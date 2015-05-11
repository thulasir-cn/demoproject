var app = angular.module("demoapp",['ngRoute']);

app.config(['$routeProvider',function($routeProvider) {


// 	$locationProvider.html5Mode({
//   enabled: true,
//   requireBase: false
// });


	      $routeProvider.when('/home', {
			             
			              templateUrl: 'views/home.html',
			              controller: 'homeCtrl'
	                  }).when('/aboutus', {
	                     
	                      templateUrl: 'views/aboutus.html',
	                      controller: 'aboutCtrl'
	                 }).when('/services', {
	                     
	                      templateUrl: 'views/services.html',
	                      controller: 'servicesCtrl'
	                 }).when('/login', {
	                 	  templateUrl: 'views/login.html',
	                      controller: 'logintCtrl'
	                 }).when('/dashboard', {
	                 	  templateUrl: 'views/dashboard.html',
	                      controller: 'dashboardCtrl',
	                      resolve  :{
	                      	logincheck : checkLogin
	                      }
	                 }).when('/contact', {
	                 	  templateUrl: 'views/contactus.html',
	                      controller: 'contactCtrl'
	                 }).when('/profile', {
	                 	  templateUrl: 'views/profile.html',
	                      controller: 'profileCtrl',
	                      resolve  :{
	                      	logincheck : checkLogin
	                      }
	                 }).when('/logout', {
 	                      controller: 'navCtrl'
	                 }).when('/signup', {
	                 	  templateUrl: 'views/signup.html',
	                      controller: 'signupCtrl'
	                 }).otherwise({
                            
                           redirectTo: '/home'
                          
                          });
}]);

app.controller('homeCtrl', ['$scope', function($scope){
	
}]);
app.controller('aboutCtrl', ['$scope', function($scope){
	
}]);
app.controller('contactCtrl', ['$scope', function($scope){
	
}]);

app.controller('servicesCtrl', ['$scope', function($scope){
	
}]);


app.controller('logintCtrl',function($scope,$http,$rootScope,$location){
		$scope.login = function(user){
				//console.log(user);
				$http.post('/login',user).success(function(responce){
					$rootScope.currentUser = responce;
					//console.log(responce);
				 if ($rootScope.currentUser.username !== 'admin@gmail.com') {
						$location.url('/profile');
				}else{
					$location.url('/dashboard');
				}
				
			});
		}
	});


app.controller('profileCtrl', ['$scope','$http','$rootScope', function($scope,$http,$rootScope){
	var refresh = function(){
					$scope.change = "";	
				}
	

	$scope.edit = function(id){
		console.log(id);
			$http.get('/edit/'+id).success(function(response){
				//console.log(response);
				$scope.change = response;
			})

	}

	$scope.update = function(change){
		console.log(change);
		$http.put('/update/'+$scope.change._id,change).success(function(response){
			//console.log(response);
			//console.log($rootScope.currentUser);
			$rootScope.currentUser={};
			$rootScope.currentUser=$scope.change;
			refresh();
		});
	}

	
	}]);
app.controller('dashboardCtrl',['$scope','$http',function($scope,$http){

var refresh = function(){
	$http.get('/admin/user').success(function(response){
			
			console.log(response);
			$scope.users = response;
			$scope.change = "";
			});
	}
refresh();

	$scope.edit = function(id){
		console.log(id);
		$http.get('/edit/'+id).success(function(response){
			console.log(response);
			$scope.change = response;
		})

	}
	
	$scope.remove = function(id){
		console.log(id);
		$http.delete('/delete/'+id).success(function(response){
			console.log(response);
			refresh();
		})

	};

	$scope.update = function(change){
		//console.log(change);
		$http.put('/update/'+$scope.change._id,change).success(function(response){
			//console.log(response);
			refresh();
		});
	}

	
}]);


app.controller('servicesCtrl', ['$scope', function($scope){
	
	}]);

app.controller('signupCtrl',  function($scope,$http,$location,$rootScope){
			$scope.register = function(user){
				//console.log(user);
				if (user.password == user.password2) {
						$http.post('/register',user).success(function(user){
							$rootScope.currentUser = user;
							console.log(user);
							if (user) {
									$location.url('/profile');
							}
							
						});
				}else{
					console.log("passwords are not same");
				}
			}
	});

app.controller('navCtrl', function($scope,$http,$location,$rootScope){
				$scope.logout = function(){
						$http.get('/logout').success(function(){
							$location.url('/login');
							$rootScope.currentUser = null;
						});
					}
		});

var checkLogin = function($q,$http,$location,$rootScope){
			
			var deferred = $q.defer();
			
			$http.get('/loggedin').success(function(user){
						//$rootScope.errorMessage = null;
						//user autenticted 
						if (user !== '0') {
								$rootScope.currentUser = user; 
								deferred.resolve();

						}
						//user is not autenticated
						else{
							//$rootScope.errorMessage = "you need to log in";
							deferred.reject();
							$location.url('/login');
						}
			
			})
			return deferred.promise;
};

	





