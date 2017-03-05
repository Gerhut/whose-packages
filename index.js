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

if (require.main === module) {
  app.listen(process.env.PORT)
}
