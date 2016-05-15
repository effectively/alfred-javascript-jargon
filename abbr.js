#! /usr/local/bin/node


const os = require('os');
const fs = require('fs');

const keyword = process.argv[2];

const jargon_path = (process.env['SJSJ_PATH'] || os.homedir() + '/.SJSJ/')
    .replace(/^~/, os.homedir());

const abbr = '/_data/abbr.yml';



const filter = keyword ? kw=> new RegExp(keyword, 'i').test(kw.k) : ()=>true;

fs.readFile(jargon_path + abbr, 'utf-8', function (err, data) {

    if (err) {
        throw err;
    }
    const items = data.split('\n')
        .map(line=> {
            const [k,v]=line.split(':');
            return {
                k: k,
                v: v
            }
        })
        .filter(filter)
        .map(v=> {
                return `
                <item type="file">
                    <title>${v.k}</title>
                    <subtitle>${v.v}</subtitle>
                </item>
            `
            }
        );

    console.log(`
                 <?xml version="1.0" encoding="UTF-8"?>
            <items>
                ${items.join('')}
            </items>
            `)

});







