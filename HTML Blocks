
    // =================== Scratch extension =================== 

// auto arguments is a little over complicated to deduce argument count

const letter = i => String.fromCharCode(97+i)

const auto_block = (blockType, opcode, text, args) => ({
	blockType,
	opcode,
	text,
	arguments: Object.fromEntries(
		new Array(text.split('[').length-1).fill().map((_,i)=> [
			letter(i), {
				type: (args && args[i]) || "number", 
				defaultValue: " "
			}
		])
	)
})

class ScratchCustom {

	constructor(runtime) {
		this.runtime = runtime
	}

	getInfo() {
    	    return {
	    	id: "math", // any other id breaks it, idk why
	    	name: "HTML Blocks",
	    	blocks: [
         {
           opcode: 'HTMLtag',
           blockType: Scratch.BlockType.REPORTER,
           text: 'HTML tag [ONE]',
           arguments: {
             ONE: {
               type: Scratch.ArgumentType.STRING,
               defaultValue: 'h1'
             },
            
           }
         },
         {
           opcode: 'HTMLtagWithAttr',
           blockType: Scratch.BlockType.REPORTER,
           text: 'HTML tag [ONE] with attributes [TWO]',
           arguments: {
             ONE: {
               type: Scratch.ArgumentType.STRING,
               defaultValue: 'div'
             },
             TWO: {
               type: Scratch.ArgumentType.STRING,
               defaultValue: 'id="div1"'
             },
            
           }
         },
         {
           opcode: 'HTMLtagWithContents',
           blockType: Scratch.BlockType.REPORTER,
           text: 'HTML tag [ONE] contents [TWO]',
           arguments: {
             ONE: {
               type: Scratch.ArgumentType.STRING,
               defaultValue: 'div'
             },
             TWO: {
               type: Scratch.ArgumentType.STRING,
               defaultValue: '<p> Hello! </p>'
             },
            
           }
         },
         {
           opcode: 'HTMLtagContentsAndAttributes',
           blockType: Scratch.BlockType.REPORTER,
           text: 'HTML tag [ONE] attributes [TWO] contents [THREE]',
           arguments: {
             ONE: {
               type: Scratch.ArgumentType.STRING,
               defaultValue: 'div'
             },
             TWO: {
               type: Scratch.ArgumentType.STRING,
               defaultValue: 'id="header"'
             },
             THREE: {
               type: Scratch.ArgumentType.STRING,
               defaultValue: '<h1> Hello! </h1>'
             },
           }
         },
         {
           opcode: 'encodeToDataURL',
           blockType: Scratch.BlockType.REPORTER,
           text: 'encode HTML [ONE] to URL',
           arguments: {
             ONE: {
               type: Scratch.ArgumentType.STRING,
               defaultValue: '<div> Hello! </div>'
             },
            
           }
         },
         {
           opcode: 'openHTMLcode',
           blockType: Scratch.BlockType.COMMAND,
           text: 'open HTML [ONE]',
           arguments: {
             ONE: {
               type: Scratch.ArgumentType.STRING,
               defaultValue: '<div> Hello! </div>'
             },
            
           }
         },
         {
           opcode: 'RunJS',
           blockType: Scratch.BlockType.COMMAND,
           text: 'Run JS code [ONE]',
           arguments: {
             ONE: {
               type: Scratch.ArgumentType.STRING,
               defaultValue: 'console.log("Hello World!")'
             },
            
           }
         },
         {
           opcode: 'RunJSwithReturn',
           blockType: Scratch.BlockType.REPORTER,
           text: 'Evaluate JS code [ONE]',
           arguments: {
             ONE: {
               type: Scratch.ArgumentType.STRING,
               defaultValue: 'return("Hello World!")'
             },
            
           }
         },
       ]
     };
   }

   HTMLtag(args) {
     return(`<${args.ONE}> </${args.ONE}>`);
   }
   HTMLtagWithAttr(args) {
       return(`<${args.ONE} ${args.TWO}> </${args.ONE}>`);
     }
     HTMLtagWithContents(args) {
       return(`<${args.ONE}> ${args.TWO} </${args.ONE}>`);
     }
     HTMLtagContentsAndAttributes(args) {
       return(`<${args.ONE} ${args.TWO}> ${args.THREE} </${args.ONE}>`);
     }
     encodeToDataURL(args) {
       return(`data:text/html, ${args.ONE}`);
     }
     openHTMLcode(args) {
       let codepage = window.open(`data:text/html,<!DOCTYPE html> <html> <head> </head> <body> </body> </html>`);
       codepage.document.body.innerHTML = args.ONE;
     }
     RunJS(args) {
       eval(args.ONE);
     }
     RunJSwithReturn(args) {
       return(eval("{ let funct = function() {" + args.ONE + "}; funct(); }"));
     }

       		variable.value = a.split(' ');
	}
    }

// ============== globalize vm and load extension ===============

function findReactComponent(element) {
    let fiber = element[Object.keys(element).find(key => key.startsWith("__reactInternalInstance$"))];
    if (fiber == null) return null;

    const go = fiber => {
        let parent = fiber.return;
        while (typeof parent.type == "string") {
            parent = parent.return;
        }
        return parent;
    };
    fiber = go(fiber);
    while(fiber.stateNode == null) {
        fiber = go(fiber);
    }
    return fiber.stateNode;
}

window.vm = (node => {
	  node = document.querySelector('div[class*=stage-header_stage-header-wrapper]');
	  node = node[Object.keys(node).find(key => (key = String(key), key.startsWith('__reactInternal') || key.startsWith('__reactFiber')))].return.return.return;
	  node = node.stateNode?.props?.vm || node.return?.updateQueue?.stores?.[0]?.value?.vm;
	  if (!node) throw new Error('Could not find VM :(');
	  return node;
})();

(function() {
    var extensionInstance = new ScratchCustom(window.vm.extensionManager.runtime)
    var serviceName = window.vm.extensionManager._registerInternalExtension(extensionInstance)
    window.vm.extensionManager._loadedExtensions.set(extensionInstance.getInfo().id, serviceName)
})()
    
