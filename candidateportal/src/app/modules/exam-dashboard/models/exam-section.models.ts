export interface ExamSection
{
    section_guid: string,
    section_name: string
}

export interface ExamExamDuration 
{
    allowed_duration_in_seconds: string;
}


export interface ExamSectionStatus
{
      status_guid: string,
      status_name: string,
      status_css_tag: string,
      no_of_questions: string 
}

export interface ExamSectionLanguageStatus
{
    language_guid:string;
    exam_section_status:ExamSectionStatus[];
}

export interface ExamSectionQuestionStatus
{
    question_number:string,
    language_guid:string,
    status_guid:string,
    status_name: string,
    question_guid: string,
    status_css_tag: string,
    section_guid: string,
    status_type: string
}

//classes
export class SelectedSectionDetails
{
   selected_section_guid:string; 
   selected_section_name:string;
   selected_section_index:string;

}
