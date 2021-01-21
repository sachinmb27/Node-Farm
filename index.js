//Required core modules
const fileSystem = require('fs');
const http = require('http');
const url = require('url');

//User-defined module
const replaceContent = require('./modules/replace_content');

//Third party module
const slugify = require('slugify');
const { parse } = require('path');

//Blocking way of reading files
const data = fileSystem.readFileSync(`${__dirname}/data.json`, 'utf-8');
const overviewTemplate = fileSystem.readFileSync(`${__dirname}/templates/overview_template.html`, 'utf-8');
const productTemplate = fileSystem.readFileSync(`${__dirname}/templates/product_template.html`, 'utf-8');
const cardTemplate = fileSystem.readFileSync(`${__dirname}/templates/card_template.html`, 'utf-8');

//Parsing of JSON data
const parsedData = JSON.parse(data);

//Slugs for the product URL's
const slugs = parsedData.map(el => slugify(el.productName, { lower: true }));

//Server creation
const server = http.createServer((req, res) => {
    //Parsing URL variables to display products
    const { query, pathname } = url.parse(req.url, true);

    //Overview page
    if(pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' });
        const cards = parsedData.map(index => replaceContent(cardTemplate, index)).join('');
        const cardOutput = overviewTemplate.replace(/{%PRODUCT_CARDS%}/g, cards);
        res.end(cardOutput);

    //Product page    
    } else if(pathname === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html' });
        const product = parsedData[query.id];
        const outputProduct = replaceContent(productTemplate, product);
        res.end(outputProduct);

    //API page
    } else if(pathname === '/api') {
        res.end('API!');

    //Page Not Found
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html'
        });
        res.end('<h1>Page not found!</h1>');
    }
});

//Server listening to requests
server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000.');
});