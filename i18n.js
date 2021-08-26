// eslint-disable-next-line no-undef
module.exports = {
  defaultLocale: 'it',
  loadLocaleFrom: (lang, ns) => import(`./src/locales/${lang}/${ns}.json`).then((m) => m.default),
  locales: ['it'],
  pages: {
    '*': ['common', 'quickAdd', 'excel', 'login', 'recentItems', 'stats'],
  },
}
