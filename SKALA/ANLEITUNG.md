# SKALA – 1-bis-10-Teamquiz

Ein fertiges Browser-Spiel auf Deutsch: **Raum erstellen → Freunde laden → Teams automatisch mischen → Hinweise geben → Zahlen erraten → Punkte sammeln**.

## Was funktioniert?

- **Demo ohne Einrichtung:** über „Erst mal mit Demo-Spielern testen“. Über den Spieler-Wähler oben kannst du zwischen allen Perspektiven wechseln. So kannst du den gesamten Ablauf in einem Browser ausprobieren.
- **Echter Mehrspielermodus mit Firebase:** Jeder öffnet dieselbe Website, gibt seinen Namen und einen 6-stelligen Raumcode ein und spielt mit. Aktualisierungen werden live synchronisiert.
- Der Host kann eigene Kategorien mit Skalen-Endpunkten erstellen, vorgefertigte Kategorien entfernen, die Rundenzahl wählen und das Spiel starten.
- Es werden zufällig zwei möglichst gleich große Teams erstellt. Jede Runde ist abwechselnd Rot und Blau dran, und die Hinweisperson rotiert innerhalb des Teams.
- **Geheime Zahlen** werden getrennt von den Raumdaten gespeichert. Nur die aktuelle Hinweisperson darf die Zahl vor der Auflösung lesen.
- Das Team berät sich (z. B. über Discord oder vor Ort), und **ein Teammitglied außer der Hinweisperson** klickt die Zahl an. Wer zuerst tippt, gibt den offiziellen Team-Tipp ab.
- Punkte: exakter Treffer = 3, um 1 daneben = 2, um 2 daneben = 1, sonst 0.
- Nach der Auflösung geht es mit dem „Nächste Runde“-Knopf oder automatisch nach rund 12 Sekunden weiter, **solange der Host online ist**.

## Website sofort testen

Öffne **`demo.html` per Doppelklick** und klicke auf **Demo testen**. Das ist eine eigenständige Offline-Version ohne Anmeldung und ohne Server. Sie hat keine echten Online-Räume. Du kannst auch `index.html` über Netlify oder einen lokalen HTTP-Server testen (z. B. VS Code „Live Server").

## Für echte Online-Räume einmalig Firebase verbinden

Firebase hat einen kostenlosen Einstiegstarif. Je nach Nutzung und Anbieter können Limits gelten. Für das Spiel musst du **keine eigene Node.js-Server-App** betreiben.

1. Öffne <https://console.firebase.google.com/> und erstelle ein Firebase-Projekt.
2. Unter **Authentication → Sign-in method → Anonymous** die anonyme Anmeldung aktivieren. Ein Passwort oder Google-Login ist fürs Mitspielen nicht nötig.
3. Unter **Realtime Database → Create database** eine Datenbank anlegen. Wähle am besten den gesperrten Modus, denn wir setzen eigene Regeln.
4. Unter **Realtime Database → Rules** den **gesamten Inhalt** der Datei `firebase-rules.json` einfügen und auf **Publish** klicken. Verwende **nicht** dauerhaft `".read": true, ".write": true` als Ersatz.
5. Unter **Project settings → General → Your apps** eine **Web-App** (`</>`) registrieren. Dort wird eine Firebase-Konfiguration angezeigt.
6. Öffne `firebase-config.js` und ersetze die Platzhalter durch die Werte deiner Web-App. **Wichtig:** `databaseURL` muss genau die URL aus Realtime Database sein, zum Beispiel `https://dein-projekt-default-rtdb.firebaseio.com` oder eine regionale `...firebasedatabase.app`-Adresse.
7. Lade **`index.html` und `firebase-config.js` zusammen** (oder gleich den ganzen Ordner) auf Netlify hoch (oder stelle ihn auf einem anderen statischen HTTPS-Host bereit). Auf Netlify geht das über „Add new project → Deploy manually“ und Drag-and-drop des Ordners. Im Dashboard findest du danach den veröffentlichten Link.
8. Freunde öffnen deinen Link; du erstellst einen Raum, teilst den Einladungslink oder den 6-stelligen Code und startest nach dem Beitritt.

> **Wichtig:** Für Online-Räume reicht reines Netlify-Hosting **ohne** Firebase nicht aus. Die Echtzeit-Synchronisierung passiert über Firebase Realtime Database. In der Datei `firebase-config.js` stehen öffentliche Web-Konfigurationswerte, **keine geheimen Admin-Schlüssel**. Ein Firebase-Service-Account-Schlüssel gehört niemals in diese Website.

## Dateien

- `demo.html`: eigenständige Offline-Demo, sofort per Doppelklick testbar
- `index.html`: **vollständige Website mit Design und Spielcode**, direkt per Doppelklick startbar. Wenn du sie allein weitergibst, funktioniert die Offline-Demo.
- `demo.html`: zusätzliche Offline-Demo
- `firebase-config.js`: optionale Konfiguration für den Online-Modus (muss im selben Ordner wie `index.html` liegen)
- `firebase-rules.json`: Berechtigungen für Räume, Teams und geheime Zahlen

## Hinweise zu Grenzen und Sicherheit

- Diese Version ist für **private Runden unter Freunden** gedacht. Es gibt keine Moderation, keinen Chat und kein Anti-Cheat-System auf einem vertrauenswürdigen Spielserver. Die Hinweisgeber erzeugen ihre Zahl clientseitig, und der Host koordiniert die Runden.
- **Der Host muss während des Spiels online bleiben**, sonst werden die Runden nicht automatisch fortgesetzt. Nach einer Unterbrechung kann er denselben Raum über den Einladungslink wieder öffnen, solange sein Browser die gleiche anonyme Firebase-Anmeldung besitzt.
- Online-Räume werden nicht automatisch aus Firebase gelöscht. Wenn du viele Runden hostest, richte später eine Löschroutine ein oder entferne alte Räume in Firebase Console manuell.
- Ein Team darf nicht nur aus einer Person bestehen; darum sind mindestens **4 Spieler** zum Starten nötig. In der Demo gibt es sechs Spieler.
- Benutze beim Testen auf einem Gerät verschiedene Browser-Profile oder ein privates Fenster, sonst teilen Tabs oft die gleiche anonyme Firebase-ID.
