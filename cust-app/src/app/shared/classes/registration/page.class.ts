import { SectionClass } from './section.class';

export class PageClass
{
        page_id:number;
        page_guid:string;
        page_name:string;
        page_description:string;
        page_status:boolean;
        sections:SectionClass[]=[];        
}