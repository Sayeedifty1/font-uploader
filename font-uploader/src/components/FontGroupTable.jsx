import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';

const FontGroupTable = ({ fontNames }) => {
  const [fontGroups, setFontGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedFonts, setSelectedFonts] = useState([]);
  const [remainingFonts, setRemainingFonts] = useState([...fontNames]); // Initialize with all fonts

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
    fetchFontGroups();

    const refreshInterval = setInterval(() => {
      fetchFontGroups();
    }, 60000);

    return () => clearInterval(refreshInterval);
  }, []);

  const handleEditClick = (row) => {
    setGroupName(row.group_name);
    setSelectedFonts(row.fonts);
    // Calculate remaining fonts by filtering out selected fonts
    setRemainingFonts(fontNames.filter((font) => !row.fonts.includes(font)));
    setIsModalOpen(true);
  };

  const onGroupNameChange = (e) => {
    setGroupName(e.target.value);
  };

  const handleFontSelection = (fontName) => {
    setSelectedFonts((prevSelectedFonts) => [
      ...prevSelectedFonts,
      fontName,
    ]);
    setRemainingFonts(remainingFonts.filter((font) => font !== fontName));
  };

  const handleFontDeselection = (fontName) => {
    setSelectedFonts((prevSelectedFonts) =>
      prevSelectedFonts.filter((font) => font !== fontName)
    );
    setRemainingFonts([...remainingFonts, fontName]);
  };

  const onSaveGroup = async () => {
    // Ensure that groupName is not empty
    if (!groupName) {
      // Handle the case where the groupName is missing or empty
      console.error("Group name is required.");
      return; // Do not proceed with the request
    }

    const updateData = {
      groupName: groupName,
      fonts: selectedFonts,
    };

    try {
      const response = await fetch(
        `http://localhost/font-uploader-server/font-groups.php?groupName=${groupName}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (response.ok) {
        // Handle successful update
        const responseData = await response.json();
        console.log(responseData); // Log the server response if needed
        setIsModalOpen(false);
        fetchFontGroups(); // Refresh the font groups after updating
      } else {
        // Handle update error
        console.error("Error updating font group:", response.status);
      }
    } catch (error) {
      console.error("Error updating font group:", error);
    }
  };


  const onCancel = () => {
    setIsModalOpen(false);
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
      cell: (row) => row.fonts.map((fontName) => fontName.replace('.ttf', '')).join(', '),
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

  const [isAddingNewFont, setIsAddingNewFont] = useState(false);

  const handleAddNewFontClick = () => {
    setIsAddingNewFont(true);
  };

 

  return (
    <div>
      <DataTable
        title="Font Groups"
        columns={columns}
        data={fontGroups}
        pagination
        highlightOnHover
      />

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Edit Font Group</h2>
            <label className="block mb-2">
              Group Name:
              <input
                type="text"
                value={groupName}
                onChange={onGroupNameChange}
                className="block w-full border-gray-300 rounded-md p-2"
                placeholder="Enter group name"
                disabled
              />
            </label>
            <button onClick={handleAddNewFontClick}>+ Add new font</button>
            {isAddingNewFont && (
              <div>
                
                <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Selected Fonts</h3>
              {selectedFonts.map((font) => (
                <div key={font} className="flex items-center justify-between py-1">
                  <span>{font.replace('.ttf', '')}</span>
                  <button
                    onClick={() => handleFontDeselection(font)}
                    className="text-red-500 hover:text-red-600"
                  >
                    Deselect
                  </button>
                </div>
              ))}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Remaining Fonts</h3>
              {remainingFonts.map((font) => (
                <div key={font} className="flex items-center justify-between py-1">
                  <span>{font.replace('.ttf', '')}</span>
                  <button
                    onClick={() => handleFontSelection(font)}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    Select
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={onSaveGroup}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2"
              >
                Save Group
              </button>
              <button
                onClick={onCancel}
                className="bg-gray-300 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
                </div>
            
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FontGroupTable;
