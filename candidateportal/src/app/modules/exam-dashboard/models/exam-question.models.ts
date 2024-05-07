import { ExamSection, ExamExamDuration, ExamSectionQuestionStatus, ExamSectionStatus } from "./exam-section.models";

export interface ExamQuestionDetail
{
      section_guid:string,
      question_number: string,
      question_status_css_tag:string,
      question_guid: string,
      language_guid: string,
      language_name: string,
      question_description: string,
      number_of_options: string,
      answer_type_code: string,
      primary_question_guid: string,
      first_question_number: string,
      last_question_number:string,
      previous_question_guid: string,
      next_question_guid: string,
      reg_id: number,
      subject_guid: string,
      subject: string,
      positive_marks: string,
      negative_marks: string,
      question_status_type: string,
      section_name: string,
      allowed_duration_in_seconds: number,
      status_css_tag: string,
      is_answer_saved_in_db: boolean                   
}

export interface ExamQuestionOption
{
      question_guid: string,
      description: string,
      option_Guid: string,
      option_number: string
} 

export interface ExamQuestionAnswer
{
      question_guid: string,
      description: string,
      option_Guid: string,
      option_number: string
} 

export interface ExamQuestions
{
      question:ExamQuestionDetail[],
      option:ExamQuestionOption[],
      answers:ExamQuestionAnswer[]
}


export interface ExamQuestionsSummary
{
  exam_duration: ExamExamDuration,
  sections:ExamSection[],
  question_summary:ExamQuestions[],
  section_status:ExamSectionStatus[],
  section_questions_status:ExamSectionQuestionStatus[]
}