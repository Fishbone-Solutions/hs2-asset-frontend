import Doc from "components/svg/Doc";
import MyIcon from "components/svg/Generic";
import Pdf from "components/svg/Pdf";
import PptxIcon from "components/svg/Pptx";
import TxtIcon from "components/svg/Txt";
import SpreadsheetIcon from "components/svg/Xls";
import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css"; // Import the lightbox styles

export const DOCUMENT_TYPES = [
  ".txt",
  ".rtf",
  ".doc",
  ".docx",
  ".odt",
  ".pdf",
  ".xls",
  ".xlsx",
  ".ods",
  ".ppt",
  ".pptx",
  ".odp",
  ".html",
  ".xml",
  ".md",
  ".zip",
  ".rar",
  ".7z",
  ".epub",
  ".mobi",
  ".tex",
];

// Function to get the appropriate icon based on the file extension
const getFileIcon = (fileName) => {
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

const AttachmentList = ({
  attachments,
  attachmentType,
  showDeleteIcon,
  onDelete,
}) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const filteredAttachments = attachments.filter((data) =>
    attachmentType === "images"
      ? data["att_type"] === "images"
      : data["att_type"] === "docs" || data["att_type"] === "pdf"
  );

  const images = filteredAttachments
    .filter((data) => data["att_type"] === "images")
    .map((data) => ({
      src: data["att_location"],
      title: `attachment-${data["id"]}`,
    }));

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const handleDelete = (id) => {
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <div className="container-fluid py-3">
      {filteredAttachments.length > 0 ? (
        <>
          {attachmentType === "images" && (
            <>
              <div className="d-flex flex-wrap">
                {filteredAttachments.map((data, index) => (
                  <div
                    key={index}
                    className="position-relative me-4 mb-2 shadow-box-image"
                  >
                    <a
                      onClick={() => openLightbox(index)}
                      className="d-block"
                      href="#"
                      aria-label={`Open lightbox for image ${index}`}
                    >
                      <img
                        width="150"
                        height="150"
                        className="rounded"
                        src={data["att_location"]}
                        alt={`attachment-${index}`}
                      />
                    </a>
                    {showDeleteIcon && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 cross-btn-attachments"
                        onClick={() => handleDelete(data.att_id)}
                        aria-label="Delete image"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {isLightboxOpen && (
                <Lightbox
                  slides={images}
                  open={isLightboxOpen}
                  index={currentImageIndex}
                  close={closeLightbox}
                />
              )}
            </>
          )}

          {attachmentType === "docs" && (
            <div className="d-flex flex-wrap">
              {filteredAttachments
                .filter((data) => data["att_type"] === "docs")
                .map((data, index) => (
                  <div key={index} className="card customized-docs-card me-4">
                    <a
                      href={data["att_location"]}
                      rel="noopener noreferrer"
                      className="text-decoration-none"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title={data["att_name"]}
                    >
                      <div className="d-flex justify-content-center">
                        {/* Display the appropriate icon based on file type */}
                        {getFileIcon(data["att_location"])}
                      </div>
                      <div className="card-body text-center">
                        <p className="card-text text-truncate w-100">
                          {data["att_name"]}
                        </p>
                      </div>
                    </a>
                    {showDeleteIcon && (
                      <button
                        type="button"
                        className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 cross-btn-attachments"
                        onClick={() => handleDelete(data.att_id)}
                        aria-label="Delete document"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
            </div>
          )}
        </>
      ) : (
        <>
          <p>No attachments!</p>
        </>
      )}
    </div>
  );
};

export default AttachmentList;
