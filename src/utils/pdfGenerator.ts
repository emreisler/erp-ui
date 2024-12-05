import jsPDF from "jspdf";
import JsBarcode from "jsbarcode";

export const generateProductionOrderPDF = async (
    productionOrder: ProductionOrder,
    fetchPartDetails: (partNumber: string) => Promise<Part>
) => {
    const doc = new jsPDF();

    // Fetch part details
    const partDetails = await fetchPartDetails(productionOrder.partNumber);

    // Add Title
    doc.setFontSize(18);
    doc.text("Production Order Details", 10, 10);

    // Add Barcode
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, productionOrder.code, {format: "CODE128"});
    const barcodeImage = canvas.toDataURL("image/png");

    doc.addImage(barcodeImage, "PNG", 10, 20, 80, 20);

    // Add Production Order Details
    doc.setFontSize(12);
    doc.text(`Order Code: ${productionOrder.code}`, 10, 50);
    doc.text(`Part Number: ${productionOrder.partNumber}`, 10, 60);
    doc.text(`Quantity: ${productionOrder.quantity}`, 10, 70);
    doc.text(`Status: ${productionOrder.status}`, 10, 80);
    doc.text(`Current Step: ${productionOrder.currentStep}`, 10, 90);
    doc.text(`Total Steps: ${productionOrder.totalStep}`, 10, 100);
    doc.text(`Current Task Center: ${productionOrder.currentTaskCenter}`, 10, 110);

    // Add Part Details
    doc.text(`Part Name: ${partDetails.name}`, 10, 120);
    doc.text(`Project Code: ${partDetails.projectCode}`, 10, 130);
    doc.text(`Category: ${partDetails.category}`, 10, 140);

    // Add Operations Table
    let startY = 150;
    doc.setFontSize(14);
    doc.text("Operations", 10, startY);
    startY += 10;

    partDetails.operationList.forEach((operation, index) => {
        doc.setFontSize(12);
        doc.text(`Step ${operation.sepNumber}: ${operation.taskCenterNo}`, 10, startY);
        startY += 8;
        doc.setFont("times", "italic");
        doc.text(`  - ${operation.description}`, 10, startY);
        startY += 8;
        doc.setFont("times", "normal");
    });

    // Save the PDF
    doc.save(`Production_Order_${productionOrder.code}.pdf`);
};