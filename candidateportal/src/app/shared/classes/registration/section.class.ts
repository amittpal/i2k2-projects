import { ComponentClass } from './component.class';


export class SectionClass
{
    section_id:number;
    section_guid:string;
    section_name:string;
    section_description:string;
    section_code:string
    section_visibility:string;
    section_css_class:string;
    comps:ComponentClass[]=[];    
}