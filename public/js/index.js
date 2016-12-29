$(function () { 
    // var editor = editormd("editormd", {
    //         path: "../lib/" // Autoload modules mode, codemirror, marked... dependents libs path
    //     });

    CKEDITOR.replace('text', {
        toolbarGroups: [
            { name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
		    { name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
		   
		    { name: 'insert' },
		    { name: 'forms' },
		    { name: 'tools' },
		    { name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
		    { name: 'others' },
		    '/',
		    { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		    { name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
		    { name: 'styles' },
		    { name: 'colors' }
            //{ name: 'about' },
            //{ name: 'links'} 有bug
        ],
        extraPlugins: 'markdown'
    });
})