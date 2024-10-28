<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


$servername = "localhost"; // Your database server
$username = "root"; // Your database username
$password = ""; // Your database password
$dbname = "image-gallery"; // Your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(["error" => "Connection failed: " . $conn->connect_error]));
}

// Get the JSON data from the request
$data = json_decode(file_get_contents("php://input"), true);

// Log the incoming data for debugging
error_log(print_r($data, true)); // Log the data to the server logs

$userId = $data['user_id']; // Retrieve user ID
$email = $data['email']; // Retrieve email
$imageData = $data['image']; // Retrieve image data
$description = $data['description']; // Retrieve description
$date = $data['date']; // Retrieve date

// Define the uploads directory
$uploadsDir = 'uploads/';

// Ensure the uploads directory exists
if (!is_dir($uploadsDir)) {
    mkdir($uploadsDir, 0755, true);
}

$imageName = uniqid() . '.png'; // Generate a unique name for the image
$imagePath = $uploadsDir . $imageName; // Define the path to save the image

// Decode the base64 image data and save it to the uploads directory
if (preg_match('/^data:image\/(\w+);base64,/', $imageData, $type)) {
    $imageData = substr($imageData, strpos($imageData, ',') + 1);
    $imageData = base64_decode($imageData);
    if ($imageData === false) {
        die(json_encode(["error" => "Base64 decode failed."]));
    }
    file_put_contents($imagePath, $imageData); // Save the image to the uploads directory
}

// Prepare and bind
$sql = "INSERT INTO gallery (user_id, email, images, description, date) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("issss", $userId, $email, $imageName, $description, $date); // Use the image name instead of the image data

if ($stmt->execute()) {
    echo json_encode(["success" => "Upload successful"]);
} else {
    echo json_encode(["error" => "Error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
