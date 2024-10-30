<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");

$servername = "localhost"; // Your database server
$username = "root"; // Your database username
$password = ""; // Your database password
$dbname = "image-gallery"; // Your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Query to get all images including id
$sql = "SELECT id, images FROM gallery";
$result = $conn->query($sql);

$images = [];

if ($result->num_rows > 0) {
    // Fetch all images
    while ($row = $result->fetch_assoc()) {
        $images[] = $row;
    }
    echo json_encode($images);
} else {
    echo json_encode(["message" => "No images found"]);
}

$conn->close();
