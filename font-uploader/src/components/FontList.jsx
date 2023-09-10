import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import FontGroup from "./FontGroup";
import FontGroupTable from "./FontGroupTable";

const FontList = () => {
  const [fontNames, setFontNames] = useState([]);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedFonts, setSelectedFonts] = useState([]);


  useEffect(() => {
    // Fetch the list of font names from the backend
    fetch("http://localhost/font-uploader-server/upload-fonts.php")
      .then((response) => response.json())
      .then((data) => {
        setFontNames(data);
      })
      .catch((error) => {
        console.error("Error fetching font names:", error);
      });
  }, []);

  const columns = [
    {
      name: "Font Name",
      selector: "name",
      sortable: true,
      format: (row) => row.name.replace(".ttf", ""),
    },
    {
      name: "Font Preview",
      selector: "name",
      cell: (row) => (
        <div style={{ fontFamily: row.name.replace(".ttf", "") }}>
          {row.name.replace(".ttf", "")}
        </div>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <button onClick={() => handleDelete(row.name)}>Delete</button>
      ),
    },
  ];

  const handleDelete = (fontName) => {
    // Send a DELETE request to the backend to delete the font
    fetch(
      `http://localhost/font-uploader-server/upload-fonts.php?fontName=${encodeURIComponent(
        fontName
      )}`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        if (response.ok) {
          // Font deleted successfully, remove it from the fontNames state
          setFontNames((prevFontNames) =>
            prevFontNames.filter((name) => name !== fontName)
          );
        } else {
          console.error("Failed to delete font:", response.status);
        }
      })
      .catch((error) => {
        console.error("Error deleting font:", error);
      });
  };

  const toggleCreateGroupModal = () => {
    setShowCreateGroupModal(!showCreateGroupModal);
    setGroupName(""); // Clear the group name input when the modal is toggled
    setSelectedFonts([]); // Clear selected fonts when the modal is toggled
  };

  const handleFontSelection = (fontName) => {
    setSelectedFonts((prevSelectedFonts) => [
      ...prevSelectedFonts,
      fontName,
    ]);
  };

  const handleFontDeselection = (fontName) => {
    setSelectedFonts((prevSelectedFonts) =>
      prevSelectedFonts.filter((font) => font !== fontName)
    );
  };

  const handleSaveGroup = async () => {
    // Ensure that groupName is not empty
    if (!groupName) {
        // Handle the case where the groupName is missing or empty
        console.error("Group name is required.");
        return; // Do not proceed with the request
    }

    const formData = new FormData();

    // Append the group name
    formData.append('groupName', groupName, );

    // Append selected fonts as an array

    selectedFonts.forEach((fontName) => {
      formData.append('fonts[]', fontName);
    });

    try {
        const response = await fetch("http://localhost/font-uploader-server/font-groups.php", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            // Handle successful upload
            const responseData = await response.json();
            console.log(responseData); // Log the server response if needed
        } else {
            // Handle upload error
            console.error("Error adding font group:", response.status);
        }
    } catch (error) {
        console.error("Error adding font group:", error);
    }
    
};




  console.log(groupName)

  return (
    <div className="mt-16">
      <h2>Font List</h2>
      <DataTable
        columns={columns}
        data={fontNames.map((name) => ({ name }))}
        pagination
        paginationPerPage={5}
        paginationRowsPerPageOptions={[10, 20, 30]}
      />
      <div className="text-right mt-10">
        <button onClick={toggleCreateGroupModal}>Create Group</button>
      </div>

      {/* Render the Create Group modal */}
      {showCreateGroupModal && (
        <FontGroup
          fontList={fontNames}
          selectedFonts={selectedFonts}
          groupName={groupName}
          onGroupNameChange={(e) => setGroupName(e.target.value)}
          onFontSelection={handleFontSelection}
          onFontDeselection={handleFontDeselection}
          onSaveGroup={handleSaveGroup}
          onCancel={toggleCreateGroupModal}
        />
      )}
      <FontGroupTable fontNames={fontNames}/>
    </div>
  );
};

export default FontList;
