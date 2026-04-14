export type AuthFieldErrors = Partial<
  Record<
    | "accountType"
    | "confirmPassword"
    | "email"
    | "fullName"
    | "password"
    | "phone"
    | "resellerPublicId"
    | "storeName",
    string
  >
>;

export type AuthActionState = {
  fieldErrors: AuthFieldErrors;
  message: string | null;
  status: "idle" | "error" | "success";
};

export const initialAuthActionState: AuthActionState = {
  fieldErrors: {},
  message: null,
  status: "idle",
};
