import React, { useRef, useState, useEffect } from "react";
import { BiCheck } from "react-icons/bi";
import "./styles.css";
import useCheckGroup from "./useCheckGroup";


const AdminApp = () => {
    return (

            <h1>Grid Table</h1>
            <h2>
                Handling the check state as a Set
                <a
                    href="https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Set"
                    target="_blank"
                    rel="noreferrer"
                >
                </a>
            </h2>
            <GridTable />

    );
};
export default AdminApp;



//GridTable
const GridTable = () => {
    const [rows, setRows] = useState([]);
    const uniqueId = useRef(0);
    const {
        checkedSet,
        addToSet,
        deleteToSet,
        clearSet,
        replaceSet
    } = useCheckGroup();

    const [allChecked, setAllChecked] = useState(false);
    useEffect(() => {
        if (rows.length === 0) {
            setAllChecked(false);
            return;
        }
        if (checkedSet.size === rows.length) setAllChecked(true);
        else setAllChecked(false);
    }, [rows, checkedSet]);
    const allCheck = (checked) => {
        setAllChecked(checked);
        if (checked) {
            const ids = rows.map((row) => row.id);
            replaceSet(ids);
            return;
        }
        clearSet();
    };

    const onCheckHandler = (checked, id) => {
        if (checked) {
            addToSet(id);
            return;
        }
        deleteToSet(id);
    };

    const addRow = () => {
        const id = uniqueId.current++;
        const newRowData = { id: id, name: "joker" + id };
        setRows([...rows, newRowData]);
    };
    const deleteRow = () => {
        const newRows = rows.filter((row) => !checkedSet.has(row.id));
        clearSet();
        setRows(newRows);
    };


    // HTML
    return (
        <>
            <button className="rowControlBtn" onClick={addRow}>
                add row
            </button>
            <button className="rowControlBtn" onClick={deleteRow}>
                delete row
            </button>
            <span>selected rows: {checkedSet.size}</span>
            <div className="container">
                <div className="grid">
                    <div className="header">
                        <CheckBox id="allCheck" onCheck={allCheck} checked={allChecked} />
                        {/* <CheckBox id="allCheck" /> */}
                    </div>
                    <div className="header">id</div>
                    <div className="header">name</div>
                </div>
                {rows.map((data) => (
                    <Row
                        key={data.id}
                        rowId={data.id}
                        name={data.name}
                        checked={checkedSet.has(data.id)}
                        onCheckHandler={onCheckHandler}
                    />
                ))}
            </div>
        </>
    );
};



//Row
const Row = ({ rowId, name, onCheckHandler, checked }) => {
    return (
        <div key={`row${rowId}`} className="grid row">
            <div className="cell">
                <CheckBox id={rowId} onCheck={onCheckHandler} checked={checked} />
            </div>
            <div className="cell">{rowId}</div>
            <div className="cell">{name}</div>
        </div>
    );
};




// CheckBox
const CheckBox = ({ id, onCheck, checked }) => {
    const [_checked, setChecked] = useState(false);

    useEffect(() => {
        setChecked(checked);
    }, [checked]);
    const toggleCheck = () => {
        setChecked(!_checked);
        onCheck && onCheck(!_checked, id);
    };

    return (
        <div
            className="checkBox"
            style={{
                backgroundColor: _checked ? "#546A78" : "#ffffff",
                borderWidth: 1,
                border: "1px solid #546A78"
            }}
            onClick={toggleCheck}
        >
            {_checked && <BiCheck size={14} color="#fff" />}
        </div>
    );
};
