// 2)필요한 상수 생성하기
const spreadSheetContainer = document.querySelector("#spreadsheet-container");
const exportBtn = document.querySelector("#export-btn"); // 19) 엑셀시트 export 기능 생성하기
const ROWS = 10;
const COLS = 10;
const spreadsheet = [];
const alphabets = [
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
]

// 4) 문자열이 아닌 객체 데이터 생성하기
class Cell {
    constructor(isHeader, disabled, data, row, column, rowName, columnName, active = false) {
        //// 14) rowName, columnName 생성
        this.isHeader = isHeader;
        this.disabled = disabled;
        this.data = data;
        this.row = row;
        this.column = column;
        this.rowName = rowName;
        this.columnName = columnName;
        this.active = active;
    }
}

// 19) 엑셀시트 export 기능 생성하기
exportBtn.onclick = function (e) {
    // 20) 엑셀 데이터 생성
    let csv = ""; 
    for (let i = 0; i < spreadsheet.length; i++) {
        if (i === 0) continue;
        csv +=
            spreadsheet[i]
                .filter(item => !item.isHeader)
                .map(item => item.data)
                .join(',') + "\r\n";
    }

    console.log(csv); // 20) 엑셀 데이터 생성
    //console.log(spreadsheet); // 지워주기 <= 20) 엑셀 데이터 생성
    
    // 21) 엑셀 파일 다운로드
    const csvObj = new Blob([csv]);
    console.log('csvObj', csvObj); // 내용빠짐

    const csvUrl = URL.createObjectURL(csvObj);
    console.log('csvObj', csvObj);

    const a = document.createElement("a");
    a.href = csvUrl;
    a.download = "Spreadsheet File Name.csv";
    a.click();
}

// 3) 기본 데이터 생성하기
// = 현재는 텍스트가 들어있지만 각 자리에 객체 형식으로 각각의 자리에 대한 정보를 넣어줍니다.
initSpreadsheet();

function initSpreadsheet() {
    for (let i = 0; i < ROWS; i++) {
        let spreadsheetRow = [];
        for (let j = 0; j < COLS; j++) {
            // => const cellData = i + "-" + j; // 8)Cell 스타일 생성하기<= 다음과 같이 변경
            let cellData = ''; // 9) 첫 번째 컬럼에 숫자 넣기
            let isHeader = false;   // 12) Header 생성
            let disabled = false; // 13) Disabled 추가하기.
            
            if (j === 0) { // 9) 모든 row 첫 번째 칼럼에 숫자 넣기
                cellData = i;
                isHeader = true; // 12) Header 생성 : 첫 번째 row는 header!!
                disabled = false; // 13) Disabled 추가하기.
            }
            
            if (i === 0) { 
                //cellData = j; // 10) 첫 번째 Row의 컬럼들에 숫자 넣기
                cellData = alphabets[j - 1]; // 11) 첫 번째 Row의 숫자들을 알파벳으로 변경하기.
                isHeader = true; // 12) Header 생성 : 첫 번째 column는 header!!
                disabled = false; // 13) Disabled 추가하기.
            }
            
            
            // if (cellData <= 0) { // 9) 첫 번째 row의 칼럼은 ";"           
            if (!cellData) {   // 11) cellData가 undefined이면 "";
                cellData = ""; 
            }

            const rowName = i;  // 14) rowName, columnName 생성
            const columnName = alphabets[j - 1];  // 14) rowName, columnName 생성

            const cell = new Cell(isHeader, disabled, cellData, i, j, rowName, columnName, false); 
            // 14) rowName, columnName 생성
            // 13) Disabled 생성 false 부분을 disabled 부분으로 변경
            // 12) Header 생성 : "false" 부분을 isHeader 부분으로 변경
            // 9) const cell = new Cell(false, false, i + ""  + j, i, j, false); <= 에서 변경해주었음.
            // const cell = new Cell(false, false, i + "-" + j, i, j, false)
            spreadsheetRow.push(cell);
        }
        spreadsheet.push(spreadsheetRow);
    }
    // 6)Cell 렌더링하기 => "drawSheet();" 추가하기
    drawSheet();
    // console.log("spreadsheet", spreadsheet); // <= 지워 준다는 내용을 못찾았음
}

// 5) Cell 생성하기
function createCellEl(cell) {
    const cellEl = document.createElement('input')
    cellEl.className = 'cell';
    cellEl.id = 'cell_' + cell.row + cell.column; // ("_" +) 이부분 지워준다는 말도 못 찾음  
    cellEl.value = cell.data;
    cellEl.disabled = cell.disabled; 

    if ( cell.isHeader) {
        cellEl.classList.add("header");
    }

    cellEl.onclick = () => handleCellClick(cell); // 15) cell 클릭 시 상호작용 하기
    cellEl.onchange = (e) => handleOnChange(e.target.value, cell); // 19) 타이핑 시 텍스트를 Cell 객체의 data 속성 값으로 넣어주기

    return cellEl;
}

// 19) 타이핑 시 텍스트를 Cell 객체의 data 속성 값으로 넣어주기
function handleOnChange(data, cell) {
    cell.data = data;
}

function handleCellClick(cell) { 
    clearHeaderActiveStates(); // 18) 이전의 하이라이트 된 부분 지워주기
    const columnHeader = spreadsheet[0][cell.column]; // 16) column header, row header 객체 데이터
    const rowHeader = spreadsheet[cell.row][0]; // 16) column header, row header 객체 데이터
    const columnHeaderEl = getElFromRowCol(columnHeader.row, columnHeader.column); //(16-1) column header, row header 요소 가져오기
    const rowHeaderEl = getElFromRowCol(rowHeader.row, rowHeader.column); //(16-1) column header, row header 요소 가져오기
    columnHeaderEl.classList.add('active'); // 17) column header, row header 하이라이트 주기
    rowHeaderEl.classList.add('active'); // 17) column header, row header 하이라이트 주기
    document.querySelector("#cell-status").innerHTML = cell.columnName + cell.rowName; // 21) 셀 상태 나타내기

    // console.log("clicked cell", cell); // 15) cell 클릭 시 상호작용 하기
    // console.log("columnHeader", columnHeader); // 16) column header, row header 객체 데이터
    // console.log("rowHeader", rowHeader); // 16) column header, row header 객체 데이터
}

// 18) 이전의 하이라이트 된 부분 지워주기
function clearHeaderActiveStates() { 
    const headers = document.querySelectorAll('.header');

    headers.forEach((header) => {
        header.classList.remove('active');
    })
}


// (16-1) column header, row header 요소 가져오기
function getElFromRowCol(row, col) {
    return document.querySelector("#cell_" + row + col);
}

// 6) Cell 렌더링하기
// function drawSheet() {
//     for (let i = 0; i <spreadsheet.length; i++) {
//         for (let j = 0; j < spreadsheet[i].length; j++) {
//         const cell = spreadsheet[i][j]
//         spreadSheetContainer.append(createCellEl(cell));
//         }    
//     }
// }   

// 7) 10개의 셀을 하나의 row div로 감싸기
function drawSheet() {
    for (let i = 0; i < spreadsheet.length; i++) {
        const rowContainerEl = document.createElement("div");
        rowContainerEl.className = "cell-row";

        for (let j = 0; j < spreadsheet[i].length; j++) {
            const cell = spreadsheet[i][j];
            rowContainerEl.append(createCellEl(cell));
        }
        spreadSheetContainer.append(rowContainerEl);
    }
}
