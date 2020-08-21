
import React from 'react';
import json2csv from 'csvjson-json2csv'


const DownLoadCSV = props => {

  // Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
function convertArrayOfObjectsToCSV(array) {
  let result;

  const columnDelimiter = ',';
  const lineDelimiter = '\n';
  const keys = Object.keys(array[0]);

  result = '';
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  array.forEach(item => {
    let ctr = 0;
    keys.forEach(key => {
      if (ctr > 0) result += columnDelimiter;

      result += item[key];
      
      ctr++;
    });
    result += lineDelimiter;
  });

  return result;
}

// Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
function downloadCSV(array) {
   const link = document.createElement('a');
  let csv = json2csv( props.tableRows);

  if (csv == null) return;

  const filename = 'export.csv';

  if (!csv.match(/^data:text\/csv/i)) {
    csv = `data:text/csv;${csv}`;
  }

  link.setAttribute('href', encodeURI(csv));
  link.setAttribute('download', filename);
  link.click();
}


    console.log( "Table ROWS-->" , props.tableRows )
    if( props.tableRows.length >0  ){
      return(  <button onClick={e => downloadCSV( props.tableRows)}>Export</button>
      );
    }
            
  };

export default DownLoadCSV;