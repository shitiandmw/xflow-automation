interface InputProps {
    value: string;
    onChange: (value: string) => void;
    onChangeOutputTypes: (value: any[]) => void;
}

const StringSetter = ({ value, onChange ,onChangeOutputTypes}: InputProps) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
        testChangeOUtputTypes(e.target.value)
    };
    const testChangeOUtputTypes = (value: any) => {
        const list: any[] = []
        for (let i = 0; i < value.length; i++) {
            list.push( {
                "id": "condition"+ i,
                "component_name": "",
                "label": "测试"+ i,
                "column_type": "demo",
                "required": true,
                "children": null,
                "setter": {
                    "name": "StringSetter",
                    "props": null
                },
                "is_point": false
            })
        }
        typeof onChangeOutputTypes === 'function' && onChangeOutputTypes(list)
    }
    return <div className="x-w-full x-h-7 x-border x-rounded x-overflow-hidden x-bg-gray-100">
        <input type="text" className=" x-border-0 focus:x-outline-none x-w-full x-h-full x-px-2 x-text-gray-700 " value={value} onChange={handleChange} />
    </div>;
};
export { StringSetter }