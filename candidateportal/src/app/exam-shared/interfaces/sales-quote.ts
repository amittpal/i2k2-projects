export interface ISalesQuote {
  id: number | string;
  type: string;
  settings: ISalesQuoteSettings;
  data: ISalesQuoteData;
}

export interface ISalesQuoteSettings {
  view_type: string;
  type: string;
  min_lineitems: number | string;
  show_tax: boolean;
  show_subtotal: boolean;
}

export interface ISalesQuoteData {
  customer_info: any;
  order_info: any;
  tech_info: any;
  show_tax: boolean;
  show_subtotal: boolean;
  quote_num: string;
  quote_id: number | string;
  quote_type_id: string;
  create_date: string | Date;
  expire_date: string | Date;
  approval_status: boolean;
  invoice_number: string | Date;
  invoice_id: number | string;
  invoice_date: string | Date;
  due_date: string | Date;
  discount_type_id: number | string;
  discount_value: number | string;
  tax_id: number | string;
  lineitems: Array<ISalesQuoteRow>;
}

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
}

