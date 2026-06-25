<?php
$servername = "localhost";
$username = "root"; 
$password = "";     
$dbname = "mjjq_database"; 

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
// Use utf8mb4 charset to avoid charset issues
$conn->set_charset('utf8mb4');
?>