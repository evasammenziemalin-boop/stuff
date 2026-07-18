
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
	    	name: Scratch.translate("Hidden Blocks"),
        blocks: [
          // Use the sensing_touchingobjectmenu instead of event_ to also list sprites, since the block supports it
          {
            blockType: Scratch.BlockType.XML,
            xml: '<block type="event_whentouchingobject"><value name="TOUCHINGOBJECTMENU"><shadow type="sensing_touchingobjectmenu"/></value></block>',
          },
          "---",
          {
            blockType: Scratch.BlockType.XML,
            xml: '<block id="for_each" type="control_for_each"><value name="VALUE"><shadow type="math_whole_number"><field name="NUM">10</field></shadow></value></block>',
          },
          {
            blockType: Scratch.BlockType.XML,
            xml: '<block id="while" type="control_while"/>',
          },
          "---",
          // Counting blocks that function similarly to variables
          {
            blockType: Scratch.BlockType.XML,
            xml: '<block type="control_get_counter"/>',
          },
          {
            blockType: Scratch.BlockType.XML,
            xml: '<block type="control_incr_counter"/>',
          },
          {
            blockType: Scratch.BlockType.XML,
            xml: '<block type="control_clear_counter"/>',
          },
          "---",
          {
            blockType: Scratch.BlockType.XML,
            xml: '<block type="operator_round"><value name="NUM"><shadow type="note"><field name="NOTE">60</field></shadow></value></block>',
          },
          "---",
          {
            blockType: Scratch.BlockType.XML,
            xml: '<block type="operator_join"><value name="STRING1"><shadow type="colour_picker"/></value><value name="STRING2"><shadow type="text"><field name="TEXT"></field></shadow></value></block>',
          },
          // Dot matrix input from the micro:bit extension
          // Returns a 5x5 binary grid of pixels depending on what was drawn. White pixels are 1 and green pixels are 0
          {
            blockType: Scratch.BlockType.XML,
            xml: '<block type="operator_join"><value name="STRING1"><shadow type="matrix"><field name="MATRIX">1111110101001000010001110</field></shadow></value><value name="STRING2"><shadow type="text"><field name="TEXT"></field></shadow></value></block>',
          },
		],
	    } // use arrow keys to scroll down
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
    
