const hx = require("hbuilderx")
const Html = require('./html.js')

const showView = () => {
    let dialog = hx.window.createWebViewDialog({
        modal: false,
        title: "bootcdn注入",
        description: "一个便利的代码内bootcdn注入，左键插入链接，右键插入标签",
        size: {width: 420, height: 256}
    }, {
        enableScripts: true
    })

    const webview = dialog.webView
    webview.html = Html()

    webview.onDidReceiveMessage((msg) => {
        let action = msg.command
        switch (action) {
            case "close":
                // 关闭对话框
                dialog.close()
                break
            default:
                break
        }
    })
    // 显示对话框，返回显示成功或者失败的信息，主要包含内置浏览器相关状态。
    dialog.show().then((data) => {
        // ...
    })
}

module.exports = showView
