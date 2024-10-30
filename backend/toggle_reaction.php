<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "image-gallery";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['error' => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['id']) || !isset($data['userId'])) {
    die(json_encode(['error' => 'Invalid input']));
}

$imageId = $data['id'];
$userId = $data['userId'];

// Check if the user has already reacted to this image
$sql = "SELECT * FROM reactions WHERE user_id = ? AND image_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $userId, $imageId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // User has already reacted, remove the reaction
    $sql = "DELETE FROM reactions WHERE user_id = ? AND image_id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $userId, $imageId);
    $stmt->execute();
    echo json_encode(['message' => 'Reaction removed']);
} else {
    // User has not reacted, add the reaction
    $sql = "INSERT INTO reactions (user_id, image_id, react) VALUES (?, ?, 1)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ii", $userId, $imageId);
    $stmt->execute();
    echo json_encode(['message' => 'Reaction added']);
}

$stmt->close();
$conn->close();

// Add this line to catch any errors in the script
error_log(print_r($data, true)); // Log the input data for debugging