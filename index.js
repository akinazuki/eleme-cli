const env = require('dotenv').config().parsed;
const ArgumentParser = require('argparse').ArgumentParser;
var package_json = require('./package.json');

var parser = new ArgumentParser({
    version: package_json.version,
    addHelp: true,
    description: package_json.description
});
parser.addArgument(
    ['--SID'],
    {
        help: 'Eleme SID',
        defaultValue: process.env.SID
    }
);
parser.addArgument(
    ['--method'],
    {
        help: 'Method',
        required: true
    }
);
parser.addArgument(
    ['--action'],
    {
        help: 'Action',
    }
);
parser.addArgument(
    ['--longitude'],
    {
        help: 'Your Longitude',
        defaultValue: process.env.longitude
    }
);
parser.addArgument(
    ['--offset'],
    {
        help: 'offset',
        defaultValue: 0
    }
);
parser.addArgument(
    ['--limit'],
    {
        help: 'limit',
        defaultValue: 10
    }
);
parser.addArgument(
    ['--latitude'],
    {
        help: 'Your Latitude',
        defaultValue: process.env.latitude
    }
);
parser.addArgument(
    ['--address-id'],
    {
        help: 'Address ID',
    }
);
parser.addArgument(
    ['--keyword'],
    {
        help: 'Search Keyword',
    }
);
parser.addArgument(
    ['--shop-id'],
    {
        help: 'Shop ID',
    }
);
parser.addArgument(
    ['--menu'],
    {
        help: 'Menu Name',
    }
);
parser.addArgument(
    ['--page'],
    {
        help: 'Page ID',
        defaultValue: 1
    }
);
const args = parser.parseArgs();
if (!args.SID) {
    return console.log(`Missing SID, Please Setup First`);
}
(async () => {
    const USERID = await require('./method/current')(args).catch(err => {
        return console.log(err)
    })
    if (USERID === undefined) {
        return;
    }
    args.USERID = USERID;

    const method = require(`./method/${args.method}`)
    if (typeof method === 'function') {
        const reflect = await Reflect.apply(method, args, []).catch(err => {
            console.log(err)
        })
        if (reflect === undefined) {
            return;
        }
        console.log(reflect);
    } else if (typeof method === 'object') {
        const reflect = await Reflect.apply(method[args.action], args, []).catch(err => {
            console.log(err)
        })
        if (reflect === undefined) {
            return;
        }
        console.log(reflect);
    }
})()