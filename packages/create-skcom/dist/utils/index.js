import fs from 'fs-extra';
import path from "node:path";
export async function generateTemplateMetas(rootDirPath, templatePrefix = '', defaultMeta) {
    const templateSpacePath = path.join(rootDirPath, '__templates');
    if (!fs.pathExistsSync(templateSpacePath)) {
        return [];
    }
    const files = fs.readdirSync(templateSpacePath) || [];
    function isValidTemplate(fn) {
        const filePath = path.join(templateSpacePath, fn);
        const fileStat = fs.statSync(filePath);
        const isDir = fileStat.isDirectory();
        const isContainPrefix = !templatePrefix || fn.startsWith(templatePrefix);
        return isDir && isContainPrefix;
    }
    async function getTemplateMeta(fn) {
        const templateDirPath = path.join(templateSpacePath, fn);
        const metaFilePath = path.join(templateDirPath, `$$meta.js`);
        const prefixStrLength = templatePrefix.length;
        let meta;
        const isMetaFileExist = fs.existsSync(metaFilePath);
        async function getMetaModuleDefault() {
            const metaModule = await import(metaFilePath);
            return metaModule && metaModule['default'];
        }
        const moduleDefault = isMetaFileExist && await getMetaModuleDefault();
        if (!moduleDefault) {
            meta = {
                id: fn,
                title: fn.slice(0, fn.indexOf('.')),
                variants: defaultMeta.variants || [],
                path: templateDirPath
            };
        }
        else {
            meta = moduleDefault;
        }
        return {
            id: fn,
            title: meta.title || fn.slice(prefixStrLength),
            description: meta.description,
            command: meta.command,
            variants: meta.variants,
            path: templateDirPath
        };
    }
    return await Promise.all(files.filter(isValidTemplate).map(getTemplateMeta));
}
