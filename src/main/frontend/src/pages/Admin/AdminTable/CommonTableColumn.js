import React from 'react';

const CommonTableColumn = ({ className,  style, children }) => {
    return (
        <td className={`common-table-column ${className}` } style={style} >
            {
                children
            }
        </td>
    )
}

export default CommonTableColumn;
