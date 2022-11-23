
<script>
    import AceEditor from "./AceEditor.svelte"

    let text = "";
    let options = {
        //fontFamily: 'Inconsolate',
        fontSize: '12pt',
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true
    };

</script>

<AceEditor 
    on:selectionChange={(obj) => console.log(obj.detail)}
    on:paste={(obj) => console.log(obj.detail)}
    on:input={(obj) => console.log(obj.detail)}
    on:focus={() => console.log('focus')}
    on:documentChange={(obj) => console.log(`document change : ${obj.detail}`)}
    on:cut={() => console.log('cut')}
    on:cursorChange={() => console.log('cursor change')}
    on:copy={() => console.log('copy')}
    on:init={(editor) => console.log(editor.detail)}
    on:commandKey={(obj) => console.log(obj.detail)}
    on:changeMode={(obj) => console.log(`change mode : ${obj.detail}`)}
    on:blur={() => console.log('blur')}
    width='100%'
    height='300px'
    lang="pegjs"
    theme="one_dark"
    value={text} 
    options= {options}
/>