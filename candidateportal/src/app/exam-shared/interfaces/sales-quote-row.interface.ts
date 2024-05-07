export interface ISalesQuoteRow {
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
}
