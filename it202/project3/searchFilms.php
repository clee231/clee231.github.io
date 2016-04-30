<?php

require __DIR__ . "/vendor/autoload.php";

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$dotenv = new Dotenv\Dotenv(__DIR__);
$dotenv->load(); 
$dotenv->required(['SERVERNAME', 'DBUSER', 'DBPASS', 'DBDATABASE']);

// Create connection
$conn = mysqli_connect($_ENV['SERVERNAME'], $_ENV['DBUSER'], $_ENV['DBPASS'], $_ENV['DBDATABASE'], 3306) or die(mysql_error());

$query = "SELECT DISTINCT f.film_id, title, release_year, rating, length, description, name
        FROM actor a
            INNER JOIN film_actor fa on fa.actor_id = a.actor_id
            INNER JOIN film f on f.film_id = fa.film_id
            INNER JOIN film_category fc on fc.film_id = f.film_id
            INNER JOIN category c on c.category_id = fc.category_id";

$parameters = $_GET;
if (count($parameters)) {
	$query .= " WHERE ";
}
foreach($parameters as $key => $field) {
	switch($key) {
		case 'last_name':
		case 'first_name':
		case 'title':
			$query .= " " . $key . " = '" . $field . "' AND ";
			break;
		case 'id':
			$query .= " f.film_id = " . $field . " AND ";
			break;
		case 'genre':
			$query .= " c.name = '" . $field . "' AND ";
			break;
		default:
			$query .= " " . $key . " = '" . $field . "' AND ";
			break;
			
	}
}
$query = substr($query, 0, count($query)-5);
var_dump($query);
$result = mysqli_query($conn, $query);

 $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        /*
            because some of our data may contain non UTF-8 characters,
                we'll need to loop through the key=value pairs and encode
                the values before loading the associative array - $r - into our
                indexed array - $rows
        */
        while (list($key, $val) = each($r)) {
            $r[$key] = utf8_encode($val);
        }
        
        $rows[] = $r;
    }
    
    //  now our encoding works
    echo json_encode($rows);
