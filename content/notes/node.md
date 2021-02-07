Title: NodeJS
Date: 2021-02-07
Category: Notes

So first you'll need to install Node.js to run a Node app.
In arch, its package name is `nodejs`.  
Packages are controlled with `npm`.
Apparently `yarn` is faster and more secure.  
Skeleton app is created with `npm init`.

## Global object

`require`, `setTimeout`, `setInterval`, `__dirname`, `__filename` etc.

## Core modules

### Events

``` js
var events = require('events');
```

Event listener:  
``` js
element.on('click', function(){});
```

Event emitter:  
``` js
var emitter = new events.EventEmitter();
emitter.on('someEvent', function(msg) {
    console.log(msg);
});
emitter.emit('someEvent', 'thing happened');
```

### Util
``` js
var util = require('util');
var Person = function(name) {
    this.name = name;
}
util.inherits(Person, events.EventEmitter);
var james = new Person('james');
var mary = new Person('mary');
var people = [james, mary];
people.forEach(function(person) {
    person.on('speak', function(msg) {
        console.log(`${person.name} said ${msg}`);
    })
});
james.emit('speak', 'hey');
```

Seems to be a way for functions to act like classes.

### FS

``` js
var fs = require('fs');
```

#### File IO
``` js
// synchronous
var names = fs.readFileSync('names.txt', 'utf8');
fs.writeFileSync('names_new.txt', names);

// asynchronous
fs.readFile('names.txt', 'utf8', function(err, data) {
    fs.writeFile('names_new.txt', data);
});
```

#### Delete files
``` js
fs.unlink('filename.txt');
```

#### Directories
``` js
// synchronous
fs.mkdirSync('blogs');
fs.rmdirSync('blogs');

// asynchronous
fs.mkdir('blogs', function() {
    fs.readFile('names.txt', 'utf8', function(err, data) {
        fs.writeFile('blogs/names_new.txt', data);
    });
});
```

### HTTP

``` js
var http = require('http');
var server = http.createServer(function(request, response) {
    response.writeHeader(200, {'Content-Type': 'text/plain'});
    response.end('hello');
});
server.listen(4030, 'localhost');
console.log("Server listening...");
```

## Streams and buffers

![](node.png)

### Creating streams

``` js
var rs = fs.createReadStream(__dirname + '/names.txt', 'utf8');
rs.on('data', function(chunk) {
    console.log(`Received chunk\n${chunk}`);
});
```

Rather than waiting for a whole file to be read into memory and sent, you can pass chunks of data to the client via a writable stream.

``` js
var ws = fs.createWriteStream(__dirname + '/names_out.txt');
var rs = fs.createReadStream(__dirname + '/names.txt', 'utf8');
rs.on('data', function(chunk) {
    ws.write(chunk);
});
```

### Pipes
Instead of manually connecting the `'data'` event from a read stream to a write stream like above, you can use a pipe like so:

``` js
rs.pipe(ws);
```

This concept can be used to pipe data to a client.

``` js
var http = require('http');
var rs = ...;
var server = http.createServer(function(request, response) {
    response.writeHeader(200, {'Content-Type': 'text/plain'});
    response.pipe(rs); // <-------
});
server.listen(4030, 'localhost');
```

## Serving HTML pages


``` js
var http = require('http');
var fs = require('fs');
var server = http.createServer(function(request, response) {
    response.writeHeader(200, {'Content-Type': 'text/html'}); // <---- text/html
    fs.createReadStream(__dirname + '/index.html', 'utf8').pipe(response);
});
server.listen(4030, 'localhost');
```

## Serving JSON

``` js
var http = require('http');
var fs = require('fs');
var server = http.createServer(function(request, response) {
    response.writeHeader(200, {'Content-Type': 'application/json'}); // <---- application/json
    var mjsd = {
        name: 'Mike',
        time: now()
    };
    response.end(JSON.stringify(mjsd));
});
server.listen(4030, 'localhost');
```

## Installing packages

`yarn add express`.

Yarn adds to package.json the same as npm does.

# Resources

- [Global object](https://nodejs.org/api/globals.html)  
- [YouTube - The Net Ninja - Nods JS Tutorial for Beginners](https://www.youtube.com/watch?v=GlybFFMXXmQ)
