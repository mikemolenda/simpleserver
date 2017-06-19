const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 3000;

const mimeTypes = {
    'html': 'text/html',
    'js': 'text/javascript',
    'css': 'text/css',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg',
    'png': 'image/png'
}

const server = http.createServer((req, res) => {

    // Convert request URL to file path relative to the application root
    var uri = url.parse(req.url).pathname;
    var filename = path.join(process.cwd(), decodeURI(uri));

    console.log('Loading ' + uri);

    // Get statistics for requested file (size, creation time, etc.)
    // Also serves to check that file exists
    var stats;

    try {
        stats = fs.lstatSync(filename)

    } catch(e) {
        res.writeHead(404, {'Content-type': 'text/plain'});
        res.write('404 Not Found\n');
        res.end();
        return;

    }

    if (stats.isFile()) {
        // Get MIME type of requested file
        var extension = path.extname(filename).split('.').reverse()[0];
        var mimeType = mimeTypes[extension];

        res.writeHead(200, {'Content-type': mimeType});

        // Read file contents to response
        var fileStream = fs.createReadStream(filename);

        fileStream.pipe(res);

    } else if (stats.isDirectory()) {
        // Automatically redirect requests for directory to [directory]/index.html
        res.writeHead(302, {'Location': 'index.html'});
        res.end();

    } else {
        res.writeHead(500, {'Content-type': 'text/plain'});
        res.write('500 Internal Error\n');

    }

});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);

});
