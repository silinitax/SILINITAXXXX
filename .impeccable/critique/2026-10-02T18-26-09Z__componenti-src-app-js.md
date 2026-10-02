---
target: home SiliniTax (zip originale)
total_score: 17
max_score: 28
na_heuristics: 7,9,10
p0_count: 0
p1_count: 2
target_identity: "file:/home/user/SILINITAXXXX/componenti/src/app.js"
target_fingerprint: "sha256:b3a59b1026d31a59ef4c256f3fb9bff39ee07998205111bce0d4a3244f35a2e1"
target_path: /home/user/SILINITAXXXX/componenti/src/app.js
timestamp: 2026-10-02T18-26-09Z
slug: componenti-src-app-js
---
⚠️ DEGRADED: single-context (sub-agenti consentiti solo su richiesta esplicita dell'utente)

Target: home SiliniTax originale (zip SiliniTax-cliente, componenti/src/app.js), desktop 1440x900 e mobile 390x844.

## Design Health Score (Persuade, 7/9/10 n/a)
| # | Euristica | Voto | Problema chiave |
|---|---|---|---|
| 1 | Visibilità dello stato | 3 | Tab del telefono con stato attivo e notifiche di conferma; nessuna nav fissa dopo l'hero |
| 2 | Linguaggio reale | 3 | Italiano chiaro, F24 ok; "Esplora l'app" con icona "+" (= aggiungi) |
| 3 | Controllo e libertà | 2 | Due sezioni bloccate allo scroll (~6,4 schermi) prima dei contatti |
| 4 | Coerenza | 2 | Contatto con 7 etichette nel sito (2 in home); bottone nero invisibile su sezione nera; card gialla fuori palette |
| 5 | Prevenzione errori | 2 | Solo link mailto: senza client mail il clic non fa nulla |
| 6 | Riconoscimento | 3 | Etichette visibili, icone con testo |
| 7 | Flessibilità | n/a | Landing page |
| 8 | Estetica minimalista | 2 | Le 4 funzioni ripetute 4 volte; etichette "/ X" su ogni sezione; vuoto nella sezione studio |
| 9 | Recupero errori | n/a | Nessun flusso con stati di errore |
| 10 | Aiuto | n/a | Landing page |
| **Totale** | | **17/28** | **Accettabile (61%)** |

## Specificità del design
LLM: il cuore è autentico (storia del telefono: fattura incassata, quota accantonata, F24), il guscio è generico: etichette "/ SILINITAX" ovunque, hero centrato standard, foto di monete/scontrini/calcolatrice su griglia blu (cliché "fintech").
Detector CLI: 2 segnalazioni (codex-grid-background = griglia blu; dark-glow = ombra colorata #0b1f45 in legacy.css). Detector nel browser: 71 (45 testi < 11 px e 6 testi minuscoli quasi tutti nel finto telefono, 9 contrasti bassi di cui 2 nella pagina: #777 su #f1f1f1 4.0:1 e #777 su bianco 4.48:1, 5 tracking -0.06/-0.07em, 4 icone a tessera sopra i titoli delle card, 8 card annidate nel telefono = falso positivo, 1 salto h1->h3 dentro il telefono, 1 overflow del mazzo = voluto).

## Cosa funziona
1. La storia scroll del telefono: azioni vere che succedono (prova di prodotto, non decorazione).
2. Geist e copy onesto ("Schermate illustrative · dati dimostrativi", "Gli importi si verificano con lo studio").
3. Percorso a movimento ridotto, skip link, focus visibile.

## Problemi prioritari
1. [P1] Griglia blu + foto monete/scontrini: firma da UI generata, compete col telefono, 159 KB. Fix: sfondo liquido. Comando: $impeccable quieter
2. [P1] Contatti: solo mailto, 7 etichette diverse, bottone "Parliamone" nero su sezione nera, nessuna nav fissa. Fix: una sola etichetta, WhatsApp primario + email, nav/CTA persistente. Comando: $impeccable clarify + $impeccable harden
3. [P2] Ripetizione: Panoramica/Tasse/Fatture/Scadenze mostrate 4 volte (telefono, mazzo di card, telefono "Meno dubbi", riga di icone). Fix: tenere storia + mazzo, togliere il resto o sostituirlo con lo studio. Comando: $impeccable distill
4. [P2] Etichette "/ X" su 5 sezioni + etichette fluttuanti negli angoli. Fix: toglierle. Comando: $impeccable distill
5. [P2] Tipografia: tracking -0.07em (lettere che si toccano), "fisco" da solo su mobile, icona "+" sul pulsante "Esplora l'app". Comando: $impeccable typeset

## Persona
- Jordan (prima volta): due CTA che competono; "+" letto come "aggiungi"; "Stai guardando un esempio" a 8 px, rischia di credere che i numeri siano reali.
- Riley (stress test): "Parla con lo studio" senza client mail non apre nulla.
- Casey (mobile): ~9.300 px di scroll, due sezioni bloccate prima del contatto, testi del telefono a 6-8 px.

## Osservazioni minori
- Em-dash nei titoli delle pagine (taste-skill lo vieta).
- Sezione studio: min-height 1050 px con il paragrafo isolato in basso a destra.
- Card gialla "Scadenze" = secondo accento.
- legacy.css (96 KB) di un design precedente ancora caricato; phone-frame.js (three) non usato; remotion+React (175 KB) per due helper.

## Domande da porsi
- E se il contatto fosse una conversazione WhatsApp invece di un'email?
- La pagina ha bisogno di mostrare le 4 funzioni quattro volte, o basta una volta fatta bene?
- Cosa vede chi arriva a metà pagina e vuole scrivere allo studio?
