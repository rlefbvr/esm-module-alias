import generateAliasesResolver from '../../../index.js'; 
const aliases = {
    "@deep": "very/deep"
};

export const resolve = generateAliasesResolver(aliases);