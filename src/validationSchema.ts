import * as yup from "yup";
export const registrationSchema = yup.object().shape({
  username: yup
    .string()
    .required("Nickname field is required")
    .min(4, "Nickname is too short")
    .max(20, "Nickname length must be less than 20 symbols")
    .matches(/^[a-zA-Z0-9_]+$/, "Nickname has invalid characters"),
  password: yup
    .string()
    .required("Password field is required")
    .min(6, "Password length must be more than 6 characters"),
});
