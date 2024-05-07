import { PageClass } from './page.class';

export class FormClass
{
    layout_id:number;    
    form_id:number;
    layout_guid:string;    
    form_description:string;
    form_status:boolean;
    //layout_exam_type:string;
    //layout_exam_type_guid:string;
    layout_registration_guid:string;
    layout_registrations_name:string;
    layout_type:string;
    layout_type_guid:string;
    name:string;
    layout_code:string;
    form_guid:string;
    registration_guid: string;    
    candidate_guid: string;    
    pages:PageClass[]=[];
}
export class LayoutDetails
{
    layout:FormClass;
}


export class FormClassList
{
    form:FormClass;
}

export class FromSubmitClass
{
    form_id:number;
    form_guid:string;    
    page_id :number;
    page_guid :string;
    section_id:number;
    section_guid:string;
    comp_id:number;
    comp_guid:string;
    comp_name:string;
    data_value:string; 
    layout_guid:string;   
    layout_id:number;    
  
}

export class FormListClass
{
    form:FormClass[]=[];
}
