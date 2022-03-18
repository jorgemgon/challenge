const mustache = require('mustache');
const { argv } = require('yargs')
const fs = require('fs')
const path = require('path');
const resolve = (file) => path.resolve(__dirname, file);

const port = argv.port ? argv.port : process.env.PORT || 7070
const isProd = process.env.NODE_ENV === 'production';
const template = fs.readFileSync('./src/index.template.html', 'utf-8');

const { createBundleRenderer } = require('vue-bundle-renderer');

const createRenderer = (bundle, options) => {
    return {
        ...createBundleRenderer(
            bundle,
            Object.assign(options, {
                runInNewContext: false,
                inject: true,
                vueServerRenderer: require('@vue/server-renderer'),
                basedir: resolve('./dist'),
                publicPath: '/dist/',
            })
        )
    }
}

const renderPage = (context) => {
    // If is production AND not client
    context.ampServiceWorker = isProd && !context.inject ? true : false;
    return mustache.render(template, context);
}

module.exports = { createRenderer, renderPage, isProd, port }