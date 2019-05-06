import validateObjectId from '../middleware/validateObjectId';
import auth from '../middleware/auth';
import admin from '../middleware/admin';
import { Genre, validate } from '../models/genre';
import mongoose from 'mongoose';
import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /api/genres:
 *    get:
 *      summary: gets all genres.
 *      tags: [/api/genres]
 *      description: This should return all genres
 *      responses:
 *        200:
 *          description: A list of genres
 *          schema:
 *            type: string
 *        400:
 *          description: Failed Request
 *          schema:
 *            type: string
 */
router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

/**
 * @swagger
 * /api/genres:
 *    post:
 *      summary: create a new genre.
 *      tags: [/api/genres]
 *      consumes:
 *        - application/json
 *      description: This should create a new genres
 *      parameters:
 *        - in: body
 *          name: name
 *          description: The genre to create.
 *        - in: header
 *          name: x-auth-token
 *          description: An authorization token
 *      schema:
 *        type: object
 *        required:
 *          - name
 *        properties:
 *          name:
 *            type: string
 *            example: Sam Ethan
 *      responses:
 *        200:
 *          description: Genres created successfully
 *          schema:
 *            type: string
 *        400:
 *          description: Could not create a genre
 *          schema:
 *            type: string
 */
router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();
  
  res.status(200).send(genre);
});

/**
 * @swagger
 * /api/genres/{id}:
 *    put:
 *      summary: get the genre with the id for update.
 *      tags: [/api/genres]
 *      consumes:
 *        - application/json
 *      description: This should update existing genres
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the genre to edit.
 *        - in: body 
 *          name: name 
 *          description: The new name of the genre to be updated.
 *        - in: header
 *          name: x-auth-token
 *          description: An authorization token
 *      schema:
 *        type: object
 *        required:
 *          - name
 *        properties:
 *          id:
 *            type: integer
 *          name:
 *            type: string
 *      responses:
 *        200:
 *          description: Genres updated successfully
 *          schema:
 *            type: string
 *        400:
 *          description: Could not update a genre
 *          schema:
 *            type: string
 *        401:
 *          description: Unauthorized
 *          schema:
 *            type: string
 *        404:
 *          description: Could not find  a genre with the given ID 
 *          schema:
 *            type: string
 */
router.put('/:id', [auth, validateObjectId], async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
    new: true
  });

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
  res.send(genre);
});

/**
 * @swagger
 * /api/genres/{id}:
 *    delete:
 *      summary: deletes a genre
 *      tags: [/api/genres]
 *      consumes:
 *        - application/json
 *      description: This should delete an existing genre with the given id
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the genre to delete.
 *        - in: header
 *          name: x-auth-token
 *          description: An authorization token
 *      schema:
 *        type: object
 *        required:
 *          - name
 *        properties:
 *          id:
 *            type: integer
 *          name:
 *            type: string
 *      responses:
 *        200:
 *          description: Genre deleted  successfully
 *          schema:
 *            type: string
 *        400:
 *          description: Invalid ID
 *          schema:
 *            type: string
 *        401:
 *          description: Unauthorized
 *          schema:
 *            type: string
 *        403:
 *          description: Access Denied!!!
 *          schema:
 *            type: string
 *        404:
 *          description: Could not find  a genre with the given ID 
 *          schema:
 *            type: string
 */
router.delete('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

/**
 * @swagger
 * /api/genres/{id}:
 *    get:
 *      summary: gets a unique genre with the passed id
 *      tags: [/api/genres]
 *      consumes:
 *        - application/json
 *      description: This should return an existing genre with the given id
 *      parameters:
 *        - in: path
 *          name: id
 *          description: The ID of the genre to delete.
 *      schema:
 *        type: object
 *        required:
 *          - name
 *        properties:
 *          id:
 *            type: integer
 *          name:
 *            type: string
 *      responses:
 *        200:
 *          description:  success
 *          schema:
 *            type: string
 *        400:
 *          description: Invalid ID
 *          schema:
 *            type: string
 *        404:
 *          description: Could not find  a genre with the given ID 
 *          schema:
 *            type: string
 */
router.get('/:id', validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.status(200).send(genre);
});

export {
  router
};