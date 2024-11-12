import ReactCountryFlag from "react-country-flag";
import { validationRules } from "./Validations/Rules";

export const itemStatusOptions = [
  { value: "New", label: "New" },
  { value: "Used-Working", label: "Used - Working" },
  { value: "Used-Not-Working", label: "Used - Not Working" },
  { value: "Refurbished", label: "Refurbished" },
  { value: "Expired", label: "Expired" },
];

export const orderStatusOptions = [
  { value: "EOI-SUBMITTED", label: "EOI Submitted" },
  { value: "IN-NEGOTIATION", label: "In Negotiation" },
  { value: "PROCESSING", label: "Processing" },
  { value: "PAYMENT-RECEIVED", label: "Payment Received" },
  { value: "GOODS-SENT", label: "Goods Sent" },
  { value: "NOT-PROCEEDING", label: "Not Proceeding" },
];

export const approvalStatusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
];

export const inventoryStatusOptions = [
  { value: "Listing", label: "Listing" },
  { value: "Live", label: "Live" },
  { value: "Sold", label: "Sold" },
];

export const categorycode1 = [
  { value: "Construction Office", label: "Construction Office" },
  {
    value: "Storage/Logistics Facilities",
    label: "Storage/Logistics Facilities",
  },
  { value: "Processing Facilities", label: "Processing Facilities" },
  { value: "Fixed Services", label: "Fixed Services" },
  { value: "Temporary Services", label: "Temporary Services" },
  { value: "Security", label: "Security" },
  {
    value: "Compound Security/Safety Infrastructure",
    label: "Compound Security/Safety Infrastructure",
  },
  {
    value: "Site Roads and Infrastructure",
    label: "Site Roads and Infrastructure",
  },
  { value: "Temporary Siding", label: "Temporary Siding" },
  { value: "Consolidation Yards", label: "Consolidation Yards" },
  { value: "Concrete Production", label: "Concrete Production" },
  { value: "Diversions", label: "Diversions" },
  { value: "Earthworks", label: "Earthworks" },
  { value: "Static Plant", label: "Static Plant" },
  { value: "Piling", label: "Piling" },
  { value: "Pipework", label: "Pipework" },
  {
    value: "Public Highway Traffic Management",
    label: "Public Highway Traffic Management",
  },
  { value: "Other Assets", label: "Other Assets" },
];

export const conditionOptions = [
  { value: "New", label: "New" },
  { value: "Used-Working", label: "Used - Working" },
  { value: "Used-Not-Working", label: "Used - Not Working" },
  { value: "Refurbished", label: "Refurbished" },
  { value: "Expired", label: "Expired" },
];

export const subCategory = [
  { value: "Generic", label: "Generic" },
  { value: "Other", label: "Other" },
];

export const myEoIUpdateoptions = [
  { value: "PAYMENT-SENT", label: "Payment Sent" },
  { value: "GOODS-RECEIVED", label: "Goods Received" },
  { value: "WITHDRAWN", label: "Withdrawn" },
];

export const formatLocation = (data) => {
  // Split the string by the '%' character
  return data.replace(/%/g, " ").trim();
};

export const formatApprovalString = (input) => {
  const [status, ...rest] = input.split("%");

  const formattedText = rest.join(" ").replace(/,/g, "<br/>");

  if (status.trim().toUpperCase() === "REJECTED") {
    const rejectReason = formattedText.replace(/(.{40})/g, "$1<br/>"); // Break after every 40 characters
    return `
      ${status}<br />
      <span class="line-content">${rejectReason}</span>
    `;
  } else {
    return `${status}<br/>${formattedText}`;
  }
};

export const formatStringWithDash = (input) => {
  const formattedStatus = input === "Not Requested" ? "Not-Requested" : input;

  return formattedStatus;
};

export const formatApprovalStringStatus = (input) => {
  return input.split("%")[0];
};

export const getBadgeClass = (activity) => {
  switch (activity) {
    case "EOI-SUBMITTED":
      return "badge  bg-dark-sky-blue"; // Light Turquoise
    case "IN-NEGOTIATION":
      return "badge  bg-dark-blue"; // Light Blue
    case "APPROVAL-REQUEST":
      return "badge bg-purple"; // Dark Purple
    case "PROCESSING":
      return "badge bg-processing";
    case "APPROVED":
      return "badge bg-lime"; // Light Green
    case "REJECTED":
      return "badge bg-danger-dark"; // Light Green
    case "PAYMENT-REQUESTED":
      return "badge bg-warning-dark"; // Light Orange
    case "PAYMENT-SENT":
      return "badge bg-warning-dark"; // Darker Orange
    case "PAYMENT-RECEIVED":
      return "badge bg-warning-light"; // Yellow
    case "GOODS-SENT":
      return "badge bg-lime"; // Light Green
    case "GOODS-RECEIVED":
      return "badge bg-lime"; // Bright Lime Green
    case "*REVERTED":
      return "badge bg-danger-dark";
    case "AWAITING BUYER RESPONSE":
      return "badge badge-danger dark-awaiting bg-danger-dark";
    case "AWAITING SELLER RESPONSE":
      return "badge badge-danger dark-awaiting bg-danger-dark";
    case "AWAITING APPROVER RESPONSE":
      return "badge badge-danger dark-awaiting bg-danger-dark";
    case "WITHDRAWN":
      return "badge bg-danger-dark";
    case "Requested":
      return "badge  bg-dark-sky-blue";
    case "REQUESTED":
      return "badge  bg-dark-sky-blue";
    case "Not Requested":
      return "badge bg-text-not-requested";
    case "NOT-REQUESTED":
      return "badge bg-text-not-requested";
    case "NOT-PROCEEDING":
      return "badge bg-text-not-requested";
    default:
      return "badge bg-danger-dark";
    // Default grey badge for unrecognized statuses
  }
};

export const ImageType = [
  ".png",
  ".jpeg",
  ".jpg",
  ".gif",
  ".bmp",
  ".tiff",
  ".svg",
  ".ico",
  ".heic",
  ".heif",
];

export const DocumentType = [
  // Text Documents
  ".txt", // Plain Text
  ".rtf", // Rich Text Format
  ".doc", // Microsoft Word 97-2003 Document
  ".docx", // Microsoft Word Document
  ".odt", // OpenDocument Text

  // Portable Documents
  ".pdf", // Portable Document Format

  // Spreadsheets
  ".xls", // Microsoft Excel 97-2003 Spreadsheet
  ".xlsx", // Microsoft Excel Spreadsheet
  ".ods", // OpenDocument Spreadsheet

  // Presentations
  ".ppt", // Microsoft PowerPoint 97-2003 Presentation
  ".pptx", // Microsoft PowerPoint Presentation
  ".odp", // OpenDocument Presentation

  // Other Formats
  ".html", // HyperText Markup Language
  ".xml", // eXtensible Markup Language
  ".md", // Markdown

  // Compressed Archives
  ".zip", // ZIP Archive
  ".rar", // RAR Archive
  ".7z", // 7-Zip Archive

  // Other Documents
  ".epub", // Electronic Publication
  ".mobi", // Mobipocket eBook
  ".tex", // LaTeX Document
];

export const getStatusMessage = (statusCode, type) => {
  switch (statusCode) {
    case -10:
      return `Can not update to new Status. Awaiting for ${type} to respond to your current status`;
    case -20:
      return `Can not update to new Status. Awaiting for ${type} to respond to your current status`;
    case -30:
      return type === "Buyer"
        ? "Can not stop proceeding at this stage"
        : "Can not Withdraw EOI at this stage";
    case -40:
      return "Can not continue. Approval is required to proceed further";
    case -50:
      return "Sorry, you can not update to this Status at this stage";
    case -60:
      return "You can not Widthdraw at this Stage. The Buyer has already dispatched the Goods";
    case -61:
      return "You have already sent the payment and can not Withdraw at this stage";
    case -62:
      return "The Seller has not yet requested for the payment";
    case -63:
      return "The Seller has not yet dispatched the Goods";
    case -100:
      return "Can not proceed further. The Buyer has Withdrawn from this EOI";
    case -51:
      return "Can not proceed. The buyer has not sent the payment yet";
    case -52:
      return "Can not proceed. The buyer has not sent the payment yet";
    case -99:
      return "Can not proceed further. You have already decided not to proceed with this EOI";
    case -101:
      return "Can not go into Negotiation. This EOI is awaiting an Approval";
    default:
      return statusCode > 0
        ? "Acknowledgement Status updated"
        : "Invalid status code";
  }
};

export const getUndoStatusMessage = (status, type = null) => {
  switch (status) {
    case -1:
      return `Can not Undo Status. The Status was set by the ${type}`;
    case -2:
      return "Can not undo Status at this stage";
    case 0:
      return "No previous status available";
    default:
      return "Current Status reverted";
  }
};

export const handleInput = (validationKey) => (input) => {
  // Determine if `input` is an event or a direct value
  const value =
    typeof input === "object" && input.target ? input.target.value : input;

  const { pattern, regex } = validationRules[validationKey];

  // Validate input: if it doesn't match the pattern, remove invalid characters
  const newValue = pattern.test(value) ? value : value.replace(regex, "");

  // If `input` is an event, update the target value directly
  if (typeof input === "object" && input.target) {
    input.target.value = newValue;
  }

  // Return the processed value in all cases
  return newValue;
};

export const handleInputFilteration = (validationKey) => (event) => {
  const { value } = event.target;

  const { pattern, regex } = validationRules[validationKey];

  // Validate input: if it doesn't match the pattern, remove invalid characters
  if (!pattern.test(value)) {
    return value.replace(regex, "");
  } else {
    return value;
  }
};

export const getResponseBulkUploadMessage = (code) => {
  switch (code) {
    case "-1":
      return "Parsing Failed: No valid data found in the file";
    case "-2":
      return "An error occurred while processing the request. Please try again later";
    case "-3":
      return "Invalid data format. Please ensure dates are in the correct format";
    case "02":
      return "Please choose a file with the correct template";
    default:
      return "";
  }
};

export const getNudgeMessage = (eoi_nudge, sendNudgeto) => {
  switch (true) {
    case eoi_nudge > 0:
      return `Nudge sent to ${
        sendNudgeto === "BUYER"
          ? "Buyer"
          : sendNudgeto === "SELLER"
            ? "Seller"
            : "Approver"
      }`;

    case eoi_nudge === -2:
      return "You have already sent a nudge. A nudge can only be sent once a day.";

    case eoi_nudge === -3:
      return `No pending request at ${
        sendNudgeto === "BUYER"
          ? "Buyer"
          : sendNudgeto === "SELLER"
            ? "Seller"
            : "Approver"
      }`;
    default:
      return "An unknown error occurred.";
  }
};

export const getStatusMessageApprovalRequest = (status) => {
  switch (status) {
    case "REQUESTED":
      return "Approval for this EOI is already requested";
    case "APPROVED":
      return "This EOI is already Approved";
    default:
      return null; // Return null for other statuses where no message is needed
  }
};

export const currencyOptions = [
  {
    value: "GBP",
    label: (
      <>
        <ReactCountryFlag countryCode="GB" svg style={{ marginRight: "8px" }} />{" "}
        GBP
      </>
    ),
  },
  {
    value: "USD",
    label: (
      <>
        <ReactCountryFlag countryCode="US" svg style={{ marginRight: "8px" }} />{" "}
        USD
      </>
    ),
  },
  {
    value: "EUR",
    label: (
      <>
        <ReactCountryFlag countryCode="EU" svg style={{ marginRight: "8px" }} />{" "}
        EUR
      </>
    ),
  },
  // Add more currencies as needed
];

export const getUkUnits = [
  { value: "Unit", label: "Unit(s)", symbol: "Unit", type: "Unit" },
  { value: "kg", label: "Kg", symbol: "kg", type: "Weight" },

  { value: "Litre", label: "Litre", symbol: "L", type: "Volume" },
  { value: "Yard", label: "Yard", symbol: "yd", type: "Length" },
  { value: "Foot", label: "Foot", symbol: "ft", type: "Length" },
  { value: "Pound", label: "Pound", symbol: "lb", type: "Weight" },
];
