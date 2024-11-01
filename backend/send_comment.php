<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:4200");

header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit(0);
}


$servername = "localhost";
$username = "root";
$password = "";
$dbname = "image-gallery";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$data = json_decode(file_get_contents("php://input"), true);
$userId = $data['user_id'];
$imageId = $data['cardId'];
$comment = $data['comment'];

// Set the timezone to Philippine Time
date_default_timezone_set('Asia/Manila');
$date = date('Y-m-d H:i:s'); // Capture the current date and time

$sql = "INSERT INTO comments (user_id, image_id, comment, date) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("iiss", $userId, $imageId, $comment, $date); // Bind the date parameter

if ($stmt->execute()) {
    echo json_encode(["success" => "Comment added successfully."]);
} else {
    echo json_encode(["error" => "Error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
