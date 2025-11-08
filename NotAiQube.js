
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
	    	name: "NotAiQube",
	    	blocks: [
	        {
	        	blockType: 'reporter',
	        	opcode: 'power',
	        	text: '[a] ^ [b]',
	        	arguments: {
	        		a: {
	        			type: "number",
	        			defaultValue: "4"
	        		},
	        		b: {
	        			type: "number",
	        			defaultValue:"2"
	        		}
	        	}
	        },
	      	
	    	]
	    } // use arrow keys to scroll down
	} 

	power({a,b}, util) {
		return(a ** b)
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
    