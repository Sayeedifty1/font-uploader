<?php
// Set CORS headers to allow requests from your frontend
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type");

// Establish database connection
$hostname = "localhost";
$username = "fontUploader";
$password = "";
$database = "font-uploader";

$conn = mysqli_connect($hostname, $username, $password, $database);

if (!$conn) {
    $response = array(
        'status' => 'error',
        'message' => 'Database connection failed.'
    );
} else {
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Handle GET request to fetch font names
        $query = "SELECT * FROM uploaded_fonts";
        $result = mysqli_query($conn, $query);

        $fonts = array();
        while ($row = mysqli_fetch_assoc($result)) {
            $fonts[] = $row['font_name'];
        }

        $response = $fonts;
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Handle POST request to add a new font
        $fontToAdd = $_POST['fontName']; // Adjust the form field name as needed

        // Use prepared statements to prevent SQL injection
        $insertQuery = "INSERT INTO uploaded_fonts (font_name) VALUES (?)";
        $stmt = mysqli_prepare($conn, $insertQuery);

        if ($stmt === false) {
            $response = array(
                'status' => 'error',
                'message' => 'Failed to prepare the insert statement.'
            );
        } else {
            mysqli_stmt_bind_param($stmt, "s", $fontToAdd);

            if (mysqli_stmt_execute($stmt)) {
                $response = array(
                    'status' => 'success',
                    'message' => 'Font added successfully.'
                );
            } else {
                $response = array(
                    'status' => 'error',
                    'message' => 'Failed to add font.'
                );
            }

            mysqli_stmt_close($stmt);
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        // Handle DELETE request to delete a font
        $fontToDelete = $_GET['fontName'];

        // Use prepared statements to prevent SQL injection
        $deleteQuery = "DELETE FROM uploaded_fonts WHERE font_name = ?";
        $stmt = mysqli_prepare($conn, $deleteQuery);

        if ($stmt === false) {
            $response = array(
                'status' => 'error',
                'message' => 'Failed to prepare the delete statement.'
            );
        } else {
            mysqli_stmt_bind_param($stmt, "s", $fontToDelete);

            if (mysqli_stmt_execute($stmt)) {
                $response = array(
                    'status' => 'success',
                    'message' => 'Font deleted successfully.'
                );
            } else {
                $response = array(
                    'status' => 'error',
                    'message' => 'Failed to delete font.'
                );
            }

            mysqli_stmt_close($stmt);
        }
    } else {
        $response = array(
            'status' => 'error',
            'message' => 'Unsupported HTTP method.'
        );
    }

    mysqli_close($conn);
}

// Set Content-Type header to JSON
header('Content-Type: application/json');

// Send the response as JSON
echo json_encode($response);
