/*
Keyrt með:
node 05.data.js

Keyrir upp express vefþjón á http://localhost:3000 sem bíður upp á að fylla út
form með nafni, netfangi og kennitölu.
App notar express urlencoded middleware til að vinna úr gögnum.
Notar express-validator til að sanitize'a gögn en validate'ar ekki.
*/
import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send(`
    <form method="post" action="/post">
      <input type="text" name="data">
      <button>Senda</button>
    </form>
  `);
});

app.post('/post', (req, res) => {
  // Vinnum með gögn hér

  // Ef við afkommentum næstu síðu og refreshum í vafra munum við fá upp
  // „confirm form resubmission“ frá vafra
  // return res.send('Gögn móttekin!');
  // - [ ] ? Fékk ekkert confirm resubmission? 🙋🏻‍♀️


  // Birtum ekki niðurstöðu, heldur redirectum á þakkar síðu
  res.redirect('/thanks');
});

app.get('/thanks', (req, res) => {
  res.send('Gögn móttekin!❤️');
});

app.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
