// APP.JS
//
(function(){
//var FB_URL = "https://vivid-fire-6678.firebaseio.com/";
var feed;
var app = angular.module('blog', ['ngRoute', 'firebase', ]);
app.constant('FB_URL', 'https://vivid-fire-6678.firebaseio.com/');
app.controller('ApplicationController',['$firebase','$scope','$rootScope','$location','FB_URL', '$firebaseSimpleLogin',  function($firebase, $scope, $rootScope, $location, FB_URL, $firebaseSimpleLogin){
	
	var dataRef = new Firebase(FB_URL);
	$rootScope.fb = $firebase(dataRef);
	$rootScope.loginObj = $firebaseSimpleLogin(dataRef);
	var Auth = $rootScope.loginObj;
	Auth.$getCurrentUser().then(function(user){
		if(!$rootScope.currentUser && user){
			$rootScope.currentUser = $scope.fb.$child('users').$child(user.id);
			$rootScope.userID = $rootScope.currentUser.$id;
		}
		console.log($rootScope.currentUser);
		
	});
		
		
	
}]);
app.run(function ($rootScope, $firebaseSimpleLogin, $location) {
	$rootScope.$on('$routeChangeStart', function (event, next, $firebaseSimpleLogin, $scope, $rootScope) {
		//console.log(event.targetScope);
	
		//console.log(event.targetScope.currentUser);
		event.targetScope.loginObj.$getCurrentUser().then(function(user){ 
			
			var userAuthenticated = null;
			if (user || event.targetScope.currentUser)
				var userAuthenticated =  true;
				
			//console.log(userAuthenticated);
			if(!userAuthenticated && next.needsAuth){
				$location.path('/login');
			}
		}, function(error){
			console.log(error);
			
		});
    });
	$rootScope.$on("$firebaseSimpleLogin:logout", function(e, user) {
		
			$rootScope.currentUser = null;
		var currLoc = $location.path();
		//if(currLoc == '/admin')
			$location.path('/login');
	});
	$rootScope.$on("$firebaseSimpleLogin:login", function(e, user) {
		console.log(user.email + ' is logged in');
		$rootScope.currentUser = $rootScope.fb.$child('users').$child(user.id);
		//console.log($rootScope.currentUser);
		// $rootScope.currentUser.feed = $rootScope.currentUser.feed;
		
		$location.path('/home');
	});
});
app.controller('AdminController', function($scope){
	$scope.page= "Admin Page";
	
	$scope.action = ['new','edit', 'default','postCreated','postFailed']; //sets up switch array for different "views" in admin, might try UI-Router for angular at a later time.
	$scope.selection = $scope.action[2];
	$scope.changeView = function(num){
		$scope.selection = $scope.action[num];
	};
});

app.controller('LogInController',['$firebase','$scope','$rootScope','$location','FB_URL', '$firebaseSimpleLogin',  function($firebase, $scope, $rootScope, $location, FB_URL, $firebaseSimpleLogin){
			
			$scope.alert= false;
			$scope.notices='';
			this.credentials = {};
			$scope.login = function(credentials){
				
				$rootScope.loginObj.$login('password',this.credentials)
				.then(function(user) {
					$rootScope.currentUser = user;
				}, function(error) {
					if(error.code == "INVALID_EMAIL")
						error = {header:"Invalid Email!", message:"Sorry, that email does not exist in our database."};
					else if (error.code == "INVALID_PASSWORD")
						error = {header:"Invalid Password!",message:" Sorry, but that password does not match our records, please try again!"};
				   $scope.notices = error;
				   $scope.alert=true;
				});
			};
			$scope.signUp = function(newuser){
				var userData = newuser;
				var userRef = new Firebase(FB_URL+'users');
				$scope.users = $firebase(userRef); //oooohhhhhh
				$rootScope.loginObj.$createUser(newuser.email,newuser.password).then(function(user){
					var child = $scope.users.$child(user.id);
					child.$set({name:userData.fullname,email:userData.email,username:userData.username});
					userRef.auth(user.token,function(error){
						if(error) {
							console.log("Login Failed!", error);
						  } else {
							console.log("Login Succeeded!");
						  }
					});
					console.log(user);
					//$scope.login(userData.email,userData.password);
				},function(error){
					console.log(error);
				});
			};
			
}]);
app.controller('HomeController', function($scope, $rootScope){
	$scope.page= "Home Page";
});
app.controller('ProfileController', function($scope, $rootScope){

});
app.controller('PostController', ['$rootScope','$scope','$firebase','FB_URL', '$location', function($rootScope, $scope, $firebase, FB_URL, $location ){
	console.log($rootScope.currentUser);
	var dataRef = new Firebase(FB_URL);
	var postRef = dataRef.child('posts');
	var userRef = dataRef.child('users');
	$scope.feed = {};
	$scope.newpost = {};
	$scope.posts = $firebase(new Firebase(FB_URL+'posts'));
	$scope.users = $firebase(new Firebase(FB_URL+'users'));
	var posts= $scope.posts;
	$scope.currIndex =0;
	
	posts.$on("loaded", function(currIndex){
		var getIndex = posts.$getIndex();
		$scope.currIndex = getIndex.length;
		//console.log($scope.posts);
	});
	//
	posts.$on("child_added", function(snap){
		var getIndex = posts.$getIndex();
		$scope.currIndex = getIndex.length;
		//console.log('Index: '+$scope.currIndex);
	});
	this.getAllPosts = function(posts) {
		
	};
	
	var i =0;
	$scope.getPostById = function(postID){
		//i++
		//console.log(i);
		var post = postRef.child(postID);
		var data;
		post.once('value', function(snap){
		//	console.log(snap.val());
			data = snap.val();
			return  data;
		
		});
		return data;
	};
	
		/*console.log(feed);
				for(i=0;i < feed.length;i++){
					$rootScope.feed[i] = $scope.getPostById(feed[i]);
				};
	*/
	
	
	this.createPost = function(newpost, $firebase) {	
		//console.log('Old Index: '+$scope.currIndex);
		
		var newPostRef = $scope.posts.$child($scope.currIndex+1);
		$scope.newpost = {}; //resets form inputs.
		 newPostRef.$set({title:newpost.title, content:newpost.content, date:new Date(),userid:$scope.userID, author:$scope.currentUser.name.firstName +' '+$scope.currentUser.name.lastName}).then(function(){
			
			newPostRef.$on('value', function(snap) {
				var postID = snap.snapshot.name;
				//console.log(postID);
				var currFeed = $scope.currentUser.feed;
				var user = userRef.child($scope.userID);
				var newfeed = currFeed+','+postID;
				user.update({feed:newfeed});
				console.log($scope.currentUser.feed)
			});
			
			
			
			/*
			userRef.child($scope.userID).child('feed').transaction(function(currentData){
				return currentData +','+postID;
			});//Add post id to user's feed
			//$location.path('/home');
			//console.log('New Index: '+$scope.currIndex);*/
			});
		
	};
}]);
app.directive("newPost", ['$http', function($scope, $http){
	return {
		restrict:'A',
		templateUrl:'app/new-post.html',
		controller:'PostController',
		controllerAs:'post'
	};
}]);

app.config(['$routeProvider', '$locationProvider', 
    function($routeProvider, $locationProvider) {
  $routeProvider
   .when('/admin', {
    templateUrl: 'admin.html',
	controller: 'AdminController',
	needsAuth: true
  })
  .when('/home', {
    templateUrl: 'home.html',
	controller: 'HomeController',
	needsAuth: true
  })
  .when('/login', {
    templateUrl: 'app/html/login-form.html',
	controller: 'LogInController',
	needsAuth: false
  })
  .when('/signup', {
	templateUrl:'app/html/signup.html',
	controller:'LogInController',
	needsAuth:false
  })
  .when('/profile', {
	templateUrl: 'app/html/profile.html',
	controller: 'ProfileController',
	needsAuth: true
  })
  .otherwise({redirectTo: '/home'});
}]); 


})();