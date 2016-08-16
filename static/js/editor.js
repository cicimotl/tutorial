$(document).ready(function () {
	var Example = (function() {
		"use strict";
		var elem, hideHandler, that = {};
		that.init = function(options) {
			alert(options.selector);
			elem = $(options.selector);
		};
		that.show = function(text) {
			alert(elem);
			alert(text);
			clearTimeout(hideHandler);
			elem.setValue(text);
			elem.delay(200).fadeIn().delay(4000).fadeOut();
		};
		return that;
	}());

	function destroyClickedElement(event){
		document.body.removeChild(event.target);
	}
	var output = $('#edoutput');
	var outf = function (text) {
		output.text(output.text() + text);
	};
	var jsoutf = function (text) {
		window.js_output.setValue(text);
	}

	var keymap = {
		"Ctrl-Enter" : function (editor) {
			$('#edoutput').text('');
			Sk.configure({output: outf, read: builtinRead});
			Sk.canvas = "mycanvas";
			if (editor.getValue().indexOf('turtle') > -1 ) {
				$('#mycanvas').show()
			}
			Sk.pre = "edoutput";
			(Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'mycanvas';
			try {
				Sk.misceval.asyncToPromise(function() {
				return Sk.importMainWithBody("<stdin>",false,editor.getValue(),true);
			});
			} catch(e) {
				outf(e.toString() + "\n")
			}
		},
		"Shift-Enter": function (editor) {
			Sk.configure({output: outf, read: builtinRead});
			Sk.canvas = "mycanvas";
			Sk.pre = "edoutput";
			if (editor.getValue().indexOf('turtle') > -1 ) {
				$('#mycanvas').show()
			}
			try {
				Sk.misceval.asyncToPromise(function() {
				return Sk.importMainWithBody("<stdin>",false,editor.getValue(),true);
			});
			} catch(e) {
				outf(e.toString() + "\n")
			}
		},
		"F11": function(cm) {
			cm.setOption("fullScreen", !cm.getOption("fullScreen"));
		},
		"Esc": function(cm) {
			if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
		},
		"Ctrl-S": function(editor) {
			var textToSave = editor.getValue();
			var textToSaveAsBlob = new Blob([textToSave], {type:"text/plain"});
			var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
			bootbox.dialog({
				title: "Download Example As...",
				message:
					'<div id="save_pop_out" class="row">  ' +
						'<div class="col-md-12"> ' +
							'<form class="form-horizontal"> ' +
								'<div class="form-group"> ' +
									'<label class="col-md-4 control-label" for="name">File Name:' + 
									'</label> ' +
									'<div class="col-md-4"> ' +
										'<input id="filename" name="name" type="text" placeholder="default_name" class="form-control input-md"> ' +
										'<span class="help-block">Example : file_name' + 
										'</span>' + 
									'</div> ' +
								'</div> ' +
								'<div class="form-group"> ' +
									'<label class="col-md-4 control-label" for="awesomeness">Choose a file extension:' + 
									'</label> ' +
                		 	 	  			'<div class="col-md-4">' + 
										'<div class="radio">' + 
											'<label for="text_ext"> ' +
                    									'<input type="radio" name="extensions" id="text_ext" value=".txt" checked="checked"> Text (.txt) ' + 
											'</label> ' +
                    								'</div>' + 
										'<div class="radio">' + 
											'<label for="python_ext"> ' +
                    									'<input type="radio" name="extensions" id="python_ext" value=".py"> Python (.py) ' + 
											'</label> ' +
                    								'</div> ' + 
									'</div>' +
								'</div>' +
								'<span class="help-block"><p id="file_ext"></p></span>' +
							'</form>' + 
						'</div>' + 
					'</div>',
				buttons: {
					success: {
						label: "Download",
						className: "btn-success",
						callback: function() {
							var ext_choice = $("input[name='extensions']:checked").val();
							var textToSave = editor.getValue();
							var textToSaveAsBlob = new Blob([textToSave], {type:"text/plain"});
							var textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
							var downloadLink = document.createElement("a");
							var fileNameToSaveAs = document.getElementById('filename').value;
							if (fileNameToSaveAs == null) {
								return;
							}
							if (fileNameToSaveAs == '') {
								bootbox.prompt({title: "Cannot save a file without a name. Try Again!", 
									callback: function(result){
										if (result != ''){
											fileNameToSaveAs = result;
                                                                			bootbox.dialog({title: "Saving...",
												message: "Saving file as '" + fileNameToSaveAs + ext_choice + "' ...",
												size: "small"});
                                                                			downloadLink.download = fileNameToSaveAs + ext_choice;
                                                                			downloadLink.innerHTML = "Download File";
                                                               				downloadLink.href = textToSaveAsURL;
                                                                			downloadLink.onclick = destroyClickedElement;
                                                                			downloadLink.style.display = "none";
                                                                			document.body.appendChild(downloadLink);
                                                                			downloadLink.click();
                                                                	               }
										if (result == null){return;}
										if (result == ''){
											fileNameToSaveAs = result;
                                                                			bootbox.dialog({title: "Saving...",
												message: "How about we just save it as 'example" + ext_choice + "', :-P",
												size: "small"});
                                                                			downloadLink.download = "example" + ext_choice;
                                                                			downloadLink.innerHTML = "Download File";
                                                                			downloadLink.href = textToSaveAsURL;
                                                                			downloadLink.onclick = destroyClickedElement;
                                                                			downloadLink.style.display = "none";
                                                                			document.body.appendChild(downloadLink);
                                                                			downloadLink.click();
										}
									}
								});
							}
							if (fileNameToSaveAs != '' && fileNameToSaveAs != null) {
								bootbox.dialog({title: "Saving...",
                                                                	message: "Saving file as '" + fileNameToSaveAs + ext_choice + "' ...",
                                                                	size: "small"});
								downloadLink.download = fileNameToSaveAs + ext_choice;
								downloadLink.innerHTML = "Download File";
								downloadLink.href = textToSaveAsURL;
								downloadLink.onclick = destroyClickedElement;
								downloadLink.style.display = "none";
								document.body.appendChild(downloadLink);
								downloadLink.click();
							}
						}
					}
				}
			});
		}
	};


    var editor = CodeMirror.fromTextArea(document.getElementById('code'), {
        parserfile: ["parsepython.js"],
        autofocus: true,
        theme: "solarized dark",
        //path: "static/env/codemirror/js/",
        styleActiveLine: true,
        lineNumbers: true,
        textWrapping: false,
        indentUnit: 4,
        height: "160px",
        fontSize: "9pt",
        autoMatchParens: false,
        extraKeys: keymap,     
        parserConfig: {'pythonVersion': 2, 'strictErrors': true},
    	autoCloseBrackets: true,
	matchBrackets: true,
	styleActiveLine: true,
	scrollbarStyle: "simple",
	highlightSelectionMatches: {showToken: /\w/, annotateScrollbar: true},
	annotateScrollbar: true
    });

    var editor2 = CodeMirror.fromTextArea(document.getElementById('code2'), {
        parserfile: ["parsepython.js"],
        autofocus: true,
        theme: "solarized dark",
        //path: "static/env/codemirror/js/",
        styleActiveLine: true,
        lineNumbers: true,
        textWrapping: false,
        indentUnit: 4,
        fontSize: "9pt",
        autoMatchParens: false,
        extraKeys: keymap,
        parserConfig: {'pythonVersion': 2, 'strictErrors': true},
        autoCloseBrackets: true,
        matchBrackets: true,
        styleActiveLine: true
    });
    
    var js_output = CodeMirror.fromTextArea(document.getElementById('codeoutput'), {
	parserfile: ["parsepython.js"],
        autofocus: true,
        theme: "solarized dark",
        //path: "static/env/codemirror/js/",
        styleActiveLine: true,
        lineNumbers: true,
        textWrapping: false,
        indentUnit: 4,
	height: "160px",
        fontSize: "9pt",
        autoMatchParens: false,
        extraKeys: keymap,
        parserConfig: {'pythonVersion': 2, 'strictErrors': true},
        autoCloseBrackets: true,
        matchBrackets: true,
        styleActiveLine: true
    });    
    
    window.code_editor = editor;
    window.js_output = js_output;
    window.jsoutf = jsoutf;
    window.outf = outf;
    window.builtinRead = builtinRead;

    $("#skulpt_run").click(function (e) { keymap["Ctrl-Enter"](editor)} );

    $("#toggledocs").click(function (e) {
        $("#quickdocs").toggle();
    });

    var exampleCode = function (id, text) {
        $(id).click(function (e) {
            editor.setValue(text);
            editor.focus(); // so that F5 works, hmm
        });
    };

    exampleCode('#codeexample1', "print \"Hello, World!\"     # natch");
    exampleCode('#codeexample2', "for i in range(5):\n    print i\n");
    exampleCode('#codeexample3', "print [x*x for x in range(20) if x % 2 == 0]");
    exampleCode('#codeexample4', "print 45**123");
    exampleCode('#codeexample5', "print \"%s:%r:%d:%x\\n%#-+37.34o\" % (\n        \"dog\",\n        \"cat\",\n        23456,\n        999999999999L,\n        0123456702345670123456701234567L)");
    exampleCode('#codeexample6', "def genr(n):\n    i = 0\n    while i < n:\n        yield i\n        i += 1\n\nprint list(genr(12))\n");
    exampleCode('#codeexample7', "# obscure C3 MRO example from Python docs\nclass O(object): pass\nclass A(O): pass\nclass B(O): pass\nclass C(O): pass\nclass D(O): pass\nclass E(O): pass\nclass K1(A,B,C): pass\nclass K2(D,B,E): pass\nclass K3(D,A): pass\nclass Z(K1,K2,K3): pass\nprint Z.__mro__\n");
    exampleCode('#codeexample8', "import document\n\npre = document.getElementById('edoutput')\npre.innerHTML = '''\n<h1> Skulpt can also access DOM! </h1>\n''' \n");

    $('#clearoutput').click(function (e) {
        $('#edoutput').text('');
        $('#mycanvas').hide();
    });


    function builtinRead(x) {
        if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
            throw "File not found: '" + x + "'";
        return Sk.builtinFiles["files"][x];
    }

    editor.focus();
});