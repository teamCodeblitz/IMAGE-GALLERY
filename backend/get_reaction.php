<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "image-gallery";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['error' => "Connection failed: " . $conn->connect_error]));
}

$imageId = $_GET['id'];
$userId = $_GET['userId'];

$sql = "SELECT COUNT(react) as total_reacts, 
                (SELECT COUNT(*) FROM reactions WHERE user_id = ? AND image_id = ?) as user_reacted 
         FROM reactions WHERE image_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iii", $userId, $imageId, $imageId);
if (!$stmt->execute()) {
    echo json_encode(['error' => "Query execution failed: " . $stmt->error]);
    exit;
}
$result = $stmt->get_result();

$response = []; // Initialize response array

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $response = [
        'total_reacts' => $row['total_reacts'],
        'user_reacted' => $row['user_reacted'] > 0 // true if user has reacted
    ];
} else {
    $response = ['total_reacts' => 0, 'user_reacted' => false]; // No reactions found
}

// Log the response for debugging
error_log("Response: " . json_encode($response)); // Log the response

echo json_encode($response); // Send the response back
$stmt->close();
$conn->close(); 