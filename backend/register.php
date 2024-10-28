<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

error_reporting(E_ALL);
ini_set('display_errors', 1);

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

// Get the posted data
$data = json_decode(file_get_contents("php://input"), true);

// Log the incoming data for debugging
error_log("Incoming data: " . print_r($data, true));

// Check if required fields are present
if (!isset($data['email'], $data['password'], $data['firstName'], $data['lastName'])) {
    echo json_encode(["error" => "Missing required fields."]);
    exit;
}

$email = $conn->real_escape_string($data['email']);
$password = password_hash($conn->real_escape_string($data['password']), PASSWORD_DEFAULT); // Hash the password
$firstName = $conn->real_escape_string($data['firstName']);
$lastName = $conn->real_escape_string($data['lastName']);
$middleName = isset($data['middleName']) ? $conn->real_escape_string($data['middleName']) : ''; // Handle optional field

// Prepare and bind
$stmt = $conn->prepare("INSERT INTO users (email, firstName, lastName, password, middleName, avatar) VALUES (?, ?, ?, ?, ?, ?)"); // Added avatar field
if (!$stmt) {
    echo json_encode(["error" => "SQL prepare error: " . $conn->error]);
    exit;
}
$avatar = 'default.jpg'; // Set default avatar
$stmt->bind_param("ssssss", $email, $firstName, $lastName, $password, $middleName, $avatar); // Added avatar to bind parameters

// Execute the statement for user registration
if ($stmt->execute()) {
    // Get the last inserted ID
    $lastId = $stmt->insert_id;


    echo json_encode(["success" => "User registered successfully"]); // Updated success message
} else {
    echo json_encode(["error" => "Execution error: " . $stmt->error]);
    error_log("Database execution error: " . $stmt->error);
}

// Close connections
$stmt->close();
$conn->close();
