interface Assembly {
    uuid: string
    number: string
    name: string
    projectCode: string
    attachedParts: AttachPartModalState[];
    operationList: Operation[];
    stockList: AttachedStockModalState[];
    createdAt: Date | null;
    updatedAt: Date | null;

}

interface AttachPartModalState {
    partNumber: string
    quantity: number
}

interface AttachedStockModalState {
    code: string
    name: string
    quantity: number
}