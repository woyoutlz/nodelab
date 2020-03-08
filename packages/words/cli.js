const vorpal = require('vorpal')()
const {
    findSome,
    learned,
    reviewed
} = require("./word")
let _ = require('lodash')
let learnedWords = []
async function showword(word){
    console.log(word.headWord,word.repeat)
    let trans = _.get(word,"content.word.content.trans")
    let spoken = _.get(word,"content.word.content.usphone")
    let sentences = _.get(word,"content.word.content.sentence.sentences")
    console.log("美式:",spoken)
    for(let tran of trans){
      console.log(tran.pos,tran.tranCn)
    }
    for(let s of sentences){
        console.log(s.sContent)
        console.log(s.sCn)
    }
}
async function newWord(){
    await reviewed(learnedWords)
    let words = await findSome({learned:{$exists:false}},1)
    let word = words[0]
    console.log("try learn...")
    await showword(word)
    learnedWords = await findSome({learned:true,repeat:{$exists:true}},5,["repeat"])
    console.log(("try guess...",learnedWords.map(i=>i.headWord)))
    await learned(word.headWord)
    // console.log(learnedWords.map(i=>i.repeat))
}
function more(n){
    return async function (){
       let wordReview = learnedWords[n]
       if (!wordReview.repeat){
        wordReview.repeat = 0
       }
       wordReview.repeat = wordReview.repeat-1
       await showword(wordReview)
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
        await commandObj[key](args.args)
        callback();
    })
}

vorpal
.delimiter('myapp$')
.show();

vorpal.exec('n');