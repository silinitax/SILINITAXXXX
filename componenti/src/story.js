// Content of the phone story on the home page: four real screens of the app, three steps each.
// Every step highlights one real area of the screen (ring) and explains only what is visible there.
//   ring  = [x, y, width, height] of the highlighted area, in pixels of the original 390 x 769 screen
//   stat  = [value, caption] shown big beside the phone on wide screens
//   zoom  = optional; by default the camera zooms as much as the ring allows (1 to 1.6). Set it lower when
//           the zoom would cut the words next to the ring.
// Figures come from the demo data inside the screenshots: if a screenshot changes, check them here.
export default [
 {label:'Panoramica',icon:'r-house',src:'/app-home.webp',beats:[
  {title:'Quanto resta<br> davvero a te.',text:'Il numero grande è il disponibile: gli incassi dell’anno, già al netto di tasse e contributi.',stat:['€ 23.409','disponibile per te'],ring:[14,260,228,92],zoom:1.3},
  {title:'Tuo, e del fisco,<br> separati.',text:'Il 77% resta a te, il 23% va a tasse e contributi. E l’app precisa: non è il saldo del conto.',stat:['77%','resta a te · 23% a tasse e contributi'],ring:[14,346,362,95]},
  {title:'La prossima scadenza,<br> già in vista.',text:'Entro il 16 ottobre servono € 1.430 per l’F24. Sotto, il salvadanaio è a € 0 e c’è il tasto “Metti da parte”.',stat:['€ 1.430','F24 entro il 16 ottobre · tra 13 giorni'],ring:[15,453,361,212]}
 ]},
 {label:'Tasse',icon:'r-chart-pie-slice',src:'/app-tasse.webp',beats:[
  {title:'Sai quanto<br> mettere da parte.',text:'Tutti gli F24 fino a giugno 2027: € 9.994. L’app indica il 23,5% di ogni incasso, circa € 1.590 al mese.',stat:['€ 9.994','da mettere da parte fino a giugno 2027'],ring:[14,158,345,130]},
  {title:'Dove vanno<br> tasse e contributi.',text:'Imposta sostitutiva al 5% e contributi, voce per voce. È una stima, e l’app lo dichiara.',stat:['€ 7.178','tasse sui guadagni 2026 · stima'],ring:[14,441,360,128]},
  {title:'L’aliquota agevolata,<br> scritta in chiaro.',text:'L’app mette in evidenza l’aliquota agevolata del 5% fino al 2029. Sotto trovi “Quando e quanto paghi”.',stat:['5%','aliquota agevolata fino al 2029'],ring:[15,576,258,30]}
 ]},
 {label:'Fatture',icon:'r-receipt',src:'/app-fatture.webp',beats:[
  {title:'Cosa manca<br> all’incasso.',text:'42 fatture nel 2026 e € 623 ancora da incassare. Il conto che conta, in alto.',stat:['€ 623','da incassare · 42 fatture nel 2026'],ring:[14,54,236,26]},
  {title:'Cerca, importa,<br> filtra.',text:'Cerca una fattura, importa l’XML e filtra per stato: tutte 42, da incassare 1, incassate 37.',stat:['37','incassate su 42'],ring:[14,145,362,101]},
  {title:'Un tocco ed<br> è incassata.',text:'Per la fattura da incassare c’è il tasto “Segna incassata”. Qui € 623,00 di Illuna S.r.l., scade il 3 ottobre.',stat:['€ 623,00','Illuna S.r.l. · scade il 3 ottobre'],ring:[14,282,362,94]}
 ]},
 {label:'Scadenze',icon:'r-calendar-blank',src:'/app-scadenze.webp',beats:[
  {title:'La prossima<br> scadenza è qui.',text:'Il prossimo F24 è il 16 ottobre, per € 1.430: rata 4 di 4, saldo 2025 e primo acconto. Mancano 13 giorni.',stat:['16 ott','F24 · € 1.430 · tra 13 giorni'],ring:[15,130,360,88]},
  {title:'Ci pensa<br> lo studio.',text:'Alla dichiarazione dei redditi del 2 novembre l’app indica chiaramente chi se ne occupa: lo studio.',stat:['2 nov','dichiarazione dei redditi'],ring:[15,354,360,90]},
  {title:'Cosa viene dopo,<br> con gli importi.',text:'Secondo acconto e bollo fatture, entrambi il 30 novembre: uno con “Importo esatto”, l’altro con “Stima”.',stat:['€ 1.665','secondo acconto · 30 novembre'],ring:[15,462,360,188]}
 ]}
];
