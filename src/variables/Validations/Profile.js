import * as Yup from "yup";

// Initial schema for form values
export const initialProfilValues = {
  firstname: "",
  lastname: "",
  email: "",
  contact_no: "",
};

// Validation schema using Yup
export const profileSchema = Yup.object({
  firstname: Yup.string().required("First name is required"),
  lastname: Yup.string().required("Last name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  contact_no: Yup.string().required("Contact no is required"),
});
