var childproc = require('child_process');
var webworker = require('webworker-threads').Worker;
var count = process.argv[process.argv.length-1] || 100;

var thread = new webworker('./webworker.js');
var proc = childproc.fork('./childproc.js');

var threadRuns = 0, startTime, threadEndTime, procRuns = 0, procEndTime;
thread.onmessage = function(event) {
    threadRuns++;
    if(threadRuns == count) {
        threadEndTime = new Date();
        console.log("Thread time:  " + (threadEndTime - startTime));
        thread.terminate();
        runLoop('process');
    }
}
proc.on('message', function(message) {
    procRuns++;
    if(procRuns == count) {
        procEndTime = new Date();
        console.log("Process time: " + (procEndTime - startTime));
        proc.kill();
    }
});

function runLoop(type) {
    startTime = new Date();
    if(type == 'process') {
        for(var i = 0; i < count; i++) {
            var testArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            /*for(var j = 0; j < count; j++) {
                testArr.push(i);
                testArr.push(j);
            }*/
            proc.send(testArr);
        }
    } else {
        for(var i = 0; i < count; i++) {
            var testArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            /*for(var j = 0; j < count; j++) {
                testArr.push(i);
                testArr.push(j);
            }*/
            thread.postMessage(testArr);
        }
    }
}

runLoop('thread');