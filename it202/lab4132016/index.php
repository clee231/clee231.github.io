<!DOCTYPE HTML>
<html>
<head>
<title>IT202 Lab - April 13, 2016</title>
</head>
<body>
<?php
    
    //Connect to the database
    $host = "127.0.0.1";
    $user = "datafest2016";                     //Your Cloud 9 username
    $pass = "datafest";                                  //Remember, there is NO password by default!
    $db = "datafest2016";                                  //Your database name you want to connect to
    $port = 3306;                                //The port #. It is always 3306
    
    $connection = mysqli_connect($host, $user, $pass, $db, $port)or die(mysql_error());



    //And now to perform a simple query to make sure it's working
    $query = "SELECT * FROM Country";
    $result = mysqli_query($connection, $query);

    while ($row = mysqli_fetch_assoc($result)) {
        echo "The ID is: " . $row['Code'] . " and the Country is: " . $row['Name'] . "<br />";
    }

?>

</body>
</html>
