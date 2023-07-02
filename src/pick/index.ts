import {TLibraryDetail} from "@/pick/types";

const axios = require("axios")
const fs = require("fs")
const path = require("path")
const https = require("https")

type TLibrary = {
    name: string
    // 最新cdn地址
    latest: string
}

type TAbstract = [/* 同libraries.name */ string, /* 简介 */ string]

type TData = {
    lastUpdated: number
    abstracts: TAbstract[]
    libraries: TLibrary[]
}

type TMergedData = {
    lastUpdated: number
    data: {
        name: string
        description: string
        latest: string
    }[]
}

const createAxiosConfig = () => ({
    headers: {"Content-Type": "application/json"},
    httpsAgent: new https.Agent({
        rejectUnauthorized: false
    })
})

const libraries = {
    getStorageFilePath() {
        return path.resolve(__dirname, "../source", "index.js")
    },
    loadData() {
        const fp = libraries.getStorageFilePath()
        const buffer = fs.readFileSync(fp, {encoding: "utf8"}) as Buffer
        return JSON.parse(buffer.toString("utf8")) as TData
    },
    mergeData(data: TData): TMergedData {
        const {lastUpdated, abstracts, libraries} = data
        // 未知abstracts与libraries是否严格顺序对齐，所以做一个映射
        const libraryMap = libraries.reduce((data, lib) => {
            data[lib.name] = lib
            return data
        }, {} as { [index: string]: TLibrary })
        return {
            lastUpdated,
            data: abstracts.map(item => ({
                ...libraryMap[item[0]],
                description: item[1]
            }))
        }
    },
    async getData(): Promise<TMergedData> {
        const fp = path.resolve(__dirname, "../source", "index.js")
        if (!fs.existsSync(fp)) await libraries.update()
        const data = libraries.loadData()
        const {lastUpdated} = data
        // 缓存过期，重新拉取数据
        if (Date.now() - lastUpdated > 854e5) {
            await libraries.update()
            return libraries.mergeData(libraries.loadData())
        } else return libraries.mergeData(data)
    },
    async searchLibrary(name: string): Promise<TLibraryDetail[]> {
        return (await axios.get(`https://api.bootcdn.cn/libraries/${name}`, createAxiosConfig())).data
    },
    createLink(name: string, version: string, filename: string) {
        return `https://cdn.bootcdn.net/ajax/libs/${name}/${version}/${filename}`
    },
    async update() {
        const fp = libraries.getStorageFilePath()
        const getAbstracts = axios.get("https://api.bootcdn.cn/libs.min.json", createAxiosConfig())
        const getLibraries = axios.get("https://api.bootcdn.cn/libraries", createAxiosConfig())
        const [res1, res2] = await Promise.all([getAbstracts, getLibraries])
        fs.writeFileSync(fp, JSON.stringify({
            lastUpdated: Date.now(),
            abstracts: res1.data,
            libraries: res2.data.results
        } as TData), {encoding: "utf8"})
    }
}

module.exports = {
    libraries
}
