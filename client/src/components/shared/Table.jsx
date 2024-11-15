import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
const Table = ({ rows, columns, heading, rowHeight = 52 }) => {
    return (
        <div className='h-full bg-white'>
            <div className='py-4 text-xs md:px-16 h-fit'>
                <h4 className='uppercase text-center text-sm py-4 '>{heading}</h4>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSizeOptions={[5, 10]}
                    rowHeight={rowHeight}
                    sx={{ border: 0 ,
                        ".table-header":{
                            backgroundColor: "black",
                            color:"#fff",
                            textTransform: "capitalize",
                            textAlign: "center",
                            
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default Table;
