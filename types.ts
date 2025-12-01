export interface JobItem {
    sku: string;
    name: string;
    qty: number;
    rate: number;
}

export interface QuoteTotals {
    subtotal: number;
    gst: number;
    total: number;
}