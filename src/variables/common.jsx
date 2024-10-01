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
  { value: "PROCESSING", label: "Processing"},
  { value: "PAYMENT-RECEIVED", label: "Payment Received" },
  { value: "GOODS-SENT", label: "Goods Sent" },
  { value: "NOT-PROCEEDING", label: "Not Proceeding"},
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
