const vorpal = require('vorpal')()
const {
    findSome,
    learned
} = require("./word")
let _ = require('lodash')
let learnedWords = []
async function showword(word){
    console.log(word.headWord)
    let trans = _.get(word,"content.word.content.trans")
    for(let tran of trans){
      console.log(tran.pos,tran.tranCn)
    }
}
async function newWord(){
    let words = await findSome({learned:{$exists:false}},1)
    let word = words[0]
    console.log("try learn...")
    await showword(word)
    learnedWords = await findSome({learned:true},5)
    console.log(("try guess...",learnedWords.map(i=>i.headWord)))
    await learned(word.headWord)
}
function more(n){
    return async function (){
       await showword(learnedWords[n])
    }
}
let commandObj = {
    n:newWord,
    q:function(){
        process.exit(0)
    },
    1:more(0),
    2:more(1),
    3:more(2),
    4:more(3),
    5:more(4),
}
let all = Object.keys(commandObj)

for (let key of all){
    let command =  key + ' [args...]'
    vorpal
    .command(command)
    // ..autocomplete(['corn', 'steak', 'pasta'])
    // .option('-v, --verbose', 'Print foobar instead.')
    // .description('Outputs "bar".')
    // .alias('foosball')
    .action(async function(args, callback) {
        if (!commandObj[key]){
            console.log("没有这个命令")
            callback()
            return
        }
        let s =  await commandObj[key](args.args)
        console.log(s)
        callback();
    })
}

vorpal
.delimiter('myapp$')
.show();

vorpal.exec('n');