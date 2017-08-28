const express    = require('express');
const app        = express();
const path       = require('path');
const morgan     = require('morgan');
const bodyParser = require('body-parser');
const pug        = require('pug');
const mongoose   = require('mongoose');
const Monster = require('./model/monsters')

mongoose.connect('mongodb://localhost/monsters_db');

let count = 0;

//Monsters
// const monsters = [
//   {name: 'Nassnass la menace', level: 1 , description: "Une menace pour vos oreilles et votre tranquilité. Gare à lui..."},
//   {name: 'Mikator the terminator', level: 3 , description: 'Un-ro-bot-qui-ne-sou-rit-ja-mais.'},
//   {name: 'Felix le chat', level: 4 , description: 'Un chat botté, un chat perché, un chat culotté'},
// ];

app.use(express.static(path.join(__dirname + '/views')));
app.use(express.static(__dirname + '/public'));  // Point de repère car l'app ne sait pas se balader dans l'arborescence, ne sait pas où chercher les fichiers (images...).
app.use(morgan('dev'));
app.use(bodyParser());

app.set('views', path.join(__dirname + '/views'));  //marche aussi sans path.join.
app.set('view engine', 'pug');

// ROUTES
app.get('/home', (req, res) => {
  res.render('home');
});

app.get('/new_monster', (req, res) => {
  res.render('new_monster');
});

app.get('/count', (req, res) => {
  count += 1;
  res.render('count', {count});   //render va chercher la vue qui correspond à 'count' avec la valeur {count}.
});

app.get('/private', (req, res) => {
  res.send('Unauthorized', 401);  // ou .statut(401)
});

// app.get('/monster/1', (req, res) => {
//   res.send(monsters[0].name);
// });

app.get('/monster/:id', (req, res) => {
  // let monster = monsters[req.params.id-1];
  // res.send(`${monster.name} ${monster.description}`);
  let _id = req.params.id;
  Monster.findById(_id, (err, monster) => {
    if(err) res.send("Ton monstre se cache, nous n'avons pas pu le trouver.")
    res.render('monster', {monster});
  });
});

app.get('/monsters', (req, res) => {
  Monster.find({}, (err, monsters) => {
    if (err) res.send('Error');
    res.render('monsters', {monsters}); // renvoie au parametre monsters.
  });
});

app.post('/create_monster', (req, res) => {  
 // get : on voit les données dans l'URL et tout le monde peut modifier. post : strictement cet URL, personne ne peut y accéder.
  /* monsters.push({
    name:        req.body.name,
    level:       parseInt(req.body.level, 10),
    description: req.body.description
  }); */
  let monster = new Monster(req.body);
  monster.save((err, saved_monster) => {
    if (err) {
      res.send('Ton monstre ne veut pas se créer. Quel vilain!');
    } else {
      let monster_created = req.body.name;
      res.render('monster_created', {monster_created});
    };
  });
});

app.listen(5000, () => {
  console.log('Les monstres arrivent sur le port 5000...');
});
