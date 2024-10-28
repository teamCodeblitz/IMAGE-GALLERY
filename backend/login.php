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
if (!isset($data['email'], $data['password'])) {
    echo json_encode(["error" => "Missing required fields."]);
    exit;
}

$email = $conn->real_escape_string($data['email']);
$password = $data['password']; // Get the plain password

// Prepare and execute the statement to find the user
$stmt = $conn->prepare("SELECT password FROM users WHERE email = ?");
if (!$stmt) {
    echo json_encode(["error" => "SQL prepare error: " . $conn->error]);
    exit;
}
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();

// Check if user exists
if ($stmt->num_rows > 0) {
    $stmt->bind_result($hashedPassword);
    $stmt->fetch();

    // Verify the password
    if (password_verify($password, $hashedPassword)) {
        // Fetch user ID
        $stmt->close(); // Close the first statement before preparing a new one
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->bind_result($userId);
        $stmt->fetch();
        
        echo json_encode(["success" => true, "userId" => $userId]); // Return user ID
        // No need to close $stmt here again, it will be closed at the end of the script
    } else {
        echo json_encode(["error" => "Invalid password."]);
    }
} else {
    echo json_encode(["error" => "User not found."]);
}

// Close connections
$stmt->close(); // This will close the last prepared statement
$conn->close();
