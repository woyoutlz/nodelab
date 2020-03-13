<template>
  <div>
 <button  v-on:click="importWords">import</button>
 <button  v-on:click="learned">learned</button>
 <div v-if="showWord">
  <div>
      <h3>
          <span class="guessWord"  v-on:click="pickWord(newWord)"> {{newWord.headWord}} </span>
        <span v-for="(word,index) in learnedWords" :key='"learn"+index' class="guessWord" v-on:click="pickWord(word)" > {{word.headWord}} </span>
      </h3>
    </div>
    <hr>
   <h2>{{showWord.headWord}}</h2>
    <h4>美式:{{showWord.spoken}}</h4>
    <h4 v-for="(tran,index) in showWord.trans" :key='"tran"+index'>{{tran.pos}}---{{tran.tranCn}}</h4>
    <hr>
    <div v-for="(tran1,index) in showWord.sentences" :key='"sen"+index'>
      <h4>{{tran1.sContent}}</h4>
      <h4>{{tran1.sCn}}</h4>
    </div>
    <hr>
 </div>
  </div>
</template>

<script>
import {hello} from "./test" 
import {importDB,findSome,  learned,reviewed} from './word'
import _ from 'lodash'
// import PouchDB  from 'pouchdb'
// var db = new PouchDB('DB');
// db.put({_id:"123",name:2})
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      newWord:null,
      learnedWords: [],
      showWord: null
    }
  },
   methods:{
     importWords(){
       importDB()
     },
     async learned(){
        await learned(this.newWord.headWord)
        await this.newWordLoad()
     },
     async pickWord(word){
        word.trans = _.get(word,"content.word.content.trans")
        word.spoken = _.get(word,"content.word.content.usphone")
        word.sentences = _.get(word,"content.word.content.sentence.sentences")
        this.showWord = word
     },
   async  showNewWord(word){
    this.newWord = word
    await this.pickWord(this.newWord)
  },
  async showLearnWord(learnedWords){
    this.learnedWords = learnedWords
  },
  async  newWordLoad(){
    await reviewed(this.learnedWords)
    let words = await findSome({learned:{$exists:false}},1)
    let word = words[0]
    await this.showNewWord(word)
    let learnedWordsMore = await findSome({learned:true,repeat:{$exists:true}},10,["repeat"])
    let learnedWords = _.shuffle(learnedWordsMore).slice(0,5)
    await this.showLearnWord(learnedWords)
    // await learned(word.headWord)
    // console.log(learnedWords.map(i=>i.repeat))
    }
   },
  mounted: async function () {
      hello()
      await this.newWordLoad()
      // importDB()
    // db.get("123").catch(function(e){
    //     console.log(e);
    // }).then(function(d){
    //     console.log(d);

    //     // if _id exists, pouchdb overwrites
    //     db.put({_id:"11", value:d.value+1,_rev:d._rev});
    // });
  }
}
</script>
<style  scoped>
.guessWord {
  margin :20px ;
  cursor: pointer;
}
</style>