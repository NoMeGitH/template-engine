import { QuestionCollection } from 'inquirer';
export type TemplateMetaRuntime = {
    id: string;
    title: string;
    path: string;
    variants: QuestionCollection;
} & TemplateMeta;
export type TemplateMeta = {
    id?: string;
    title?: string;
    description?: string;
    command?: string;
    variants?: QuestionCollection;
};
