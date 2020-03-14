<template>
  <div   v-hotkey="keymap">
 <button  v-on:click="importWords">import</button>
 <button  v-on:click="learned">learned</button>
 <div v-if="showWord">
  <div>
      <h3>
        <span v-for="(word,index) in showWords" :key='"learn"+index' class="guessWord" v-bind:class="{ picked: isPicked(index) }" v-on:click="pickWordIndex(index)" > {{word.headWord}} </span>
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
    <h5>{{showWord.repeat}}</h5>
    <hr>
 </div>
  </div>
</template>

<script>
import {initDB,findSome,  learned,reviewed} from './word'
import _ from 'lodash'
import Vue from 'vue'
import VueHotkey from 'v-hotkey'

Vue.use(VueHotkey)
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
      showWords:[],
      currentIndex:0,
      showWord: null,
      keymap:{
        'enter': this.learned,
        'w': this.learned,
        'd':this.pickright,
        'a':this.pickleft,
        's':this.fucked
      }
    }
  },
   methods:{
     importWords(){
       initDB()
     },
     async learned(){
        await learned(this.newWord.headWord)
        await reviewed(this.learnedWords)
        await this.newWordLoad()
     },
     async fucked(){
       let wordReview = this.showWords[this.currentIndex]
       if (!wordReview.repeat){
        wordReview.repeat = 0
       }
       wordReview.repeat = wordReview.repeat-1
     },
     isPicked(index){
       if (index === this.currentIndex){
         return true
       }
       return false
     },
     async pickright(){
       if (this.currentIndex < this.showWords.length - 1){
         await this.pickWordIndex(this.currentIndex+1)
       }
     },
     async pickleft(){
       if (this.currentIndex >0){
         await this.pickWordIndex(this.currentIndex-1)
       }
     },
     async pickWord(word){
        word.trans = _.get(word,"content.word.content.trans")
        word.spoken = _.get(word,"content.word.content.usphone")
        word.sentences = _.get(word,"content.word.content.sentence.sentences")
        this.showWord = word
     },
     async pickWordIndex(index){
       this.currentIndex = index
       let word = this.showWords[index]
       await this.pickWord(word)
     },
   async  showNewWord(word){
    word.new = true
    this.newWord = word
    this.showWords = [this.newWord]
    await this.pickWordIndex(0)
  },
  async showLearnWord(learnedWords){
    this.learnedWords = learnedWords
    this.showWords = this.showWords.concat(learnedWords)
  },
  async  newWordLoad(){
    let words = await findSome({learned:{$exists:false}},1)
    let word = words[0]
    await this.showNewWord(word)
    let learnedWordsMore = await findSome({learned:true,repeat:{$exists:true}},10,["repeat"])
    let learnedWords = _.shuffle(learnedWordsMore).slice(0,5)
    await this.showLearnWord(learnedWords)
    }
   },
  mounted: async function () {
      await this.importWords()
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
.picked{
   text-decoration: underline; 
   /* 好像是在某些浏览器不可用，firfox */
  text-underline-position: under; 
}
</style>