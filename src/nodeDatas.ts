export const nodeProps =[
    {
        "width": 500,
        "height": 214,
        "group": "trigger",
        "shape": "AutoNode",
        "type": "trigger_data",
        "label": "数据变化触发器",
        "description": "当选择的表单发生数据变更时，触发此流程",
        "outputTypes": [

        ],
        "inputTypes": [
            {
                "id": "source_table",
                "component_name": "",
                "label": "表单名称",
                "column_type": "FormTable",
                "required": true,
                "children": null,
                "setter": {
                    "name": "FormTableSetter",
                    "props": null
                },
                "is_point": false
            }
        ]
    },
    {
        "width": 700,
        "height": 342,
        "group": "condition",
        "shape": "AutoNode",
        "type": "condition_base",
        "label": "条件设置器",
        "description": "从选择的表单中，增加字段数据判断，输出判断结果，根据判断结果选择分支节点进行下一步操作",
        "outputTypes": [
            {
                "id": "success",
                "component_name": "",
                "label": "成功",
                "column_type": "Bool",
                "required": true,
                "children": [

                ],
                "setter": null,
                "is_point": true
            },
            {
                "id": "fail",
                "component_name": "",
                "label": "失败",
                "column_type": "Bool",
                "required": true,
                "children": [

                ],
                "setter": null,
                "is_point": true
            }
        ],
        "inputTypes": [
            {
                "id": "condition",
                "component_name": "",
                "label": "条件",
                "column_type": "Array\u003cObject\u003e",
                "required": true,
                "children": null,
                "setter": {
                    "name": "StringSetter",
                    "props": null
                },
                "is_point": false
            }
        ]
    },
    {
        "width": 700,
        "height": 278,
        "group": "data",
        "shape": "AutoNode",
        "type": "data_new",
        "label": "新增数据",
        "description": "将节点引用的数据或者输入数据添加到新表",
        "outputTypes": [

        ],
        "inputTypes": [
            {
                "id": "target_table",
                "component_name": "",
                "label": "目标表单",
                "column_type": "FormTable",
                "required": false,
                "children": null,
                "setter": {
                    "name": "FormTableSetter",
                    "props": null
                },
                "is_point": false
            },
            {
                "id": "column_map",
                "component_name": "",
                "label": "字段对应关系",
                "column_type": "ColumnMap",
                "required": false,
                "children": null,
                "setter": {
                    "name": "ColumnMapSetter",
                    "props": null
                },
                "is_point": false
            }
        ]
    },
    {
        "width": 500,
        "height": 0,
        "group": "test",
        "shape": "AutoNode",
        "type": "test_print",
        "label": "打印节点",
        "description": "测试用节点",
        "outputTypes": [

        ],
        "inputTypes": [

        ]
    }
]