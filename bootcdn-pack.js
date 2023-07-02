const executable7ZipPath = '"D:\\Program Files\\7-Zip\\7z.exe"'
const publishName = "hx-bootcdn-inject.zip"
// [file, isDir]
const includes = [
    ["./*.*", false],
    ["./src", true]
]
const excludes = [
    // 一级目录下不需要的东西
    [".idea", true],
    [".git", true],
    [".gitignore", false],
    ["bootcdn-pack.js", false],
    ["package-lock.json", false],
    ["rollup.config.js", false],
    ["node_modules/@rollup", true],
    ["node_modules/rollup", true],
    ["node_modules/tslib", true],
    ["node_modules/typescript", true],
    ["node_modules/@types/node", true],
    ["node_modules/terser", true],
    ["node_modules/fs-extra", true],
    // node_modules中部分不需要的东西
    ["node_modules/**/*.md", false],
    ["node_modules/**/*.d.ts", false],
    ["node_modules/**/LICENSE", false],
    // ["node_modules/**/package.json", false],
    ["node_modules/**/.*", false],
    ["node_modules/**/test", false],
    ["src/pick/*.ts", false],
    ["src/pick/*.js.map", false],
    ["src/source/index.js", false],
    [publishName, false]
]

const createIncludeArgs = () => {
    return "i -r " + includes.map(([fp, isDir]) => {
        return fp
    }).join(" ")
}

const createExcludes = () => {
    return excludes.map(([fp, isDir]) => {
        return isDir ? `-xr!${fp}` : `-x!${fp}`
    }).join(" ")
}

const createCmd = () => {
    const cmd = [executable7ZipPath, `a -tzip ${publishName}`, createIncludeArgs(), createExcludes()].join(" ")
    console.log(cmd)
    return cmd
}

const runPack = () => {
    const fse = require("fs-extra")
    if(fse.pathExistsSync(publishName)) {
        fse.removeSync(publishName)
        console.log(`已自动移除存在的文件>>> ${publishName}`)
    }
    require("child_process").exec(createCmd(), (error, stdout, stderr) => {
        if (error) console.error(error)
        else console.log(`打包成功！打包文件大小${
            (require("fs").statSync(publishName).size / 1024).toFixed(2)
        }KB`)
    })
}

runPack()
