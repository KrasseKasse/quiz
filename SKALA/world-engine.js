/* SKALA Weltherrschaft: original virtual-board-game logic.
   Classic dice probabilities with a deliberately custom 7% balanced-blitz cutoff.
   Browser-only multiplayer remains a trust-based game; see README. */
(function(root){
'use strict';
const CONTINENTS={na:{name:'Nordamerika',bonus:5},sa:{name:'Südamerika',bonus:2},eu:{name:'Europa',bonus:5},af:{name:'Afrika',bonus:3},as:{name:'Asien',bonus:7},oc:{name:'Australien',bonus:2}};
const START_ARMIES={2:40,3:35,4:30,5:25,6:20};
const MAX_PLAYERS=6;
const ROLLS={};
const oddsCache=new Map();
function int(n){return Number.isInteger(n)&&n>=0;}
function randomInt(max){if(!max||max<=0)return 0;if(typeof crypto!=='undefined'&&crypto.getRandomValues){let bytes=new Uint32Array(1);crypto.getRandomValues(bytes);return bytes[0]%max;}return Math.floor(Math.random()*max);}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=randomInt(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}
function diceResults(a,d){
 const key=a+':'+d;if(ROLLS[key])return ROLLS[key];
 let results={};let aa=6**a,dd=6**d;
 for(let i=0;i<aa;i++){
  let v=i,A=[];for(let j=0;j<a;j++){A.push((v%6)+1);v=Math.floor(v/6);}A.sort((x,y)=>y-x);
  for(let j=0;j<dd;j++){
   let w=j,D=[];for(let k=0;k<d;k++){D.push((w%6)+1);w=Math.floor(w/6);}D.sort((x,y)=>y-x);
   let lostA=0,lostD=0;for(let k=0;k<Math.min(a,d);k++)A[k]>D[k]?lostD++:lostA++;
   let k=lostA+':'+lostD;results[k]=(results[k]||0)+1;
  }
 }
 return ROLLS[key]=Object.entries(results).map(([key,count])=>{let [da,defLoss]=key.split(':').map(Number);return {da,dd:defLoss,p:count/(aa*dd)};});
}
function exactOdds(a,d){
 if(d<=0)return 1;if(a<=0)return 0;
 // Large-scale caps stay performant. At very high troop counts use ratio approximation;
 // all ordinary opening battles use exact dice-state probabilities.
 if(a>110||d>110){let z=(a-1.18*d)/Math.sqrt(a+d);return 1/(1+Math.exp(-1.7*z));}
 const key=a+':'+d;if(oddsCache.has(key))return oddsCache.get(key);
 let x=0;for(const e of diceResults(Math.min(3,a),Math.min(2,d)))x+=e.p*exactOdds(a-e.da,d-e.dd);
 oddsCache.set(key,x);return x;
}
function chance(a,d){
 a=Math.floor(a);d=Math.floor(d);if(a<=0)return 0;if(d<=0)return 1;
 let p=exactOdds(a,d);
 if(p<=.07)return 0;if(p>=.93)return 1;
 const q=Math.pow(p,1.32),r=Math.pow(1-p,1.32);return q/(q+r);
}
function battle(a,d){
 if(!int(a)||!int(d)||a<1||d<1)throw Error('Ungültige Truppenzahl.');
 const winChance=chance(a,d),win=Math.random()<winChance;
 let A=a,D=d;
 if(a>110||d>110){ // estimate casualties when exact DP is impractical
  while(A>0&&D>0){const options=diceResults(Math.min(3,A),Math.min(2,D));let r=Math.random(),next=options.at(-1);for(const e of options){r-=e.p;if(r<=0){next=e;break;}}A-=next.da;D-=next.dd;}
  if(win && A===0) A=1,D=0;
  if(!win && D===0)D=1,A=0;
 }else{
  while(A>0&&D>0){
   const options=diceResults(Math.min(3,A),Math.min(2,D));
   const weights=options.map(e=>e.p*(win?exactOdds(A-e.da,D-e.dd):1-exactOdds(A-e.da,D-e.dd)));
   let total=weights.reduce((x,y)=>x+y,0),r=Math.random()*total,choice=options.at(-1);
   if(total<1e-14){ // should be unreachable at ordinary troop counts
    let x=Math.random();for(const e of options){x-=e.p;if(x<=0){choice=e;break;}}
   }else{
    for(let i=0;i<options.length;i++){r-=weights[i];if(r<=0){choice=options[i];break;}}
   }
   A-=choice.da;D-=choice.dd;
  }
 }
 return {win:win,attackersLeft:win?Math.max(1,A):0,defendersLeft:win?0:Math.max(1,D),winChance:winChance};
}
function connected(board,from,to,adj){
 if(from===to)return false;if(!board[from]||!board[to])return false;
 const uid=board[from].owner;if(board[to].owner!==uid)return false;
 let stack=[from],seen=new Set([from]);while(stack.length){const x=stack.pop();for(const n of adj[x]||[]){if(n===to)return true;if(!seen.has(n)&&board[n]?.owner===uid){seen.add(n);stack.push(n);}}}return false;
}
function reinforcement(board,uid,territories){
 const owned=territories.filter(t=>board[t.id]?.owner===uid);let base=Math.max(4,Math.floor(owned.length/3));
 const bonuses=[];for(const [key,info] of Object.entries(CONTINENTS)){
  const group=territories.filter(t=>t.continent===key);
  if(group.length && group.every(t=>board[t.id]?.owner===uid)){base+=info.bonus;bonuses.push({name:info.name,bonus:info.bonus});}
 }
 return {total:base,bonuses,territories:owned.length};
}
function createState(playerIds,territories){
 if(playerIds.length<2||playerIds.length>MAX_PLAYERS)throw Error('Es müssen 2 bis 6 Spieler dabei sein.');
 if(territories.length!==42)throw Error('Die Karte muss genau 42 Gebiete haben.');
 let order=[...playerIds],ids=shuffle(territories.map(t=>t.id));let board={};
 for(let i=0;i<ids.length;i++)board[ids[i]]={owner:order[i%order.length],troops:1};
 const armies=START_ARMIES[order.length];
 for(const uid of order){
  let own=ids.filter(id=>board[id].owner===uid),extra=armies-own.length;
  while(extra-->0)board[own[randomInt(own.length)]].troops++;
 }
 const first=order[0];
 return {status:'playing',order,current:first,phase:'reinforce',turn:1,board,remaining:reinforcement(board,first,territories).total,pending:null,log:[],winner:null,updatedAt:Date.now()};
}
function applyAction(old,act,actor,territories){
 if(!old||old.status!=='playing'||old.current!==actor)throw Error('Du bist gerade nicht am Zug.');
 const state=JSON.parse(JSON.stringify(old)),board=state.board,adj=Object.fromEntries(territories.map(t=>[t.id,t.neighbors]));
 const own=id=>!!board[id]&&board[id].owner===actor;
 const count=uid=>Object.values(board).filter(t=>t.owner===uid).length;
 const pushLog=txt=>{state.log=[{text:txt,time:Date.now()},...(state.log||[])].slice(0,14);};
 function nextPlayer(){
  const living=state.order.filter(uid=>count(uid)>0);
  if(living.length===1){state.status='finished';state.phase='victory';state.winner=living[0];pushLog('Die gesamte Welt wurde erobert!');return;}
  const idx=state.order.indexOf(actor);let next;
  for(let i=1;i<=state.order.length;i++){const uid=state.order[(idx+i)%state.order.length];if(living.includes(uid)){next=uid;break;}}
  state.current=next;state.turn++;state.phase='reinforce';state.remaining=reinforcement(board,next,territories).total;state.pending=null;
  pushLog('Der nächste Spieler ist dran.');
 }
 if(act.type==='deploy-batch'){
  if(state.phase!=='reinforce')throw Error('Verstärkungsphase ist bereits vorbei.');
  const adds=act.placements;
  if(!adds||typeof adds!=='object'||Array.isArray(adds))throw Error('Ungültige Truppenverteilung.');
  const entries=Object.entries(adds),sum=entries.reduce((acc,[id,n])=>acc+(Number(n)||0),0);
  if(entries.length===0||!int(sum)||sum<1||sum>state.remaining)throw Error('Ungültige Verstärkungsanzahl.');
  for(const [id,n] of entries)if(!own(id)||!int(n)||n<1)throw Error('Du kannst nur eigene Gebiete verstärken.');
  for(const [id,n] of entries)board[id].troops+=n;
  state.remaining-=sum;
  if(act.finish){if(state.remaining!==0)throw Error('Noch nicht alle Truppen verteilt.');state.phase='attack';}
 }else if(act.type==='deploy'){
  if(state.phase!=='reinforce'||!own(act.to))throw Error('Du darfst nur deine eigenen Gebiete verstärken.');
  const n=Number(act.amount);if(!int(n)||n<1||n>state.remaining)throw Error('Nicht genügend Truppen verfügbar.');
  board[act.to].troops+=n;state.remaining-=n;
 }else if(act.type==='end-reinforce'){
  if(state.phase!=='reinforce'||state.remaining!==0)throw Error('Verteile erst alle Verstärkungen.');state.phase='attack';
 }else if(act.type==='attack'){
  if(state.phase!=='attack'||!own(act.from)||!board[act.to]||board[act.to].owner===actor||!adj[act.from].includes(act.to)||board[act.from].troops<2)throw Error('Dieser Angriff ist nicht möglich.');
  const target=territories.find(t=>t.id===act.to),source=territories.find(t=>t.id===act.from);
  const attacking=board[act.from].troops-1;const result=battle(attacking,board[act.to].troops);
  if(result.win){
    board[act.from].troops=1;board[act.to]={owner:actor,troops:result.attackersLeft};
    state.pending={from:act.from,to:act.to,total:1+result.attackersLeft};
    state.phase='occupy';pushLog(`${source.name} erobert ${target.name}!`);
    if(Object.values(board).every(t=>t.owner===actor)){state.status='finished';state.phase='victory';state.winner=actor;state.pending=null;}
  }else{
    board[act.from].troops=1;board[act.to].troops=result.defendersLeft;
    pushLog(`${source.name} scheitert gegen ${target.name}.`);
  }
 }else if(act.type==='occupy'){
  if(state.phase!=='occupy'||!state.pending)throw Error('Kein erobertes Gebiet wartet auf die Aufteilung.');
  const n=Number(act.leave),pending=state.pending;
  if(!int(n)||n<1||n>=pending.total)throw Error('Mindestens eine Truppe muss in jedem Gebiet bleiben.');
  board[pending.from].troops=n;board[pending.to].troops=pending.total-n;state.pending=null;state.phase='attack';
 }else if(act.type==='end-attack'){
  if(state.phase!=='attack')throw Error('Diese Phase kann noch nicht beendet werden.');state.phase='fortify';
 }else if(act.type==='fortify'){
  if(state.phase!=='fortify'||!own(act.from)||!own(act.to)||!connected(board,act.from,act.to,adj))throw Error('Die Gebiete müssen durch dein Reich verbunden sein.');
  const n=Number(act.amount);if(!int(n)||n<1||n>=board[act.from].troops)throw Error('Mindestens eine Truppe muss zurückbleiben.');
  board[act.from].troops-=n;board[act.to].troops+=n;pushLog('Truppen wurden befestigt.');nextPlayer();
 }else if(act.type==='end-fortify'){
  if(state.phase!=='fortify')throw Error('Befestigung ist noch nicht dran.');nextPlayer();
 }else throw Error('Unbekannte Aktion.');
 state.updatedAt=Date.now();return state;
}
const api={CONTINENTS,START_ARMIES,shuffle,chance,exactOdds,battle,connected,reinforcement,createState,applyAction};
root.WorldEngine=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
