1. create db_hapi on your postgres database and setting port and login on config
go to cmd type 
2. "npx sequalize db:migate"
3. "npx sequalize db:seed:all"
4. "node index.js"
url api [
    generate produk from db = http://localhost:3058/
    generate csv from api =  http://localhost:3000/generate-produk 
    post data produk ke db = http://localhost:3000/add-produk 
                        example : 
                        import axios from "axios";
                        const form = new FormData();
                        form.append("categori", "Handphone2");
                        form.append("prdImage01", "C:\\Users\\Pinguin\\Downloads\\download (1).png");
                        form.append("prdImage02", "C:\\Users\\Pinguin\\Downloads\\Untitled Diagram-ERD.drawio.png");
                        form.append("desc", "hehehe");
                        form.append("price", "1111");
                        form.append("is_api", "true");
                        form.append("prdNm", "Halo testing handphone");
                        form.append("qty", "1");

                        const options = {
                        method: 'POST',
                        url: 'http://localhost:3000/add-produk',
                        headers: {'Content-Type': 'multipart/form-data; boundary=---011000010111000001101001'},
                        data: '[form]'
                        };

                        axios.request(options).then(function (response) {
                        console.log(response.data);
                        }).catch(function (error) {
                        console.error(error);
                        });
]