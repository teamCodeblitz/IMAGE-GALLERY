<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$uploadsDir = 'profile/'; // Directory to save uploaded files

$imageData = $_POST['imageData'] ?? null; // Get the base64 image data from POST request
$userId = $_POST['userId'] ?? null; // Get user ID from POST data

// Log incoming data for debugging
error_log("Image Data: " . print_r($imageData, true));
error_log("User ID: " . print_r($userId, true));

if (!$imageData || !$userId) {
    echo json_encode(['error' => 'Missing image data or user ID.']);
    exit;
}

$imageName = uniqid() . '.png'; // Generate a unique name for the image
$imagePath = $uploadsDir . $imageName; // Full path to save the image

// Database connection
$servername = "localhost"; // Your server name
$username = "root"; // Your database username
$password = ""; // Your database password
$dbname = "image-gallery"; // Your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Decode the base64 image data and save it to the uploads directory
if (preg_match('/^data:image\/(\w+);base64,/', $imageData, $type)) {
    $imageData = substr($imageData, strpos($imageData, ',') + 1);
    $imageData = base64_decode($imageData);
    
    if ($imageData === false) {
        echo json_encode(["error" => "Base64 decode failed."]);
        exit;
    }

    // Ensure the image data is saved correctly
    if (file_put_contents($imagePath, $imageData) === false) {
        echo json_encode(["error" => "Failed to save image data."]);
        exit;
    }

    // Update the user's avatar in the database
    $stmt = $conn->prepare("UPDATE users SET avatar = ? WHERE id = ?");
    $stmt->bind_param("si", $imageName, $userId); // Bind parameters correctly
    if ($stmt->execute()) { // Check if the execution was successful
        // Log the response before sending it
        $response = ['avatar' => $imageName]; // Prepare response
        error_log("Response: " . print_r($response, true));
        echo json_encode($response); // Return just the filename
    } else {
        echo json_encode(['error' => 'Failed to update avatar in database.']);
    }
} else {
    echo json_encode(['error' => 'Invalid image format.']);
}
