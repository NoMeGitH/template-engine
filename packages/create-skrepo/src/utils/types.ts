import {QuestionCollection} from 'inquirer' // https://github.com/SBoudrias/Inquirer.js
export type TemplateMetaRuntime = {
    id: string; // 模版ID，文件名ID为模版ID
    title: string; // 模版显示名称, 如果不填，显示为模版ID，即文件名
    path: string;
    variants: QuestionCollection; // 模版中涉及的变量描述, 默认有一个name选项
} & TemplateMeta

export type TemplateMeta = {
    id?: string; // 模版ID，文件名ID为模版ID
    title?: string; // 模版显示名称, 如果不填，显示为模版ID，即文件名
    description?: string; // 描述信息
    command?: string; // 指令，预留
    variants?: QuestionCollection; // 模版中涉及的变量描述, 默认有一个name选项
}