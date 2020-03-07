let PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'));
var db = new PouchDB('DB');
// db.info().then(function (info) {
//     console.log(info);
//   })
//   db.createIndex({
//     index: {fields: ['name']}
//   });
  var doc = {
    "name": "Mittens",
    "occupation": "kitten",
    "age": 3,
    "hobbies": [
      "playing with balls of yarn",
      "chasing laser pointers",
      "lookin' hella cute"
    ]
  };
  db.post(doc);
async function main(){
    let name = await  db.find({
        selector: {name: 'Mittens'},
        fields: ['_id', 'name']
      })
    console.log(name)
}
main()
//   db.get('mittens').then(function (doc) {
//     console.log(doc);
//   });
//   db.destroy().then(function (response) {
//     // success
//   }).catch(function (err) {
//     console.log(err);
//   });