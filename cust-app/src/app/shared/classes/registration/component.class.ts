import { SettingClass } from './setting.class';
import { DataClass } from './data.class';
import { DataObjectClass } from './data-object.class';
import { ValidationClass } from './validation.class';

export class ComponentClass
{
    comp_id:number;
    comp_guid:string;
    comp_name:string;
    cols:number;
    rows:number;
    x:number;
    y:number;   
    settings:SettingClass;
    data:DataClass;
    data_object:DataObjectClass;
    validations:ValidationClass; 
}