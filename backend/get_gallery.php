<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");


$servername = "localhost"; // Your database server
$username = "root"; // Your database username
$password = ""; // Your database password
$dbname = "image-gallery"; // Your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$userId = $_GET['id']; // Retrieve userId from the GET request
$email = $_GET['email']; // Retrieve email from the GET request

// Query to fetch images and their IDs based on userId
$sql = "SELECT id, images FROM gallery WHERE user_id = ?"; // Updated query to include 'id'
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $userId); // Bind 'userId' as integer
$stmt->execute();
$result = $stmt->get_result();

$images = [];
while ($row = $result->fetch_assoc()) {
    $images[] = [
        'id' => $row['id'], // Include 'id' in the response
        'image' => $row['images'] // Use 'images' column
    ];
}

echo json_encode($images); // Return images as JSON
$stmt->close();
$conn->close();