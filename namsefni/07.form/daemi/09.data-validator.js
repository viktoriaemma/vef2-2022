/*
Keyrt með:
node 09.datvalidator.js

Keyrir upp express vefþjón á http://localhost:3000 sem bíður upp á að fylla út
form með nafni, netfangi og kennitölu.

App notar express urlencoded middleware til að sækja gögn úr formi og setja í
req hlut.

Notar express-validator til að validate'a gögn úr formi og birta villur ef gögn
líta ekki rétt út. Verðum að gera þrátt fyrir að HTML input hafi required, email
type eða pattern, auðveldlega hægt að slökkva á því í vafra.
Sjá frekar í skjölun: https://express-validator.github.io/docs/

Þetta dæmi hefur opna HTML injection/XSS holu.. getur þú fundið hana?
*/

import express from 'express';
import {
  body,
  validationResult
} from 'express-validator';

const app = express();

// Nú verður req.body til
app.use(express.urlencoded({
  extended: true
}));

const nationalIdPattern = '^[0-9]{6}-?[0-9]{4}$';

function template(name = '', email = '', nationalId = '') {
  return `
  <form method="post" action="/post">
    <label>
      Nafn:
      <input required type="text" name="name" value="${name}">
    </label>
    <label>
      Netfang:
      <input required type="email" name="email" value="${email}">
    </label>
    <label>
      Kennitala:
      <input
        required
        type="text"
        pattern="${nationalIdPattern}"
        name="nationalId"
        value="${nationalId}"
      >
    </label>
    <button>Senda</button>
  </form>
  `;
  // Þó að við hefðum sent inn vitlaus gögn þá voru gildin kyrr í sínum input
  // kössum því að `value=${name}`.
  // Value fyrir inputtið varð strax að innsendingunni ef hún var puuuure (?) rétt?
  // Svo að reitirnir séu ekki allir hreinsaðir út ef það kemur villa
}

app.get('/', (req, res) => {
  res.send(template());
});

app.post(
  '/post',
  // VALIDATION!!!!
  // Þetta er bara validation, ekki sanitization
  body('name').isLength({ // erum að setja mörg middleware í svarið okkar
    min: 1
  }).withMessage('Nafn má ekki vera tómt'),
  body('email').isLength({
    min: 1
  }).withMessage('Netfang má ekki vera tómt'),
  body('email').isEmail().withMessage('Netfang verður að vera gilt netfang'),
  body('nationalId')
  .isLength({
    min: 1
  })
  .withMessage('Kennitala má ekki vera tóm'),
  body('nationalId')
  .matches(new RegExp(nationalIdPattern))
  .withMessage('Kennitala verður að vera á formi 000000-0000 eða 0000000000'),

  // Hérna erum við með middleware sem sér aðeins um það að prenta út villur ef það voru einhverjar villur
  (req, res, next) => {
    const {
      name = '', email = '', nationalId = ''
    } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) { // ef það eru validation villur þá er ekki einu sinni farið í næsta skref. next() er fyrir neðan þessa if-setningu
      const errorMessages = errors.array().map((i) => i.msg);
      return res.send(
        `${template(name, email, nationalId)}
        <p>Villur:</p>
        <ul>
          <li>${errorMessages.join('</li><li>')}</li>
        </ul>
      `,
      );
    }
// ef það voru engar villur þá keyrir þetta next() og þá er farið í næsta skref
    return next();
  },

  // NÆSTA SKREFIÐ, next(), ER AÐ SANITIZE-A

  /* Nú sanitizeum við gögnin, þessar aðgerðir munu breyta gildum í body.req */
  // Fjarlægja whitespace frá byrjun og enda
  // „Escape“ á gögn, breytir stöfum sem hafa merkingu í t.d. HTML í entity
  // t.d. < í &lt;
  body('name').trim().escape(),
  body('email').normalizeEmail(),

  // Fjarlægjum - úr kennitölu, þó svo við leyfum í innslátt þá viljum við geyma
  // á normalizeruðu formi (þ.e.a.s. allar geymdar sem 10 tölustafir)
  // Hér gætum við viljað breyta kennitölu í heiltölu (int) en... það myndi
  // skemma gögnin okkar, því kennitölur geta byrjað á 0
  body('nationalId').blacklist('-'),

  (req, res) => { // - [ ] ? Sanítesuruð gögn skorin niður og sett beint inní template, ekki í breytu og not stringified? 🙋🏻‍♀️

    const {
      name,
      email,
      nationalId
    } = req.body;

    //- [ ] SQUIRREL! HTML injection hér?
    // Gögnin birt hér
    return res.send(`
      <p>Skráning móttekin!</p>
      <dl>
        <dt>Nafn</dt>
        <dd>${name}</dd>
        <dt>Netfang</dt>
        <dd>${email}</dd>
        <dt>Kennitala</dt>
        <dd>${nationalId}</dd>
      </dl>
    `);
  },
);

app.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000/');
});

//- [ ] ? Hvar er HTML injection dæmið Er þessi kóði safe? 🙋🏻‍♀️
// -[ ] ? Er þessi kóði safe ? 🙋🏻‍♀️
