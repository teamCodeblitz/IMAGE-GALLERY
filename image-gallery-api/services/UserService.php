<?php
require_once __DIR__ . '/../config/database.php';

class UserService
{
    private $db;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function checkLoginStatus()
    {
        return json_encode(["loggedIn" => isset($_SESSION['user_id'])]);
    }

    // FUNCTION TO LOGIN
    public function loginUser($data)
    {
        $email = $data['email'];
        $password = $data['password'];
    
        // Adjust the query to include firstName and lastName
        $query = "SELECT id, email, firstName, lastName, password, avatar FROM users WHERE email = :email";
        $stmt = $this->db->prepare($query);
        $stmt->bindParam(":email", $email);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
        if ($user && password_verify($password, $user['password'])) {
            $token = bin2hex(random_bytes(16));
            $_SESSION['token'] = $token;
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['first_name'] = $user['firstName'];
            $_SESSION['last_name'] = $user['lastName'];
            $_SESSION['avatar'] = $user['avatar'];


            
            // Return the response with additional fields
            return json_encode([
                "token" => $token,
                "user_id" => $user['id'],
                "first_name" => $user['firstName'],
                "last_name" => $user['lastName'],
                "avatar" => $user['avatar'],
            ]);
        } else {
            http_response_code(401);
            return json_encode(["error" => "Invalid email or password"]);
        }
    }
    

    // FUNCTION TO LOGOUT

    public function logoutUser()
    {
        unset($_SESSION['token']);
        session_destroy();

        return json_encode(["message" => "Logged out successfully."]);
    }


    // FUNCTION TO REGISTER DATA

    public function registerUser($data)
    {
        $email = $data['email'];
    $password = $data['password'];
    $firstName = $data['firstName'];
    $lastName = $data['lastName']; 
    $middleName = $data['middleName'];
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    $role = 'student'; 
    $avatar = 'default-avatar.jpg';
    $background = '1.jpg';

    // Insert into users table
    $query = "INSERT INTO users (email, password, firstName, lastName, middleName, avatar) VALUES (:email, :password, :firstName, :lastName, :middleName, :avatar)";
    $stmt = $this->db->prepare($query);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":password", $hashedPassword);
    $stmt->bindParam(":firstName", $firstName);
    $stmt->bindParam(":lastName", $lastName);
    $stmt->bindParam(":middleName", $middleName);
    $stmt->bindParam(":avatar", $avatar);
    
   
        if ($stmt->execute()) {
            return json_encode(["message" => "User was registered successfully."]);
        } else {
            http_response_code(400);
            return json_encode(["error" => "Unable to register the user."]);
        }
    }


    // FUNCTION ON SESSION
    
    public function setSession($data)
    {
        if (isset($data['userId'])) {
            $_SESSION['user_id'] = $data['userId'];
            return json_encode(["message" => "Session set successfully."]);
        } else {
            http_response_code(400);
            return json_encode(["error" => "Invalid data provided."]);
        }
    }


    // FUNCTION ON VALIDATION

    public function validateToken($token)
    {
        if (isset($_SESSION['token']) && $_SESSION['token'] === $token) {
            return json_encode(["valid" => true, "user_id" => $_SESSION['user_id']]);
        } else {
            http_response_code(401);
            return json_encode(["valid" => false, "message" => "Invalid token."]);
        }
    }
}
