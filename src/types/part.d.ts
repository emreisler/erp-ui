interface Part {
    uuid: string;
    number: string;
    projectCode : string;
    category : string;
    name: string;
    operationList: Operation[];
    stocksList: Stock[];
}