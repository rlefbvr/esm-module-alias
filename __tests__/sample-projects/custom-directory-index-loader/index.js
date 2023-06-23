import fs from 'node:fs';
import { printText } from '@deep/module';

async function main() {
    const text = await fs.promises.readFile('./sample.txt', 'utf-8');
    printText(text);
}
main();