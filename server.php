<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

$commentsFile = 'comments.json';

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the raw POST data
    $input = file_get_contents('php://input');

    // Decode the JSON data
    $newComment = json_decode($input, true);

    // Validate and sanitize the data
    $name = isset($newComment['name']) ? htmlspecialchars($newComment['name']) : '';
    $text = isset($newComment['text']) ? htmlspecialchars($newComment['text']) : '';

    // Check if both name and text are present
    if ($name !== '' && $text !== '') {
        // Read existing comments from the JSON file
        $comments = file_exists($commentsFile) ? json_decode(file_get_contents($commentsFile), true) : [];

        // Check if $comments is null (json_decode failure)
        if ($comments === null) {
            $comments = [];
        }

        // Add the new comment to the array
        $newComment['id'] = count($comments) + 1;
        $comments[] = $newComment;

        // Save the updated comments back to the JSON file
        if (file_put_contents($commentsFile, json_encode($comments, JSON_PRETTY_PRINT)) !== false) {
            // Successfully added comment
            http_response_code(201);
            echo json_encode($newComment);
        } else {
            // Failed to save comments
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save comments']);
        }
    } else {
        // Invalid data, respond with an error
        http_response_code(400);
        echo json_encode(['error' => 'Invalid data']);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // If the request method is GET, fetch and display existing comments

    // Fetch existing comments from the JSON file
    $comments = file_exists($commentsFile) ? json_decode(file_get_contents($commentsFile), true) : [];

    if ($comments !== false) {
        echo json_encode($comments);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch comments']);
    }
} else {
    // Respond with a 404 error for non-POST and non-GET requests
    http_response_code(404);
    echo json_encode(['error' => 'Not Found']);
}
?>
