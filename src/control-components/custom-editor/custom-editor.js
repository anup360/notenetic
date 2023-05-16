import React,{useState} from 'react';
import { Editor, EditorTools, EditorUtils } from "@progress/kendo-react-editor";

const Customeditor=(props)=>{
    const editor = React.createRef();
    const [bodyHtml, setBodyHtml] = useState("");
    const [body, setBody] = useState("");
    const {
        Bold,
        Italic,
        Underline,
        AlignLeft,
        AlignRight,
        AlignCenter,
        Indent,
        Outdent,
        OrderedList,
        UnorderedList,
        Undo,
        Redo,
        Link,
        Unlink,
    }= EditorTools;

    function onBodyChange(props) {
        
        setBody(props.value.textContent)
        setBodyHtml(props.html)
    }
    return(
        <Editor
                ref={editor}
                value={bodyHtml}
                onChange={onBodyChange}
                tools={[
                    [Bold, Italic, Underline],
                    [Undo, Redo],
                    [Link, Unlink],
                    [AlignLeft, AlignCenter, AlignRight],
                    [OrderedList, UnorderedList, Indent, Outdent],
                ]}
                contentStyle={{
                    height: 320,
                }}
                defaultContent={""}
            />
    )
}

export default Customeditor
