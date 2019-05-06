import winston from 'winston';
import mongoose from 'mongoose';
import config from 'config';

export default function() {
  const db = config.get('db');
  mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true
  })
    .then(() => winston.info(`Connected to ${db}...`));
}