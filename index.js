require('dotenv').config()

const Koa = require('koa')
const ejs = require('koa-ejs')
const cheerio = require('cheerio')
const got = require('got')

const app = module.exports = new Koa()
ejs(app, { root: __dirname, layout: false, viewExt: 'ejs' })
app.use(async ctx => {
  const match = ctx.path.match(/^\/(\w*)$/)
  ctx.assert(match, 404)

  const user = match[1]
  if (user === '') return ctx.redirect(`${ctx.origin}/gerhut`)

  const response = await got(`https://www.npmjs.com/~${user}`)
  const $ = cheerio.load(response.body)
  const pkgs = $('.collaborated-packages a').map((i, el) => $(el).text()).get()

  return ctx.render('user', { user, pkgs })
})

if (require.main === module) {
  app.listen(process.env.PORT)
}
