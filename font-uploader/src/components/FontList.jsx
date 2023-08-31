import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";

const FontList = () => {
  const [fontNames, setFontNames] = useState([]);


  useEffect(() => {
    // Fetch the list of font names from the backend
    fetch("http://localhost/font-uploader-server/upload-fonts.php")
      .then(response => response.json())
      .then(data => {
        setFontNames(data); // Assuming data is an array of font names
      })
      .catch(error => {
        console.error("Error fetching font names:", error);
      });
  }, [fontNames]);

  const columns = [
    {
      name: "Font Name",
      selector: "name",
      sortable: true,
      format: row => row.name.replace(".ttf", "")
    },
    {
      name: "Font Preview",
      selector: "name",
      cell: row => <div style={{ fontFamily: row.name.replace(".ttf", "") }}>{row.name.replace(".ttf", "")}</div>
    },
    {
      name: "Action",
      cell: row => <button onClick={() => handleDelete(row.name)}>Delete</button>
    }
  ];

  const handleDelete = fontName => {
    // Implement delete logic here
    console.log(`Deleting font: ${fontName}`);
  };

  return (
    <div className="mt-16">
      <h2>Font List</h2>
      <DataTable
        columns={columns}
        data={fontNames.map(name => ({ name }))} // Format data as array of objects
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 30]}
      />
     
    </div>
  );
};

export default FontList;
