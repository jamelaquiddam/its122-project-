<?php
session_start(); // Para matandaan ng browser na naka-login ang user
require 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email']; 
    $password = $_POST['password'];
    $role = $_POST['role']; // Kunin kung User o Admin tab ang pinili
    // Basic checks
    if (empty($email) || empty($password) || empty($role)) {
        echo "error: Missing credentials.";
        exit;
    }

    // Use prepared statement to fetch user
    $stmt = $conn->prepare("SELECT id, full_name, role, password FROM users WHERE (email = ? OR username = ?) AND role = ?");
    if (!$stmt) {
        echo "error: Failed to prepare statement.";
        exit;
    }
    $stmt->bind_param('sss', $email, $email, $role);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();

        // Verify password (keep fallback for unhashed admin passwords)
        if (password_verify($password, $row['password']) || ($role == 'admin' && $password === $row['password'])) {
            session_regenerate_id(true);
            $_SESSION['user_id'] = $row['id'];
            $_SESSION['role'] = $row['role'];
            $_SESSION['full_name'] = $row['full_name'];

            echo "success";
        } else {
            echo "error: Incorrect password.";
        }
    } else {
        echo "error: Account not found or incorrect role selected.";
    }
    $stmt->close();
}
$conn->close();
?>