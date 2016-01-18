const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const apiRoutes = require('./api');

const app = new express();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Back-end configuration //////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', apiRoutes);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Front-end configuration /////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Webpack configuration
if (process.env.NODE_ENV === 'development') {
    const webpack = require('webpack');
    const config = require('./webpack.development.js');
    const compiler = webpack(config);
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');
    app.use(webpackDevMiddleware(compiler, {noInfo: true, publicPath: config.output.publicPath}));
    app.use(webpackHotMiddleware(compiler));
}

// Serve public path
app.use(express.static(path.resolve(__dirname, 'public')));
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Serve, server! //////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const port = process.env.PORT || 1993;

app.listen(port, function (error) {
    if (error) {
        console.error(error);
    } else {
        if (process.env.NODE_ENV === 'development') {
            console.info("==> Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
        }
    }
});
