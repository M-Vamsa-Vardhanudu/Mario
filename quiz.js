/**
 * Quiz System for Mario Game
 * - 50 basic math questions pool
 * - Shows MCQ with 10-second timer on quiz "?" blocks
 * - Wrong answer or timeout restarts the level
 * - 3 quiz blocks per level; must answer all 3 to clear
 */
(function () {
    "use strict";

    // ===================== QUESTION POOL (50 questions) =====================
    var questionPool = [
        { q: "What is 2 + 3?", options: ["4", "5", "6", "7"], answer: 1 },
        { q: "What is 9 - 4?", options: ["3", "5", "6", "4"], answer: 1 },
        { q: "What is 6 x 3?", options: ["15", "18", "21", "12"], answer: 1 },
        { q: "What is 12 / 4?", options: ["2", "4", "3", "6"], answer: 2 },
        { q: "What is 7 + 8?", options: ["14", "16", "15", "13"], answer: 2 },
        { q: "What is 10 - 6?", options: ["5", "3", "4", "6"], answer: 2 },
        { q: "What is 5 x 5?", options: ["20", "30", "25", "15"], answer: 2 },
        { q: "What is 20 / 5?", options: ["5", "4", "3", "6"], answer: 1 },
        { q: "What is 11 + 9?", options: ["19", "21", "20", "18"], answer: 2 },
        { q: "What is 15 - 7?", options: ["9", "7", "6", "8"], answer: 3 },
        { q: "What is 4 x 6?", options: ["24", "20", "28", "18"], answer: 0 },
        { q: "What is 36 / 6?", options: ["5", "7", "6", "8"], answer: 2 },
        { q: "What is 13 + 7?", options: ["19", "21", "20", "18"], answer: 2 },
        { q: "What is 18 - 9?", options: ["8", "10", "7", "9"], answer: 3 },
        { q: "What is 8 x 7?", options: ["54", "48", "56", "64"], answer: 2 },
        { q: "What is 45 / 9?", options: ["6", "4", "5", "7"], answer: 2 },
        { q: "What is 25 + 17?", options: ["41", "43", "42", "40"], answer: 2 },
        { q: "What is 30 - 13?", options: ["18", "16", "17", "15"], answer: 2 },
        { q: "What is 9 x 9?", options: ["72", "81", "90", "63"], answer: 1 },
        { q: "What is 64 / 8?", options: ["6", "9", "7", "8"], answer: 3 },
        { q: "What is 14 + 16?", options: ["28", "31", "30", "29"], answer: 2 },
        { q: "What is 50 - 25?", options: ["20", "30", "15", "25"], answer: 3 },
        { q: "What is 7 x 4?", options: ["24", "32", "28", "21"], answer: 2 },
        { q: "What is 48 / 6?", options: ["7", "9", "6", "8"], answer: 3 },
        { q: "What is 33 + 27?", options: ["59", "61", "60", "58"], answer: 2 },
        { q: "What is 100 - 45?", options: ["65", "55", "50", "45"], answer: 1 },
        { q: "What is 12 x 3?", options: ["33", "36", "39", "30"], answer: 1 },
        { q: "What is 72 / 9?", options: ["9", "7", "8", "6"], answer: 2 },
        { q: "What is 19 + 21?", options: ["39", "41", "40", "38"], answer: 2 },
        { q: "What is 40 - 18?", options: ["28", "20", "22", "24"], answer: 2 },
        { q: "What is 6 x 8?", options: ["42", "54", "48", "36"], answer: 2 },
        { q: "What is 56 / 7?", options: ["9", "7", "6", "8"], answer: 3 },
        { q: "What is 45 + 35?", options: ["75", "85", "80", "70"], answer: 2 },
        { q: "What is 60 - 33?", options: ["37", "27", "23", "33"], answer: 1 },
        { q: "What is 11 x 4?", options: ["40", "48", "44", "36"], answer: 2 },
        { q: "What is 81 / 9?", options: ["8", "7", "9", "10"], answer: 2 },
        { q: "What is 8 + 14?", options: ["20", "24", "22", "18"], answer: 2 },
        { q: "What is 27 - 9?", options: ["16", "20", "18", "15"], answer: 2 },
        { q: "What is 3 x 11?", options: ["30", "36", "33", "27"], answer: 2 },
        { q: "What is 54 / 6?", options: ["8", "7", "9", "6"], answer: 2 },
        { q: "What is 16 + 24?", options: ["38", "42", "40", "36"], answer: 2 },
        { q: "What is 75 - 38?", options: ["43", "37", "33", "27"], answer: 1 },
        { q: "What is 5 x 9?", options: ["40", "50", "45", "35"], answer: 2 },
        { q: "What is 63 / 7?", options: ["8", "7", "9", "6"], answer: 2 },
        { q: "What is 22 + 18?", options: ["38", "42", "40", "36"], answer: 2 },
        { q: "What is 90 - 47?", options: ["53", "43", "47", "37"], answer: 1 },
        { q: "What is 8 x 6?", options: ["42", "54", "48", "36"], answer: 2 },
        { q: "What is 32 / 4?", options: ["6", "9", "7", "8"], answer: 3 },
        { q: "What is 55 + 25?", options: ["75", "85", "80", "70"], answer: 2 },
        { q: "What is 10 x 10?", options: ["90", "110", "100", "80"], answer: 2 }
    ];

    // Shuffle helper (Fisher-Yates)
    function shuffleArray(arr) {
        var i, j, tmp;
        for (i = arr.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
        }
        return arr;
    }

    // ===================== QUIZ STATE =====================
    var quizState = {
        questionsAnswered: 0,
        questionsRequired: 3,
        activeQuiz: false,
        timerInterval: null,
        usedQuestions: []
    };

    function pickQuestion() {
        if (quizState.usedQuestions.length >= questionPool.length) {
            quizState.usedQuestions = [];
        }
        var available = [];
        for (var i = 0; i < questionPool.length; i++) {
            if (quizState.usedQuestions.indexOf(i) === -1) {
                available.push(i);
            }
        }
        shuffleArray(available);
        var idx = available[0];
        quizState.usedQuestions.push(idx);
        return questionPool[idx];
    }

    // ===================== CREATE OVERLAY UI =====================
    function createOverlayUI() {
        if (document.getElementById("quiz-overlay")) return;
        var overlay = document.createElement("div");
        overlay.id = "quiz-overlay";
        overlay.innerHTML =
            '<div id="quiz-box">' +
                '<div id="quiz-timer-bar"><div id="quiz-timer-fill"></div></div>' +
                '<div id="quiz-timer-text">10</div>' +
                '<div id="quiz-question"></div>' +
                '<div id="quiz-score-info"></div>' +
                '<div id="quiz-options"></div>' +
                '<div id="quiz-result"></div>' +
            '</div>';
        document.body.appendChild(overlay);
    }

    // ===================== SHOW QUIZ =====================
    function showQuiz(FSM, block, player) {
        if (quizState.activeQuiz) return;
        quizState.activeQuiz = true;

        // Pause the game
        if (!FSM.GamesRunner.getPaused()) {
            FSM.GamesRunner.pause();
        }

        createOverlayUI();

        var question = pickQuestion();
        var timeLeft = 10;
        var answered = false;

        var overlay = document.getElementById("quiz-overlay");
        var questionEl = document.getElementById("quiz-question");
        var optionsEl = document.getElementById("quiz-options");
        var resultEl = document.getElementById("quiz-result");
        var timerText = document.getElementById("quiz-timer-text");
        var timerFill = document.getElementById("quiz-timer-fill");
        var scoreInfo = document.getElementById("quiz-score-info");

        overlay.style.display = "flex";
        questionEl.textContent = question.q;
        resultEl.textContent = "";
        resultEl.className = "";
        scoreInfo.textContent = "Questions answered: " + quizState.questionsAnswered + " / " + quizState.questionsRequired;
        timerText.textContent = "10";
        timerFill.style.width = "100%";
        timerFill.className = "";

        optionsEl.innerHTML = "";
        for (var i = 0; i < question.options.length; i++) {
            (function (idx) {
                var btn = document.createElement("button");
                btn.className = "quiz-option-btn";
                btn.textContent = question.options[idx];
                btn.onclick = function () {
                    if (answered) return;
                    answered = true;
                    handleAnswer(idx === question.answer, FSM, block, player, overlay);
                };
                optionsEl.appendChild(btn);
            })(i);
        }

        timerText.textContent = timeLeft;
        quizState.timerInterval = setInterval(function () {
            timeLeft--;
            timerText.textContent = timeLeft;
            timerFill.style.width = (timeLeft / 10 * 100) + "%";
            if (timeLeft <= 3) {
                timerFill.className = "quiz-timer-danger";
            }
            if (timeLeft <= 0) {
                clearInterval(quizState.timerInterval);
                if (!answered) {
                    answered = true;
                    handleAnswer(false, FSM, block, player, overlay);
                }
            }
        }, 1000);
    }

    // ===================== HANDLE ANSWER =====================
    function handleAnswer(correct, FSM, block, player, overlay) {
        clearInterval(quizState.timerInterval);
        var resultEl = document.getElementById("quiz-result");

        if (correct) {
            resultEl.textContent = "Correct!";
            resultEl.className = "quiz-correct";
            quizState.questionsAnswered++;
            document.getElementById("quiz-score-info").textContent =
                "Questions answered: " + quizState.questionsAnswered + " / " + quizState.questionsRequired;

            // Normal block behavior after correct answer
            block.used = true;
            block.hidden = false;
            block.up = player;
            FSM.animateSolidBump(block);
            FSM.removeClass(block, "hidden");
            FSM.switchClass(block, "unused", "used");
            FSM.TimeHandler.addEvent(FSM.animateSolidContents, 7, block, player);

            setTimeout(function () {
                overlay.style.display = "none";
                quizState.activeQuiz = false;
                if (FSM.GamesRunner.getPaused()) {
                    FSM.GamesRunner.play();
                }
            }, 1200);
        } else {
            resultEl.textContent = "Wrong! Restarting level...";
            resultEl.className = "quiz-wrong";
            setTimeout(function () {
                overlay.style.display = "none";
                quizState.activeQuiz = false;
                quizState.questionsAnswered = 0;
                var mapName = FSM.AreaSpawner.getMapName();
                FSM.setMap(mapName);
            }, 1500);
        }
    }

    // ===================== BLOCKED MESSAGE =====================
    function showBlockedMessage(FSM) {
        createOverlayUI();
        var overlay = document.getElementById("quiz-overlay");
        var questionEl = document.getElementById("quiz-question");
        var optionsEl = document.getElementById("quiz-options");
        var resultEl = document.getElementById("quiz-result");
        var timerText = document.getElementById("quiz-timer-text");
        var timerFill = document.getElementById("quiz-timer-fill");
        var scoreInfo = document.getElementById("quiz-score-info");

        overlay.style.display = "flex";
        questionEl.textContent = "You need to answer all quiz questions to clear this level!";
        optionsEl.innerHTML = "";
        resultEl.textContent = "";
        resultEl.className = "";
        timerText.textContent = "";
        timerFill.style.width = "0%";
        scoreInfo.textContent = "Questions answered: " + quizState.questionsAnswered + " / " + quizState.questionsRequired;

        setTimeout(function () {
            overlay.style.display = "none";
        }, 2000);
    }

    // ===================== HOOK: Block.bottomBump via constructor prototype =====================
    // In objects.js, Block.bottomBump is set on the Block CONSTRUCTOR'S PROTOTYPE
    // (via ObjectMakr.processFunctions). When blocks are created via ObjectMaker.make(),
    // bottomBump is NOT copied as an own property — it stays inherited from the prototype.
    // So modifying BlockConstructor.prototype.bottomBump affects ALL existing and future
    // Block instances via JavaScript prototype chain lookup.
    function hookBlockCollision(FSM) {
        var blockConstructor = FSM.ObjectMaker.getFunction("Block");
        var origBottomBump = blockConstructor.prototype.bottomBump;

        blockConstructor.prototype.bottomBump = function (block, player) {
            if (block.isQuizBlock && !block.used && player.player && !block.up) {
                showQuiz(FSM, block, player);
                return;
            }
            // Fall through to original for non-quiz blocks or already-used blocks
            return origBottomBump(block, player);
        };
    }

    // ===================== HOOK: Flagpole gate via ScenePlayer (INSTANCE-LEVEL) =====================
    // collideFlagpole calls e.FSM.ScenePlayer.startCutscene("Flagpole", ...)
    // ScenePlayer is an instance object, so hooking startCutscene on it works directly.
    // We block the "Flagpole" cutscene if quiz is incomplete.
    function hookFlagpole(FSM) {
        var scenePlayer = FSM.ScenePlayer;
        var origStartCutscene = scenePlayer.startCutscene.bind(scenePlayer);
        var blockedCooldown = false;

        scenePlayer.startCutscene = function (name) {
            if (name === "Flagpole" && quizState.questionsAnswered < quizState.questionsRequired) {
                if (!blockedCooldown) {
                    blockedCooldown = true;
                    showBlockedMessage(FSM);
                    setTimeout(function () { blockedCooldown = false; }, 2500);
                }
                return;
            }
            return origStartCutscene.apply(this, arguments);
        };
    }

    // ===================== HOOK: collideLevelTransport (PROTOTYPE-LEVEL, backup) =====================
    // Scene code calls FSM.collideLevelTransport() which goes through the prototype chain.
    // This is a safety net for any transport that bypasses the flagpole hook.
    function hookLevelTransport(FSM) {
        var origTransport = FSM.__proto__.collideLevelTransport;
        FSM.__proto__.collideLevelTransport = function (player, detector) {
            var transport = detector.transport;
            if (player.player && transport && typeof transport === "object" && transport.map) {
                if (quizState.questionsAnswered < quizState.questionsRequired) {
                    showBlockedMessage(FSM);
                    return;
                }
            }
            origTransport.call(this, player, detector);
        };
    }

    // ===================== HOOK: Reset quiz on map change (PROTOTYPE-LEVEL) =====================
    // setMap is called via FSM.setMap() which goes through the prototype chain.
    function hookMapChange(FSM) {
        var origSetMap = FSM.__proto__.setMap;
        FSM.__proto__.setMap = function () {
            quizState.questionsAnswered = 0;
            quizState.activeQuiz = false;
            clearInterval(quizState.timerInterval);
            var overlay = document.getElementById("quiz-overlay");
            if (overlay) overlay.style.display = "none";
            return origSetMap.apply(this, arguments);
        };
    }

    // ===================== INITIALIZATION =====================
    var pollInterval = setInterval(function () {
        if (typeof FSM !== "undefined" && FSM && FSM.GamesRunner && FSM.ObjectMaker) {
            clearInterval(pollInterval);
            initQuizSystem(FSM);
        }
    }, 300);

    function initQuizSystem(gameFSM) {
        hookBlockCollision(gameFSM);
        hookFlagpole(gameFSM);
        hookLevelTransport(gameFSM);
        hookMapChange(gameFSM);
        console.log("Quiz system initialized! Hooked ObjectMaker.make + ScenePlayer + LevelTransport + MapChange");
    }

})();
