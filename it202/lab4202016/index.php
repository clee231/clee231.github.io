<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

    //Connect to the database
    $host = "127.0.0.1";
    $user = "datafest2016";                     //Your Cloud 9 username
    $pass = "datafest";                                  //Remember, there is NO password by default!
    $db = "datafest2016";                                  //Your database name you want to connect to
    $port = 3306;                                //The port #. It is always 3306
    
    $connection = mysqli_connect($host, $user, $pass, $db, $port)or die(mysql_error());



    //And now to perform a simple query to make sure it's working
    $query = "SELECT * FROM users";
    $result = mysqli_query($connection, $query);

	$arr[];
    while ($row = mysqli_fetch_assoc($result)) {
		echo "The ID is: " . $row['id'] . " and the Username is: " . $row['username'];
		$arr[] = $row;
    }

?>
