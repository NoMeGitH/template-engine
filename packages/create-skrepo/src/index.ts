// 打包的时候，根据模版，生成提示信息
// 每个模版有配置文件，包含模版参数以及说明

// 生成路径：命令执行路径

import minimist from "minimist";
import process from "node:process";
import {generateTemplateMetas} from "@skogkatt/creator-utils";
import {colorPalettes, logger, loading} from '@skogkatt/dev-cli-utils'
import path from "node:path";
import {fileURLToPath} from 'node:url'
import {GeneratorDir, ParseContext} from '@skogkatt/dev-cli-generator'
import inquirer, {QuestionCollection} from "inquirer";
import {TemplateMeta, TemplateMetaRuntime} from "@skogkatt/creator-utils";

loading.show("加载中...")
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const prompts = inquirer.prompt

const {setRandom, setColorBlue} = colorPalettes
const argv = minimist<{ p?: string; path?: string }>(process.argv.slice(2), {string: ['_']})
const cwd = process.cwd()
const outputPath = argv.path || argv.p || cwd
const defaultMeta: TemplateMeta = {
    variants: [
        {
            name: 'name',
            message: '名称(默认)'
        }
    ]
}
const builtinTemplatePrefix = '__template-repo-'
const builtinTemplates: TemplateMetaRuntime[] = await generateTemplateMetas(path.join(__dirname), builtinTemplatePrefix, defaultMeta)
const customTemplates: TemplateMetaRuntime[] = await generateTemplateMetas(cwd, '', defaultMeta)
const templates = [...builtinTemplates, ...customTemplates]
const questions: QuestionCollection = [
    {
        type: 'list',
        name: 'template',
        message: setColorBlue('选择模版：'),
        choices: templates.map(t => ({name: setRandom(t.title) as string, value: t.id}))
    }
]

loading.close()
const {template} = await prompts(questions)

const templateMetaSelect = templates.find(t => t.id === template) as TemplateMetaRuntime
const templateQuestions: QuestionCollection = templateMetaSelect.variants as QuestionCollection || []
const options = await prompts(templateQuestions)

const generator = new GeneratorDir({
    outputPath,
    templatePath: templateMetaSelect.path
})

loading.show('正在生成文件...')
generator.render2(options).then(() => {
    loading.close()
    logger.g('文件生成完毕！')
})

