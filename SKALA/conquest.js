'use strict';
/* World Conquest. Shared local profile keys with SKALA Classic.
   The online backend is Firebase Realtime Database; users must publish the included rules. */
const worldRoot=document.getElementById('world-root'),toast=document.getElementById('toast'),modal=document.getElementById('modal');
const ENGINE=WorldEngine,TERR=WORLD_TERRITORIES,TERR_BY_ID=Object.fromEntries(TERR.map(t=>[t.id,t]));
const FLAG_NAMES=new Map(FLAGS),VALID_FLAGS=new Set(FLAGS.map(f=>f[0]));
const PLAYER_COLORS=[{key:'red',name:'Rot',hex:'#f16f80'},{key:'blue',name:'Blau',hex:'#619df7'},{key:'green',name:'Grün',hex:'#64cc9c'},{key:'yellow',name:'Gelb',hex:'#f2cf67'},{key:'purple',name:'Lila',hex:'#b08aff'},{key:'orange',name:'Orange',hex:'#f39b63'},{key:'teal',name:'Türkis',hex:'#4ac5ca'},{key:'pink',name:'Pink',hex:'#ea89cf'}];
const COLOR_MAP=Object.fromEntries(PLAYER_COLORS.map(c=>[c.key,c]));
const SECURE_ALPHABET='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const state={mode:'home',room:null,code:'',me:'',client:null,unsubscribe:null,pending:false,demoActor:'demo1',selection:null,target:null,moveAmount:1,deployAmount:1,view:{x:0,y:0,w:1200,h:640},profileDraft:null,profileFilter:'',lastTurnKey:'',lastActionError:'',draftDeploy:{}};
let firebasePromise=null,toastTimer=null;
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function savedName(){return String(localStorage.getItem('skala_name')||'').slice(0,18);}
function savedFlag(){let f=localStorage.getItem('skala_profile_flag')||'de';return VALID_FLAGS.has(f)?f:'de';}
function flagPic(code,cls='flag-img'){const c=VALID_FLAGS.has(code)?code:'de';return `<img class="${cls}" src="https://flagcdn.com/w80/${c}.png" alt="${esc(FLAG_NAMES.get(c)||c)}" onerror="this.replaceWith(document.createTextNode('${c.toUpperCase()}'))" loading="lazy">`;}
function playerName(uid){return state.room?.players?.[uid]?.name||'Unbekannt';}
function playerHex(uid){return COLOR_MAP[state.room?.players?.[uid]?.color]?.hex||'#71829a';}
function hexOfColor(key){return COLOR_MAP[key]?.hex||'#71829a';}
function randomCode(){const x=crypto.getRandomValues(new Uint8Array(6));return Array.from(x,b=>SECURE_ALPHABET[b%SECURE_ALPHABET.length]).join('');}
function actor(){return state.mode==='demo'?state.demoActor:state.me;}
function host(){return !!state.room&&actor()===state.room.hostId;}
function active(){return !!state.room?.state&&state.room.state.current===actor();}
function gameRoom(){return state.room?.state;}
function participants(){return Object.entries(state.room?.players||{}).map(([id,p])=>({id,...p})).sort((a,b)=>(a.joinedAt||0)-(b.joinedAt||0));}
function playerList(){const people=participants();const order=state.room?.order||people.map(p=>p.id);return order.map(uid=>people.find(p=>p.id===uid)).filter(Boolean);}
function ownerStats(uid){const tiles=Object.values(gameRoom()?.board||{}).filter(t=>t.owner===uid);return {regions:tiles.length,troops:tiles.reduce((a,b)=>a+b.troops,0)};}
function message(text){toast.textContent=text;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),4500);}
function firebaseError(e){const t=String(e?.message||e);if(/permission_denied|PERMISSION_DENIED/i.test(t))return 'Firebase: Zugriff abgelehnt. Die NEUEN Weltherrschaft-Regeln müssen in Realtime Database → Rules veröffentlicht werden.';if(t.includes('auth/operation-not-allowed'))return 'Firebase: Anonyme Anmeldung einschalten.';if(t.includes('auth/invalid-api-key'))return 'Firebase: API-Key ungültig.';return t;}
async function guard(fn){if(state.pending)return;state.pending=true;try{await fn();}catch(e){console.error('Weltherrschaft:',e);message(firebaseError(e));}finally{state.pending=false;}}
async function getFirebase(){
 const config=window.SKALA_FIREBASE_CONFIG;
 if(!config?.apiKey||!config?.databaseURL)throw Error('Online-Modus: Die vorhandene firebase-config.js fehlt. Für eine Offline-Demo klicke auf „Demo testen“.');
 if(!firebasePromise)firebasePromise=(async()=>{
  const [{initializeApp},A,D]=await Promise.all([import('https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js'),import('https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js'),import('https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js')]);
  const app=initializeApp(config,'skalaWorld');const auth=A.getAuth(app);
  if(!auth.currentUser)await A.signInAnonymously(auth);
  return {auth,db:D.getDatabase(app),sdk:D};
 })().catch(e=>{firebasePromise=null;throw e;});
 return firebasePromise;
}
function inviteUrl(){return `${location.origin}${location.pathname.replace(/conquest\.html$/,'index.html')}?game=world&room=${state.code}`;}
function roomCode(){return `<div class="lobby-info"><span class="room-code">${esc(state.code)}</span><button class="outline small-btn" data-action="copy">🔗 Einladung kopieren</button></div>`;}
function demoStrip(){return state.mode==='demo'?`<div class="demo-strip"><div><strong>🧪 Testmodus</strong><div class="sub">Wechsle zwischen den 4 Spielern und teste alle Phasen.</div></div><select id="demo-actor">${participants().map(p=>`<option value="${p.id}" ${actor()===p.id?'selected':''}>${esc(p.name)}</option>`).join('')}</select></div>`:'';}
function profileNow(){const p=state.room?.players?.[actor()];return {name:p?.name||savedName(),flag:VALID_FLAGS.has(p?.flag)?p.flag:savedFlag()};}
function updateProfileButton(){const p=profileNow(),b=document.getElementById('profile-button');b.innerHTML=`${flagPic(p.flag)} <span>${esc(p.name||'Dein Profil')}</span> ⚙`;}
function home(){
 worldRoot.innerHTML=`<div class="home-world"><section class="hero-world"><div class="overline">✦ SKALA · STRATEGIEMODUS</div><h1>WELT<span style="color:#80e8c6">HERRSCHAFT</span></h1><p>42 Territorien · 6 Kontinente · 2–6 Spieler. Erobere die ganze Welt in drei Phasen pro Zug.</p></section><div class="world-actions"><section class="panel"><h2>🌐 Raum erstellen</h2><div class="sub">Sei der Host, wähle eine Farbe und lose die Spielreihenfolge aus.</div><form id="world-create"><label class="field-label">DEIN NAME</label><input name="name" maxlength="18" placeholder="Dein Name" required value="${esc(savedName())}"><button class="secondary full">Raum erstellen →</button></form></section><section class="panel"><h2>🔗 Raum beitreten</h2><div class="sub">Deine Freunde schicken dir einen sechsstelligen Raumcode.</div><form id="world-join"><label class="field-label">DEIN NAME</label><input name="name" maxlength="18" placeholder="Dein Name" required value="${esc(savedName())}"><label class="field-label">RAUMCODE</label><input name="code" maxlength="6" placeholder="ABC123" required style="text-transform:uppercase;letter-spacing:3px" value="${esc(new URLSearchParams(location.search).get('room')||'')}"><button class="primary full">Beitreten →</button></form></section></div><div class="centered" style="margin-top:24px"><button class="outline" data-action="demo">🧪 Ohne Firebase ausprobieren</button></div><p class="sub centered">Dein Name und deine Länderflagge kommen automatisch aus dem SKALA-Classic-Profil. Du kannst sie oben rechts bearbeiten.</p></div>`;
}
function colorCard(c){
 const claimed=state.room?.colors?.[c.key],isMine=claimed===actor();
 return `<button class="color-choose ${isMine?'chosen':''} ${claimed&&!isMine?'taken':''}" data-action="color" data-color="${c.key}" ${claimed&&!isMine?'disabled':''} style="--swatch:${c.hex}"><span class="color-block"></span>${esc(c.name)} ${claimed&&!isMine?'🔒':isMine?'✓':''}</button>`;
}
function rosterCard(p,compact=false){return `<div class="player-card ${compact?'compact':''}">${flagPic(p.flag)}<div class="player-info"><strong>${esc(p.name)}${p.id===state.room.hostId?' 👑':''}${p.id===actor()?' (du)':''}</strong><small><span class="swatch-dot" style="--swatch:${hexOfColor(p.color)}"></span> ${esc(COLOR_MAP[p.color]?.name||'Noch keine Farbe')}</small></div>${host()&&state.room.status==='lobby'&&p.id!==state.room.hostId?`<button class="icon-btn small-btn" data-action="kick" data-id="${esc(p.id)}" title="Kicken">✕</button>`:''}</div>`;}
function lobby(){const p=participants(),order=state.room.order||p.map(x=>x.id);
 worldRoot.innerHTML=`${demoStrip()}<div class="lobby-header"><div><div class="overline">WELTHERRSCHAFT · ONLINE-LOBBY</div><h1>Bereit für die Welt?</h1><div class="sub">${p.length}/6 Spieler im Raum · Der Host startet das Spiel.</div></div>${roomCode()}</div>
 <div class="world-lobby-grid"><section class="panel panel-pad"><div class="section-head"><h2>👥 Spieler & Flaggen</h2><span class="status-chip">${p.length} / 6</span></div><div class="player-list">${p.map(x=>rosterCard(x)).join('')}</div><p class="sub">Jeder wählt eine eigene Farbe. Sie bestimmt später die Einfärbung seiner Territorien.</p><div class="section-head" style="margin-top:26px"><h2>🎨 Deine Spielerfarbe</h2></div><div class="color-grid">${PLAYER_COLORS.map(colorCard).join('')}</div></section>
 <section class="panel panel-pad"><div class="section-head"><h2>🎲 Zugreihenfolge</h2></div><div class="sub">Die Reihenfolge wird vor dem Spiel ausgelost und bleibt dann gleich.</div><div style="margin:15px 0">${order.map((id,i)=>`<div class="order-row"><strong>${i+1}.</strong><span class="swatch-dot" style="--swatch:${playerHex(id)}"></span> ${esc(playerName(id))}${i===0?'<span>Startet</span>':''}</div>`).join('')}</div>${host()?`<button class="outline full" data-action="shuffle">🔀 Reihenfolge auslosen</button><button class="secondary full" data-action="start" style="margin-top:13px" ${p.length<2||p.length>6?'disabled':''}>Spiel starten →</button>`:'<div class="status-chip">Warte auf den Host …</div>'}<div class="sub" style="margin-top:18px">42 zufällig, aber gleichmäßig verteilte Startgebiete · zufällige Starttruppen · 3 Phasen pro Zug · keine Karten</div></section></div>`;
}
function oceanLinks(){
 const pairs=[['alaska','kamchatka'],['brazil','north_africa'],['greenland','iceland'],['iceland','great_britain'],['iceland','scandinavia'],['great_britain','scandinavia'],['southern_europe','egypt'],['north_africa','western_europe'],['southern_europe','north_africa'],['east_africa','middle_east'],['middle_east','egypt'],['siam','indonesia'],['indonesia','western_australia'],['indonesia','new_guinea'],['new_guinea','eastern_australia'],['japan','kamchatka'],['japan','mongolia'],['madagascar','south_africa'],['madagascar','east_africa']];
 return pairs.map(([a,b])=>{if(a==='alaska')return `<path class="ocean-link" d="M${TERR_BY_ID.alaska.x},${TERR_BY_ID.alaska.y} Q20,45 4,120 M1197,110 Q1170,40 ${TERR_BY_ID.kamchatka.x},${TERR_BY_ID.kamchatka.y}"/>`;
 const A=TERR_BY_ID[a],B=TERR_BY_ID[b];return `<path class="ocean-link" d="M${A.x},${A.y} Q${(A.x+B.x)/2},${(A.y+B.y)/2-17} ${B.x},${B.y}"/>`;}).join('');
}
function chosenTargets(){const g=gameRoom(),current=actor();if(!g||!active()||!state.selection)return [];
 if(g.phase==='attack'){if(g.board[state.selection]?.owner!==current||g.board[state.selection]?.troops<=1)return [];
 return TERR_BY_ID[state.selection].neighbors.filter(n=>g.board[n]?.owner!==current);}
 if(g.phase==='fortify'){if(g.board[state.selection]?.owner!==current||g.board[state.selection]?.troops<=1)return [];
 return TERR.map(x=>x.id).filter(id=>ENGINE.connected(g.board,state.selection,id,Object.fromEntries(TERR.map(t=>[t.id,t.neighbors]))));}
 return [];
}
function renderMap(){const g=gameRoom(),available=chosenTargets(),isAttack=g.phase==='attack';
 const tiles=TERR.map(t=>{const info=g.board[t.id],owner=info?.owner,color=playerHex(owner),selected=state.selection===t.id,highlight=available.includes(t.id),cls=selected?'selected':highlight?(isAttack?'attacking':'reachable'):'inactive';
 return `<g data-territory="${t.id}" tabindex="0" role="button" aria-label="${esc(t.name)}: ${info.troops} Truppen, ${esc(playerName(owner))}"><path class="land-tile ${cls}" data-territory="${t.id}" d="${t.path}" fill="${color}" fill-rule="evenodd"><title>${esc(t.name)} · ${info.troops} Truppen · ${esc(playerName(owner))}</title></path><text class="map-territory-label" x="${t.x}" y="${t.y-11}">${esc(t.label)}</text><rect class="troop-badge" x="${t.x-16}" y="${t.y-6}" width="32" height="24" rx="8"/><text class="troop-label" x="${t.x}" y="${t.y+11}">${info.troops}</text></g>`;}).join('');
 return `<div class="world-map-viewport" id="map-area"><svg class="map-svg" id="map-svg" viewBox="${state.view.x} ${state.view.y} ${state.view.w} ${state.view.h}" xmlns="http://www.w3.org/2000/svg" role="group" aria-label="Interaktive Weltkarte mit 42 Territorien"><defs><pattern id="sea" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M0,28 L28,0" stroke="#2f7691" opacity=".12" stroke-width="1"/></pattern></defs><rect x="0" y="0" width="1200" height="640" fill="url(#sea)"/><text class="map-watermark" x="445" y="365">ATLANTIK</text><text class="map-watermark" x="819" y="535">INDISCHER OZEAN</text><text class="map-watermark" x="65" y="410">PAZIFIK</text>${oceanLinks()}${tiles}</svg></div><div class="map-controls"><span class="map-help">Gebiete anklicken · Scrollen zum Zoomen · Karte ziehen</span><span class="map-btns"><button class="outline small-btn" data-action="zoom-in">＋</button><button class="outline small-btn" data-action="zoom-out">－</button><button class="outline small-btn" data-action="map-reset">⤢</button></span></div>`;
}
function phaseLabel(p){return {reinforce:'Verstärkung',attack:'Angriff',fortify:'Befestigung',occupy:'Gebiet sichern',victory:'Weltherrschaft'}[p]||p;}
function num(n){return Number(n).toLocaleString('de-DE');}
function actionArea(){const g=gameRoom(),you=active(),phase=g.phase,selected=state.selection,t=selected?TERR_BY_ID[selected]:null,territory=t?g.board[selected]:null,own=territory?.owner===actor(),targets=chosenTargets();let html='';
 if(!you)return `<div class="small-stat"><span class="stat-label">GERADE DRAN</span><strong>${esc(playerName(g.current))}</strong></div><p class="sub">Du kannst die Weltkarte anschauen, aber nur der aktive Spieler kann Truppen platzieren oder Angriffe starten.</p>`;
 if(phase==='reinforce'){
  let remain=deploymentRemaining(),planned=(g.remaining||0)-remain;html=`<div class="small-stat"><span class="stat-label">NOCH ZU VERTEILEN</span><strong>${num(remain)} Truppen</strong></div><p class="sub">Klicke ein <b>eigenes Territorium</b> an und verteile deine Verstärkungen.</p>`;
  if(selected&&own&&remain>0){html+=`<div class="small-stat"><strong style="font-size:16px">${esc(t.name)}</strong><div class="sub">Vorhanden: ${territory.troops+(state.draftDeploy[selected]||0)}</div></div><div class="side-actions"><button class="outline" data-action="deploy" data-amount="1">＋ 1 Truppe</button><button class="outline" data-action="deploy" data-amount="5" ${remain<5?'disabled':''}>＋ 5 Truppen</button><button class="secondary" data-action="deploy" data-amount="${remain}">Alle ${remain} hier platzieren</button></div>`;}
  html+=planned>0?`<div class="small-stat" style="margin-top:14px"><div class="action-readout"><span>Vorgemerkt (sofort sichtbar)</span><strong>${planned}</strong></div><div class="sub">Noch frei: ${remain}</div></div><div class="side-actions"><button class="outline" data-action="undo-deploy">↶ Auswahl zurücksetzen</button><button class="secondary" data-action="confirm-deploy">${remain===0?'✓ Bestätigen & zum Angriff →':'✓ '+planned+' Truppen bestätigen'}</button></div>`:
   `<div style="margin-top:17px"><button class="primary full" data-action="next-phase" ${remain>0?'disabled':''}>Weiter zum Angriff →</button></div>`;
 }else if(phase==='attack'){
  html=`<p class="sub">Wähle ein eigenes Gebiet mit mindestens zwei Truppen. Rot umrandete Nachbarn kannst du angreifen.</p>`;
  if(t){html+=`<div class="small-stat"><strong style="font-size:17px">${esc(t.name)}</strong><div class="sub">${territory.troops} Truppen · ${esc(playerName(territory.owner))}</div></div>`;}
  if(selected&&own&&territory.troops>1){html+=`<p class="sub">Alle ${territory.troops-1} verfügbaren Truppen greifen automatisch an. Eine bleibt zurück.</p>`;}
  if(state.target&&selected&&own&&targets.includes(state.target)){
   const opp=g.board[state.target],p=ENGINE.chance(territory.troops-1,opp.troops);
   html+=`<div class="small-stat"><span class="stat-label">ANGRIFFSZIEL</span><strong style="font-size:17px">${esc(TERR_BY_ID[state.target].name)}</strong><div class="sub">${territory.troops-1} gegen ${opp.troops} Truppen</div><div class="chance-display">${Math.round(p*100)} %</div><div class="sub">Eroberungschance · Truppenverluste variieren.</div></div><button class="secondary full" data-action="attack">⚔ Angriff bestätigen</button>`;
  }else if(selected&&own&&territory.troops>1){html+=`<div class="sub">${targets.length} erreichbare Angriffsziele · Wähle ein gegnerisches Gebiet auf der Karte.</div>`;}
  html+=`<button class="outline full" data-action="next-phase" style="margin-top:12px">Angriffe beenden →</button>`;
 }else if(phase==='occupy'){
  const pp=g.pending,from=TERR_BY_ID[pp.from],to=TERR_BY_ID[pp.to],total=pp.total;
  state.moveAmount=Math.max(1,Math.min(total-1,state.moveAmount));
  html=`<div class="small-stat"><strong>🎉 Gebiet erobert!</strong><p class="sub">Verteile deine Truppen im geöffneten Fenster.</p><button class="secondary full" data-action="show-occupy">Truppen verteilen</button></div>`;
 }else if(phase==='fortify'){
  html=`<p class="sub">Verschiebe einmal Truppen zwischen eigenen verbundenen Gebieten. Mindestens eine muss zurückbleiben.</p>`;
  if(t){html+=`<div class="small-stat"><strong style="font-size:17px">${esc(t.name)}</strong><div class="sub">${territory.troops} Truppen · ${own?'Eigenes Gebiet':'Fremdes Gebiet'}</div></div>`;}
  if(state.target&&selected&&own&&targets.includes(state.target)){
   state.moveAmount=Math.max(1,Math.min(territory.troops-1,state.moveAmount));
   html+=`<div class="small-stat"><strong style="font-size:16px">→ ${esc(TERR_BY_ID[state.target].name)}</strong><div class="action-readout">Verschieben <strong id="fortify-amount">${state.moveAmount}</strong></div><input id="fortify-slider" type="range" min="1" max="${territory.troops-1}" value="${state.moveAmount}"/><div class="sub">Ziel: ${g.board[state.target].troops+state.moveAmount} Truppen</div></div><button class="secondary full" data-action="fortify">Truppen verschieben & Zug beenden</button>`;
  }else if(selected&&own&&territory.troops>1){html+=`<div class="sub">Wähle ein grün umrandetes, verbundenes eigenes Gebiet.</div>`;}
  html+=`<button class="outline full" data-action="next-phase" style="margin-top:12px">Befestigung überspringen →</button>`;
 }
 return html;
}
function rosterGame(){const g=gameRoom();return `<div class="player-roster">${playerList().map(p=>{let s=ownerStats(p.id);return `<div class="roster-entry ${g.current===p.id?'active':''}">${flagPic(p.flag)}<span class="swatch-dot" style="--swatch:${hexOfColor(p.color)}"></span><div class="roster-meta"><strong>${esc(p.name)}${p.id===actor()?' (du)':''}${g.current===p.id?' ✦':''}</strong><small>${s.regions} Gebiete · ${s.troops} Truppen</small></div></div>`;}).join('')}</div>`;}
function game(){const g=gameRoom();if(!g)return;const key=g.turn+':'+g.current+':'+g.phase;
 if(state.lastTurnKey && state.lastTurnKey!==key){state.selection=null;state.target=null;state.moveAmount=1;state.draftDeploy={};}state.lastTurnKey=key;
 if(document.getElementById('map-svg')){updateGameUI();return;}
 const you=active(),rein=ENGINE.reinforcement(g.board,g.current,TERR);
 worldRoot.innerHTML=`${demoStrip()}<div class="game-upper"><div><div class="overline">SKALA · WELTHERRSCHAFT</div><div style="font:800 30px 'Space Grotesk'">Zug <span id="world-turn-number">${g.turn}</span> <span class="caption" style="font-size:14px">· <span id="world-turn-phase">${esc(phaseLabel(g.phase))}</span></span></div></div><div class="lobby-info"><span id="world-turn-badge" class="turn-badge">${you?'✨ Du bist am Zug!':`Am Zug: ${esc(playerName(g.current))}`}</span>${roomCode()}</div></div>
 <div class="game-columns"><div><section class="panel map-panel">${renderMap()}</section><section class="panel other-box"><div class="section-head"><h2>Spieler & Territorien</h2><span class="caption">${Object.keys(g.board).length} / 42 Gebiete</span></div><div id="world-roster">${rosterGame()}</div></section><section class="panel other-box"><div class="section-head"><h2>Letzte Ereignisse</h2></div><div class="game-log" id="world-log">${(g.log||[]).length?(g.log||[]).map(x=>`<div>• ${esc(x.text)}</div>`).join(''):'<div>Das Spiel hat begonnen.</div>'}</div></section></div>
 <aside class="panel info-sidebar"><div class="overline">AKTUELLE PHASE</div><h2 id="world-phase-heading">${esc(phaseLabel(g.phase))}</h2><div class="phase-indicator" id="world-phases">${[['reinforce','1 · Verstärken'],['attack','2 · Angriff'],['fortify','3 · Befestigen']].map(([k,name])=>`<div class="phase-step ${k===g.phase||k==='attack'&&g.phase==='occupy'?'active':''}">${name}</div>`).join('')}</div><div id="world-actions-area">${actionArea()}</div><div style="margin-top:23px;border-top:1px solid #465171;padding-top:17px"><div class="overline">VERSTÄRKUNGEN</div><div class="sub">4 mindestens oder 1 pro 3 Gebiete (größerer Wert), plus Kontinentalboni.</div>${rein.bonuses.length?rein.bonuses.map(c=>`<div class="action-readout">${esc(c.name)} <strong style="font-size:14px">+${c.bonus}</strong></div>`).join(''):'<p class="sub">Noch kein vollständig kontrollierter Kontinent.</p>'}</div></aside></div>`;
 setupMapHandlers();
 updateGameUI();
}
const occupyModal=document.getElementById('occupy-modal');
let lastOccupyKey='';
function syncOccupyModal(){
 const g=gameRoom();if(!g||g.phase!=='occupy'||!active()||!g.pending){occupyModal.hidden=true;occupyModal.innerHTML='';lastOccupyKey='';return;}
 const pp=g.pending;const key=[g.turn,g.current,pp.from,pp.to,pp.total].join(':');
 if(lastOccupyKey===key && !occupyModal.hidden)return;
 lastOccupyKey=key;state.moveAmount=Math.max(1,Math.min(pp.total-1,state.moveAmount));
 const from=TERR_BY_ID[pp.from],to=TERR_BY_ID[pp.to];
 occupyModal.hidden=false;
 occupyModal.innerHTML=`<section class="modal-card occupy-card" role="dialog" aria-modal="true" aria-labelledby="occupy-title">
  <div style="font-size:32px">🏆</div><div class="overline">GEBIET EROBERT</div><h2 id="occupy-title">Gebiet erobert!</h2>
  <p class="sub">Du hast ${esc(to.name)} erobert. Lege fest, wie viele Truppen in ${esc(from.name)} zurückbleiben.</p>
  <div class="occupy-route">${esc(from.name)} → ${esc(to.name)}</div>
  <label for="occupy-modal-slider" class="field-label">TRUPPENVERTEILUNG</label>
  <input id="occupy-modal-slider" type="range" min="1" max="${pp.total-1}" value="${state.moveAmount}" aria-label="Truppen zurücklassen">
  <div class="occupy-modal-readout"><div><small>Bleiben zurück</small><strong id="occupy-left">${state.moveAmount}</strong><small>${esc(from.name)}</small></div><div><small>Ziehen ein</small><strong id="occupy-enter">${pp.total-state.moveAmount}</strong><small>${esc(to.name)}</small></div></div>
  <button class="secondary occupy-confirm" data-action="occupy-confirm">✓ Verteilung bestätigen</button>
  <p class="sub" style="font-size:12px;margin-top:12px">Mindestens eine Truppe in jedem Gebiet.</p>
 </section>`;
 window.SKALAI18N?.apply();
 occupyModal.querySelector('button')?.focus();
}
occupyModal.addEventListener('input',e=>{if(e.target.id!=='occupy-modal-slider')return;state.moveAmount=Number(e.target.value);document.getElementById('occupy-left').textContent=state.moveAmount;document.getElementById('occupy-enter').textContent=gameRoom().pending.total-state.moveAmount;});
occupyModal.addEventListener('click',e=>{const btn=e.target.closest('[data-action="occupy-confirm"]');if(!btn||state.pending)return;btn.disabled=true;guard(async()=>{try{await gameAction({type:'occupy',leave:state.moveAmount})}finally{btn.disabled=false;}});});

function updateGameUI(){
 const g=gameRoom(),svg=document.getElementById('map-svg');if(!g||!svg)return;
 const targets=new Set(chosenTargets()),attacking=g.phase==='attack';
 for(const t of TERR){
  const info=g.board[t.id];if(!info)continue;
  const group=svg.querySelector(`g[data-territory="${t.id}"]`);
  if(!group)continue;
  const tile=group.querySelector('path.land-tile');
  const cls=state.selection===t.id?'selected':targets.has(t.id)?(attacking?'attacking':'reachable'):'inactive';
  tile.setAttribute('class',`land-tile ${cls}`);
  tile.setAttribute('fill',playerHex(info.owner));
  group.querySelector('.troop-label').textContent=info.troops+(state.draftDeploy[t.id]||0);
  group.setAttribute('aria-label',`${t.name}: ${info.troops} Truppen, ${playerName(info.owner)}`);
 }
 const set=(id,value)=>{const e=document.getElementById(id);if(e)e.textContent=value;};
 set('world-turn-number',g.turn);set('world-turn-phase',phaseLabel(g.phase));
 set('world-turn-badge',active()?'✨ Du bist am Zug!':`Am Zug: ${playerName(g.current)}`);
 set('world-phase-heading',phaseLabel(g.phase));
 const steps=document.querySelectorAll('#world-phases .phase-step');
 steps.forEach((step,i)=>step.classList.toggle('active',(['reinforce','attack','fortify'][i]===g.phase)||(i===1&&g.phase==='occupy')));
 const area=document.getElementById('world-actions-area');if(area)area.innerHTML=actionArea();
 const roster=document.getElementById('world-roster');if(roster)roster.innerHTML=rosterGame();
 const log=document.getElementById('world-log');if(log)log.innerHTML=(g.log||[]).length?g.log.map(x=>`<div>• ${esc(x.text)}</div>`).join(''):'<div>Das Spiel hat begonnen.</div>';
 syncOccupyModal();
}
function deploymentRemaining(){const g=gameRoom();return (g?.remaining||0)-Object.values(state.draftDeploy).reduce((a,b)=>a+b,0);}
function draftTroops(n){
 const g=gameRoom(),id=state.selection;
 if(!g||g.phase!=='reinforce'||!active()||g.board[id]?.owner!==actor())return;
 const amount=Math.min(n,deploymentRemaining());
 if(amount<=0)return;
 state.draftDeploy[id]=(state.draftDeploy[id]||0)+amount;
 updateGameUI();
}
function resetDraft(){state.draftDeploy={};updateGameUI();}
function victory(){const g=gameRoom(),win=g.winner,player=state.room.players?.[win];worldRoot.innerHTML=`${demoStrip()}<section class="panel victory-panel"><div style="font-size:62px">🏆</div><div class="overline">SPIEL BEENDET</div><h1>Weltherrschaft!</h1><div style="display:flex;justify-content:center;align-items:center;gap:12px">${flagPic(player?.flag)}<strong style="font-size:22px;color:${playerHex(win)}">${esc(player?.name||'Ein Spieler')}</strong></div><p class="sub">Alle 42 Territorien sind erobert. Glückwunsch zum Sieg!</p><button class="secondary" data-action="back-menu">↖ Zur Spielauswahl</button></section>`;}
function render(){if(!gameRoom()||gameRoom().phase!=='occupy')syncOccupyModal();updateProfileButton();if(!state.room){home();return;}if(state.room.status==='lobby')lobby();else if(gameRoom()?.status==='finished')victory();else game();}
function setQuery(code){history.replaceState(null,'',`${location.pathname}?room=${encodeURIComponent(code)}`);}
function clearSession(){if(state.unsubscribe){state.unsubscribe();state.unsubscribe=null;}state.mode='home';state.room=null;state.code='';state.me='';state.client=null;state.selection=null;state.target=null;state.lastTurnKey='';state.draftDeploy={};localStorage.removeItem('skala_world_room');history.replaceState(null,'',location.pathname);render();}
function attach(code,client){if(state.unsubscribe){state.unsubscribe();state.unsubscribe=null;}state.mode='online';state.room=null;state.code=code;state.me=client.auth.currentUser.uid;state.client=client;
 const {sdk,db}=client;state.unsubscribe=sdk.onValue(sdk.ref(db,`conquestRooms/${code}`),snap=>{const r=snap.val();if(!r){clearSession();message('Lobby existiert nicht mehr.');return;}if(!r.players?.[state.me]){const wasKicked=!!r.kicked?.[state.me];clearSession();message(wasKicked?'Du wurdest vom Host aus der Lobby entfernt.':'Du bist nicht mehr im Raum.');return;}state.room=r;render();},e=>message(firebaseError(e)));
 localStorage.setItem('skala_world_room',code);setQuery(code);
}
async function createOnline(name){const client=await getFirebase(),{sdk,db,auth}=client,uid=auth.currentUser.uid;
 for(let attempt=0;attempt<7;attempt++){const code=randomCode(),r={hostId:uid,status:'lobby',createdAt:Date.now(),players:{[uid]:{name,flag:savedFlag(),color:'red',joinedAt:Date.now()}},colors:{red:uid},order:[uid]};
  const tx=await sdk.runTransaction(sdk.ref(db,`conquestRooms/${code}`),val=>val===null?r:undefined,{applyLocally:false});if(tx.committed){state.room=null;attach(code,client);return;}
 }throw Error('Kein freier Raumcode gefunden.');}
async function joinOnline(name,code){code=code.toUpperCase();if(!/^[A-Z0-9]{6}$/.test(code))throw Error('Raumcode muss genau 6 Zeichen haben.');const client=await getFirebase(),{sdk,db,auth}=client,uid=auth.currentUser.uid;
 const r=(await sdk.get(sdk.ref(db,`conquestRooms/${code}`))).val();if(!r)throw Error('Raum nicht gefunden.');if(r.kicked?.[uid])throw Error('Der Host hat dich aus diesem Raum ausgeschlossen.');
 if(!r.players?.[uid]){if(r.status!=='lobby')throw Error('Dieses Spiel läuft bereits.');if(Object.keys(r.players||{}).length>=6)throw Error('Der Raum ist voll (maximal 6 Spieler).');let color=PLAYER_COLORS.find(c=>!r.colors?.[c.key]);if(!color)throw Error('Keine freie Farbe vorhanden.');
  await sdk.update(sdk.ref(db,`conquestRooms/${code}`),{[`players/${uid}`]:{name,flag:savedFlag(),color:color.key,joinedAt:Date.now()},[`colors/${color.key}`]:uid});
  // Joining needs to be included in order before starting. Host may reshuffle later.
  const latest=(await sdk.get(sdk.ref(db,`conquestRooms/${code}/order`))).val()||[];
  if(!latest.includes(uid)){try{await sdk.runTransaction(sdk.ref(db,`conquestRooms/${code}/order`),old=>{const list=Array.isArray(old)?old:[];return list.includes(uid)?undefined:[...list,uid];},{applyLocally:false});}catch(e){console.warn('Order update',e);}}
 }
 attach(code,client);
}
async function pickColor(color){const room=state.room,uid=actor();if(room.status!=='lobby'||!COLOR_MAP[color])return;
 if(room.colors?.[color] && room.colors[color]!==uid)throw Error('Diese Farbe ist bereits vergeben.');const old=room.players[uid].color;if(old===color)return;
 if(state.mode==='demo'){delete room.colors[old];room.colors[color]=uid;room.players[uid].color=color;render();return;}
 const {db,sdk}=state.client;await sdk.update(sdk.ref(db,`conquestRooms/${state.code}`),{[`players/${uid}/color`]:color,[`colors/${color}`]:uid,[`colors/${old}`]:null});}
async function shuffleLobby(){if(!host()||state.room.status!=='lobby')return;
 const order=ENGINE.shuffle(participants().map(p=>p.id));if(state.mode==='demo'){state.room.order=order;render();}else{const {db,sdk}=state.client;await sdk.set(sdk.ref(db,`conquestRooms/${state.code}/order`),order);}}
async function startLobby(){if(!host()||state.room.status!=='lobby')return;
 const players=participants();if(players.length<2||players.length>6)throw Error('Benötigt werden 2–6 Spieler.');if(new Set(players.map(p=>p.color)).size!==players.length)throw Error('Die Spielerfarben dürfen nicht doppelt vorkommen.');
 let order=(state.room.order||[]).filter(id=>state.room.players[id]);for(const p of players)if(!order.includes(p.id))order.push(p.id);
 const start=ENGINE.createState(order,TERR);
 if(state.mode==='demo'){state.room.status='playing';state.room.state=start;state.room.order=order;state.selection=null;state.target=null;state.lastTurnKey='';render();return;}
 const {db,sdk}=state.client;await sdk.update(sdk.ref(db,`conquestRooms/${state.code}`),{status:'playing',order,state:start});}
async function kick(id){if(!host()||state.room.status!=='lobby'||id===state.room.hostId)return;let p=state.room.players[id];if(!p)return;if(!await SKALAI18N.confirm(`${p.name} aus der Lobby entfernen?`,{title:'Spieler entfernen?',yes:'Entfernen',danger:true}))return;
 const order=(state.room.order||[]).filter(x=>x!==id);
 if(state.mode==='demo'){delete state.room.players[id];delete state.room.colors[p.color];state.room.order=order;render();return;}
 const {sdk,db}=state.client;await sdk.update(sdk.ref(db,`conquestRooms/${state.code}`),{[`players/${id}`]:null,[`colors/${p.color}`]:null,[`kicked/${id}`]:true,order});}
function demo(){const ids=['demo1','demo2','demo3','demo4'],names=[savedName()||'Du (Host)','Alex','Mia','Ben'];state.mode='demo';state.me='demo1';state.demoActor='demo1';state.client=null;state.code='DEMO42';state.lastTurnKey='';state.selection=null;state.target=null;
 state.room={hostId:ids[0],status:'lobby',players:Object.fromEntries(ids.map((id,i)=>[id,{name:names[i],flag:i===0?savedFlag():['de','ki','jp','br'][i],color:PLAYER_COLORS[i].key,joinedAt:i+1}])),colors:Object.fromEntries(ids.map((id,i)=>[PLAYER_COLORS[i].key,id])),order:ids};render();message('Demo gestartet. Du kannst die Spieler-Perspektive wechseln.');}
async function gameAction(action){const g=gameRoom();if(!g||!active())return;
 if(state.mode==='demo'){state.room.state=ENGINE.applyAction(g,action,actor(),TERR);state.selection=null;state.target=null;state.moveAmount=1;render();return;}
 const {sdk,db}=state.client;const path=sdk.ref(db,`conquestRooms/${state.code}/state`);let localErr=null;
 const result=await sdk.runTransaction(path,current=>{
  if(!current)return undefined;
  try{return ENGINE.applyAction(current,action,actor(),TERR);}catch(e){localErr=e;return undefined;}
 },{applyLocally:false});
 if(!result.committed){if(localErr)throw localErr;throw Error('Der Spielstand hat sich geändert. Versuche es erneut.');}
 state.selection=null;state.target=null;state.moveAmount=1;
}
function territoryClick(id){const g=gameRoom();if(!g||!TERR_BY_ID[id])return;
 if(!active()){state.selection=id;state.target=null;render();return;}
 const team=actor(),owns=g.board[id].owner===team,mode=g.phase;
 if(mode==='occupy')return;
 if(mode==='reinforce'){state.selection=id;state.target=null;render();return;}
 if(mode==='attack'||mode==='fortify'){
  if(state.selection && id!==state.selection && chosenTargets().includes(id)){state.target=id;state.moveAmount=1;render();return;}
  if(owns){state.selection=id;state.target=null;state.moveAmount=1;render();return;}
  state.selection=id;state.target=null;render();
 }
}
function zoomAt(factor,px=600,py=320){const v=state.view,ratio=factor,w=Math.max(360,Math.min(1200,v.w*ratio)),h=w*640/1200;
 let fx=(px-v.x)/v.w,fy=(py-v.y)/v.h;v.x=Math.max(0,Math.min(1200-w,px-fx*w));v.y=Math.max(0,Math.min(640-h,py-fy*h));v.w=w;v.h=h;
 document.getElementById('map-svg')?.setAttribute('viewBox',`${v.x} ${v.y} ${v.w} ${v.h}`);
}
function setupMapHandlers(){const svg=document.getElementById('map-svg');if(!svg)return;let start=null,moved=false;
 svg.addEventListener('pointerdown',e=>{if(e.button!==0)return;start={x:e.clientX,y:e.clientY,v:{...state.view},el:e.target.closest('[data-territory]')};moved=false;svg.setPointerCapture(e.pointerId);});
 svg.addEventListener('pointermove',e=>{if(!start)return;let dx=e.clientX-start.x,dy=e.clientY-start.y;if(Math.abs(dx)+Math.abs(dy)>7)moved=true;if(!moved)return;
 let box=svg.getBoundingClientRect();let v=state.view,w=start.v.w,h=start.v.h;v.x=Math.max(0,Math.min(1200-w,start.v.x-dx*w/box.width));v.y=Math.max(0,Math.min(640-h,start.v.y-dy*h/box.height));svg.setAttribute('viewBox',`${v.x} ${v.y} ${v.w} ${v.h}`);
 });
 svg.addEventListener('pointerup',e=>{if(!start)return;let el=start.el;start=null;if(!moved&&el)territoryClick(el.dataset.territory);});
 svg.addEventListener('pointercancel',()=>{start=null;});
 svg.addEventListener('keydown',e=>{const el=e.target.closest('[data-territory]');if(el&&(e.key==='Enter'||e.key===' ')){e.preventDefault();territoryClick(el.dataset.territory);}});
 svg.addEventListener('wheel',e=>{e.preventDefault();const box=svg.getBoundingClientRect(),px=state.view.x+(e.clientX-box.left)/box.width*state.view.w,py=state.view.y+(e.clientY-box.top)/box.height*state.view.h;zoomAt(e.deltaY>0?1.16:.86,px,py);},{passive:false});
}
function openProfile(){const p=profileNow();state.profileDraft={...p};state.profileFilter='';modal.hidden=false;
 modal.innerHTML=`<section class="modal-card" role="dialog" aria-modal="true" aria-label="Profil"><div class="modal-head"><h2>⚙ Dein Profil</h2><button class="icon-btn" data-modal="close">✕</button></div><div class="profile-preview"><span class="profile-flag" id="prof-flag">${flagPic(p.flag)}</span><div><strong id="prof-label">${esc(p.name||'Spieler')}</strong><p id="prof-country">${esc(FLAG_NAMES.get(p.flag)||'')}</p></div></div><form id="prof-form"><label class="field-label">SPIELERNAME (MAX. 18)</label><input id="prof-name" maxlength="18" required value="${esc(p.name)}"><label class="field-label">LÄNDERFLAGGE</label><input id="prof-filter" placeholder="Kiribati, Deutschland, USA …"><div class="flag-grid" id="prof-flags"></div><button class="primary full" type="submit">Profil speichern</button></form></section>`;
 flagChoices();
}
function flagChoices(){const q=state.profileFilter.toLowerCase();document.getElementById('prof-flags').innerHTML=FLAGS.filter(f=>(f[1]+' '+(window.SKALAI18N?.countryName(f[0])||'')).toLowerCase().includes(q)).map(([c,n])=>`<button class="flag-choice ${state.profileDraft.flag===c?'chosen':''}" data-flag="${c}" type="button">${flagPic(c)}<small>${esc(n)}</small></button>`).join('')||'<p>Kein Land gefunden</p>';}
async function saveProfile(){const name=document.getElementById('prof-name').value.trim(),flag=state.profileDraft.flag;
 if(!name||name.length>18||!VALID_FLAGS.has(flag))throw Error('Wähle einen Namen und eine Länderflagge.');
 if(state.mode==='online'&&state.room){const {sdk,db}=state.client,base=`conquestRooms/${state.code}/players/${state.me}`;
  // Only the name and flag leaf nodes are mutable after joining.
  await sdk.update(sdk.ref(db,base),{name,flag});
 }else if(state.mode==='demo'&&state.room){state.room.players[actor()].name=name;state.room.players[actor()].flag=flag;}
 localStorage.setItem('skala_name',name);localStorage.setItem('skala_profile_flag',flag);modal.hidden=true;render();message('Profil gespeichert!');
}
async function copyInvite(){try{await navigator.clipboard.writeText(inviteUrl());message('Einladungslink kopiert.');}catch(e){message(`Dein Raumcode: ${state.code}`);}}
async function restore(){const code=(new URLSearchParams(location.search).get('room')||'').toUpperCase(),stored=localStorage.getItem('skala_world_room');if(!stored||!code||stored!==code)return;
 try{const c=await getFirebase();const snap=await c.sdk.get(c.sdk.ref(c.db,`conquestRooms/${code}`));if(snap.exists()&&snap.val().players?.[c.auth.currentUser.uid]){attach(code,c);}}catch(e){console.warn('Welt-Raum konnte nicht wiederhergestellt werden',e);}
}
worldRoot.addEventListener('submit',e=>{const f=e.target;if(!['world-create','world-join'].includes(f.id))return;e.preventDefault();guard(async()=>{const name=f.elements.name.value.trim();if(!name||name.length>18)throw Error('Name muss 1 bis 18 Zeichen haben.');localStorage.setItem('skala_name',name);if(f.id==='world-create')await createOnline(name);else await joinOnline(name,f.elements.code.value.trim().toUpperCase());});});
worldRoot.addEventListener('change',e=>{if(e.target.id==='demo-actor'){state.demoActor=e.target.value;state.selection=null;state.target=null;render();}});
worldRoot.addEventListener('input',e=>{if(e.target.id==='occupy-slider'){state.moveAmount=Number(e.target.value);document.getElementById('left-amount').textContent=state.moveAmount;document.getElementById('enter-amount').textContent=gameRoom().pending.total-state.moveAmount;}if(e.target.id==='fortify-slider'){state.moveAmount=Number(e.target.value);document.getElementById('fortify-amount').textContent=state.moveAmount;}});
worldRoot.addEventListener('click',e=>{const b=e.target.closest('[data-action]');if(!b)return;const type=b.dataset.action;
 if(type==='demo'){demo();return;}if(type==='copy'){copyInvite();return;}
 if(type==='color'){guard(()=>pickColor(b.dataset.color));return;}
 if(type==='shuffle'){guard(shuffleLobby);return;}
 if(type==='start'){guard(startLobby);return;}
 if(type==='kick'){guard(()=>kick(b.dataset.id));return;}
 if(type==='deploy'){draftTroops(Number(b.dataset.amount));return;}
 if(type==='undo-deploy'){resetDraft();return;}
 if(type==='confirm-deploy'){
  const amount=Object.values(state.draftDeploy).reduce((a,b)=>a+b,0);
  if(!amount)return;
  const placements={...state.draftDeploy},finish=deploymentRemaining()===0;
  guard(async()=>{await gameAction({type:'deploy-batch',placements,finish});state.draftDeploy={};render();});return;
 }
 if(type==='next-phase'){const g=gameRoom();guard(()=>gameAction({type:{reinforce:'end-reinforce',attack:'end-attack',fortify:'end-fortify'}[g.phase]}));return;}
 if(type==='attack'){const from=state.selection,to=state.target;if(!to)return;SKALAI18N.confirm(`Angriff auf ${TERR_BY_ID[to]?.name} ausführen?`,{title:'Angriff bestätigen',yes:'⚔ Angreifen'}).then(ok=>{if(ok)guard(()=>gameAction({type:'attack',from,to}));});return;}
 if(type==='occupy'){guard(()=>gameAction({type:'occupy',leave:state.moveAmount}));return;}if(type==='show-occupy'){lastOccupyKey='';syncOccupyModal();return;}
 if(type==='fortify'){guard(()=>gameAction({type:'fortify',from:state.selection,to:state.target,amount:state.moveAmount}));return;}
 if(type==='zoom-in'){zoomAt(.8);return;}if(type==='zoom-out'){zoomAt(1.25);return;}if(type==='map-reset'){state.view={x:0,y:0,w:1200,h:640};render();return;}
 if(type==='back-menu'){location.assign('./index.html');return;}
});
document.getElementById('profile-button').onclick=openProfile;
modal.addEventListener('click',e=>{if(e.target===modal||e.target.closest('[data-modal="close"]')){modal.hidden=true;return;}const f=e.target.closest('[data-flag]');if(!f)return;state.profileDraft.flag=f.dataset.flag;document.getElementById('prof-flag').innerHTML=flagPic(f.dataset.flag);document.getElementById('prof-country').textContent=FLAG_NAMES.get(f.dataset.flag);flagChoices();});
modal.addEventListener('input',e=>{if(e.target.id==='prof-filter'){state.profileFilter=e.target.value;flagChoices();}if(e.target.id==='prof-name')document.getElementById('prof-label').textContent=e.target.value||'Spieler';});
modal.addEventListener('submit',e=>{if(e.target.id==='prof-form'){e.preventDefault();guard(saveProfile);}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)modal.hidden=true;});
render();restore();
