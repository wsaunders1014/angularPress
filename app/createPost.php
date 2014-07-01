<?php
require('_db.php');
$postdata = file_get_contents("php://input");
	if($postdata){
		$request = json_decode($postdata);
		echo json_encode($request);
			$request = json_decode($postdata);
			
			$con = mysqli_connect($host,$username,$password,$dbname);
			if (mysqli_connect_errno()) {
			  echo json_encode("Failed to connect to MySQL: " . mysqli_connect_error());
			}else{
				$title = $request->title;
				$content = $request->content;
			}
	}
?>