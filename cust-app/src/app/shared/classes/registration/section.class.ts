import { ComponentClass } from './component.class';
import { GridsterItem } from 'angular-gridster2';

export class SectionClass
{
    section_id:number;
    section_guid:string;
    section_name:string;
    section_description:string;
    section_code:string
    section_visibility:number;
    section_css_class:string;
    comps:GridsterItem[]=[];    
}