const connection = require('../db-config');
const Joi = require('joi');

const db = connection.promise();

const validate = (data, forCreation = true) => {
  const presence = forCreation ? 'required' : 'optional';
  return Joi.object({
    firstname: Joi.string().max(255).presence(presence),
    lastname: Joi.string().max(255).presence(presence),
    email: Joi.string().email().max(255).presence(presence),
    city: Joi.string().max(255).presence(presence),
    language: Joi.string().max(255).presence(presence),
  }).validate(data, { abortEarly: false }).error;
};

const findMany = ({ filters: { city, language } }) => {
  let sql = 'SELECT * FROM users';
  const sqlValues = [];

  if (city) {
    sql += ' WHERE city = ?';
    sqlValues.push(city);
  }
  if (language) {
    if (city) sql += ' AND language = ? ;';
    else sql += ' WHERE language = ?';

    sqlValues.push(language);
  }

  return db.query(sql, sqlValues).then(([results]) => results);
};

const findOne = (id) => {
  return db
    .query('SELECT * FROM users WHERE id = ?', [id])
    .then(([results]) => results[0]);
};

const create = ({ firstname, lastname, email, city, language }) => {
  return db
    .query(
      'INSERT INTO users (firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)',
      [firstname, lastname, email, city, language]
    )
    .then(([result]) => {
      const id = result.insertId;
      return { firstname, lastname, email, city, language };
    });
};

const update = (id, newAttributes) => {
  return db.query('UPDATE users SET ? WHERE id = ?', [newAttributes, id]);
};

const destroy = (id) => {
  return db
    .query('DELETE FROM users WHERE id = ?', [id])
    .then(([result]) => result.affectedRows !== 0);
};

module.exports = {
  findMany,
  findOne,
  validate,
  create,
  update,
  destroy,
};