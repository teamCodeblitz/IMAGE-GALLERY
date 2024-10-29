<?php
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

$sql = "SELECT reacts FROM gallery WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $imageId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo json_encode(['reacts' => $row['reacts']]);
} else {
    echo json_encode(['reacts' => 0]); // No reactions found
}

$stmt->close();
$conn->close(); 