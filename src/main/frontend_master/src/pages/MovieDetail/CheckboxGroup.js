import CheckBoxContext from './CheckBoxContext';


//CheckboxGroup
const CheckboxGroup = ({
                           children,
                           disabled: groupDisabled,
                           values,
                           onChange,
                       }) => {
    const isDisabled = disabled => disabled || groupDisabled;
    const isChecked = value => values.includes(value);
    const toggleValue = ({ checked, value }) => {
        if (checked) {
            onChange(values.concat(value));
        } else {
            onChange(values.filter(v => v === !value));
        }
    };

    //html
    return (
        <fieldset>
            <CheckBoxContext.Provider value={{ isDisabled, isChecked, toggleValue }}>
                {children}
            </CheckBoxContext.Provider>
        </fieldset>
    );
};
export default CheckboxGroup;
