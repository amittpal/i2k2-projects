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

export enum Exam
{
  getLanguageList="getLanguageList",
  addCandidateDetails="addCandidateDetails",
  getCandidateInformation="getCandidateInformation",
  getQuestionDetails="getQuestionDetails",
  getExamSectionList="getExamSectionList",
  addQuestionAnswer="addQuestionAnswer",
  addQuestionMarkToReview="addQuestionMarkToReview",
  submitExam="submitExam",
  getOnlineStatus = "getOnlineStatus",
  clearQuestionAnswers = "clearQuestionAnswers",
  getAnswerSummary = "getAnswerSummary",
  getInstructionStatus = "getInstructionStatus",
  examInstructions = "examInstructions",
  updateUserInstructionStatus = "updateUserInstructionStatus",
  getAllExamQuestions = "getAllExamQuestions",
  getLanguagesByExamId = "getLanguagesByExamId",
  updateHeartbeat = "updateHeartbeat",
  bulkUpdateAnswers = "bulkUpdateAnswers"
}
