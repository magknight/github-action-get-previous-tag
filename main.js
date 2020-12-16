const { exec } = require('child_process');
const core = require('@actions/core');
//
// exec(`cd ./main/`, (err, rev, stderr) => {
//     if (err) {
//         console.log('\x1b[33m%s\x1b[0m', 'Path is broken: ');
//         console.log('\x1b[31m%s\x1b[0m', stderr);
//         process.exit(1);
//     }
exec(`ls`, (err, res, stderr) => {
    console.log('\x1b[33m%s\x1b[0m', res);
    console.log('\x1b[33m%s\x1b[0m', `cd ${core.getInput('path')}`);

    exec('git rev-list --tags --max-count=1', (err, rev, stderr) => {
        if (err) {
            console.log('\x1b[33m%s\x1b[0m', 'Could not find any revisions because: ');
            console.log('\x1b[31m%s\x1b[0m', stderr);
            process.exit(1);
        }

        rev = rev.trim()

        exec(`git describe --tags ${rev}`, (err, tag, stderr) => {
            if (err) {
                console.log('\x1b[33m%s\x1b[0m', 'Could not find any tags because: ');
                console.log('\x1b[31m%s\x1b[0m', stderr);
                process.exit(1);
            }

            tag = tag.trim()

            exec(`git log -1 --format=%at ${tag}`, (err, timestamp, stderr) => {
                if (err) {
                    console.log('\x1b[33m%s\x1b[0m', 'Could not find any timestamp because: ');
                    console.log('\x1b[31m%s\x1b[0m', stderr);
                    process.exit(1);
                }

                timestamp = timestamp.trim()

                console.log('\x1b[32m%s\x1b[0m', `Found tag: ${tag}`);
                console.log('\x1b[32m%s\x1b[0m', `Found timestamp: ${timestamp}`);
                console.log(`::set-output name=tag::${tag}`);
                console.log(`::set-output name=timestamp::${timestamp}`);
                process.exit(0);
            });
        });
    });
});
