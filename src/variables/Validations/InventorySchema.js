import * as Yup from "yup";

// Initial schema for form values
export const initialInventoryValues = {
  id: "Auto Generated",
  code: "",
  entrydate_formatted: "",
  categorycode1: "",
  categorycode2: "",
  asset_name: "",
  description: "",
  asset_condition: "",
  quantity: "", // Top-level quantity
  quantity_unit: "", // Top-level quantity_unit
  asset_location: "",
  asset_location_city: "",
  value: "",
  value_curr: "GBP",
  additional_info: "",
  available_from: "",
  seller_title: "",
  seller_contactno: "",
  seller_email: "",
  seller_location: "",
  statuscode: "",
  asset_id: "",
  maintenance_requirements: "",
  residual_forecast_value: "",
  residual_forecast_value_curr: "GBP",
  date_of_purchase: "",
  contract_no: "",
  purchase_price: "",
  purchase_price_curr: "GBP",
  sold_value: null,
  sold_value_curr: "GBP",
};

// Updated Validation schema
export const inventorySchema = Yup.object().shape({
  seller_title: Yup.string()
    .required("Seller Title is required")
    .max(50, "No longer than 50 characters"),
  seller_contactno: Yup.string().required("Contact number is required"),
  seller_email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
  seller_location: Yup.string().required("Location is required"),
  categorycode1: Yup.string().required("Category is required"),
  categorycode2: Yup.string().required("Sub-category is required"),
  statuscode: Yup.string().required("Status is required"),
  available_from: Yup.string().required("Forecasted Availability is required"),

  asset_name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  value: Yup.string().required("Estimated value with currency is required"),
  value_curr: Yup.string().required("Currency is required"),
  asset_condition: Yup.string().required("Condition is required"),

  // Combined validation for quantity and quantity_unit
  quantity: Yup.string()
    .required("Quantity is required")
    .test(
      "quantity-unit-required",
      "Quantity with measurement unit is required",
      function (value) {
        const { quantity, quantity_unit } = this.parent;
        // Error if either field is empty
        return Boolean(quantity && quantity_unit);
      }
    ),
  quantity_unit: Yup.string()
    .required("Measurement unit is required")
    .test(
      "quantity-unit-required",
      "Quantity with measurement unit is required",
      function (value) {
        const { quantity, quantity_unit } = this.parent;
        return Boolean(quantity && quantity_unit);
      }
    ),

  maintenance_requirements: Yup.string().nullable(),
  residual_forecast_value: Yup.string().nullable(),
  residual_forecast_value_curr: Yup.string().nullable(),
  date_of_purchase: Yup.string().nullable(),
  contract_no: Yup.string()
    .matches(
      /^[a-zA-Z0-9\/\\\-]+$/,
      "Must be only alphanumeric characters and / \\ pattern is [ABC]-[123]/[EA]"
    )
    .nullable(),
  purchase_price: Yup.string().nullable(),
  purchase_price_curr: Yup.string().nullable(),
  code: Yup.string().nullable(),
  entrydate_formatted: Yup.string().nullable(),
  id: Yup.string().nullable(),

  // Conditional validation for sold_value
  sold_value: Yup.number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === "null" ? null : value
    )
    .when("statuscode", {
      is: (val) => val === "Sold",
      then: (schema) => schema.required("Sold value is required"),
      otherwise: (schema) => schema.nullable(),
    }),
  sold_value_curr: Yup.string().nullable(),
  additional_info: Yup.string().nullable(),
  asset_location_city: Yup.string().required("City is required"),
  asset_location: Yup.string().required("Compound/Area/PostCode is required"),
});
