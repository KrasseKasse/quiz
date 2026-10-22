/* SKALA V3 — shared, persistent DE/EN language, no translation service required. */
(()=>{'use strict';
const KEY='skala_language';let lang=localStorage.getItem(KEY)==='en'?'en':'de';
const pairs=`
✦ DEINE PARTY-GAME-PLATTFORM|✦ YOUR PARTY GAME PLATFORM
Ein Ort.|One place.
Zwei Welten.|Two worlds.
Wähle dein Spiel. Dein Name und deine Länderflagge begleiten dich in beide Modi.|Choose your game. Your name and country flag stay with you in both modes.
TEAMS|TEAMS
Eine geheime Zahl, ein Hinweis – und ein Team, das dich verstehen muss.|One secret number, one clue — and a team that has to understand you.
Classic spielen|Play Classic
WELTHERRSCHAFT|WORLD DOMINATION
STRATEGIE|STRATEGY
42 Gebiete, sechs Kontinente, ein Ziel: Die gesamte Karte gehört dir.|42 territories, six continents, one goal: conquer the entire map.
Welt erobern|Conquer the world
Keine Installation · Online-Lobbys mit Raumcode · Ein gemeinsames Profil|No installation · Online lobbies with room codes · One shared profile
Dein SKALA-Profil|Your SKALA profile
Dein Profil|Your profile
Profil|Profile
Profil bearbeiten|Edit profile
Profil schließen|Close profile
Profil speichern|Save profile
Profil gespeichert!|Profile saved!
SPIELERNAME|PLAYER NAME
DEIN NAME|YOUR NAME
DEIN SPIELERNAME|YOUR PLAYER NAME
Spielername|Player name
Dein Spielername|Your player name
DEIN NAME|YOUR NAME
Spieler|Player
LÄNDERFLAGGE SUCHEN|SEARCH COUNTRY FLAGS
LÄNDERFLAGGE WÄHLEN|CHOOSE A COUNTRY FLAG
Land suchen|Search for a country
Keine Flagge gefunden.|No flag found.
Kein Land gefunden|No country found
Flagge wählen|Choose a flag
Zufällige Flagge|Random flag
Abbrechen|Cancel
Bestätigen|Confirm
Schließen|Close
Zurück|Back
← Spiele|← Games
Raum erstellen|Create room
Raum beitreten|Join room
Raumcode|Room code
RAUMCODE|ROOM CODE
Einladungslink kopieren|Copy invite link
Einladung kopieren|Copy invitation
Warte auf den Host …|Waiting for the host …
Raum starten|Start room
Spiel starten|Start game
SPIEL BEENDET|GAME OVER
WELT|WORLD
HERRSCHAFT|DOMINATION
42 Territorien · 6 Kontinente · 2–6 Spieler. Erobere die ganze Welt in drei Phasen pro Zug.|42 territories · 6 continents · 2–6 players. Conquer the world in three phases per turn.
✦ SKALA · STRATEGIEMODUS|✦ SKALA · STRATEGY MODE
Sei der Host, wähle eine Farbe und lose die Spielreihenfolge aus.|Host a room, choose a color and randomize turn order.
Deine Freunde schicken dir einen sechsstelligen Raumcode.|Your friends send you a six-character room code.
Beitreten|Join
🧪 Ohne Firebase ausprobieren|🧪 Try offline demo
Dein Name und deine Länderflagge kommen automatisch aus dem SKALA-Classic-Profil. Du kannst sie oben rechts bearbeiten.|Your name and flag come from your shared SKALA Classic profile. Edit them at the top right.
🧪 Testmodus|🧪 Demo mode
Wechsle zwischen den 4 Spielern und teste alle Phasen.|Switch between four players and try every phase.
WELTHERRSCHAFT · ONLINE-LOBBY|WORLD DOMINATION · ONLINE LOBBY
Bereit für die Welt?|Ready to conquer the world?
Spieler im Raum · Der Host startet das Spiel.|players in room · The host starts the game.
👥 Spieler & Flaggen|👥 Players & flags
Jeder wählt eine eigene Farbe. Sie bestimmt später die Einfärbung seiner Territorien.|Each player chooses a unique color. It determines the color of their territories.
🎨 Deine Spielerfarbe|🎨 Your player color
🎲 Zugreihenfolge|🎲 Turn order
Die Reihenfolge wird vor dem Spiel ausgelost und bleibt dann gleich.|Turn order is randomized before the match and stays the same.
Startet|Starts
🔀 Reihenfolge auslosen|🔀 Shuffle turn order
42 zufällig, aber gleichmäßig verteilte Startgebiete · zufällige Starttruppen · 3 Phasen pro Zug · keine Karten|42 territories shared as evenly as possible · random starting troops · 3 phases per turn · no cards
Noch keine Farbe|No color yet
Rot|Red
Blau|Blue
Grün|Green
Gelb|Yellow
Lila|Purple
Orange|Orange
Türkis|Teal
Pink|Pink
(du)|(you)
Du bist am Zug!|It's your turn!
Am Zug:|Turn:
Zug|Turn
Verstärkung|Reinforcement
Angriff|Attack
Befestigung|Fortification
Gebiet sichern|Move troops
1 · Verstärken|1 · Reinforce
2 · Angriff|2 · Attack
3 · Befestigen|3 · Fortify
AKTUELLE PHASE|CURRENT PHASE
VERSTÄRKUNGEN|REINFORCEMENTS
NOCH ZU VERTEILEN|TROOPS TO PLACE
GERADE DRAN|CURRENT PLAYER
ANGRIFFSZIEL|ATTACK TARGET
Spieler & Territorien|Players & territories
Letzte Ereignisse|Recent events
Das Spiel hat begonnen.|The game has begun.
4 mindestens oder 1 pro 3 Gebiete (größerer Wert), plus Kontinentalboni.|At least 4 troops, or 1 per 3 territories (whichever is greater), plus continent bonuses.
Noch kein vollständig kontrollierter Kontinent.|No continent fully controlled yet.
Du kannst die Weltkarte anschauen, aber nur der aktive Spieler kann Truppen platzieren oder Angriffe starten.|You can view the map, but only the active player can place troops or attack.
Klicke ein|Select one of your
Klicke ein eigenes Territorium an und verteile deine Verstärkungen.|Select your territory and distribute your reinforcements.
eigenes Territorium|own territories
an und verteile deine Verstärkungen.|to distribute reinforcements.
Vorhanden:|Current:
＋ 1 Truppe|＋ 1 troop
＋ 5 Truppen|＋ 5 troops
Vorgemerkt (sofort sichtbar)|Queued (shown immediately)
Noch frei:|Remaining:
↶ Auswahl zurücksetzen|↶ Reset selection
✓ Bestätigen & zum Angriff →|✓ Confirm & attack →
Weiter zum Angriff →|Continue to attack →
Wähle ein eigenes Gebiet mit mindestens zwei Truppen. Rot umrandete Nachbarn kannst du angreifen.|Select your territory with at least two troops. Red-outlined neighbors are valid attack targets.
Eroberungschance · Truppenverluste variieren.|Chance of conquest · troop losses vary.
⚔ Angriff bestätigen|⚔ Confirm attack
Angriffe beenden →|End attacks →
Wähle ein gegnerisches Gebiet auf der Karte.|Choose an enemy territory on the map.
Verschiebe einmal Truppen zwischen eigenen verbundenen Gebieten. Mindestens eine muss zurückbleiben.|Move troops once between your connected territories. At least one troop must remain behind.
Eigenes Gebiet|Your territory
Fremdes Gebiet|Enemy territory
Verschieben|Move
Truppen verschieben & Zug beenden|Move troops & end turn
Wähle ein grün umrandetes, verbundenes eigenes Gebiet.|Choose a green-outlined, connected territory you own.
Befestigung überspringen →|Skip fortification →
Gebiete anklicken · Scrollen zum Zoomen · Karte ziehen|Click territories · Scroll to zoom · Drag to pan
GEBIET EROBERT|TERRITORY CONQUERED
Gebiet erobert!|Territory conquered!
Bleiben zurück|Stay behind
Ziehen ein|Move in
Verteilung bestätigen|Confirm troop movement
🎉 Gebiet erobert! Bestimme, wie viele der|🎉 Territory conquered! Choose how many of the
überlebenden Truppen im Ausgangsgebiet bleiben.|surviving troops stay in the original territory.
Alle|All
hier platzieren|place here
Truppen bestätigen|troops: confirm
Truppen|troops
Truppe|troop
Gebiete|territories
Gebiet|territory
Spieler|players
Noch nicht alle Truppen verteilt.|Not all troops have been placed.
Weltherrschaft!|World domination!
Alle 42 Territorien sind erobert. Glückwunsch zum Sieg!|All 42 territories conquered. Congratulations!
↖ Zur Spielauswahl|↖ Game selection
Nordamerika|North America
Südamerika|South America
Europa|Europe
Afrika|Africa
Asien|Asia
Australien|Australia
Nordwestterritorium|Northwest Territory
Grönland|Greenland
Westliche USA|Western United States
Östliche USA|Eastern United States
Zentralamerika|Central America
Brasilien|Brazil
Argentinien|Argentina
Island|Iceland
Großbritannien|Great Britain
Skandinavien|Scandinavia
Nordeuropa|Northern Europe
Westeuropa|Western Europe
Südeuropa|Southern Europe
Ukraine|Ukraine
Nordafrika|North Africa
Ägypten|Egypt
Ostafrika|East Africa
Kongo|Congo
Südafrika|South Africa
Madagaskar|Madagascar
Sibirien|Siberia
Jakutien|Yakutsk
Kamtschatka|Kamchatka
Mongolei|Mongolia
Indien|India
Siam / Südostasien|Siam / Southeast Asia
Naher Osten|Middle East
Indonesien|Indonesia
Neuguinea|New Guinea
Westaustralien|Western Australia
Ostaustralien|Eastern Australia
NW-Terr.|NW Territory
West-USA|W. USA
Ost-USA|E. USA
Z-Amerika|Central America
W-Europa|W. Europe
N-Europa|N. Europe
S-Europa|S. Europe
N-Afrika|N. Africa
O-Afrika|E. Africa
W-Australien|W. Australia
O-Australien|E. Australia
Unbekannt|Unknown
Keine Spieler|No players
Team Rot|Team Red
Team Blau|Team Blue
🔴 Team Rot|🔴 Team Red
🔵 Team Blau|🔵 Team Blue
🔴 TEAM ROT|🔴 TEAM RED
🔵 TEAM BLAU|🔵 TEAM BLUE
RATE NICHT IRGENDETWAS. RATE DIE ZAHL.|DON'T GUESS ANYTHING. GUESS THE NUMBER.
Wie sehr ist es|How much is it
 eine 7?| a 7?
Eine Zahl von 1 bis 10. Ein Hinweis. Zwei Teams. Wie gut könnt ihr einschätzen, was eure Freunde meinen?|A number from 1 to 10. One clue. Two teams. How well can you read your friends' minds?
Sei der Host, lade deine Freunde ein und entscheide, welche Kategorien gespielt werden.|Be the host, invite your friends, and choose the categories.
Du hast von einem Freund einen Raumcode bekommen? Dann komm direkt ins Team.|Got a room code from a friend? Join the team!
Deine Flagge kannst du oben rechts im Profil ändern.|Change your flag in the profile menu at the top right.
Erst mal kostenlos mit Demo-Spielern testen ↗|Try a free game with demo players ↗
✓ Mehrspielermodus eingerichtet · Freunde können über Links mitspielen|✓ Multiplayer enabled · Friends can join via links
🧪 Demo-Modus|🧪 Demo mode
Spiele alle Rollen in diesem Browser. Es sind keine echten Freunde verbunden.|Play every role in this browser. No real friends are connected.
Demo-Perspektive wechseln|Switch demo player
Spielerverwaltung|Player management
👑 Spielerverwaltung|👑 Player management
Spieler in ein anderes Team verschieben oder aus dem Raum kicken.|Move players to the other team or remove them from the room.
Der aktuelle Hinweisgeber kann erst nach seiner Runde geändert werden. Jedes Team braucht beim Spielen mindestens zwei Spieler.|The current clue giver can only be moved after their round. Each team needs at least two players.
WARTERAUM|LOBBY
Gleich geht’s los!|Almost ready!
Spieler im Raum · Vorschau der Teams|players in the room · Team preview
👥 Deine Teams|👥 Your teams
🎯 Kategorien|🎯 Categories
aktiv|active
Von chillig bis extrem: Zu jeder Kategorie gibt es die Skala 1–10.|From chill to extreme: each category uses a 1–10 scale.
EIGENE KATEGORIE HINZUFÜGEN|ADD YOUR OWN CATEGORY
Zum Start braucht jedes Team mindestens zwei Spieler.|Each team needs at least two players to start.
Du bist der Host 👑|You're the host 👑
Warte, bis der Host startet …|Waiting for the host to start …
Teile den Raumcode mit deinen Freunden und mach dich bereit.|Share the room code with friends and get ready.
DAS SPIEL LÄUFT|GAME IN PROGRESS
Zahl oder Zufall?|Number or luck?
Runde|Round
Die Kategorie|The category
DIE KATEGORIE|THE CATEGORY
AUFLÖSUNG|REVEAL
Und die Zahl war …|And the number was …
Die geheime Zahl|The secret number
DU BIST DER HINWEISGEBER|YOU GIVE THE CLUE
Finde das perfekte Beispiel!|Find the perfect example!
Nur du siehst deine geheime Zahl.|Only you can see your secret number.
HINWEIS WIRD GESUCHT|WAITING FOR A CLUE
ist am Zug|is taking their turn
Gleich bekommst du einen Begriff. Überlege dann, welche Zahl dazu passt.|You'll get a clue soon. Think about which number fits.
Das andere Team ist an der Reihe. Gleich geht’s weiter.|The other team is up. Your turn will come soon.
Warten auf Hinweis|Waiting for clue
EURE AUFGABE: ZAHL ERRATEN|YOUR TASK: GUESS THE NUMBER
Besprecht euch und ein Teammitglied gibt eure gemeinsame Schätzung ab.|Discuss it, then one teammate submits your guess.
DEIN HINWEIS IST RAUS|CLUE SUBMITTED
Dein Team überlegt gerade …|Your team is discussing …
Du darfst nichts mehr verraten. Gleich wird der Tipp aufgelöst.|You can't reveal anything else. The guess will be revealed soon.
Warten auf den Team-Tipp|Waiting for team guess
DAS ANDERE TEAM RÄT|THE OTHER TEAM GUESSES
Ihr dürft mitdenken 👀|You can think along 👀
Ihr seht das Wort mit, dürft aber nicht raten.|You can see the clue, but you can't guess.
Team berät sich|Team discussing
TIPP ABGEGEBEN|GUESS SUBMITTED
Die Auflösung kommt!|The reveal is coming!
Die Zahl wird aufgedeckt|Revealing the number
Letzte Runden|Recent rounds
Unentschieden!|It's a tie!
Was für eine Runde!|What a game!
Gleich dran|Up soon
Jetzt dran|Up now
wartet|waiting
Wartet|Waiting
Kicken|Kick
Beenden|End
Runde überspringen|Skip round
Weiter|Continue
Exakt richtig:|Exactly right:
Punkte|points
Punkt|point
Reihenfolge:|Order:
Rot|Red
Blau|Blue
Kategorien|Categories
Wie nervig ist das Schulfach?|How annoying is this school subject?
Mega chillig|Super chill
Extrem nervig|Extremely annoying
Wie lecker ist dieses Essen?|How tasty is this food?
Ungenießbar|Inedible
Unglaublich lecker|Incredibly delicious
Wie peinlich ist diese Situation?|How embarrassing is this situation?
Gar nicht peinlich|Not embarrassing
Maximal peinlich|Extremely embarrassing
Wie cool ist dieses Tier?|How cool is this animal?
Langweilig|Boring
Legendär|Legendary
Wie schwierig ist dieses Videospiel?|How difficult is this video game?
Kinderleicht|Super easy
Unmöglich|Impossible
Wie gruselig ist das?|How scary is this?
Überhaupt nicht|Not at all
Absoluter Horror|Absolutely terrifying
Wie anstrengend ist dieser Sport?|How exhausting is this sport?
Entspannt|Relaxed
Total erschöpfend|Totally exhausting
Wie schön ist dieser Urlaubsort?|How beautiful is this vacation spot?
Gar nicht schön|Not beautiful at all
Traumhaft|Dreamlike
Wie stark ist diese Superkraft?|How strong is this superpower?
Ziemlich nutzlos|Pretty useless
Völlig OP|Totally OP
Wie nervig ist dieses Geräusch?|How annoying is this sound?
Angenehm|Pleasant
Nicht auszuhalten|Unbearable
Wie gut ist dieses Getränk?|How good is this drink?
Schmeckt schrecklich|Tastes terrible
Perfekt|Perfect
Wie gefährlich ist dieses Minecraft-Mob?|How dangerous is this Minecraft mob?
Ungefährlich|Harmless
Sehr gefährlich|Very dangerous
Wie hilfreich ist dieser Gegenstand?|How helpful is this item?
Komplett nutzlos|Completely useless
Super praktisch|Super useful
Wie gemütlich ist dieser Ort?|How cozy is this place?
Unbequem|Uncomfortable
Super gemütlich|Super cozy
`;const map=new Map(pairs.trim().split('\n').map(line=>{const n=line.indexOf('|');return [line.slice(0,n),line.slice(n+1)];}));

const extras=`
✦ DAS 1–10 PARTYSPIEL|✦ THE 1–10 PARTY GAME
eine 7?|a 7?
Raum erstellen →|Create room →
Raum beitreten →|Join room →
Spiel starten →|Start game →
Spiel beenden|End game
Spiel beenden?|End the game?
Spiel wirklich beenden?|Are you sure you want to end the game?
Spieler entfernen?|Remove player?
Entfernen|Remove
Runde überspringen?|Skip this round?
Runde überspringen|Skip round
Die aktuelle Runde wirklich ohne Punkte überspringen?|Really skip this round without awarding points?
Angriff bestätigen|Confirm attack
⚔ Angreifen|⚔ Attack
Angegriffenes Gebiet|Attacked territory
Spiel gestartet.|Game started.
TRUPPENVERTEILUNG|TROOP MOVEMENT
Truppen zurücklassen|Leave troops behind
✓ Verteilung bestätigen|✓ Confirm troop movement
Verteile deine Truppen im geöffneten Fenster.|Choose how to distribute your troops in the popup.
Truppen verteilen|Move troops
Mindestens eine Truppe in jedem Gebiet.|At least one troop in each territory.
Vorhanden:|Current:
Noch frei:|Still available:
Aktuell:|Currently:
✓ Bestätigen & zum Angriff →|✓ Confirm & attack →
Zurück zur Lobby|Back to lobby
Alberta|Alberta
Québec|Quebec
Skand.|Scand.
ATLANTIK|ATLANTIC
INDISCHER OZEAN|INDIAN OCEAN
PAZIFIK|PACIFIC
Du (Host)|You (Host)
Demo gestartet. Du kannst die Spieler-Perspektive wechseln.|Demo started. Switch between players to test the game.
Spieler im Raum|players in the room
🔗 Einladung kopieren|🔗 Copy invitation
⧉ Kopieren|⧉ Copy
Noch niemand hier|Nobody here yet
Ohne Änderungen durch den Host werden die Teams beim Spielstart zufällig aufgeteilt.|Without host changes, teams are randomized when the game starts.
👑 Deine Team-Einteilung bleibt beim Spielstart erhalten.|👑 Your team selection will be kept when the game starts.
Danach ist abwechselnd Rot → Blau dran.|Turns then alternate Red → Blue.
1 BEDEUTET|1 MEANS
10 BEDEUTET|10 MEANS
＋ Kategorie hinzufügen|＋ Add category
Spiel starten →|Start game →
SPIELDAUER|GAME LENGTH
Unendlich|Unlimited
Warten auf Start|Waiting to start
Warten auf den Hinweis|Waiting for the clue
Warten auf den Team-Tipp|Waiting for the team guess
Noch keine Flagge|No flag yet
🚩 Flaggen wählen|🚩 Choose flags
DEIN PROFIL|YOUR PROFILE
Bitte gib einen Namen mit 1–18 Zeichen ein.|Please enter a name with 1–18 characters.
Das Profil wird im Browser gespeichert. In Online-Räumen sehen andere Spieler deine Änderungen direkt.|Your profile is saved in this browser. Other players see your changes instantly in online rooms.
🔗 Einladungslink kopieren|🔗 Copy invite link
Kopieren|Copy
Zahl oder Zufall?|Number or luck?
Zahl von 1 bis 10 auswählen|Choose a number from 1 to 10
Wähle zuerst eine Zahl|Choose a number first
Hinweis senden →|Send clue →
Dein Begriff oder Beispiel|Your clue word or example
Zahl erneut laden ↻|Reload number ↻
Geheime Zahl wird geladen …|Loading secret number …
Welche Zahl meint|Which number does
Überlege: Was passt in dieser Kategorie zu einer|Think: What fits this category at
Ein Spieler|A player
euer Teammitglied|your teammate
Sonst: 0|Otherwise: 0
🎯 Exakt richtig:|🎯 Exact guess:
Hängende Runde überspringen ↪|Skip stalled round ↪
Falls es hängt: Runde jetzt auflösen|If stuck: reveal the round now
3 Punkte|3 points
Kategorie|Category
Noch nicht eingerichtet.|Not set up yet.
Online-Modus noch nicht eingerichtet.|Online mode is not set up yet.
Die Demo funktioniert sofort. Für echte Räume mit Freunden musst du einmal Firebase verbinden – die Schritte stehen in|The demo works immediately. To play online with friends, connect Firebase as explained in
ANLEITUNG.md|ANLEITUNG.md
1 BEDEUTET|1 MEANS
10 BEDEUTET|10 MEANS
chillig|chill
nervig|annoying
z. B. Wie nervig ist dieses Schulfach?|e.g. How annoying is this school subject?
Mehrspielermodus eingerichtet|Multiplayer enabled
Spielerverwaltung|Player management
Noch kein vollständig kontrollierter Kontinent.|No continent fully controlled yet.
Spielerverwaltung|Player management
Angriff ausführen?|Execute attack?
Team Rot|Team Red
Team Blau|Team Blue
→ Rot|→ Red
→ Blau|→ Blue
Weiterspielen|Continue playing
Warten auf Start|Waiting for game start
Hinweisgeber zuerst Runde beenden lassen|Wait for the clue giver to finish their round
Keine eigene Farbe|No color selected
Noch nicht alle Truppen verteilt.|Troops are still unplaced.
Nördliche Europa|Northern Europe
`;for(const entry of extras.trim().split('\n')){const i=entry.indexOf('|');if(i>=0)map.set(entry.slice(0,i),entry.slice(i+1));}

const fixes=`
DAS 1–10 PARTYSPIEL|THE 1–10 PARTY GAME
AKTIV|ACTIVE
Ohne Änderungen durch den Host werden die Teams beim Spielstart zufällig aufgeteilt. Danach ist abwechselnd Rot → Blau dran.|Without changes from the host, teams are randomized at the start. Turns then alternate Red → Blue.
👑 Deine Team-Einteilung bleibt beim Spielstart erhalten. Danach ist abwechselnd Rot → Blau dran.|👑 Your team assignments will stay the same when the game starts. Turns then alternate Red → Blue.
Spieler in ein anderes Team verschieben oder aus dem Raum kicken. Der aktuelle Hinweisgeber kann erst nach seiner Runde geändert werden. Jedes Team braucht beim Spielen mindestens zwei Spieler.|Move players to another team or remove them from the room. The active clue giver can only be moved after their round. Each team must have at least two players.
✍️ SCHREIBT HINWEIS|✍️ WRITING CLUE
✍️ Schreibt Hinweis|✍️ Writing clue
Schreibt Hinweis|Writing clue
SCHREIBT HINWEIS|WRITING CLUE
SCHÄTZT DIE ZAHL|GUESSING NUMBER
RÄT GERADE|GUESSING
1 BEDEUTET|1 MEANS
10 BEDEUTET|10 MEANS
Sonst: 0|Otherwise: 0
· Sonst: 0|· Otherwise: 0
Reihenfolge: Rot 1 → Blau 1 → Rot 2 → Blau 2 → …|Order: Red 1 → Blue 1 → Red 2 → Blue 2 → …
Vorhanden: 1|Current: 1
TRUPPENVERTEILUNG|TROOP DISTRIBUTION
Spieler am Zug|Current player
Warten auf Tipp|Waiting for guess
Kategorie hinzufügen|Add category
3 Punkte|3 points
Zurück zur Spielauswahl|Back to game selection
Unbekannte Kategorie|Unknown category
Team Blau (3)|Team Blue (3)
Team Rot (3)|Team Red (3)
Nordamerika|North America
Schreibt Hinweis|Writing clue
Nein|No
Ja|Yes
`;
for(const line of fixes.trim().split('\n')){const n=line.indexOf('|');if(n>=0)map.set(line.slice(0,n),line.slice(n+1));}

for(const [de,en] of [['✨ Du bist am Zug!','✨ It’s your turn!'],['SKALA · WELTHERRSCHAFT','SKALA · WORLD DOMINATION'],['Du bist gerade nicht am Zug.','It is not your turn.'],['(du)','(you)']])map.set(de,en);
const dynamic=[
[/^(\d+) Spieler im Raum · Der Host startet das Spiel\.$/,'$1 players in the room · The host starts the game.'],
[/^(\d+) Spieler im Raum · Vorschau der Teams$/,'$1 players in the room · Team preview'],
[/^(\d+) Spieler$/,'$1 players'],[/^(\d+) Gebiete$/,'$1 territories'],[/^(\d+) Truppen$/,'$1 troops'],[/^(\d+) Truppe$/,'$1 troop'],
[/^Noch zu verteilen: (\d+)/,'Troops remaining: $1'],
[/^Alle (\d+) hier platzieren$/,'Place all $1 here'],[/^✓ (\d+) Truppen bestätigen$/,'✓ Confirm $1 troops'],
[/^(\d+) Gebiete · (\d+) Truppen$/,'$1 territories · $2 troops'],
[/^(\d+) Truppen · (.*)$/,'$1 troops · $2'],
[/^(\d+) erreichbare Angriffsziele · (.*)$/,'$1 valid targets · $2'],
[/^Alle (\d+) verfügbaren Truppen greifen automatisch an\. Eine bleibt zurück\.$/,'All $1 available troops attack automatically. One stays behind.'],
[/^(\d+) gegen (\d+) Truppen$/,'$1 versus $2 troops'],
[/^🎉 Gebiet erobert! Bestimme, wie viele der (\d+) überlebenden Truppen im Ausgangsgebiet bleiben\.$/,'🎉 Territory captured! Choose how many of the $1 surviving troops stay behind.'],
[/^Ziel: (\d+) Truppen$/,'Target: $1 troops'],
[/^✓ (\d+) Truppen bestätigen$/,'✓ Confirm $1 troops'],
[/^Du bist der Host 👑$/,"You're the host 👑"],
[/^Runde (\d+)/,'Round $1'],[/^Zug (\d+)/,'Turn $1'],
[/^Am Zug: (.*)$/,'Turn: $1'],
[/^(.*): (\d+) Truppen, (.*)$/,'$1: $2 troops, $3'],
[/^(.*) ist jetzt in Team Rot\.$/,'$1 moved to Team Red.'],[/^(.*) ist jetzt in Team Blau\.$/,'$1 moved to Team Blue.'],
[/^Spieler in ein anderes Team verschieben oder aus dem Raum kicken\.(.*)$/,'Move players to another team or remove them from the room.$1']
];
function translate(str){if(lang==='de')return str;const trim=str.trim();if(!trim)return str;let out=map.get(trim);if(!out){for(const [rx,rep] of dynamic){if(rx.test(trim)){out=trim.replace(rx,rep);break;}}}
if(!out){
 let m;
 if((m=trim.match(/^(\d+)\/6 Spieler im Raum · Der Host startet das Spiel\.$/)))out=`${m[1]}/6 players in the room · The host starts the game.`;
 else if((m=trim.match(/^Du hast (.*?) erobert\. Lege fest, wie viele Truppen in (.*?) zurückbleiben\.$/)))out=`You conquered ${map.get(m[1])||m[1]}. Choose how many troops stay in ${map.get(m[2])||m[2]}.`;
 else if((m=trim.match(/^(\d+) (Runden|Truppen|Spieler|Gebiete)$/)))out=`${m[1]} ${{Runden:'rounds',Truppen:'troops',Spieler:'players',Gebiete:'territories'}[m[2]]}`;
 else if((m=trim.match(/^Vorhanden: (\d+)$/)))out=`Current: ${m[1]}`;
 else if((m=trim.match(/^Noch frei: (\d+)$/)))out=`Still available: ${m[1]}`;
 else if((m=trim.match(/^Alle (\d+) hier platzieren$/)))out=`Place all ${m[1]} here`;
 else if((m=trim.match(/^\+? (\d+) Truppen bestätigen$/)))out=`${m[1]} troops: confirm`;
 else if((m=trim.match(/^✓ (\d+) Truppen bestätigen$/)))out=`✓ Confirm ${m[1]} troops`;
 else if((m=trim.match(/^(\d+) gegen (\d+) Truppen$/)))out=`${m[1]} versus ${m[2]} troops`;
 else if((m=trim.match(/^(.*?) erobert (.*?)!$/)))out=`${map.get(m[1])||m[1]} conquered ${map.get(m[2])||m[2]}!`;
 else if((m=trim.match(/^([0-9]+) · (.+)$/)) && map.has(m[2]))out=`${m[1]} · ${map.get(m[2])}`;
 else if((m=trim.match(/^Team (Rot|Blau) \((\d+)\)$/)))out=`Team ${m[1]==='Rot'?'Red':'Blue'} (${m[2]})`;
 else if((m=trim.match(/^([0-9]+) aktiv$/i)))out=`${m[1]} active`;
 else if((m=trim.match(/^(\d+) \/ (\d+) Gebiete$/)))out=`${m[1]} / ${m[2]} territories`;
 else if((m=trim.match(/^(\d+)\s*\/\s*(\d+) Gebiete$/)))out=`${m[1]} / ${m[2]} territories`;
 else if((m=trim.match(/^Du \(Host\)(.*)$/)))out=`You (Host)${m[1].replace(/\(du\)/g,'(you)')}`;
 else if((m=trim.match(/^(.*?) → (.*?)$/)) && (map.has(m[1])||map.has(m[2])))out=`${map.get(m[1])||m[1]} → ${map.get(m[2])||m[2]}`;
 else if((m=trim.match(/^Überlege: Was passt in dieser Kategorie zu einer (.*?)\?$/)))out=`Think: what fits this category at ${m[1]}?`;
 else if((m=trim.match(/^(.+) als Tipp abgeben →$/)))out=`Submit ${m[1]} as the guess →`;
 else if((m=trim.match(/^([0-9]+) P\.$/)))out=`${m[1]} pts`;

 else if((m=trim.match(/^(.*?) scheitert gegen (.*?)\.$/)))out=`${map.get(m[1])||m[1]} failed to conquer ${map.get(m[2])||m[2]}.`;
 else if((m=trim.match(/^Welche Zahl meint (.*?)\?$/)))out=`What number does ${m[1]} mean?`;
 else if((m=trim.match(/^(.+) ist am Zug$/)))out=`It's ${m[1]}'s turn`;
 else if((m=trim.match(/^Runde (\d+)(.*)$/)))out=`Round ${m[1]}${m[2]}`;
 else if((m=trim.match(/^Zug (\d+)(.*)$/)))out=`Turn ${m[1]}${m[2]}`;
 else if((m=trim.match(/^([🔴🔵] Team (?:Rot|Blau)) ist am Zug\. Ihr seht das Wort mit, dürft aber nicht raten\.$/)))out=`${m[1].replace('Rot','Red').replace('Blau','Blue')} is up. You can see the clue, but cannot guess.`;
}
if(!out&&typeof FLAGS!=='undefined'){
 const country=FLAGS.find(f=>f[1]===trim);
 if(country){try{out=new Intl.DisplayNames(['en'],{type:'region'}).of(country[0].toUpperCase());}catch(e){} }
}
if(!out)return str;const leading=str.match(/^\s*/)[0],trailing=str.match(/\s*$/)[0];return leading+out+trailing;
}
function convertTextNode(node){if(!node||node.nodeType!==3||!node.parentElement)return;const parent=node.parentElement;if(parent.closest('script,style,textarea,code,pre,[data-notranslate]'))return;
if(node.__skalaRendered!==undefined&&node.textContent!==node.__skalaRendered){node.__skalaOriginal=node.textContent;}else if(node.__skalaOriginal===undefined){node.__skalaOriginal=node.textContent;}
const next=lang==='de'?node.__skalaOriginal:translate(node.__skalaOriginal);if(node.textContent!==next)node.textContent=next;node.__skalaRendered=next;
}
function convertNode(root){if(root.nodeType===3){convertTextNode(root);return;}if(root.nodeType!==1)return;if(root.matches('script,style,textarea,code,pre,[data-notranslate]'))return;
for(const attr of ['placeholder','title','aria-label']){const val=root.getAttribute(attr);if(val===null)continue;const k='__skalaAttr_'+attr;const rendered='__skalaAttrRendered_'+attr;if(root[rendered]!==undefined&&val!==root[rendered])root[k]=val;else if(root[k]===undefined)root[k]=val;const next=lang==='de'?root[k]:translate(root[k]);if(val!==next)root.setAttribute(attr,next);root[rendered]=next;}
for(const child of root.childNodes)convertNode(child);
}
let scheduled=false;function apply(){if(scheduled)return;scheduled=true;queueMicrotask(()=>{scheduled=false;if(document.body)convertNode(document.body);document.documentElement.lang=lang;document.querySelectorAll('.skala-language-switch button').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.lang===lang));b.classList.toggle('active',b.dataset.lang===lang)});});}
function setLanguage(value){if(value!=='en'&&value!=='de')return;lang=value;localStorage.setItem(KEY,lang);apply();window.dispatchEvent(new CustomEvent('skala:languagechange',{detail:{language:lang}}));}
function switchMarkup(){return `<span class="skala-language-switch" role="group" aria-label="Language / Sprache"><button type="button" data-lang="de" aria-label="Deutsch">DE</button><button type="button" data-lang="en" aria-label="English">EN</button></span>`;}
document.addEventListener('click',e=>{const b=e.target.closest?.('.skala-language-switch button');if(b)setLanguage(b.dataset.lang);});
function insertSwitch(){if(document.querySelector('.skala-language-switch'))return;let header=document.querySelector('.world-header nav')||document.querySelector('.portal-top')||document.querySelector('.topbar .profile-head');if(!header)return;
const wrap=document.createElement('span');wrap.innerHTML=switchMarkup();header.insertBefore(wrap.firstElementChild,header.firstChild);}
function confirmBox(question,{title='Bist du sicher?',yes='Bestätigen',no='Abbrechen',danger=false}={}){return new Promise(resolve=>{const overlay=document.createElement('div');overlay.className='skala-dialog-overlay';overlay.setAttribute('role','presentation');overlay.innerHTML=`<section class="skala-dialog" role="alertdialog" aria-modal="true" aria-labelledby="skala-dialog-title" aria-describedby="skala-dialog-text"><div class="skala-dialog-icon">${danger?'⚠️':'✦'}</div><h2 id="skala-dialog-title"></h2><p id="skala-dialog-text"></p><div class="skala-dialog-buttons"><button type="button" data-answer="no" class="skala-dialog-cancel"></button><button type="button" data-answer="yes" class="skala-dialog-ok"></button></div></section>`;
// Use textContent for all supplied strings (room names are untrusted).
overlay.querySelector('h2').textContent=title;overlay.querySelector('p').textContent=question;overlay.querySelector('[data-answer=no]').textContent=no;overlay.querySelector('[data-answer=yes]').textContent=yes;
document.body.appendChild(overlay);apply();const previous=document.activeElement;const cancel=()=>finish(false);const onKey=e=>{if(e.key==='Escape'){e.preventDefault();cancel();}};
const finish=result=>{document.removeEventListener('keydown',onKey,true);overlay.remove();previous?.focus?.();resolve(result);};
overlay.addEventListener('click',e=>{const btn=e.target.closest('[data-answer]');if(btn)finish(btn.dataset.answer==='yes');else if(e.target===overlay)cancel();});document.addEventListener('keydown',onKey,true);overlay.querySelector('[data-answer=no]').focus();});}
window.SKALAI18N={get language(){return lang},setLanguage,translate,apply,confirm:confirmBox,countryName(code){try{return lang==='en'?new Intl.DisplayNames(['en'],{type:'region'}).of(code.toUpperCase()):((typeof FLAGS!=='undefined'?FLAGS.find(f=>f[0]===code)?.[1]:null)||code);}catch(e){return code}}};
const boot=()=>{insertSwitch();apply();const obs=new MutationObserver(mutations=>{if(mutations.some(m=>m.type==='childList'&&m.addedNodes.length)){insertSwitch();apply();}});obs.observe(document.body,{childList:true,subtree:true});};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
