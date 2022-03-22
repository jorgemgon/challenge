const express = require('express');
const app = express();
const path = require('path');
const favicon = require('serve-favicon')
const compression = require('compression')
const resolve = (file) => path.resolve(__dirname, file);
const axios = require('axios')

const { createRenderer, renderPage, isProd, port } = require('./helpers')

let renderer, readyPromise;

if (isProd) {
  const bundle = require('./dist/vue-ssr-server-bundle.json');
  const clientManifest = require('./dist/vue-ssr-client-manifest.json');

  renderer = createRenderer(bundle, { clientManifest });

} else {
  readyPromise = require('./build/setup-dev-server')(app, (bundle, options) => {
    renderer = createRenderer(bundle, options);
  });
}

const serve = (path, cache) => {
  return express.static(resolve(path), {
    maxAge: cache && isProd ? 1000 * 60 * 60 * 24 * 30 : 0,
    fallthrough: false // It doesn't allow go throw
  });
}

app.use(compression({ threshold: 0 }))
app.use(favicon('./public/images/favicon.ico'))

app.use('/dist', serve('./dist', true));
app.use('/public', serve('./public', true));
app.use('/data', (req, res) => {
  res.json({
    "items": [
      {
        "id": 1,
        "title": "AMP YouTube Channel",
        "url": "https://www.youtube.com/channel/UCXPBsjgKKG2HqsKBhWA4uQw"
      },
      {
        "id": 2,
        "title": "AMPproject.org",
        "url": "https://www.ampproject.org/"
      },
      {
        "id": 3,
        "title": "AMP By Example",
        "url": "https://ampbyexample.com/"
      },
      {
        "id": 4,
        "title": "AMP Start",
        "url": "https://ampstart.com/"
      }
    ]
  });
});

app.use('/countries', (req, res) => {
  const countries = {}
  axios
  .post("https://countries.trevorblades.com/", {
    query: "query countries {\n  countries {\n    code\n  }\n}\n",
  })
  .then(function (response) {
    countries.value = {items: response.data.data.countries};
    console.log("Lista carregada");
    res.send(countries.value);
  })
  .catch(function (error) {
    console.log("Erro : " + countries);
  });
});

async function render(req, res) {
  if (req.originalUrl === '/ww.js.map') return res.send(null);

  res.setHeader('Content-Type', 'text/html');

  const handleError = (err) => {
    console.log('[Error]', err);

    if (err.url) {
      if (err.code) {
        return res.redirect(err.code, err.url)
      } else {
        return res.redirect(err.url)
      }
    } else if (err.code && err.code === 404) {
      return res.status(404).send('<script>location.href = "/404";</script>')
    } else {
      return res.redirect(`/404`)
    }
  };

  const context = {
    title: 'Vue 3 SSR AMP',
    url: req.url,
    inject: true,
    content: null,
    css: null
  };

  try {
    context.content = await renderer.renderToString(context);
  } catch (err) {
    handleError(err);
  }

  let { renderStyles, renderResourceHints, renderScripts } = context;

  context.scripts = context.inject ? renderScripts() : null;

  const html = renderPage(context);

  res.send(html);
}

app.get('*', isProd ? render : async (req, res) => {
  await readyPromise;
  render(req, res);
}
);

app.listen(port, () => {
  console.log(`Server started at localhost:${port}`);
});
