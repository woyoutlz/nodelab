let PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'));
var db = new PouchDB('DB');
async function findSome(selector,limit){
    let name = await  db.find({
      selector: selector,
      // fields:["headWord","wordRank"],
      limit:limit
    })
    let words = name.docs
    return words

}
async function learned(word){
    let name = await  db.find({
      selector: {_id:word},
      // fields:["headWord","wordRank"],
      limit:1
    })
    let x = name.docs[0]
    x.learned = true
    db.put(x)
  }
module.exports = {
    findSome,
    learned
}