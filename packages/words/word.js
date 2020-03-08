let PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'));
var db = new PouchDB('DB');
async function findSome(selector,limit,sort){
    let findobj = {
        selector: selector,
        // fields:["headWord","wordRank"],
        limit:limit
      }
      if (sort){
        findobj.sort = sort
      }
    let name = await  db.find(findobj)
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
    x.repeat = 0
    db.put(x)
  }
async function reviewed(words){
    if (!words){
        return
    }
    for (let word of words){
        if (!word.repeat){
            word.repeat = 0
        }
        word.repeat = word.repeat + 1
        db.put(word)
    }
}
module.exports = {
    findSome,
    learned,
    reviewed
}