import { useState } from "react";

const useCheckGroup = () => {
    const [checkedSet, setCheckedSet] = useState(new Set());
    const addToSet = (item) =>
        setCheckedSet((prev) => {
            const set = new Set(prev);
            set.add(item);
            return set;
        });
    const deleteToSet = (item) =>
        setCheckedSet((prev) => {
            const set = new Set(prev);
            set.delete(item);
            return set;
        });
    const clearSet = () => {
        setCheckedSet(new Set());
    };
    const replaceSet = (items) => {
        setCheckedSet(new Set(items));
    };

    return {
        checkedSet,
        addToSet,
        deleteToSet,
        clearSet,
        replaceSet
    };
};

export default useCheckGroup;
