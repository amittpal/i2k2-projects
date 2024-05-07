export class QuestionAnswerResponse
{
    candidate_guid:string;
    question_guid:string;
    question_number:string;
    mark_to_review:string;
    answers:any;
    valid_response:boolean=false;
    value_changed:boolean=false;    
    language_guid: any;
    section_guid: any;
    primary_question_guid: any;
} 