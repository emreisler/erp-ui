interface Material {
    id: number;
    number: string;
    name: string;
    stockCode: string;
    qty: number;
    unit: string;
    partId?: number; // Optional, only relevant when linked to a part
}