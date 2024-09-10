import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css"; // Import the lightbox styles

const AttachmentList = ({ attachments, attachmentType }) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Filter attachments based on attachment type
  const filteredAttachments = attachments.filter((data) =>
    attachmentType === "images"
      ? data["att_type"] === "images"
      : data["att_type"] === "doc" || data["att_type"] === "pdf"
  );

  // Prepare images for the lightbox
  const images = filteredAttachments
    .filter((data) => data["att_type"] === "images")
    .map((data) => ({
      src: data["att_location"],
      title: `attachment-${data["id"]}`,
    }));

  // Function to open the lightbox
  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  // Function to close the lightbox
  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  return (
    <div className="container-fluid py-3">
      {filteredAttachments.length > 0 ? (
        <>
          {attachmentType === "images" && (
            <>
              <div className="d-flex flex-wrap">
                {filteredAttachments.map((data, index) => (
                  <a
                    key={index}
                    onClick={() => openLightbox(index)}
                    className="me-2 mb-2"
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
            <ul className="list-unstyled d-flex flex-wrap">
              {filteredAttachments
                .filter((data) => data["att_type"] === "doc")
                .map((data, index) => (
                  <li key={index} className="me-2 mb-2">
                    <div className="card">
                      <a
                        href={data["att_location"]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-decoration-none"
                      >
                        <img
                          width="200"
                          height="200"
                          className="card-img-top"
                          src="/path-to-thumbnail-image/doc-thumbnail.png"
                          alt={`Document thumbnail ${index}`}
                        />
                        <div className="card-body text-center">
                          <p className="card-text">View Document</p>
                        </div>
                      </a>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </>
      ) : (
        <p>No attachments found!</p>
      )}
    </div>
  );
};

export default AttachmentList;
