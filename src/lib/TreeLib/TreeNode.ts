
//=========================================================
import {  v4 as uuidv4 } from '@lukeed/uuid';

//=========================================================
// NodeType
export enum NodeType {
    ROOT  = 2,
    FIELD = 3,
    FILE  = 4,
    PROP  = 5
}

// NodeBase
export interface NodeBase {
    nid: string;
    type: NodeType;
    parent: NodeBase | null;
    visible: boolean | string;
    getIcon?: () => string;
    getMenu?: () => MenuItem[] | null;
    onCommand?: (cmd: string) => void;
    onIconClick?: () => void;
    onDClick?: () => void;
}

// NodeProp
export interface NodeProp extends NodeBase {
    type: NodeType.PROP;
    kind: string;
    props: NodeProp[];
    update?() : void;
}

// NodeField
export interface NodeField extends NodeBase {
    type: NodeType.FIELD;
    name: string;
    kind: string;
    prop?: NodeProp;
    files: NodeFile[];
    childs: NodeField[];
    expanded: boolean;
}

// NodeFile
export interface NodeFile extends NodeBase {
    type: NodeType.FILE;
    name: string;
    kind: string;
    prop?: NodeProp;
    edit?: any;
}

// NodeRoot
export interface NodeRoot extends NodeBase {
    type: NodeType.ROOT;
    prop?: NodeProp;
    files: NodeFile[];
    childs: NodeField[];

    getItemIcon(item: NodeBase | null) : string;
    getItemMenu(item: NodeBase | null) : MenuItem[] | null;
}

export interface MenuItem {
    icon?: string,
    text: string,
    cmd?: string
}

//=========================================================
//=========================================================
function newNode(type: NodeType) : NodeBase {
    let nd : NodeBase = {
        nid: uuidv4(),
        type: type,
        parent: null,
        visible: true
    }
    return nd;
}

export function newProp(
    parent: NodeBase|null,  
    kind: string, 
    props?: NodeProp[]
) : NodeProp {
    if(!props) {
        props = [];
    }
    let nd: NodeProp = newNode(NodeType.PROP) as NodeProp;
    nd.kind = kind;
    nd.props = props;
    if(parent) {
        addItem(parent, nd);
    }
    props.forEach((prop) => {
        prop.parent = nd; 
    });
    return nd;
}

export function newFile(
    parent: NodeBase|null, 
    name: string, 
    kind: string
) : NodeFile {
    let nd : NodeFile = newNode(NodeType.FILE) as NodeFile;
    nd.name = name;
    nd.kind = kind;
    nd.prop = newProp(null, "");
    nd.prop.parent = nd;
    nd.prop.update = () => { 
        (nd.prop as NodeProp).props.forEach((prop) => {
            if(typeof prop.update === "function") {
                prop.update();
            }
        }
    )}
    if(parent) {
        addItem(parent, nd);
    }
    return nd;
}

export function newField(
    parent: NodeBase|null, 
    name: string, 
    kind: string,
    childs?: NodeField[],
    files?: NodeFile[]
) : NodeField {
    if(!childs) { 
        childs = [];
    }
    if(!files) { 
        files  = [];
    }
    let nd : NodeField = newNode(NodeType.FIELD) as NodeField;
    nd.name = name;
    nd.kind = kind;
    nd.childs = childs;
    nd.files = files;
    nd.expanded = true;
    nd.prop = newProp(null, "");
    nd.prop.parent = nd;
    nd.prop.update = () => { 
        (nd.prop as NodeProp).props.forEach((prop) => {
            if(typeof prop.update === "function") {
                prop.update();
            }
        }
    )}
    childs.forEach((child) => { child.parent = nd; });
    files.forEach((file) => { file.parent = nd; });
    if(parent) { 
        addItem(parent, nd);
    }
    return nd;
}

export function newRoot(
    childs?: NodeField[],
    files?: NodeFile[]
) : NodeRoot {
    if(!childs) { 
        childs = [];
    }
    if(!files) { 
        files  = [];
    }
    let nd: NodeRoot = newNode(NodeType.ROOT) as NodeRoot;
    nd.childs = childs;
    nd.files = files;
    nd.prop = newProp(null, "");
    nd.prop.parent = nd;
    nd.prop.update = () => { 
        (nd.prop as NodeProp).props.forEach((prop) => {
            if(typeof prop.update === "function") {
                prop.update();
            }
        }
    )}
    childs.forEach((child) => { child.parent = nd; });
    files.forEach((file) => { file.parent = nd; });

    nd.getItemIcon = (item: NodeBase) => {
        let icon = "";
        switch(item.type) {
            case NodeType.FILE: 
                icon = "description";
                break;
            case NodeType.FIELD:
                icon = (item as NodeField).expanded ? "folder_open" : "folder";
                break;
        }
        return icon;
    }

    nd.getItemMenu = (item: NodeBase) => {
        return null;
    }

    return nd;
}

//=========================================================
//=========================================================
export function setParent(item: NodeBase, parent: NodeBase) : void {
    if(item && item.parent !== parent) {
        if(item.parent) { 
            removeItem(item.parent, item); 
        }
        if(parent) {
            addItem(parent, item);
        }
    }
}

export function addItem(parent: NodeBase, item: NodeBase) : void
{
    if(parent && item) {
        switch(parent.type) {
            case NodeType.FILE:
            item.parent = parent;
            break;

            case NodeType.PROP:
                if(parent !== item.parent) {
                    if(item.type === NodeType.PROP) {
                        if(item.parent) {
                            removeItem(item.parent, item);
                        }
                        (parent as NodeProp).props.push(item as NodeProp);
                        item.parent = parent;
                    }
                }
            break;

            case NodeType.FIELD:
            if(parent !== item.parent) {
                if(item.parent) {
                    removeItem(item.parent, item);
                }
                if(item.type === NodeType.PROP) {
                    item.parent = parent;
                    (parent as NodeField).prop = item as NodeProp;
                }
                else if(item.type === NodeType.FIELD) {
                    (parent as NodeField).childs.push(item as NodeField);    
                    item.parent = parent;
                }
                else if(item.type === NodeType.FILE) {
                    (parent as NodeField).files.push(item as NodeFile);
                    item.parent = parent;
                }
            }
            break;

            case NodeType.ROOT:
            if(parent !== item.parent) {
                if(item.parent) {
                    removeItem(item.parent, item);
                }
                if(item.type === NodeType.FIELD) {
                    (parent as NodeRoot).childs.push(item as NodeField);
                    item.parent = parent;
                }
                else if(item.type === NodeType.FILE) {
                    (parent as NodeRoot).files.push(item as NodeFile);
                    item.parent = parent;
                }
                else if(item.type === NodeType.PROP) {
                    item.parent = parent;
                    (parent as NodeRoot).prop = item as NodeProp;
                }
            }
            break;
        }
    }
}

//=========================================================
export function removeItem(parent: NodeBase, item: NodeBase) : void
{
    if(parent && item) {
        switch(parent.type) {
            case NodeType.FILE:
            if(item.parent === parent) {
                item.parent = null;
                (parent as NodeFile).prop = undefined;
            }
            break;

            case NodeType.PROP:
            if(item.type === NodeType.PROP) {
                if((parent as NodeProp).props.splice((parent as NodeProp).props.indexOf(item as NodeProp), 1).length > 0) {
                    item.parent = null;
                }
            }
            break;

            case NodeType.FIELD:
            if(parent === item.parent) {
                if(item.type === NodeType.PROP) {
                    item.parent = null;
                    (parent as NodeField).prop = undefined;
                }
                else if(item.type === NodeType.FIELD) {
                    if((parent as NodeField).childs.splice((parent as NodeField).childs.indexOf(item as NodeField), 1).length > 0) {
                        item.parent = null;
                    }
                }
                else if(item.type === NodeType.FILE) {
                    if((parent as NodeField).files.splice((parent as NodeField).files.indexOf(item as NodeFile), 1).length > 0) {
                        item.parent = null;
                    }
                }
            }
            break;

            case NodeType.ROOT:
            if(parent === item.parent) {
                if(item.type === NodeType.FIELD) {
                    if((parent as NodeRoot).childs.splice((parent as NodeRoot).childs.indexOf(item as NodeField), 1).length > 0) {
                        item.parent = null;
                    }
                }
                else if(item.type === NodeType.FILE) {
                    if((parent as NodeRoot).files.splice((parent as NodeRoot).files.indexOf(item as NodeFile), 1).length > 0) {
                        item.parent = null;
                    }
                }
                else if(item.type === NodeType.PROP) {
                    item.parent = null;
                    (parent as NodeRoot).prop = undefined;
                }
            }
            break;
        }
    }
}

//=========================================================
//=========================================================