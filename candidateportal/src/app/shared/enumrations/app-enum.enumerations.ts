export enum HandelError {
  ShowAndReturn = 1,
  ShowAndKill = 2,
  HideAndReturn = 3,
  HideAndKill = 4,
}
export enum FuncStatus {
  True = 1,
  False = 2,
  Error = 3,
}

export enum Registration {

  getLayoutDetailByExamGuid = "getLayoutDetailByExamGuid",
  addFormValueByRegistrationGuid = "addFormValueByRegistrationGuid",
  getCandidateDetailsByGuid = "getCandidateDetailsByGuid",
  submitCandidateRegistration = "submitCandidateRegistration",
  getPaymentPaymentInfo = "getPaymentPaymentInfo",
  paytmPaymentGateway = "paytmPaymentGateway",
  getCandidateInitialInfo = "getCandidateInitialInfo",
  getPaymentPaytmResponse = "getPaymentPaytmResponse",
  offlinePaymentAdd = "offlinePaymentAdd"
}

export enum Dashboard {
  getCandidateDetailsByGuid = "getCandidateDetailsByGuid",
  getCandidateInitialInfo = "getCandidateInitialInfo",
  generateOTP = "generateOTP",
  verifyOTP = "verifyOTP",
  updateCandidateEmail = "updateCandidateEmail",
  getPaymentStatus = "getPaymentStatus"
}

export enum AdmitCard {
  getAdmitCardPreviewDetails = "getAdmitCardPreviewDetails"
}

export enum ChangePassword {
  getCandidateInitialInfo = "getCandidateInitialInfo",
  changePassword = "changePassword"
}

export enum Login {
  getCaptcha = "getCaptcha",
  validateCaptcha = "validateCaptcha"
}