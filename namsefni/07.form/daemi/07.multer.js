/*
Keyrt með:
node 07.multer.js

Keyrir upp express vefþjón á http://localhost:3000 sem bíður upp á að fylla út
form með einni skrá sem POSTað er á /single eða tvær skrár sem POSTað er á /many
App notar multer middleware til að vinna úr gögnum og ná í innihald þeirra.
Birtir skráarnafn, MIME type og innihald stöku skrár
Birtir lista af skráarnöfnum og MIME types fyrir tvær skrár
*/
import express from 'express';
import multer from 'multer';

const upload = multer(); // upload er instance af multer

const app = express();

app.get('/', (req, res) => { // tökum við get hérna sem prentar út þessi tvö form fyrir okkur
  res.send(`
<h2>Stök skrá</h2>
<form method="post" action="/single" enctype="multipart/form-data">
  <input type="file" name="data">
  <button>Senda</button>
</form>

<h2>Fylki af skrám</h2>
<form method="post" action="/many" enctype="multipart/form-data">
  <input type="file" name="data">
  <input type="file" name="data">
  <button>Senda</button>
</form>
  `);
});

app.post('/single', upload.single('data'), (req, res) => {
  // getum fengið HEADER like file dóteríið úr þessu req.file
  const { // fáum object fyrir skránna
    originalname: filename = '',
    mimetype = '',
    buffer = null, // buffer fyrir innihald skjalsins
  } = req.file;

  res.send(
    `Innihald skránnar <code>${filename}</code>, sem er af gerð <code>${mimetype}</code>, er þessi: <div><font face='Comic sans MS'>"${buffer.toString('utf8')}"</font></div>`,
  );
  // opnast á síðunni 127.0.0.1:3000/single
  // Birtist þar sem textinn, (fyrir editið mitt),
  // 'Innihald file.txt af gerð text/plain er halló heimur'
});

// fyrir MARGAR SKRÁR:
app.post('/many', upload.array('data'), (req, res) => {
  // möppum name yfir allar þær skrár sem koma inn
  const names = req.files.map((i) => i.originalname).join(', ');
  const mimetypes = req.files.map((i) => i.mimetype).join(', ');

  res.send(
    `${req.files.length} skrár, með skráarnöfn ${names} af týpum ${mimetypes}`,
  );
});

app.listen(3000, () => {
  console.log('Server running at http://127.0.0.1:3000/');
});
