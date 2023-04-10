// 打包的时候，根据模版，生成提示信息
// 每个模版有配置文件，包含模版参数以及说明
// 生成路径：命令执行路径
import minimist from "minimist";
import process from "node:process";
import { generateTemplateMetas } from "./utils/index.js";
import { colorPalettes, logger, loading } from '@skogkatt/dev-cli-utils';
import path from "node:path";
import { fileURLToPath } from 'node:url';
import { GeneratorDir } from '@skogkatt/dev-cli-generator';
import inquirer from "inquirer";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prompts = inquirer.prompt;
const { setRandom, setColorBlue } = colorPalettes;
const argv = minimist(process.argv.slice(2), { string: ['_'] });
const cwd = process.cwd();
const defaultMeta = {
    variants: [
        {
            name: 'name',
            message: '名称(默认)'
        }
    ]
};
const builtinTemplatePrefix = '__template-repo-';
const builtinTemplates = await generateTemplateMetas(path.join(__dirname), builtinTemplatePrefix, defaultMeta);
const customTemplates = await generateTemplateMetas(cwd, '', defaultMeta);
const templates = [...builtinTemplates, ...customTemplates];
console.log(customTemplates, builtinTemplates, __dirname, cwd);
const questions = [
    {
        type: 'list',
        name: 'template',
        message: setColorBlue('选择模版：'),
        choices: templates.map(t => ({ name: setRandom(t.title), value: t.id }))
    }
];
const { template } = await prompts(questions);
const templateMetaSelect = templates.find(t => t.id === template);
const templateQuestions = templateMetaSelect.variants || [];
const options = await prompts(templateQuestions);
const generator = new GeneratorDir({
    outputPath: cwd,
    templatePath: templateMetaSelect.path
});
loading.show('正在生成文件...');
generator.render2(options).then(() => {
    loading.close();
    logger.g('文件生成完毕！');
});
