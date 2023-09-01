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
        // Handle GET request to fetch font groups
        $query = "SELECT * FROM font_groups";
        $result = mysqli_query($conn, $query);

        if ($result) {
            $groups = array();
            while ($row = mysqli_fetch_assoc($result)) {
                $groups[] = $row;
            }

            $response = array(
                'status' => 'success',
                'data' => $groups  // Include font groups in the "data" field
            );
        } else {
            $response = array(
                'status' => 'error',
                'message' => 'Failed to fetch font groups.'
            );
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Handle POST request to create a new font group
        $groupName = isset($_POST['groupName']) ? $_POST['groupName'] : '';
        $fonts = isset($_POST['fonts']) ? $_POST['fonts'] : array();

        if (empty($groupName)) {
            $response = array(
                'status' => 'error',
                'message' => 'Group name is required.'
            );
        } else {
            // Use prepared statements to prevent SQL injection
            $insertQuery = "INSERT INTO font_groups (group_name, fonts) VALUES (?, ?)";
            $stmt = mysqli_prepare($conn, $insertQuery);

            if ($stmt === false) {
                $response = array(
                    'status' => 'error',
                    'message' => 'Failed to prepare the insert statement.'
                );
            } else {
                // Convert the fonts array to a JSON string
                $fontsJSON = json_encode($fonts);

                mysqli_stmt_bind_param($stmt, "ss", $groupName, $fontsJSON);

                if (mysqli_stmt_execute($stmt)) {
                    $response = array(
                        'status' => 'success',
                        'message' => 'Font group created successfully.'
                    );
                } else {
                    $response = array(
                        'status' => 'error',
                        'message' => 'Failed to create font group.'
                    );
                }

                mysqli_stmt_close($stmt);
            }
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
?>
