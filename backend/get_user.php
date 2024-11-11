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

// Check connection
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

// Get the user ID from query parameters
$userId = isset($_GET['id']) ? (int)$_GET['id'] : 0; // Ensure it's an integer

// Prepare and execute the statement to find the user by ID
$stmt = $conn->prepare("SELECT firstName, lastName, middleName, avatar, email, password FROM users WHERE id = ?"); // Include lastName, middleName, and password
if (!$stmt) {
    echo json_encode(["error" => "SQL prepare error: " . $conn->error]);
    exit;
}
$stmt->bind_param("i", $userId);
$stmt->execute();
$stmt->store_result();

// Check if user exists
if ($stmt->num_rows > 0) {
    $stmt->bind_result($firstName, $lastName, $middleName, $avatar, $email, $password); // Bind additional fields
    $stmt->fetch();
    echo json_encode(["firstName" => $firstName, "lastName" => $lastName, "middleName" => $middleName, "avatar" => $avatar, "email" => $email, "password" => $password]); // Include all fields in response
} else {
    echo json_encode(["error" => "User not found."]);
}

// Close connections
$stmt->close();
$conn->close();
