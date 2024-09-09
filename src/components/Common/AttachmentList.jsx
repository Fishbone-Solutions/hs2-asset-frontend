import React from "react";
import { SlideshowLightbox, initLightboxJS } from "lightbox.js-react";
import "lightbox.js-react/dist/index.css";

const AttachmentList = ({ attachments, attachmentType }) => {
  return (
    <div className="row">
      <ul>
        {attachments.length > 0 ? (
          attachments
            .filter((data) =>
              attachmentType === "images"
                ? data["att_type"] === "images"
                : data["att_type"] === "doc" || data["att_type"] === "pdf"
            )
            .map((data, index) => (
              <li key={index} className="attachment-list-item">
                {data["att_type"] === "images" &&
                attachmentType === "images" ? (
                  <SlideshowLightbox
                    theme="lightbox"
                    framework="next"
                    className="container grid grid-cols-3 gap-1 mx-auto"
                  >
                    <img
                      width="200"
                      height="200"
                      className="attachment-images"
                      src={data["att_locatioin"]}
                      alt={`attachment-${index}`}
                    />
                  </SlideshowLightbox>
                ) : attachmentType === "docs" && data["att_type"] === "doc" ? (
                  <div className="doc-thumbnail">
                    <a
                      href={data["att_location"]}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        width="200"
                        height="200"
                        className="doc-icon"
                        src="/path-to-thumbnail-image/doc-thumbnail.png" // Replace with your document thumbnail path
                        alt={`Document thumbnail ${index}`}
                      />
                      <p>View Document</p>
                    </a>
                  </div>
                ) : null}
              </li>
            ))
        ) : (
          <p>No attachments found!</p>
        )}
      </ul>
    </div>
  );
};

export default AttachmentList;
