import  { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';

const FontGroupTable = () => {
  const [fontGroups, setFontGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFontGroups = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost/font-uploader-server/font-groups.php', {
        method: 'GET',
      });

      if (response.ok) {
        const responseData = await response.json();
        if (responseData.status === 'success') {
          setFontGroups(responseData.data);
        } else {
          console.error('Error fetching font groups:', responseData.message);
        }
      } else {
        console.error('Error fetching font groups:', response.status);
      }
    } catch (error) {
      console.error('Error fetching font groups:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch font groups when the component mounts
    fetchFontGroups();

    // Set up periodic refresh (every X milliseconds)
    const refreshInterval = setInterval(() => {
      fetchFontGroups();
    }, 60000); // Refresh every 60 seconds (adjust as needed)

    // Clean up the interval when the component unmounts
    return () => clearInterval(refreshInterval);
  }, []);

  const handleEditClick = (row) => {
    // Handle edit button click for the selected font group
    console.log('Edit clicked for group:', row.group_name);
  };

  const handleDeleteClick = (row) => {
    // Handle delete button click for the selected font group
    console.log('Delete clicked for group:', row.group_name);

    // Send a DELETE request to delete the font group by group name
    fetch(`http://localhost/font-uploader-server/font-groups.php?groupName=${row.group_name}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'success') {
          // Font group deleted successfully, you can update your UI as needed
          console.log('Font group deleted successfully:', data.message);

          // After deleting, refresh the font groups data immediately
          fetchFontGroups();
        } else {
          // Handle delete error
          console.error('Error deleting font group:', data.message);
        }
      })
      .catch((error) => {
        // Handle network or other errors
        console.error('Error deleting font group:', error);
      });
  };

  const columns = [
    {
      name: 'Group Name',
      selector: 'group_name',
      sortable: true,
    },
    {
      name: 'Selected Fonts',
      selector: 'fonts',
      sortable: false,
      cell: (row) => {
        // Map the array of font names to a plain text string
        const selectedFontsText = row.fonts.map((fontName) => fontName.replace('.ttf', '')).join(', ');
        return selectedFontsText;
      },
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className='flex justify-between w-24'>
          <button onClick={() => handleEditClick(row)}>Edit</button>
          <button onClick={() => handleDeleteClick(row)}>Delete</button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div>
      <DataTable
        title="Font Groups"
        columns={columns}
        data={fontGroups}
        pagination
        highlightOnHover
      />
    </div>
  );
};

export default FontGroupTable;
