interface ProductionOrder {
    orderId: string;
    code: string;
    partNumber: string;
    quantity: number;
    status: string; // Enum values: created, in_progress, on_hold, cancelled, completed
    currentStep: number;
    totalStep: number;
    currentTaskCenter: number;
    endDate : string;
}