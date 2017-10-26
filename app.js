#!/usr/bin/env node
var fs = require('fs')
var path = require('path')
var appConfig = require('./config')
var http = require('http')
var https = require('https')

var redis = require('redis')
//var redisClient = createRedisClient('client')
//var redisSubscriber = createRedisClient('subscriber')
//var redisPublisher = createRedisClient('publisher')

var express = require('express')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var expressSession = require('express-session')
var RedisStore = require('connect-redis')(expressSession)

var sockets = require('./sockets')
global.fileServeRoot = path.join(__dirname, 'public')
global.rootDirectory = __dirname
var Logger = require('./plugins/logger/logger')
const { info, error } = Logger.init(__filename)


info('                   Starting up                     ')
info(' __    __       ______                                          ')
info('/  \  /  |     /      \                                         ')
info('$$  \ $$ |    /$$$$$$  | __    __   ______   _______    ______  ')
info('$$$  \$$ |    $$ |  $$ |/  |  /  | /      \ /       \  /      \ ')
info('$$$$  $$ |    $$ |  $$ |$$ |  $$ | $$$$$$  |$$$$$$$  |/$$$$$$  |')
info('$$ |$$$$ | __ $$ / \$$ |$$ \__$$ |/$$$$$$$ |$$ |  $$ |$$ \__$$ |')
info('$$ | $$$ |/  |$$ $$ $$< $$    $$/ $$    $$ |$$ |  $$ |$$    $$ |')
info('$$/   $$/ $$/  $$$$$$  | $$$$$$/   $$$$$$$/ $$/   $$/  $$$$$$$ |')
info('                   $$$/                               /  \__$$ |')
info('                                                      $$    $$/ ')
info('                                                       $$$$$$/  ')
info(`                                                   `)

var app = express()

// Setup Webpack HMR
if (appConfig.env === 'local') {
  // Create & configure a webpack compiler
  var webpack = require('webpack')
  var webpackDevMiddleware = require('webpack-dev-middleware')
  var webpackHotMiddleware = require('webpack-hot-middleware')
  var webpackConfig = require('./webpack')
  var compiler = webpack(webpackConfig)
  // Attach the dev middleware to the compiler & the server
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }))
  // Attach the hot middleware to the compiler & the server
  app.use(webpackHotMiddleware(compiler, {
    path: '/__webpack_hmr',
    stats: { chunks: false, modules: false, warnings: false },
    reload: true,
    heartbeat: 10 * 1000
  }))
  info('Webpack HMR now listening for changes')
}

// Setup Express Middleware
app.set('views', path.join(__dirname, 'public/views'))
app.set('view engine', 'jade')
app.use(helmet())
app.use(bodyParser.urlencoded({ extended: false, limit: '4mb' }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.static(global.fileServeRoot))
app.set('trust proxy', 1)
app.use(expressSession({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: true,
  genid: function () {
    // use UUIDs for session IDs
    return uuid.v4()
  },
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    // 30 minutes for non-local env
    maxAge: appConfig.env === 'local' ? null : 30 * 60 * 1000
  },
  rolling: true,
  secure: true,
  store: new RedisStore({ client: redisClient })
}))
app.use(passport.initialize())
app.use(passport.session())
initPassport(passport)
app.use(flash())
app.use(Logger.middleware)

// Setup Routes
var securityMiddleware = require('./routes/securityHelper')
var initRoutes = require('./routes/index')
var initAPIRoutes = require('./routes/api')
var initQuickBooks = require('./routes/quickbooks')
var initGoogleDrive = require('./routes/googleDrive')
app.use(securityMiddleware.enableSTS())
app.use('/', securityMiddleware.setAllowControl({ allowCredentials: true }), initRoutes(passport, appConfig))
app.use('/api', securityMiddleware.setAllowControl({ allowCredentials: true }), initAPIRoutes(passport, appConfig))
app.use('/quickbooks', initQuickBooks(passport, appConfig))
app.use('/googleDrive', initGoogleDrive(passport, appConfig))
app.use('/404', (req, res, next) => {
  res.render('error')
})
app.use((req, res, next) => {
  res.redirect('/404')
})

// Setup HTTP Server
http.createServer(function (req, res) {
  info('Redirecting to https ...')
  res.writeHead(301, { 'Location': 'https://' + req.headers['host'] + req.url })
  res.end()
}).listen(process.env.REDIRECT || 80, function () {
  info(`HTTP server listening on port ${process.env.REDIRECT || 80} (redirect to https)`)
})

httpsServer.listen(process.env.PORT || 443, function () {
  info(`HTTPS server listening on port ${httpsServer.address().port}`)
})

// Setup Websockets
sockets.init(httpsServer, redisClient, redisSubscriber, redisPublisher, appConfig)

// --- Helper Functions ---
function createRedisClient (name) {
  var client = redis.createClient({ host: appConfig.redis.domain, port: appConfig.redis.port })
  client.on('error', function (err) {
    error(`Failed to connect to Redis ${name}`, { err })
  })
  client.on('connect', function () {
    info(`Successfully connected to Redis ${name}`)
  })
  return client
}
