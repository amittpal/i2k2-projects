import { Injectable } from '@angular/core';
import { ISalesQuoteRow } from './../interfaces/sales-quote-row.interface';
//@Injectable()
export class SalesQuoteRowClass implements ISalesQuoteRow {
  line_num: number | string;
  product_id: number | string;
  product_type_id: number | string;
  product_category_id: number | string;
  product_sub_category_id: number | string;
  product_type: string;
  product_category: string;
  product_sub_category: string;
  product_desc: string;
  units: number | string;
  amount: number | string;
  total_amount: number | string;
  is_taxable: number | string;
  tax_amount: number | string;
  tax_rate: number | string;
  hsc_code: number | string;

  constructor(lineNum: number | string) {
    this.line_num = lineNum || '';
    this.product_id = 0;
    this.product_type_id = 0;
    this.product_category_id = 0;
    this.product_sub_category_id = 0;
    this.product_type = '';
    this.product_category = '';
    this.product_sub_category = '';
    this.product_desc = '';
    this.units = '';  //  0 ||
    this.amount = ''; //  0.00 ||
    this.total_amount = ''; //  0.00 ||
    this.is_taxable = '0'; //  0 ||
    this.tax_amount = ''; //  0.00 ||
    this.tax_rate = '0';
    this.hsc_code = '';
  }
}
