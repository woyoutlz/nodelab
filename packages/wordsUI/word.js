import PouchDB from 'pouchdb'
import find from 'pouchdb-find'
PouchDB.plugin(find);
var db = new PouchDB('DB');
import kaoyan from './KaoYanluan_1.json'
export async function findSome(selector,limit,sort){
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
export async function learned(word){
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
export async function reviewed(words){
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
export function importDB(){
  for (let doc of kaoyan){
    doc._id = doc.headWord
    db.post(doc)
  }
  db.createIndex({
    index: {fields: ['repeat']}
  });
  // console.log("imported")
}
