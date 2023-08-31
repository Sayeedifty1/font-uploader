import  { useState } from "react";
import { useDropzone } from "react-dropzone";
import { BsCloudUpload } from "react-icons/bs";

const FontUploader = () => {
    const [uploadedFonts, setUploadedFonts] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const handleFontDrop = async (acceptedFiles) => {
        const ttfFiles = acceptedFiles.filter(file => file.name.endsWith('.ttf'));

        if (ttfFiles.length === 0) {
            setErrorMessage("Please choose a valid TTF font file.");
        } else {
            setUploadedFonts(ttfFiles);
            setErrorMessage('');

            const formData = new FormData();
            ttfFiles.forEach(file => {
                formData.append('fonts[]', file);
            });

            try {
                const response = await fetch('http://localhost/font-uploader-server/', {
                    method: 'POST',
                    body: formData,
                });
            
                const responseText = await response.text();
                console.log(responseText); // Inspect the response content
            
                const responseData = JSON.parse(responseText);
                console.log(responseData); // Handle the server response if needed
            } catch (error) {
                console.error('Error uploading fonts:', error);
            }
            
        }
    };
    

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleFontDrop,
        accept: ".ttf",
    });
console.log(uploadedFonts)
    return (
        <div>
            <div {...getRootProps()} className="w-[70%] mx-auto lg:w-auto lg:px-56 py-28 rounded-md border-dashed border-2 bg-gray-50 font-serif flex flex-col items-center gap-2 cursor-pointer">
                <input {...getInputProps()} />
                <BsCloudUpload className="w-7 h-7 lg:w-[35px] lg:h-[35px] text-gray-400"></BsCloudUpload>
                <p className="text-gray-500 text-base"><span className="font-semibold text-gray-600">Click to upload</span> or drag and drop</p>
                <p className="text-gray-500 text-sm">Only TTF files are supported</p>
                <p className="text-xs font-normal text-red-500 animate-pulse">{errorMessage}</p>
            </div>
        </div>
    );
};

export default FontUploader;
