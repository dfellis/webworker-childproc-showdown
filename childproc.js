process.on('message', function(message) {
    process.send(message);
});