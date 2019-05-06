import auth from '../middleware/auth';
import jwt from 'jsonwebtoken';
import config from 'config';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import {User, validate} from '../models/user';
import mongoose from 'mongoose';
import express from 'express';
const router = express.Router();

/**
 * @swagger
 * /api/users/me:
 *    get:
 *      summary: gets a registered user.
 *      tags: [/api/users]
 *      consumes:
 *        -application/json
 *      description: This should return a registered user
 *      parameters:
 *        - in: header
 *          name: x-auth-token
 *          description: An authorization token
 *      responses:
 *        200:
 *          description: successful
 *          schema:
 *            type: object
 *        400:
 *          description: Invalid token
 *          schema:
 *            type: object
 *        401:
 *          description: Access denied. No token provided.
 *          schema:
 *            type: object
 */
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

/**
 * @swagger
 * /api/users:
 *    post:
 *      summary: create a new user.
 *      tags: [/api/users]
 *      consumes:
 *        - application/json
 *      description: This should create a new user
 *      parameters:
 *        - in: body
 *          name: payload
 *          description: should contain the user's name, email and password.
 *      schema:
 *        type: object
 *        required:
 *          - name
 *        properties:
 *          name:
 *            type: string
 *            example: Sam Ethan
 *          email:
 *            type: string
 *          passwaord:
 *            type: string
 *      responses:
 *        200:
 *          description: Users created successfully
 *          schema:
 *            type: string
 *        400:
 *          description: Could not create a genre
 *          schema:
 *            type: string
 */
router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  user = new User(_.pick(req.body, ['name', 'email', 'password']));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user.isAdmin = true;
  await user.save();

  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

export default router;