<?php
//require('php/auth.php');
?>
<!DOCTYPE html>
<html ng-app="blog">
<head>
<link href="css/bootstrap.min.css" rel="stylesheet"/>
<link href="css/style.css" rel="stylesheet"/>
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>

<script type="text/javascript" src="js/scripts.js"></script>
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body ng-controller="ApplicationController">
<div ng-view>

</div>

<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.17/angular.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/angularjs/1.2.17/angular-route.js"></script>
<script src='https://cdn.firebase.com/js/client/1.0.15/firebase.js'></script>
<script src='https://cdn.firebase.com/libs/angularfire/0.7.1/angularfire.min.js'></script>
<script type='text/javascript' src='https://cdn.firebase.com/js/simple-login/1.5.0/firebase-simple-login.js'></script>
<script type="text/javascript" src="app/app.js"></script>
<script type="text/javascript" src="app/auth.js"></script>
</body>
</html>