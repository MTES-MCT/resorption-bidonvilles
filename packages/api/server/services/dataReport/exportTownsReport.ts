import Excel from 'exceljs';

export default () => {
    const workbook = new Excel.Workbook();
    return workbook.xlsx.writeBuffer();
};
