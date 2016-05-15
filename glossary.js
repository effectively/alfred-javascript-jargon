#! /usr/local/bin/node

const os = require('os');
const fs = require('fs');
const keyword = process.argv[2];

const jargon_path = os.homedir() + '/.SJSJ/';
const glossary = '_glossary/';
const url = 'http://jargon.js.org/_glossary/';


const filter = keyword ?
    file=> new RegExp(keyword, 'i').test(file) && file.endsWith('md') : (file)=>file.endsWith('md');

fs.readdir(jargon_path + glossary, function (err, files) {

    if (err) {
        throw err;
    }

    var promises = files
        .filter(filter)
        .map(file=> {
            return new Promise(function (resolve, reject) {
                fs.readFile(jargon_path + glossary + file, 'utf-8', (err, data)=> {
                    if (err) {
                        reject(err);
                    }
                    resolve({file: file, data: data});
                });
            })
        });

    Promise.all(promises)
        .then(values=> {
            return values.map(v=> {
                    const title = v.file.replace('.md', '');
                    const subtitle = v.data.replace(/[^]*(^excerpt:)(.*$)[^]*/gmi, '$2');

                    return `
                        <item>
                            <title>${title}</title>
                            <subtitle>${subtitle}</subtitle>
                            <arg>${url + v.file}</arg>
                        </item>
                    `
                }
            );
        }).then(items=> {
        console.log(`
                 <?xml version="1.0" encoding="UTF-8"?>
            <items>
                ${items.join('')}
            </items>
            `)
    }).catch(d=> {
        throw d;
    })


});







