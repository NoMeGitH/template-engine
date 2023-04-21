// 打包的时候，根据模版，生成提示信息
// 每个模版有配置文件，包含模版参数以及说明

// 生成路径：命令执行路径

import minimist from "minimist";
import moment from "moment";
import process from "node:process";
import {generateTemplateMetas} from "@skogkatt/creator-utils";
import {colorPalettes, logger, loading} from '@skogkatt/dev-cli-utils'
import path from "node:path";
import {fileURLToPath} from 'node:url'
import {GeneratorDir} from '@skogkatt/dev-cli-generator'
import inquirer, {QuestionCollection} from "inquirer";
import {TemplateMeta, TemplateMetaRuntime} from "@skogkatt/creator-utils";
import * as fs from "fs";
import xlsx from 'xlsx'
import {Parser} from "@skogkatt/dev-cli-generator";

loading.show("加载中...")
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prompts = inquirer.prompt

const {setRandom, setColorBlue} = colorPalettes
const argv = minimist<{ t?: string; template?: string }>(process.argv.slice(2), {string: ['_']})
const cwd = process.cwd()
const defaultMeta: TemplateMeta = {
    variants: []
}
const builtinTemplatePrefix = '__template-repo-'
const builtinTemplates: TemplateMetaRuntime[] = await generateTemplateMetas(path.join(__dirname), builtinTemplatePrefix, defaultMeta)
const customTemplates: TemplateMetaRuntime[] = await generateTemplateMetas(cwd, '', defaultMeta)
const files: string[] = fs.readdirSync(cwd).filter(fn => fn.endsWith(".xlsx"))
const templates = [...builtinTemplates, ...customTemplates]
const questions: QuestionCollection = [
    {
        type: 'list',
        name: 'template',
        message: setColorBlue('选择模版：'),
        choices: templates.map(t => ({name: setRandom(t.title) as string, value: t.id}))
    },
    {
        type: 'list',
        name: 'file',
        message: setColorBlue('选择表格：'),
        choices: files.map(fn => ({name: setRandom(fn.slice(0, fn.indexOf("."))) as string, value: fn}))
    }
]
loading.close()

const {template, file} = await prompts(questions)


const sourcePath = path.join(cwd, file)
const book = xlsx.readFile(sourcePath);
const sheetNames = book.SheetNames
let sourceSheetName

if (sheetNames && sheetNames.length > 1) {
    const {sheet} = await prompts([
        {
            type: 'list',
            name: 'sheet',
            message: setColorBlue('选择工作表：'),
            choices: sheetNames.map(sn => ({name: setRandom(sn) as string, value: sn}))
        }
    ])
    sourceSheetName = sheet
} else {
    sourceSheetName = sheetNames[0]
}

const sourceSheet = book.Sheets[sourceSheetName]
const data: any[][] = xlsx.utils.sheet_to_json(sourceSheet, {header: 1});
const columns: any[] = data[0];
const rows: any[][] = data.slice(1);
const _rows: any[] = []
rows.forEach(row => {
    let o: any = {}
    columns.forEach((col, cIndex) => {
        o[col] = row[cIndex];
    })
    _rows.push(Parser.contextCaseExtend(o))
})


const templateMetaSelect = templates.find(t => t.id === template) as TemplateMetaRuntime
const templateQuestions: QuestionCollection = templateMetaSelect.variants as QuestionCollection || []
const options = await prompts(templateQuestions)
console.log(options)
options._rows = _rows
options.$filename = file.slice(0, file.indexOf("."))
options.$time = moment().format('YYYY-MM-DD HH-mm-ss')

const generator = new GeneratorDir({
    outputPath: cwd,
    templatePath: templateMetaSelect.path
})

loading.show('正在生成文件...')
generator.render2(Parser.contextCaseExtend(options)).then(() => {
    loading.close()
    logger.g('文件生成完毕！')
})

