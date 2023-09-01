<?php
// Set CORS headers to allow requests from your frontend
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
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
        $fontFiles = $_FILES['fonts'];
        // Set Content-Type header to JSON
header('Content-Type: application/json');
        $response = array();

        foreach ($fontFiles['name'] as $key => $name) {
            $tempName = $fontFiles['tmp_name'][$key];
            $uploadDirectory = 'C:\Projects\PHP\htdocs\font-uploader-server\uploadedFonts';
            $targetPath = realpath($uploadDirectory) . DIRECTORY_SEPARATOR . $name;


            if (move_uploaded_file($tempName, $targetPath)) {
                $insertQuery = "INSERT INTO uploaded_fonts (font_name) VALUES ('$name')";

                if (mysqli_query($conn, $insertQuery)) {
                    $response[] = array(
                        'name' => $name,
                        'size' => $fontFiles['size'][$key],
                        'type' => $fontFiles['type'][$key],
                        'status' => 'success',
                        'message' => 'Font uploaded and saved to the database.'
                    );
                } else {
                    $response[] = array(
                        'name' => $name,
                        'status' => 'error',
                        'message' => 'Font uploaded but failed to save to the database: ' . mysqli_error($conn)
                    );
                }
            } else {
                $response[] = array(
                    'name' => $name,
                    'status' => 'error',
                    'message' => 'Failed to upload font.'
                );
            }
        }

        mysqli_close($conn);
    }

    // Set Content-Type header to JSON
    header('Content-Type: application/json');

    // Encode the response array and send it back to the frontend
    echo json_encode($response);
} else {
    $response = array(
        'status' => 'error',
        'message' => 'Invalid request method.'
    );

    header('Content-Type: application/json');
    echo json_encode($response);
}
