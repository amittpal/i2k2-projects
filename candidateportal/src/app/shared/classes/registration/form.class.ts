import { PageClass } from './page.class';

export class FormClass
{
    layout_id:number;
    layout_type_code:string;    
    form_id:number;
    layout_guid:string;    
    form_description:string;
    form_status:boolean;
    layout_exam_type:string;
    name:string;
    layout_code:string;
    form_guid:string;    
    pages:PageClass[]=[];
    reg_id:string;
    candidate_guid:string;
    layout_registration_guid:string;
    layout_registration_name:string;
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
    layout_type_code:string;    
  
}

export class FormListClass
{
    form:FormClass[]=[];
}
