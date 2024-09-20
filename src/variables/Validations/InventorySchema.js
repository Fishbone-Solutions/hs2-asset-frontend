import * as Yup from "yup";

// Initial schema for form values
export const initialValues = {
  id: "Auto Generated", // Not validated (auto-generated)
  code: "", // Not validated (can be optional)
  entrydate_formatted: "", // Not validated (formatted date)
  categorycode1: "",
  categorycode2: "",
  asset_name: "",
  description: "",
  asset_condition: "",
  quantity: "",
  asset_location: "",
  value: "",
  additional_info: "",
  available_from: "",
  seller_title: "",
  seller_contactno: "",
  seller_email: "",
  seller_location: "",
  statuscode: "",
};

// Validation schema using Yup
export const inventorySchema = Yup.object({
  seller_title: Yup.string().required("Seller Title is required"),
  seller_contactno: Yup.string().required("Contact number is required"),
  seller_email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
  seller_location: Yup.string().required("Location is required"),
  categorycode1: Yup.string().required("Category is required"),
  categorycode2: Yup.string().required("Sub-category is required"),
  statuscode: Yup.string().required("Status is required"),
  available_from: Yup.string().required("Availability date is required"),
  additional_info: Yup.string().required("Additional Information is required"),
  asset_name: Yup.string().required("Asset Name is required"),
  description: Yup.string().required("Description is required"),
  value: Yup.string().required("Value is required"),
  asset_condition: Yup.string().required("Asset Condition is required"),
  quantity: Yup.string().required("Quantity is required"),
  asset_location: Yup.string().required("Asset Location is required"),

  // Optional fields (not in validation)
  code: Yup.string().nullable(), // Optional
  entrydate_formatted: Yup.string().nullable(), // Optional
  id: Yup.string().nullable(),
});
