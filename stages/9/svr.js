import * as mb from './messageboard.js';

// message board app
// stage 9: PostgreSQL
import express from 'express';

const app = express();

app.use(express.static('client', { extensions: ['html'] }));

async function getMessages(req, res) {
  res.json(await mb.listMessages());
}

async function getMessage(req, res) {
  const result = await mb.findMessage(req.params.id);
  if (result) {
    res.json(result);
  } else {
    res.status(404).send('No match for that ID.');
  }
}

async function postMessage(req, res) {
  const messages = await mb.addMessage(req.body.msg);
  res.json(messages);
}

async function putMessage(req, res) {
  const message = await mb.editMessage(req.body);
  res.json(message);
}

// wrap async function for express.js error handling
function asyncWrap(f) {
  return (req, res, next) => {
    Promise.resolve(f(req, res, next))
      .catch((e) => next(e || new Error()));
  };
}

app.get('/messages', asyncWrap(getMessages));
app.get('/messages/:id', asyncWrap(getMessage));
app.put('/messages/:id', express.json(), asyncWrap(putMessage));
app.post('/messages', express.json(), asyncWrap(postMessage));

app.listen(8080);
