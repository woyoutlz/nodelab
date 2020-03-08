let PouchDB = require('pouchdb')
PouchDB.plugin(require('pouchdb-find'));
var db = new PouchDB('DB');
let _ = require('lodash')
function importDB(){
  const fs = require('fs');
  const path = require('path');
  const readline = require('readline');
  var rl = readline.createInterface({
    input:fs.createReadStream('KaoYanluan_1.json')
  });
  rl.on('line',(line)=>{
    var doc = JSON.parse(line)
    doc._id = doc.headWord
    db.post(doc);
  });
}
// importDB()
// db.info().then(function (info) {
//     console.log(info);
//   })
//   db.createIndex({
//     index: {fields: ['name']}
//   });
  // var doc = {"wordRank":1,"headWord":"revolt","content":{"word":{"wordHead":"revolt","wordId":"KaoYanluan_1_1","content":{"sentence":{"sentences":[{"sContent":"The prime minister is now facing a revolt by members of his own party.","sCn":"首相现在面临着党内倒戈。"},{"sContent":"the Polish revolt of 1863","sCn":"1863年的波兰起义"},{"sContent":"It was feared that the army would revolt against the government.","sCn":"有人担心军队会挥戈反对政府。"},{"sContent":"Some members of the government may revolt against this proposed legislation.","sCn":"一些政府成员可能会反对这项拟议中的法规。"}],"desc":"例句"},"usphone":"rɪ'volt","ukspeech":"revolt&type=1","star":0,"usspeech":"revolt&type=2","syno":{"synos":[{"pos":"vi","tran":"反抗；反叛；反感，厌恶","hwds":[{"w":"strive against"},{"w":"come out against"}]},{"pos":"vt","tran":"使反感；使恶心","hwds":[{"w":"sicken"}]},{"pos":"n","tran":"反抗；叛乱；反感","hwds":[{"w":"resistance"},{"w":"hate"},{"w":"rebellion"}]}],"desc":"同近"},"ukphone":"rɪ'vəʊlt","phrase":{"phrases":[{"pContent":"in revolt","pCn":"反抗；造反"},{"pContent":"revolt against","pCn":"反感；厌恶"},{"pContent":"revolt at","pCn":"厌恶；憎恶"}],"desc":"短语"},"phone":"ri'vəult, -'vɔ:lt","speech":"revolt","remMethod":{"val":"re(背)+volt(转)→把背转过来对着人→反抗","desc":"记忆"},"relWord":{"desc":"同根","rels":[{"pos":"adj","words":[{"hwd":"revolting","tran":"叛乱的；背叛的；讨厌的"}]},{"pos":"adv","words":[{"hwd":"revoltingly","tran":"背叛地；讨厌地；令人恶心地"}]},{"pos":"v","words":[{"hwd":"revolting","tran":"反叛，造反；起反感（revolt的现在分词形式）"}]}]},"trans":[{"tranCn":"反抗；造反，起义","descOther":"英释","pos":"n","descCn":"中释","tranOther":"a refusal to accept someone’s authority or obey rules or laws"},{"tranCn":"起义；反抗","descOther":"英释","pos":"v","descCn":"中释","tranOther":"if people revolt, they take strong and often violent action against the government, usually with the aim of taking power away from them"}]}}},"bookId":"KaoYanluan_1"}
  // ;
  // db.post(doc);
async function findSome(selector,limit){
  let name = await  db.find({
    selector: selector,
    // fields:["headWord","wordRank"],
    limit:limit
  })
  let words = name.docs
  return words
}
async function main(){
    let name = await  db.find({
        selector: {learned:{$exists:false}},
        // fields:["headWord","wordRank"],
        limit:1
      })
    let word = name.docs[0]
    console.log("try learn...")
    console.log(word.headWord)
    let trans = _.get(word,"content.word.content.trans")
    for(let tran of trans){
      console.log(tran.pos,tran.tranCn)
    }
    let learnedWords = await findSome({learned:true},5)
    console.log(("try guess...",learnedWords.map(i=>i.headWord)))
    await learned(word.headWord)
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
  console.log("learned",word)
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