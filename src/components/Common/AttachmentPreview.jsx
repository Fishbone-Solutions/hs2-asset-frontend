import React, { useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import PropTypes from "prop-types";
import Doc from "components/svg/Doc";
import MyIcon from "components/svg/Generic";
import Pdf from "components/svg/Pdf";
import PptxIcon from "components/svg/Pptx";
import TxtIcon from "components/svg/Txt";
import SpreadsheetIcon from "components/svg/Xls";
import CsvIcon from "components/svg/CsvIcon";
import { Tooltip } from "bootstrap"; // Import Bootstrap's Tooltip

// Initializes tooltips on component mount
const initializeTooltips = () => {
  const tooltipTriggerList = document.querySelectorAll(
    '[data-bs-toggle="tooltip"]'
  );
  const tooltips = Array.from(tooltipTriggerList).map(
    (tooltipTriggerEl) => new Tooltip(tooltipTriggerEl)
  );

  // Cleanup tooltips on unmount
  return () => {
    tooltips.forEach((tooltip) => tooltip.dispose());
  };
};

const isImageFile = (fileName) => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif"];
  const extension = fileName.split(".").pop().toLowerCase();
  return imageExtensions.includes(extension);
};

// Determines the icon component based on file extension
const getThumbnail = (fileName) => {
  const extension = fileName.split(".").pop().toLowerCase();

  switch (extension) {
    case "pdf":
      return <Pdf />;
    case "doc":
    case "docx":
    case "odt":
      return <Doc />;
    case "xls":
    case "xlsx":
    case "ods":
      return <SpreadsheetIcon />;
    case "csv":
      return <CsvIcon />;
    case "ppt":
    case "pptx":
    case "odp":
      return <PptxIcon />;
    case "txt":
    case "rtf":
      return <TxtIcon />;
    default:
      return <MyIcon IconTxt={extension.toUpperCase()} />;
  }
};

// Main component for displaying file previews
const AttachmentPreview = ({ files, deleteFile }) => {
  useEffect(() => {
    initializeTooltips();
  }, [files]);

  const fileArray = Array.isArray(files) ? files : [files];

  return (
    <div className="custom-preview row mt-2">
      {fileArray.map((file, index) => (
        <div key={index} className="col-12 col-md-4 mb-3">
          <div className="d-flex align-items-center p-2 border rounded">
            {/* Image preview or document icon */}
            {isImageFile(file.name) ? (
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "cover",
                  borderRadius: "5px",
                  marginRight: "10px",
                }}
              />
            ) : (
              <div
                style={{ width: "50px", height: "50px", marginRight: "10px" }}
              >
                {getThumbnail(file.name)}
              </div>
            )}

            {/* File info with tooltip */}
            <div className="flex-grow-1 me-2">
              <div
                className="text-truncate"
                style={{ maxWidth: "120px" }}
                data-bs-toggle="tooltip"
                title={file.name} // Tooltip shows full file name
              >
                {file.name}
              </div>
              <small className="text-muted">
                {(file.size / 1024).toFixed(1)} KB
              </small>
            </div>

            {/* Remove button */}
            <button
              type="button"
              className="btn btn-link p-0 text-danger"
              onClick={() => deleteFile(index)}
            >
              <RxCross2 size="1.5rem" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

AttachmentPreview.propTypes = {
  files: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        size: PropTypes.number.isRequired,
      })
    ),
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      size: PropTypes.number.isRequired,
    }),
  ]).isRequired,
  deleteFile: PropTypes.func.isRequired,
};

export default AttachmentPreview;
