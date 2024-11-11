<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
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

// Get the JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Validate input
$userId = isset($data['id']) ? (int)$data['id'] : 0; // Ensure it's an integer
$firstName = isset($data['firstname']) ? $data['firstname'] : '';
$lastName = isset($data['lastname']) ? $data['lastname'] : '';
$middleName = isset($data['middlename']) ? $data['middlename'] : '';
$email = isset($data['email']) ? $data['email'] : '';

// Prepare and execute the statement to update the user
$stmt = $conn->prepare("UPDATE users SET firstName = ?, lastName = ?, middleName = ?, email = ? WHERE id = ?");
if (!$stmt) {
    echo json_encode(["error" => "SQL prepare error: " . $conn->error]);
    exit;
}
$stmt->bind_param("ssssi", $firstName, $lastName, $middleName, $email, $userId);
$result = $stmt->execute();

// Check if the update was successful
if ($result) {
    echo json_encode(["success" => "Profile updated successfully."]);
} else {
    echo json_encode(["error" => "Update failed: " . $stmt->error]);
}

// Close connections
$stmt->close();
$conn->close();
?>
