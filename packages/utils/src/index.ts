import fs from 'fs-extra'
import path from "node:path";
import {TemplateMeta, TemplateMetaRuntime} from "./types";
import Module = NodeJS.Module;

export * from './types'

export async function generateTemplateMetas(rootDirPath: string, templatePrefix?: string, defaultMeta?: TemplateMeta): Promise<TemplateMetaRuntime[]> {
    const templateSpacePath = path.join(rootDirPath, '__templates')
    if (!fs.pathExistsSync(templateSpacePath)) {
        return []
    }
    const files = fs.readdirSync(templateSpacePath) || []

    function isValidTemplate(fn: string) {
        const filePath = path.join(templateSpacePath, fn)
        const fileStat = fs.statSync(filePath)
        const isDir = fileStat.isDirectory()
        const isContainPrefix = !templatePrefix || fn.startsWith(templatePrefix)
        return isDir && isContainPrefix
    }

    async function getTemplateMeta(fn: string): Promise<TemplateMetaRuntime> {
        const templateDirPath = path.join(templateSpacePath, fn)
        const metaFilePath = path.join(templateDirPath, `$$meta.js`)
        const prefixStrLength = templatePrefix?.length || 0
        let meta: TemplateMetaRuntime
        const isMetaFileExist = fs.existsSync(metaFilePath)

        async function getMetaModuleDefault() {
            const metaModule: Module = await import(metaFilePath)
            return metaModule && metaModule['default']
        }

        const moduleDefault = isMetaFileExist && await getMetaModuleDefault()
        if (!moduleDefault) {
            meta = {
                id: fn,
                title: fn.slice(0, fn.indexOf('.')),
                variants: defaultMeta?.variants || [],
                path: templateDirPath
            }
        } else {
            meta = moduleDefault
        }
        return {
            id: fn,
            title: meta.title || prefixStrLength ? fn.slice(prefixStrLength) : fn,
            description: meta.description,
            command: meta.command,
            variants: meta.variants,
            path: templateDirPath
        }
    }

    return await Promise.all(files.filter(isValidTemplate).map(getTemplateMeta))
}