interface Assembly {
    uuid: string
    number: string
    name: string
    projectCode: string
    partList: Part[];
    operationList: Operation[];
    stockList: Stock[];
    createdAt: Date | null;
    updatedAt: Date | null;

}