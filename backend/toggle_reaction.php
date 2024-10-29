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
if (!isset($data['id'])) {
    die(json_encode(['error' => 'Invalid input']));
}

$imageId = $data['id'];

// Check if the image already has a reaction
$sql = "SELECT reacts FROM gallery WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $imageId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $currentReacts = $row['reacts'];

    if ($currentReacts > 0) {
        // Image has a reaction, decrement the reacts count
        $sql = "UPDATE gallery SET reacts = reacts - 1 WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $imageId);
        $stmt->execute();
        echo json_encode(['message' => 'Reaction removed']);
    } else {
        // If reacts is 0, treat it as adding a reaction
        $sql = "UPDATE gallery SET reacts = reacts + 1 WHERE id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $imageId);
        $stmt->execute();
        echo json_encode(['message' => 'Reaction added']);
    }
} else {
    // If no record
    $sql = "UPDATE gallery SET reacts = reacts + 1 WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $imageId);
    $stmt->execute();
    echo json_encode(['message' => 'Reaction added']);
}

$stmt->close();
$conn->close();

// Add this line to catch any errors in the script
error_log(print_r($data, true)); // Log the input data for debugging