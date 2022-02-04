import PdfPrinter from "pdfmake";
import { convertImageURL } from "./convertImgUri.js";

// convert html into pdfmake text doesnt work in all situations like bullets and list
import htmlToPdfmake from "html-to-pdfmake";
import jsdom from "jsdom";

// need to pass the window
const { JSDOM } = jsdom;
const { window } = new JSDOM("");

export const createPDFReadableStream = async pdfData => {
  try {
    const fonts = {
      Roboto: {
        normal: "Helvetica",
        bold: "Helvetica-Bold",
        italics: "Helvetica-Oblique",
        bolditalics: "Helvetica-BoldOblique",
      },
    };

    const printer = new PdfPrinter(fonts);
    let encondedImage = await convertImageURL(pdfData.Poster);

    const docDefinition = {
      pageSize: "A4",
      pageMargins: [40, 60, 40, 60],
      // header : `${pdfData.title}`, just playing around
      content: [
        {
          //styling
          text: `${pdfData.Title}${" "} ${pdfData.Year} ${" "} ${pdfData.Type}`,
          alignment: "center",
          // margin: [left, top, right, bottom]
          margin: [0, 0, 0, 24],
          fontSize: 24,
          bold: true,
        },
        {
          image: encondedImage,
          fit: [515, 900],
        },
      ],
    };
    const options = {};
    const pdfReadableStream = printer.createPdfKitDocument(
      docDefinition,
      options
    );

    pdfReadableStream.end();
    return pdfReadableStream;
  } catch (error) {
    console.log(error);
  }
};
