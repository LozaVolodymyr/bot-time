const https = require('https');
const superagent = require('superagent')
const moment = require('moment')


module.exports = (app) => {
        app.get('/service/:location', (req, res, next) => {
            superagent
                .get('https://maps.googleapis.com/maps/api/geocode/json?')
                .query({ address: req.params.location, key: process.env.GOOGLE_GEO }) // query string 
                .end(function(err, response){
                    if(err) next(err);
                    let location = `${response.body.results[0].geometry.location.lat},${response.body.results[0].geometry.location.lng}`
                    let timestamp = +moment().format('X');
                    superagent
                        .get('https://maps.googleapis.com/maps/api/timezone/json?')
                        .query({ location: location, timestamp: timestamp, key: process.env.GOOGLE_TIME}) // query string
                        .end(function(err, response){
                            if(err) return next(err);
                            let time = moment.unix(timestamp + response.body.dstOffset + response.body.rawOffset).utc().format('hh:mm:ss')
                            return res.json(time);
                        }) 

                    
                });            
        });

        // Handle 500
        app.use((error, req, res, next) => {
            if (error) return console.log(error)
            if (!res.headersSent) return res.status(500).send(error);
            next();
        });
        app.use('/*', (req, res) => {
            res.status(404).send({ status: 0, message: 'No such endpoint' });
        }); // default entry 
    }
