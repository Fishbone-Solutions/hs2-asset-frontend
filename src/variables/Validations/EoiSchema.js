import * as Yup from "yup";

// Initial schema for form values
export const initialEoiValues = {
  code: "",
  submission_date: "",
  buyer_name: "",
  organization: "",
  contact_no: "",
  email: "",
  address: "",
  delivery_location: "",
  contact_time_preference: "",
  eoi_status: "EOI_SUBMITTED",
  approval_status: "PENDING",
  status_trail: `EOI_SUBMITTED:`,
};

// Validation schema using Yup
export const eoiSchema = Yup.object({
  buyer_name: Yup.string().required("Name is required"),
  organization: Yup.string().required("Company is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  contact_no: Yup.string().required("Contact Number is required"),
  address: Yup.string().required("Buyer Address is required"),
  delivery_location: Yup.string().required("Item Delivery Address is required"),
  contact_time_preference: Yup.string().required(
    "Preferred Contact Timings is required"
  ),
});
