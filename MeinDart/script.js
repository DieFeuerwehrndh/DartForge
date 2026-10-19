
const spielModi = {
    tictactoe: {
        titel: "Dart Tic-Tac-Toe",
        text: "Spiele auf einem 3×3-Feld mit Dart-Aufgaben, zwei Spielern oder gegen den Bot."
    },
    x01: {
        titel: "501 / X01",
        text: "Hier kannst du die klassischen X01-Spiele spielen, gegen deine Freunde, sowie gegen den Bot und auch im Trainingsmodus üben."
    },
    checkout: {
        titel: "Checkout-Training",
        text: "Übe das Checkout-Spiel, um deine Fähigkeiten zu verbessern und deine Trefferquote zu steigern."
    },
    stats: {
        titel: "Deine Statistiken",
        text: "Hier kannst du deine bisherigen Spiele und Ergebnisse einsehen, um deine Fortschritte zu verfolgen."
    }
};

const spielkarten = document.querySelectorAll(".spielkarte");
const infoTitel = document.getElementById("infoTitel");
const infoText = document.getElementById("infoText");

const tictactoeBereich = document.getElementById("tictactoeBereich");
const spielbereich = document.querySelector(".spielbereich");
const begruessung = document.querySelector(".begruesung");
const x01Bereich = document.getElementById("x01Bereich");
const infoKarte = document.getElementById("infoKarte");
const statsBereich = document.getElementById("statsBereich");
const statsZurueck = document.getElementById("statsZurueck");


spielkarten.forEach(function (karte) {
    karte.addEventListener("click", function () {
        const modus = karte.dataset.mode;
        const daten = spielModi[modus];

        if (!daten) return;

        if (infoTitel) infoTitel.textContent = daten.titel;
        if (infoText) infoText.textContent = daten.text;

        spielkarten.forEach(function (andereKarte) {
            andereKarte.setAttribute("aria-pressed", "false");
        });

        karte.setAttribute("aria-pressed", "true");

        if (["tictactoe", "x01", "checkout", "stats"].includes(modus)) {
            if (tictactoeBereich) {
                tictactoeBereich.hidden = modus !== "tictactoe";
            }

            if (x01Bereich) {
                x01Bereich.hidden = modus !== "x01";
            }

            const checkoutBereich =
                document.getElementById("checkoutBereich");

            if (checkoutBereich) {
                checkoutBereich.hidden = modus !== "checkout";
            }

            if (spielbereich) spielbereich.hidden = false;
            if (begruessung) begruessung.hidden = true;
            if (infoKarte) infoKarte.hidden = true;

            const ziel = {
                tictactoe: tictactoeBereich,
                x01: x01Bereich,
                checkout: checkoutBereich
            }[modus];
            if (statsBereich) statsBereich.hidden = modus !== "stats";
            if (ziel) {
                ziel.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        }
    });
});


document.getElementById("zurueckStart").addEventListener("click", function () {
    tictactoeBereich.hidden = true;
    x01Bereich.hidden = true;
    spielbereich.hidden = false;
    begruessung.hidden = false;

    if (infoKarte) infoKarte.hidden = false;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

document.getElementById("x01Zurueck").addEventListener("click", function () {
    tictactoeBereich.hidden = true;
    x01Bereich.hidden = true;
    spielbereich.hidden = false;
    begruessung.hidden = false;

    if (infoKarte) infoKarte.hidden = false;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

document.getElementById("checkoutZurueck").addEventListener("click", function () {
    document.getElementById("checkoutBereich").hidden = true;
    tictactoeBereich.hidden = true;
    x01Bereich.hidden = true;

    spielbereich.hidden = false;
    begruessung.hidden = false;

    if (infoKarte) infoKarte.hidden = false;

    window.scrollTo({ top: 0, behavior: "smooth" });
});

const ticTacToeFeld = document.getElementById("ticTacToeFeld");
const spielerAnzeige = document.getElementById("spielerAnzeige");
const spielMeldung = document.getElementById("spielMeldung");
const spielmodusAuswahl = document.getElementById("spielmodus");
const variantenwahl = document.getElementById("variantenwahl");

let aktuellerSpieler = "X";
let spielBeendet = false;
let botDenkt = false;
let feldWerte = Array(9).fill("");
let aufgaben = [];
let gewinnFelder = [];

const aufgabenPool = [
    { name: "63+", text: "Erziele mit maximal 3 Darts mehr als 63 Punkte." },
    { name: "Doppel 17", text: "Triff mindestens einmal D17." },
    { name: "Doppel 18", text: "Triff mindestens einmal D18." },
    { name: "Doppel 19", text: "Triff mindestens einmal D19." },
    { name: "Doppel 20", text: "Triff mindestens einmal D20." },
    { name: "Triple 20", text: "Triff mindestens einmal T20." },
    { name: "Triple 19", text: "Triff mindestens einmal T19." },
    { name: "Triple 18", text: "Triff mindestens einmal T18." },
    { name: "Bull", text: "Triff das äußere Bull (25)." },
    { name: "Bullseye", text: "Triff das innere Bull (50)." },
    { name: "High Score", text: "Erziele mindestens 100 Punkte mit 3 Darts." },
    { name: "Punktzahl 60+", text: "Erziele mindestens 60 Punkte mit 3 Darts." },
    { name: "Punktzahl 80+", text: "Erziele mindestens 80 Punkte mit 3 Darts." },
    { name: "Drei Singles", text: "Triff drei unterschiedliche einfache Zahlen." },
    { name: "Drei Doubles", text: "Triff zwei unterschiedliche Doppelfelder." },
    { name: "Zahlenfolge", text: "Triff drei aufeinanderfolgende Zahlen." },
    { name: "Gerade Zahl", text: "Erziele eine gerade Gesamtpunktzahl." },
    { name: "Ungerade Zahl", text: "Erziele eine ungerade Gesamtpunktzahl." },
    { name: "Drei gleiche", text: "Triff dreimal dasselbe Zahlenfeld." },
    { name: "T20 oder T19", text: "Triff T20 oder T19." },
    { name: "Doppel-Treffer", text: "Triff zwei verschiedene Doppelfelder." },
    { name: "Niedrige Zahlen", text: "Triff drei verschiedene Zahlen von 1 bis 10." },
    { name: "Hohe Zahlen", text: "Triff drei verschiedene Zahlen von 15 bis 20." },
    { name: "Summe 40+", text: "Erziele mindestens 40 Punkte mit 3 Darts." },
    { name: "Summe 50+", text: "Erziele mindestens 50 Punkte mit 3 Darts." },
    { name: "Summe 70+", text: "Erziele mindestens 70 Punkte mit 3 Darts." },
    { name: "T18", text: "Triff mindestens einmal T18." },
    { name: "T17", text: "Triff mindestens einmal T17." },
    { name: "T16", text: "Triff mindestens einmal T16." },
    { name: "D16", text: "Triff mindestens einmal D16." },
    { name: "D15", text: "Triff mindestens einmal D15." },
    { name: "D12", text: "Triff mindestens einmal D12." },
    { name: "D10", text: "Triff mindestens einmal D10." },
    { name: "D8", text: "Triff mindestens einmal D8." },
    { name: "D4", text: "Triff mindestens einmal D4." },
    { name: "S20", text: "Triff mindestens einmal die einfache 20." },
    { name: "S19", text: "Triff mindestens einmal die einfache 19." },
    { name: "S18", text: "Triff mindestens einmal die einfache 18." },
    { name: "S17", text: "Triff mindestens einmal die einfache 17." },
    { name: "S16", text: "Triff mindestens einmal die einfache 16." },
    { name: "Zwei Triples", text: "Triff zwei verschiedene Triplefelder." },
    { name: "Triple 15+", text: "Triff ein Triple von 15 bis 20." },
    { name: "Doppel 1–10", text: "Triff ein Doppelfeld von D1 bis D10." },
    { name: "Zwei Singles", text: "Triff zwei unterschiedliche einfache Zahlen." },
    { name: "Summe unter 30", text: "Erziele weniger als 30 Punkte mit 3 Darts." },
    { name: "Summe 41+", text: "Erziele mindestens 41 Punkte mit 3 Darts." },
    { name: "Wechsel", text: "Triff eine gerade und eine ungerade Zahl." },
    { name: "Zwei hohe Treffer", text: "Triff zweimal eine Zahl von 18 bis 20." },
    { name: "Doppel 11", text: "Triff mindestens einmal D11." },
    { name: "Doppel 13", text: "Triff mindestens einmal D13." },
    { name: "Doppel 14", text: "Triff mindestens einmal D14." }
];

function aufgabenMischen() {
    const pool = [...aufgabenPool];

    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }

    aufgaben = pool.slice(0, 9);
}

function gewinnerPruefen() {
    const kombinationen = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    gewinnFelder = [];

    for (const [a, b, c] of kombinationen) {
        if (
            feldWerte[a] !== "" &&
            feldWerte[a] === feldWerte[b] &&
            feldWerte[a] === feldWerte[c]
        ) {
            gewinnFelder = [a, b, c];
            return feldWerte[a];
        }
    }

    return null;
}


function spielAbschliessen(gewinner) {
    spielBeendet = true;

    if (gewinner) {
        if (spielmodusAuswahl.value === "bot") {
            spielerAnzeige.textContent =
                gewinner === "X" ? "Du gewinnst!" : "Der Bot gewinnt!";
        } else {
            spielerAnzeige.textContent = `Spieler ${gewinner} gewinnt!`;
        }

        spielMeldung.textContent =
            `Glückwunsch! Spieler ${gewinner} hat drei Felder in einer Reihe!`;

        spielMeldung.classList.remove("gewinn-meldung");
        void spielMeldung.offsetWidth;
        spielMeldung.classList.add("gewinn-meldung");
    } else {
        spielMeldung.classList.remove("gewinn-meldung");
        spielMeldung.textContent = "Unentschieden! Alle Felder sind belegt.";
        spielerAnzeige.textContent = "Unentschieden!";
    }

    ticTacToeFeld.querySelectorAll("button").forEach(function (taste) {
        taste.disabled = true;
    });
}

function feldErstellen() {
    ticTacToeFeld.innerHTML = "";

    aufgaben.forEach(function (aufgabe, i) {
        const feld = document.createElement("button");
        feld.className = "tic-feld";
        feld.type = "button";

        if (gewinnFelder.includes(i)) {
            feld.classList.add("gewinn-feld");
        }

        if (feldWerte[i] !== "") {
            feld.classList.add("feld-belegt");
            feld.textContent = feldWerte[i];
            feld.disabled = true;
        } else {
            const titel = document.createElement("strong");
            titel.textContent = aufgabe.name;

            const beschreibung = document.createElement("span");
            beschreibung.textContent = aufgabe.text;

            feld.append(titel, beschreibung);

            feld.addEventListener("click", function () {
                if (spielBeendet || botDenkt) return;

                if (
                    spielmodusAuswahl.value === "bot" &&
                    aktuellerSpieler !== "X"
                ) {
                    return;
                }

                const getroffen = confirm(
                    `Aufgabe: ${aufgabe.name}\n\n${aufgabe.text}\n\nHast du die Aufgabe getroffen?`
                );

                if (!getroffen) {
    spielMeldung.textContent =
        "Treffer nicht bestätigt! Der nächste Spieler ist dran.";

    if (spielmodusAuswahl.value === "bot") {
        aktuellerSpieler = "O";
        spielerAnzeige.textContent = "Am Zug: Bot (O)";
        botZug();
        return;
    }
    if (spielmodusAuswahl.value === "training") {
        spielMeldung.textContent =
            "Treffer nicht bestätigt. Wähle die nächste Aufgabe.";
        return;
    }

    aktuellerSpieler = aktuellerSpieler === "X" ? "O" : "X";
    spielerAnzeige.textContent =
        `Am Zug: Spieler ${aktuellerSpieler}`;

    spielMeldung.textContent =
        `Treffer nicht bestätigt! Spieler ${aktuellerSpieler} ist an der Reihe.`;

    return;
}

                feldWerte[i] = aktuellerSpieler;

                const gewinner = gewinnerPruefen();
                feldErstellen();

                if (gewinner) {
                    spielAbschliessen(gewinner);
                    return;
                }

                if (feldWerte.every(wert => wert !== "")) {
                    spielAbschliessen(null);
                    return;
                }

                if (spielmodusAuswahl.value === "bot") {
                    aktuellerSpieler = "O";
                    botZug();
                    return;
                }

                if (spielmodusAuswahl.value === "training") {
                    aktuellerSpieler = "X";
                    spielerAnzeige.textContent = "Trainingsmodus";
                    spielMeldung.textContent =
                        "Gut gemacht! Wähle die nächste Aufgabe.";
                    return;
                }

                aktuellerSpieler = aktuellerSpieler === "X" ? "O" : "X";
                spielerAnzeige.textContent = `Am Zug: Spieler ${aktuellerSpieler}`;
                spielMeldung.textContent =
                    `Treffer bestätigt! Spieler ${aktuellerSpieler} ist an der Reihe.`;
            });
        }

        if (spielBeendet) {
            feld.disabled = true;
        }

        ticTacToeFeld.appendChild(feld);
    });
}


function botZug() {
    if (spielBeendet) return;

    botDenkt = true;
    spielerAnzeige.textContent = "Der Bot denkt nach ...";
    spielMeldung.textContent = "Der Bot sucht den besten Zug.";

    setTimeout(function () {
        if (spielBeendet) {
            botDenkt = false;
            return;
        }

        const kombinationen = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        const freieFelder = feldWerte
            .map((wert, index) => wert === "" ? index : -1)
            .filter(index => index !== -1);

        if (freieFelder.length === 0) {
            botDenkt = false;
            spielAbschliessen(null);
            return;
        }

        function findeDreierZug(spieler) {
            for (const kombi of kombinationen) {
                const werte = kombi.map(index => feldWerte[index]);
                const freieStelle = kombi.find(index => feldWerte[index] === "");

                if (
                    freieStelle !== undefined &&
                    werte.filter(wert => wert === spieler).length === 2
                ) {
                    return freieStelle;
                }
            }

            return null;
        }

        // 1. Wenn möglich, gewinnt der Bot sofort.
        let zug = findeDreierZug("O");

        // 2. Sonst blockiert er deinen möglichen Sieg.
        if (zug === null) {
            zug = findeDreierZug("X");
        }

        // 3. Sonst nimmt er die Mitte, wenn sie frei ist.
        if (zug === null && feldWerte[4] === "") {
            zug = 4;
        }

        // 4. Sonst wählt er ein zufälliges freies Feld.
        if (zug === null) {
            zug = freieFelder[
                Math.floor(Math.random() * freieFelder.length)
            ];
        }

        feldWerte[zug] = "O";

        const gewinner = gewinnerPruefen();
        botDenkt = false;
        feldErstellen();

        if (gewinner) {
            spielAbschliessen(gewinner);
            return;
        }

        if (feldWerte.every(wert => wert !== "")) {
            spielAbschliessen(null);
            return;
        }

        aktuellerSpieler = "X";
        spielerAnzeige.textContent = "Am Zug: Du (X)";
        spielMeldung.textContent =
            "Der Bot hat gezogen. Du bist wieder dran.";
    }, 600);
}

function neueRunde() {
    aktuellerSpieler = "X";
    spielBeendet = false;
    botDenkt = false;
    feldWerte = Array(9).fill("");
    gewinnFelder = [];

    aufgabenMischen();

    spielerAnzeige.textContent =
        spielmodusAuswahl.value === "training"
            ? "Trainingsmodus"
            : spielmodusAuswahl.value === "bot"
                ? "Am Zug: Du (X)"
                : "Am Zug: Spieler X";

    spielMeldung.classList.remove("gewinn-meldung");

    spielMeldung.textContent =
        "Erfülle die Aufgabe und bestätige den Treffer.";

    feldErstellen();
}

document.getElementById("neustart").addEventListener("click", neueRunde);

spielmodusAuswahl.addEventListener("change", function () {
    neueRunde();
});

neueRunde();








/* ==========================================
   X01 / 301 / 501 / 701 – Dart-Spiel
   ========================================== */

const x01Startscore = document.getElementById("x01Startscore");
const x01EigeneStartzahl = document.getElementById("x01EigeneStartzahl");
const x01EigeneStartzahlBereich = document.getElementById("x01EigeneStartzahlBereich");

const x01Spielmodus = document.getElementById("x01Spielmodus");
const x01BotSchwierigkeit = document.getElementById("x01BotSchwierigkeit");
const x01DoubleOut = document.getElementById("x01DoubleOut");

const x01SpielerAnzeige = document.getElementById("x01SpielerAnzeige");
const x01PunkteX = document.getElementById("x01PunkteX");
const x01PunkteO = document.getElementById("x01PunkteO");
const x01AufnahmenX = document.getElementById("x01AufnahmenX");
const x01AufnahmenO = document.getElementById("x01AufnahmenO");
const x01SpielerO = document.getElementById("x01SpielerO");
const x01NameO = document.getElementById("x01NameO");
const x01Aufnahme = document.getElementById("x01Aufnahme");
const x01Darts = document.getElementById("x01Darts");
const x01Ring = document.getElementById("x01Ring");
const x01Zahl = document.getElementById("x01Zahl");
const x01Meldung = document.getElementById("x01Meldung");

let x01Punkte = { X: 501, O: 501 };
let x01Aufnahmen = { X: 0, O: 0 };
let x01DartWerte = [];
let x01Spieler = "X";
let x01Beendet = false;
let x01BotDenkt = false;
let x01AufnahmeStart = 501;
let x01BotTimer = null;

function x01Startwert() {
    if (x01Startscore.value === "custom") {
        const eigeneZahl = Number(x01EigeneStartzahl.value);

        if (
            !Number.isInteger(eigeneZahl) ||
            eigeneZahl < 2 ||
            eigeneZahl > 10000
        ) {
            alert("Bitte gib eine ganze Startzahl zwischen 2 und 10000 ein.");
            x01EigeneStartzahl.focus();
            return null;
        }

        return eigeneZahl;
    }

    return Number(x01Startscore.value);
}

function x01EigeneStartzahlAktualisieren() {
    const eigeneZahlAktiv = x01Startscore.value === "custom";

    if (x01EigeneStartzahlBereich) {
        x01EigeneStartzahlBereich.hidden = !eigeneZahlAktiv;
    }

    if (x01EigeneStartzahl) {
        x01EigeneStartzahl.disabled = !eigeneZahlAktiv;
    }
}

function x01AnzeigeAktualisieren() {
    x01PunkteX.textContent = x01Punkte.X;
    x01PunkteO.textContent = x01Punkte.O;

    x01AufnahmenX.textContent = `Aufnahmen: ${x01Aufnahmen.X}`;
    x01AufnahmenO.textContent = `Aufnahmen: ${x01Aufnahmen.O}`;

    const modus = x01Spielmodus.value;

    x01SpielerO.hidden = modus === "training";

    if (x01NameO) {
        x01NameO.textContent = modus === "bot" ? "Bot" : "Spieler 2";
    }

    if (x01Beendet) {
        x01SpielerAnzeige.textContent =
            x01Spieler === "1"
                ? "Spieler 1 gewinnt!"
                : modus === "bot"
                    ? "Der Bot gewinnt!"
                    : "Spieler 2 gewinnt!";
    } else if (x01BotDenkt) {
        x01SpielerAnzeige.textContent = "Bot wirft ...";
    } else if (modus === "training") {
        x01SpielerAnzeige.textContent = "Trainingsmodus";
    } else if (modus === "bot") {
        x01SpielerAnzeige.textContent =
            x01Spieler === "1" ? "Am Zug: Du" : "Am Zug: Bot";
    } else {
        x01SpielerAnzeige.textContent = `Am Zug: Spieler ${x01Spieler}`;
    }

    x01Aufnahme.textContent = `Dart ${Math.min(x01DartWerte.length + 1, 3)} von 3`;

    x01Darts.textContent = x01DartWerte.length
        ? `Aktuelle Aufnahme: ${x01DartWerte.join(" + ")} = ${
            x01DartWerte.reduce((summe, wert) => summe + wert, 0)
        }`
        : "Noch keine Darts geworfen.";
}

function x01NeuesLeg() {
    if (x01BotTimer !== null) {
        clearTimeout(x01BotTimer);
        x01BotTimer = null;
    }

    const start = x01Startwert();
    if (start === null) return;

    x01Punkte = { X: start, O: start };
    x01Aufnahmen = { X: 0, O: 0 };
    x01DartWerte = [];
    x01Spieler = "X";
    x01AufnahmeStart = start;
    x01Beendet = false;
    x01BotDenkt = false;

    x01Meldung.textContent = "Gib deinen ersten Dart ein.";
    x01AnzeigeAktualisieren();
}

function x01AufnahmeBeenden(bust = false) {
    if (bust) {
        x01Punkte[x01Spieler] = x01AufnahmeStart;
    } else {
        x01Punkte[x01Spieler] = x01AufnahmeStart -
            x01DartWerte.reduce((summe, dart) => summe + dart, 0);
    }

    x01Aufnahmen[x01Spieler]++;
    x01DartWerte = [];

    if (x01Spielmodus.value !== "training") {
        x01Spieler = x01Spieler === "X" ? "O" : "X";
    }

    x01AufnahmeStart = x01Punkte[x01Spieler];
    x01AnzeigeAktualisieren();

    if (!x01Beendet && x01Spielmodus.value === "bot" && x01Spieler === "O") {
        x01BotZug();
    }
}

function x01DartEintragen(wert, istDoppel = false) {
    if (x01Beendet || x01BotDenkt || x01DartWerte.length >= 3) return;
    if (x01Spielmodus.value === "bot" && x01Spieler === "O") return;

    const bereitsGeworfen = x01DartWerte.reduce(
        (summe, dart) => summe + dart,
        0
    );

    const rest = x01AufnahmeStart - bereitsGeworfen - wert;
    const doubleOut = x01DoubleOut.value === "an";

    if (
        rest < 0 ||
        (doubleOut && rest === 1) ||
        (rest === 0 && doubleOut && !istDoppel)
    ) {
        x01DartWerte.push(wert);
        x01Meldung.textContent = "Bust! Die gesamte Aufnahme zählt nicht.";
        x01AufnahmeBeenden(true);
        return;
    }

    x01DartWerte.push(wert);

    if (rest === 0) {
        x01Punkte[x01Spieler] = 0;
        x01Aufnahmen[x01Spieler]++;
        x01Beendet = true;

        x01Meldung.textContent =
            `Checkout! ${x01Spieler === "O" && x01Spielmodus.value === "bot"
                ? "Der Bot"
                : `Spieler ${x01Spieler}`} gewinnt das Leg!`;

        x01AnzeigeAktualisieren();
        return;
    }

    if (x01DartWerte.length === 3) {
        x01Meldung.textContent =
            "Drei Darts geworfen. Die Aufnahme ist beendet.";
        x01AufnahmeBeenden();
        return;
    }

    x01Meldung.textContent = `Noch ${rest} Punkte.`;
    x01AnzeigeAktualisieren();
}

function x01BotDart(rest, schwierigkeitsgrad) {
    const doubleOut = x01DoubleOut.value === "an";

    if (rest <= 40 && rest > 0) {
        if (doubleOut && rest % 2 === 0 && rest <= 40) {
            return { wert: rest, doppel: true };
        }

        if (!doubleOut) {
            return { wert: rest, doppel: false };
        }

        if (rest === 50) {
            return { wert: 50, doppel: true };
        }
    }

    const treffer = [];
    const anzahl = schwierigkeitsgrad === "leicht"
        ? 1
        : schwierigkeitsgrad === "mittel"
            ? 2
            : 3;

    for (let i = 0; i < anzahl; i++) {
        const zahl = Math.floor(Math.random() * 20) + 1;
        const ringZufall = Math.random();

        let multiplikator = 1;

        if (schwierigkeitsgrad === "leicht") {
            multiplikator = ringZufall < 0.08 ? 3 : ringZufall < 0.25 ? 2 : 1;
        } else if (schwierigkeitsgrad === "mittel") {
            multiplikator = ringZufall < 0.2 ? 3 : ringZufall < 0.45 ? 2 : 1;
        } else {
            multiplikator = ringZufall < 0.4 ? 3 : ringZufall < 0.7 ? 2 : 1;
        }

        treffer.push({
            wert: zahl * multiplikator,
            doppel: multiplikator === 2
        });
    }

    const auswahl = treffer[Math.floor(Math.random() * treffer.length)];
    const neuerRest = rest - auswahl.wert;

    if (
        neuerRest < 0 ||
        (doubleOut && neuerRest === 1) ||
        (doubleOut && neuerRest === 0 && !auswahl.doppel)
    ) {
        return { wert: 0, doppel: false };
    }

    return auswahl;
}

function x01BotZug() {
    if (x01Beendet || x01Spielmodus.value !== "bot" || x01Spieler !== "O") {
        return;
    }

    x01BotDenkt = true;
    x01DartWerte = [];
    x01AufnahmeStart = x01Punkte.O;
    x01AnzeigeAktualisieren();
    x01Meldung.textContent = "Der Bot berechnet seine Aufnahme ...";

    let dartNummer = 0;

    function botWirftWeiter() {
        if (x01Beendet || x01Spielmodus.value !== "bot" || x01Spieler !== "O") {
            x01BotDenkt = false;
            return;
        }

        const geworfen = x01DartWerte.reduce(
            (summe, dart) => summe + dart,
            0
        );

        const rest = x01AufnahmeStart - geworfen;
        const wurf = x01BotDart(rest, x01BotSchwierigkeit.value);
        const neuerRest = rest - wurf.wert;
        const doubleOut = x01DoubleOut.value === "an";

        dartNummer++;

        if (
            neuerRest < 0 ||
            (doubleOut && neuerRest === 1) ||
            (doubleOut && neuerRest === 0 && !wurf.doppel)
        ) {
            x01DartWerte.push(wurf.wert);
            x01Meldung.textContent = "Der Bot hat einen Bust geworfen.";
            x01BotDenkt = false;
            x01AufnahmeBeenden(true);
            return;
        }

        x01DartWerte.push(wurf.wert);

        if (neuerRest === 0) {
            x01Punkte.O = 0;
            x01Aufnahmen.O++;
            x01Beendet = true;
            x01BotDenkt = false;
            x01Meldung.textContent = "Der Bot hat ausgecheckt und gewinnt!";
            x01AnzeigeAktualisieren();
            return;
        }

        if (dartNummer >= 3) {
            x01Meldung.textContent = "Der Bot hat drei Darts geworfen.";
            x01BotDenkt = false;
            x01AufnahmeBeenden();
            return;
        }

        x01AnzeigeAktualisieren();
        x01BotTimer = setTimeout(botWirftWeiter, 500);
    }

    x01BotTimer = setTimeout(botWirftWeiter, 500);
}

document.getElementById("x01Eintragen").addEventListener("click", function () {
    const multiplikator = { S: 1, D: 2, T: 3 }[x01Ring.value];
    const wert = Number(x01Zahl.value) * multiplikator;

    x01DartEintragen(wert, x01Ring.value === "D");
});

document.getElementById("x01Bull").addEventListener("click", function () {
    x01DartEintragen(25);
});

document.getElementById("x01Bullseye").addEventListener("click", function () {
    x01DartEintragen(50, true);
});

document.getElementById("x01Miss").addEventListener("click", function () {
    x01DartEintragen(0);
});

document.getElementById("x01Neustart").addEventListener("click", x01NeuesLeg);

function x01StartscoreAktualisieren() {
    x01EigeneStartzahlAktualisieren();
    x01NeuesLeg();
}

if (x01Startscore) {
    x01Startscore.addEventListener("change", x01StartscoreAktualisieren);
}

if (x01EigeneStartzahl) {
    x01EigeneStartzahl.addEventListener("change", function () {
        if (x01Startscore.value === "custom") x01NeuesLeg();
    });
}

if (x01Spielmodus) {
    x01Spielmodus.addEventListener("change", x01NeuesLeg);
}

if (x01BotSchwierigkeit) {
    x01BotSchwierigkeit.addEventListener("change", x01NeuesLeg);
}

if (x01DoubleOut) {
    x01DoubleOut.addEventListener("change", x01NeuesLeg);
}

x01EigeneStartzahlAktualisieren();
x01NeuesLeg();


/* ==========================================
   DARTFORGE – CHECKOUT-TRAINING
   Einzelspieler, Double-Out und Single-Out
   ========================================== */

const checkoutRest = document.getElementById("checkoutRest");
const checkoutAufgabe = document.getElementById("checkoutAufgabe");
const checkoutOutModus = document.getElementById("checkoutOutModus");
const checkoutRing = document.getElementById("checkoutRing");
const checkoutZahl = document.getElementById("checkoutZahl");
const checkoutDarts = document.getElementById("checkoutDarts");
const checkoutMeldung = document.getElementById("checkoutMeldung");
const checkoutWeg = document.getElementById("checkoutWeg");

let checkoutPunkte = 40;
let checkoutWuerfe = [];
let checkoutAufgabenNummer = 1;
let checkoutLetzteAufgabe = null;

const checkoutAufgabenPool = [
    2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
    32, 33, 34, 35, 36, 37, 38, 39, 40, 41,
    42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61,
    62, 63, 64, 65, 66, 67, 68, 69, 70, 71,
    72, 73, 74, 75, 76, 77, 78, 79, 80, 81,
    82, 83, 84, 85, 86, 87, 88, 89, 90, 91,
    92, 93, 94, 95, 96, 97, 98, 99, 100, 101
];

function checkoutTrefferErzeugen() {
    const treffer = [];

    for (let zahl = 1; zahl <= 20; zahl++) {
        treffer.push({ name: `S${zahl}`, wert: zahl, art: "S" });
        treffer.push({ name: `D${zahl}`, wert: zahl * 2, art: "D" });
        treffer.push({ name: `T${zahl}`, wert: zahl * 3, art: "T" });
    }

    treffer.push({ name: "Bull", wert: 25, art: "S" });
    treffer.push({ name: "Bullseye", wert: 50, art: "D" });
    treffer.push({ name: "Daneben", wert: 0, art: "S" });

    return treffer;
}

const checkoutTreffer = checkoutTrefferErzeugen();

function checkoutWegFinden(rest, modus) {
    if (rest <= 0 || rest > 170) return null;

    const erlaubteTreffer = checkoutTreffer.filter(t => t.wert > 0);

    function suchen(aktuellerRest, dartsUebrig, weg) {
        if (aktuellerRest === 0) return weg;

        if (dartsUebrig === 0) return null;

        for (const treffer of erlaubteTreffer) {
            if (treffer.wert > aktuellerRest) continue;

            const neuerRest = aktuellerRest - treffer.wert;

            if (neuerRest === 0) {
                if (modus === "double" && treffer.art !== "D") continue;
                return [...weg, treffer.name];
            }

            if (neuerRest === 1 && modus === "double") continue;

            const ergebnis = suchen(
                neuerRest,
                dartsUebrig - 1,
                [...weg, treffer.name]
            );

            if (ergebnis) return ergebnis;
        }

        return null;
    }

    return suchen(rest, 3, []);
}

function checkoutNeueAufgabe() {
    checkoutWuerfe = [];
    checkoutLetzteAufgabe = null;

    const modus = checkoutOutModus.value;

    const moeglicheAufgaben = checkoutAufgabenPool.filter(
        punkte => checkoutWegFinden(punkte, modus) !== null
    );

    const andereAufgaben = moeglicheAufgaben.filter(
        punkte => punkte !== checkoutLetzteAufgabe
    );

    const pool = andereAufgaben.length ? andereAufgaben : moeglicheAufgaben;

    checkoutPunkte = pool[Math.floor(Math.random() * pool.length)];
    checkoutLetzteAufgabe = checkoutPunkte;

    checkoutAufgabe.textContent =
        `Aufgabe ${checkoutAufgabenNummer} · ${modus === "double" ? "Double-Out" : "Single-Out"}`;

    checkoutAufgabenNummer++;
    checkoutWeg.hidden = true;
    checkoutWeg.textContent = "";

    checkoutMeldung.textContent = "Finde deinen Checkout!";
    checkoutAktualisieren();
}

function checkoutAktualisieren() {
    checkoutRest.textContent = checkoutPunkte;

    checkoutDarts.textContent = checkoutWuerfe.length
        ? `Deine Aufnahme: ${checkoutWuerfe.map(t => t.name).join(" + ")}`
        : "Noch keine Darts geworfen.";
}

function checkoutWurf(art, zahl) {
    if (checkoutPunkte <= 0 || checkoutWuerfe.length >= 3) return;

    let wert = zahl;

    if (art === "D") wert *= 2;
    if (art === "T") wert *= 3;

    checkoutWurfEintragen({
        name: wert === 0 ? "Daneben" : `${art}${zahl}`,
        wert,
        art
    });
}

function checkoutWurfEintragen(treffer) {
    const restNachWurf = checkoutPunkte - treffer.wert;
    const doubleOut = checkoutOutModus.value === "double";

    const bust =
        restNachWurf < 0 ||
        (doubleOut && restNachWurf === 1) ||
        (restNachWurf === 0 && doubleOut && treffer.art !== "D");

    checkoutWuerfe.push(treffer);

    if (bust) {
        checkoutPunkte = checkoutPunkte;
        checkoutMeldung.textContent =
            "Bust! Diese Aufnahme zählt nicht. Starte eine neue Aufgabe.";
        checkoutAktualisieren();
        return;
    }

    checkoutPunkte = restNachWurf;

    if (checkoutPunkte === 0) {
        checkoutMeldung.textContent =
            `Checkout geschafft! Mit ${checkoutWuerfe.length} Dart(s) ausgecheckt.`;
        checkoutAktualisieren();
        return;
    }

    if (checkoutWuerfe.length >= 3) {
        checkoutMeldung.textContent =
            `Aufnahme beendet. Es bleiben ${checkoutPunkte} Punkte. Starte eine neue Aufgabe.`;
        checkoutAktualisieren();
        return;
    }

    checkoutMeldung.textContent = `Noch ${checkoutPunkte} Punkte.`;
    checkoutAktualisieren();
}

document.getElementById("checkoutEintragen").addEventListener("click", function () {
    checkoutWurf(checkoutRing.value, Number(checkoutZahl.value));
});

document.getElementById("checkoutBull").addEventListener("click", function () {
    checkoutWurfEintragen({ name: "Bull", wert: 25, art: "S" });
});

document.getElementById("checkoutBullseye").addEventListener("click", function () {
    checkoutWurfEintragen({ name: "Bullseye", wert: 50, art: "D" });
});

document.getElementById("checkoutMiss").addEventListener("click", function () {
    checkoutWurfEintragen({ name: "Daneben", wert: 0, art: "S" });
});

document.getElementById("checkoutNeu").addEventListener("click", checkoutNeueAufgabe);

document.getElementById("checkoutHinweis").addEventListener("click", function () {
    const weg = checkoutWegFinden(checkoutPunkte, checkoutOutModus.value);

    checkoutWeg.textContent = weg
        ? `Möglicher Weg: ${weg.join(" → ")}`
        : "Für diesen Restscore wurde kein Checkout-Weg gefunden.";

    checkoutWeg.hidden = false;
});

checkoutOutModus.addEventListener("change", checkoutNeueAufgabe);

checkoutNeueAufgabe();

if (statsZurueck) {
    statsZurueck.addEventListener("click", () => {
        statsBereich.hidden = true;

        if (spielbereich) spielbereich.hidden = true;
        if (begruessung) begruessung.hidden = false;
        if (infoKarte) infoKarte.hidden = false;
    });
}