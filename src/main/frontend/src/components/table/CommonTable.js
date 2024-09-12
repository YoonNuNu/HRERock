import React from 'react';
import './CommonTable.css';



const CommonTable = (props) => {
    const { headersName, children } = props;

    // 스타일을 결정하는 함수
    const getHeaderClassName = (item) => {
        if (item === 'input') {
            return 'Notice_Input_Css';
        }
        switch (item) {
            case '글번호':
                return 'Noitec_Number_Css';
            case '제목':
                return 'Noitec_Title_Css';
            case '등록일':
                return 'Noitec_Date_Css';
            case '조회수':
                return 'Noitec_viewCount_Css';

        }
    };

    return (
        <table className="common-table">
            <thead>
            <tr>
                {headersName.map((item, index) => (
                    <td className={`common-table-header-column ${getHeaderClassName(item)}`} key={index}>
                        {item === 'input' ? <input type="checkbox" /> : item}
                    </td>
                ))}
            </tr>
            </thead>
            <tbody>
            {children}
            </tbody>
        </table>
    );
};

export default CommonTable;