import { Injectable } from "@angular/core";
// import { ISalesQuoteRow } from '../interfaces/sales-quote-row.interface';
//@Injectable()
export class SectionsRowClass {
  line_num: number | string;
  difficulty_level_guid: string | number;
  difficulty_levels: string | number;
  name: string | number;
  subject_guid: string | number;
  duration_uom_guid: string | number;
  duration: number | string;
  duration_um: string | number;
  line_no: number | string;
  number_of_questions: string | number;
  status: string;
  isReadonly: boolean;
  constructor(lineNum: number | string, name?: any) {
    // console.log(data);
    this.line_num = lineNum || "";
    this.difficulty_level_guid = "";
    this.difficulty_levels = "";
    this.name = name || "";
    this.subject_guid = "";
    this.duration_uom_guid = "";
    this.duration = "";
    this.duration_um = "";
    this.line_no = "";
    this.status = "true";
    this.number_of_questions = ""; //  0 ||
    this.isReadonly = false;
  }
}
