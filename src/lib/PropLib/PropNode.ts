
//=========================================================
import type { NodeBase, NodeProp } from "../TreeLib/TreeNode";
import { newProp } from "../TreeLib/TreeNode";

//=========================================================
//=========================================================
export interface NodePropGroup extends NodeProp {
    kind: "group";
    name: string;
    expanded: boolean;
}

//=========================================================
//=========================================================
export interface Option {
    name: string,
    value: any
}

export interface NodePropSelect extends NodeProp {
    kind: "select";
    name: string;
    options: Option[];
    getValue() : any;
    onValue(value: any) : void;
}

//=========================================================
//=========================================================
export interface InputArgs {
    type: "text" | "password" | "email" | "number" | "color" |
          "checkbox" | "radio" | "range" | 
          "time" | "date" | "month" | "week" | "url";
          /* "file" | "image" | "button" */
    name?: string;
    min?: string | number;
    max?: string | number;
    step?: number;
    checked?: boolean;
    readonly?: boolean;
}

export interface NodePropInput extends NodeProp {
    kind: "input";
    name: string;
    args: InputArgs;
    getValue() : any;
    onValue(value: any) : void;
}

//=========================================================
//=========================================================
export function newPropGroup(
    parent: NodeBase | null, 
    name: string, 
    expanded?: boolean, 
    props?: NodeProp[]) : NodePropGroup
{
    let nd : NodePropGroup = newProp(parent, "group", props) as NodePropGroup;
    nd.name = name;
    nd.expanded = typeof expanded === "boolean" ? expanded : true; 
    return nd;
} 

//=========================================================
//=========================================================
export function newPropSelect(
    parent: NodeBase | null, 
    name: string,
    options: Option[],
    getValue: () => any,
    onValue: (val: any) => void
) : NodePropSelect
{
    let nd: NodePropSelect = newProp(parent, "select") as NodePropSelect;
    nd.name = name;
    nd.options = options;
    nd.getValue = getValue;
    nd.onValue = onValue;
    return nd;
}

//=========================================================
//=========================================================
export function newPropInput(
    parent: NodeBase | null, 
    name: string,
    args: InputArgs,
    getValue: () => any,
    onValue: (val: any) => void
) : NodePropInput
{
    let nd: NodePropInput = newProp(parent, "input") as NodePropInput;
    nd.name = name;
    nd.args = args;
    nd.getValue = getValue;
    nd.onValue = onValue;
    return nd;
}

//=========================================================
//=========================================================