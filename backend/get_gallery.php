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
$sql = "SELECT id, images, description, date FROM gallery WHERE user_id = ? AND email = ?"; // Updated query to include 'id', 'email', and 'date'
$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $userId, $email); // Bind 'userId' as integer and 'email' as string
$stmt->execute();
$result = $stmt->get_result();

$images = [];
while ($row = $result->fetch_assoc()) {
    $images[] = [
        'id' => $row['id'], // Include 'id' in the response
        'image' => $row['images'], // Use 'images' column
        'description' => $row['description'], // Use 'description' column
        'date' => $row['date'] // Include 'date' in the response
    ];
}

// Get post count
$postCount = count($images); // Count the number of images

echo json_encode(['images' => $images, 'postCount' => $postCount]); // Return images and post count as JSON
$stmt->close();
$conn->close();