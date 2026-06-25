<?php
require 'db_connect.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Kunin ang mga nilagay ng user sa form
    $fullName = trim($_POST['regFullName'] ?? '');
    $username = trim($_POST['regUsername'] ?? '');
    $email = trim($_POST['regEmail'] ?? '');
    $password = $_POST['regPassword'] ?? '';

    // Basic validation
    if ($fullName === '' || $username === '' || $email === '' || $password === '') {
        echo "error: All fields are required.";
        exit;
    }
    if (strlen($username) < 4) {
        echo "error: Username must be at least 4 characters.";
        exit;
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "error: Invalid email address.";
        exit;
    }
    if (strlen($password) < 8) {
        echo "error: Password must be at least 8 characters.";
        exit;
    }

    // Hash the password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Check for existing email or username using prepared statements
    $check_stmt = $conn->prepare("SELECT id FROM users WHERE email = ? OR username = ?");
    if (!$check_stmt) {
        echo "error: Failed to prepare statement.";
        exit;
    }
    $check_stmt->bind_param('ss', $email, $username);
    $check_stmt->execute();
    $check_stmt->store_result();

    if ($check_stmt->num_rows > 0) {
        echo "error: Username or Email already exists.";
        $check_stmt->close();
        exit;
    }
    $check_stmt->close();

    // Insert new user with prepared statement
    $insert_stmt = $conn->prepare("INSERT INTO users (full_name, username, email, password, role) VALUES (?, ?, ?, ?, 'user')");
    if (!$insert_stmt) {
        echo "error: Failed to prepare insert statement.";
        exit;
    }
    $insert_stmt->bind_param('ssss', $fullName, $username, $email, $hashed_password);
    if ($insert_stmt->execute()) {
        echo "success";
    } else {
        echo "error: " . $insert_stmt->error;
    }
    $insert_stmt->close();
}
$conn->close();
?>