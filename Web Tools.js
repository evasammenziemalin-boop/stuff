
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
text: 'speak [TEXT] at rate [RATE]',
arguments: {
TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello, Scratch!' },
RATE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
}
},
{
opcode: 'textLength',
blockType: Scratch.BlockType.REPORTER,
text: 'length of [TEXT]',
arguments: {
TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello' }
}
},
{
opcode: 'randomHex',
blockType: Scratch.BlockType.REPORTER,
text: 'random hex color'
},
{
opcode: 'openURL',
blockType: Scratch.BlockType.COMMAND,
text: 'open url [URL] in new tab',
arguments: {
URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'https://scratch.mit.edu' }
}
}
]
};
}


// Returns a JSON string (or an error message) — Scratch reporters must return synchronously or a Promise
fetchJSON(args) {
const url = String(args.URL).trim();
if (!url) return 'error: empty url';
// Return a Promise — Scratch VM handles promises returned from reporter opcodes
return fetch(url)
.then(response => {
if (!response.ok) throw new Error('network response not ok: ' + response.status);
return response.json();
})
.then(json => {
try { return JSON.stringify(json); }
catch (e) { return 'error: could not stringify response'; }
})
.catch(err => 'error: ' + err.message);
}


speak(args) {
const text = String(args.TEXT || '');
let rate = Number(args.RATE);
if (!('speechSynthesis' in window)) {
console.warn('SpeechSynthesis not supported in this browser');
return;
}
if (!isFinite(rate) || rate <= 0) rate = 1;
const utt = new SpeechSynthesisUtterance(text);
utt.rate = rate;
// Use default voice — users can change system settings
window.speechSynthesis.cancel();
window.speechSynthesis.speak(utt);
}


textLength(args) {
const text = String(args.TEXT || '');
// Return integer length
return text.length;
}


randomHex() {
const n = Math.floor(Math.random() * 0xFFFFFF);
return ('#' + n.toString(16).padStart(6, '0')).toUpperCase();
}


openURL(args) {
const url = String(args.URL || '').trim();
if (!url) return;
// Open in new tab — in many Scratch environments this is allowed, but pop-up blockers may block it
try { window.open(url, '_blank'); }
catch (e) { console.warn('Could not open url', e); }
}
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
    
