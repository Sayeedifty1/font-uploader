
const FontGroup = ({
  fontList,
  selectedFonts,
  groupName,
  onGroupNameChange,
  onFontSelection,
  onFontDeselection,
  onSaveGroup,
  onCancel,
}) => {
 

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-[#053B50] text-white p-4 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">Create Font Group</h2>
        <label className="block mb-2">
          Group Name:
          <input
            type="text"
            value={groupName}
            onChange={onGroupNameChange}
            className="block w-full border-gray-300 rounded-md p-2"
            placeholder="Enter group name"
          />
        </label>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2 button-14">Selected Fonts</h3>
          {selectedFonts.map((font) => (
            <div key={font} className="flex items-center justify-between py-1">
              <span>{font}</span>
              <button
                onClick={() => onFontDeselection(font)}
                className="bg-red-500 text-sm p-1 rounded hover:text-red-600 "
              >
                Deselect
              </button>
            </div>
          ))}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 button-14">Remaining Fonts</h3>
          {fontList.map((font) => (
            <div key={font} className="flex items-center justify-between py-1">
              <span>{font.replace('.ttf', '')}</span>
              <button
                onClick={() => onFontSelection(font)}
                className="text-blue-500 hover:text-blue-600 button-14"
              >
                Select
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end">
          <button
            onClick={onSaveGroup}

            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2 button-29"
            
          >
            Save Group
          </button>
          <button
            onClick={onCancel}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FontGroup;
