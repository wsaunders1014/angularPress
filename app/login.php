<?php
require('_db.php');
	
$postdata = file_get_contents("php://input");
	if($postdata){
		$request = json_decode($postdata);
		
		$con = mysqli_connect($host,$username,$password,$dbname);
		if (mysqli_connect_errno()) {
		  echo json_encode("Failed to connect to MySQL: " . mysqli_connect_error());
		}else{
			//need to validate request against DB here for production, for now let it automatically approve user.
			$email = $request->email;
			$password = $request->password;
			
			$query = mysqli_query($con, "SELECT * FROM users WHERE email='".$email."'"); //looks up user in database
			if($query){
				$result = mysqli_num_rows($query); //if user is found then this will return 1.
				
				if($result != 1) {
					echo "User not found";
				}else {
					//user found, now check password.
					$md5password = md5($password); //converts to md5
					$user = mysqli_fetch_assoc($query); //grabs password from DB
					if($md5password != $user['password']){ //compares submitted password to db passsword.
						echo "Invalid Password";
					}else {
						$request->password = '';
						$request->isLoggedIn = true;
						if($user['isAdmin'])
							$request->isAdmin= true;
							echo json_encode($request); //returns data to browser for debugging
							mysqli_free_result($query);

							mysqli_close($con);
					}
				}
			}else 
				echo print_r($query);
		}
	}else {
		echo "no data";
	}
	

?>