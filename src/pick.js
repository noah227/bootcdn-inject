const hx = require("hbuilderx")
const pick = require("./pick/index.js")

const showPick = async () => {
    _showPick()
}

const _showPick = () => {
    // 一级列表
    searchAbstract().then(libName => {
        if (libName.startsWith(">")) return handleInternalAction(libName)
        // 二级各个版本文件列表
        searchWithinLib(libName).then(result => {
            if (result.label.startsWith(">")) return handleInternalAction(result.label)
            // 完成内容替换
            insertLink(libName, result)
        })
    })
}

const handleInternalAction = (libName) => {
    switch (libName) {
        case ">update":
            pick.libraries.update().then(() => {
                _showPick()
            })
            break
        case ">...":
            _showPick()
            break
        case ">about":
			// hx.commands.executeCommand("extension.bootcdnInjectGUI")
            break
    }

}

// 一级摘要列表
const searchAbstract = () => new Promise((resolve, reject) => {
    pick.libraries.getData().then(({lastUpdated, data}) => {
        const items = data.map(item => ({
            label: item.name,
            description: item.description,
            data: item
        }))
        const internalActions = [
            {label: ">update", description: `立即更新索引库 (上次更新时间${new Date(lastUpdated).toLocaleString()})`},
            {label: ">about", description: `关于`},
        ]
        const initPick = hx.window.showQuickPick([...internalActions, ...items], {
            placeHolder: "搜索bootcdn"
        })
        initPick.then((result) => {
            if (result) {
                const libName = result.label
                resolve(libName)
            }
        })
    })
})

// 搜索 二级具体某个库的文件列表
const searchWithinLib = (libName) => new Promise((resolve, reject) => {
    pick.libraries.searchLibrary(libName).then(data => {
        if (data.length) {
            const items = data[0].assets.reverse().reduce((items, item) => {
                items.push(...item.files.map(f => ({
                    label: f, description: item.version,
                    data: item
                })))
                return items
            }, [])
            const internalActions = [
                {label: ">...", description: "返回上一级"}
            ]
            // 展示 二级具体某个库的文件列表
            hx.window.showQuickPick([
                ...internalActions,
                ...items
            ], {
                placeholder: "搜索文件名"
            }).then(result => {
                if (result) resolve(result)
            })
        }
    })
})

const insertLink = (libName, result) => {
    // 插入链接
    hx.window.getActiveTextEditor().then(editor => {
        editor.edit(editorBuilder => {
            const {label: filename, data} = result
            const {version} = data
            const link = pick.libraries.createLink(libName, version, filename)
            editorBuilder.replace(editor.selection, link)
            const {active} = editor.selection
            setTimeout(() => {
                // 延迟设置，类似vue nextTick的效果，等待编辑窗口内容更新后再更新光标位置
                // 实例要重新获取
                hx.window.getActiveTextEditor().then(e => {
                    e.setSelection(active + link.length, active + link.length)
                })
            }, 0)
        })
    })
}

module.exports = showPick
