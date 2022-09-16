const express = require('express');
import { Request, Response, Application } from 'express';
const bp = require('body-parser');

import { ObjectId } from 'mongodb';
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://puppies:puppies@puppies.ue904ul.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const puppiesCollection = client.db("puppiesdb").collection("puppies");

interface Puppy {
  breed: string,
  name: string,
  birthDate: string // TODO Change to DateTime and add validations
}

const app: Application = express();

app.use(bp.urlencoded({ // NOTE Middleware
  extended: true
}));
app.use(bp.json());

app.get('/api/test', (_req: Request, res: Response) => {
  return res.status(200).json({ test: 'is working as it should' });
});

//DONE
app.get('/api/puppies', (_req: Request, res: Response) => {
    client.connect((_err: Error) => {
      puppiesCollection.find({}).toArray(function(err: Error, result: Puppy[]) {
        if (err) {
        res.status(500).send(err.message);
        return; }
        if (!result) {
          res.status(404).send('Database empty')
          return;
        }
        res.status(200).send(result);
        client.close();
      });
    })
})

//DONE
app.get('/api/puppies/:id', (req: Request, res: Response) => {
  let id:ObjectId;
  try {
    id = new ObjectId(req.params.id!);
  } catch (error) {
    res.status(400).send("Please provide a valid ID");
    return;
  }
  client.connect((_err: Error) => {
    puppiesCollection.findOne({ _id: id }, function(error: Error, result: Puppy) {
      if (error) {
        res.status(500).send(error.message);
        return;
      }
      if (!result) { // NOTE findOne returned null
        res.status(404).send("Puppy not found");
        return;
      }
      res.status(200).send(result);
      client.close();
    });
  })
})

//DONE
app.post('/api/puppies', (req: Request, res: Response) => {
  const puppy = req.body;
  if (!(puppy.name && puppy.breed && puppy.birthDate)) {
    res.status(400).send("Invalid input");
    return;
  }

  const stringValidation = new RegExp(/^([a-zA-Z]{1,30})$/);
  if (!req.body.name.match(stringValidation) || !req.body.breed.match(stringValidation)) {
    res.status(400).send("Invalid input");
    return;
  }
  client.connect((err: Error) => {
    if (err) throw err;
    puppiesCollection.insertOne(puppy, (error: Error, result: Puppy) => {
      if (error) throw error;
      res.status(201).send(result);
      client.close();
    })
  })
});

app.put('/api/puppies/:id', (req: Request, res: Response) => {
  const puppy = req.body;
  client.connect((_err: Error) => {
    puppiesCollection.updateOne({_id: new ObjectId(req.params.id)}, { $set: puppy }, (error: Error, _result: Puppy) => {
      if (error) throw error;
      res.status(204).send(puppy);
      client.close();
    })
  })
});

app.delete('/api/puppies/:id', (req: Request, res: Response) => {
  client.connect((err: Error) => {
    if (err) throw err;
    puppiesCollection.deleteOne({_id: new ObjectId(req.params.id)}, (error: Error, result: Puppy) => {
      if (error) throw err;      
      res.status(204).send(result);
      client.close();
      return;
    })
  })
});

export default app;
