/**
 * Progress Bar for PlayMario
 * Tracks level completion and updates a visual progress bar.
 * Levels: 1-1 -> 1-2 -> 1-3 (3 total levels)
 */
(function () {
    "use strict";

    var LEVELS = ["1-1", "1-2", "1-3"];
    var TOTAL_LEVELS = LEVELS.length;
    var completedLevels = {};
    var currentLevel = "1-1";

    // DOM references
    var progressBarInner = document.getElementById("progress-bar-inner");
    var progressLevelText = document.getElementById("progress-level-text");
    var stars = document.querySelectorAll("#progress-bar-stars .star");

    /**
     * Update the progress bar UI based on completed levels.
     */
    function updateProgressBar() {
        var completedCount = 0;
        for (var i = 0; i < LEVELS.length; i++) {
            if (completedLevels[LEVELS[i]]) {
                completedCount++;
            }
        }

        // Calculate percentage
        var percent = Math.round((completedCount / TOTAL_LEVELS) * 100);
        progressBarInner.style.width = percent + "%";

        // Update level text
        progressLevelText.textContent = "Level: " + currentLevel;

        // Update stars
        for (var j = 0; j < stars.length; j++) {
            var levelKey = stars[j].getAttribute("data-level");
            if (completedLevels[levelKey]) {
                stars[j].classList.add("completed");
            } else {
                stars[j].classList.remove("completed");
            }
        }
    }

    /**
     * Mark a level as completed and update the progress bar.
     */
    function markLevelCompleted(levelName) {
        if (LEVELS.indexOf(levelName) !== -1) {
            completedLevels[levelName] = true;
            updateProgressBar();
        }
    }

    /**
     * Set the current level display.
     */
    function setCurrentLevel(levelName) {
        currentLevel = levelName;
        updateProgressBar();
    }

    /**
     * Reset progress (called on game over / game restart).
     */
    function resetProgress() {
        completedLevels = {};
        currentLevel = "1-1";
        updateProgressBar();
    }

    // Hook into PlayMarioJas.setMap to track level transitions.
    // When setMap is called with a new map, the previous map is considered completed.
    function hookIntoGame() {
        var proto = PlayMarioJas.PlayMarioJas.prototype;
        var originalSetMap = proto.setMap;

        // Hook into collideFlagpole / level-end to mark completion
        var originalFlagCollide = proto.FlagCollisionTop || proto.collideFlagpole;
        
        // Track whether the level was actually cleared (flagpole/pipe exit)
        var levelCleared = false;

        // Hook into animatePlayerOffPole (called when player slides down flagpole = level clear)
        var originalScorePlayerFlag = proto.scorePlayerFlag;
        if (originalScorePlayerFlag) {
            proto.scorePlayerFlag = function () {
                var clearedLevel;
                try {
                    clearedLevel = this.AreaSpawner.getMapName();
                } catch (e) {
                    clearedLevel = null;
                }
                if (clearedLevel && LEVELS.indexOf(clearedLevel) !== -1) {
                    levelCleared = true;
                    markLevelCompleted(clearedLevel);
                }
                return originalScorePlayerFlag.apply(this, arguments);
            };
        }

        proto.setMap = function (mapName, location) {
            // Call original setMap
            var result = originalSetMap.apply(this, arguments);

            // Determine the new map name
            var newMap = mapName;
            if (typeof mapName === "undefined" || mapName === null || mapName.constructor === PlayMarioJas.PlayMarioJas) {
                try {
                    newMap = this.AreaSpawner.getMapName();
                } catch (e) {
                    newMap = "1-1";
                }
            }

            // Reset the cleared flag for the new level
            levelCleared = false;

            // Update current level display
            setCurrentLevel(newMap);

            return result;
        };

        // Hook into gameOver to reset progress
        var originalGameOver = proto.gameOver;
        proto.gameOver = function () {
            resetProgress();
            return originalGameOver.apply(this, arguments);
        };

        // Also reset on gameStart
        var originalGameStart = proto.gameStart;
        proto.gameStart = function () {
            resetProgress();
            return originalGameStart.apply(this, arguments);
        };
    }

    // Wait for game to be ready, then hook in
    var checkInterval = setInterval(function () {
        if (typeof PlayMarioJas !== "undefined" &&
            PlayMarioJas.PlayMarioJas &&
            PlayMarioJas.PlayMarioJas.prototype.setMap) {
            clearInterval(checkInterval);
            hookIntoGame();
            updateProgressBar();
        }
    }, 100);

})();
