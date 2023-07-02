var hx = require("hbuilderx");
const showView = require('./src/main.js');
const showPick = require("./src/pick.js")


// [commandId, handler]
const commandList = [
	["extension.bootcdnInject", async () => await showPick()],
	["extension.bootcdnInjectGUI", () => showView()],
]

//该方法将在插件激活的时候调用
function activate(context) {
	commandList.forEach(config => {
		context.subscriptions.push(hx.commands.registerCommand(...config))
	})
}

//该方法将在插件禁用的时候调用（目前是在插件卸载的时候触发）
function deactivate() {

}

module.exports = {
    activate,
    deactivate
}
