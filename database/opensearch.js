import fs from "fs";
import path from "path";

import { sources } from "./sources.js";

async function parseFile(filename, delimitter="\r\n") {
    const filePath = path.resolve("data", filename)

    const columns = sources.find((e) => e.sourcePath.includes(filename)).columns;
    const raw = (fs.readFileSync(filePath)).toString();

    const data = raw.split(delimitter);
    const headers = (data.shift()).split("\t");
    console.log(headers)
    var json = [];

    for (let i = 0; i < data.length; i++) {
        if (/^\s*$/.test(data[i])) continue;


        const contentCells = data[i].split("\t");

        var jsonLine = {};
        for (let i = 0; i < contentCells.length; i++) {

            if(!columns.find((e) => e.sourceName === headers[i]))
                console.log(headers[i])

            const header = columns.find((e) => e.sourceName === headers[i])
           
            jsonLine[header.name] = contentCells[i];
        }

        json.push(jsonLine);
    }

    return json;
}



(async function main() {

    const plcoAuto = await parseFile("PLCO_GSA_blood_autosomal_mCAs.txt")
    var id = 1;

    try {
        var fd = fs.openSync(path.resolve('data', 'plcoAuto.json'), 'a')
        plcoAuto.map((e) => {
            fs.appendFileSync(fd, JSON.stringify({
                "index": {
                    "_index": "mcaExplorer",
                    "_id": id
                }
            }) + '\n',
                'utf-8'
            )

            fs.appendFileSync(fd, JSON.stringify(e) + '\n',
                'utf-8'
            )

            id++;
        })
    } catch (err) {
        console.log(`${err}`)
    } finally {
        if (fd) {
            fs.closeSync(fd)
        }
        console.log(`Finish PLCO Autosomal import`);
    }

    const plcoDenominator = await parseFile("PLCO_GSA_blood_denominator.txt")

    try {
        var fd = fs.openSync(path.resolve('data', 'plcoDenominator.json'), 'a')
        plcoDenominator.map((e) => {
            fs.appendFileSync(fd, JSON.stringify({
                "index": {
                    "_index": "mcaExplorer",
                    "_id": id
                }
            }) + '\n',
                'utf-8'
            )

            fs.appendFileSync(fd, JSON.stringify(e) + '\n',
                'utf-8'
            )

            id++;
        })
    } catch (err) {
        console.log(`${err}`)
    } finally {
        if (fd) {
            fs.closeSync(fd)
        }
        console.log(`Finish PLCO Denominator import`);
    }

    const plcomLOX = await parseFile("PLCO_GSA_blood_mLOX.txt")

    try {
        var fd = fs.openSync(path.resolve('data', 'plcomLOX.json'), 'a')
        plcomLOX.map((e) => {
            fs.appendFileSync(fd, JSON.stringify({
                "index": {
                    "_index": "mcaExplorer",
                    "_id": id
                }
            }) + '\n',
                'utf-8'
            )

            fs.appendFileSync(fd, JSON.stringify(e) + '\n',
                'utf-8'
            )

            id++;
        })
    } catch (err) {
        console.log(`${err}`)
    } finally {
        if (fd) {
            fs.closeSync(fd)
        }
        console.log(`Finish PLCO mLOX import`);
    }

    const plcomLOY = await parseFile("PLCO_GSA_blood_mLOY.txt")

    try {
        var fd = fs.openSync(path.resolve('data', 'plcomLOY.json'), 'a')
        plcomLOY.map((e) => {
            fs.appendFileSync(fd, JSON.stringify({
                "index": {
                    "_index": "mcaExplorer",
                    "_id": id
                }
            }) + '\n',
                'utf-8'
            )

            fs.appendFileSync(fd, JSON.stringify(e) + '\n',
                'utf-8'
            )

            id++;
        })
    } catch (err) {
        console.log(`${err}`)
    } finally {
        if (fd) {
            fs.closeSync(fd)
        }
        console.log(`Finish PLCO mLOY import`);
    }

    const ukbbmLOX = await parseFile("UKBB_blood_mLOX_filter2_call_rate_ge0.97_baf_auto_le0.03.txt")

    try {
        var fd = fs.openSync(path.resolve('data', 'ukbbmLOX.json'), 'a')
        ukbbmLOX.map((e) => {
            fs.appendFileSync(fd, JSON.stringify({
                "index": {
                    "_index": "mcaExplorer",
                    "_id": id
                }
            }) + '\n',
                'utf-8'
            )

            fs.appendFileSync(fd, JSON.stringify(e) + '\n',
                'utf-8'
            )

            id++;
        })
    } catch (err) {
        console.log(`${err}`)
    } finally {
        if (fd) {
            fs.closeSync(fd)
        }
        console.log(`Finish UKBB ukbbmLOX import`);
    }

    const ukbbmLOY = await parseFile("UKBB_blood_mLOY_filter2_call_rate_ge0.97_baf_auto_le0.03.txt")

    try {
        var fd = fs.openSync(path.resolve('data', 'ukbbmLOY.json'), 'a')
        ukbbmLOY.map((e) => {
            fs.appendFileSync(fd, JSON.stringify({
                "index": {
                    "_index": "mcaExplorer",
                    "_id": id
                }
            }) + '\n',
                'utf-8'
            )

            fs.appendFileSync(fd, JSON.stringify(e) + '\n',
                'utf-8'
            )

            id++;
        })
    } catch (err) {
        console.log(`${err}`)
    } finally {
        if (fd) {
            fs.closeSync(fd)
        }
        console.log(`Finish UKBB ukbbmLOY import`);
    }

    const ukbbAuto = await parseFile("UKBB_blood_autosomal_mCA_filtered.tsv", "\n")

    try {
        var fd = fs.openSync(path.resolve('data', 'ukbbAuto.json'), 'a')
        ukbbAuto.map((e) => {
            fs.appendFileSync(fd, JSON.stringify({
                "index": {
                    "_index": "mcaExplorer",
                    "_id": id
                }
            }) + '\n',
                'utf-8'
            )

            fs.appendFileSync(fd, JSON.stringify(e) + '\n',
                'utf-8'
            )

            id++;
        })
    } catch (err) {
        console.log(`${err}`)
    } finally {
        if (fd) {
            fs.closeSync(fd)
        }
        console.log(`Finish UKBB ukbbAuto import`);
    }
})();