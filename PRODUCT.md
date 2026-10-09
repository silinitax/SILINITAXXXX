# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Chiunque abbia una Partita IVA: dal libero professionista in regime forfettario alla ditta individuale, fino alla piccola impresa e alla società. Nessun segmento ha la priorità: il messaggio resta lo stesso per tutti.

Arrivano sul sito per capire chi c'è dietro SiliniTax e se possono fidarsi. Il loro obiettivo è avere i conti dell'attività in ordine, sapere quanto mettere da parte per tasse e contributi, non perdere le scadenze e avere qualcuno di reale a cui chiedere.

## Product Purpose

SiliniTax unisce Studio Silini, uno studio di consulenza fiscale e amministrativa con sede a Pedrengo (BG), a un'app che mette in ordine i numeri dell'attività. Il sito presenta lo studio e l'app e porta il visitatore a contattare lo studio.

Successo: il visitatore scrive allo studio (WhatsApp, email o telefono) per parlare della propria attività.

## Positioning

Uno studio di famiglia, da tre generazioni al fianco delle Partite IVA, che usa il digitale per migliorare il servizio. Non è un'app che sostituisce il consulente. La tecnologia prepara il lavoro, le persone dello studio aiutano a decidere.

## Operating Context

- Contatto principale: WhatsApp allo 035 040 2086, con messaggio precompilato. In alternativa info@studiosilini.it oppure telefono.
- Sede fisica: Via Paolo VI, 2, 24066 Pedrengo (BG). Si può passare di persona.
- Il sito di presentazione è un'anteprima statica (HTML standalone, noindex) in tre pagine: home (`APRI-SITO.html`), Chi siamo (`chi-siamo.html`) e Piani (`prezzi.html`). I sorgenti sono in `componenti/`.

## Capabilities and Constraints

- **App SiliniTax: in sviluppo / in prova.** Funziona ma non è aperta a tutti. Il sito non deve promettere download immediati, store o disponibilità pubblica.
- Sezioni dell'app mostrate sul sito: incassi, quote da mettere da parte (tasse e contributi), fatture, scadenze. Le schermate usano dati dimostrativi e vanno etichettate come tali.
- Piani confermati: Base 40 €, Plus 60 €, Max 80 € al mese + IVA, con impegno annuale. Lo studio invia poi una proposta per l'attività. Il contenuto dettagliato di ogni piano è ancora indicato sul sito come "da definire/da confermare": non va inventato.
- **Frase obbligatoria:** "Per le prestazioni riservate, lo studio si avvale dei professionisti partner dedicati." Va mantenuta dove si parla dei servizi.

## Brand Commitments

- Nome: SiliniTax, collegato a Studio Silini.
- Il titolare si presenta come **consulente fiscale**. Non scrivere mai "commercialista" (né per lui né per lo studio) in nessun testo del sito.
- La foto della hero di Chi siamo è la sua; didascalia: "Consulente fiscale · Studio Silini, Pedrengo (BG)". Il nome si aggiunge solo quando lo fornisce.
- Mascotte ufficiale: **Salvo**, un maialino salvadanaio blu con una moneta d'oro nella fessura. Il nome si può usare nei testi. La mascotte deve restare fedele al suo aspetto originale.
- Storia dello studio: "da tre generazioni" è la formula verificata; il titolare conferma anche "tradizione secolare" (studio che, da una tradizione di famiglia, ha scelto di modernizzarsi). **Non usare "cinquant'anni"** né altre cifre sugli anni di attività.
- Tono: concreto, diretto, moderno, a volte leggermente provocatorio. Mai slogan da azienda tecnologica o testi istituzionali lunghi. Il rapporto umano viene prima della tecnologia.
- Vincolo visivo dato dal titolare: palette blu, blu navy, bianco e grigio. Il footer giallo è approvato.

## Evidence on Hand

- Recensioni e clienti reali: **esistono, ma non sono ancora nel progetto.** Il titolare li fornirà. Fino ad allora non inventare testimonianze, nomi, numeri di clienti o risultati.
- Schermate reali dell'app (dati dimostrativi): `componenti/dist/app-home|tasse|fatture|scadenze.webp`.
- Mascotte: `componenti/dist/salvo-ok.webp` (pollice alzato) e l'illustrazione di Salvo in poltrona con il "Silini Times" (incorporata nelle pagine).
- In attesa dal titolare: la foto personale per la hero di Chi siamo (`assets/foto-hero.jpg`), Salvo in corsa (`assets/salvo-corsa.webp`, o un video da cui ricavarlo), il video social `assets/studio-social.mp4` con la copertina e `assets/salvo-appoggiato.webp` per il footer.

## Product Principles

1. **Persone prima dell'app.** Ogni pagina deve far capire che dietro c'è uno studio vero, con persone e una sede.
2. **Solo fatti verificabili.** Tre generazioni sì, cifre non confermate no. Recensioni solo se reali, servizi senza promesse non confermate.
3. **Il digitale è un mezzo.** La tecnologia semplifica gli adempimenti e prepara il confronto, non sostituisce il consulente.
4. **Ogni percorso porta a una conversazione.** Il contatto con lo studio è sempre a portata di mano.
5. **Chiarezza per chiunque abbia una Partita IVA.** Linguaggio semplice, niente gergo fiscale non spiegato.
