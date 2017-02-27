require('dotenv').config()

const Koa = require('koa')
const route = require('koa-route')
const cheerio = require('cheerio')
const got = require('got')
const pug = require('pug')

const app = module.exports = new Koa()
app.use(route.get('/', async ctx => ctx.redirect('/~gerhut')))
app.use(route.get('/~:user', async (ctx, user) => {
  const response = await got(`https://www.npmjs.com/~${user}`)
  const $ = cheerio.load(response.body)
  const pkgs = $('.collaborated-packages a')
    .map((i, el) => $(el).text()).get()
  ctx.body = pug.renderFile('user.pug', { user, pkgs })
}))
app.use(route.get('/package/:package', async (ctx, pkg) => {
  const response = await got(`https://www.npmjs.com/package/${pkg}`)
  const $ = cheerio.load(response.body)
  const downloads = {
    daily: Number($('.daily-downloads').text()),
    weekly: Number($('.weekly-downloads').text()),
    monthly: Number($('.monthly-downloads').text())
  }
  ctx.body = downloads
}))

if (require.main === module) {
  app.listen(process.env.PORT)
}
