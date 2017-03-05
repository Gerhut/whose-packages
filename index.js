require('dotenv').config()

const Koa = require('koa')
const ejs = require('koa-ejs')
const route = require('koa-route')
const cheerio = require('cheerio')
const got = require('got')

const app = module.exports = new Koa()
ejs(app, { root: __dirname, layout: false, viewExt: 'ejs' })
app.use(route.get('/', async ctx => ctx.redirect('/~gerhut')))
app.use(route.get('/~:user', async (ctx, user) => {
  const response = await got(`https://www.npmjs.com/~${user}`)
  const $ = cheerio.load(response.body)
  const pkgs = $('.collaborated-packages a').map((i, el) => $(el).text()).get()
  return await ctx.render('user', { user, pkgs })
}))

if (require.main === module) {
  app.listen(process.env.PORT)
}
