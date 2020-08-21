
import React from 'react';
import DataTable from 'react-data-table-component';
import ExportReactCSV from './ExportReactCSV'
import BootstrapTable from 'react-bootstrap-table-next';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';




const TableComponent = props => {
    console.log( "Table ROWS-->" , props.tableRows )
    if( props.tableRows.length >0  ){
        const tableRowObject = props.tableRows[0];
       const columns = Object.keys( tableRowObject ).map( header => {
            if( header ==='index'){
                return(  
                    
                    {dataField: header, text: header, sort: true    }
            )                 
            } else
            return(  
                    {dataField: header, text: header,   filter: textFilter(), sort:true    }
            );
        });
        console.log( 'tableHeader -->', columns );
        return(
                <div>
                    <ExportReactCSV csvData={props.tableRows} fileName="export_me.csv"/>
                    <BootstrapTable bodyClasses="foo" keyField="index" data={ props.tableRows } columns={ columns } filter={ filterFactory() }
                        filterPosition="top" />
                  </div>
            );

     
    }
   return(<div> No Compare Data Found</div>)
            
  };

export default TableComponent;