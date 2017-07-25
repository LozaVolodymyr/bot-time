const service = require('../server/server');
const http = require('http');
const colors = require('colors');
const routers = require('../server/routes')(service);
const superagent = require('superagent');


/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 * For development only. Move to real ENV_VAR on production
 */
const dotenv = require('dotenv');
dotenv.load({ path: '.env' || ""});

const server = http.createServer(service);
    server.listen(process.env.PORT || 3010, () => {
        console.log(`Microservice - [Time] run on ${server.address().port} in ${service.get('env')} mode.`.green);
        function announce () {
            superagent.put(`http://127.0.0.1:3000/service/time/${server.address().port}`, (err, res) => {
                if(err) return console.log(`Error connect to main ${err}`.red);
                console.log(res.body.result)
            });
        }
    announce();
    setInterval(announce, 15000);

    })