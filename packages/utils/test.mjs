import {generateTemplateMetas} from "./dist/index.js";

const testPath = '/Users/xinxibu/Documents/+Skogkatt2/the-creator/packages/create-skcom/__templates'
const t = await generateTemplateMetas(testPath, '__template-com-', {variants: []})
console.log(t)