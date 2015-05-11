//var app = angular.module("demoapp",['ngRoute']);


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
