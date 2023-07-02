type TLibraryAsset = {
    files: string[]
    version: string
}

export type TLibraryDetail = {
    assets: TLibraryAsset[]
    name: string
    description: string
    homepage: string
    license: string
    repository: {
        type: string
        url: string
    }
    keywords: string[]
    authors: {name: string, email?: string}[]
    filename: string
    version: string
}
