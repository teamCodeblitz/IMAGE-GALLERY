<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:4200");

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "image-gallery";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

$imageId = $_GET['image_id']; // Assuming you pass image_id as a query parameter
$sql = "SELECT user_id, comment, date FROM comments WHERE image_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $imageId);
$stmt->execute();
$result = $stmt->get_result();

$comments = [];
while ($row = $result->fetch_assoc()) {
    $comments[] = $row;
}

// Return comments directly, even if empty
echo json_encode($comments);

$stmt->close();
$conn->close();
