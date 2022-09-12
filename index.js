'use strict';

const Hapi = require('@hapi/hapi');
const axios = require('axios');
const { XMLParser } = require('fast-xml-parser')
const converter = require('json-2-csv');
const fs = require('fs');
const Sequelize = require('sequelize')
const db = require('./models');

const init = async () => {
    const server = Hapi.server({
        port: 3058,
        host: 'localhost',
        "routes": {
            "cors": {
                "origin": ["*"],
                "headers": ["Accept", "Content-Type"],
                "additionalHeaders": ["X-Requested-With"]
            }
        }
    });

    await server.register(
        [{
            plugin: require('hapi-sequelizejs'),
            options: [
                {
                    name: 'db_hapi', // identifier
                    models: [__dirname + '/server/models/**/*.js'], // paths/globs to model files
                    ignoredModels: [__dirname + '/server/models/**/*.js'], // OPTIONAL: paths/globs to ignore files
                    sequelize: new Sequelize('postgres://postgres:admin@localhost:5433/db_hapi'), // sequelize instance
                    sync: true, // sync models - default false
                    forceSync: true, // force sync (drops tables) - default false
                },
            ],
        }],
    );

    await server.start();
    console.log('Server running on %s', server.info.uri);

    server.route({
        method: '*',
        path: '/{any*}',
        handler: function (request, h) {
            return '404 Error! Page Not Found!';
        }
    });
    server.route({
        method: 'GET',
        path: '/',
        handler: async (request, h) => {
            const produk = await db.Products.findAll();
            return [{
                produk, "time":Date.now(),"total":produk.length
            }];
        },
    });

    server.route({
        method: 'POST',
        path: '/add-produk',
        options: {
            payload: {
              maxBytes: 209715200,
              output: 'file',
              parse: true,
              multipart: true     // <-- this fixed the media type error
            }
        },
        handler: async (request, h) => {
           const insert = request.payload;
           const namefile = [];
           if(insert.prdImage01 || insert.prdImage02 || insert.prdImage03 != null ){
                if(insert.prdImage01){
                    const name = insert.prdImage01.filename;
                    const path = __dirname + "/assets/" + name;
                    const file = fs.createWriteStream(path);
                    file.on('error', (err) => console.error(err));
                    namefile.push(name)
                }
                if(insert.prdImage02){
                    const name = insert.prdImage02.filename;
                    const path = __dirname + "/assets/" + name;
                    const file = fs.createWriteStream(path);
                    file.on('error', (err) => console.error(err));
                    namefile.push(name)

                }
                if(insert.prdImage03){
                    const name = insert.prdImage03.filename;
                    const path = __dirname + "/assets/" + name;
                    const file = fs.createWriteStream(path);
                    file.on('error', (err) => console.error(err));
                    namefile.push(name)

                }
                


           }
           let data = {
            id: Math.floor(Math.random() * 1000),
            category: insert.categori,
            prdNm: insert.prdNm,
            prdImage01: insert.prdImage01 ? namefile[0] : null,
            prdImage02: insert.prdImage02 ? namefile[1] : null,
            prdImage03: insert.prdImage03 ? namefile[2] : null,
            qty: insert.qty,
            price: insert.price,
            desc: insert.desc,
            is_api:false,
            update: Date.now(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
           };
           await db.Products.create(data).then(res => console.log(res)).catch(err => console.log(err))
            return {"status":"berhasil menambahkan data"}
        }
    });

    server.route({
        method: 'GET',
        path: '/generate-produk',
        handler: async (request, h) => {
            const options = {
                method: 'GET',
                url: 'http://api.elevenia.co.id/rest/prodservices/product/listing',
                headers: {
                    openapikey: '721407f393e84a28593374cc2b347a98'
                }
            };
            let Idproduk = []
            let datas = await axios.request(options).then(function (response) {
                const parser = new XMLParser();
                const data1 = parser.parse(response.data);
                const result = data1.Products.product;

                return result;
            })
                .catch(function (error) {
                    console.error(error);
                });
            // Get Data Awal
            for (let index = 0; index < datas.length; index++) {
                Idproduk.push({
                    "id": datas[index].prdNo,
                    "name": datas[index].prdName,
                    "qty": datas[index].stckQty,
                    "categori": datas[index].dispCtgrNm
                })
            }
            // Get Data produk
            let produk = [];
            for (let index = 0; index < Idproduk.length; index++) {
                const detail = await getDetails(Idproduk[index].id);
                produk.push({
                    "id": detail.prdNo,
                    "prdNm": detail.prdNm,
                    "prdImage01": detail.prdImage01,
                    "prdImage02": detail.prdImage02,
                    "prdImage03": detail.prdImage03,
                    "desc": detail.htmlDetail,
                    "price": detail.selPrc,
                    "update": detail.updateDt,
                    "createdAt": detail.updateDt,
                    "updatedAt": detail.updateDt,
                    "is_api": true
                })
            }
            const merge = (arr1, arr2) => {
                const temp = []
                arr1.forEach(x => {
                    arr2.forEach(y => {
                        if (x.id === y.id) {
                            temp.push({ ...x, ...y })
                        }
                    })
                })

                return temp
            }
            var result = merge(Idproduk, produk);

            converter.json2csv(result, (err, csv) => {
                if (err) {
                    throw err;
                }
                // write CSV to a file
                fs.writeFileSync(Date.now()+'.csv', csv);
            });

            return { "result": result, "time": Date.now() };
        }
    })
};

async function getDetails(req) {
    const options = {
        method: 'GET',
        url: `http://api.elevenia.co.id/rest/prodservices/product/details/${req}`,
        headers: {
            openapikey: '721407f393e84a28593374cc2b347a98'
        }
    };
    let datas = await axios.request(options).then(function (response) {
        const parser = new XMLParser();
        const data1 = parser.parse(response.data);
        const result = data1.Product;

        return result;
    })
        .catch(function (error) {
            console.error(error);
        });

    return datas;
}
process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();