var AreaSpawnr;
(function(q){var r=function(){function b(a){if(!a)throw Error("No settings given to AreaSpawnr.");if(!a.MapsCreator)throw Error("No MapsCreator provided to AreaSpawnr.");this.MapsCreator=a.MapsCreator;if(!a.MapScreener)throw Error("No MapScreener provided to AreaSpawnr.");this.MapScreener=a.MapScreener;this.onSpawn=a.onSpawn;this.onUnspawn=a.onUnspawn;this.screenAttributes=a.screenAttributes||[];this.stretchAdd=a.stretchAdd;this.afterAdd=a.afterAdd;this.commandScope=a.commandScope}b.prototype.getMapsCreator=
function(){return this.MapsCreator};b.prototype.getMapScreener=function(){return this.MapScreener};b.prototype.getScreenAttributes=function(){return this.screenAttributes};b.prototype.getMapName=function(){return this.mapName};b.prototype.getMap=function(a){return"undefined"!==typeof a?this.MapsCreator.getMap(a):this.mapCurrent};b.prototype.getMaps=function(){return this.MapsCreator.getMaps()};b.prototype.getArea=function(){return this.areaCurrent};b.prototype.getAreaName=function(){return this.areaCurrent.name};
b.prototype.getLocation=function(a){return this.areaCurrent.map.locations[a]};b.prototype.getLocationEntered=function(){return this.locationEntered};b.prototype.getPreThings=function(){return this.prethings};b.prototype.setMap=function(a,c){this.mapCurrent=this.getMap(a);if(!this.mapCurrent)throw Error("Unknown Map in setMap: '"+a+"'.");this.mapName=a;1<arguments.length&&this.setLocation(c);return this.mapCurrent};b.prototype.setLocation=function(a){var c,b;c=this.mapCurrent.locations[a];if(!c)throw Error("Unknown location in setLocation: '"+
a+"'.");this.locationEntered=c;this.areaCurrent=c.area;this.areaCurrent.boundaries={top:0,right:0,bottom:0,left:0};for(b=0;b<this.screenAttributes.length;b+=1)a=this.screenAttributes[b],this.MapScreener[a]=this.areaCurrent[a];this.prethings=this.MapsCreator.getPreThings(c.area);this.areaCurrent.stretches&&this.setStretches(this.areaCurrent.stretches);this.areaCurrent.afters&&this.setAfters(this.areaCurrent.afters)};b.prototype.setStretches=function(a){var c;this.stretches=a;for(c=0;c<a.length;c+=
1)this.stretchAdd.call(this.commandScope||this,a[c],c,a)};b.prototype.setAfters=function(a){var c;this.afters=a;for(c=0;c<a.length;c+=1)this.afterAdd.call(this.commandScope||this,a[c],c,a)};b.prototype.spawnArea=function(a,c,b,d,e){this.onSpawn&&this.applySpawnAction(this.onSpawn,!0,a,c,b,d,e)};b.prototype.unspawnArea=function(a,b,f,d,e){this.onUnspawn&&this.applySpawnAction(this.onUnspawn,!1,a,b,f,d,e)};b.prototype.applySpawnAction=function(a,b,f,d,e,g,h){var p,k,l,m,n;for(p in this.prethings)if(this.prethings.hasOwnProperty(p)&&
(k=this.prethings[p][f],0!==k.length))for(m=k.length/2|0,l=this.findPreThingsSpawnStart(f,k,m,d,e,g,h),m=this.findPreThingsSpawnEnd(f,k,m,d,e,g,h),n=l;n<=m;n+=1)l=k[n],l.spawned!==b&&(l.spawned=b,a(l))};b.prototype.findPreThingsSpawnStart=function(a,c,f,d,e,g,h){a=b.directionKeys[a];d=this.getDirectionEnd(a,d,e,g,h);for(e=0;e<c.length&&!(c[e][a]>=d);e+=1);return e};b.prototype.findPreThingsSpawnEnd=function(a,c,f,d,e,g,h){f=b.directionKeys[a];a=this.getDirectionEnd(b.directionKeys[b.directionOpposites[a]],
d,e,g,h);for(d=c.length-1;0<=d&&!(c[d][f]<=a);--d);return d};b.prototype.getDirectionEnd=function(a,b,f,d,e){switch(a){case "top":return b;case "right":return f;case "bottom":return d;case "left":return e;default:throw Error("Unknown directionKey: "+a);}};b.directionKeys={xInc:"left",xDec:"right",yInc:"top",yDec:"bottom"};b.directionOpposites={xInc:"xDec",xDec:"xInc",yInc:"yDec",yDec:"yInc"};return b}();q.AreaSpawnr=r})(AreaSpawnr||(AreaSpawnr={}));
var AudioPlayr;
(function (AudioPlayr_1) {
    "use strict";
    /**
     * An audio library to automate preloading and controlled playback of multiple
     * audio tracks, with support for different browsers' preferred file types.
     */
    var AudioPlayr = (function () {
        /**
         * Initializes a new instance of the AudioPlayr class.
         *
         * @param settings   Settings to use for initialization.
         */
        function AudioPlayr(settings) {
            if (typeof settings.library === "undefined") {
                throw new Error("No library given to AudioPlayr.");
            }
            if (typeof settings.directory === "undefined") {
                throw new Error("No directory given to AudioPlayr.");
            }
            if (typeof settings.fileTypes === "undefined") {
                throw new Error("No fileTypes given to AudioPlayr.");
            }
            if (!settings.ItemsHolder) {
                throw new Error("No ItemsHoldr given to AudioPlayr.");
            }
            var volumeInitial;
            this.ItemsHolder = settings.ItemsHolder;
            this.directory = settings.directory;
            this.fileTypes = settings.fileTypes;
            this.getThemeDefault = settings.getThemeDefault || "Theme";
            this.getVolumeLocal = typeof settings.getVolumeLocal === "undefined"
                ? 1 : settings.getVolumeLocal;
            // Sounds should always start blank
            this.sounds = {};
            // Preload everything!
            this.generateLibraryFromSettings(settings.library);
            volumeInitial = this.ItemsHolder.getItem("volume");
            if (volumeInitial === undefined) {
                this.setVolume(1);
            }
            else {
                this.setVolume(volumeInitial);
            }
            this.setMuted(this.ItemsHolder.getItem("muted") || false);
        }
        /* Simple getters
        */
        /**
         * @returns The listing of <audio> Elements, keyed by name.
         */
        AudioPlayr.prototype.getLibrary = function () {
            return this.library;
        };
        /**
         * @returns The allowed filetypes for audio files.
         */
        AudioPlayr.prototype.getFileTypes = function () {
            return this.fileTypes;
        };
        /**
         * @returns The currently playing <audio> Elements, keyed by name.
         */
        AudioPlayr.prototype.getSounds = function () {
            return this.sounds;
        };
        /**
         * @returns The current playing theme's <audio> Element.
         */
        AudioPlayr.prototype.getTheme = function () {
            return this.theme;
        };
        /**
         * @returns The name of the currently playing theme.
         */
        AudioPlayr.prototype.getThemeName = function () {
            return this.themeName;
        };
        /**
         * @returns The directory under which all filetype directories are to be located.
         */
        AudioPlayr.prototype.getDirectory = function () {
            return this.directory;
        };
        /* Playback modifiers
        */
        /**
         * @returns The current volume as a Number in [0,1], retrieved by the ItemsHoldr.
         */
        AudioPlayr.prototype.getVolume = function () {
            return Number(this.ItemsHolder.getItem("volume") || 0);
        };
        /**
         * Sets the current volume. If not muted, all sounds will have their volume
         * updated.
         *
         * @param volume   A Number in [0,1] to set as the current volume.
         */
        AudioPlayr.prototype.setVolume = function (volume) {
            var i;
            if (!this.getMuted()) {
                for (i in this.sounds) {
                    if (this.sounds.hasOwnProperty(i)) {
                        this.sounds[i].volume = Number(this.sounds[i].getAttribute("volumeReal")) * volume;
                    }
                }
            }
            this.ItemsHolder.setItem("volume", volume.toString());
        };
        /**
         * @returns Whether this is currently muted.
         */
        AudioPlayr.prototype.getMuted = function () {
            return Boolean(Number(this.ItemsHolder.getItem("muted")));
        };
        /**
         * Calls either setMutedOn or setMutedOff as is appropriate.
         *
         * @param muted   The new status for muted.
         */
        AudioPlayr.prototype.setMuted = function (muted) {
            this.getMuted() ? this.setMutedOn() : this.setMutedOff();
        };
        /**
         * Calls either setMutedOn or setMutedOff to toggle whether this is muted.
         */
        AudioPlayr.prototype.toggleMuted = function () {
            this.setMuted(!this.getMuted());
        };
        /**
         * Sets volume to 0 in all currently playing sounds and stores the muted
         * status as on in the internal ItemsHoldr.
         */
        AudioPlayr.prototype.setMutedOn = function () {
            var i;
            for (i in this.sounds) {
                if (this.sounds.hasOwnProperty(i)) {
                    this.sounds[i].volume = 0;
                }
            }
            this.ItemsHolder.setItem("muted", "1");
        };
        /**
         * Sets sound volumes to their actual volumes and stores the muted status
         * as off in the internal ItemsHoldr.
         */
        AudioPlayr.prototype.setMutedOff = function () {
            var volume = this.getVolume(), sound, i;
            for (i in this.sounds) {
                if (this.sounds.hasOwnProperty(i)) {
                    sound = this.sounds[i];
                    sound.volume = Number(sound.getAttribute("volumeReal")) * volume;
                }
            }
            this.ItemsHolder.setItem("muted", "0");
        };
        /* Other modifiers
        */
        /**
         * @returns The Function or Number used as the volume setter for local sounds.
         */
        AudioPlayr.prototype.getGetVolumeLocal = function () {
            return this.getVolumeLocal;
        };
        /**
         * @param getVolumeLocal   A new Function or Number to use as the volume setter
         *                         for local sounds.
         */
        AudioPlayr.prototype.setGetVolumeLocal = function (getVolumeLocalNew) {
            this.getVolumeLocal = getVolumeLocalNew;
        };
        /**
         * @returns The Function or String used to get the default theme for playTheme.
         */
        AudioPlayr.prototype.getGetThemeDefault = function () {
            return this.getThemeDefault;
        };
        /**
         * @param getThemeDefaultNew A new Function or String to use as the source for
         *                           theme names in default playTheme calls.
         */
        AudioPlayr.prototype.setGetThemeDefault = function (getThemeDefaultNew) {
            this.getThemeDefault = getThemeDefaultNew;
        };
        /* Playback
        */
        /**
         * Plays the sound of the given name.
         *
         * @param name   The name of the sound to play.
         * @returns The sound's <audio> element, now playing.
         * @remarks Internally, this stops any previously playing sound of that name
         *          and starts a new one, with volume set to the current volume and
         *          muted status. If the name wasn't previously being played (and
         *          therefore a new Element has been created), an event listener is
         *          added to delete it from sounds after.
         */
        AudioPlayr.prototype.play = function (name) {
            var sound, used;
            // If the sound isn't yet being played, see if it's in the library
            if (!this.sounds.hasOwnProperty(name)) {
                // If the sound also isn't in the library, it's unknown
                if (!this.library.hasOwnProperty(name)) {
                    throw new Error("Unknown name given to AudioPlayr.play: '" + name + "'.");
                }
                sound = this.sounds[name] = this.library[name];
            }
            else {
                sound = this.sounds[name];
            }
            this.soundStop(sound);
            if (this.getMuted()) {
                sound.volume = 0;
            }
            else {
                sound.setAttribute("volumeReal", "1");
                sound.volume = this.getVolume();
            }
            this.playSound(sound);
            used = Number(sound.getAttribute("used"));
            // If this is the song's first play, let it know how to stop
            if (!used) {
                sound.setAttribute("used", String(used + 1));
                sound.addEventListener("ended", this.soundFinish.bind(this, name));
            }
            sound.setAttribute("name", name);
            return sound;
        };
        /**
         * Pauses all currently playing sounds.
         */
        AudioPlayr.prototype.pauseAll = function () {
            var i;
            for (i in this.sounds) {
                if (this.sounds.hasOwnProperty(i)) {
                    this.pauseSound(this.sounds[i]);
                }
            }
        };
        /**
         * Un-pauses (resumes) all currently paused sounds.
         */
        AudioPlayr.prototype.resumeAll = function () {
            var i;
            for (i in this.sounds) {
                if (!this.sounds.hasOwnProperty(i)) {
                    continue;
                }
                this.playSound(this.sounds[i]);
            }
        };
        /**
         * Pauses the currently playing theme, if there is one.
         */
        AudioPlayr.prototype.pauseTheme = function () {
            if (this.theme) {
                this.pauseSound(this.theme);
            }
        };
        /**
         * Resumes the theme, if there is one and it's paused.
         */
        AudioPlayr.prototype.resumeTheme = function () {
            if (this.theme) {
                this.playSound(this.theme);
            }
        };
        /**
         * Stops all sounds and any theme, and removes all references to them.
         */
        AudioPlayr.prototype.clearAll = function () {
            this.pauseAll();
            this.clearTheme();
            this.sounds = {};
        };
        /**
         * Pauses and removes the theme, if there is one.
         */
        AudioPlayr.prototype.clearTheme = function () {
            if (!this.theme) {
                return;
            }
            this.pauseTheme();
            delete this.sounds[this.theme.getAttribute("name")];
            this.theme = undefined;
            this.themeName = undefined;
        };
        /**
         * "Local" version of play that changes the output sound's volume depending
         * on the result of a getVolumeLocal call.
         *
         * @param name   The name of the sound to play.
         * @param location   An argument for getVolumeLocal, if that's a Function.
         * @returns The sound's <audio> element, now playing.
         */
        AudioPlayr.prototype.playLocal = function (name, location) {
            var sound = this.play(name), volumeReal;
            switch (this.getVolumeLocal.constructor) {
                case Function:
                    volumeReal = this.getVolumeLocal(location);
                    break;
                case Number:
                    volumeReal = this.getVolumeLocal;
                    break;
                default:
                    volumeReal = Number(this.getVolumeLocal) || 1;
                    break;
            }
            sound.setAttribute("volumeReal", String(volumeReal));
            if (this.getMuted()) {
                sound.volume = 0;
            }
            else {
                sound.volume = volumeReal * this.getVolume();
            }
            return sound;
        };
        /**
         * Pauses any previously playing theme and starts playback of a new theme.
         *
         * @param name   The name of the sound to be used as the theme. If not
         *               provided, getThemeDefault is used to
         *                          provide one.
         * @param loop   Whether the theme should always loop (by default, true).
         * @returns The theme's <audio> element, now playing.
         * @remarks This is different from normal sounds in that it normally loops
         *          and is controlled by pauseTheme and co. If loop is on and the
         *          sound wasn't already playing, an event listener is added for
         *          when it ends.
         */
        AudioPlayr.prototype.playTheme = function (name, loop) {
            this.pauseTheme();
            // Loop defaults to true
            loop = typeof loop !== "undefined" ? loop : true;
            // If name isn't given, use the default getter
            if (typeof name === "undefined") {
                switch (this.getThemeDefault.constructor) {
                    case Function:
                        name = this.getThemeDefault();
                        break;
                    default:
                        name = this.getThemeDefault;
                        break;
                }
            }
            // If a theme already exists, kill it
            if (typeof this.theme !== "undefined" && this.theme.hasAttribute("name")) {
                delete this.sounds[this.theme.getAttribute("name")];
            }
            this.themeName = name;
            this.theme = this.sounds[name] = this.play(name);
            this.theme.loop = loop;
            // If it's used (no repeat), add the event listener to resume theme
            if (this.theme.getAttribute("used") === "1") {
                this.theme.addEventListener("ended", this.playTheme.bind(this));
            }
            return this.theme;
        };
        /**
         * Wrapper around playTheme that plays a sound, then a theme. This is
         * implemented using an event listener on the sound's ending.
         *
         * @param prefix    The name of a sound to play before the theme.
         * @param name   The name of the sound to be used as the theme. If not
         *               provided, getThemeDefault is used to
         *                          provide one.
         * @param loop   Whether the theme should always loop (by default, false).
         * @returns The sound's <audio> element, now playing.
         */
        AudioPlayr.prototype.playThemePrefixed = function (prefix, name, loop) {
            var sound = this.play(prefix);
            this.pauseTheme();
            // If name isn't given, use the default getter
            if (typeof name === "undefined") {
                switch (this.getThemeDefault.constructor) {
                    case Function:
                        name = this.getThemeDefault();
                        break;
                    default:
                        name = this.getThemeDefault;
                        break;
                }
            }
            this.addEventListener(prefix, "ended", this.playTheme.bind(this, prefix + name, loop));
            return sound;
        };
        /* Public utilities
        */
        /**
         * Adds an event listener to a currently playing sound. The sound will keep
         * track of event listeners via an .addedEvents attribute, so they can be
         * cancelled later.
         *
         * @param name   The name of the sound.
         * @param event   The name of the event, such as "ended".
         * @param callback   The Function to be called by the event.
         */
        AudioPlayr.prototype.addEventListener = function (name, event, callback) {
            var sound = this.library[name];
            if (!sound) {
                throw new Error("Unknown name given to addEventListener: '" + name + "'.");
            }
            if (!sound.addedEvents) {
                sound.addedEvents = {};
            }
            if (!sound.addedEvents[event]) {
                sound.addedEvents[event] = [callback];
            }
            else {
                sound.addedEvents[event].push(callback);
            }
            sound.addEventListener(event, callback);
        };
        /**
         * Clears all events added by this.addEventListener to a sound under a given
         * event.
         *
         * @param name   The name of the sound.
         * @param event   The name of the event, such as "ended".
         */
        AudioPlayr.prototype.removeEventListeners = function (name, event) {
            var sound = this.library[name], events, i;
            if (!sound) {
                throw new Error("Unknown name given to removeEventListeners: '" + name + "'.");
            }
            if (!sound.addedEvents) {
                return;
            }
            events = sound.addedEvents[event];
            if (!events) {
                return;
            }
            for (i = 0; i < events.length; i += 1) {
                sound.removeEventListener(event, events[i]);
            }
            events.length = 0;
        };
        /**
         * Adds an event listener to a sound. If the sound doesn't exist or has
         * finished playing, it's called immediately.
         *
         * @param name   The name of the sound.
         * @param event   The name of the event, such as "onended".
         * @param callback   The Function to be called by the event.
         */
        AudioPlayr.prototype.addEventImmediate = function (name, event, callback) {
            if (!this.sounds.hasOwnProperty(name) || this.sounds[name].paused) {
                callback();
                return;
            }
            this.sounds[name].addEventListener(event, callback);
        };
        /* Private utilities
        */
        /**
         * Called when a sound has completed to get it out of sounds.
         *
         * @param name   The name of the sound that just finished.
         */
        AudioPlayr.prototype.soundFinish = function (name) {
            if (this.sounds.hasOwnProperty(name)) {
                delete this.sounds[name];
            }
        };
        /**
         * Carefully stops a sound. HTMLAudioElement don't natively have a .stop()
         * function, so this is the shim to do that.
         */
        AudioPlayr.prototype.soundStop = function (sound) {
            this.pauseSound(sound);
            if (sound.readyState) {
                sound.currentTime = 0;
            }
        };
        /* Private loading / resetting
        */
        /**
         * Loads every sound defined in the library via AJAX. Sounds are loaded
         * into <audio> elements via createAudio and stored in the library.
         */
        AudioPlayr.prototype.generateLibraryFromSettings = function (librarySettings) {
            var directory = {}, directorySoundNames, directoryName, name, j;
            this.library = {};
            this.directories = {};
            // For each given directory (e.g. names, themes):
            for (directoryName in librarySettings) {
                if (!librarySettings.hasOwnProperty(directoryName)) {
                    continue;
                }
                directory = {};
                directorySoundNames = librarySettings[directoryName];
                // For each audio file to be loaded in that directory:
                for (j = 0; j < directorySoundNames.length; j += 1) {
                    name = directorySoundNames[j];
                    // Create the sound and store it in the container
                    this.library[name] = directory[name] = this.createAudio(name, directoryName);
                }
                // The full directory is stored in the master directories
                this.directories[directoryName] = directory;
            }
        };
        /**
         * Creates an audio element, gives it sources, and starts preloading.
         *
         * @param name   The name of the sound to play.
         * @param sectionName   The name of the directory containing the sound.
         * @returns An <audio> element ocntaining the sound, currently playing.
         */
        AudioPlayr.prototype.createAudio = function (name, directory) {
            var sound = document.createElement("audio"), sourceType, child, i;
            // Create an audio source for each child
            for (i = 0; i < this.fileTypes.length; i += 1) {
                sourceType = this.fileTypes[i];
                child = document.createElement("source");
                child.type = "audio/" + sourceType;
                child.src = this.directory + "/" + directory + "/" + sourceType + "/" + name + "." + sourceType;
                sound.appendChild(child);
            }
            // This preloads the sound.
            sound.volume = 0;
            sound.setAttribute("volumeReal", "1");
            sound.setAttribute("used", "0");
            this.playSound(sound);
            return sound;
        };
        /**
         * Utility to try to play a sound, which may not be possible in headless
         * environments like PhantomJS.
         *
         * @param sound   An <audio> element to play.
         * @returns Whether the sound was able to play.
         */
        AudioPlayr.prototype.playSound = function (sound) {
            if (sound && sound.play) {
                sound.play();
                return true;
            }
            return false;
        };
        /**
         * Utility to try to pause a sound, which may not be possible in headless
         * environments like PhantomJS.
         *
         * @param sound   An <audio> element to pause.
         * @returns Whether the sound was able to pause.
         */
        AudioPlayr.prototype.pauseSound = function (sound) {
            if (sound && sound.pause) {
                sound.pause();
                return true;
            }
            return false;
        };
        return AudioPlayr;
    })();
    AudioPlayr_1.AudioPlayr = AudioPlayr;
})(AudioPlayr || (AudioPlayr = {}));
var ChangeLinr;
(function(e){var f=function(){function b(a){if("undefined"===typeof a)throw Error("No settings object given to ChangeLinr.");if("undefined"===typeof a.pipeline)throw Error("No pipeline given to ChangeLinr.");if("undefined"===typeof a.transforms)throw Error("No transforms given to ChangeLinr.");this.pipeline=a.pipeline||[];this.transforms=a.transforms||{};this.doMakeCache="undefined"===typeof a.doMakeCache?!0:a.doMakeCache;this.doUseCache="undefined"===typeof a.doUseCache?!0:a.doUseCache;this.cache=
{};this.cacheFull={};for(a=0;a<this.pipeline.length;a+=1){if(!this.pipeline[a])throw Error("Pipe["+a+"] is invalid.");if(!this.transforms.hasOwnProperty(this.pipeline[a]))throw Error("Pipe["+a+"] ('"+this.pipeline[a]+"') not found in transforms.");if(!(this.transforms[this.pipeline[a]]instanceof Function))throw Error("Pipe["+a+"] ('"+this.pipeline[a]+"') is not a valid Function from transforms.");this.cacheFull[a]=this.cacheFull[this.pipeline[a]]={}}}b.prototype.getCache=function(){return this.cache};
b.prototype.getCached=function(a){return this.cache[a]};b.prototype.getCacheFull=function(){return this.cacheFull};b.prototype.getDoMakeCache=function(){return this.doMakeCache};b.prototype.getDoUseCache=function(){return this.doUseCache};b.prototype.process=function(a,d,b){var c;"undefined"===typeof d&&(this.doMakeCache||this.doUseCache)&&(d=a);if(this.doUseCache&&this.cache.hasOwnProperty(d))return this.cache[d];for(c=0;c<this.pipeline.length;c+=1)a=this.transforms[this.pipeline[c]](a,d,b,this),
this.doMakeCache&&(this.cacheFull[this.pipeline[c]][d]=a);this.doMakeCache&&(this.cache[d]=a);return a};b.prototype.processFull=function(a,b,e){var c={};this.process(a,b,e);for(a=0;a<this.pipeline.length;a+=1)c[a]=c[this.pipeline[a]]=this.cacheFull[this.pipeline[a]][b];return c};return b}();e.ChangeLinr=f})(ChangeLinr||(ChangeLinr={}));
var DeviceLayr;
(function(f){(function(d){d[d.negative=0]="negative";d[d.neutral=1]="neutral";d[d.positive=2]="positive"})(f.AxisStatus||(f.AxisStatus={}));var g=f.AxisStatus,k=function(){function d(a){if("undefined"===typeof a)throw Error("No settings object given to DeviceLayr.");if("undefined"===typeof a.InputWriter)throw Error("No InputWriter given to DeviceLayr.");this.InputWritr=a.InputWriter;this.triggers=a.triggers||{};this.aliases=a.aliases||{on:"on",off:"off"};this.gamepads=[]}d.prototype.getInputWritr=function(){return this.InputWritr};
d.prototype.getTriggers=function(){return this.triggers};d.prototype.getAliases=function(){return this.aliases};d.prototype.getGamepads=function(){return this.gamepads};d.prototype.checkNavigatorGamepads=function(){if("undefined"===typeof navigator.getGamepads||!navigator.getGamepads()[this.gamepads.length])return 0;this.registerGamepad(navigator.getGamepads()[this.gamepads.length]);return this.checkNavigatorGamepads()+1};d.prototype.registerGamepad=function(a){this.gamepads.push(a);this.setDefaultTriggerStatuses(a,
this.triggers)};d.prototype.activateAllGamepadTriggers=function(){for(var a=0;a<this.gamepads.length;a+=1)this.activateGamepadTriggers(this.gamepads[a])};d.prototype.activateGamepadTriggers=function(a){var c=d.controllerMappings[a.mapping||"standard"],b;for(b=Math.min(c.axes.length,a.axes.length)-1;0<=b;--b)this.activateAxisTrigger(a,c.axes[b].name,c.axes[b].axis,a.axes[b]);for(b=Math.min(c.buttons.length,a.buttons.length)-1;0<=b;--b)this.activateButtonTrigger(a,c.buttons[b],a.buttons[b].pressed)};
d.prototype.activateAxisTrigger=function(a,c,b,d){if(c=this.triggers[c][b]){a=this.getAxisStatus(a,d);if(c.status===a)return!1;void 0!==c.status&&void 0!==c[g[c.status]]&&this.InputWritr.callEvent(this.aliases.off,c[g[c.status]]);c.status=a;void 0!==c[g[a]]&&this.InputWritr.callEvent(this.aliases.on,c[g[a]]);return!0}};d.prototype.activateButtonTrigger=function(a,c,b){a=this.triggers[c];if(!a||a.status===b)return!1;a.status=b;this.InputWritr.callEvent(b?this.aliases.on:this.aliases.off,a.trigger);
return!0};d.prototype.clearAllGamepadTriggers=function(){for(var a=0;a<this.gamepads.length;a+=1)this.clearGamepadTriggers(this.gamepads[a])};d.prototype.clearGamepadTriggers=function(a){var c=d.controllerMappings[a.mapping||"standard"],b;for(b=0;b<c.axes.length;b+=1)this.clearAxisTrigger(a,c.axes[b].name,c.axes[b].axis);for(b=0;b<c.buttons.length;b+=1)this.clearButtonTrigger(a,c.buttons[b])};d.prototype.clearAxisTrigger=function(a,c,b){this.triggers[c][b].status=g.neutral};d.prototype.clearButtonTrigger=
function(a,c){this.triggers[c].status=!1};d.prototype.setDefaultTriggerStatuses=function(a,c){var b=d.controllerMappings[a.mapping||"standard"],h,e,f;for(e=0;e<b.buttons.length;e+=1)(h=c[b.buttons[e]])&&void 0===h.status&&(h.status=!1);for(e=0;e<b.axes.length;e+=1)for(f in h=c[b.axes[e].name],h)h.hasOwnProperty(f)&&void 0===h[f].status&&(h[f].status=g.neutral)};d.prototype.getAxisStatus=function(a,c){var b=d.controllerMappings[a.mapping||"standard"].joystickThreshold;return c>b?g.positive:c<-b?g.negative:
g.neutral};d.controllerMappings={standard:{axes:[{axis:"x",joystick:0,name:"leftJoystick"},{axis:"y",joystick:0,name:"leftJoystick"},{axis:"x",joystick:1,name:"rightJoystick"},{axis:"y",joystick:1,name:"rightJoystick"}],buttons:"a b x y leftTop rightTop leftTrigger rightTrigger select start leftStick rightStick dpadUp dpadDown dpadLeft dpadRight".split(" "),joystickThreshold:.49}};return d}();f.DeviceLayr=k})(DeviceLayr||(DeviceLayr={}));
var EightBittr;
(function(h){var k=function(){function e(a){void 0===a&&(a={});var b=e.prototype.ensureCorrectCaller(this),c=a.constants,d=a.constantsSource||b;b.unitsize=a.unitsize||1;if(b.constants=c)for(a=0;a<c.length;a+=1)b[c[a]]=d[c[a]]}e.prototype.reset=function(a,b,c){var d,f;a.customs=c;for(f=0;f<b.length;f+=1){d=b[f];if(!a[d])throw Error(d+" is missing on a resetting EightBittr.");a[d](a,c)}};e.prototype.resetTimed=function(a,b,c){var d=performance.now(),f,e,g;this.resetTimes={order:b,times:[]};for(g=0;g<
b.length;g+=1)f=performance.now(),a[b[g]](a,c),e=performance.now(),this.resetTimes.times.push({name:b[g],timeStart:f,timeEnd:e,timeTaken:e-f});a=performance.now();this.resetTimes.total={name:"resetTimed",timeStart:d,timeEnd:a,timeTaken:a-d}};e.prototype.createCanvas=function(a,b){var c=document.createElement("canvas"),d=c.getContext("2d");c.width=a;c.height=b;"undefined"!==typeof d.imageSmoothingEnabled?d.imageSmoothingEnabled=!1:"undefined"!==typeof d.webkitImageSmoothingEnabled?d.webkitImageSmoothingEnabled=
!1:"undefined"!==typeof d.mozImageSmoothingEnabled?d.mozImageSmoothingEnabled=!1:"undefined"!==typeof d.msImageSmoothingEnabled?d.msImageSmoothingEnabled=!1:"undefined"!==typeof d.oImageSmoothingEnabled&&(d.oImageSmoothingEnabled=!1);return c};e.prototype.shiftVert=function(a,b){a.top+=b;a.bottom+=b};e.prototype.shiftHoriz=function(a,b){a.left+=b;a.right+=b};e.prototype.setTop=function(a,b){a.top=b;a.bottom=a.top+a.height*a.EightBitter.unitsize};e.prototype.setRight=function(a,b){a.right=b;a.left=
a.right-a.width*a.EightBitter.unitsize};e.prototype.setBottom=function(a,b){a.bottom=b;a.top=a.bottom-a.height*a.EightBitter.unitsize};e.prototype.setLeft=function(a,b){a.left=b;a.right=a.left+a.width*a.EightBitter.unitsize};e.prototype.setMidX=function(a,b){a.EightBitter.setLeft(a,b-a.width*a.EightBitter.unitsize/2)};e.prototype.setMidY=function(a,b){a.EightBitter.setTop(a,b-a.height*a.EightBitter.unitsize/2)};e.prototype.setMid=function(a,b,c){a.EightBitter.setMidX(a,b);a.EightBitter.setMidY(a,
c)};e.prototype.getMidX=function(a){return a.left+a.width*a.EightBitter.unitsize/2};e.prototype.getMidY=function(a){return a.top+a.height*a.EightBitter.unitsize/2};e.prototype.setMidObj=function(a,b){a.EightBitter.setMidXObj(a,b);a.EightBitter.setMidYObj(a,b)};e.prototype.setMidXObj=function(a,b){a.EightBitter.setLeft(a,a.EightBitter.getMidX(b)-a.width*a.EightBitter.unitsize/2)};e.prototype.setMidYObj=function(a,b){a.EightBitter.setTop(a,a.EightBitter.getMidY(b)-a.height*a.EightBitter.unitsize/2)};
e.prototype.objectToLeft=function(a,b){return a.EightBitter.getMidX(a)<a.EightBitter.getMidX(b)};e.prototype.updateTop=function(a,b){a.top+=b||0;a.bottom=a.top+a.height*a.EightBitter.unitsize};e.prototype.updateRight=function(a,b){a.right+=b||0;a.left=a.right-a.width*a.EightBitter.unitsize};e.prototype.updateBottom=function(a,b){a.bottom+=b||0;a.top=a.bottom-a.height*a.EightBitter.unitsize};e.prototype.updateLeft=function(a,b){a.left+=b||0;a.right=a.left+a.width*a.EightBitter.unitsize};e.prototype.slideToX=
function(a,b,c){var d=a.EightBitter.getMidX(a);c=c||Infinity;d<b?a.EightBitter.shiftHoriz(a,Math.min(c,b-d)):a.EightBitter.shiftHoriz(a,Math.max(-c,b-d))};e.prototype.slideToY=function(a,b,c){var d=a.EightBitter.getMidY(a);c=c||Infinity;d<b?a.EightBitter.shiftVert(a,Math.min(c,b-d)):a.EightBitter.shiftVert(a,Math.max(-c,b-d))};e.prototype.ensureCorrectCaller=function(a){if(!(a instanceof e))throw Error("A function requires the caller ('this') to be the manipulated EightBittr object. Unfortunately, 'this' is a "+
typeof this+".");return a};e.prototype.proliferate=function(a,b,c){void 0===c&&(c=!1);var d,f;for(f in b)!b.hasOwnProperty(f)||c&&a.hasOwnProperty(f)||(d=b[f],"object"===typeof d?(a.hasOwnProperty(f)||(a[f]=new d.constructor),this.proliferate(a[f],d,c)):a[f]=d);return a};e.prototype.proliferateHard=function(a,b,c){var d,f;for(f in b)!b.hasOwnProperty(f)||c&&a[f]||(d=b[f],"object"===typeof d?(a[f]||(a[f]=new d.constructor),this.proliferate(a[f],d,c)):a[f]=d);return a};e.prototype.proliferateElement=
function(a,b,c){void 0===c&&(c=!1);var d,f,e;for(f in b)if(b.hasOwnProperty(f)&&(!c||!a.hasOwnProperty(f)))switch(d=b[f],f){case "children":case "children":if("undefined"!==typeof d)for(e=0;e<d.length;e+=1)a.appendChild(d[e]);break;case "style":this.proliferate(a[f],d);break;default:null===d?a[f]=null:"object"===typeof d?(a.hasOwnProperty(f)||(a[f]=new d.constructor),this.proliferate(a[f],d,c)):a[f]=d}return a};e.prototype.createElement=function(a){for(var b=[],c=1;c<arguments.length;c++)b[c-1]=arguments[c];
var c=e.prototype.ensureCorrectCaller(this),d=document.createElement(a||"div"),f;for(f=0;f<b.length;f+=1)c.proliferateElement(d,b[f]);return d};e.prototype.followPathHard=function(a,b,c){for(void 0===c&&(c=0);c<b.length;c+=1){if("undefined"===typeof a[b[c]])return;a=a[b[c]]}return a};e.prototype.arraySwitch=function(a,b,c){b.splice(b.indexOf(a),1);c.push(a)};e.prototype.arrayToBeginning=function(a,b){b.splice(b.indexOf(a),1);b.unshift(a)};e.prototype.arrayToEnd=function(a,b){b.splice(b.indexOf(a),
1);b.push(a)};e.prototype.arrayToIndex=function(a,b,c){b.splice(b.indexOf(a),1);b.splice(c,0,a)};return e}();h.EightBittr=k})(EightBittr||(EightBittr={}));
var FPSAnalyzr;
(function(e){var f=function(){function c(a){void 0===a&&(a={});this.maxKept=a.maxKept||35;this.numRecorded=0;this.ticker=-1;this.measurements=isFinite(this.maxKept)?Array(this.maxKept):{};this.getTimestamp="undefined"===typeof a.getTimestamp?"undefined"===typeof performance?function(){return Date.now()}:(performance.now||performance.webkitNow||performance.mozNow||performance.msNow||performance.oNow).bind(performance):a.getTimestamp}c.prototype.measure=function(a){void 0===a&&(a=this.getTimestamp());this.timeCurrent&&
this.addFPS(1E3/(a-this.timeCurrent));this.timeCurrent=a};c.prototype.addFPS=function(a){this.ticker=(this.ticker+=1)%this.maxKept;this.measurements[this.ticker]=a;this.numRecorded+=1};c.prototype.getMaxKept=function(){return this.maxKept};c.prototype.getNumRecorded=function(){return this.numRecorded};c.prototype.getTimeCurrent=function(){return this.timeCurrent};c.prototype.getTicker=function(){return this.ticker};c.prototype.getMeasurements=function(){var a=Math.min(this.maxKept,this.numRecorded),
b;isFinite(this.maxKept)?b=Array(a):(b={},b.length=a);for(--a;0<=a;--a)b[a]=this.measurements[a];return b};c.prototype.getDifferences=function(){var a=this.getMeasurements(),b;for(b=a.length-1;0<=b;--b)a[b]=1E3/a[b];return a};c.prototype.getAverage=function(){var a=0,b=Math.min(this.maxKept,this.numRecorded),c;for(c=b-1;0<=c;--c)a+=this.measurements[c];return a/b};c.prototype.getMedian=function(){var a=this.getMeasurementsSorted(),b=Math.floor(a.length/2);return 0===a.length%2?a[b]:(a[b-2]+a[b])/
2};c.prototype.getExtremes=function(){var a=this.measurements[0],b=a,c,d;for(d=Math.min(this.maxKept,this.numRecorded)-1;0<=d;--d)c=this.measurements[d],c>b?b=c:c<a&&(a=c);return[a,b]};c.prototype.getRange=function(){var a=this.getExtremes();return a[1]-a[0]};c.prototype.getMeasurementsSorted=function(){var a,b;if(this.measurements.constructor===Array)a=[].slice.call(this.measurements).sort();else{a=[];for(b in this.measurements)this.measurements.hasOwnProperty(b)&&"undefined"!==typeof this.measurements[b]&&
(a[b]=this.measurements[b]);a.sort()}this.numRecorded<this.maxKept&&(a.length=this.numRecorded);return a.sort()};return c}();e.FPSAnalyzr=f})(FPSAnalyzr||(FPSAnalyzr={}));
var GamesRunnr;
(function(c){var d=function(){function b(a){if("undefined"===typeof a)throw Error("No settings object given GamesRunnr.");if("undefined"===typeof a.games)throw Error("No games given to GamesRunnr.");this.games=a.games;this.interval=a.interval||1E3/60;this.speed=a.speed||1;this.onPause=a.onPause;this.onPlay=a.onPlay;this.callbackArguments=a.callbackArguments||[this];this.adjustFramerate=a.adjustFramerate;this.FPSAnalyzer=a.FPSAnalyzer||new FPSAnalyzr.FPSAnalyzr(a.FPSAnalyzerSettings);this.scope=a.scope||
this;this.paused=!0;this.upkeepScheduler=a.upkeepScheduler||function(a,b){return setTimeout(a,b)};this.upkeepCanceller=a.upkeepCanceller||function(a){clearTimeout(a)};this.upkeepBound=this.upkeep.bind(this);for(a=0;a<this.games.length;a+=1)this.games[a]=this.games[a].bind(this.scope);this.setIntervalReal()}b.prototype.getFPSAnalyzer=function(){return this.FPSAnalyzer};b.prototype.getPaused=function(){return this.paused};b.prototype.getGames=function(){return this.games};b.prototype.getInterval=function(){return this.interval};
b.prototype.getSpeed=function(){return this.speed};b.prototype.getOnPause=function(){return this.onPause};b.prototype.getOnPlay=function(){return this.onPlay};b.prototype.getCallbackArguments=function(){return this.callbackArguments};b.prototype.getUpkeepScheduler=function(){return this.upkeepScheduler};b.prototype.getUpkeepCanceller=function(){return this.upkeepCanceller};b.prototype.upkeep=function(){this.paused||(this.upkeepCanceller(this.upkeepNext),this.adjustFramerate?this.upkeepNext=this.upkeepScheduler(this.upkeepBound,
this.intervalReal-(this.upkeepTimed()|0)):(this.upkeepNext=this.upkeepScheduler(this.upkeepBound,this.intervalReal),this.runAllGames()),this.FPSAnalyzer&&this.FPSAnalyzer.measure())};b.prototype.upkeepTimed=function(){if(!this.FPSAnalyzer)throw Error("An internal FPSAnalyzr is required for upkeepTimed.");var a=this.FPSAnalyzer.getTimestamp();this.runAllGames();return this.FPSAnalyzer.getTimestamp()-a};b.prototype.play=function(){this.paused&&(this.paused=!1,this.onPlay&&this.onPlay.apply(this,this.callbackArguments),
this.upkeep())};b.prototype.pause=function(){this.paused||(this.paused=!0,this.onPause&&this.onPause.apply(this,this.callbackArguments),this.upkeepCanceller(this.upkeepNext))};b.prototype.step=function(a){void 0===a&&(a=1);this.play();this.pause();0<a&&this.step(a-1)};b.prototype.togglePause=function(){this.paused?this.play():this.pause()};b.prototype.setInterval=function(a){var b=Number(a);if(isNaN(b))throw Error("Invalid interval given to setInterval: "+a);this.interval=b;this.setIntervalReal()};
b.prototype.setSpeed=function(a){var b=Number(a);if(isNaN(b))throw Error("Invalid speed given to setSpeed: "+a);this.speed=b;this.setIntervalReal()};b.prototype.setIntervalReal=function(){this.intervalReal=1/this.speed*this.interval};b.prototype.runAllGames=function(){for(var a=0;a<this.games.length;a+=1)this.games[a]()};return b}();c.GamesRunnr=d})(GamesRunnr||(GamesRunnr={}));
var __extends=this&&this.__extends||function(k,g){function m(){this.constructor=k}for(var b in g)g.hasOwnProperty(b)&&(k[b]=g[b]);k.prototype=null===g?Object.create(g):(m.prototype=g.prototype,new m)},GameStartr;
(function(k){var g=function(g){function b(a){void 0===a&&(a={});g.call(this,{unitsize:a.unitsize,constantsSource:a.constantsSource,constants:a.constants});this.resets="resetUsageHelper resetObjectMaker resetPixelRender resetTimeHandler resetItemsHolder resetAudioPlayer resetQuadsKeeper resetGamesRunner resetGroupHolder resetThingHitter resetMapScreener resetPixelDrawer resetNumberMaker resetMapsCreator resetAreaSpawner resetInputWriter resetDeviceLayer resetTouchPasser resetLevelEditor resetWorldSeeder resetScenePlayer resetMathDecider resetModAttacher startModAttacher resetContainer".split(" ");a.extraResets&&
this.resets.push.apply(this.resets,a.extraResets);a.resetTimed?this.resetTimed(this,a):this.reset(this,a)}__extends(b,g);b.prototype.reset=function(a,c){g.prototype.reset.call(this,a,a.resets,c)};b.prototype.resetTimed=function(a,c){g.prototype.resetTimed.call(this,a,a.resets,c)};b.prototype.resetUsageHelper=function(a,c){a.UsageHelper=new UsageHelpr.UsageHelpr(a.settings.help)};b.prototype.resetObjectMaker=function(a,c){a.ObjectMaker=new ObjectMakr.ObjectMakr(a.proliferate({properties:{Quadrant:{EightBitter:a,
GameStarter:a},Thing:{EightBitter:a,GameStarter:a}}},a.settings.objects))};b.prototype.resetQuadsKeeper=function(a,c){var d=c.width/(a.settings.quadrants.numCols-3),b=c.height/(a.settings.quadrants.numRows-2);a.QuadsKeeper=new QuadsKeepr.QuadsKeepr(a.proliferate({ObjectMaker:a.ObjectMaker,createCanvas:a.createCanvas,quadrantWidth:d,quadrantHeight:b,startLeft:-d,startHeight:-b,onAdd:a.onAreaSpawn.bind(a,a),onRemove:a.onAreaUnspawn.bind(a,a)},a.settings.quadrants))};b.prototype.resetPixelRender=function(a,
c){a.PixelRender=new PixelRendr.PixelRendr(a.proliferate({scale:a.scale,QuadsKeeper:a.QuadsKeeper,unitsize:a.unitsize},a.settings.sprites))};b.prototype.resetPixelDrawer=function(a,c){a.PixelDrawer=new PixelDrawr.PixelDrawr(a.proliferate({PixelRender:a.PixelRender,MapScreener:a.MapScreener,createCanvas:a.createCanvas,unitsize:a.unitsize,generateObjectKey:a.generateThingKey},a.settings.renderer))};b.prototype.resetTimeHandler=function(a,c){a.TimeHandler=new TimeHandlr.TimeHandlr(a.proliferate({classAdd:a.addClass,
classRemove:a.removeClass},a.settings.events))};b.prototype.resetAudioPlayer=function(a,c){a.AudioPlayer=new AudioPlayr.AudioPlayr(a.proliferate({ItemsHolder:a.ItemsHolder},a.settings.audio))};b.prototype.resetGamesRunner=function(a,c){a.GamesRunner=new GamesRunnr.GamesRunnr(a.proliferate({adjustFramerate:!0,scope:a,onPlay:a.onGamePlay.bind(a,a),onPause:a.onGamePause.bind(a,a),FPSAnalyzer:new FPSAnalyzr.FPSAnalyzr},a.settings.runner));a.FPSAnalyzer=a.GamesRunner.getFPSAnalyzer()};b.prototype.resetItemsHolder=
function(a,c){a.ItemsHolder=new ItemsHoldr.ItemsHoldr(a.proliferate({callbackArgs:[a]},a.settings.items))};b.prototype.resetGroupHolder=function(a,c){a.GroupHolder=new GroupHoldr.GroupHoldr(a.settings.groups)};b.prototype.resetThingHitter=function(a,c){a.ThingHitter=new ThingHittr.ThingHittr(a.proliferate({scope:a},a.settings.collisions))};b.prototype.resetMapScreener=function(a,c){a.MapScreener=new MapScreenr.MapScreenr({EightBitter:a,unitsize:a.unitsize,width:c.width,height:c.height,variableArgs:[a],
variables:a.settings.maps.screenVariables})};b.prototype.resetNumberMaker=function(a,c){a.NumberMaker=new NumberMakr.NumberMakr};b.prototype.resetMapsCreator=function(a,c){a.MapsCreator=new MapsCreatr.MapsCreatr({ObjectMaker:a.ObjectMaker,groupTypes:a.settings.maps.groupTypes,macros:a.settings.maps.macros,entrances:a.settings.maps.entrances,maps:a.settings.maps.library,scope:a})};b.prototype.resetAreaSpawner=function(a,c){a.AreaSpawner=new AreaSpawnr.AreaSpawnr({MapsCreator:a.MapsCreator,MapScreener:a.MapScreener,
screenAttributes:a.settings.maps.screenAttributes,onSpawn:a.settings.maps.onSpawn,onUnspawn:a.settings.maps.onUnspawn,stretchAdd:a.settings.maps.stretchAdd,afterAdd:a.settings.maps.afterAdd,commandScope:a})};b.prototype.resetInputWriter=function(a,c){a.InputWriter=new InputWritr.InputWritr(a.proliferate({canTrigger:a.canInputsTrigger.bind(a,a),eventInformation:a},a.settings.input.InputWritrArgs))};b.prototype.resetDeviceLayer=function(a,c){a.DeviceLayer=new DeviceLayr.DeviceLayr(a.proliferate({InputWriter:a.InputWriter},
a.settings.devices))};b.prototype.resetTouchPasser=function(a,c){a.TouchPasser=new TouchPassr.TouchPassr(a.proliferate({InputWriter:a.InputWriter},a.settings.touch))};b.prototype.resetLevelEditor=function(a,c){a.LevelEditor=new LevelEditr.LevelEditr(a.proliferate({GameStarter:a,beautifier:js_beautify},a.settings.editor))};b.prototype.resetWorldSeeder=function(a,c){a.WorldSeeder=new WorldSeedr.WorldSeedr(a.proliferate({random:a.NumberMaker.random.bind(a.NumberMaker),onPlacement:a.mapPlaceRandomCommands.bind(a,
a)},a.settings.generator))};b.prototype.resetScenePlayer=function(a,c){a.ScenePlayer=new ScenePlayr.ScenePlayr(a.proliferate({cutsceneArguments:[a]},a.settings.scenes))};b.prototype.resetMathDecider=function(a,c){a.MathDecider=new MathDecidr.MathDecidr(a.settings.math)};b.prototype.resetModAttacher=function(a,c){a.ModAttacher=new ModAttachr.ModAttachr(a.proliferate({scopeDefault:a,ItemsHoldr:a.ItemsHolder},a.settings.mods))};b.prototype.startModAttacher=function(a,c){var d=c.mods,b;if(d)for(b in d)d.hasOwnProperty(b)&&
d[b]&&a.ModAttacher.enableMod(b);a.ModAttacher.fireEvent("onReady",a,a)};b.prototype.resetContainer=function(a,c){a.container=a.createElement("div",{className:"EightBitter",style:a.proliferate({position:"relative",width:c.width+"px",height:c.height+"px"},c.style)});a.canvas=a.createCanvas(c.width,c.height);a.PixelDrawer.setCanvas(a.canvas);a.container.appendChild(a.canvas);a.TouchPasser.setParentContainer(a.container)};b.prototype.scrollWindow=function(a,c){var d=b.prototype.ensureCorrectCaller(this);
a|=0;c|=0;if(a||c)d.MapScreener.shift(a,c),d.shiftAll(-a,-c),d.QuadsKeeper.shiftQuadrants(-a,-c)};b.prototype.scrollThing=function(a,c,d){var b=a.left,f=a.top;a.GameStarter.scrollWindow(c,d);a.GameStarter.setLeft(a,b);a.GameStarter.setTop(a,f)};b.prototype.onAreaSpawn=function(a,c,d,b,f,g){a.AreaSpawner.spawnArea(c,(d+a.MapScreener.top)/a.unitsize,(b+a.MapScreener.left)/a.unitsize,(f+a.MapScreener.top)/a.unitsize,(g+a.MapScreener.left)/a.unitsize)};b.prototype.onAreaUnspawn=function(a,c,d,b,f,g){a.AreaSpawner.unspawnArea(c,
(d+a.MapScreener.top)/a.unitsize,(b+a.MapScreener.left)/a.unitsize,(f+a.MapScreener.top)/a.unitsize,(g+a.MapScreener.left)/a.unitsize)};b.prototype.addThing=function(a,c,d){void 0===c&&(c=0);void 0===d&&(d=0);var b;b="string"===typeof a||a instanceof String?this.ObjectMaker.make(a):a.constructor===Array?this.ObjectMaker.make.apply(this.ObjectMaker,a):a;2<arguments.length?(b.GameStarter.setLeft(b,c),b.GameStarter.setTop(b,d)):1<arguments.length&&b.GameStarter.setLeft(b,c);b.GameStarter.updateSize(b);
b.GameStarter.GroupHolder.getFunctions().add[b.groupType](b);b.placed=!0;if(b.onThingAdd)b.onThingAdd(b);b.GameStarter.PixelDrawer.setThingSprite(b);if(b.onThingAdded)b.onThingAdded(b);b.GameStarter.ModAttacher.fireEvent("onAddThing",b,c,d);return b};b.prototype.thingProcess=function(a,c,b,e){var f=4,g,h;a.title=a.title||c;a.width&&!a.spritewidth&&(a.spritewidth=e.spritewidth||e.width);a.height&&!a.spriteheight&&(a.spriteheight=e.spriteheight||e.height);g=Math.floor(a.width*(a.GameStarter.unitsize/
a.GameStarter.QuadsKeeper.getQuadrantWidth()));0<g&&(f+=(g+1)*f/2);g=Math.floor(a.height*a.GameStarter.unitsize/a.GameStarter.QuadsKeeper.getQuadrantHeight());0<g&&(f+=(g+1)*f/2);a.maxquads=f;a.quadrants=Array(f);a.spritewidth=a.spritewidth||a.width;a.spriteheight=a.spriteheight||a.height;a.spritewidthpixels=a.spritewidth*a.GameStarter.unitsize;a.spriteheightpixels=a.spriteheight*a.GameStarter.unitsize;a.canvas=a.GameStarter.createCanvas(a.spritewidthpixels,a.spriteheightpixels);a.context=a.canvas.getContext("2d");
1!==a.opacity&&a.GameStarter.setOpacity(a,a.opacity);a.attributes&&a.GameStarter.thingProcessAttributes(a,a.attributes);if(a.onThingMake)a.onThingMake(a,b);a.GameStarter.setSize(a,a.width,a.height);a.GameStarter.setClassInitial(a,a.name||a.title);(h=a.spriteCycle)&&a.GameStarter.TimeHandler.addClassCycle(a,h[0],h[1]||null,h[2]||null);(h=a.spriteCycleSynched)&&a.GameStarter.TimeHandler.addClassCycleSynched(a,h[0],h[1]||null,h[2]||null);a.flipHoriz&&a.GameStarter.flipHoriz(a);a.flipVert&&a.GameStarter.flipVert(a);
a.GameStarter.ModAttacher.fireEvent("onThingMake",a.GameStarter,a,c,b,e)};b.prototype.thingProcessAttributes=function(a,c){for(var b in c)a[b]&&(a.GameStarter.proliferate(a,c[b]),a.name=a.name?a.name+(" "+b):a.title+" "+b)};b.prototype.mapPlaceRandomCommands=function(a,c){var b=a.MapsCreator,e=a.AreaSpawner,f=e.getPreThings(),g=e.getArea(),e=e.getMap(),h,k,l;for(l=0;l<c.length;l+=1)h=c[l],k={thing:h.title,x:h.left,y:h.top},h.arguments&&a.proliferateHard(k,h.arguments,!0),b.analyzePreSwitch(k,f,g,
e)};b.prototype.onGamePlay=function(a){a.AudioPlayer.resumeAll();a.ModAttacher.fireEvent("onGamePlay")};b.prototype.onGamePause=function(a){a.AudioPlayer.pauseAll();a.ModAttacher.fireEvent("onGamePause")};b.prototype.canInputsTrigger=function(a){return!0};b.prototype.gameStart=function(){this.ModAttacher.fireEvent("onGameStart")};b.prototype.killNormal=function(a){a&&(a.alive=!1,a.hidden=!0,a.movement=void 0)};b.prototype.markChanged=function(a){a.changed=!0};b.prototype.shiftVert=function(a,c,b){EightBittr.EightBittr.prototype.shiftVert(a,
c);b||a.GameStarter.markChanged(a)};b.prototype.shiftHoriz=function(a,c,b){EightBittr.EightBittr.prototype.shiftHoriz(a,c);b||a.GameStarter.markChanged(a)};b.prototype.setTop=function(a,c){EightBittr.EightBittr.prototype.setTop(a,c);a.GameStarter.markChanged(a)};b.prototype.setRight=function(a,c){EightBittr.EightBittr.prototype.setRight(a,c);a.GameStarter.markChanged(a)};b.prototype.setBottom=function(a,c){EightBittr.EightBittr.prototype.setBottom(a,c);a.GameStarter.markChanged(a)};b.prototype.setLeft=
function(a,c){EightBittr.EightBittr.prototype.setLeft(a,c);a.GameStarter.markChanged(a)};b.prototype.shiftBoth=function(a,c,b,e){c=c||0;b=b||0;a.noshiftx||(a.parallaxHoriz?a.GameStarter.shiftHoriz(a,a.parallaxHoriz*c,e):a.GameStarter.shiftHoriz(a,c,e));a.noshifty||(a.parallaxVert?a.GameStarter.shiftVert(a,a.parallaxVert*b,e):a.GameStarter.shiftVert(a,b,e))};b.prototype.shiftThings=function(a,c,b,e){for(var f=a.length-1;0<=f;--f)a[f].GameStarter.shiftBoth(a[f],c,b,e)};b.prototype.shiftAll=function(a,
c){var d=b.prototype.ensureCorrectCaller(this);d.GroupHolder.callAll(d,d.shiftThings,a,c,!0)};b.prototype.setWidth=function(a,c,b,e){a.width=c;a.unitwidth=c*a.GameStarter.unitsize;b&&(a.spritewidth=c,a.spritewidthpixels=c*a.GameStarter.unitsize);e&&a.GameStarter.updateSize(a);a.GameStarter.markChanged(a)};b.prototype.setHeight=function(a,b,d,e){a.height=b;a.unitheight=b*a.GameStarter.unitsize;d&&(a.spriteheight=b,a.spriteheightpixels=b*a.GameStarter.unitsize);e&&a.GameStarter.updateSize(a);a.GameStarter.markChanged(a)};
b.prototype.setSize=function(a,b,d,e,f){a.GameStarter.setWidth(a,b,e,f);a.GameStarter.setHeight(a,d,e,f)};b.prototype.updatePosition=function(a){a.GameStarter.shiftHoriz(a,a.xvel);a.GameStarter.shiftVert(a,a.yvel)};b.prototype.updateSize=function(a){a.unitwidth=a.width*a.GameStarter.unitsize;a.unitheight=a.height*a.GameStarter.unitsize;a.spritewidthpixels=a.spritewidth*a.GameStarter.unitsize;a.spriteheightpixels=a.spriteheight*a.GameStarter.unitsize;a.canvas.width=a.spritewidthpixels;a.canvas.height=
a.spriteheightpixels;a.GameStarter.PixelDrawer.setThingSprite(a);a.GameStarter.markChanged(a)};b.prototype.reduceWidth=function(a,b,d){a.right-=b;a.width-=b/a.GameStarter.unitsize;d?a.GameStarter.updateSize(a):a.GameStarter.markChanged(a)};b.prototype.reduceHeight=function(a,b,d){a.top+=b;a.height-=b/a.GameStarter.unitsize;d?a.GameStarter.updateSize(a):a.GameStarter.markChanged(a)};b.prototype.increaseWidth=function(a,b,d){a.right+=b;a.width+=b/a.GameStarter.unitsize;a.unitwidth=a.width*a.GameStarter.unitsize;
d?a.GameStarter.updateSize(a):a.GameStarter.markChanged(a)};b.prototype.increaseHeight=function(a,b,d){a.top-=b;a.height+=b/a.GameStarter.unitsize;a.unitheight=a.height*a.GameStarter.unitsize;d?a.GameStarter.updateSize(a):a.GameStarter.markChanged(a)};b.prototype.generateThingKey=function(a){return a.groupType+" "+a.title+" "+a.className};b.prototype.setClass=function(a,b){a.className=b;a.GameStarter.PixelDrawer.setThingSprite(a);a.GameStarter.markChanged(a)};b.prototype.setClassInitial=function(a,
b){a.className=b};b.prototype.addClass=function(a,b){a.className+=" "+b;a.GameStarter.PixelDrawer.setThingSprite(a);a.GameStarter.markChanged(a)};b.prototype.addClasses=function(a){for(var b=[],d=1;d<arguments.length;d++)b[d-1]=arguments[d];var e,f;for(e=0;e<b.length;e+=1){d=b[e];if(d.constructor===String||"string"===typeof d)d=d.split(" ");for(f=d.length-1;0<=f;--f)a.GameStarter.addClass(a,d[f])}};b.prototype.removeClass=function(a,b){b&&(-1!==b.indexOf(" ")&&a.GameStarter.removeClasses(a,b),a.className=
a.className.replace(new RegExp(" "+b,"gm"),""),a.GameStarter.PixelDrawer.setThingSprite(a))};b.prototype.removeClasses=function(a){for(var b=[],d=1;d<arguments.length;d++)b[d-1]=arguments[d];var e,f;for(e=0;e<b.length;e+=1){d=b[e];if(d.constructor===String||"string"===typeof d)d=d.split(" ");for(f=d.length-1;0<=f;--f)a.GameStarter.removeClass(a,d[f])}};b.prototype.hasClass=function(a,b){return-1!==a.className.indexOf(b)};b.prototype.switchClass=function(a,b,d){a.GameStarter.removeClass(a,b);a.GameStarter.addClass(a,
d)};b.prototype.flipHoriz=function(a){a.flipHoriz=!0;a.GameStarter.addClass(a,"flipped")};b.prototype.flipVert=function(a){a.flipVert=!0;a.GameStarter.addClass(a,"flip-vert")};b.prototype.unflipHoriz=function(a){a.flipHoriz=!1;a.GameStarter.removeClass(a,"flipped")};b.prototype.unflipVert=function(a){a.flipVert=!1;a.GameStarter.removeClass(a,"flip-vert")};b.prototype.setOpacity=function(a,b){a.opacity=b;a.GameStarter.markChanged(a)};b.prototype.ensureCorrectCaller=function(a){if(!(a instanceof b))throw Error("A function requires the scope ('this') to be the manipulated GameStartr object. Unfortunately, 'this' is a "+
typeof this+".");return a};b.prototype.arrayDeleteThing=function(a,b,d){void 0===d&&(d=b.indexOf(a));if(-1!==d&&(b.splice(d,1),"function"===typeof a.onDelete))a.onDelete(a)};b.prototype.takeScreenshot=function(a,c){void 0===c&&(c="image/png");var d=b.prototype.ensureCorrectCaller(this);d.createElement("a",{download:a+"."+c.split("/")[1],href:d.canvas.toDataURL(c).replace(c,"image/octet-stream")}).click()};b.prototype.addPageStyles=function(a){var c=b.prototype.ensureCorrectCaller(this).createElement("style",
{type:"text/css"}),d="",e,f;for(e in a)if(a.hasOwnProperty(e)){d+=e+" { \r\n";for(f in a[e])a[e].hasOwnProperty(f)&&(d+="  "+f+": "+a[e][f]+";\r\n");d+="}\r\n"}c.styleSheet?c.style.cssText=d:c.appendChild(document.createTextNode(d));document.querySelector("head").appendChild(c)};return b}(EightBittr.EightBittr);k.GameStartr=g})(GameStartr||(GameStartr={}));
var GroupHoldr;
(function(g){var h=function(){function e(a){if("undefined"===typeof a)throw Error("No settings object given to GroupHoldr.");if("undefined"===typeof a.groupNames)throw Error("No groupNames given to GroupHoldr.");if("undefined"===typeof a.groupTypes)throw Error("No groupTypes given to GroupHoldr.");this.functions={setGroup:{},getGroup:{},set:{},get:{},add:{},"delete":{}};this.setGroupNames(a.groupNames,a.groupTypes)}e.prototype.getFunctions=function(){return this.functions};e.prototype.getGroups=function(){return this.groups};
e.prototype.getGroup=function(a){return this.groups[a]};e.prototype.getGroupNames=function(){return this.groupNames};e.prototype.switchMemberGroup=function(a,b,c,d,e){if(this.groups[b].constructor===Array)this.functions["delete"][b](a,d);else this.functions["delete"][b](d);this.functions.add[c](a,e)};e.prototype.applyAll=function(a,b,c){void 0===c&&(c=void 0);var d;c?c.unshift(void 0):c=[void 0];a||(a=this);for(d=this.groupNames.length-1;0<=d;--d)c[0]=this.groups[this.groupNames[d]],b.apply(a,c);
c.shift()};e.prototype.applyOnAll=function(a,b,c){void 0===c&&(c=void 0);var d,e,f;c?c.unshift(void 0):c=[void 0];a||(a=this);for(e=this.groupNames.length-1;0<=e;--e)if(d=this.groups[this.groupNames[e]],d instanceof Array)for(f=0;f<d.length;f+=1)c[0]=d[f],b.apply(a,c);else for(f in d)d.hasOwnProperty(f)&&(c[0]=d[f],b.apply(a,c))};e.prototype.callAll=function(a,b){var c=Array.prototype.slice.call(arguments,1),d;a||(a=this);for(d=this.groupNames.length-1;0<=d;--d)c[0]=this.groups[this.groupNames[d]],
b.apply(a,c)};e.prototype.callOnAll=function(a,b){var c=Array.prototype.slice.call(arguments,1),d,e,f;a||(a=this);for(e=this.groupNames.length-1;0<=e;--e)if(d=this.groups[this.groupNames[e]],d instanceof Array)for(f=0;f<d.length;f+=1)c[0]=d[f],b.apply(a,c);else for(f in d)d.hasOwnProperty(f)&&(c[0]=d[f],b.apply(a,c))};e.prototype.clearArrays=function(){var a,b;for(b=this.groupNames.length-1;0<=b;--b)a=this.groups[this.groupNames[b]],a instanceof Array&&(a.length=0)};e.prototype.setGroupNames=function(a,
b){var c=this,d,e;this.groupNames&&this.clearFunctions();this.groupNames=a;this.groupTypes={};this.groupTypeNames={};b.constructor===Object?this.groupNames.forEach(function(a){c.groupTypes[a]=c.getTypeFunction(b[a]);c.groupTypeNames[a]=c.getTypeName(b[a])}):(d=this.getTypeFunction(b),e=this.getTypeName(b),this.groupNames.forEach(function(a){c.groupTypes[a]=d;c.groupTypeNames[a]=e}));this.setGroups();this.createFunctions()};e.prototype.clearFunctions=function(){this.groupNames.forEach(function(a){delete this["set"+
a+"Group"];delete this["get"+a+"Group"];delete this["set"+a];delete this["get"+a];delete this["add"+a];delete this["delete"+a];this.functions.setGroup={};this.functions.getGroup={};this.functions.set={};this.functions.get={};this.functions.add={};this.functions["delete"]={}})};e.prototype.setGroups=function(){var a=this;this.groups={};this.groupNames.forEach(function(b){a.groups[b]=new a.groupTypes[b]})};e.prototype.createFunctions=function(){var a,b;for(b=0;b<this.groupNames.length;b+=1)a=this.groupNames[b],
this.createFunctionSetGroup(a),this.createFunctionGetGroup(a),this.createFunctionSet(a),this.createFunctionGet(a),this.createFunctionAdd(a),this.createFunctionDelete(a)};e.prototype.createFunctionSetGroup=function(a){var b=this;this.functions.setGroup[a]=this["set"+a+"Group"]=function(c){b.groups[a]=c}};e.prototype.createFunctionGetGroup=function(a){var b=this;this.functions.getGroup[a]=this["get"+a+"Group"]=function(){return b.groups[a]}};e.prototype.createFunctionSet=function(a){this.functions.set[a]=
this["set"+a]=function(b,c){void 0===c&&(c=void 0);this.groups[a][b]=c}};e.prototype.createFunctionGet=function(a){this.functions.get[a]=this["get"+a]=function(b){return this.groups[a][b]}};e.prototype.createFunctionAdd=function(a){var b=this.groups[a];this.functions.add[a]=this.groupTypes[a]===Object?this["add"+a]=function(a,d){b[d]=a}:this["add"+a]=function(a,d){void 0!==d?b[d]=a:b.push(a)}};e.prototype.createFunctionDelete=function(a){var b=this.groups[a];this.functions["delete"][a]=this.groupTypes[a]===
Object?this["delete"+a]=function(a){delete b[a]}:this["delete"+a]=function(a,d){void 0===d&&(d=b.indexOf(a));-1!==d&&b.splice(d,1)}};e.prototype.getTypeName=function(a){return a&&a.charAt&&"o"===a.charAt(0).toLowerCase()?"Object":"Array"};e.prototype.getTypeFunction=function(a){return a&&a.charAt&&"o"===a.charAt(0).toLowerCase()?Object:Array};return e}();g.GroupHoldr=h})(GroupHoldr||(GroupHoldr={}));
var InputWritr;
(function(k){var l=function(){function b(a){if("undefined"===typeof a)throw Error("No settings object given to InputWritr.");if("undefined"===typeof a.triggers)throw Error("No triggers given to InputWritr.");this.triggers=a.triggers;this.getTimestamp="undefined"===typeof a.getTimestamp?"undefined"===typeof performance?function(){return Date.now()}:(performance.now||performance.webkitNow||performance.mozNow||performance.msNow||performance.oNow).bind(performance):a.getTimestamp;this.eventInformation=a.eventInformation;
this.canTrigger=a.hasOwnProperty("canTrigger")?a.canTrigger:function(){return!0};this.isRecording=a.hasOwnProperty("isRecording")?a.isRecording:function(){return!0};this.currentHistory={};this.histories={};this.aliases={};this.addAliases(a.aliases||{});this.keyAliasesToCodes=a.keyAliasesToCodes||{shift:16,ctrl:17,space:32,left:37,up:38,right:39,down:40};this.keyCodesToAliases=a.keyCodesToAliases||{16:"shift",17:"ctrl",32:"space",37:"left",38:"up",39:"right",40:"down"}}b.prototype.getAliases=function(){return this.aliases};
b.prototype.getAliasesAsKeyStrings=function(){var a={},c;for(c in this.aliases)this.aliases.hasOwnProperty(c)&&(a[c]=this.getAliasAsKeyStrings(c));return a};b.prototype.getAliasAsKeyStrings=function(a){return this.aliases[a].map(this.convertAliasToKeyString.bind(this))};b.prototype.convertAliasToKeyString=function(a){return a.constructor===String?a:96<a&&105>a?String.fromCharCode(a-48):64<a&&97>a?String.fromCharCode(a):"undefined"!==typeof this.keyCodesToAliases[a]?this.keyCodesToAliases[a]:"?"};
b.prototype.convertKeyStringToAlias=function(a){return a.constructor===Number?a:1===a.length?a.charCodeAt(0)-32:"undefined"!==typeof this.keyAliasesToCodes[a]?this.keyAliasesToCodes[a]:-1};b.prototype.getCurrentHistory=function(){return this.currentHistory};b.prototype.getHistory=function(a){return this.histories[a]};b.prototype.getHistories=function(){return this.histories};b.prototype.getCanTrigger=function(){return this.canTrigger};b.prototype.getIsRecording=function(){return this.isRecording};
b.prototype.setCanTrigger=function(a){this.canTrigger=a.constructor===Boolean?function(){return a}:a};b.prototype.setIsRecording=function(a){this.isRecording=a.constructor===Boolean?function(){return a}:a};b.prototype.setEventInformation=function(a){this.eventInformation=a};b.prototype.addAliasValues=function(a,c){var b,e,d;this.aliases.hasOwnProperty(a)?this.aliases[a].push.apply(this.aliases[a],c):this.aliases[a]=c;for(b in this.triggers)if(this.triggers.hasOwnProperty(b)&&(e=this.triggers[b],e.hasOwnProperty(a)))for(d=
0;d<c.length;d+=1)e[c[d]]=e[a]};b.prototype.removeAliasValues=function(a,c){var b,e,d;if(this.aliases.hasOwnProperty(a)){for(d=0;d<c.length;d+=1)this.aliases[a].splice(this.aliases[a].indexOf(c[d],1));for(b in this.triggers)if(this.triggers.hasOwnProperty(b)&&(e=this.triggers[b],e.hasOwnProperty(a)))for(d=0;d<c.length;d+=1)e.hasOwnProperty(c[d])&&delete e[c[d]]}};b.prototype.switchAliasValues=function(a,c,b){this.removeAliasValues(a,c);this.addAliasValues(a,b)};b.prototype.addAliases=function(a){for(var c in a)a.hasOwnProperty(c)&&
this.addAliasValues(c,a[c])};b.prototype.addEvent=function(a,c,b){var e;if(!this.triggers.hasOwnProperty(a))throw Error("Unknown trigger requested: '"+a+"'.");this.triggers[a][c]=b;if(this.aliases.hasOwnProperty(c))for(e=0;e<this.aliases[c].length;e+=1)this.triggers[a][this.aliases[c][e]]=b};b.prototype.removeEvent=function(a,c){var b;if(!this.triggers.hasOwnProperty(a))throw Error("Unknown trigger requested: '"+a+"'.");delete this.triggers[a][c];if(this.aliases.hasOwnProperty(c))for(b=0;b<this.aliases[c].length;b+=
1)this.triggers[a][this.aliases[c][b]]&&delete this.triggers[a][this.aliases[c][b]]};b.prototype.saveHistory=function(a){void 0===a&&(a=Object.keys(this.histories).length.toString());this.histories[a]=this.currentHistory};b.prototype.restartHistory=function(a){void 0===a&&(a=!0);a&&this.saveHistory();this.currentHistory={};this.startingTime=this.getTimestamp()};b.prototype.playHistory=function(a){for(var b in a)a.hasOwnProperty(b)&&setTimeout(this.makeEventCall(a[b]),Number(b)-this.startingTime|0)};
b.prototype.callEvent=function(a,b,f){if(!a)throw Error("Blank event given to InputWritr.");if(this.canTrigger(a,b,f))return a.constructor===String&&(a=this.triggers[a][b]),a(this.eventInformation,f)};b.prototype.makePipe=function(a,b,f){var e=this,d=this.triggers[a];if(!d)throw Error("No trigger of label '"+a+"' defined.");return function(g){var h=g[b];f&&g.preventDefault instanceof Function&&g.preventDefault();d.hasOwnProperty(h)&&(e.isRecording()&&e.saveEventInformation([a,h]),e.callEvent(d[h],
h,g))}};b.prototype.makeEventCall=function(a){var b=this;return function(){b.callEvent(a[0],a[1]);b.isRecording()&&b.saveEventInformation(a)}};b.prototype.saveEventInformation=function(a){this.currentHistory[this.getTimestamp()|0]=a};return b}();k.InputWritr=l})(InputWritr||(InputWritr={}));
var ItemsHoldr;
(function(h){var k=function(){function b(a,g,b){void 0===b&&(b={});this.ItemsHolder=a;a.proliferate(this,a.getDefaults());a.proliferate(this,b);this.key=g;this.hasOwnProperty("value")||(this.value=this.valueDefault);this.hasElement&&(this.element=a.createElement(this.elementTag||"div",{className:a.getPrefix()+"_value "+g}),this.element.appendChild(a.createElement("div",{textContent:g})),this.element.appendChild(a.createElement("div",{textContent:this.value})));this.storeLocally&&(a.getLocalStorage().hasOwnProperty(a.getPrefix()+g)?
(this.value=this.retrieveLocalStorage(),this.update()):this.updateLocalStorage())}b.prototype.getValue=function(){return this.transformGet?this.transformGet(this.value):this.value};b.prototype.setValue=function(a){this.value=this.transformSet?this.transformSet(a):a;this.update()};b.prototype.update=function(){this.hasOwnProperty("minimum")&&Number(this.value)<=Number(this.minimum)?(this.value=this.minimum,this.onMinimum&&this.onMinimum.apply(this,this.ItemsHolder.getCallbackArgs())):this.hasOwnProperty("maximum")&&
Number(this.value)<=Number(this.maximum)&&(this.value=this.maximum,this.onMaximum&&this.onMaximum.apply(this,this.ItemsHolder.getCallbackArgs()));this.modularity&&this.checkModularity();this.triggers&&this.checkTriggers();this.hasElement&&this.updateElement();this.storeLocally&&this.updateLocalStorage()};b.prototype.updateLocalStorage=function(a){if(a||this.ItemsHolder.getAutoSave())this.ItemsHolder.getLocalStorage()[this.ItemsHolder.getPrefix()+this.key]=JSON.stringify(this.value)};b.prototype.checkTriggers=
function(){this.triggers.hasOwnProperty(this.value)&&this.triggers[this.value].apply(this,this.ItemsHolder.getCallbackArgs())};b.prototype.checkModularity=function(){if(this.value.constructor===Number&&this.modularity)for(;this.value>=this.modularity;)this.value=Math.max(0,this.value-this.modularity),this.onModular&&this.onModular.apply(this,this.ItemsHolder.getCallbackArgs())};b.prototype.updateElement=function(){this.ItemsHolder.hasDisplayChange(this.value)?this.element.children[1].textContent=
this.ItemsHolder.getDisplayChange(this.value):this.element.children[1].textContent=this.value};b.prototype.retrieveLocalStorage=function(){var a=localStorage.getItem(this.ItemsHolder.getPrefix()+this.key);return"undefined"===a?void 0:a.constructor!==String?a:JSON.parse(a)};return b}();h.ItemValue=k;var l=function(){function b(a){void 0===a&&(a={});var b;this.prefix=a.prefix||"";this.autoSave=a.autoSave;this.callbackArgs=a.callbackArgs||[];this.allowNewItems=void 0===a.allowNewItems?!0:a.allowNewItems;
this.localStorage=a.localStorage?a.localStorage:"undefined"===typeof localStorage?this.createPlaceholderStorage():localStorage;this.defaults=a.defaults||{};this.displayChanges=a.displayChanges||{};this.items={};if(a.values)for(b in this.itemKeys=Object.keys(a.values),a.values)a.values.hasOwnProperty(b)&&this.addItem(b,a.values[b]);else this.itemKeys=[];a.doMakeContainer&&(this.containersArguments=a.containersArguments||[["div",{className:this.prefix+"_container"}]],this.container=this.makeContainer(a.containersArguments))}
b.prototype.key=function(a){return this.itemKeys[a]};b.prototype.getValues=function(){return this.items};b.prototype.getDefaults=function(){return this.defaults};b.prototype.getLocalStorage=function(){return this.localStorage};b.prototype.getAutoSave=function(){return this.autoSave};b.prototype.getPrefix=function(){return this.prefix};b.prototype.getContainer=function(){return this.container};b.prototype.getContainersArguments=function(){return this.containersArguments};b.prototype.getDisplayChanges=
function(){return this.displayChanges};b.prototype.getCallbackArgs=function(){return this.callbackArgs};b.prototype.getKeys=function(){return Object.keys(this.items)};b.prototype.getItem=function(a){this.checkExistence(a);return this.items[a].getValue()};b.prototype.getObject=function(a){return this.items[a]};b.prototype.hasKey=function(a){return this.items.hasOwnProperty(a)};b.prototype.exportItems=function(){var a={},b;for(b in this.items)this.items.hasOwnProperty(b)&&(a[b]=this.items[b].getValue());
return a};b.prototype.addItem=function(a,b){void 0===b&&(b={});this.items[a]=new k(this,a,b);this.itemKeys.push(a);return this.items[a]};b.prototype.removeItem=function(a){this.items.hasOwnProperty(a)&&(this.container&&this.items[a].hasElement&&this.container.removeChild(this.items[a].element),this.itemKeys.splice(this.itemKeys.indexOf(a),1),delete this.items[a])};b.prototype.clear=function(){var a;if(this.container)for(a in this.items)this.items[a].hasElement&&this.container.removeChild(this.items[a].element);
this.items={};this.itemKeys=[]};b.prototype.setItem=function(a,b){this.checkExistence(a);this.items[a].setValue(b)};b.prototype.increase=function(a,b){void 0===b&&(b=1);this.checkExistence(a);var e=this.items[a].getValue();this.items[a].setValue(e+b)};b.prototype.decrease=function(a,b){void 0===b&&(b=1);this.checkExistence(a);var e=this.items[a].getValue();this.items[a].setValue(e-b)};b.prototype.toggle=function(a){this.checkExistence(a);var b=this.items[a].getValue();this.items[a].setValue(b?!1:
!0)};b.prototype.checkExistence=function(a){if(!this.items.hasOwnProperty(a))if(this.allowNewItems)this.addItem(a);else throw Error("Unknown key given to ItemsHoldr: '"+a+"'.");};b.prototype.saveItem=function(a){if(!this.items.hasOwnProperty(a))throw Error("Unknown key given to ItemsHoldr: '"+a+"'.");this.items[a].updateLocalStorage(!0)};b.prototype.saveAll=function(){for(var a in this.items)this.items.hasOwnProperty(a)&&this.items[a].updateLocalStorage(!0)};b.prototype.hideContainer=function(){this.container.style.visibility=
"hidden"};b.prototype.displayContainer=function(){this.container.style.visibility="visible"};b.prototype.makeContainer=function(a){var b=this.createElement.apply(this,a[0]),e=b,c,d,f;for(f=1;f<a.length;++f)c=this.createElement.apply(this,a[f]),e.appendChild(c),e=c;for(d in this.items)this.items[d].hasElement&&c.appendChild(this.items[d].element);return b};b.prototype.hasDisplayChange=function(a){return this.displayChanges.hasOwnProperty(a)};b.prototype.getDisplayChange=function(a){return this.displayChanges[a]};
b.prototype.createElement=function(a){void 0===a&&(a="div");for(var b=[],e=1;e<arguments.length;e++)b[e-1]=arguments[e];var e=document.createElement(a),c;for(c=0;c<b.length;c+=1)this.proliferateElement(e,b[c]);return e};b.prototype.proliferate=function(a,b,e){var c,d;for(d in b)!b.hasOwnProperty(d)||e&&a.hasOwnProperty(d)||(c=b[d],"object"===typeof c?(a.hasOwnProperty(d)||(a[d]=new c.constructor),this.proliferate(a[d],c,e)):a[d]=c);return a};b.prototype.proliferateElement=function(a,b,e){var c,d,
f;for(d in b)if(b.hasOwnProperty(d)&&(!e||!a.hasOwnProperty(d)))switch(c=b[d],d){case "children":if("undefined"!==typeof c)for(f=0;f<c.length;f+=1)a.appendChild(c[f]);break;case "style":this.proliferate(a[d],c);break;default:"object"===typeof c?(a.hasOwnProperty(d)||(a[d]=new c.constructor),this.proliferate(a[d],c,e)):a[d]=c}return a};b.prototype.createPlaceholderStorage=function(){var a,b={keys:[],getItem:function(a){return this.localStorage[a]},setItem:function(a,b){this.localStorage[a]=b},clear:function(){for(a in this)this.hasOwnProperty(a)&&
delete this[a]},removeItem:function(a){delete this[a]},key:function(a){return this.keys[a]}};Object.defineProperties(b,{length:{get:function(){return b.keys.length}},remainingSpace:{get:function(){return 9001}}});return b};return b}();h.ItemsHoldr=l})(ItemsHoldr||(ItemsHoldr={}));
var LevelEditr;
(function(q){var r=function(){function b(a){if("undefined"===typeof a)throw Error("No settings object given to LevelEditr.");if("undefined"===typeof a.prethings)throw Error("No prethings given to LevelEditr.");if("undefined"===typeof a.thingGroups)throw Error("No thingGroups given to LevelEditr.");if("undefined"===typeof a.things)throw Error("No things given to LevelEditr.");if("undefined"===typeof a.macros)throw Error("No macros given to LevelEditr.");if("undefined"===typeof a.beautifier)throw Error("No beautifier given to LevelEditr.");this.enabled=
!1;this.GameStarter=a.GameStarter;this.prethings=a.prethings;this.thingGroups=a.thingGroups;this.things=a.things;this.macros=a.macros;this.beautifier=a.beautifier;this.mapNameDefault=a.mapNameDefault||"New Map";this.mapTimeDefault=a.mapTimeDefault||Infinity;this.mapSettingDefault=a.mapSettingDefault||"";this.mapEntrances=a.mapEntrances||[];this.mapDefault=a.mapDefault;this.blocksize=a.blocksize||1;this.keyUndefined=a.keyUndefined||"-none-";this.currentPreThings=[];this.currentMode="Build";this.currentClickMode=
"Thing";this.canClick=!0}b.prototype.getEnabled=function(){return this.enabled};b.prototype.getGameStarter=function(){return this.GameStarter};b.prototype.getOldInformation=function(){return this.oldInformation};b.prototype.getPreThings=function(){return this.prethings};b.prototype.getThingGroups=function(){return this.thingGroups};b.prototype.getThings=function(){return this.things};b.prototype.getMacros=function(){return this.macros};b.prototype.getMapNameDefault=function(){return this.mapNameDefault};
b.prototype.getMapTimeDefault=function(){return this.mapTimeDefault};b.prototype.getMapDefault=function(){return this.mapDefault};b.prototype.getDisplay=function(){return this.display};b.prototype.getCurrentMode=function(){return this.currentMode};b.prototype.getBlockSize=function(){return this.blocksize};b.prototype.getBeautifier=function(){return this.beautifier};b.prototype.getCurrentPreThings=function(){return this.currentPreThings};b.prototype.getCurrentTitle=function(){return this.currentTitle};
b.prototype.getCurrentArgs=function(){return this.currentArgs};b.prototype.getPageStylesAdded=function(){return this.pageStylesAdded};b.prototype.getKeyUndefined=function(){return this.keyUndefined};b.prototype.getCanClick=function(){return this.canClick};b.prototype.enable=function(){this.enabled||(this.enabled=!0,this.oldInformation={map:this.GameStarter.AreaSpawner.getMapName()},this.clearAllThings(),this.resetDisplay(),this.setCurrentMode("Build"),this.GameStarter.MapScreener.nokeys=!0,this.setTextareaValue(this.stringifySmart(this.mapDefault),
!0),this.resetDisplayMap(),this.disableAllThings(),this.GameStarter.ItemsHolder.setItem("lives",Infinity),this.pageStylesAdded||(this.GameStarter.addPageStyles(this.createPageStyles()),this.pageStylesAdded=!0),this.GameStarter.container.insertBefore(this.display.container,this.GameStarter.container.children[0]))};b.prototype.disable=function(){this.display&&this.enabled&&(this.GameStarter.container.removeChild(this.display.container),this.display=void 0,this.GameStarter.setMap(this.oldInformation.map),
this.GameStarter.ItemsHolder.setItem("lives",this.GameStarter.settings.statistics.values.lives.valueDefault),this.enabled=!1)};b.prototype.minimize=function(){this.display.minimizer.innerText="+";this.display.minimizer.onclick=this.maximize.bind(this);this.display.container.className+=" minimized";this.display.scrollers.container.style.opacity="0"};b.prototype.maximize=function(){this.display.minimizer.innerText="-";this.display.minimizer.onclick=this.minimize.bind(this);-1!==this.display.container.className.indexOf("minimized")&&
(this.display.container.className=this.display.container.className.replace(/ minimized/g,""));"Thing"===this.currentClickMode?this.setSectionClickToPlaceThings():"Macro"===this.currentClickMode&&this.setSectionClickToPlaceMacros();this.display.scrollers.container.style.opacity="1"};b.prototype.startBuilding=function(){this.setCurrentMode("Build");this.beautifyTextareaValue();this.setDisplayMap(!0);this.maximize()};b.prototype.startPlaying=function(){this.setCurrentMode("Play");this.beautifyTextareaValue();
this.setDisplayMap();this.minimize()};b.prototype.downloadCurrentJSON=function(){var a=this.downloadFile(this.getMapName()+".json",this.display.stringer.textarea.value||"");window.open(a.href)};b.prototype.setCurrentJSON=function(a){this.startBuilding();this.setTextareaValue(a,!0);this.getMapObjectAndTry()};b.prototype.loadCurrentJSON=function(){this.display.inputDummy.click()};b.prototype.beautify=function(a){return this.beautifier(a)};b.prototype.handleUploadCompletion=function(a){this.enable();
this.setCurrentJSON(a.currentTarget.result);this.setSectionJSON()};b.prototype.setCurrentMode=function(a){this.currentMode=a};b.prototype.setCurrentClickMode=function(a,d){this.currentClickMode=a;this.cancelEvent(d)};b.prototype.setCurrentThing=function(a,d,c){void 0===d&&(d=0);void 0===c&&(c=0);var b=this.generateCurrentArgs(),f=this.things[a],g=this.GameStarter.proliferate({outerok:2},this.getNormalizedThingArguments(b)),h=this.GameStarter.ObjectMaker.make(this.currentTitle,g);this.clearCurrentThings();
this.currentTitle=a;this.currentArgs=b;this.currentPreThings=[{xloc:0,yloc:0,top:-f.offsetTop||0,right:f.offsetLeft+h.width*this.GameStarter.unitsize,bottom:(-f.offsetTop||0)+h.height*this.GameStarter.unitsize,left:f.offsetLeft||0,title:this.currentTitle,reference:g,thing:h,spawned:!0}];this.addThingAndDisableEvents(this.currentPreThings[0].thing,d,c)};b.prototype.resetCurrentThings=function(a){var d,c;for(c=0;c<this.currentPreThings.length;c+=1)d=this.currentPreThings[c],d.thing.outerok=2,this.GameStarter.addThing(d.thing,
d.xloc||0,d.yloc||0),this.disableThing(d.thing);this.onMouseMoveEditing(a);this.GameStarter.TimeHandler.cancelAllEvents()};b.prototype.clearCurrentThings=function(){if(this.currentPreThings){for(var a=0;a<this.currentPreThings.length;a+=1)this.GameStarter.killNormal(this.currentPreThings[a].thing);this.currentPreThings=[]}};b.prototype.setCurrentArgs=function(a){if("Thing"===this.currentClickMode)this.setCurrentThing(this.currentTitle);else if("Macro"===this.currentClickMode)this.onMacroIconClick(this.currentTitle,
void 0,this.generateCurrentArgs(),a);a&&a.stopPropagation()};b.prototype.onMouseDownScrolling=function(a,d){var c=d.target,b=this;c.setAttribute("scrolling","1");this.GameStarter.TimeHandler.addEventInterval(function(){if("1"!==c.getAttribute("scrolling"))return!0;if(0>a&&0>=b.GameStarter.MapScreener.left)b.display.scrollers.left.style.opacity=".14";else{for(var d=0;d<b.currentPreThings.length;d+=1)b.GameStarter.shiftHoriz(b.currentPreThings[d].thing,a);b.GameStarter.scrollWindow(a);b.display.scrollers.left.style.opacity=
"1"}},1,Infinity)};b.prototype.onMouseUpScrolling=function(a){a.target.setAttribute("scrolling","0")};b.prototype.onMouseMoveEditing=function(a){var d=a.x||a.clientX||0;a=a.y||a.clientY||0;var c,b,f,g;for(g=0;g<this.currentPreThings.length;g+=1)c=this.currentPreThings[g],b=this.roundTo(d-this.GameStarter.container.offsetLeft,this.blocksize),f=this.roundTo(a-this.GameStarter.container.offsetTop,this.blocksize),c.left&&(b+=c.left*this.GameStarter.unitsize),c.top&&(f-=c.top*this.GameStarter.unitsize),
this.GameStarter.setLeft(c.thing,b),this.GameStarter.setTop(c.thing,f)};b.prototype.afterClick=function(){this.canClick=!1;setTimeout(function(){this.canClick=!0}.bind(this),70)};b.prototype.onClickEditingThing=function(a){if(this.canClick&&"Build"===this.currentMode&&this.currentPreThings.length){var d=this.getNormalizedMouseEventCoordinates(a,!0);a=d[0];d=d[1];this.addMapCreationThing(a,d)&&(this.onClickEditingGenericAdd(a,d,this.currentTitle,this.currentArgs),this.afterClick())}};b.prototype.onClickEditingMacro=
function(a){if(this.canClick&&"Build"===this.currentMode&&this.currentPreThings.length){var d=this.getNormalizedMouseEventCoordinates(a);a=d[0];var d=d[1],b,e;if(this.addMapCreationMacro(a,d)){for(e=0;e<this.currentPreThings.length;e+=1)b=this.currentPreThings[e],this.onClickEditingGenericAdd(a+(b.left||0)*this.GameStarter.unitsize,d-(b.top||0)*this.GameStarter.unitsize,b.thing.title||b.title,b.reference);this.afterClick()}}};b.prototype.onClickEditingGenericAdd=function(a,d,b,e){b=this.GameStarter.ObjectMaker.make(b,
this.GameStarter.proliferate({onThingMake:void 0,onThingAdd:void 0,onThingAdded:void 0,movement:void 0},this.getNormalizedThingArguments(e)));a-=this.GameStarter.container.offsetLeft;d-=this.GameStarter.container.offsetTop;"Build"===this.currentMode&&this.disableThing(b);this.addThingAndDisableEvents(b,a,d)};b.prototype.onThingIconClick=function(a,d){var b=d.x||d.clientX||0,e=d.y||d.clientY||0,f="DIV"===d.target.nodeName?d.target:d.target.parentNode;this.cancelEvent(d);this.killCurrentPreThings();
this.setVisualOptions(f.getAttribute("name"),void 0,f.options);this.generateCurrentArgs();this.setCurrentThing(a,b,e)};b.prototype.onMacroIconClick=function(a,d,b,e){d&&this.setVisualOptions(a,d,b);if(d=this.getMapObject())this.clearCurrentThings(),this.GameStarter.MapsCreator.analyzePreMacro(this.GameStarter.proliferate({macro:a,x:0,y:0},this.generateCurrentArgs()),this.createPrethingsHolder(this.currentPreThings),this.getCurrentAreaObject(d),d),this.currentTitle=a,this.resetCurrentThings(e)};b.prototype.createPrethingsHolder=
function(a){var d={};this.thingGroups.forEach(function(b){d[b]=a});return d};b.prototype.generateCurrentArgs=function(){var a={},d=this.display.sections.ClickToPlace.VisualOptions.getElementsByClassName("VisualOptionsList"),b,e,f;this.currentArgs=a;if(0===d.length)return a;d=d[0].childNodes;for(f=0;f<d.length;f+=1){b=d[f];e=b.querySelector(".VisualOptionLabel");b=b.querySelector(".VisualOptionValue");switch((b.getAttribute("data:type")||b.type).toLowerCase()){case "boolean":b="true"===b.value;break;
case "number":b=(Number(b.value)||0)*(Number(b.getAttribute("data:mod"))||1);break;default:b="Number"===b.getAttribute("typeReal")?Number(b.value):b.value}b!==this.keyUndefined&&(a[e.textContent]=b)}return a};b.prototype.setMapName=function(){var a=this.getMapName(),d=this.getMapObject();d&&d.name!==a&&(d.name=a,this.display.namer.value=a,this.setTextareaValue(this.stringifySmart(d),!0),this.GameStarter.ItemsHolder.setItem("world",a))};b.prototype.setMapTime=function(a){var d=this.getMapObject();
d&&(a?(a=Number(this.display.sections.MapSettings.Time.value),d.time=a):(a=d.time,this.display.sections.MapSettings.Time.value=a.toString()),this.setTextareaValue(this.stringifySmart(d),!0),this.GameStarter.ItemsHolder.setItem("time",a),this.GameStarter.TimeHandler.cancelAllEvents())};b.prototype.setMapSetting=function(a,d){var b=this.getMapObject(),e,f;b&&(e=this.getCurrentAreaObject(b),a?(f=this.display.sections.MapSettings.Setting.Primary.value,this.display.sections.MapSettings.Setting.Secondary.value&&
(f+=" "+this.display.sections.MapSettings.Setting.Secondary.value),this.display.sections.MapSettings.Setting.Tertiary.value&&(f+=" "+this.display.sections.MapSettings.Setting.Tertiary.value),e.setting=f):(f=e.setting.split(" "),this.display.sections.MapSettings.Setting.Primary.value=f[0],this.display.sections.MapSettings.Setting.Secondary.value=f[1],this.display.sections.MapSettings.Setting.Tertiary.value=f[2]),this.setTextareaValue(this.stringifySmart(b),!0),this.setDisplayMap(!0),this.resetCurrentThings(d))};
b.prototype.setLocationArea=function(){var a=this.getMapObject(),d;a&&(d=this.getCurrentLocationObject(a),d.area=this.getCurrentArea(),this.setTextareaValue(this.stringifySmart(a),!0),this.setDisplayMap(!0))};b.prototype.setMapEntry=function(a){var d=this.getMapObject(),b,e;d&&(b=this.getCurrentLocationObject(d),a?(e=this.display.sections.MapSettings.Entry.value,b.entry=e):this.display.sections.MapSettings.Entry.value=e,this.setTextareaValue(this.stringifySmart(d),!0),this.setDisplayMap(!0))};b.prototype.setCurrentLocation=
function(){var a=this.getMapObject(),b;a&&(b=this.getCurrentLocationObject(a),this.display.sections.MapSettings.Area.value=b.area?b.area.toString():"0",this.setTextareaValue(this.stringifySmart(a),!0),this.setDisplayMap(!0))};b.prototype.addLocationToMap=function(){var a=this.display.sections.MapSettings.Location.options.length.toString(),b=this.getMapObject();b&&(b.locations[a]={entry:this.mapEntrances[0]},this.resetAllVisualOptionSelects("VisualOptionLocation",Object.keys(b.locations)),this.setTextareaValue(this.stringifySmart(b),
!0),this.setDisplayMap(!0))};b.prototype.addAreaToMap=function(){var a=this.display.sections.MapSettings.Area.options.length.toString(),b=this.getMapObject();b&&(b.areas[a]={setting:this.mapSettingDefault,creation:[]},this.resetAllVisualOptionSelects("VisualOptionArea",Object.keys(b.areas)),this.setTextareaValue(this.stringifySmart(b),!0),this.setDisplayMap(!0))};b.prototype.resetAllVisualOptionSelects=function(a,b){var c=this.getMapObject(),e=this.display.container.getElementsByClassName(a),f={children:b.map(function(a){return new Option(a,
a)})},g,h;if(c)for(h=0;h<e.length;h+=1)c=e[h],g=c.value,c.textContent="",this.GameStarter.proliferateElement(c,f),c.value=g};b.prototype.getMapObject=function(){var a;try{a=this.parseSmart(this.display.stringer.textarea.value),this.display.stringer.messenger.textContent="",this.display.namer.value=a.name||this.mapNameDefault}catch(b){this.setSectionJSON(),this.display.stringer.messenger.textContent=b.message}return a};b.prototype.getMapObjectAndTry=function(a){var b=this.getMapName()+"::Temporary",
c=this.getMapObject();if(c){try{this.GameStarter.MapsCreator.storeMap(b,c),this.GameStarter.MapsCreator.getMap(b),this.setDisplayMap(!0)}catch(e){this.display.stringer.messenger.textContent=e.message}a&&a.stopPropagation()}};b.prototype.getCurrentArea=function(){return this.display.sections.MapSettings.Area.value};b.prototype.getCurrentAreaObject=function(a){void 0===a&&(a=this.getMapObject());var b=a.locations[this.getCurrentLocation()].area;return a.areas[b?b.toString():"0"]};b.prototype.getCurrentLocation=
function(){return this.display.sections.MapSettings.Location.value};b.prototype.getCurrentLocationObject=function(a){return a.locations[this.getCurrentLocation()]};b.prototype.addMapCreationThing=function(a,b){var c=this.getMapObject(),e=this.GameStarter.proliferate({thing:this.currentTitle,x:this.getNormalizedX(a)+this.GameStarter.MapScreener.left/this.GameStarter.unitsize,y:this.getNormalizedY(b)},this.currentArgs);if(!c)return!1;c.areas[this.getCurrentArea()].creation.push(e);this.setTextareaValue(this.stringifySmart(c),
!0);return!0};b.prototype.addMapCreationMacro=function(a,b){var c=this.getMapObject(),e=this.GameStarter.proliferate({macro:this.currentTitle,x:this.getNormalizedX(a)+this.GameStarter.MapScreener.left/this.GameStarter.unitsize,y:this.getNormalizedY(b)},this.generateCurrentArgs());if(!c)return!1;c.areas[this.getCurrentArea()].creation.push(e);this.setTextareaValue(this.stringifySmart(c),!0);return!0};b.prototype.resetDisplay=function(){this.display={container:this.GameStarter.createElement("div",{className:"LevelEditor",
onclick:this.cancelEvent.bind(this),ondragenter:this.handleDragEnter.bind(this),ondragover:this.handleDragOver.bind(this),ondrop:this.handleDragDrop.bind(this)}),scrollers:{},stringer:{},sections:{ClickToPlace:{},MapSettings:{Setting:{}},buttons:{ClickToPlace:{}}}};this.resetDisplayScrollers();this.resetDisplayGui();this.resetDisplayHead();this.resetDisplaySectionChoosers();this.resetDisplayOptionsList();this.resetDisplayMapSettings();setTimeout(this.resetDisplayThinCheck.bind(this))};b.prototype.resetDisplayThinCheck=
function(){var a=this.display.gui.clientWidth;385>=a?this.display.container.className+=" thin":560<=a&&(this.display.container.className+=" thick")};b.prototype.resetDisplayGui=function(){this.display.gui=this.GameStarter.createElement("div",{className:"EditorGui"});this.display.container.appendChild(this.display.gui)};b.prototype.resetDisplayScrollers=function(){this.display.scrollers={left:this.GameStarter.createElement("div",{className:"EditorScroller EditorScrollerLeft",onmousedown:this.onMouseDownScrolling.bind(this,
2*-this.GameStarter.unitsize),onmouseup:this.onMouseUpScrolling.bind(this),onmouseout:this.onMouseUpScrolling.bind(this),onclick:this.cancelEvent.bind(this),innerText:"<",style:{opacity:.14}}),right:this.GameStarter.createElement("div",{className:"EditorScroller EditorScrollerRight",onmousedown:this.onMouseDownScrolling.bind(this,2*this.GameStarter.unitsize),onmouseup:this.onMouseUpScrolling.bind(this),onmouseout:this.onMouseUpScrolling.bind(this),onclick:this.cancelEvent.bind(this),innerText:">"}),
container:this.GameStarter.createElement("div",{className:"EditorScrollers",onmousemove:this.onMouseMoveEditing.bind(this),onclick:this.onClickEditingThing.bind(this)})};this.display.scrollers.container.appendChild(this.display.scrollers.left);this.display.scrollers.container.appendChild(this.display.scrollers.right);this.display.container.appendChild(this.display.scrollers.container)};b.prototype.resetDisplayHead=function(){this.display.minimizer=this.GameStarter.createElement("div",{className:"EditorHeadButton EditorMinimizer",
onclick:this.minimize.bind(this),textContent:"-"});this.display.head=this.GameStarter.createElement("div",{className:"EditorHead",children:[this.GameStarter.createElement("div",{className:"EditorNameContainer",children:[this.display.namer=this.GameStarter.createElement("input",{className:"EditorNameInput",type:"text",placeholder:this.mapNameDefault,value:this.mapNameDefault,onkeyup:this.setMapName.bind(this),onchange:this.setMapName.bind(this)})]}),this.display.minimizer,this.GameStarter.createElement("div",
{className:"EditorHeadButton EditorCloser",textContent:"X",onclick:this.disable.bind(this)})]});this.display.gui.appendChild(this.display.head)};b.prototype.resetDisplaySectionChoosers=function(){var a=this.GameStarter.createElement("div",{className:"EditorSectionChoosers",onclick:this.cancelEvent.bind(this),children:[this.display.sections.buttons.ClickToPlace.container=this.GameStarter.createElement("div",{className:"EditorMenuOption EditorSectionChooser EditorMenuOptionThird",style:{background:"white"},
textContent:"Visual",onclick:this.setSectionClickToPlace.bind(this)}),this.display.sections.buttons.MapSettings=this.GameStarter.createElement("div",{className:"EditorMenuOption EditorSectionChooser EditorMenuOptionThird",style:{background:"gray"},textContent:"Map",onclick:this.setSectionMapSettings.bind(this)}),this.display.sections.buttons.JSON=this.GameStarter.createElement("div",{className:"EditorMenuOption EditorSectionChooser EditorMenuOptionThird",style:{background:"gray"},textContent:"JSON",
onclick:this.setSectionJSON.bind(this)})]});this.display.gui.appendChild(a)};b.prototype.resetDisplayOptionsList=function(){this.display.sections.ClickToPlace.container=this.GameStarter.createElement("div",{className:"EditorOptionsList EditorSectionMain",onclick:this.cancelEvent.bind(this)});this.resetDisplayOptionsListSubOptionsMenu();this.resetDisplayOptionsListSubOptions();this.display.gui.appendChild(this.display.sections.ClickToPlace.container)};b.prototype.resetDisplayOptionsListSubOptionsMenu=
function(){var a=this.GameStarter.createElement("div",{className:"EditorSubOptionsListsMenu"});this.display.sections.buttons.ClickToPlace.Things=this.GameStarter.createElement("div",{className:"EditorMenuOption EditorSubOptionsListChooser EditorMenuOptionHalf",textContent:"Things",onclick:this.setSectionClickToPlaceThings.bind(this),style:{background:"#CCC"}});this.display.sections.buttons.ClickToPlace.Macros=this.GameStarter.createElement("div",{className:"EditorMenuOption EditorSubOptionsListChooser EditorMenuOptionHalf",
textContent:"Macros",onclick:this.setSectionClickToPlaceMacros.bind(this),style:{background:"#777"}});a.appendChild(this.display.sections.buttons.ClickToPlace.Things);a.appendChild(this.display.sections.buttons.ClickToPlace.Macros);this.display.sections.ClickToPlace.container.appendChild(a)};b.prototype.resetDisplayMapSettings=function(){this.display.sections.MapSettings.container=this.GameStarter.createElement("div",{className:"EditorMapSettings EditorSectionMain",onclick:this.cancelEvent.bind(this),
style:{display:"none"},children:[this.GameStarter.createElement("div",{className:"EditorMenuOption",textContent:"+ Add Area",onclick:this.addAreaToMap.bind(this)}),this.GameStarter.createElement("div",{className:"EditorMenuOption",textContent:"+ Add Location",onclick:this.addLocationToMap.bind(this)})]});this.resetDisplayMapSettingsCurrent();this.resetDisplayMapSettingsMap();this.resetDisplayMapSettingsArea();this.resetDisplayMapSettingsLocation();this.resetDisplayJSON();this.resetDisplayVisualContainers();
this.resetDisplayButtons();this.display.gui.appendChild(this.display.sections.MapSettings.container)};b.prototype.resetDisplayMapSettingsCurrent=function(){this.display.sections.MapSettings.container.appendChild(this.GameStarter.createElement("div",{className:"EditorMapSettingsSubGroup",children:[this.GameStarter.createElement("label",{textContent:"Current Location"}),this.display.sections.MapSettings.Location=this.createSelect(["0"],{className:"VisualOptionLocation",onchange:this.setCurrentLocation.bind(this)})]}))};
b.prototype.resetDisplayMapSettingsMap=function(){this.display.sections.MapSettings.container.appendChild(this.GameStarter.createElement("div",{className:"EditorMapSettingsGroup",children:[this.GameStarter.createElement("h4",{textContent:"Map"}),this.GameStarter.createElement("div",{className:"EditorMapSettingsSubGroup",children:[this.GameStarter.createElement("label",{className:"EditorMapSettingsLabel",textContent:"Time"}),this.display.sections.MapSettings.Time=this.createSelect("100 200 300 400 500 1000 Infinity".split(" "),
{value:this.mapTimeDefault.toString(),onchange:this.setMapTime.bind(this,!0)})]})]}))};b.prototype.resetDisplayMapSettingsArea=function(){this.display.sections.MapSettings.container.appendChild(this.GameStarter.createElement("div",{className:"EditorMapSettingsGroup",children:[this.GameStarter.createElement("h4",{textContent:"Area"}),this.GameStarter.createElement("div",{className:"EditorMapSettingsSubGroup",children:[this.GameStarter.createElement("label",{textContent:"Setting"}),this.display.sections.MapSettings.Setting.Primary=
this.createSelect(["Overworld","Underworld","Underwater","Castle"],{onchange:this.setMapSetting.bind(this,!0)}),this.display.sections.MapSettings.Setting.Secondary=this.createSelect(["","Night","Underwater","Alt"],{onchange:this.setMapSetting.bind(this,!0)}),this.display.sections.MapSettings.Setting.Tertiary=this.createSelect(["","Night","Underwater","Alt"],{onchange:this.setMapSetting.bind(this,!0)})]})]}))};b.prototype.resetDisplayMapSettingsLocation=function(){this.display.sections.MapSettings.container.appendChild(this.GameStarter.createElement("div",
{className:"EditorMapSettingsGroup",children:[this.GameStarter.createElement("h4",{textContent:"Location"}),this.GameStarter.createElement("div",{className:"EditorMapSettingsSubGroup",children:[this.GameStarter.createElement("label",{textContent:"Area"}),this.display.sections.MapSettings.Area=this.createSelect(["0"],{className:"VisualOptionArea",onchange:this.setLocationArea.bind(this,!0)})]}),this.GameStarter.createElement("div",{className:"EditorMapSettingsSubGroup",children:[this.GameStarter.createElement("label",
{textContent:"Entrance"}),this.display.sections.MapSettings.Entry=this.createSelect(this.mapEntrances,{onchange:this.setMapEntry.bind(this,!0)})]})]}))};b.prototype.resetDisplayJSON=function(){this.display.sections.JSON=this.GameStarter.createElement("div",{className:"EditorJSON EditorSectionMain",onclick:this.cancelEvent.bind(this),style:{display:"none"},children:[this.display.stringer.textarea=this.GameStarter.createElement("textarea",{className:"EditorJSONInput",spellcheck:!1,onkeyup:this.getMapObjectAndTry.bind(this),
onchange:this.getMapObjectAndTry.bind(this),onkeydown:function(a){a.stopPropagation()}}),this.display.stringer.messenger=this.GameStarter.createElement("div",{className:"EditorJSONInfo"})]});this.display.gui.appendChild(this.display.sections.JSON)};b.prototype.resetDisplayVisualContainers=function(){this.display.sections.ClickToPlace.VisualOptions=this.GameStarter.createElement("div",{textContent:"Click an icon to view options.",className:"EditorVisualOptions",onclick:this.cancelEvent.bind(this)});
this.display.gui.appendChild(this.display.sections.ClickToPlace.VisualOptions)};b.prototype.resetDisplayButtons=function(){var a=this;this.display.gui.appendChild(this.GameStarter.createElement("div",{className:"EditorMenu",onclick:this.cancelEvent.bind(this),children:function(b){return Object.keys(b).map(function(c){return a.GameStarter.createElement("div",{className:"EditorMenuOption EditorMenuOptionFifth EditorMenuOption-"+c,textContent:c,onclick:b[c][0].bind(a),children:b[c][1]})})}({Build:[this.startBuilding.bind(this)],
Play:[this.startPlaying.bind(this)],Save:[this.downloadCurrentJSON.bind(this)],Load:[this.loadCurrentJSON.bind(this),this.display.inputDummy=this.GameStarter.createElement("input",{type:"file",style:{display:"none"},onchange:this.handleUploadStart.bind(this)})],Reset:[this.resetDisplayMap.bind(this)]})}))};b.prototype.resetDisplayOptionsListSubOptions=function(){this.resetDisplayOptionsListSubOptionsThings();this.resetDisplayOptionsListSubOptionsMacros()};b.prototype.resetDisplayOptionsListSubOptionsThings=
function(){var a=this,b=this.getPrethingSizeArguments.bind(this),c=this.onThingIconClick;this.display.sections.ClickToPlace.Things&&this.display.sections.ClickToPlace.container.removeChild(this.display.sections.ClickToPlace.Things);this.display.sections.ClickToPlace.Things=this.GameStarter.createElement("div",{className:"EditorSectionSecondary EditorOptions EditorOptions-Things",style:{display:"block"},children:function(){var e=0,f=Object.keys(a.prethings).map(function(e){var f=a.prethings[e],g=Object.keys(f).map(function(g){var k=
a.GameStarter.ObjectMaker.make(g,b(f[g])),m=a.GameStarter.createElement("div",{className:"EditorListOption",options:a.prethings[e][g].options,children:[k.canvas],onclick:c.bind(a,g)}),n=(70-k.width*a.GameStarter.unitsize)/2,p=(70-k.height*a.GameStarter.unitsize)/2;m.setAttribute("name",g);k.canvas.style.top=p+"px";k.canvas.style.right=n+"px";k.canvas.style.bottom=p+"px";k.canvas.style.left=n+"px";a.GameStarter.PixelDrawer.setThingSprite(k);return m});return a.GameStarter.createElement("div",{className:"EditorOptionContainer",
style:{display:"none"},children:g})}),g=a.createSelect(Object.keys(a.prethings),{className:"EditorOptionContainerSwitchers",onchange:function(){f[e+1].style.display="none";f[g.selectedIndex+1].style.display="block";e=g.selectedIndex}});f[0].style.display="block";f.unshift(g);return f}()});this.display.sections.ClickToPlace.container.appendChild(this.display.sections.ClickToPlace.Things)};b.prototype.resetDisplayOptionsListSubOptionsMacros=function(){var a=this;this.display.sections.ClickToPlace.Macros&&
this.display.sections.ClickToPlace.container.removeChild(this.display.sections.ClickToPlace.Macros);a.display.sections.ClickToPlace.Macros=a.GameStarter.createElement("div",{className:"EditorSectionSecondary EditorOptions EditorOptions-Macros",style:{display:"none"},children:Object.keys(a.macros).map(function(b){var c=a.macros[b];return a.GameStarter.createElement("div",{className:"EditorOptionContainer",children:[a.GameStarter.createElement("div",{className:"EditorOptionTitle EditorMenuOption",textContent:b,
onclick:a.onMacroIconClick.bind(a,b,c.description,c.options)})]})})});this.display.sections.ClickToPlace.container.appendChild(this.display.sections.ClickToPlace.Macros)};b.prototype.setSectionClickToPlace=function(){this.display.sections.ClickToPlace.VisualOptions.style.display="block";this.display.sections.ClickToPlace.container.style.display="block";this.display.sections.MapSettings.container.style.display="none";this.display.sections.JSON.style.display="none";this.display.sections.buttons.ClickToPlace.container.style.backgroundColor=
"white";this.display.sections.buttons.MapSettings.style.background="gray";this.display.sections.buttons.JSON.style.background="gray";"Thing"!==this.currentClickMode&&"Macro"!==this.currentClickMode&&this.display.sections.buttons.ClickToPlace.Things.click()};b.prototype.setSectionMapSettings=function(a){this.setCurrentClickMode("Map",a);this.display.sections.ClickToPlace.VisualOptions.style.display="none";this.display.sections.ClickToPlace.container.style.display="none";this.display.sections.MapSettings.container.style.display=
"block";this.display.sections.JSON.style.display="none";this.display.sections.buttons.ClickToPlace.container.style.background="gray";this.display.sections.buttons.MapSettings.style.background="white";this.display.sections.buttons.JSON.style.background="gray"};b.prototype.setSectionJSON=function(a){this.setCurrentClickMode("JSON",a);this.display.sections.ClickToPlace.VisualOptions.style.display="none";this.display.sections.ClickToPlace.container.style.display="none";this.display.sections.MapSettings.container.style.display=
"none";this.display.sections.JSON.style.display="block";this.display.sections.buttons.ClickToPlace.container.style.background="gray";this.display.sections.buttons.MapSettings.style.background="gray";this.display.sections.buttons.JSON.style.background="white"};b.prototype.setSectionClickToPlaceThings=function(a){this.setCurrentClickMode("Thing",a);this.display.container.onclick=this.onClickEditingThing.bind(this);this.display.scrollers.container.onclick=this.onClickEditingThing.bind(this);this.display.sections.ClickToPlace.VisualOptions.style.display=
"block";this.display.sections.ClickToPlace.Things.style.display="block";this.display.sections.ClickToPlace.Macros.style.display="none";this.display.sections.buttons.ClickToPlace.Things.style.background="#CCC";this.display.sections.buttons.ClickToPlace.Macros.style.background="#777"};b.prototype.setSectionClickToPlaceMacros=function(a){this.setCurrentClickMode("Macro",a);this.display.container.onclick=this.onClickEditingMacro.bind(this);this.display.scrollers.container.onclick=this.onClickEditingMacro.bind(this);
this.display.sections.ClickToPlace.VisualOptions.style.display="block";this.display.sections.ClickToPlace.Things.style.display="none";this.display.sections.ClickToPlace.Macros.style.display="block";this.display.sections.buttons.ClickToPlace.Things.style.background="#777";this.display.sections.buttons.ClickToPlace.Macros.style.background="#CCC"};b.prototype.setTextareaValue=function(a,b){void 0===b&&(b=!1);this.display.stringer.textarea.value=b?this.beautifier(a):a};b.prototype.beautifyTextareaValue=
function(){this.display.stringer.textarea.value=this.beautifier(this.display.stringer.textarea.value)};b.prototype.setVisualOptions=function(a,b,c){var e=this.display.sections.ClickToPlace.VisualOptions,f=this.createVisualOption.bind(this),g=this;e.textContent="";e.appendChild(this.GameStarter.createElement("h3",{className:"VisualOptionName",textContent:a.replace(/([A-Z][a-z])/g," $1")}));b&&e.appendChild(this.GameStarter.createElement("div",{className:"VisualOptionDescription",textContent:b}));c&&
e.appendChild(g.GameStarter.createElement("div",{className:"VisualOptionsList",children:Object.keys(c).map(function(a){return g.GameStarter.createElement("div",{className:"VisualOption",children:[g.GameStarter.createElement("div",{className:"VisualOptionLabel",textContent:a}),f(c[a])]})})}))};b.prototype.createVisualOption=function(a){a=this.createVisualOptionObject(a);switch(a.type){case "Boolean":return this.createVisualOptionBoolean();case "Number":return this.createVisualOptionNumber(a);case "Select":return this.createVisualOptionSelect(a);
case "String":return this.createVisualOptionString(a);case "Location":return this.createVisualOptionLocation(a);case "Area":return this.createVisualOptionArea(a);case "Everything":return this.createVisualOptionEverything(a);default:throw Error("Unknown type requested: '"+a.type+"'.");}};b.prototype.createVisualOptionObject=function(a){switch(a.constructor){case Number:a={type:"Number",mod:a};break;case String:a={type:a};break;case Array:a={type:"Select",options:a};break}return a};b.prototype.createVisualOptionBoolean=
function(){var a=this.createSelect(["false","true"],{className:"VisualOptionValue",onkeyup:this.setCurrentArgs.bind(this),onchange:this.setCurrentArgs.bind(this)});a.setAttribute("data:type","Boolean");return a};b.prototype.createVisualOptionNumber=function(a){var b=this;return this.GameStarter.createElement("div",{className:"VisualOptionHolder",children:function(){var c=a.mod||1,e=b.GameStarter.createElement("input",{type:"Number","data:type":"Number",value:void 0===a.value?1:a.value,className:"VisualOptionValue modReal"+
c,onkeyup:b.setCurrentArgs.bind(b),onchange:b.setCurrentArgs.bind(b)}),f=1<c&&b.GameStarter.createElement("div",{className:"VisualOptionRecommendation",textContent:"x"+a.mod}),g=[e];e.setAttribute("data:mod",c.toString());e.setAttribute("data:type","Number");e.setAttribute("typeReal","Number");if(a.Infinite){var h=void 0,l=b.createSelect(["Number","Infinite"],{className:"VisualOptionInfiniter",onchange:function(a){"Number"===l.value?(e.type="Number",e.disabled=!1,e.style.display="",f&&(f.style.display=
""),e.value=h):(e.type="Text",e.disabled=!0,e.style.display="none",f&&(f.style.display="none"),h=e.value,e.value="Infinity");e.onchange(a)}});Infinity===a.value&&(l.value="Infinite",l.onchange(void 0));g.push(l)}f&&g.push(f);return g}()})};b.prototype.createVisualOptionSelect=function(a){a=this.createSelect(a.options,{className:"VisualOptionValue","data:type":"Select",onkeyup:this.setCurrentArgs.bind(this),onchange:this.setCurrentArgs.bind(this)});a.setAttribute("data:type","Select");return a};b.prototype.createVisualOptionString=
function(a){a=this.createSelect(a.options,{className:"VisualOptionValue","data:type":"String",onkeyup:this.setCurrentArgs.bind(this),onchange:this.setCurrentArgs.bind(this)});a.setAttribute("data:type","String");return a};b.prototype.createVisualOptionLocation=function(a){a=this.getMapObject();if(!a)return this.GameStarter.createElement("div",{className:"VisualOptionValue VisualOptionLocation EditorComplaint",text:"Fix map compilation to get locations!"});a=Object.keys(a.locations);a.unshift(this.keyUndefined);
a=this.createSelect(a,{className:"VisualOptionValue VisualOptionLocation","data-type":"String",onkeyup:this.setCurrentArgs.bind(this),onchange:this.setCurrentArgs.bind(this)});a.setAttribute("data-type","String");return a};b.prototype.createVisualOptionArea=function(a){a=this.getMapObject();if(!a)return this.GameStarter.createElement("div",{className:"VisualOptionValue VisualOptionArea EditorComplaint",text:"Fix map compilation to get areas!"});a=Object.keys(a.areas);a.unshift(this.keyUndefined);
a=this.createSelect(a,{className:"VisualOptionValue VisualOptionArea","data-type":"String",onkeyup:this.setCurrentArgs.bind(this),onchange:this.setCurrentArgs.bind(this)});a.setAttribute("data-type","String");return a};b.prototype.createVisualOptionEverything=function(a){a=this.createSelect(Object.keys(this.things),{className:"VisualOptionValue VisualOptionEverything","data-type":"String",onkeyup:this.setCurrentArgs.bind(this),onchange:this.setCurrentArgs.bind(this)});a.setAttribute("data-type","String");
return a};b.prototype.resetDisplayMap=function(){this.setTextareaValue(this.stringifySmart(this.mapDefault),!0);this.setDisplayMap(!0)};b.prototype.setDisplayMap=function(a){var b=this.display.stringer.textarea.value,c=this.getMapName(),e;try{e=this.parseSmart(b),this.setTextareaValue(this.display.stringer.textarea.value)}catch(f){this.setSectionJSON();this.display.stringer.messenger.textContent=f.message;return}try{this.GameStarter.MapsCreator.storeMap(c,e),this.GameStarter.MapsCreator.getMap(c)}catch(f){this.setSectionJSON();
this.display.stringer.messenger.textContent=f.message;return}this.display.stringer.messenger.textContent="";this.setTextareaValue(this.display.stringer.textarea.value);this.GameStarter.setMap(c,this.getCurrentLocation());this.resetDisplayOptionsListSubOptionsThings();a&&this.disableAllThings()};b.prototype.getMapName=function(){return this.display.namer.value||this.mapNameDefault};b.prototype.roundTo=function(a,b){return Math.round(a/b)*b};b.prototype.stringifySmart=function(a){void 0===a&&(a={});
return JSON.stringify(a,this.jsonReplacerSmart)};b.prototype.parseSmart=function(a){a=JSON.parse(a,this.jsonReplacerSmart);var b=a.areas,c;for(c in b)b.hasOwnProperty(c)&&(b[c].editor=!0);return a};b.prototype.jsonReplacerSmart=function(a,b){return b!==b?"NaN":Infinity===b?"Infinity":-Infinity===b?"-Infinity":b};b.prototype.disableThing=function(a,b){void 0===b&&(b=1);a.movement=void 0;a.nofall=!0;a.nocollide=!0;a.outerok=2;a.xvel=0;a.yvel=0;a.opacity=b};b.prototype.disableAllThings=function(){var a=
this,b=this.GameStarter.GroupHolder.getGroups(),c;for(c in b)b.hasOwnProperty(c)&&b[c].forEach(function(b){a.disableThing(b)});this.GameStarter.TimeHandler.cancelAllEvents()};b.prototype.addThingAndDisableEvents=function(a,b,c){b=this.roundTo(b,this.GameStarter.scale);c=this.roundTo(c,this.GameStarter.scale);this.GameStarter.addThing(a,b,c);this.disableThing(a);this.GameStarter.TimeHandler.cancelAllEvents();if(a.hasOwnProperty("hidden")&&a.hidden||0===a.opacity)a.hidden=!1,a.opacity=.35};b.prototype.clearAllThings=
function(){var a=this,b=this.GameStarter.GroupHolder.getGroups(),c;for(c in b)b.hasOwnProperty(c)&&b[c].forEach(function(b){a.GameStarter.killNormal(b)})};b.prototype.getNormalizedX=function(a){return a/this.GameStarter.unitsize};b.prototype.getNormalizedY=function(a){return this.GameStarter.MapScreener.floor-a/this.GameStarter.unitsize+3*this.GameStarter.unitsize};b.prototype.getNormalizedThingArguments=function(a){a=this.GameStarter.proliferate({},a);Infinity===a.height&&(a.height=this.GameStarter.MapScreener.height);
Infinity===a.width&&(a.width=this.GameStarter.MapScreener.width);return a};b.prototype.getNormalizedMouseEventCoordinates=function(a,b){var c=this.roundTo(a.x||a.clientX||0,this.blocksize),e=this.roundTo(a.y||a.clientY||0,this.blocksize),f;b&&(f=this.things[this.currentTitle],f.offsetLeft&&(c+=f.offsetLeft*this.GameStarter.unitsize),f.offsetTop&&(e+=f.offsetTop*this.GameStarter.unitsize));return[c,e]};b.prototype.getPrethingSizeArguments=function(a){var b={},c=this.getPrethingSizeArgument(a.width);
a=this.getPrethingSizeArgument(a.height);c&&(b.width=c);a&&(b.height=a);return b};b.prototype.getPrethingSizeArgument=function(a){if(a){if(a.real)return a.real;var b=a.value||1;a=a.mod||1;return isFinite(b)?b*a:a||8}};b.prototype.createSelect=function(a,b){var c=this.GameStarter.createElement("select",b),e;for(e=0;e<a.length;e+=1)c.appendChild(this.GameStarter.createElement("option",{value:a[e],textContent:a[e]}));"undefined"!==typeof b.value&&(c.value=b.value);this.applyElementAttributes(c,b);return c};
b.prototype.applyElementAttributes=function(a,b){for(var c in b)b.hasOwnProperty(c)&&0===c.indexOf("data:")&&a.setAttribute(c,b[c])};b.prototype.downloadFile=function(a,b){var c=this.GameStarter.createElement("a",{download:a,href:"data:text/json;charset=utf-8,"+encodeURIComponent(b)});this.display.container.appendChild(c);c.click();this.display.container.removeChild(c);return c};b.prototype.killCurrentPreThings=function(){for(var a=0;a<this.currentPreThings.length-1;a+=1)this.GameStarter.killNormal(this.currentPreThings[a].thing)};
b.prototype.handleUploadStart=function(a){var b;this.cancelEvent(a);a&&a.dataTransfer?a=a.dataTransfer.files[0]:(a=this.display.inputDummy.files[0],new FileReader);a&&(b=new FileReader,b.onloadend=this.handleUploadCompletion.bind(this),b.readAsText(a))};b.prototype.handleDragEnter=function(a){this.setSectionJSON()};b.prototype.handleDragOver=function(a){this.cancelEvent(a)};b.prototype.handleDragDrop=function(a){this.handleUploadStart(a)};b.prototype.cancelEvent=function(a){a&&("function"===typeof a.preventDefault&&
a.preventDefault(),"function"===typeof a.stopPropagation&&a.stopPropagation(),a.cancelBubble=!0)};b.prototype.createPageStyles=function(){return{".LevelEditor":{position:"absolute",top:"0",right:"0",bottom:"0",left:"0"},".LevelEditor h4":{margin:"14px 0 7px 0"},".LevelEditor select, .LevelEditor input":{margin:"7px",padding:"3px 7px","font-size":"1.17em"},".LevelEditor .EditorGui":{position:"absolute",top:"0",right:"0",bottom:"0",width:"50%",background:"rgba(0, 7, 14, .84)",overflow:"hidden","user-select":"none",
"box-sizing":"border-box","z-index":"70",transition:"117ms all"},".LevelEditor .EditorMenuContainer":{position:"absolute",top:"0",right:"0",bottom:"0",width:"50%",background:"rgba(0, 7, 14, .84)",overflow:"hidden","user-select":"none","box-sizing":"border-box","z-index":"70",transition:"117ms all"},".LevelEditor .EditorScrollers":{position:"absolute",top:"0",right:"50%",bottom:"0",left:"0",transition:"117ms all"},".EditorScroller":{position:"absolute",top:"50%","margin-top":"-35px",width:"70px",cursor:"pointer",
"box-sizing":"border-box","font-size":"70px","text-align":"center",transition:"280ms all"},".EditorScrollerRight":{right:"0","padding-left":".084em"},".EditorScrollerLeft":{left:"0"},".LevelEditor.minimized .EditorGui":{width:"117px"},".LevelEditor.minimized .EditorMenuContainer":{width:"117px"},".LevelEditor.minimized .EditorScrollers":{right:"117px","padding-right":"117px"},".LevelEditor .EditorHead":{position:"relative",height:"35px"},".LevelEditor .EditorHead .EditorNameContainer":{position:"absolute",
top:"1px",right:"73px",left:"2px",height:"35px"},".LevelEditor .EditorHead .EditorNameInput":{display:"block",margin:"0",padding:"3px 7px",width:"100%",background:"white",border:"1px solid black","font-size":"1.4em","box-sizing":"border-box"},".LevelEditor .EditorHead .EditorHeadButton":{position:"absolute",top:"2px",width:"32px",height:"32px",background:"rgb(35,35,35)",border:"1px solid silver","box-sizing":"border-box","text-align":"center","padding-top":"7px",cursor:"pointer"},".LevelEditor .EditorHead .EditorMinimizer":{right:"38px"},
".LevelEditor .EditorHead .EditorCloser":{right:"3px"},".LevelEditor .EditorSectionChooser":{width:"50%","box-sizing":"border-box",height:"35px",background:"white",border:"3px solid black",color:"black",cursor:"pointer"},".LevelEditor .EditorSectionChooser.Inactive":{background:"gray"},".LevelEditor.minimized .EditorSectionChoosers":{opacity:"0"},".LevelEditor .EditorSectionMain":{position:"absolute",top:"70px",right:"0",bottom:"35px",left:"0","overflow-y":"auto"},".LevelEditor.minimized .EditorSectionMain":{display:"none"},
".LevelEditor .EditorSectionSecondary":{position:"absolute",top:"35px",right:"203px",bottom:"0px",left:"0","min-width":"182px","overflow-y":"auto","overflow-x":"hidden"},".LevelEditor .EditorJSON":{"font-family":"Courier"},".LevelEditor .EditorJSONInput":{display:"block",width:"100%",height:"84%",background:"rgba(0, 3, 7, .91)",color:"rgba(255, 245, 245, .91)","box-sizing":"border-box","overflow-y":"auto",resize:"none"},".LevelEditor .EditorJSONInfo":{height:"1.75em",padding:"3px 7px"},".LevelEditor.minimized .EditorJSON":{opacity:"0"},
".LevelEditor .EditorOptions, .LevelEditor .EditorOptionContainer":{"padding-left":"3px",clear:"both"},".LevelEditor.minimized .EditorOptionsList":{opacity:"0"},".LevelEditor .EditorListOption":{position:"relative","float":"left",margin:"0 7px 7px 0",width:"70px",height:"70px",background:"rgba(77, 77, 77, .7)",border:"2px solid black",overflow:"hidden",cursor:"pointer"},".LevelEditor .EditorListOption canvas":{position:"absolute"},".LevelEditor .EditorVisualOptions":{position:"absolute",top:"105px",
right:"0",bottom:"35px",padding:"7px 11px",width:"203px","border-left":"1px solid silver",background:"rgba(0, 7, 14, .84)","overflow-x":"visible","overflow-y":"auto","line-height":"140%",opacity:"1","box-sizing":"border-box",transition:"117ms opacity, 70ms left"},".LevelEditor.thin .EditorVisualOptions":{left:"185px"},".LevelEditor.thin .EditorVisualOptions:hover":{left:"70px",right:"0",width:"auto","overflow-x":"hidden"},".LevelEditor.thick .EditorVisualOptions":{width:"350px"},".LevelEditor.thick .EditorSectionSecondary":{right:"350px"},
".LevelEditor.minimized .EditorVisualOptions":{left:"100%"},".LevelEditor .EditorVisualOptions .VisualOption":{padding:"14px 0"},".LevelEditor .EditorVisualOptions .VisualOptionName":{margin:"3px 0 7px 0"},".LevelEditor .EditorVisualOptions .VisualOptionDescription":{"padding-bottom":"14px"},".LevelEditor .EditorVisualOptions .VisualOptionValue":{"max-width":"117px"},".LevelEditor .EditorVisualOptions select.VisualOptionValue":{"max-width":"156px"},".LevelEditor .EditorVisualOptions .VisualOptionInfiniter, .LevelEditor .EditorVisualOptions .VisualOptionRecommendation":{display:"inline"},
".LevelEditor .EditorMenu":{position:"absolute",right:"0",bottom:"0",left:"0"},".LevelEditor .EditorMenuOption":{display:"inline-block",padding:"7px 14px",background:"white",border:"3px solid black","box-sizing":"border-box",color:"black","text-align":"center",overflow:"hidden",cursor:"pointer"},".LevelEditor.minimized .EditorMenuOption:not(:first-of-type)":{display:"none"},".LevelEditor.minimized .EditorMenuOption:first-of-type":{width:"auto"},".LevelEditor .EditorMenuOption:hover":{opacity:".91"},
".LevelEditor .EditorMenuOption.EditorMenuOptionHalf":{width:"50%"},".LevelEditor .EditorMenuOption.EditorMenuOptionThird":{width:"33%"},".LevelEditor .EditorMenuOption.EditorMenuOptionFifth":{width:"20%"},".LevelEditor .EditorMapSettingsGroup":{"padding-left":"7px"},".LevelEditor .EditorMapSettingsSubGroup":{"padding-left":"14px"},".LevelEditor.minimized .EditorMapSettings":{opacity:"0"}}};return b}();q.LevelEditr=r})(LevelEditr||(LevelEditr={}));
var MapsCreatr;(function(k){var l=function(){return function(c,a,b){this.thing=c;this.title=c.title;this.reference=a;this.spawned=!1;this.left=a.x||0;this.top=a.y||0;this.right=this.left+(a.width||b.getFullPropertiesOf(this.title).width);this.bottom=this.top+(a.height||b.getFullPropertiesOf(this.title).height);a.position&&(this.position=a.position)}}();k.PreThing=l})(MapsCreatr||(MapsCreatr={}));
(function(k){var l=function(){function c(a){if(!a)throw Error("No settings object given to MapsCreatr.");if(!a.ObjectMaker)throw Error("No ObjectMakr given to MapsCreatr.");if("undefined"===typeof a.ObjectMaker.getFullProperties())throw Error("MapsCreatr's ObjectMaker must store full properties.");if(!a.groupTypes)throw Error("No groupTypes given to MapsCreatr.");this.ObjectMaker=a.ObjectMaker;this.groupTypes=a.groupTypes;this.keyGroupType=a.keyGroupType||"groupType";this.keyEntrance=a.keyEntrance||
"entrance";this.macros=a.macros||{};this.scope=a.scope||this;this.entrances=a.entrances;this.requireEntrance=a.requireEntrance;this.mapsRaw={};this.maps={};a.maps&&this.storeMaps(a.maps)}c.prototype.getObjectMaker=function(){return this.ObjectMaker};c.prototype.getGroupTypes=function(){return this.groupTypes};c.prototype.getKeyGroupType=function(){return this.keyGroupType};c.prototype.getKeyEntrance=function(){return this.keyEntrance};c.prototype.getMacros=function(){return this.macros};c.prototype.getScope=
function(){return this.scope};c.prototype.getRequireEntrance=function(){return this.requireEntrance};c.prototype.getMapsRaw=function(){return this.mapsRaw};c.prototype.getMaps=function(){return this.maps};c.prototype.getMapRaw=function(a){var b=this.mapsRaw[a];if(!b)throw Error("No map found under: "+a);return b};c.prototype.getMap=function(a){var b=this.maps[a];if(!b)throw Error("No map found under: "+a);b.initialized||this.initializeMap(b);return b};c.prototype.storeMaps=function(a){for(var b in a)a.hasOwnProperty(b)&&
this.storeMap(b,a[b])};c.prototype.storeMap=function(a,b){if(!a)throw Error("Maps cannot be created with no name.");var e=this.ObjectMaker.make("Map",b);this.mapsRaw[a]=b;if(!e.areas)throw Error("Maps cannot be used with no areas: "+a);if(!e.locations)throw Error("Maps cannot be used with no locations: "+a);return this.maps[a]=e};c.prototype.getPreThings=function(a){var b=a.map,e=a.creation,f=this.createObjectFromStringArray(this.groupTypes),d;a.collections={};for(d=0;d<e.length;d+=1)this.analyzePreSwitch(e[d],
f,a,b);return this.processPreThingsArrays(f)};c.prototype.analyzePreSwitch=function(a,b,e,f){return a.macro?this.analyzePreMacro(a,b,e,f):this.analyzePreThing(a,b,e,f)};c.prototype.analyzePreMacro=function(a,b,e,f){var d=this.macros[a.macro];if(!d)throw Error("A non-existent macro is referenced: '"+a.macro+"'.");if(a=d(a,b,e,f,this.scope))if(a instanceof Array)for(d=0;d<a.length;d+=1)this.analyzePreSwitch(a[d],b,e,f);else this.analyzePreSwitch(a,b,e,f);return a};c.prototype.analyzePreThing=function(a,
b,e,f){var d=a.thing,c,g;if(!this.ObjectMaker.hasFunction(d))throw Error("A non-existent Thing type is referenced: '"+d+"'.");g=new k.PreThing(this.ObjectMaker.make(d,a),a,this.ObjectMaker);c=g.thing;if(!g.thing[this.keyGroupType])throw Error("A Thing of type '"+d+"' does not contain a "+this.keyGroupType+".");if(-1===this.groupTypes.indexOf(g.thing[this.keyGroupType]))throw Error("A Thing of type '"+d+"' contains an unknown "+this.keyGroupType+".");b[g.thing[this.keyGroupType]].push(g);!c.noBoundaryStretch&&
e.boundaries&&this.stretchAreaBoundaries(g,e);void 0!==c[this.keyEntrance]&&"object"!==typeof c[this.keyEntrance]&&"undefined"!==typeof f.locations[c[this.keyEntrance]]&&("undefined"===typeof f.locations[c[this.keyEntrance]].xloc&&(f.locations[c[this.keyEntrance]].xloc=g.left),"undefined"===typeof f.locations[c[this.keyEntrance]].yloc&&(f.locations[c[this.keyEntrance]].yloc=g.top),f.locations[c[this.keyEntrance]].entrance=g.thing);a.collectionName&&e.collections&&this.ensureThingCollection(c,a.collectionName,
a.collectionKey,e);return g};c.prototype.initializeMap=function(a){this.setMapAreas(a);this.setMapLocations(a);a.initialized=!0};c.prototype.setMapAreas=function(a){var b=a.areas,e=a.locations,c=new b.constructor,d=new e.constructor,h,g;for(g in b)b.hasOwnProperty(g)&&(h=this.ObjectMaker.make("Area",b[g]),c[g]=h,h.map=a,h.name=g,h.boundaries={top:0,right:0,bottom:0,left:0});for(g in e)if(e.hasOwnProperty(g)){b=this.ObjectMaker.make("Location",e[g]);d[g]=b;b.entryRaw=e[g].entry;b.name=g;b.area=e[g].area||
0;if(this.requireEntrance&&!this.entrances.hasOwnProperty(b.entryRaw))throw Error("Location "+g+" has unknown entry string: "+b.entryRaw);this.entrances&&b.entryRaw?b.entry=this.entrances[b.entryRaw]:b.entry&&b.entry.constructor===String&&(b.entry=this.entrances[String(b.entry)])}a.areas=c;a.locations=d};c.prototype.setMapLocations=function(a){var b=a.locations,e=new b.constructor,c,d;for(d in b)if(b.hasOwnProperty(d)&&(c=this.ObjectMaker.make("Location",b[d]),e[d]=c,c.area=a.areas[b[d].area||0],
!e[d].area))throw Error("Location "+d+" references an invalid area:"+b[d].area);a.locations=e};c.prototype.stretchAreaBoundaries=function(a,b){var e=b.boundaries;e.top=Math.min(a.top,e.top);e.right=Math.max(a.right,e.right);e.bottom=Math.max(a.bottom,e.bottom);e.left=Math.min(a.left,e.left)};c.prototype.ensureThingCollection=function(a,b,e,c){var d=c.collections[b];d||(d=c.collections[b]={});a.collection=d;d[e]=a};c.prototype.processPreThingsArrays=function(a){var b=this,c={},f;for(f in a)if(a.hasOwnProperty(f)){var d=
a[f],h={xInc:this.getArraySorted(d,this.sortPreThingsXInc),xDec:this.getArraySorted(d,this.sortPreThingsXDec),yInc:this.getArraySorted(d,this.sortPreThingsYInc),yDec:this.getArraySorted(d,this.sortPreThingsYDec),push:function(a){b.addArraySorted(h.xInc,a,b.sortPreThingsXInc);b.addArraySorted(h.xDec,a,b.sortPreThingsXDec);b.addArraySorted(h.yInc,a,b.sortPreThingsYInc);b.addArraySorted(h.yDec,a,b.sortPreThingsYDec)}};c[f]=h}return c};c.prototype.createObjectFromStringArray=function(a){var b={},c;for(c=
0;c<a.length;c+=1)b[a[c]]=[];return b};c.prototype.getArraySorted=function(a,b){var c=a.slice();c.sort(b);return c};c.prototype.addArraySorted=function(a,b,c){for(var f=0,d=a.length,h;f!==d;)h=(f+d)/2|0,0>c(b,a[h])?d=h:f=h+1;f===d&&a.splice(f,0,b)};c.prototype.sortPreThingsXInc=function(a,b){return a.left===b.left?a.top-b.top:a.left-b.left};c.prototype.sortPreThingsXDec=function(a,b){return b.right===a.right?b.bottom-a.bottom:b.right-a.right};c.prototype.sortPreThingsYInc=function(a,b){return a.top===
b.top?a.left-b.left:a.top-b.top};c.prototype.sortPreThingsYDec=function(a,b){return b.bottom===a.bottom?b.right-a.right:b.bottom-a.bottom};return c}();k.MapsCreatr=l})(MapsCreatr||(MapsCreatr={}));
var MapScreenr;
(function(c){var d=function(){function b(a){if("undefined"===typeof a)throw Error("No settings object given to MapScreenr.");if("undefined"===typeof a.width)throw Error("No width given to MapScreenr.");if("undefined"===typeof a.height)throw Error("No height given to MapScreenr.");for(var b in a)a.hasOwnProperty(b)&&(this[b]=a[b]);this.variables=a.variables||{};this.variableArgs=a.variableArgs||[]}b.prototype.clearScreen=function(){this.top=this.left=0;this.right=this.width;this.bottom=this.height;
this.setMiddleX();this.setMiddleY();this.setVariables()};b.prototype.setMiddleX=function(){this.middleX=(this.left+this.right)/2};b.prototype.setMiddleY=function(){this.middleY=(this.top+this.bottom)/2};b.prototype.setVariables=function(){for(var a in this.variables)this.variables.hasOwnProperty(a)&&this.setVariable(a)};b.prototype.setVariable=function(a,b){this[a]=1===arguments.length?this.variables[a].apply(this,this.variableArgs):b};b.prototype.shift=function(a,b){a&&this.shiftX(a);b&&this.shiftY(b)};
b.prototype.shiftX=function(a){this.left+=a;this.right+=a};b.prototype.shiftY=function(a){this.top+=a;this.bottom+=a};return b}();c.MapScreenr=d})(MapScreenr||(MapScreenr={}));
var MathDecidr;
(function(d){var e=function(){function c(a){void 0===a&&(a={});var b;this.constants=a.constants||{};this.equations={};for(b in this.equationsRaw=a.equations||{},this.equationsRaw)this.equationsRaw.hasOwnProperty(b)&&this.addEquation(b,this.equationsRaw[b])}c.prototype.getConstants=function(){return this.constants};c.prototype.getConstant=function(a){return this.constants[a]};c.prototype.getEquations=function(){return this.equations};c.prototype.getRawEquations=function(){return this.equationsRaw};c.prototype.getEquation=
function(a){return this.equations[a]};c.prototype.getRawEquation=function(a){return this.equationsRaw[a]};c.prototype.addConstant=function(a,b){this.constants[a]=b};c.prototype.addEquation=function(a,b){this.equationsRaw[a]=b;this.equations[a]=b.bind(this,this.constants,this.equations)};c.prototype.compute=function(a){for(var b=1;b<arguments.length;b++);return this.equations[a].apply(this,Array.prototype.slice.call(arguments,1))};return c}();d.MathDecidr=e})(MathDecidr||(MathDecidr={}));
var ModAttachr;
(function(f){var g=function(){function d(a){this.mods={};this.events={};a&&(this.scopeDefault=a.scopeDefault,a.ItemsHoldr?this.ItemsHolder=a.ItemsHoldr:a.storeLocally&&(this.ItemsHolder=new ItemsHoldr.ItemsHoldr),a.mods&&this.addMods.apply(this,a.mods))}d.prototype.getMods=function(){return this.mods};d.prototype.getMod=function(a){return this.mods[a]};d.prototype.getEvents=function(){return this.events};d.prototype.getEvent=function(a){return this.events[a]};d.prototype.getItemsHolder=function(){return this.ItemsHolder};
d.prototype.getScopeDefault=function(){return this.scopeDefault};d.prototype.addMod=function(a){var c=a.events,b;for(b in c)c.hasOwnProperty(b)&&(this.events.hasOwnProperty(b)?this.events[b].push(a):this.events[b]=[a]);a.scope=a.scope||this.scopeDefault;this.mods[a.name]=a;a.enabled&&a.events.hasOwnProperty("onModEnable")&&this.fireModEvent("onModEnable",a.name,arguments);if(this.ItemsHolder&&(this.ItemsHolder.addItem(a.name,{valueDefault:0,storeLocally:!0}),this.ItemsHolder.getItem(a.name)))return this.enableMod(a.name)};
d.prototype.addMods=function(){for(var a=[],c=0;c<arguments.length;c++)a[c-0]=arguments[c];var c=[],b;for(b=0;b<a.length;b+=1)c.push(this.addMod(a[b]));return c};d.prototype.enableMod=function(a){for(var c=[],b=1;b<arguments.length;b++)c[b-1]=arguments[b];b=this.mods[a];if(!b)throw Error("No mod of name: '"+a+"'");c=[].slice.call(c);c.unshift(b,a);b.enabled=!0;this.ItemsHolder&&this.ItemsHolder.setItem(a,!0);if(b.events.hasOwnProperty("onModEnable"))return this.fireModEvent("onModEnable",b.name,arguments)};
d.prototype.enableMods=function(){for(var a=[],c=0;c<arguments.length;c++)a[c-0]=arguments[c];var c=[],b;for(b=0;b<a.length;b+=1)c.push(this.enableMod(a[b]));return c};d.prototype.disableMod=function(a){var c=this.mods[a],b;if(!this.mods[a])throw Error("No mod of name: '"+a+"'");this.mods[a].enabled=!1;b=Array.prototype.slice.call(arguments);b[0]=c;this.ItemsHolder&&this.ItemsHolder.setItem(a,!1);if(c.events.hasOwnProperty("onModDisable"))return this.fireModEvent("onModDisable",c.name,b)};d.prototype.disableMods=
function(){for(var a=[],c=0;c<arguments.length;c++)a[c-0]=arguments[c];var c=[],b;for(b=0;b<a.length;b+=1)c.push(this.disableMod(a[b]));return c};d.prototype.toggleMod=function(a){var c=this.mods[a];if(!c)throw Error("No mod found under "+a);return c.enabled?this.disableMod(a):this.enableMod(a)};d.prototype.toggleMods=function(){for(var a=[],c=0;c<arguments.length;c++)a[c-0]=arguments[c];var c=[],b;for(b=0;b<a.length;b+=1)c.push(this.toggleMod(a[b]));return c};d.prototype.fireEvent=function(a){for(var c=
[],b=1;b<arguments.length;b++)c[b-1]=arguments[b];var b=this.events[a],d,e;if(b)for(c=[].slice.call(c),c.unshift(void 0,a),e=0;e<b.length;e+=1)d=b[e],d.enabled&&(c[0]=d,d.events[a].apply(d.scope,c))};d.prototype.fireModEvent=function(a,c){for(var b=[],d=2;d<arguments.length;d++)b[d-2]=arguments[d];var d=this.mods[c],e;if(!d)throw Error("Unknown mod requested: '"+c+"'");b=[].slice.call(b);b.unshift(d,a);e=d.events[a];if(!e)throw Error("Mod does not contain event: '"+a+"'");return e.apply(d.scope,b)};
return d}();f.ModAttachr=g})(ModAttachr||(ModAttachr={}));
var NumberMakr;
(function(g){var h=function(){function a(b){void 0===b&&(b={});this.stateLength=b.stateLength||624;this.statePeriod=b.statePeriod||397;this.matrixA=b.matrixA||2567483615;this.maskUpper=b.maskUpper||2147483648;this.maskLower=b.maskLower||2147483647;this.stateVector=Array(this.stateLength);this.stateIndex=this.stateLength+1;this.matrixAMagic=[0,this.matrixA];this.resetFromSeed(b.seed||(new Date).getTime())}a.prototype.getSeed=function(){return this.seed};a.prototype.getStateLength=function(){return this.stateLength};a.prototype.getStatePeriod=
function(){return this.statePeriod};a.prototype.getMatrixA=function(){return this.matrixA};a.prototype.getMaskUpper=function(){return this.maskUpper};a.prototype.getMaskLower=function(){return this.maskLower};a.prototype.resetFromSeed=function(b){var c;this.stateVector[0]=b>>>0;for(this.stateIndex=1;this.stateIndex<this.stateLength;this.stateIndex+=1)c=this.stateVector[this.stateIndex-1]^this.stateVector[this.stateIndex-1]>>>30,this.stateVector[this.stateIndex]=(1812433253*((c&4294901760)>>>16)<<
16)+1812433253*(c&65535)+this.stateIndex>>>0;this.seed=b};a.prototype.resetFromArray=function(b,c){void 0===c&&(c=b.length);var a=1,d=0,f,e;this.resetFromSeed(19650218);"undefined"===typeof c&&(c=b.length);for(f=this.stateLength>c?this.stateLength:c;0<f;)e=this.stateVector[a-1]^this.stateVector[a-1]>>>30,this.stateVector[a]=(this.stateVector[a]^(1664525*((e&4294901760)>>>16)<<16)+1664525*(e&65535)+b[d]+d)>>>0,a+=1,d+=1,a>=this.stateLength&&(this.stateVector[0]=this.stateVector[this.stateLength-1],
a=1),d>=c&&(d=0);for(f=this.stateLength-1;f;--f)e=this.stateVector[a-1]^this.stateVector[a-1]>>>30,this.stateVector[a]=(this.stateVector[a]^(1566083941*((e&4294901760)>>>16)<<16)+1566083941*(e&65535))-a>>>0,a+=1,a>=this.stateLength&&(this.stateVector[0]=this.stateVector[this.stateLength-1],a=1);this.stateVector[0]=2147483648;this.seed=b};a.prototype.randomInt32=function(){var b,a;if(this.stateIndex>=this.stateLength){this.stateIndex===this.stateLength+1&&this.resetFromSeed(5489);for(a=0;a<this.stateLength-
this.statePeriod;a+=1)b=this.stateVector[a]&this.maskUpper|this.stateVector[a+1]&this.maskLower,this.stateVector[a]=this.stateVector[a+this.statePeriod]^b>>>1^this.matrixAMagic[b&1];for(;a<this.stateLength-1;a+=1)b=this.stateVector[a]&this.maskUpper|this.stateVector[a+1]&this.maskLower,this.stateVector[a]=this.stateVector[a+(this.statePeriod-this.stateLength)]^b>>>1^this.matrixAMagic[b&1];b=this.stateVector[this.stateLength-1]&this.maskUpper|this.stateVector[0]&this.maskLower;this.stateVector[this.stateLength-
1]=this.stateVector[this.statePeriod-1]^b>>>1^this.matrixAMagic[b&1];this.stateIndex=0}b=this.stateVector[this.stateIndex];this.stateIndex+=1;b^=b>>>11;b^=b<<7&2636928640;b^=b<<15&4022730752;return(b^b>>>18)>>>0};a.prototype.random=function(){return this.randomInt32()*(1/4294967296)};a.prototype.randomInt31=function(){return this.randomInt32()>>>1};a.prototype.randomReal1=function(){return this.randomInt32()*(1/4294967295)};a.prototype.randomReal3=function(){return(this.randomInt32()+.5)*(1/4294967296)};
a.prototype.randomReal53Bit=function(){var b=this.randomInt32()>>>5,a=this.randomInt32()>>>6;return 1.1102230246251565E-16*(67108864*b+a)};a.prototype.randomUnder=function(a){return this.random()*a};a.prototype.randomWithin=function(a,c){return this.randomUnder(c-a)+a};a.prototype.randomInt=function(a){return this.randomUnder(a)|0};a.prototype.randomIntWithin=function(a,c){return this.randomUnder(c-a)+a|0};a.prototype.randomBoolean=function(){return 1===this.randomInt(2)};a.prototype.randomBooleanProbability=
function(a){return this.random()<a};a.prototype.randomBooleanFraction=function(a,c){return this.random()<=a/c};a.prototype.randomArrayIndex=function(a){return this.randomIntWithin(0,a.length)};a.prototype.randomArrayMember=function(a){return a[this.randomArrayIndex(a)]};return a}();g.NumberMakr=h})(NumberMakr||(NumberMakr={}));
var ObjectMakr;
(function(g){var h=function(){function f(a){if("undefined"===typeof a)throw Error("No settings object given to ObjectMakr.");if("undefined"===typeof a.inheritance)throw Error("No inheritance given to ObjectMakr.");this.inheritance=a.inheritance;this.properties=a.properties||{};this.doPropertiesFull=a.doPropertiesFull;this.indexMap=a.indexMap;this.onMake=a.onMake;this.functions={};this.doPropertiesFull&&(this.propertiesFull={});this.indexMap&&this.processProperties(this.properties);this.processFunctions(this.inheritance,
Object,"Object")}f.prototype.getInheritance=function(){return this.inheritance};f.prototype.getProperties=function(){return this.properties};f.prototype.getPropertiesOf=function(a){return this.properties[a]};f.prototype.getFullProperties=function(){return this.propertiesFull};f.prototype.getFullPropertiesOf=function(a){return this.doPropertiesFull?this.propertiesFull[a]:void 0};f.prototype.getFunctions=function(){return this.functions};f.prototype.getFunction=function(a){return this.functions[a]};
f.prototype.hasFunction=function(a){return this.functions.hasOwnProperty(a)};f.prototype.getIndexMap=function(){return this.indexMap};f.prototype.make=function(a,e){var c;if(!this.functions.hasOwnProperty(a))throw Error("Unknown type given to ObjectMakr: "+a);c=new this.functions[a];e&&this.proliferate(c,e);if(this.onMake&&c[this.onMake])c[this.onMake](c,a,e,(this.doPropertiesFull?this.propertiesFull:this.properties)[a]);return c};f.prototype.processProperties=function(a){for(var e in a)a.hasOwnProperty(e)&&
a[e]instanceof Array&&(a[e]=this.processPropertyArray(a[e]))};f.prototype.processPropertyArray=function(a){var e={},c;for(c=a.length-1;0<=c;--c)e[this.indexMap[c]]=a[c];return e};f.prototype.processFunctions=function(a,e,c){var b,d;for(b in a)if(a.hasOwnProperty(b)){this.functions[b]=new Function;this.functions[b].prototype=new e;this.functions[b].prototype.constructor=this.functions[b];for(d in this.properties[b])this.properties[b].hasOwnProperty(d)&&(this.functions[b].prototype[d]=this.properties[b][d]);
if(this.doPropertiesFull){this.propertiesFull[b]={};if(c)for(d in this.propertiesFull[c])this.propertiesFull[c].hasOwnProperty(d)&&(this.propertiesFull[b][d]=this.propertiesFull[c][d]);for(d in this.properties[b])this.properties[b].hasOwnProperty(d)&&(this.propertiesFull[b][d]=this.properties[b][d])}this.processFunctions(a[b],this.functions[b],b)}};f.prototype.proliferate=function(a,e,c){var b,d;for(d in e)c&&a.hasOwnProperty(d)||(b=e[d],"object"===typeof b?(a.hasOwnProperty(d)||(a[d]=new b.constructor),
this.proliferate(a[d],b,c)):a[d]=b);return a};return f}();g.ObjectMakr=h})(ObjectMakr||(ObjectMakr={}));
var PixelDrawr;
(function(w){var x=function(){function c(a){if(!a)throw Error("No settings object given to PixelDrawr.");if("undefined"===typeof a.PixelRender)throw Error("No PixelRender given to PixelDrawr.");if("undefined"===typeof a.MapScreener)throw Error("No MapScreener given to PixelDrawr.");if("undefined"===typeof a.createCanvas)throw Error("No createCanvas given to PixelDrawr.");this.PixelRender=a.PixelRender;this.MapScreener=a.MapScreener;this.createCanvas=a.createCanvas;this.unitsize=a.unitsize||1;this.noRefill=
a.noRefill;this.spriteCacheCutoff=a.spriteCacheCutoff||0;this.groupNames=a.groupNames;this.framerateSkip=a.framerateSkip||1;this.framesDrawn=0;this.epsilon=a.epsilon||.007;this.keyWidth=a.keyWidth||"width";this.keyHeight=a.keyHeight||"height";this.keyTop=a.keyTop||"top";this.keyRight=a.keyRight||"right";this.keyBottom=a.keyBottom||"bottom";this.keyLeft=a.keyLeft||"left";this.keyOffsetX=a.keyOffsetX;this.keyOffsetY=a.keyOffsetY;this.generateObjectKey=a.generateObjectKey||function(a){return a.toString()};
this.resetBackground()}c.prototype.getFramerateSkip=function(){return this.framerateSkip};c.prototype.getThingArray=function(){return this.thingArrays};c.prototype.getCanvas=function(){return this.canvas};c.prototype.getContext=function(){return this.context};c.prototype.getBackgroundCanvas=function(){return this.backgroundCanvas};c.prototype.getBackgroundContext=function(){return this.backgroundContext};c.prototype.getNoRefill=function(){return this.noRefill};c.prototype.getEpsilon=function(){return this.epsilon};
c.prototype.setFramerateSkip=function(a){this.framerateSkip=a};c.prototype.setThingArrays=function(a){this.thingArrays=a};c.prototype.setCanvas=function(a){this.canvas=a;this.context=a.getContext("2d")};c.prototype.setNoRefill=function(a){this.noRefill=a};c.prototype.setEpsilon=function(a){this.epsilon=a};c.prototype.resetBackground=function(){this.backgroundCanvas=this.createCanvas(this.MapScreener[this.keyWidth],this.MapScreener[this.keyHeight]);this.backgroundContext=this.backgroundCanvas.getContext("2d")};
c.prototype.setBackground=function(a){this.backgroundContext.fillStyle=a;this.backgroundContext.fillRect(0,0,this.MapScreener[this.keyWidth],this.MapScreener[this.keyHeight])};c.prototype.drawBackground=function(){this.context.drawImage(this.backgroundCanvas,0,0)};c.prototype.setThingSprite=function(a){a.hidden||(a.sprite=this.PixelRender.decode(this.generateObjectKey(a),a),a.sprite.constructor===PixelRendr.SpriteMultiple?(a.numSprites=0,this.refillThingCanvasMultiple(a)):(a.numSprites=1,this.refillThingCanvasSingle(a)))};
c.prototype.refillGlobalCanvas=function(){this.framesDrawn+=1;if(0===this.framesDrawn%this.framerateSkip){this.noRefill||this.drawBackground();for(var a=0;a<this.thingArrays.length;a+=1)this.refillThingArray(this.thingArrays[a])}};c.prototype.refillThingArray=function(a){for(var b=0;b<a.length;b+=1)this.drawThingOnContext(this.context,a[b])};c.prototype.drawThingOnContext=function(a,b){b.hidden||b.opacity<this.epsilon||1>b[this.keyHeight]||1>b[this.keyWidth]||this.getTop(b)>this.MapScreener[this.keyHeight]||
0>this.getRight(b)||0>this.getBottom(b)||this.getLeft(b)>this.MapScreener[this.keyWidth]||("undefined"===typeof b.numSprites&&this.setThingSprite(b),0<b.canvas[this.keyWidth]?this.drawThingOnContextSingle(a,b.canvas,b,this.getLeft(b),this.getTop(b)):this.drawThingOnContextMultiple(a,b.canvases,b,this.getLeft(b),this.getTop(b)))};c.prototype.refillThingCanvasSingle=function(a){if(!(1>a[this.keyWidth]||1>a[this.keyHeight])){var b=a.canvas,d=a.context,b=d.getImageData(0,0,b[this.keyWidth],b[this.keyHeight]);
this.PixelRender.memcpyU8(a.sprite,b.data);d.putImageData(b,0,0)}};c.prototype.refillThingCanvasMultiple=function(a){if(!(1>a[this.keyWidth]||1>a[this.keyHeight])){var b=a.sprite,d=a.canvases={direction:b.direction,multiple:!0},c,e,f,g;a.numSprites=1;for(g in b.sprites)b.sprites.hasOwnProperty(g)&&(c=this.createCanvas(a.spritewidth*this.unitsize,a.spriteheight*this.unitsize),e=c.getContext("2d"),f=e.getImageData(0,0,c[this.keyWidth],c[this.keyHeight]),this.PixelRender.memcpyU8(b.sprites[g],f.data),
e.putImageData(f,0,0),d[g]={canvas:c,context:e},a.numSprites+=1);a[this.keyWidth]*a[this.keyHeight]<this.spriteCacheCutoff?(a.canvas[this.keyWidth]=a[this.keyWidth]*this.unitsize,a.canvas[this.keyHeight]=a[this.keyHeight]*this.unitsize,this.drawThingOnContextMultiple(a.context,a.canvases,a,0,0)):a.canvas[this.keyWidth]=a.canvas[this.keyHeight]=0}};c.prototype.drawThingOnContextSingle=function(a,b,d,c,e){d.repeat?this.drawPatternOnContext(a,b,c,e,d.unitwidth,d.unitheight,d.opacity||1):1!==d.opacity?
(a.globalAlpha=d.opacity,a.drawImage(b,c,e,b.width*d.scale,b.height*d.scale),a.globalAlpha=1):a.drawImage(b,c,e,b.width*d.scale,b.height*d.scale)};c.prototype.drawThingOnContextMultiple=function(a,b,d,c,e){var f=d.sprite,g=e,l=c;c+=d.unitwidth;e+=d.unitheight;var m=d.unitwidth,n=d.unitheight,t=d.spritewidthpixels,u=d.spriteheightpixels,q=Math.min(m,t),r=Math.min(n,u);d=d.opacity;var k,h,p;switch(b.direction){case "vertical":if(p=b[this.keyBottom])h=f.bottomheight?f.bottomheight*this.unitsize:u,this.drawPatternOnContext(a,
p.canvas,l,e-h,m,r,d),e-=h,n-=h;if(p=b[this.keyTop])h=f.topheight?f.topheight*this.unitsize:u,this.drawPatternOnContext(a,p.canvas,l,g,m,r,d),g+=h,n-=h;break;case "horizontal":if(p=b[this.keyLeft])k=f.leftwidth?f.leftwidth*this.unitsize:t,this.drawPatternOnContext(a,p.canvas,l,g,q,n,d),l+=k,m-=k;if(p=b[this.keyRight])k=f.rightwidth?f.rightwidth*this.unitsize:t,this.drawPatternOnContext(a,p.canvas,c-k,g,q,n,d),c-=k,m-=k;break;case "corners":h=f.topheight?f.topheight*this.unitsize:u;k=f.leftwidth?f.leftwidth*
this.unitsize:t;this.drawPatternOnContext(a,b.topLeft.canvas,l,g,q,r,d);this.drawPatternOnContext(a,b[this.keyLeft].canvas,l,g+h,q,n-2*h,d);this.drawPatternOnContext(a,b.bottomLeft.canvas,l,e-h,q,r,d);l+=k;m-=k;k=f.rightwidth?f.rightwidth*this.unitsize:t;this.drawPatternOnContext(a,b[this.keyTop].canvas,l,g,m-k,r,d);this.drawPatternOnContext(a,b.topRight.canvas,c-k,g,q,r,d);g+=h;n-=h;h=f.bottomheight?f.bottomheight*this.unitsize:u;this.drawPatternOnContext(a,b[this.keyRight].canvas,c-k,g,q,n-h,d);
this.drawPatternOnContext(a,b.bottomRight.canvas,c-k,e-h,q,r,d);this.drawPatternOnContext(a,b[this.keyBottom].canvas,l,e-h,m-k,r,d);c-=k;m-=k;e-=h;n-=h;break;default:throw Error("Unknown or missing direction given in SpriteMultiple.");}(p=b.middle)&&g<e&&l<c&&(f.middleStretch?(a.globalAlpha=d,a.drawImage(p.canvas,l,g,m,n),a.globalAlpha=1):this.drawPatternOnContext(a,p.canvas,l,g,m,n,d))};c.prototype.getTop=function(a){return this.keyOffsetY?a[this.keyTop]+a[this.keyOffsetY]:a[this.keyTop]};c.prototype.getRight=
function(a){return this.keyOffsetX?a[this.keyRight]+a[this.keyOffsetX]:a[this.keyRight]};c.prototype.getBottom=function(a){return this.keyOffsetX?a[this.keyBottom]+a[this.keyOffsetY]:a[this.keyBottom]};c.prototype.getLeft=function(a){return this.keyOffsetX?a[this.keyLeft]+a[this.keyOffsetX]:a[this.keyLeft]};c.prototype.drawPatternOnContext=function(a,b,c,v,e,f,g){a.globalAlpha=g;a.translate(c,v);a.fillStyle=a.createPattern(b,"repeat");a.fillRect(0,0,e,f);a.translate(-c,-v);a.globalAlpha=1};return c}();
w.PixelDrawr=x})(PixelDrawr||(PixelDrawr={}));
var PixelRendr;(function(k){var m=function(){return function(f,a){var d=a.source[2];this.sprites=f;this.direction=a.source[1];if("vertical"===this.direction||"corners"===this.direction)this.topheight=d.topheight|0,this.bottomheight=d.bottomheight|0;if("horizontal"===this.direction||"corners"===this.direction)this.rightwidth=d.rightwidth|0,this.leftwidth=d.leftwidth|0;this.middleStretch=d.middleStretch||!1}}();k.SpriteMultiple=m})(PixelRendr||(PixelRendr={}));
(function(k){var m=function(){return function(f,a){this.source=f;this.filter=a;this.sprites={};this.containers=[]}}();k.Render=m})(PixelRendr||(PixelRendr={}));
(function(k){var m=function(){function f(a){if(!a)throw Error("No settings given to PixelRendr.");if(!a.paletteDefault)throw Error("No paletteDefault given to PixelRendr.");this.paletteDefault=a.paletteDefault;this.digitsizeDefault=this.getDigitSizeFromArray(this.paletteDefault);this.digitsplit=new RegExp(".{1,"+this.digitsizeDefault+"}","g");this.library={raws:a.library||{}};this.scale=a.scale||1;this.filters=a.filters||{};this.flipVert=a.flipVert||"flip-vert";this.flipHoriz=a.flipHoriz||"flip-horiz";
this.spriteWidth=a.spriteWidth||"spriteWidth";this.spriteHeight=a.spriteHeight||"spriteHeight";this.Uint8ClampedArray=a.Uint8ClampedArray||window.Uint8ClampedArray||window.Uint8Array;this.ProcessorBase=new ChangeLinr.ChangeLinr({transforms:{spriteUnravel:this.spriteUnravel.bind(this),spriteApplyFilter:this.spriteApplyFilter.bind(this),spriteExpand:this.spriteExpand.bind(this),spriteGetArray:this.spriteGetArray.bind(this)},pipeline:["spriteUnravel","spriteApplyFilter","spriteExpand","spriteGetArray"]});
this.ProcessorDims=new ChangeLinr.ChangeLinr({transforms:{spriteRepeatRows:this.spriteRepeatRows.bind(this),spriteFlipDimensions:this.spriteFlipDimensions.bind(this)},pipeline:["spriteRepeatRows","spriteFlipDimensions"]});this.ProcessorEncode=new ChangeLinr.ChangeLinr({transforms:{imageGetData:this.imageGetData.bind(this),imageGetPixels:this.imageGetPixels.bind(this),imageMapPalette:this.imageMapPalette.bind(this),imageCombinePixels:this.imageCombinePixels.bind(this)},pipeline:["imageGetData","imageGetPixels",
"imageMapPalette","imageCombinePixels"],doUseCache:!1});this.library.sprites=this.libraryParse(this.library.raws);this.BaseFiler=new StringFilr.StringFilr({library:this.library.sprites,normal:"normal"});this.commandGenerators={multiple:this.generateSpriteCommandMultipleFromRender.bind(this),same:this.generateSpriteCommandSameFromRender.bind(this),filter:this.generateSpriteCommandFilterFromRender.bind(this)}}f.prototype.getBaseLibrary=function(){return this.BaseFiler.getLibrary()};f.prototype.getBaseFiler=
function(){return this.BaseFiler};f.prototype.getProcessorBase=function(){return this.ProcessorBase};f.prototype.getProcessorDims=function(){return this.ProcessorDims};f.prototype.getProcessorEncode=function(){return this.ProcessorEncode};f.prototype.getSpriteBase=function(a){return this.BaseFiler.get(a)};f.prototype.decode=function(a,d){var c=this.BaseFiler.get(a);if(!c)throw Error("No sprite found for "+a+".");c.sprites.hasOwnProperty(a)||this.generateRenderSprite(c,a,d);c=c.sprites[a];if(!c||c.constructor===
this.Uint8ClampedArray&&0===c.length)throw Error("Could not generate sprite for "+a+".");return c};f.prototype.encode=function(a,d){for(var c=[],b=2;b<arguments.length;b++)c[b-2]=arguments[b];b=this.ProcessorEncode.process(a);d&&d.apply(void 0,[b,a].concat(c));return b};f.prototype.encodeUri=function(a,d){var c=document.createElement("img");c.onload=this.encode.bind(this,c,d);c.src=a};f.prototype.generatePaletteFromRawData=function(a,d,c){var b={},h=[],g=[],e;for(e=0;e<a.length;e+=4)0===a[e+3]?d=
!0:b[a[e]]&&b[a[e]][a[e+1]]&&b[a[e]][a[e+1]][a[e+2]]&&b[a[e]][a[e+1]][a[e+2]][a[e+3]]||(b[a[e]]||(b[a[e]]={}),b[a[e]][a[e+1]]||(b[a[e]][a[e+1]]={}),b[a[e]][a[e+1]][a[e+2]]||(b[a[e]][a[e+1]][a[e+2]]={}),b[a[e]][a[e+1]][a[e+2]][a[e+3]]||(b[a[e]][a[e+1]][a[e+2]][a[e+3]]=!0,a[e]===a[e+1]&&a[e+1]===a[e+2]?g.push(a.subarray(e,e+4)):h.push(a.subarray(e,e+4))));g.sort(function(a,b){return a[0]-b[0]});h.sort(function(a,b){for(e=0;4>e;e+=1)if(a[e]!==b[e])return b[e]-a[e]});a=d?[new this.Uint8ClampedArray([0,
0,0,0])].concat(g).concat(h):g.concat(h);if(!c)return a;for(e=0;e<a.length;e+=1)a[e]=Array.prototype.slice.call(a[e]);return a};f.prototype.memcpyU8=function(a,d,c,b,h){void 0===c&&(c=0);void 0===b&&(b=0);void 0===h&&(h=Math.max(0,Math.min(a.length,d.length)));h+=0;b+=0;for(c+=0;h--;)d[b++]=a[c++]};f.prototype.libraryParse=function(a){var d={},c,b;for(b in a)if(a.hasOwnProperty(b)){c=a[b];switch(c.constructor){case String:d[b]=new k.Render(c);break;case Array:d[b]=new k.Render(c,c[1]);break;default:d[b]=
this.libraryParse(c)}d[b].constructor===k.Render&&d[b].containers.push({container:d,key:b})}return d};f.prototype.generateRenderSprite=function(a,d,c){c=a.source.constructor===String?this.generateSpriteSingleFromRender(a,d,c):this.commandGenerators[a.source[0]](a,d,c);a.sprites[d]=c};f.prototype.generateSpriteSingleFromRender=function(a,d,c){a=this.ProcessorBase.process(a.source,d,a.filter);return this.ProcessorDims.process(a,d,c)};f.prototype.generateSpriteCommandMultipleFromRender=function(a,d,
c){var b=a.source[2],h={},g,e,f=new k.SpriteMultiple(h,a),l;for(l in b)b.hasOwnProperty(l)&&(e=d+" "+l,g=this.ProcessorBase.process(b[l],e,a.filter),h[l]=this.ProcessorDims.process(g,e,c));return f};f.prototype.generateSpriteCommandSameFromRender=function(a,d,c){var b=this.followPath(this.library.sprites,a.source[1],0);this.replaceRenderInContainers(a,b);this.BaseFiler.clearCached(d);return this.decode(d,c)};f.prototype.generateSpriteCommandFilterFromRender=function(a,d,c){var b=this.filters[a.source[2]],
h=this.followPath(this.library.sprites,a.source[1],0);b||console.warn("Invalid filter provided: "+a.source[2]);h.constructor===k.Render?(b=new k.Render(h.source,{filter:b}),this.generateRenderSprite(b,d,c)):b=this.generateRendersFromFilter(h,b);this.replaceRenderInContainers(a,b);if(b.constructor===k.Render)return b.sprites[d];this.BaseFiler.clearCached(d);return this.decode(d,c)};f.prototype.generateRendersFromFilter=function(a,d){var c={},b,h;for(h in a)a.hasOwnProperty(h)&&(b=a[h],c[h]=b.constructor===
k.Render?new k.Render(b.source,{filter:d}):this.generateRendersFromFilter(b,d));return c};f.prototype.replaceRenderInContainers=function(a,d){var c,b;for(b=0;b<a.containers.length;b+=1)c=a.containers[b],c.container[c.key]=d,d.constructor===k.Render&&d.containers.push(c)};f.prototype.spriteUnravel=function(a){var d=this.getPaletteReferenceStarting(this.paletteDefault),c=this.digitsizeDefault,b=a.length,h,g,e,f="";for(g=0;g<b;)switch(a[g]){case "x":e=a.indexOf(",",++g);h=this.makeDigit(d[a.slice(g,
g+=c)],this.digitsizeDefault);for(g=Number(a.slice(g,e));g--;)f+=h;g=e+1;break;case "p":"["===a[++g]?(e=a.indexOf("]"),d=this.getPaletteReference(a.slice(g+1,e).split(",")),g=e+1,c=this.getDigitSizeFromObject(d)):(d=this.getPaletteReference(this.paletteDefault),c=this.digitsizeDefault);break;default:f+=this.makeDigit(d[a.slice(g,g+=c)],this.digitsizeDefault)}return f};f.prototype.spriteExpand=function(a){for(var d="",c=a.length,b=0,h,g;b<c;)for(g=a.slice(b,b+=this.digitsizeDefault),h=0;h<this.scale;++h)d+=
g;return d};f.prototype.spriteApplyFilter=function(a,d,c){if(!c||!c.filter)return a;d=c.filter;c=d[0];if(!c)return a;switch(c){case "palette":a=a.match(this.digitsplit);for(var b in d[1])d[1].hasOwnProperty(b)&&this.arrayReplace(a,b,d[1][b]);return a.join("");default:console.warn("Unknown filter: '"+c+"'.")}return a};f.prototype.spriteGetArray=function(a){var d=a.length/this.digitsizeDefault;a=a.match(this.digitsplit);var c=new this.Uint8ClampedArray(4*d),b,h,g,e;for(g=h=0;h<d;++h){b=this.paletteDefault[Number(a[h])];
for(e=0;4>e;++e)c[g+e]=b[e];g+=4}return c};f.prototype.spriteRepeatRows=function(a,d,c){d=new this.Uint8ClampedArray(a.length*this.scale);var b=4*c[this.spriteWidth];c=c[this.spriteHeight]/this.scale;var h=0,g=0,e,f;for(e=0;e<c;++e){for(f=0;f<this.scale;++f)this.memcpyU8(a,d,h,g,b),g+=b;h+=b}return d};f.prototype.spriteFlipDimensions=function(a,d,c){return-1!==d.indexOf(this.flipHoriz)?-1!==d.indexOf(this.flipVert)?this.flipSpriteArrayBoth(a):this.flipSpriteArrayHoriz(a,c):-1!==d.indexOf(this.flipVert)?
this.flipSpriteArrayVert(a,c):a};f.prototype.flipSpriteArrayHoriz=function(a,d){var c=a.length+0,b=d[this.spriteWidth]+0,h=new this.Uint8ClampedArray(c),b=4*b,g,e,f,l,k;for(f=0;f<c;f+=b)for(g=f,e=f+b-4,l=0;l<b;l+=4){for(k=0;4>k;++k)h[g+k]=a[e+k];g+=4;e-=4}return h};f.prototype.flipSpriteArrayVert=function(a,d){for(var c=a.length,b=d[this.spriteWidth]+0,f=new this.Uint8ClampedArray(c),b=4*b,g=0,e=c-b,k,l;g<c;){for(k=0;k<b;k+=4)for(l=0;4>l;++l)f[g+k+l]=a[e+k+l];g+=b;e-=b}return f};f.prototype.flipSpriteArrayBoth=
function(a){for(var d=a.length,c=new this.Uint8ClampedArray(d),b=a.length-4,f=0,g;f<d;){for(g=0;4>g;++g)c[f+g]=a[b+g];f+=4;b-=4}return c};f.prototype.imageGetData=function(a){var d=document.createElement("canvas"),c=d.getContext("2d");d.width=a.width;d.height=a.height;c.drawImage(a,0,0);return c.getImageData(0,0,a.width,a.height).data};f.prototype.imageGetPixels=function(a){var d=Array(a.length/4),c={},b,f,g;for(g=f=0;f<a.length;f+=4,g+=1)b=this.getClosestInPalette(this.paletteDefault,a.subarray(f,
f+4)),d[g]=b,c.hasOwnProperty(b)?c[b]+=1:c[b]=1;return[d,c]};f.prototype.imageMapPalette=function(a){var d=a[0];a=Object.keys(a[1]);var c=this.getDigitSizeFromArray(a),b=this.getValueIndices(a),d=d.map(function(a){return b[a]});return[a,d,c]};f.prototype.imageCombinePixels=function(a){var d=a[1],c=a[2],b=Math.max(3,Math.round(4/c)),f,g,e=0,k;for(a="p["+a[0].map(this.makeSizedDigit.bind(this,c)).join(",")+"]";e<d.length;){k=e+1;f=d[e];for(g=this.makeDigit(f,c);f===d[k];)k+=1;if(k-e>b)a+="x"+g+String(k-
e)+",",e=k;else{do a+=g,e+=1;while(e<k)}}return a};f.prototype.getDigitSizeFromArray=function(a){var d=0;for(a=a.length;1<=a;a/=10)d+=1;return d};f.prototype.getDigitSizeFromObject=function(a){return this.getDigitSizeFromArray(Object.keys(a))};f.prototype.getPaletteReference=function(a){var d={},c=this.getDigitSizeFromArray(a),b;for(b=0;b<a.length;b+=1)d[this.makeDigit(b,c)]=this.makeDigit(a[b],c);return d};f.prototype.getPaletteReferenceStarting=function(a){var d={},c,b;for(b=0;b<a.length;b+=1)c=
this.makeDigit(b,this.digitsizeDefault),d[c]=c;return d};f.prototype.getClosestInPalette=function(a,d){var c=Infinity,b,f,g;for(g=a.length-1;0<=g;--g)b=this.arrayDifference(a[g],d),b<c&&(c=b,f=g);return f};f.prototype.stringOf=function(a,d){return 0===d?"":Array(1+(d||1)).join(a)};f.prototype.makeDigit=function(a,d,c){void 0===c&&(c="0");return this.stringOf(c,Math.max(0,d-String(a).length))+a};f.prototype.makeSizedDigit=function(a,d){return this.makeDigit(d,a,"0")};f.prototype.arrayReplace=function(a,
d,c){for(var b=0;b<a.length;b+=1)a[b]===d&&(a[b]=c);return a};f.prototype.arrayDifference=function(a,d){var c=0,b;for(b=a.length-1;0<=b;--b)c+=Math.abs(a[b]-d[b])|0;return c};f.prototype.getValueIndices=function(a){var d={},c;for(c=0;c<a.length;c+=1)d[a[c]]=c;return d};f.prototype.followPath=function(a,d,c){return c<d.length&&a.hasOwnProperty(d[c])?this.followPath(a[d[c]],d,c+1):a};return f}();k.PixelRendr=m})(PixelRendr||(PixelRendr={}));
var QuadsKeepr;
(function(g){var h=function(){function e(a){if(!a)throw Error("No settings object given to QuadsKeepr.");if(!a.ObjectMaker)throw Error("No ObjectMaker given to QuadsKeepr.");if(!a.numRows)throw Error("No numRows given to QuadsKeepr.");if(!a.numCols)throw Error("No numCols given to QuadsKeepr.");if(!a.quadrantWidth)throw Error("No quadrantWidth given to QuadsKeepr.");if(!a.quadrantHeight)throw Error("No quadrantHeight given to QuadsKeepr.");if(!a.groupNames)throw Error("No groupNames given to QuadsKeepr.");this.ObjectMaker=
a.ObjectMaker;this.numRows=a.numRows|0;this.numCols=a.numCols|0;this.quadrantWidth=a.quadrantWidth|0;this.quadrantHeight=a.quadrantHeight|0;this.groupNames=a.groupNames;this.onAdd=a.onAdd;this.onRemove=a.onRemove;this.startLeft=a.startLeft|0;this.startTop=a.startTop|0;this.keyTop=a.keyTop||"top";this.keyLeft=a.keyLeft||"left";this.keyBottom=a.keyBottom||"bottom";this.keyRight=a.keyRight||"right";this.keyNumQuads=a.keyNumQuads||"numquads";this.keyQuadrants=a.keyQuadrants||"quadrants";this.keyChanged=
a.keyChanged||"changed";this.keyToleranceX=a.keyToleranceX||"tolx";this.keyToleranceY=a.keyToleranceY||"toly";this.keyGroupName=a.keyGroupName||"group";this.keyOffsetX=a.keyOffsetX;this.keyOffsetY=a.keyOffsetY}e.prototype.getQuadrantRows=function(){return this.quadrantRows};e.prototype.getQuadrantCols=function(){return this.quadrantCols};e.prototype.getNumRows=function(){return this.numRows};e.prototype.getNumCols=function(){return this.numCols};e.prototype.getQuadrantWidth=function(){return this.quadrantWidth};
e.prototype.getQuadrantHeight=function(){return this.quadrantHeight};e.prototype.resetQuadrants=function(){var a=this.startLeft,b=this.startTop,c,d,e;this.top=this.startTop;this.right=this.startLeft+this.quadrantWidth*this.numCols;this.bottom=this.startTop+this.quadrantHeight*this.numRows;this.left=this.startLeft;this.quadrantRows=[];this.quadrantCols=[];for(d=this.offsetY=this.offsetX=0;d<this.numRows;d+=1)this.quadrantRows.push({left:this.startLeft,top:b,quadrants:[]}),b+=this.quadrantHeight;for(e=
0;e<this.numCols;e+=1)this.quadrantCols.push({left:a,top:this.startTop,quadrants:[]}),a+=this.quadrantWidth;b=this.startTop;for(d=0;d<this.numRows;d+=1){a=this.startLeft;for(e=0;e<this.numCols;e+=1)c=this.createQuadrant(a,b),this.quadrantRows[d].quadrants.push(c),this.quadrantCols[e].quadrants.push(c),a+=this.quadrantWidth;b+=this.quadrantHeight}if(this.onAdd)this.onAdd("xInc",this.top,this.right,this.bottom,this.left)};e.prototype.shiftQuadrants=function(a,b){void 0===a&&(a=0);void 0===b&&(b=0);
var c,d;a|=0;b|=0;this.offsetX+=a;this.offsetY+=b;this.top+=b;this.right+=a;this.bottom+=b;this.left+=a;for(c=0;c<this.numRows;c+=1)this.quadrantRows[c].left+=a,this.quadrantRows[c].top+=b;for(d=0;d<this.numCols;d+=1)this.quadrantCols[d].left+=a,this.quadrantCols[d].top+=b;for(c=0;c<this.numRows;c+=1)for(d=0;d<this.numCols;d+=1)this.shiftQuadrant(this.quadrantRows[c].quadrants[d],a,b);this.adjustOffsets()};e.prototype.pushQuadrantRow=function(a){var b=this.createQuadrantRow(this.left,this.bottom),
c;this.numRows+=1;this.quadrantRows.push(b);for(c=0;c<this.quadrantCols.length;c+=1)this.quadrantCols[c].quadrants.push(b.quadrants[c]);this.bottom+=this.quadrantHeight;if(a&&this.onAdd)this.onAdd("yInc",this.bottom,this.right,this.bottom-this.quadrantHeight,this.left);return b};e.prototype.pushQuadrantCol=function(a){var b=this.createQuadrantCol(this.right,this.top),c;this.numCols+=1;this.quadrantCols.push(b);for(c=0;c<this.quadrantRows.length;c+=1)this.quadrantRows[c].quadrants.push(b.quadrants[c]);
this.right+=this.quadrantWidth;if(a&&this.onAdd)this.onAdd("xInc",this.top,this.right-this.offsetY,this.bottom,this.right-this.quadrantWidth-this.offsetY);return b};e.prototype.popQuadrantRow=function(a){for(var b=0;b<this.quadrantCols.length;b+=1)this.quadrantCols[b].quadrants.pop();--this.numRows;this.quadrantRows.pop();if(a&&this.onRemove)this.onRemove("yInc",this.bottom,this.right,this.bottom-this.quadrantHeight,this.left);this.bottom-=this.quadrantHeight};e.prototype.popQuadrantCol=function(a){for(var b=
0;b<this.quadrantRows.length;b+=1)this.quadrantRows[b].quadrants.pop();--this.numCols;this.quadrantCols.pop();if(a&&this.onRemove)this.onRemove("xDec",this.top,this.right-this.offsetY,this.bottom,this.right-this.quadrantWidth-this.offsetY);this.right-=this.quadrantWidth};e.prototype.unshiftQuadrantRow=function(a){var b=this.createQuadrantRow(this.left,this.top-this.quadrantHeight),c;this.numRows+=1;this.quadrantRows.unshift(b);for(c=0;c<this.quadrantCols.length;c+=1)this.quadrantCols[c].quadrants.unshift(b.quadrants[c]);
this.top-=this.quadrantHeight;if(a&&this.onAdd)this.onAdd("yDec",this.top,this.right,this.top+this.quadrantHeight,this.left);return b};e.prototype.unshiftQuadrantCol=function(a){var b=this.createQuadrantCol(this.left-this.quadrantWidth,this.top),c;this.numCols+=1;this.quadrantCols.unshift(b);for(c=0;c<this.quadrantRows.length;c+=1)this.quadrantRows[c].quadrants.unshift(b.quadrants[c]);this.left-=this.quadrantWidth;if(a&&this.onAdd)this.onAdd("xDec",this.top,this.left,this.bottom,this.left+this.quadrantWidth);
return b};e.prototype.shiftQuadrantRow=function(a){for(var b=0;b<this.quadrantCols.length;b+=1)this.quadrantCols[b].quadrants.shift();--this.numRows;this.quadrantRows.pop();if(a&&this.onRemove)this.onRemove("yInc",this.top,this.right,this.top+this.quadrantHeight,this.left);this.top+=this.quadrantHeight};e.prototype.shiftQuadrantCol=function(a){for(var b=0;b<this.quadrantRows.length;b+=1)this.quadrantRows[b].quadrants.shift();--this.numCols;this.quadrantCols.pop();if(a&&this.onRemove)this.onRemove("xInc",
this.top,this.left+this.quadrantWidth,this.bottom,this.left);this.left+=this.quadrantWidth};e.prototype.determineAllQuadrants=function(a,b){var c,d;for(c=0;c<this.numRows;c+=1)for(d=0;d<this.numCols;d+=1)this.quadrantRows[c].quadrants[d].numthings[a]=0;b.forEach(this.determineThingQuadrants.bind(this))};e.prototype.determineThingQuadrants=function(a){var b=a[this.keyGroupName],c=this.findQuadrantRowStart(a),d=this.findQuadrantColStart(a),e=this.findQuadrantRowEnd(a),g=this.findQuadrantColEnd(a),f;
a[this.keyChanged]&&this.markThingQuadrantsChanged(a);for(a[this.keyNumQuads]=0;c<=e;c+=1)for(f=d;f<=g;f+=1)this.setThingInQuadrant(a,this.quadrantRows[c].quadrants[f],b);a[this.keyChanged]=!1};e.prototype.setThingInQuadrant=function(a,b,c){a[this.keyQuadrants][a[this.keyNumQuads]]=b;a[this.keyNumQuads]+=1;b.things[c][b.numthings[c]]=a;b.numthings[c]+=1;a[this.keyChanged]&&(b[this.keyChanged]=!0)};e.prototype.adjustOffsets=function(){for(;-this.offsetX>this.quadrantWidth;)this.shiftQuadrantCol(!0),
this.pushQuadrantCol(!0),this.offsetX+=this.quadrantWidth;for(;this.offsetX>this.quadrantWidth;)this.popQuadrantCol(!0),this.unshiftQuadrantCol(!0),this.offsetX-=this.quadrantWidth;for(;-this.offsetY>this.quadrantHeight;)this.unshiftQuadrantRow(!0),this.pushQuadrantRow(!0),this.offsetY+=this.quadrantHeight;for(;this.offsetY>this.quadrantHeight;)this.popQuadrantRow(!0),this.unshiftQuadrantRow(!0),this.offsetY-=this.quadrantHeight};e.prototype.shiftQuadrant=function(a,b,c){a.top+=c;a.right+=b;a.bottom+=
c;a.left+=b;a[this.keyChanged]=!0};e.prototype.createQuadrant=function(a,b){var c=this.ObjectMaker.make("Quadrant"),d;c[this.keyChanged]=!0;c.things={};c.numthings={};for(d=0;d<this.groupNames.length;d+=1)c.things[this.groupNames[d]]=[],c.numthings[this.groupNames[d]]=0;c.left=a;c.top=b;c.right=a+this.quadrantWidth;c.bottom=b+this.quadrantHeight;return c};e.prototype.createQuadrantRow=function(a,b){void 0===a&&(a=0);void 0===b&&(b=0);var c={left:a,top:b,quadrants:[]},d;for(d=0;d<this.numCols;d+=1)c.quadrants.push(this.createQuadrant(a,
b)),a+=this.quadrantWidth;return c};e.prototype.createQuadrantCol=function(a,b){var c={left:a,top:b,quadrants:[]},d;for(d=0;d<this.numRows;d+=1)c.quadrants.push(this.createQuadrant(a,b)),b+=this.quadrantHeight;return c};e.prototype.getTop=function(a){return this.keyOffsetY?a[this.keyTop]-Math.abs(a[this.keyOffsetY]):a[this.keyTop]};e.prototype.getRight=function(a){return this.keyOffsetX?a[this.keyRight]+Math.abs(a[this.keyOffsetX]):a[this.keyRight]};e.prototype.getBottom=function(a){return this.keyOffsetX?
a[this.keyBottom]+Math.abs(a[this.keyOffsetY]):a[this.keyBottom]};e.prototype.getLeft=function(a){return this.keyOffsetX?a[this.keyLeft]-Math.abs(a[this.keyOffsetX]):a[this.keyLeft]};e.prototype.markThingQuadrantsChanged=function(a){for(var b=0;b<a[this.keyNumQuads];b+=1)a[this.keyQuadrants][b][this.keyChanged]=!0};e.prototype.findQuadrantRowStart=function(a){return Math.max(Math.floor((this.getTop(a)-this.top)/this.quadrantHeight),0)};e.prototype.findQuadrantRowEnd=function(a){return Math.min(Math.floor((this.getBottom(a)-
this.top)/this.quadrantHeight),this.numRows-1)};e.prototype.findQuadrantColStart=function(a){return Math.max(Math.floor((this.getLeft(a)-this.left)/this.quadrantWidth),0)};e.prototype.findQuadrantColEnd=function(a){return Math.min(Math.floor((this.getRight(a)-this.left)/this.quadrantWidth),this.numCols-1)};return e}();g.QuadsKeepr=h})(QuadsKeepr||(QuadsKeepr={}));
var ScenePlayr;
(function(f){var g=function(){function a(b){void 0===b&&(b={});this.cutscenes=b.cutscenes||{};this.cutsceneArguments=b.cutsceneArguments||[]}a.prototype.getCutscenes=function(){return this.cutscenes};a.prototype.getCutscene=function(){return this.cutscene};a.prototype.getOtherCutscene=function(b){return this.cutscenes[b]};a.prototype.getRoutine=function(){return this.routine};a.prototype.getOtherRoutine=function(b){return this.cutscene.routines[b]};a.prototype.getCutsceneName=function(){return this.cutsceneName};a.prototype.getCutsceneSettings=
function(){return this.cutsceneSettings};a.prototype.addCutsceneSetting=function(b,a){this.cutsceneSettings[b]=a};a.prototype.startCutscene=function(b,a,c){void 0===a&&(a={});if(!b)throw Error("No name given to ScenePlayr.playScene.");this.cutsceneName&&this.stopCutscene();this.cutscene=this.cutscenes[b];this.cutsceneName=b;this.cutsceneSettings=a||{};this.cutsceneSettings.cutscene=this.cutscene;this.cutsceneSettings.cutsceneName=b;this.cutsceneArguments.push(this.cutsceneSettings);this.cutscene.firstRoutine&&
this.playRoutine.apply(this,[this.cutscene.firstRoutine].concat(c))};a.prototype.bindCutscene=function(b,a,c){return this.startCutscene.bind(this,b,c)};a.prototype.stopCutscene=function(){this.cutsceneSettings=this.cutsceneName=this.cutscene=this.routine=void 0;this.cutsceneArguments.pop()};a.prototype.playRoutine=function(b){for(var a=[],c=1;c<arguments.length;c++)a[c-1]=arguments[c];if(!this.cutscene)throw Error("No cutscene is currently playing.");if(!this.cutscene.routines[b])throw Error("The "+
this.cutsceneName+" cutscene does not contain a "+b+" routine.");c=this.cutsceneArguments.slice();c.push.apply(c,a);this.routine=this.cutscene.routines[b];this.cutsceneSettings.routine=this.routine;this.cutsceneSettings.routineName=b;this.cutsceneSettings.routineArguments=a;this.routine.apply(this,c)};a.prototype.bindRoutine=function(a){for(var d=[],c=1;c<arguments.length;c++)d[c-1]=arguments[c];return(e=this.playRoutine).bind.apply(e,[this,a].concat(d));var e};return a}();f.ScenePlayr=g})(ScenePlayr||
(ScenePlayr={}));
var StringFilr;
(function(f){var g=function(){function b(a){if(!a)throw Error("No settings given to StringFilr.");if(!a.library)throw Error("No library given to StringFilr.");this.library=a.library;this.normal=a.normal;this.requireNormalKey=a.requireNormalKey;this.cache={};if(this.requireNormalKey){if("undefined"===typeof this.normal)throw Error("StringFilr is given requireNormalKey, but no normal class.");this.ensureLibraryNormal()}}b.prototype.getLibrary=function(){return this.library};b.prototype.getNormal=function(){return this.normal};
b.prototype.getCache=function(){return this.cache};b.prototype.getCached=function(a){return this.cache[a]};b.prototype.clearCache=function(){this.cache={}};b.prototype.clearCached=function(a){delete this.cache[a];this.normal&&delete this.cache[a.replace(this.normal,"")]};b.prototype.get=function(a){var c,b;c=this.normal?a.replace(this.normal,""):a;if(this.cache.hasOwnProperty(c))return this.cache[c];b=this.followClass(c.split(/\s+/g),this.library);return this.cache[c]=this.cache[a]=b};b.prototype.followClass=
function(a,c){var b,d;if(!a||!a.length)return c;for(d=0;d<a.length;d+=1)if(b=a[d],c.hasOwnProperty(b))return a.splice(d,1),this.followClass(a,c[b]);return this.normal&&c.hasOwnProperty(this.normal)?this.followClass(a,c[this.normal]):c};b.prototype.findLackingNormal=function(a,b,e){var d;a.hasOwnProperty(this.normal)||e.push(b);if("object"===typeof a[d])for(d in a)a.hasOwnProperty(d)&&this.findLackingNormal(a[d],b+" "+d,e);return e};b.prototype.ensureLibraryNormal=function(){var a=this.findLackingNormal(this.library,
"base",[]);if(a.length)throw Error("Found "+a.length+" library sub-directories missing the normal: \r\n  "+a.join("\r\n  "));};return b}();f.StringFilr=g})(StringFilr||(StringFilr={}));
var ThingHittr;
(function(ThingHittr_1){var ThingHittr=function(){function ThingHittr(settings){if(typeof settings==="undefined")throw new Error("No settings object given to ThingHittr.");if(typeof settings.globalCheckGenerators==="undefined")throw new Error("No globalCheckGenerators given to ThingHittr.");if(typeof settings.hitCheckGenerators==="undefined")throw new Error("No hitCheckGenerators given to ThingHittr.");if(typeof settings.hitCallbackGenerators==="undefined")throw new Error("No hitCallbackGenerators given to ThingHittr.");this.keyNumQuads=
settings.keyNumQuads||"numquads";this.keyQuadrants=settings.keyQuadrants||"quadrants";this.keyGroupName=settings.keyGroupName||"group";this.keyTypeName=settings.keyTypeName||"type";this.globalCheckGenerators=settings.globalCheckGenerators;this.hitCheckGenerators=settings.hitCheckGenerators;this.hitCallbackGenerators=settings.hitCallbackGenerators;this.generatedHitChecks={};this.generatedHitCallbacks={};this.generatedGlobalChecks={};this.generatedHitsChecks={};this.groupHitLists=this.generateGroupHitLists(this.hitCheckGenerators)}
ThingHittr.prototype.cacheChecksForType=function(typeName,groupName){if(!this.generatedGlobalChecks.hasOwnProperty(typeName)&&this.globalCheckGenerators.hasOwnProperty(groupName)){this.generatedGlobalChecks[typeName]=this.globalCheckGenerators[groupName]();this.generatedHitsChecks[typeName]=this.generateHitsCheck(typeName)}};ThingHittr.prototype.checkHitsForThing=function(thing){this.generatedHitsChecks[thing[this.keyTypeName]](thing)};ThingHittr.prototype.checkHitForThings=function(thing,other){return this.runThingsFunctionSafely(this.generatedHitChecks,
thing,other,this.hitCheckGenerators)};ThingHittr.prototype.runHitCallbackForThings=function(thing,other){this.runThingsFunctionSafely(this.generatedHitCallbacks,thing,other,this.hitCallbackGenerators)};ThingHittr.prototype.generateHitsCheck=function(typeName){var _this=this;return function(thing){if(!_this.generatedGlobalChecks[typeName](thing))return;var groupNames=_this.groupHitLists[thing[_this.keyGroupName]],groupName,others,other,i,j,k;for(i=0;i<thing[_this.keyNumQuads];i+=1)for(j=0;j<groupNames.length;j+=
1){groupName=groupNames[j];others=thing[_this.keyQuadrants][i].things[groupName];for(k=0;k<others.length;k+=1){other=others[k];if(thing===other)break;if(!_this.generatedGlobalChecks[other[_this.keyTypeName]](other))continue;if(_this.checkHitForThings(thing,other))_this.runHitCallbackForThings(thing,other)}}}};ThingHittr.prototype.runThingsFunctionSafely=function(group,thing,other,generators){var typeThing=thing[this.keyTypeName],typeOther=other[this.keyTypeName],container=group[typeThing],check;if(!container)container=
group[typeThing]={};check=container[typeOther];if(!check)check=container[typeOther]=generators[thing[this.keyGroupName]][other[this.keyGroupName]]();return check(thing,other)};ThingHittr.prototype.generateGroupHitLists=function(group){var output={},i;for(i in group)if(group.hasOwnProperty(i))output[i]=Object.keys(group[i]);return output};return ThingHittr}();ThingHittr_1.ThingHittr=ThingHittr})(ThingHittr||(ThingHittr={}));
var TimeHandlr;(function(f){var g=function(){function c(a,b,d,h,e){this.count=0;this.callback=a;this.repeat=b;this.timeRepeat=h;this.time=d+c.runCalculator(h,this);this.args=e}c.runCalculator=function(a){for(var b=[],d=1;d<arguments.length;d++)b[d-1]=arguments[d];return a.constructor===Number?a:a.apply(void 0,b)};c.prototype.scheduleNextRepeat=function(){return this.time+=c.runCalculator(this.timeRepeat)};return c}();f.TimeEvent=g})(TimeHandlr||(TimeHandlr={}));
(function(f){var g=function(){function c(a){void 0===a&&(a={});this.time=0;this.events={};this.timingDefault=a.timingDefault||1;this.keyCycles=a.keyCycles||"cycles";this.keyClassName=a.keyClassName||"className";this.keyOnClassCycleStart=a.keyOnClassCycleStart||"onClassCycleStart";this.keyDoClassCycleStart=a.keyDoClassCycleStart||"doClassCycleStart";this.keyCycleCheckValidity=a.keyCycleCheckValidity;this.copyCycleSettings="undefined"===typeof a.copyCycleSettings?!0:a.copyCycleSettings;this.classAdd=
a.classAdd||this.classAddGeneric;this.classRemove=a.classRemove||this.classRemoveGeneric}c.prototype.getTime=function(){return this.time};c.prototype.getEvents=function(){return this.events};c.prototype.addEvent=function(a,b){for(var d=[],c=2;c<arguments.length;c++)d[c-2]=arguments[c];d=new f.TimeEvent(a,1,this.time,b||1,d);this.insertEvent(d);return d};c.prototype.addEventInterval=function(a,b,d){for(var c=[],e=3;e<arguments.length;e++)c[e-3]=arguments[e];c=new f.TimeEvent(a,d||1,this.time,b||1,
c);this.insertEvent(c);return c};c.prototype.addEventIntervalSynched=function(a,b,d){for(var c=[],e=3;e<arguments.length;e++)c[e-3]=arguments[e];b=b||1;d=d||1;e=f.TimeEvent.runCalculator(b||this.timingDefault);e*=Math.ceil(this.time/e);return e===this.time?this.addEventInterval.apply(this,[a,b,d].concat(c)):this.addEvent.apply(this,[this.addEventInterval,e-this.time,a,b,d].concat(c))};c.prototype.addClassCycle=function(a,b,d,c){a[this.keyCycles]||(a[this.keyCycles]={});this.cancelClassCycle(a,d);
b=a[this.keyCycles][d||"0"]=this.setClassCycle(a,b,c);this.cycleClass(a,b);return b};c.prototype.addClassCycleSynched=function(a,b,d,c){a[this.keyCycles]||(a[this.keyCycles]={});this.cancelClassCycle(a,d);b=a[this.keyCycles][d||"0"]=this.setClassCycle(a,b,c,!0);this.cycleClass(a,b);return b};c.prototype.handleEvents=function(){var a,b;this.time+=1;if(a=this.events[this.time]){for(b=0;b<a.length;b+=1)this.handleEvent(a[b]);delete this.events[this.time]}};c.prototype.handleEvent=function(a){if(!(0>=
a.repeat||a.callback.apply(this,a.args))){if("function"===typeof a.repeat){if(!a.repeat.apply(this,a.args))return}else{if(!a.repeat)return;--a.repeat;if(0>=a.repeat)return}a.scheduleNextRepeat();this.insertEvent(a);return a.time}};c.prototype.cancelEvent=function(a){a.repeat=0};c.prototype.cancelAllEvents=function(){this.events={}};c.prototype.cancelClassCycle=function(a,b){var d;a[this.keyCycles]&&a[this.keyCycles][b]&&(d=a[this.keyCycles][b],d.event.repeat=0,delete a[this.keyCycles][b])};c.prototype.cancelAllCycles=
function(a){a=a[this.keyCycles];var b,d;for(d in a)a.hasOwnProperty(d)&&(b=a[d],b.length=1,b[0]=!1,delete a[d])};c.prototype.setClassCycle=function(a,b,d,c){var e=this;d=f.TimeEvent.runCalculator(d||this.timingDefault);this.copyCycleSettings&&(b=this.makeSettingsCopy(b));b.location=b.oldclass=-1;a[this.keyOnClassCycleStart]=c?function(){var c=b.length*d,c=Math.ceil(e.time/c)*c-e.time,c=0===c?e.addEventInterval(e.cycleClass,d,Infinity,a,b):e.addEvent(e.addEventInterval,c,e.cycleClass,d,Infinity,a,
b);b.event=c}:function(){b.event=e.addEventInterval(e.cycleClass,d,Infinity,a,b)};if(a[this.keyDoClassCycleStart])a[this.keyOnClassCycleStart]();return b};c.prototype.cycleClass=function(a,b){if(!a||!b||!b.length||this.keyCycleCheckValidity&&!a[this.keyCycleCheckValidity])return!0;var c;-1!==b.oldclass&&"string"===typeof b[b.oldclass]&&this.classRemove(a,b[b.oldclass]);b.location=(b.location+=1)%b.length;c=b[b.location];if(!c)return!1;c=c.constructor===Function?c(a,b):c;b.oldclass=b.location;return"string"===
typeof c?(this.classAdd(a,c),!1):!!c};c.prototype.insertEvent=function(a){this.events[a.time]?this.events[a.time].push(a):this.events[a.time]=[a]};c.prototype.makeSettingsCopy=function(a){var b=new a.constructor,c;for(c in a)a.hasOwnProperty(c)&&(b[c]=a[c]);return b};c.prototype.classAddGeneric=function(a,b){a[this.keyClassName]+=" "+b};c.prototype.classRemoveGeneric=function(a,b){a[this.keyClassName]=a[this.keyClassName].replace(b,"")};return c}();f.TimeHandlr=g})(TimeHandlr||(TimeHandlr={}));
var __extends=this&&this.__extends||function(e,g){function b(){this.constructor=e}for(var a in g)g.hasOwnProperty(a)&&(e[a]=g[a]);e.prototype=null===g?Object.create(g):(b.prototype=g.prototype,new b)},TouchPassr;
(function(e){var g=function(){function b(a,f,d){this.InputWriter=a;this.schema=f;this.resetElement(d)}b.prototype.getElement=function(){return this.element};b.prototype.getElementInner=function(){return this.elementInner};b.prototype.createElement=function(a){for(var f=[],d=1;d<arguments.length;d++)f[d-1]=arguments[d];var d=document.createElement(a||"div"),c;for(c=0;c<f.length;c+=1)this.proliferateElement(d,f[c]);return d};b.prototype.proliferateElement=function(a,f,d){void 0===d&&(d=!1);var c,h,
b;for(h in f)if(f.hasOwnProperty(h)&&(!d||!a.hasOwnProperty(h)))switch(c=f[h],h){case "children":case "children":if("undefined"!==typeof c)for(b=0;b<c.length;b+=1)a.appendChild(c[b]);break;case "style":this.proliferateElement(a[h],c);break;default:null===c?a[h]=null:"object"===typeof c?(a.hasOwnProperty(h)||(a[h]=new c.constructor),this.proliferateElement(a[h],c,d)):a[h]=c}return a};b.prototype.resetElement=function(a,f){var d=this,c=this.schema.position,b=c.offset;this.element=this.createElement("div",
{className:"control",style:{position:"absolute",width:0,height:0,boxSizing:"border-box",opacity:".84"}});this.elementInner=this.createElement("div",{className:"control-inner",textContent:this.schema.label||"",style:{position:"absolute",boxSizing:"border-box",textAlign:"center"}});this.element.appendChild(this.elementInner);"left"===c.horizontal?this.element.style.left="0":"right"===c.horizontal?this.element.style.right="0":"center"===c.horizontal&&(this.element.style.left="50%");"top"===c.vertical?
this.element.style.top="0":"bottom"===c.vertical?this.element.style.bottom="0":"center"===c.vertical&&(this.element.style.top="50%");this.passElementStyles(a.global);this.passElementStyles(a[f]);this.passElementStyles(this.schema.styles);b.left&&(this.elementInner.style.marginLeft=this.createPixelMeasurement(b.left));b.top&&(this.elementInner.style.marginTop=this.createPixelMeasurement(b.top));setTimeout(function(){"center"===c.horizontal&&(d.elementInner.style.left=d.createHalfSizeMeasurement(d.elementInner,
"width","offsetWidth"));"center"===c.vertical&&(d.elementInner.style.top=d.createHalfSizeMeasurement(d.elementInner,"height","offsetHeight"))})};b.prototype.createPixelMeasurement=function(a){return a?"number"===typeof a||a.constructor===Number?a+"px":a:"0"};b.prototype.createHalfSizeMeasurement=function(a,f,d){f=a.style[f]||d&&a[d];if(!f)return"0px";a=Number(f.replace(/[^\d]/g,""))||0;f=f.replace(/[\d]/g,"")||"px";return Math.round(a/-2)+f};b.prototype.passElementStyles=function(a){a&&(a.element&&
this.proliferateElement(this.element,a.element),a.elementInner&&this.proliferateElement(this.elementInner,a.elementInner))};b.prototype.setRotation=function(a,f){a.style.transform="rotate("+f+"deg)"};b.prototype.getOffsets=function(a){var f;a.offsetParent&&a!==a.offsetParent?(f=this.getOffsets(a.offsetParent),f[0]+=a.offsetLeft,f[1]+=a.offsetTop):f=[a.offsetLeft,a.offsetTop];return f};return b}();e.Control=g})(TouchPassr||(TouchPassr={}));
(function(e){var g=function(b){function a(){b.apply(this,arguments)}__extends(a,b);a.prototype.resetElement=function(a){var d=this.onEvent.bind(this,"activated"),c=this.onEvent.bind(this,"deactivated");b.prototype.resetElement.call(this,a,"Button");this.element.addEventListener("mousedown",d);this.element.addEventListener("touchstart",d);this.element.addEventListener("mouseup",c);this.element.addEventListener("touchend",c)};a.prototype.onEvent=function(a,d){var c=this.schema.pipes[a],b,l;if(c)for(b in c)if(c.hasOwnProperty(b))for(l=
0;l<c[b].length;l+=1)this.InputWriter.callEvent(b,c[b][l],d)};return a}(e.Control);e.ButtonControl=g})(TouchPassr||(TouchPassr={}));
(function(e){var g=function(b){function a(){b.apply(this,arguments)}__extends(a,b);a.prototype.resetElement=function(a){b.prototype.resetElement.call(this,a,"Joystick");var d=this.schema.directions,c,h,l,e,g,k;this.proliferateElement(this.elementInner,{style:{"border-radius":"100%"}});this.elementCircle=this.createElement("div",{className:"control-inner control-joystick-circle",style:{position:"absolute",background:"red",borderRadius:"100%"}});this.proliferateElement(this.elementCircle,a.Joystick.circle);
for(k=0;k<d.length;k+=1)h=d[k].degrees,c=Math.sin(h*Math.PI/180),l=Math.cos(h*Math.PI/180),e=50*l+50,g=50*c+50,c=this.createElement("div",{className:"control-joystick-tick",style:{position:"absolute",left:e+"%",top:g+"%",marginLeft:5*-l-5+"px",marginTop:2*-c-1+"px"}}),this.proliferateElement(c,a.Joystick.tick),this.setRotation(c,h),this.elementCircle.appendChild(c);this.elementDragLine=this.createElement("div",{className:"control-joystick-drag-line",style:{position:"absolute",opacity:"0",top:".77cm",
left:".77cm"}});this.proliferateElement(this.elementDragLine,a.Joystick.dragLine);this.elementCircle.appendChild(this.elementDragLine);this.elementDragShadow=this.createElement("div",{className:"control-joystick-drag-shadow",style:{position:"absolute",opacity:"1",top:"14%",right:"14%",bottom:"14%",left:"14%",marginLeft:"0",marginTop:"0",borderRadius:"100%"}});this.proliferateElement(this.elementDragShadow,a.Joystick.dragShadow);this.elementCircle.appendChild(this.elementDragShadow);this.elementInner.appendChild(this.elementCircle);
this.elementInner.addEventListener("click",this.triggerDragger.bind(this));this.elementInner.addEventListener("touchmove",this.triggerDragger.bind(this));this.elementInner.addEventListener("mousemove",this.triggerDragger.bind(this));this.elementInner.addEventListener("mouseover",this.positionDraggerEnable.bind(this));this.elementInner.addEventListener("touchstart",this.positionDraggerEnable.bind(this));this.elementInner.addEventListener("mouseout",this.positionDraggerDisable.bind(this));this.elementInner.addEventListener("touchend",
this.positionDraggerDisable.bind(this))};a.prototype.positionDraggerEnable=function(){this.dragEnabled=!0;this.elementDragLine.style.opacity="1"};a.prototype.positionDraggerDisable=function(){this.dragEnabled=!1;this.elementDragLine.style.opacity="0";this.elementDragShadow.style.top="14%";this.elementDragShadow.style.right="14%";this.elementDragShadow.style.bottom="14%";this.elementDragShadow.style.left="14%";if(this.currentDirection){if(this.currentDirection.pipes&&this.currentDirection.pipes.deactivated)this.onEvent(this.currentDirection.pipes.deactivated,
event);this.currentDirection=void 0}};a.prototype.triggerDragger=function(a){a.preventDefault();if(this.dragEnabled){var d=this.getEventCoordinates(a),c=d[0],d=d[1],b=this.getOffsets(this.elementInner),c=this.getThetaRaw(c-(b[0]+this.elementInner.offsetWidth/2)|0,b[1]+this.elementInner.offsetHeight/2-d|0),c=this.findClosestDirection(c),c=this.schema.directions[c],d=c.degrees,e=this.getThetaComponents(d),b=e[0],e=-e[1];this.elementDragLine.style.marginLeft=(77*b|0)+"%";this.elementDragLine.style.marginTop=
(77*e|0)+"%";this.elementDragShadow.style.top=(14+10*e|0)+"%";this.elementDragShadow.style.right=(14-10*b|0)+"%";this.elementDragShadow.style.bottom=(14-10*e|0)+"%";this.elementDragShadow.style.left=(14+10*b|0)+"%";this.setRotation(this.elementDragLine,(d+450)%360);this.positionDraggerEnable();this.setCurrentDirection(c,a)}};a.prototype.getEventCoordinates=function(a){return"touchmove"===a.type?(a=a.touches[0],[a.pageX,a.pageY]):[a.x,a.y]};a.prototype.getThetaRaw=function(a,b){return 0<a?0<b?180*
Math.atan(a/b)/Math.PI:180*-Math.atan(b/a)/Math.PI+90:0>b?180*Math.atan(a/b)/Math.PI+180:180*-Math.atan(b/a)/Math.PI+270};a.prototype.getThetaComponents=function(a){a=a*Math.PI/180;return[Math.sin(a),Math.cos(a)]};a.prototype.findClosestDirection=function(a){var b=this.schema.directions,c=Math.abs(b[0].degrees-a),e=b[0].degrees,g=0,n=0,m,k;for(k=1;k<b.length;k+=1)m=Math.abs(b[k].degrees-a),m<c&&(c=m,n=k),b[k].degrees<e&&(e=b[k].degrees,g=k);m=Math.abs(e+360-a);m<c&&(n=g);return n};a.prototype.setCurrentDirection=
function(a,b){if(this.currentDirection!==a){if(this.currentDirection&&this.currentDirection.pipes&&this.currentDirection.pipes.deactivated)this.onEvent(this.currentDirection.pipes.deactivated,b);if(a.pipes&&a.pipes.activated)this.onEvent(a.pipes.activated,b);this.currentDirection=a}};a.prototype.onEvent=function(a,b){var c,e;for(c in a)if(a.hasOwnProperty(c))for(e=0;e<a[c].length;e+=1)this.InputWriter.callEvent(c,a[c][e],b)};return a}(e.Control);e.JoystickControl=g})(TouchPassr||(TouchPassr={}));
(function(e){var g=function(){function b(a){if("undefined"===typeof a)throw Error("No settings object given to TouchPassr.");if("undefined"===typeof a.InputWriter)throw Error("No InputWriter given to TouchPassr.");this.InputWriter=a.InputWriter;this.styles=a.styles||{};this.resetContainer(a.container);this.controls={};a.controls&&this.addControls(a.controls);(this.enabled="undefined"===typeof a.enabled?!0:a.enabled)?this.enable():this.disable()}b.prototype.getInputWriter=function(){return this.InputWriter};
b.prototype.getEnabled=function(){return this.enabled};b.prototype.getStyles=function(){return this.styles};b.prototype.getControls=function(){return this.controls};b.prototype.getContainer=function(){return this.container};b.prototype.getParentContainer=function(){return this.parentContainer};b.prototype.enable=function(){this.enabled=!0;this.container.style.display="block"};b.prototype.disable=function(){this.enabled=!1;this.container.style.display="none"};b.prototype.setParentContainer=function(a){this.parentContainer=
a;this.parentContainer.appendChild(this.container)};b.prototype.addControls=function(a){for(var b in a)a.hasOwnProperty(b)&&this.addControl(a[b])};b.prototype.addControl=function(a){if(!b.controlClasses.hasOwnProperty(a.control))throw Error("Unknown control schema: '"+a.control+"'.");var e=new b.controlClasses[a.control](this.InputWriter,a,this.styles);this.controls[a.name]=e;this.container.appendChild(e.getElement())};b.prototype.resetContainer=function(a){this.container=e.Control.prototype.createElement("div",
{className:"touch-passer-container",style:{position:"absolute",top:0,right:0,bottom:0,left:0}});a&&this.setParentContainer(a)};b.controlClasses={Button:e.ButtonControl,Joystick:e.JoystickControl};return b}();e.TouchPassr=g})(TouchPassr||(TouchPassr={}));
var UsageHelpr;
(function(f){var g=function(){function c(a){void 0===a&&(a={});this.openings=a.openings||[];this.options=a.options||{};this.optionHelp=a.optionHelp||"";this.aliases=a.aliases||[];this.logger=a.logger||console.log.bind(console)}c.prototype.displayHelpMenu=function(){var a=this;this.openings.forEach(function(b){return a.logHelpText(b)})};c.prototype.displayHelpOptions=function(){var a=this;this.logHelpText([this.optionHelp,"code"]);Object.keys(this.options).forEach(function(b){return a.displayHelpGroupSummary(b)});this.logHelpText(["\r\n"+
this.optionHelp,"code"])};c.prototype.displayHelpGroupSummary=function(a){var b=this.options[a],e=0,d;this.logger("\r\n%c"+a,c.styles.head);for(d=0;d<b.length;d+=1)e=Math.max(e,this.filterHelpText(b[d].title).length);for(d=0;d<b.length;d+=1)a=b[d],this.logger("%c"+this.padTextRight(this.filterHelpText(a.title),e)+"%c  // "+a.description,c.styles.code,c.styles.comment)};c.prototype.displayHelpOption=function(a){var b=this.options[a],e,d,c;this.logHelpText(["\r\n\r\n%c"+a+"\r\n-------\r\n\r\n","head"]);
for(d=0;d<b.length;d+=1){a=b[d];this.logHelpText(["%c"+a.title+"%c  ---  "+a.description,"head","italic"]);a.usage&&this.logHelpText(["%cUsage: %c"+a.usage,"comment","code"]);if(a.examples)for(c=0;c<a.examples.length;c+=1)e=a.examples[c],this.logger("\r\n"),this.logHelpText(["%c// "+e.comment,"comment"]),this.logHelpText(["%c"+this.padTextRight(this.filterHelpText(e.code),0),"code"]);this.logger("\r\n")}};c.prototype.logHelpText=function(a){if("string"===typeof a)return this.logHelpText([a]);var b=
a[0];a=a.slice(1).filter(function(a){return c.styles.hasOwnProperty(a)}).map(function(a){return c.styles[a]});this.logger.apply(this,[this.filterHelpText(b)].concat(a,[""]))};c.prototype.filterHelpText=function(a){if(a.constructor===Array)return this.filterHelpText(a[0]);var b;for(b=0;b<this.aliases.length;b+=1)a=a.replace(new RegExp(this.aliases[b][0],"g"),this.aliases[b][1]);return a};c.prototype.padTextRight=function(a,b,c){void 0===c&&(c=" ");b=1+b-a.length;return 0>=b?a:a+Array.call(Array,b).join(c)};
c.styles={code:"color: #000077; font-weight: bold; font-family: Consolas, Courier New, monospace;",comment:"color: #497749; font-style: italic;",head:"font-weight: bold; font-size: 117%;",italic:"font-style: italic;",none:""};return c}();f.UsageHelpr=g})(UsageHelpr||(UsageHelpr={}));
var __extends=this&&this.__extends||function(d,h){function c(){this.constructor=d}for(var a in h)h.hasOwnProperty(a)&&(d[a]=h[a]);d.prototype=null===h?Object.create(h):(c.prototype=h.prototype,new c)},UserWrappr;
(function(d){(function(d){var c=function(){function a(a){this.UserWrapper=a;this.GameStarter=this.UserWrapper.getGameStarter()}a.prototype.getParentControlElement=function(a){return"control"!==a.className&&a.parentNode?this.getParentControlElement(a.parentElement):a};return a}();d.OptionsGenerator=c})(d.UISchemas||(d.UISchemas={}))})(UserWrappr||(UserWrappr={}));
(function(d){(function(d){var c=function(a){function b(){a.apply(this,arguments)}__extends(b,a);b.prototype.generate=function(f){var g=document.createElement("div"),a=f.options instanceof Function?f.options.call(self,this.GameStarter):f.options,e=this,k,b,c;g.className="select-options select-options-buttons";for(c=0;c<a.length;c+=1)k=a[c],b=document.createElement("div"),b.className="select-option options-button-option",b.textContent=k.title,b.onclick=function(g,f){"on"===e.getParentControlElement(f).getAttribute("active")&&
(g.callback.call(e,e.GameStarter,g,f),"true"===f.getAttribute("option-enabled")?(f.setAttribute("option-enabled","false"),f.className="select-option options-button-option option-disabled"):(f.setAttribute("option-enabled","true"),f.className="select-option options-button-option option-enabled"))}.bind(this,f,b),this.ensureLocalStorageButtonValue(b,k,f),k[f.keyActive||"active"]?(b.className+=" option-enabled",b.setAttribute("option-enabled","true")):f.assumeInactive?(b.className+=" option-disabled",
b.setAttribute("option-enabled","false")):b.setAttribute("option-enabled","true"),g.appendChild(b);return g};b.prototype.ensureLocalStorageButtonValue=function(f,g,a){var e=a.title+"::"+g.title,b=g.source.call(this,this.GameStarter).toString();f.setAttribute("localStorageKey",e);this.GameStarter.ItemsHolder.addItem(e,{storeLocally:!0,valueDefault:b});"true"===this.GameStarter.ItemsHolder.getItem(e).toString().toLowerCase()&&(g[a.keyActive||"active"]=!0,a.callback.call(this,this.GameStarter,a,f))};
return b}(d.OptionsGenerator);d.ButtonsGenerator=c})(d.UISchemas||(d.UISchemas={}))})(UserWrappr||(UserWrappr={}));
(function(d){(function(d){var c=function(a){function b(){a.apply(this,arguments)}__extends(b,a);b.prototype.generate=function(f){var g=document.createElement("div"),a=document.createElement("div"),e=document.createElement("div"),b=document.createElement("div"),c=this.createUploaderDiv();f=this.createMapSelectorDiv(f);var d=this;g.className="select-options select-options-level-editor";a.className="select-option select-option-large options-button-option";a.innerHTML="Start the <br /> Level Editor!";
a.onclick=function(){d.GameStarter.LevelEditor.enable()};e.className=b.className="select-option-title";e.innerHTML=b.innerHTML="<em>- or -</em><br />";g.appendChild(a);g.appendChild(e);g.appendChild(c);g.appendChild(b);g.appendChild(f);return g};b.prototype.createUploaderDiv=function(){var f=document.createElement("div"),g=document.createElement("input");f.className="select-option select-option-large options-button-option";f.innerHTML="Continue an<br />editor file!";f.setAttribute("textOld",f.textContent);
g.type="file";g.className="select-upload-input";g.onchange=this.handleFileDrop.bind(this,g,f);f.ondragenter=this.handleFileDragEnter.bind(this,f);f.ondragover=this.handleFileDragOver.bind(this,f);f.ondragleave=g.ondragend=this.handleFileDragLeave.bind(this,f);f.ondrop=this.handleFileDrop.bind(this,g,f);f.onclick=g.click.bind(g);f.appendChild(g);return f};b.prototype.createMapSelectorDiv=function(f){var g=!0,a=this.GameStarter.createElement("div",{className:"select-options-group select-options-editor-maps-selector"}),
b=this.GameStarter.createElement("div",{className:"select-option select-option-large options-button-option"}),k=this.GameStarter.createElement("div",{className:"select-options-holder select-options-editor-maps-holder"}),c=this.UserWrapper.getGenerators().MapsGrid.generate(this.GameStarter.proliferate({callback:f.callback},f.maps));b.onclick=function(f){(g=!g)?(b.textContent="(cancel)",k.style.position="",c.style.height=""):(b.innerHTML="Edit a <br />built-in map!",k.style.position="absolute",c.style.height=
"0");a.parentElement&&[].slice.call(a.parentElement.children).forEach(function(f){f!==a&&(f.style.display=g?"none":"block")})};b.onclick(null);k.appendChild(c);a.appendChild(b);a.appendChild(k);return a};b.prototype.handleFileDragEnter=function(f,g){g.dataTransfer&&(g.dataTransfer.dropEffect="copy");f.className+=" hovering"};b.prototype.handleFileDragOver=function(f,g){g.preventDefault();return!1};b.prototype.handleFileDragLeave=function(f,g){g.dataTransfer&&(g.dataTransfer.dropEffect="none");f.className=
f.className.replace(" hovering","")};b.prototype.handleFileDrop=function(f,g,a){var b=(f.files||a.dataTransfer.files)[0],k=new FileReader;this.handleFileDragLeave(f,a);a.preventDefault();a.stopPropagation();k.onprogress=this.handleFileUploadProgress.bind(this,b,g);k.onloadend=this.handleFileUploadCompletion.bind(this,b,g);k.readAsText(b)};b.prototype.handleFileUploadProgress=function(f,g,a){a.lengthComputable&&(a=Math.round(a.loaded/a.total*100),100<a&&(a=100),g.innerText="Uploading '"+f.name+"' ("+
a+"%)...")};b.prototype.handleFileUploadCompletion=function(f,g,a){this.GameStarter.LevelEditor.handleUploadCompletion(a);g.innerText=g.getAttribute("textOld")};return b}(d.OptionsGenerator);d.LevelEditorGenerator=c})(d.UISchemas||(d.UISchemas={}))})(UserWrappr||(UserWrappr={}));
(function(d){(function(d){var c=function(a){function b(){a.apply(this,arguments)}__extends(b,a);b.prototype.generate=function(f){var a=document.createElement("div");a.className="select-options select-options-maps-grid";f.rangeX&&f.rangeY&&a.appendChild(this.generateRangedTable(f));f.extras&&this.appendExtras(a,f);return a};b.prototype.generateRangedTable=function(f){var a=this,b=document.createElement("table"),e=f.rangeX,k=f.rangeY,c,d,l,h;for(l=k[0];l<=k[1];l+=1){c=document.createElement("tr");c.className=
"maps-grid-row";for(h=e[0];h<=e[1];h+=1)d=document.createElement("td"),d.className="select-option maps-grid-option maps-grid-option-range",d.textContent=l+"-"+h,d.onclick=function(f){"on"===a.getParentControlElement(d).getAttribute("active")&&f()}.bind(a,f.callback.bind(a,a.GameStarter,f,d)),c.appendChild(d);b.appendChild(c)}return b};b.prototype.appendExtras=function(a,g){var b,e,k;for(k=0;k<g.extras.length;k+=1)if(e=g.extras[k],b=document.createElement("div"),b.className="select-option maps-grid-option maps-grid-option-extra",
b.textContent=e.title,b.setAttribute("value",e.title),b.onclick=e.callback.bind(this,this.GameStarter,g,b),a.appendChild(b),e.extraElements)for(b=0;b<e.extraElements.length;b+=1)a.appendChild(this.GameStarter.createElement(e.extraElements[b].tag,e.extraElements[b].options))};return b}(d.OptionsGenerator);d.MapsGridGenerator=c})(d.UISchemas||(d.UISchemas={}))})(UserWrappr||(UserWrappr={}));
(function(d){(function(d){var c=function(a){function b(){a.apply(this,arguments)}__extends(b,a);b.prototype.generate=function(a){var g=document.createElement("div"),c=document.createElement("table"),e,k,d,h,l;g.className="select-options select-options-table";if(a.options)for(l=0;l<a.options.length;l+=1)k=document.createElement("tr"),d=document.createElement("td"),h=document.createElement("td"),e=a.options[l],d.className="options-label-"+e.type,d.textContent=e.title,h.className="options-cell-"+e.type,
k.appendChild(d),k.appendChild(h),d=b.optionTypes[a.options[l].type].call(this,h,e,a),e.storeLocally&&this.ensureLocalStorageInputValue(d,e,a),c.appendChild(k);g.appendChild(c);if(a.actions)for(l=0;l<a.actions.length;l+=1)k=document.createElement("div"),c=a.actions[l],k.className="select-option options-button-option",k.textContent=c.title,k.onclick=c.action.bind(this,this.GameStarter),g.appendChild(k);return g};b.prototype.setBooleanInput=function(a,b,c){c=b.source.call(this,this.GameStarter);var e=
this;a.className="select-option options-button-option option-"+(c?"enabled":"disabled");a.textContent=c?"on":"off";a.onclick=function(){a.setValue("off"===a.textContent)};a.setValue=function(c){if(c.constructor===String)if("false"===c||"off"===c)c=!1;else if("true"===c||"on"===c)c=!0;c?(b.enable.call(e,e.GameStarter),a.textContent="on",a.className=a.className.replace("disabled","enabled")):(b.disable.call(e,e.GameStarter),a.textContent="off",a.className=a.className.replace("enabled","disabled"));
b.storeLocally&&e.storeLocalStorageValue(a,c.toString())};return a};b.prototype.setKeyInput=function(a,b,c){c=b.source.call(this,this.GameStarter);var e=this.UserWrapper.getAllPossibleKeys(),k=[],d,h=this,l,n,m;for(n=0;n<c.length;n+=1){l=c[n].toLowerCase();d=document.createElement("select");d.className="options-key-option";d.value=d.valueOld=l;for(m=0;m<e.length;m+=1)d.appendChild(new Option(e[m])),e[m]===l&&(d.selectedIndex=m);d.onchange=function(a){b.callback.call(h,h.GameStarter,a.valueOld,a.value);
b.storeLocally&&h.storeLocalStorageValue(a,a.value)}.bind(void 0,d);k.push(d);a.appendChild(d)}return k};b.prototype.setNumberInput=function(a,b,c){var e=document.createElement("input"),d=this;e.type="number";e.value=Number(b.source.call(d,d.GameStarter)).toString();e.min=(b.minimum||0).toString();e.max=(b.maximum||Math.max(b.minimum+10,10)).toString();e.onchange=e.oninput=function(){e.checkValidity()&&b.update.call(d,d.GameStarter,e.value);b.storeLocally&&d.storeLocalStorageValue(e,e.value)};a.appendChild(e);
return e};b.prototype.setSelectInput=function(a,b,c){var e=document.createElement("select");c=b.options(this.GameStarter);var d=this,h;for(h=0;h<c.length;h+=1)e.appendChild(new Option(c[h]));e.value=b.source.call(d,d.GameStarter);e.onchange=function(){b.update.call(d,d.GameStarter,e.value);e.blur();b.storeLocally&&d.storeLocalStorageValue(e,e.value)};a.appendChild(e);return e};b.prototype.setScreenSizeInput=function(a,b,c){var e=this;b.options=function(){return Object.keys(e.UserWrapper.getSizes())};
b.source=function(){return e.UserWrapper.getCurrentSize().name};b.update=function(a,b){b!==e.UserWrapper.getCurrentSize()&&e.UserWrapper.setCurrentSize(b)};return e.setSelectInput(a,b,c)};b.prototype.ensureLocalStorageInputValue=function(a,b,c){if(a.constructor===Array)this.ensureLocalStorageValues(a,b,c);else if(c=c.title+"::"+b.title,b=b.source.call(this,this.GameStarter).toString(),a.setAttribute("localStorageKey",c),this.GameStarter.ItemsHolder.addItem(c,{storeLocally:!0,valueDefault:b}),b=this.GameStarter.ItemsHolder.getItem(c),
""!==b&&b!==a.value)if(a.value=b,a.setValue)a.setValue(b);else if(a.onchange)a.onchange(void 0);else if(a.onclick)a.onclick(void 0)};b.prototype.ensureLocalStorageValues=function(a,b,c){c=c.title+"::"+b.title;b=b.source.call(this,this.GameStarter);var e,d,h;for(h=0;h<a.length;h+=1)if(e=c+"::"+h,d=a[h],d.setAttribute("localStorageKey",e),this.GameStarter.ItemsHolder.addItem(e,{storeLocally:!0,valueDefault:b[h]}),e=this.GameStarter.ItemsHolder.getItem(e),""!==e&&e!==d.value)if(d.value=e,d.onchange)d.onchange(void 0);
else if(d.onclick)d.onclick(void 0)};b.prototype.storeLocalStorageValue=function(a,b){var c=a.getAttribute("localStorageKey");c&&(this.GameStarter.ItemsHolder.setItem(c,b),this.GameStarter.ItemsHolder.saveItem(c))};b.optionTypes={Boolean:b.prototype.setBooleanInput,Keys:b.prototype.setKeyInput,Number:b.prototype.setNumberInput,Select:b.prototype.setSelectInput,ScreenSize:b.prototype.setScreenSizeInput};return b}(d.OptionsGenerator);d.TableGenerator=c})(d.UISchemas||(d.UISchemas={}))})(UserWrappr||
(UserWrappr={}));
(function(d){var h=function(){function c(a){this.documentElement=document.documentElement;this.requestFullScreen=(this.documentElement.requestFullScreen||this.documentElement.webkitRequestFullScreen||this.documentElement.mozRequestFullScreen||this.documentElement.msRequestFullscreen||function(){alert("Not able to request full screen...")}).bind(this.documentElement);this.cancelFullScreen=(this.documentElement.cancelFullScreen||this.documentElement.webkitCancelFullScreen||this.documentElement.mozCancelFullScreen||this.documentElement.msCancelFullScreen||
function(){alert("Not able to cancel full screen...")}).bind(document);if("undefined"===typeof a)throw Error("No settings object given to UserWrappr.");if("undefined"===typeof a.GameStartrConstructor)throw Error("No GameStartrConstructor given to UserWrappr.");if("undefined"===typeof a.globalName)throw Error("No globalName given to UserWrappr.");if("undefined"===typeof a.sizes)throw Error("No sizes given to UserWrappr.");if("undefined"===typeof a.sizeDefault)throw Error("No sizeDefault given to UserWrappr.");
if("undefined"===typeof a.schemas)throw Error("No schemas given to UserWrappr.");this.settings=a;this.GameStartrConstructor=a.GameStartrConstructor;this.globalName=a.globalName;this.sizes=this.importSizes(a.sizes);this.customs=a.customs||{};this.gameElementSelector=a.gameElementSelector||"#game";this.gameControlsSelector=a.gameControlsSelector||"#controls";this.logger=a.logger||console.log.bind(console);this.isFullScreen=!1;this.setCurrentSize(this.sizes[a.sizeDefault]);this.allPossibleKeys=a.allPossibleKeys||
c.allPossibleKeys;this.GameStartrConstructor.prototype.proliferate(this.customs,this.currentSize,!0);this.resetGameStarter(a,this.customs)}c.prototype.resetGameStarter=function(a,b){void 0===b&&(b={});this.loadGameStarter(this.fixCustoms(b));window[a.globalName]=this.GameStarter;this.GameStarter.UserWrapper=this;this.loadGenerators();this.loadControls(a.schemas);a.styleSheet&&this.GameStarter.addPageStyles(a.styleSheet);this.resetPageVisibilityHandlers();this.GameStarter.gameStart();this.startCheckingDevices()};
c.prototype.getGameStartrConstructor=function(){return this.GameStartrConstructor};c.prototype.getGameStarter=function(){return this.GameStarter};c.prototype.getItemsHolder=function(){return this.ItemsHolder};c.prototype.getSettings=function(){return this.settings};c.prototype.getCustoms=function(){return this.customs};c.prototype.getAllPossibleKeys=function(){return this.allPossibleKeys};c.prototype.getSizes=function(){return this.sizes};c.prototype.getCurrentSize=function(){return this.currentSize};
c.prototype.getIsFullScreen=function(){return this.isFullScreen};c.prototype.getIsPageHidden=function(){return this.isPageHidden};c.prototype.getLogger=function(){return this.logger};c.prototype.getGenerators=function(){return this.generators};c.prototype.getDocumentElement=function(){return this.documentElement};c.prototype.getRequestFullScreen=function(){return this.requestFullScreen};c.prototype.getCancelFullScreen=function(){return this.cancelFullScreen};c.prototype.getDeviceChecker=function(){return this.deviceChecker};
c.prototype.setCurrentSize=function(a){if("string"===typeof a||a.constructor===String){if(!this.sizes.hasOwnProperty(a))throw Error("Size "+a+" does not exist on the UserWrappr.");a=this.sizes[a]}this.customs=this.fixCustoms(this.customs);a.full?(this.requestFullScreen(),this.isFullScreen=!0):this.isFullScreen&&(this.cancelFullScreen(),this.isFullScreen=!1);this.currentSize=a;this.GameStarter&&(this.GameStarter.container.parentNode.removeChild(this.GameStarter.container),this.resetGameStarter(this.settings,
this.customs))};c.prototype.startCheckingDevices=function(){this.checkDevices()};c.prototype.checkDevices=function(){this.deviceChecker=setTimeout(this.checkDevices.bind(this),this.GameStarter.GamesRunner.getPaused()?117:this.GameStarter.GamesRunner.getInterval()/this.GameStarter.GamesRunner.getSpeed());this.GameStarter.DeviceLayer.checkNavigatorGamepads();this.GameStarter.DeviceLayer.activateAllGamepadTriggers()};c.prototype.importSizes=function(a){a=this.GameStartrConstructor.prototype.proliferate({},
a);for(var b in a)a.hasOwnProperty(b)&&(a[b].name=a[b].name||b);return a};c.prototype.fixCustoms=function(a){a=this.GameStartrConstructor.prototype.proliferate({},a);this.GameStartrConstructor.prototype.proliferate(a,this.currentSize);isFinite(a.width)||(a.width=document.body.clientWidth);isFinite(a.height)||(a.height=a.full?screen.height:this.isFullScreen?window.innerHeight-140:window.innerHeight,a.height-=126);return a};c.prototype.resetPageVisibilityHandlers=function(){document.addEventListener("visibilitychange",
this.handleVisibilityChange.bind(this))};c.prototype.handleVisibilityChange=function(){switch(document.visibilityState){case "hidden":this.onPageHidden();break;case "visible":this.onPageVisible()}};c.prototype.onPageHidden=function(){this.GameStarter.GamesRunner.getPaused()||(this.isPageHidden=!0,this.GameStarter.GamesRunner.pause())};c.prototype.onPageVisible=function(){this.isPageHidden&&(this.isPageHidden=!1,this.GameStarter.GamesRunner.play())};c.prototype.loadGameStarter=function(a){var b=document.querySelector(this.gameElementSelector);
this.GameStarter&&this.GameStarter.GamesRunner.pause();this.GameStarter=new this.GameStartrConstructor(a);b.textContent="";b.appendChild(this.GameStarter.container);this.GameStarter.proliferate(document.body,{onkeydown:this.GameStarter.InputWriter.makePipe("onkeydown","keyCode"),onkeyup:this.GameStarter.InputWriter.makePipe("onkeyup","keyCode")});this.GameStarter.proliferate(b,{onmousedown:this.GameStarter.InputWriter.makePipe("onmousedown","which"),oncontextmenu:this.GameStarter.InputWriter.makePipe("oncontextmenu",
null,!0)})};c.prototype.loadGenerators=function(){this.generators={OptionsButtons:new d.UISchemas.ButtonsGenerator(this),OptionsTable:new d.UISchemas.TableGenerator(this),LevelEditor:new d.UISchemas.LevelEditorGenerator(this),MapsGrid:new d.UISchemas.MapsGridGenerator(this)}};c.prototype.loadControls=function(a){var b=document.querySelector(this.gameControlsSelector),c=a.length,d;this.ItemsHolder=new ItemsHoldr.ItemsHoldr({prefix:this.globalName+"::UserWrapper::ItemsHolder"});b.textContent="";b.className=
"length-"+c;for(d=0;d<c;d+=1)b.appendChild(this.loadControlDiv(a[d]))};c.prototype.loadControlDiv=function(a){var b=document.createElement("div"),c=document.createElement("h4"),d=document.createElement("div");b.className="control";b.id="control-"+a.title;c.textContent=a.title;d.className="control-inner";d.appendChild(this.generators[a.generator].generate(a));b.appendChild(c);b.appendChild(d);b.onmouseover=function(){setTimeout(function(){b.setAttribute("active","on")},35)};b.onmouseout=function(){b.setAttribute("active",
"off")};return b};c.allPossibleKeys="a b c d e f g h i j k l m n o p q r s t u v w x y z up right down left space shift ctrl".split(" ");return c}();d.UserWrappr=h})(UserWrappr||(UserWrappr={}));
var WorldSeedr;
(function(l){var m=function(){function k(f,h){this.randomBetween=f;this.chooseAmong=h}k.prototype.calculateFromSpacing=function(f){if(!f)return 0;switch(f.constructor){case Array:return f[0].constructor===Number?this.randomBetween(f[0],f[1]):this.calculateFromPossibilities(f);case Object:return this.calculateFromPossibility(f);case Number:return f;default:throw Error("Unknown spacing requested: '"+f+"'.");}};k.prototype.calculateFromPossibility=function(f){var h=f.units||1;return this.randomBetween(f.min/h,
f.max/h)*h};k.prototype.calculateFromPossibilities=function(f){return this.calculateFromPossibility(this.chooseAmong(f).value)};return k}();l.SpacingCalculator=m})(WorldSeedr||(WorldSeedr={}));
(function(l){var m={top:"bottom",right:"left",bottom:"top",left:"right"},k={top:"height",right:"width",bottom:"height",left:"width"},f=["top","right","bottom","left"],h=["width","height"],n=function(){function e(a){if("undefined"===typeof a)throw Error("No settings object given to WorldSeedr.");if("undefined"===typeof a.possibilities)throw Error("No possibilities given to WorldSeedr.");this.possibilities=a.possibilities;this.random=a.random||Math.random.bind(Math);this.onPlacement=a.onPlacement||
console.log.bind(console,"Got:");this.spacingCalculator=new l.SpacingCalculator(this.randomBetween.bind(this),this.chooseAmong.bind(this));this.clearGeneratedCommands()}e.prototype.getPossibilities=function(){return this.possibilities};e.prototype.setPossibilities=function(a){this.possibilities=a};e.prototype.getOnPlacement=function(){return this.onPlacement};e.prototype.setOnPlacement=function(a){this.onPlacement=a};e.prototype.clearGeneratedCommands=function(){this.generatedCommands=[]};e.prototype.runGeneratedCommands=
function(){this.onPlacement(this.generatedCommands)};e.prototype.generate=function(a,b){var c=this.possibilities[a];if(!c)throw Error("No possibility exists under '"+a+"'");if(!c.contents)throw Error("Possibility '"+a+"' has no possibile outcomes.");return this.generateChildren(c,this.objectCopy(b))};e.prototype.generateFull=function(a){a=this.generate(a.title,a);var b,c;if(a&&a.children)for(c=0;c<a.children.length;c+=1)switch(b=a.children[c],b.type){case "Known":this.generatedCommands.push(b);break;
case "Random":this.generateFull(b);break;default:throw Error("Unknown child type: "+b.type);}};e.prototype.generateChildren=function(a,b,c){var d=a.contents,e=d.spacing||0;a=this.objectMerge(a,b);c=d.direction||c;switch(d.mode){case "Random":c=this.generateRandom(d,a,c,e);break;case "Certain":c=this.generateCertain(d,a,c,e);break;case "Repeat":c=this.generateRepeat(d,a,c,e);break;case "Multiple":c=this.generateMultiple(d,a,c,e);break;default:throw Error("Unknown contents mode: "+d.mode);}return this.wrapChoicePositionExtremes(c)};
e.prototype.generateCertain=function(a,b,c,d){var e=this;return a.children.map(function(a){if("Final"===a.type)return e.parseChoiceFinal(a,b,c);if(a=e.parseChoice(a,b,c))"Known"!==a.type&&(a.contents=e.generate(a.title,b)),e.shrinkPositionByChild(b,a,c,d);return a}).filter(function(a){return void 0!==a})};e.prototype.generateRepeat=function(a,b,c,d){a=a.children;for(var e=[],g,f=0;this.positionIsNotEmpty(b,c);){g=a[f];"Final"===g.type?g=this.parseChoiceFinal(g,b,c):(g=this.parseChoice(g,b,c))&&"Known"!==
g.type&&(g.contents=this.generate(g.title,b));if(g&&this.choiceFitsPosition(g,b))this.shrinkPositionByChild(b,g,c,d),e.push(g);else break;f+=1;f>=a.length&&(f=0)}return e};e.prototype.generateRandom=function(a,b,c,d){for(var e=[],f;this.positionIsNotEmpty(b,c);){f=this.generateChild(a,b,c);if(!f)break;this.shrinkPositionByChild(b,f,c,d);e.push(f);if(a.limit&&e.length>a.limit)return}return e};e.prototype.generateMultiple=function(a,b,c,d){var e=this;return a.children.map(function(a){a=e.parseChoice(a,
e.objectCopy(b),c);c&&e.movePositionBySpacing(b,c,d);return a})};e.prototype.generateChild=function(a,b,c){return(a=this.chooseAmongPosition(a.children,b))?this.parseChoice(a,b,c):void 0};e.prototype.parseChoice=function(a,b,c){var d=a.title,e=this.possibilities[d],d={title:d,type:a.type,arguments:a.arguments instanceof Array?this.chooseAmong(a.arguments).values:a.arguments,width:void 0,height:void 0,top:void 0,right:void 0,bottom:void 0,left:void 0};this.ensureSizingOnChoice(d,a,e);this.ensureDirectionBoundsOnChoice(d,
b);d[c]=d[m[c]]+d[k[c]];switch(e.contents.snap){case "top":d.bottom=d.top-d.height;break;case "right":d.left=d.right-d.width;break;case "bottom":d.top=d.bottom+d.height;break;case "left":d.right=d.left+d.width}a.stretch&&(d.arguments||(d.arguments={}),a.stretch.width&&(d.left=b.left,d.right=b.right,d.width=d.right-d.left,d.arguments.width=d.width),a.stretch.height&&(d.top=b.top,d.bottom=b.bottom,d.height=d.top-d.bottom,d.arguments.height=d.height));return d};e.prototype.parseChoiceFinal=function(a,
b,c){c=this.possibilities[a.source];return{type:"Known",title:a.title,arguments:a.arguments,width:c.width,height:c.height,top:b.top,right:b.right,bottom:b.bottom,left:b.left}};e.prototype.chooseAmong=function(a){if(a.length){if(1===a.length)return a[0];var b=this.randomPercentage(),c=0,d;for(d=0;d<a.length;d+=1)if(c+=a[d].percent,c>=b)return a[d]}};e.prototype.chooseAmongPosition=function(a,b){var c=b.right-b.left,d=b.top-b.bottom,e=this;return this.chooseAmong(a.filter(function(a){return e.choiceFitsSize(e.possibilities[a.title],
c,d)}))};e.prototype.choiceFitsSize=function(a,b,c){return a.width<=b&&a.height<=c};e.prototype.choiceFitsPosition=function(a,b){return this.choiceFitsSize(a,b.right-b.left,b.top-b.bottom)};e.prototype.positionIsNotEmpty=function(a,b){return"right"===b||"left"===b?a.left<a.right:a.top>a.bottom};e.prototype.shrinkPositionByChild=function(a,b,c,d){void 0===d&&(d=0);switch(c){case "top":a.bottom=b.top+this.spacingCalculator.calculateFromSpacing(d);break;case "right":a.left=b.right+this.spacingCalculator.calculateFromSpacing(d);
break;case "bottom":a.top=b.bottom-this.spacingCalculator.calculateFromSpacing(d);break;case "left":a.right=b.left-this.spacingCalculator.calculateFromSpacing(d)}};e.prototype.movePositionBySpacing=function(a,b,c){void 0===c&&(c=0);c=this.spacingCalculator.calculateFromSpacing(c);switch(b){case "top":a.top+=c;a.bottom+=c;break;case "right":a.left+=c;a.right+=c;break;case "bottom":a.top-=c;a.bottom-=c;break;case "left":a.left-=c;a.right-=c;break;default:throw Error("Unknown direction: "+b);}};e.prototype.wrapChoicePositionExtremes=
function(a){var b,c,d;if(a&&a.length){c=a[0];b={title:void 0,top:c.top,right:c.right,bottom:c.bottom,left:c.left,width:void 0,height:void 0,children:a};if(1===a.length)return b;for(d=1;d<a.length;d+=1){c=a[d];if(!Object.keys(c).length)return b;b.top=Math.max(b.top,c.top);b.right=Math.max(b.right,c.right);b.bottom=Math.min(b.bottom,c.bottom);b.left=Math.min(b.left,c.left)}b.width=b.right-b.left;b.height=b.top-b.bottom;return b}};e.prototype.ensureSizingOnChoice=function(a,b,c){var d,e;for(e in h)h.hasOwnProperty(e)&&
(d=h[e],a[d]=b.sizing&&"undefined"!==typeof b.sizing[d]?b.sizing[d]:c[d])};e.prototype.ensureDirectionBoundsOnChoice=function(a,b){for(var c in f)f.hasOwnProperty(c)&&(a[f[c]]=b[f[c]])};e.prototype.randomPercentage=function(){return Math.floor(100*this.random())+1};e.prototype.randomBetween=function(a,b){return Math.floor(this.random()*(1+b-a))+a};e.prototype.objectCopy=function(a){var b={},c;for(c in a)a.hasOwnProperty(c)&&(b[c]=a[c]);return b};e.prototype.objectMerge=function(a,b){var c=this.objectCopy(a),
d;for(d in b)b.hasOwnProperty(d)&&!c.hasOwnProperty(d)&&(c[d]=b[d]);return c};return e}();l.WorldSeedr=n})(WorldSeedr||(WorldSeedr={}));
(function(){function C(v,e){return(new ca(v,e)).beautify()}function ca(v,e){function C(a,c){var b=0;a&&(b=a.indentation_level,!H()&&a.lineIndent_level>b&&(b=a.lineIndent_level));return{mode:c,parent:a,last_text:a?a.last_text:"",last_word:a?a.last_word:"",declaration_statement:!1,declaration_assignment:!1,in_html_comment:!1,multiline_frame:!1,if_block:!1,else_block:!1,do_block:!1,do_while:!1,in_case_statement:!1,in_case:!1,case_body:!1,indentation_level:b,lineIndent_level:a?a.lineIndent_level:b,start_lineIndex:q.length,
had_comment:!1,ternary_depth:0}}function y(a){a=void 0===a?!1:a;if(q.length)for(U(q[q.length-1]);a&&1<q.length&&0===q[q.length-1].text.length;)q.pop(),U(q[q.length-1])}function U(a){for(;a.text.length&&(" "===a.text[a.text.length-1]||a.text[a.text.length-1]===D||a.text[a.text.length-1]===I);)a.text.pop()}function R(a){return a.replace(/^\s+|\s+$/g,"")}function H(){return 0===q[q.length-1].text.length}function F(a){a=void 0===a?!1:a;if(k.wrap_line_length&&!a){var c=q[q.length-1],b=0;0<c.text.length&&
(b=c.text.join("").length+f.length+(g?1:0),b>=k.wrap_line_length&&(a=!0))}(k.preserve_newlines&&E||a)&&!H()&&h(!1,!0)}function h(m,c){g=!1;if(!c&&";"!==a.last_text&&","!==a.last_text&&"="!==a.last_text&&"TK_OPERATOR"!==d)for(;a.mode===l.Statement&&!a.if_block&&!a.do_block;)A();if(1!==q.length||!H())if(m||!H())a.multiline_frame=!0,q.push({text:[]})}function r(m){m=m||f;if(H()){var c=q[q.length-1];if(k.keep_arrayIndentation&&a.mode===l.ArrayLiteral&&E){c.text.push("");for(var b=0;b<G.length;b+=1)c.text.push(G[b])}else if(I&&
c.text.push(I),c=a.indentation_level,1<q.length){b=q[q.length-1];a.lineIndent_level=c;for(var d=0;d<c;d+=1)b.text.push(D)}}c=q[q.length-1];g&&c.text.length&&(b=c.text[c.text.length-1]," "!==b&&b!==D&&c.text.push(" "));g=!1;q[q.length-1].text.push(m)}function V(a){if(!a.multiline_frame){a=a.start_lineIndex;for(var c=0,b;a<q.length;)b=q[a],a++,0!==b.text.length&&(c=I&&b.text[0]===I?1:0,b.text[c]===D&&b.text.splice(c,1))}}function M(b){a?(P.push(a),w=a):w=C(null,b);a=C(w,b)}function N(a){return t(a,
[l.Expression,l.ForInitializer,l.Conditional])}function A(){0<P.length&&(w=a,a=P.pop(),w.mode===l.Statement&&V(w))}function Q(){return a.parent.mode===l.ObjectLiteral&&a.mode===l.Statement&&":"===a.last_text&&0===a.ternary_depth}function J(){return"TK_RESERVED"===d&&t(a.last_text,["var","let","const"])&&"TK_WORD"===p||"TK_RESERVED"===d&&"do"===a.last_text||"TK_RESERVED"===d&&"return"===a.last_text&&!E||"TK_RESERVED"===d&&"else"===a.last_text&&("TK_RESERVED"!==p||"if"!==f)||"TK_END_EXPR"===d&&(w.mode===
l.ForInitializer||w.mode===l.Conditional)||"TK_WORD"===d&&a.mode===l.BlockStatement&&!a.in_case&&"--"!==f&&"++"!==f&&"TK_WORD"!==p&&"TK_RESERVED"!==p||a.mode===l.ObjectLiteral&&":"===a.last_text&&0===a.ternary_depth?(M(l.Statement),a.indentation_level+=1,"TK_RESERVED"===d&&t(a.last_text,["var","let","const"])&&"TK_WORD"===p&&(a.declaration_statement=!0),Q()||F("TK_RESERVED"===p&&t(f,["do","for","if","while"])),!0):!1}function O(a){return t(a,"case return do if throw else".split(" "))}function t(a,
b){for(var d=0;d<b.length;d+=1)if(b[d]===a)return!0;return!1}function W(){var m;z=0;if(b>=u)return["","TK_EOF"];E=!1;G=[];var c=n.charAt(b);for(b+=1;t(c,S);){"\n"===c?(z+=1,G=[]):z&&(c===D?G.push(D):"\r"!==c&&G.push(" "));if(b>=u)return["","TK_EOF"];c=n.charAt(b);b+=1}if(T.isIdentifierChar(n.charCodeAt(b-1))){if(b<u)for(;T.isIdentifierChar(n.charCodeAt(b))&&(c+=n.charAt(b),b+=1,b!==u););if(b!==u&&c.match(/^[0-9]+[Ee]$/)&&("-"===n.charAt(b)||"+"===n.charAt(b))){var f=n.charAt(b);b+=1;var e=W(),c=c+
(f+e[0]);return[c,"TK_WORD"]}return"TK_DOT"===d||"TK_RESERVED"===d&&t(a.last_text,["set","get"])||!t(c,X)?[c,"TK_WORD"]:"in"===c?[c,"TK_OPERATOR"]:[c,"TK_RESERVED"]}if("("===c||"["===c)return[c,"TK_START_EXPR"];if(")"===c||"]"===c)return[c,"TK_END_EXPR"];if("{"===c)return[c,"TK_START_BLOCK"];if("}"===c)return[c,"TK_END_BLOCK"];if(";"===c)return[c,"TK_SEMICOLON"];if("/"===c){f="";e=!0;if("*"===n.charAt(b)){b+=1;if(b<u)for(;b<u&&("*"!==n.charAt(b)||!n.charAt(b+1)||"/"!==n.charAt(b+1));){c=n.charAt(b);
f+=c;if("\n"===c||"\r"===c)e=!1;b+=1;if(b>=u)break}b+=2;return e&&0===z?["/*"+f+"*/","TKInLINE_COMMENT"]:["/*"+f+"*/","TK_BLOCK_COMMENT"]}if("/"===n.charAt(b)){for(f=c;"\r"!==n.charAt(b)&&"\n"!==n.charAt(b)&&!(f+=n.charAt(b),b+=1,b>=u););return[f,"TK_COMMENT"]}}if("`"===c||"'"===c||'"'===c||("/"===c||k.e4x&&"<"===c&&n.slice(b-1).match(/^<([-a-zA-Z:0-9_.]+|{[^{}]*}|!\[CDATA\[[\s\S]*?\]\])\s*([-a-zA-Z:0-9_.]+=('[^']*'|"[^"]*"|{[^{}]*})\s*)*\/?\s*>/))&&("TK_RESERVED"===d&&O(a.last_text)||"TK_END_EXPR"===
d&&t(w.mode,[l.Conditional,l.ForInitializer])||t(d,"TK_COMMENT TK_START_EXPR TK_START_BLOCK TK_END_BLOCK TK_OPERATOR TK_EQUALS TK_EOF TK_SEMICOLON TK_COMMA".split(" ")))){var f=c,g=e=!1;m=c;if(b<u)if("/"===f)for(c=!1;e||c||n.charAt(b)!==f;){if(m+=n.charAt(b),e?e=!1:(e="\\"===n.charAt(b),"["===n.charAt(b)?c=!0:"]"===n.charAt(b)&&(c=!1)),b+=1,b>=u)return[m,"TK_STRING"]}else if(k.e4x&&"<"===f){var e=/<(\/?)([-a-zA-Z:0-9_.]+|{[^{}]*}|!\[CDATA\[[\s\S]*?\]\])\s*([-a-zA-Z:0-9_.]+=('[^']*'|"[^"]*"|{[^{}]*})\s*)*(\/?)\s*>/g,
c=n.slice(b-1),h=e.exec(c);if(h&&0===h.index){f=h[2];for(m=0;h;){var g=!!h[1],p=h[2],r=!!h[h.length-1]||"![CDATA["===p.slice(0,8);p!==f||r||(g?--m:++m);if(0>=m)break;h=e.exec(c)}f=h?h.index+h[0].length:c.length;b+=f-1;return[c.slice(0,f),"TK_STRING"]}}else for(;e||n.charAt(b)!==f;){m+=n.charAt(b);if(e){if("x"===n.charAt(b)||"u"===n.charAt(b))g=!0;e=!1}else e="\\"===n.charAt(b);b+=1;if(b>=u)return[m,"TK_STRING"]}b+=1;m+=f;if(g&&k.unescape_strings)a:{c=m;e=!1;h="";m=0;g="";for(p=0;e||m<c.length;)if(r=
c.charAt(m),m++,e){e=!1;if("x"===r)g=c.substr(m,2),m+=2;else if("u"===r)g=c.substr(m,4),m+=4;else{h+="\\"+r;continue}if(!g.match(/^[0123456789abcdefABCDEF]+$/)){m=c;break a}p=parseInt(g,16);if(0<=p&&32>p)h="x"===r?h+("\\x"+g):h+("\\u"+g);else if(34===p||39===p||92===p)h+="\\"+String.fromCharCode(p);else if("x"===r&&126<p&&255>=p){m=c;break a}else h+=String.fromCharCode(p)}else"\\"===r?e=!0:h+=r;m=h}if("/"===f)for(;b<u&&t(n.charAt(b),Y);)m+=n.charAt(b),b+=1;return[m,"TK_STRING"]}if("#"===c){if(1===
q.length&&0===q[0].text.length&&"!"===n.charAt(b)){for(m=c;b<u&&"\n"!==c;)c=n.charAt(b),m+=c,b+=1;return[R(m)+"\n","TK_UNKNOWN"]}f="#";if(b<u&&t(n.charAt(b),Z)){do c=n.charAt(b),f+=c,b+=1;while(b<u&&"#"!==c&&"="!==c);"#"!==c&&("["===n.charAt(b)&&"]"===n.charAt(b+1)?(f+="[]",b+=2):"{"===n.charAt(b)&&"}"===n.charAt(b+1)&&(f+="{}",b+=2));return[f,"TK_WORD"]}}if("<"===c&&"\x3c!--"===n.substring(b-1,b+3)){b+=3;for(c="\x3c!--";"\n"!==n.charAt(b)&&b<u;)c+=n.charAt(b),b++;a.in_html_comment=!0;return[c,"TK_COMMENT"]}if("-"===
c&&a.in_html_comment&&"--\x3e"===n.substring(b-1,b+2))return a.in_html_comment=!1,b+=2,["--\x3e","TK_COMMENT"];if("."===c)return[c,"TK_DOT"];if(t(c,K)){for(;b<u&&t(c+n.charAt(b),K)&&!(c+=n.charAt(b),b+=1,b>=u););return","===c?[c,"TK_COMMA"]:"="===c?[c,"TK_EQUALS"]:[c,"TK_OPERATOR"]}return[c,"TK_UNKNOWN"]}function aa(){J()||!E||N(a.mode)||"TK_OPERATOR"===d&&"--"!==a.last_text&&"++"!==a.last_text||"TK_EQUALS"===d||!k.preserve_newlines&&"TK_RESERVED"===d&&t(a.last_text,["var","let","const","set","get"])||
h();if(a.do_block&&!a.do_while){if("TK_RESERVED"===p&&"while"===f){g=!0;r();g=!0;a.do_while=!0;return}h();a.do_block=!1}if(a.if_block)if(a.else_block||"TK_RESERVED"!==p||"else"!==f){for(;a.mode===l.Statement;)A();a.if_block=!1;a.else_block=!1}else a.else_block=!0;if("TK_RESERVED"===p&&("case"===f||"default"===f&&a.in_case_statement)){h();if(a.case_body||k.jslint_happy)0<a.indentation_level&&(!a.parent||a.indentation_level>a.parent.indentation_level)&&--a.indentation_level,a.case_body=!1;r();a.in_case=
!0;a.in_case_statement=!0}else{"TK_RESERVED"===p&&"function"===f&&(!(t(a.last_text,["}",";"])||H()&&!t(a.last_text,["[","{",":","=",","]))||H()&&(1===q.length||0===q[q.length-2].text.length)||a.had_comment||(h(),h(!0)),"TK_RESERVED"===d||"TK_WORD"===d?"TK_RESERVED"===d&&t(a.last_text,["get","set","new","return"])?g=!0:h():"TK_OPERATOR"===d||"="===a.last_text?g=!0:N(a.mode)||h());if("TK_COMMA"===d||"TK_START_EXPR"===d||"TK_EQUALS"===d||"TK_OPERATOR"===d)Q()||F();if("TK_RESERVED"===p&&"function"===
f)r(),a.last_word=f;else{x="NONE";"TK_END_BLOCK"===d?"TK_RESERVED"===p&&t(f,["else","catch","finally"])?"expand"===k.brace_style||"end-expand"===k.brace_style?x="NEWLINE":(x="SPACE",g=!0):x="NEWLINE":"TK_SEMICOLON"===d&&a.mode===l.BlockStatement?x="NEWLINE":"TK_SEMICOLON"===d&&N(a.mode)?x="SPACE":"TK_STRING"===d?x="NEWLINE":"TK_RESERVED"===d||"TK_WORD"===d||"*"===a.last_text&&"function"===B?x="SPACE":"TK_START_BLOCK"===d?x="NEWLINE":"TK_END_EXPR"===d&&(g=!0,x="NEWLINE");"TK_RESERVED"===p&&t(f,L)&&
")"!==a.last_text&&(x="else"===a.last_text?"SPACE":"NEWLINE");if("TK_RESERVED"===p&&t(f,["else","catch","finally"]))if("TK_END_BLOCK"!==d||"expand"===k.brace_style||"end-expand"===k.brace_style)h();else{y(!0);var b=q[q.length-1];"}"!==b.text[b.text.length-1]&&h();g=!0}else"NEWLINE"===x?"TK_RESERVED"===d&&O(a.last_text)?g=!0:"TK_END_EXPR"!==d?"TK_START_EXPR"===d&&"TK_RESERVED"===p&&t(f,["var","let","const"])||":"===a.last_text||("TK_RESERVED"===p&&"if"===f&&"else"===a.last_word&&"{"!==a.last_text?
g=!0:h()):"TK_RESERVED"===p&&t(f,L)&&")"!==a.last_text&&h():a.mode===l.ArrayLiteral&&","===a.last_text&&"}"===B?h():"SPACE"===x&&(g=!0);r();a.last_word=f;"TK_RESERVED"===p&&"do"===f&&(a.do_block=!0);"TK_RESERVED"===p&&"if"===f&&(a.if_block=!0)}}}var n,q,f,p,d,B,D,a,w,P,S,Y,K,b,L,X,Z,x,E,g,u,z,G,ba,l,k,I="";S=["\n","\r","\t"," "];Y="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_$".split("");Z="0123456789".split("");K="+ - * / % & ++ -- = += -= *= /= %= == === != !== > < >= <= >> << >>> >>>= >>= <<= && &= | || ! ~ , : ? ^ ^= |= :: =>";
K+=" <%= <% %> <?= <? ?>";K=K.split(" ");L="continue try throw return var let const if switch case default for while break function yield".split(" ");X=L.concat("do in else get set new catch finally typeof".split(" "));l={BlockStatement:"BlockStatement",Statement:"Statement",ObjectLiteral:"ObjectLiteral",ArrayLiteral:"ArrayLiteral",ForInitializer:"ForInitializer",Conditional:"Conditional",Expression:"Expression"};ba={TK_START_EXPR:function(){J();var b=l.Expression;if("["===f){if("TK_WORD"===d||")"===
a.last_text){"TK_RESERVED"===d&&t(a.last_text,L)&&(g=!0);M(b);r();a.indentation_level+=1;k.spaceIn_paren&&(g=!0);return}b=l.ArrayLiteral;a.mode!==l.ArrayLiteral||"["!==a.last_text&&(","!==a.last_text||"]"!==B&&"}"!==B)||k.keep_arrayIndentation||h()}else"TK_RESERVED"===d&&"for"===a.last_text?b=l.ForInitializer:"TK_RESERVED"===d&&t(a.last_text,["if","while"])&&(b=l.Conditional);";"===a.last_text||"TK_START_BLOCK"===d?h():"TK_END_EXPR"===d||"TK_START_EXPR"===d||"TK_END_BLOCK"===d||"."===a.last_text?
F(E):"TK_RESERVED"===d&&"("===f||"TK_WORD"===d||"TK_OPERATOR"===d?"TK_RESERVED"===d&&("function"===a.last_word||"typeof"===a.last_word)||"*"===a.last_text&&"function"===B?k.jslint_happy&&(g=!0):"TK_RESERVED"!==d||!t(a.last_text,L)&&"catch"!==a.last_text||k.space_before_conditional&&(g=!0):g=!0;"("!==f||"TK_EQUALS"!==d&&"TK_OPERATOR"!==d||Q()||F();M(b);r();k.spaceIn_paren&&(g=!0);a.indentation_level+=1},TK_END_EXPR:function(){for(;a.mode===l.Statement;)A();a.multiline_frame&&F("]"===f&&a.mode===l.ArrayLiteral&&
!k.keep_arrayIndentation);k.spaceIn_paren&&("TK_START_EXPR"!==d||k.spaceIn_empty_paren?g=!0:(y(),g=!1));"]"===f&&k.keep_arrayIndentation?(r(),A()):(A(),r());V(w);a.do_while&&w.mode===l.Conditional&&(w.mode=l.Expression,a.do_block=!1,a.do_while=!1)},TK_START_BLOCK:function(){M(l.BlockStatement);var m;a:{m=b;for(var c=n.charAt(m);t(c,S)&&"}"!==c;){m++;if(m>=u){m=!1;break a}c=n.charAt(m)}m="}"===c}m=m&&"function"===a.last_word&&"TK_END_EXPR"===d;"expand"===k.brace_style?"TK_OPERATOR"!==d&&(m||"TK_EQUALS"===
d||"TK_RESERVED"===d&&O(a.last_text)&&"else"!==a.last_text)?g=!0:h(!1,!0):"TK_OPERATOR"!==d&&"TK_START_EXPR"!==d?"TK_START_BLOCK"===d?h():g=!0:w.mode===l.ArrayLiteral&&","===a.last_text&&("}"===B?g=!0:h());r();a.indentation_level+=1},TK_END_BLOCK:function(){for(;a.mode===l.Statement;)A();var b="TK_START_BLOCK"===d;"expand"===k.brace_style?b||h():b||(a.mode===l.ArrayLiteral&&k.keep_arrayIndentation?(k.keep_arrayIndentation=!1,h(),k.keep_arrayIndentation=!0):h());A();r()},TK_WORD:aa,TK_RESERVED:aa,
TK_SEMICOLON:function(){for(J()&&(g=!1);a.mode===l.Statement&&!a.if_block&&!a.do_block;)A();r();a.mode===l.ObjectLiteral&&(a.mode=l.BlockStatement)},TK_STRING:function(){J()?g=!0:"TK_RESERVED"===d||"TK_WORD"===d?g=!0:"TK_COMMA"===d||"TK_START_EXPR"===d||"TK_EQUALS"===d||"TK_OPERATOR"===d?Q()||F():h();r()},TK_EQUALS:function(){J();a.declaration_statement&&(a.declaration_assignment=!0);g=!0;r();g=!0},TK_OPERATOR:function(){":"!==f||a.mode!==l.BlockStatement||"{"!==B||"TK_WORD"!==d&&"TK_RESERVED"!==
d||(a.mode=l.ObjectLiteral);J();var b=!0,c=!0;if("TK_RESERVED"===d&&O(a.last_text))g=!0,r();else if("*"!==f||"TK_DOT"!==d||B.match(/^\d+$/))if(":"===f&&a.in_case)a.case_body=!0,a.indentation_level+=1,r(),h(),a.in_case=!1;else if("::"===f)r();else{!E||"--"!==f&&"++"!==f||h(!1,!0);"TK_OPERATOR"===d&&F();if(t(f,["--","++","!","~"])||t(f,["-","+"])&&(t(d,["TK_START_BLOCK","TK_START_EXPR","TK_EQUALS","TK_OPERATOR"])||t(a.last_text,L)||","===a.last_text)){c=b=!1;";"===a.last_text&&N(a.mode)&&(b=!0);if("TK_RESERVED"===
d||"TK_END_EXPR"===d)b=!0;a.mode!==l.BlockStatement&&a.mode!==l.Statement||"{"!==a.last_text&&";"!==a.last_text||h()}else":"===f?0===a.ternary_depth?(a.mode===l.BlockStatement&&(a.mode=l.ObjectLiteral),b=!1):--a.ternary_depth:"?"===f?a.ternary_depth+=1:"*"===f&&"TK_RESERVED"===d&&"function"===a.last_text&&(c=b=!1);g=g||b;r();g=c}else r()},TK_COMMA:function(){a.declaration_statement?(N(a.parent.mode)&&(a.declaration_assignment=!1),r(),a.declaration_assignment?(a.declaration_assignment=!1,h(!1,!0)):
g=!0):(r(),a.mode===l.ObjectLiteral||a.mode===l.Statement&&a.parent.mode===l.ObjectLiteral?(a.mode===l.Statement&&A(),h()):g=!0)},TK_BLOCK_COMMENT:function(){for(var a=f,a=a.replace(/\x0d/g,""),b=[],d=a.indexOf("\n");-1!==d;)b.push(a.substring(0,d)),a=a.substring(d+1),d=a.indexOf("\n");a.length&&b.push(a);var e,d=a=!1;e=G.join("");var k=e.length;h(!1,!0);if(1<b.length){var g;a:{g=b.slice(1);for(var l=0;l<g.length;l++)if("*"!==R(g[l]).charAt(0)){g=!1;break a}g=!0}if(g)a=!0;else{a:{g=b.slice(1);for(var l=
0,n=g.length,p;l<n;l++)if((p=g[l])&&0!==p.indexOf(e)){e=!1;break a}e=!0}e&&(d=!0)}}r(b[0]);for(e=1;e<b.length;e++)h(!1,!0),a?r(" "+R(b[e])):d&&b[e].length>k?r(b[e].substring(k)):q[q.length-1].text.push(b[e]);h(!1,!0)},TKInLINE_COMMENT:function(){g=!0;r();g=!0},TK_COMMENT:function(){E?h(!1,!0):y(!0);g=!0;r();h(!1,!0)},TK_DOT:function(){J();"TK_RESERVED"===d&&O(a.last_text)?g=!0:F(")"===a.last_text&&k.break_chained_methods);r()},TK_UNKNOWN:function(){r();"\n"===f[f.length-1]&&h()}};e=e?e:{};k={};void 0!==
e.spaceAfter_anon_function&&void 0===e.jslint_happy&&(e.jslint_happy=e.spaceAfter_anon_function);void 0!==e.braces_on_own_line&&(k.brace_style=e.braces_on_own_line?"expand":"collapse");k.brace_style=e.brace_style?e.brace_style:k.brace_style?k.brace_style:"collapse";"expand-strict"===k.brace_style&&(k.brace_style="expand");k.indent_size=e.indent_size?parseInt(e.indent_size,10):4;k.indent_char=e.indent_char?e.indent_char:" ";k.preserve_newlines=void 0===e.preserve_newlines?!0:e.preserve_newlines;k.break_chained_methods=
void 0===e.break_chained_methods?!1:e.break_chained_methods;k.max_preserve_newlines=void 0===e.max_preserve_newlines?0:parseInt(e.max_preserve_newlines,10);k.spaceIn_paren=void 0===e.spaceIn_paren?!1:e.spaceIn_paren;k.spaceIn_empty_paren=void 0===e.spaceIn_empty_paren?!1:e.spaceIn_empty_paren;k.jslint_happy=void 0===e.jslint_happy?!1:e.jslint_happy;k.keep_arrayIndentation=void 0===e.keep_arrayIndentation?!1:e.keep_arrayIndentation;k.space_before_conditional=void 0===e.space_before_conditional?!0:
e.space_before_conditional;k.unescape_strings=void 0===e.unescape_strings?!1:e.unescape_strings;k.wrap_line_length=void 0===e.wrap_line_length?0:parseInt(e.wrap_line_length,10);k.e4x=void 0===e.e4x?!1:e.e4x;e.indent_with_tabs&&(k.indent_char="\t",k.indent_size=1);for(D="";0<k.indent_size;)D+=k.indent_char,--k.indent_size;for(;v&&(" "===v.charAt(0)||"\t"===v.charAt(0));)I+=v.charAt(0),v=v.substring(1);n=v;u=v.length;d="TK_START_BLOCK";B="";q=[{text:[]}];g=!1;G=[];P=[];M(l.BlockStatement);b=0;this.beautify=
function(){for(var b;;){b=W();f=b[0];p=b[1];if("TK_EOF"===p){for(;a.mode===l.Statement;)A();break}b=k.keep_arrayIndentation&&a.mode===l.ArrayLiteral;E=0<z;if(b)for(b=0;b<z;b+=1)h(0<b);else if(k.max_preserve_newlines&&z>k.max_preserve_newlines&&(z=k.max_preserve_newlines),k.preserve_newlines&&1<z)for(h(),b=1;b<z;b+=1)h(!0);ba[p]();"TKInLINE_COMMENT"!==p&&"TK_COMMENT"!==p&&"TK_BLOCK_COMMENT"!==p&&"TK_UNKNOWN"!==p&&(B=a.last_text,d=p,a.last_text=f);a.had_comment="TKInLINE_COMMENT"===p||"TK_COMMENT"===
p||"TK_BLOCK_COMMENT"===p}b=q[0].text.join("");for(var c=1;c<q.length;c++)b+="\n"+q[c].text.join("");return b=b.replace(/[\r\n ]+$/,"")}}var T={};(function(v){var e=RegExp("[\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc]"),
C=RegExp("[\u00aa\u00b5\u00ba\u00c0-\u00d6\u00d8-\u00f6\u00f8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc\u0300-\u036f\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u0620-\u0649\u0672-\u06d3\u06e7-\u06e8\u06fb-\u06fc\u0730-\u074a\u0800-\u0814\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0840-\u0857\u08e4-\u08fe\u0900-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962-\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09d7\u09df-\u09e0\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5f-\u0b60\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62-\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2-\u0ce3\u0ce6-\u0cef\u0d02\u0d03\u0d46-\u0d48\u0d57\u0d62-\u0d63\u0d66-\u0d6f\u0d82\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e34-\u0e3a\u0e40-\u0e45\u0e50-\u0e59\u0eb4-\u0eb9\u0ec8-\u0ecd\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f41-\u0f47\u0f71-\u0f84\u0f86-\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1029\u1040-\u1049\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u170e-\u1710\u1720-\u1730\u1740-\u1750\u1772\u1773\u1780-\u17b2\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1920-\u192b\u1930-\u193b\u1951-\u196d\u19b0-\u19c0\u19c8-\u19c9\u19d0-\u19d9\u1a00-\u1a15\u1a20-\u1a53\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1b46-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1bb0-\u1bb9\u1be6-\u1bf3\u1c00-\u1c22\u1c40-\u1c49\u1c5b-\u1c7d\u1cd0-\u1cd2\u1d00-\u1dbe\u1e01-\u1f15\u200c\u200d\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2d81-\u2d96\u2de0-\u2dff\u3021-\u3028\u3099\u309a\ua640-\ua66d\ua674-\ua67d\ua69f\ua6f0-\ua6f1\ua7f8-\ua800\ua806\ua80b\ua823-\ua827\ua880-\ua881\ua8b4-\ua8c4\ua8d0-\ua8d9\ua8f3-\ua8f7\ua900-\ua909\ua926-\ua92d\ua930-\ua945\ua980-\ua983\ua9b3-\ua9c0\uaa00-\uaa27\uaa40-\uaa41\uaa4c-\uaa4d\uaa50-\uaa59\uaa7b\uaae0-\uaae9\uaaf2-\uaaf3\uabc0-\uabe1\uabec\uabed\uabf0-\uabf9\ufb20-\ufb28\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f]");
v.isIdentifierStart=function(y){return 65>y?36===y:91>y?!0:97>y?95===y:123>y?!0:170<=y&&e.test(String.fromCharCode(y))};v.isIdentifierChar=function(e){return 48>e?36===e:58>e?!0:65>e?!1:91>e?!0:97>e?95===e:123>e?!0:170<=e&&C.test(String.fromCharCode(e))}})(T);"function"===typeof define&&define.amd?define([],function(){return{js_beautify:C}}):"undefined"!==typeof exports?exports.js_beautify=C:"undefined"!==typeof window?window.js_beautify=C:"undefined"!==typeof global&&(global.js_beautify=C)})();
var __extends=this&&this.__extends||function(e,t){function n(){this.constructor=e}for(var i in t)t.hasOwnProperty(i)&&(e[i]=t[i]);e.prototype=null===t?Object.create(t):(n.prototype=t.prototype,new n)},PlayMarioJas;!function(e){"use strict";var t=function(e){function t(n){this.settings=t.settings,this.deviceMotionStatus={motionLeft:!1,motionRight:!1,x:void 0,y:void 0,dy:void 0},e.call(this,this.proliferate({constantsSource:t,constants:["unitsize","scale","gravity","pointLevels","customTextMappings"]},n))}return __extends(t,e),t.prototype.resetObjectMaker=function(e,t){e.ObjectMaker=new ObjectMakr.ObjectMakr(e.proliferate({properties:{Quadrant:{EightBitter:e,GameStarter:e,FSM:e},Thing:{EightBitter:e,GameStarter:e,FSM:e}}},e.settings.objects))},t.prototype.resetAudioPlayer=function(t,n){e.prototype.resetAudioPlayer.call(this,t,n),t.AudioPlayer.setGetVolumeLocal(t.getVolumeLocal.bind(t,t)),t.AudioPlayer.setGetThemeDefault(t.getAudioThemeDefault.bind(t,t))},t.prototype.resetAreaSpawner=function(e,t){e.AreaSpawner=new AreaSpawnr.AreaSpawnr({MapsCreator:e.MapsCreator,MapScreener:e.MapScreener,screenAttributes:e.settings.maps.screenAttributes,onSpawn:e.settings.maps.onSpawn.bind(e),stretchAdd:e.mapAddStretched.bind(e),afterAdd:e.mapAddAfter.bind(e)})},t.prototype.resetItemsHolder=function(t,n){e.prototype.resetItemsHolder.call(this,t,n),n.width<560&&(t.ItemsHolder.getContainer().children[0].cells[4].style.display="none")},t.prototype.resetMathDecider=function(e,t){e.MathDecider=new MathDecidr.MathDecidr(e.proliferate({constants:e.MapScreener},e.settings.math))},t.prototype.resetContainer=function(t,n){e.prototype.resetContainer.call(this,t,n),t.container.style.fontFamily="Press Start",t.container.className+=" PlayMarioJas",t.PixelDrawer.setThingArrays([t.GroupHolder.getGroup("Scenery"),t.GroupHolder.getGroup("Solid"),t.GroupHolder.getGroup("Character"),t.GroupHolder.getGroup("Text")]),t.ItemsHolder.getContainer().style.width=n.width+"px",t.container.appendChild(t.ItemsHolder.getContainer())},t.prototype.gameStart=function(){var e=t.prototype.ensureCorrectCaller(this);e.setMap(e.settings.maps.mapDefault,e.settings.maps.locationDefault),e.ItemsHolder.setItem("lives",e.settings.items.values.lives.valueDefault),e.ModAttacher.fireEvent("onGameStart")},t.prototype.gameOver=function(){var e,n,i,o=t.prototype.ensureCorrectCaller(this),r=o.ObjectMaker.make("CustomText",{texts:[{text:"GAME OVER"}]});for(o.killNPCs(),o.AudioPlayer.clearAll(),o.AudioPlayer.play("GameOver"),o.GroupHolder.clearArrays(),o.ItemsHolder.hideContainer(),o.TimeHandler.cancelAllEvents(),o.PixelDrawer.setBackground("black"),o.addThing(r,o.MapScreener.width/2,o.MapScreener.height/2),e=r.children,n=-(e[e.length-1].right-e[0].left)/2,i=0;i<e.length;i+=1)o.shiftHoriz(e[i],n);o.TimeHandler.addEvent(function(){o.gameStart(),o.ItemsHolder.displayContainer()},420),o.ModAttacher.fireEvent("onGameOver")},t.prototype.thingProcess=function(t,n,i,o){("Infinity"===t.height||t.height===1/0)&&(t.height=t.FSM.getAbsoluteHeight(t.y)/t.FSM.unitsize),e.prototype.thingProcess.call(this,t,n,i,o),t.FSM.ThingHitter.cacheChecksForType(t.title,t.groupType)},t.prototype.generateThingKey=function(e){return e.GameStarter.AreaSpawner.getArea().setting+" "+e.groupType+" "+e.title+" "+e.className},t.prototype.addPreThing=function(e){var t=e.thing,n=e.position||t.position;t.FSM.addThing(t,e.left*t.FSM.unitsize-t.FSM.MapScreener.left,(t.FSM.MapScreener.floor-e.top)*t.FSM.unitsize),n&&t.FSM.TimeHandler.addEvent(function(){switch(n){case"beginning":t.FSM.arrayToBeginning(t,t.FSM.GroupHolder.getGroup(t.groupType));break;case"end":t.FSM.arrayToEnd(t,t.FSM.GroupHolder.getGroup(t.groupType))}}),t.FSM.ModAttacher.fireEvent("onAddPreThing",e)},t.prototype.addPlayer=function(e,n){void 0===e&&(e=16*this.unitsize),void 0===n&&(n=16*this.unitsize);var i,o=t.prototype.ensureCorrectCaller(this);return i=o.player=o.ObjectMaker.make("Player",{power:o.ItemsHolder.getItem("power")}),i.keys=i.getKeys(),o.MapScreener.underwater&&(i.swimming=!0,o.TimeHandler.addClassCycle(i,["swim1","swim2"],"swimming",5),o.TimeHandler.addEventInterval(i.FSM.animatePlayerBubbling,96,1/0,i)),o.setPlayerSizeSmall(i),i.power>=2&&(o.playerGetsBig(i,!0),3===i.power&&o.playerGetsFire(i)),o.addThing(i,e,n-i.height*o.unitsize),o.ModAttacher.fireEvent("onAddPlayer",i),i},t.prototype.scrollPlayer=function(e,n){var i=t.prototype.ensureCorrectCaller(this);i.scrollThing(i.player,e,n),i.ModAttacher.fireEvent("onScrollPlayer",e,n)},t.prototype.onGamePause=function(e){e.AudioPlayer.pauseAll(),e.AudioPlayer.play("Pause"),e.ModAttacher.fireEvent("onGamePause")},t.prototype.onGamePlay=function(e){e.AudioPlayer.resumeAll(),e.ModAttacher.fireEvent("onGamePlay")},t.prototype.keyDownLeft=function(e,t){if(!e.GamesRunner.getPaused()){var n=e.player;n.keys.run=-1,n.keys.leftDown=!0,n.FSM.ModAttacher.fireEvent("onKeyDownLeft")}},t.prototype.keyDownRight=function(e,t){if(!e.GamesRunner.getPaused()){var n=e.player;n.keys.run=1,n.keys.rightDown=!0,n.FSM.ModAttacher.fireEvent("onKeyDownRight"),t&&void 0!==t.preventDefault&&t.preventDefault()}},t.prototype.keyDownUp=function(e,t){if(!e.GamesRunner.getPaused()){var n=e.player;n.keys.up=!0,n.canjump&&(n.resting||e.MapScreener.underwater)&&(n.keys.jump=!0,n.canjump=!1,n.keys.jumplev=0,n.power>1?e.AudioPlayer.play("JumpSuper"):e.AudioPlayer.play("JumpSmall"),e.MapScreener.underwater&&e.TimeHandler.addEvent(function(){n.jumping=n.keys.jump=!1},14)),e.ModAttacher.fireEvent("onKeyDownUp"),t&&void 0!==t.preventDefault&&t.preventDefault()}},t.prototype.keyDownDown=function(e,t){if(!e.GamesRunner.getPaused()){var n=e.player;n.keys.crouch=!0,e.ModAttacher.fireEvent("onKeyDownDown"),t&&void 0!==t.preventDefault&&t.preventDefault()}},t.prototype.keyDownSprint=function(e,t){if(!e.GamesRunner.getPaused()){var n=e.player;3!==n.power||n.keys.sprint!==!1||n.crouching||n.fire(n),n.keys.sprint=!0,n.FSM.ModAttacher.fireEvent("onKeyDownSprint"),t&&void 0!==t.preventDefault&&t.preventDefault()}},t.prototype.keyDownPause=function(e,t){e.GamesRunner.getPaused()?e.GamesRunner.play():e.GamesRunner.pause(),e.ModAttacher.fireEvent("onKeyDownPause"),t&&void 0!==t.preventDefault&&t.preventDefault()},t.prototype.keyDownMute=function(e,t){e.GamesRunner.getPaused()||(e.AudioPlayer.toggleMuted(),e.ModAttacher.fireEvent("onKeyDownMute"),t&&void 0!==t.preventDefault&&t.preventDefault())},t.prototype.keyUpLeft=function(e,t){var n=e.player;n.keys.run=0,n.keys.leftDown=!1,e.ModAttacher.fireEvent("onKeyUpLeft"),t&&void 0!==t.preventDefault&&t.preventDefault()},t.prototype.keyUpRight=function(e,t){var n=e.player;n.keys.run=0,n.keys.rightDown=!1,e.ModAttacher.fireEvent("onKeyUpRight"),t&&void 0!==t.preventDefault&&t.preventDefault()},t.prototype.keyUpUp=function(e,t){var n=e.player;e.MapScreener.underwater||(n.keys.jump=n.keys.up=!1),n.canjump=!0,e.ModAttacher.fireEvent("onKeyUpUp"),t&&void 0!==t.preventDefault&&t.preventDefault()},t.prototype.keyUpDown=function(e,t){var n=e.player;n.keys.crouch=!1,n.piping||e.animatePlayerRemoveCrouch(n),e.ModAttacher.fireEvent("onKeyUpDown"),t&&void 0!==t.preventDefault&&t.preventDefault()},t.prototype.keyUpSprint=function(e,t){var n=e.player;n.keys.sprint=!1,e.ModAttacher.fireEvent("onKeyUpSprint"),t&&void 0!==t.preventDefault&&t.preventDefault()},t.prototype.keyUpPause=function(e,t){e.ModAttacher.fireEvent("onKeyUpPause"),t&&void 0!==t.preventDefault&&t.preventDefault()},t.prototype.mouseDownRight=function(e,t){e.GamesRunner.togglePause(),e.ModAttacher.fireEvent("onMouseDownRight"),t&&void 0!==t.preventDefault&&t.preventDefault()},t.prototype.deviceMotion=function(e,t){var n=e.player,i=e.deviceMotionStatus,o=t.accelerationIncludingGravity;e.ModAttacher.fireEvent("onDeviceMotion",t),void 0!==i.y&&(i.dy=o.y-i.y,i.dy>.21?e.keyDownUp(e):i.dy<-.14&&e.keyUpUp(e)),i.x=o.x,i.y=o.y,i.x>2.1?i.motionLeft||(n.FSM.keyDownLeft(e),i.motionLeft=!0):i.x<-2.1?i.motionRight||(n.FSM.keyDownRight(e),i.motionRight=!0):(i.motionLeft&&(n.FSM.keyUpLeft(e),i.motionLeft=!1),i.motionRight&&(n.FSM.keyUpRight(e),i.motionRight=!1))},t.prototype.canInputsTrigger=function(e){return!e.MapScreener.nokeys},t.prototype.maintainTime=function(e){return e.MapScreener.notime?e.ItemsHolder.getItem("time")?!1:!0:(e.ItemsHolder.decrease("time",1),!1)},t.prototype.maintainScenery=function(e){var t,n,i=e.GroupHolder.getGroup("Scenery"),o=e.QuadsKeeper.left;for(n=0;n<i.length;n+=1)t=i[n],t.right<o&&2!==t.outerok&&(e.arrayDeleteThing(t,i,n),n-=1)},t.prototype.maintainSolids=function(e,t){var n,i,o=e.QuadsKeeper.left;for(e.QuadsKeeper.determineAllQuadrants("Solid",t),i=0;i<t.length;i+=1)n=t[i],n.alive&&n.right>o?n.movement&&n.movement(n):n.alive&&2===n.outerok||(e.arrayDeleteThing(n,t,i),i-=1)},t.prototype.maintainCharacters=function(e,t){var n,i,o=e.QuadsKeeper.right;for(i=0;i<t.length;i+=1)n=t[i],n.resting?n.yvel=0:(n.nofall||(n.yvel+=n.gravity||e.MapScreener.gravity),n.yvel=Math.min(n.yvel,e.MapScreener.maxyvel)),n.under=n.undermid=void 0,e.updatePosition(n),e.QuadsKeeper.determineThingQuadrants(n),e.ThingHitter.checkHitsForThing(n),n.overlaps&&n.overlaps.length&&e.maintainOverlaps(n),n.resting&&(e.isCharacterOnResting(n,n.resting)?(n.yvel=0,e.setBottom(n,n.resting.top)):n.onRestingOff?n.onRestingOff(n,n.resting):n.resting=void 0),n.alive?!n.player&&(0===n.numquads||n.left>o)&&(!n.outerok||2!==n.outerok&&n.right<e.MapScreener.width-o)?(e.arrayDeleteThing(n,t,i),i-=1):!n.nomove&&n.movement&&n.movement(n):(e.arrayDeleteThing(n,t,i),i-=1)},t.prototype.maintainOverlaps=function(e){if(!e.checkOverlaps||e.FSM.setOverlapBoundaries(e)){if(e.FSM.slideToX(e,e.overlapGoal,e.FSM.unitsize),e.overlapGoRight){if(!(e.left>=e.overlapCheck))return;e.FSM.setLeft(e,e.overlapCheck)}else{if(!(e.right<=e.overlapCheck))return;e.FSM.setRight(e,e.overlapCheck)}e.overlaps.length=0,e.checkOverlaps=!0}},t.prototype.setOverlapBoundaries=function(e){if(1===e.overlaps.length)return e.overlaps.length=0,!1;var t,n,i,o,r,a=-(1/0),l=1/0,p=e.overlaps;for(r=0;r<p.length;r+=1)t=p[r],t.right>a&&(i=t),t.left<l&&(n=t);return o=(l+a)/2,e.FSM.getMidX(e)>=o?(e.overlapGoal=1/0,e.overlapGoRight=!0,e.overlapCheck=i.right):(e.overlapGoal=-(1/0),e.overlapGoRight=!1,e.overlapCheck=n.left),e.checkOverlaps=!1,!0},t.prototype.maintainPlayer=function(e){var t=e.player;if(e.isThingAlive(t)){if(t.yvel>0&&(e.MapScreener.underwater||(t.keys.jump=!1),t.jumping||t.crouching||(e.MapScreener.underwater?t.paddling||(e.switchClass(t,"paddling","paddling"),t.paddling=!0):(e.addClass(t,"jumping"),t.jumping=!0)),!t.dieing&&t.top>e.MapScreener.bottom))return void(e.AreaSpawner.getArea().exit?e.setLocation(e.AreaSpawner.getArea().exit):e.killPlayer(t,2));if(t.xvel>0?t.right>e.MapScreener.middleX&&t.right>e.MapScreener.right-e.MapScreener.left&&(t.xvel=Math.min(0,t.xvel)):t.left<0&&(t.xvel=Math.max(0,t.xvel)),t.under&&(t.jumpcount=0),e.MapScreener.canscroll){var n=t.right-e.MapScreener.middleX;n>0&&e.scrollWindow(Math.min(t.scrollspeed,n))}}},t.prototype.generateCanThingCollide=function(){return function(e){return e.alive&&!e.nocollide}},t.prototype.isThingAlive=function(e){return e&&e.alive&&!e.dead},t.prototype.isThingTouchingThing=function(e,t){return!e.nocollide&&!t.nocollide&&e.right-e.FSM.unitsize>t.left&&e.left+e.FSM.unitsize<t.right&&e.bottom>=t.top&&e.top<=t.bottom},t.prototype.isThingOnThing=function(e,t){return"Solid"===e.groupType&&t.yvel>0?!1:e.yvel<t.yvel&&"Solid"!==t.groupType?!1:e.player&&e.bottom<t.bottom&&t.enemy?!0:e.left+e.FSM.unitsize>=t.right?!1:e.right-e.FSM.unitsize<=t.left?!1:e.bottom<=t.top+t.toly+t.yvel?!0:e.bottom<=t.top+t.toly+Math.abs(e.yvel-t.yvel)?!0:!1},t.prototype.isThingOnSolid=function(e,t){return e.left+e.FSM.unitsize>=t.right?!1:e.right-e.FSM.unitsize<=t.left?!1:e.bottom-e.yvel<=t.top+t.toly+e.yvel?!0:e.bottom<=t.top+t.toly+Math.abs(e.yvel-t.yvel)?!0:!1},t.prototype.isCharacterOnSolid=function(e,t){return e.resting===t?!0:e.yvel<0?!1:e.FSM.isThingOnSolid(e,t)?e.left+e.xvel+e.FSM.unitsize===t.right?!1:e.right-e.xvel-e.FSM.unitsize===t.left?!1:!0:!1},t.prototype.isCharacterOnResting=function(e,t){return e.FSM.isThingOnSolid(e,t)?e.left+e.xvel+e.FSM.unitsize===t.right?!1:e.right-e.xvel-e.FSM.unitsize===t.left?!1:!0:!1},t.prototype.generateIsCharacterTouchingCharacter=function(){return function(e,t){return(!e.nocollidechar||t.player&&!e.nocollideplayer)&&(!t.nocollidechar||e.player&&!t.nocollideplayer)?e.FSM.isThingTouchingThing(e,t):!1}},t.prototype.generateIsCharacterTouchingSolid=function(){return function(e,t){return(!t.hidden||t.collideHidden||e.player&&e.FSM.isSolidOnCharacter(t,e))&&(!e.nocollidesolid||e.allowUpSolids&&t.up)?e.FSM.isThingTouchingThing(e,t):!1}},t.prototype.isCharacterAboveEnemy=function(e,t){return e.bottom<t.top+t.toly},t.prototype.isCharacterBumpingSolid=function(e,t){return e.top+e.toly+Math.abs(e.yvel)>t.bottom},t.prototype.isCharacterOverlappingSolid=function(e,t){return e.top<=t.top&&e.bottom>t.bottom},t.prototype.isSolidOnCharacter=function(e,t){if(t.yvel>=0)return!1;var n=e.FSM.getMidX(t);return n<=e.left||n>=e.right?!1:e.bottom-e.yvel>t.top+t.toly-t.yvel?!1:!0},t.prototype.gainLife=function(e,n){var i=t.prototype.ensureCorrectCaller(this);e=Number(e)||1,i.ItemsHolder.increase("lives",e),n||this.AudioPlayer.play("GainLife"),i.ModAttacher.fireEvent("onGainLife",e)},t.prototype.itemJump=function(e){e.yvel-=1.4*t.unitsize,this.shiftVert(e,-t.unitsize)},t.prototype.jumpEnemy=function(e,t){e.keys.up?e.yvel=-1.4*e.FSM.unitsize:e.yvel=e.FSM.unitsize*-.7,e.xvel*=.91,e.FSM.AudioPlayer.play("Kick"),(!e.item||t.shell)&&(e.jumpcount+=1,e.FSM.scoreOn(e.FSM.findScore(e.jumpcount+e.jumpers),t)),e.jumpers+=1,e.FSM.TimeHandler.addEvent(function(e){e.jumpers-=1},1,e)},t.prototype.playerShroom=function(e,t){!e.shrooming&&e.player&&(e.FSM.AudioPlayer.play("Powerup"),e.FSM.scoreOn(1e3,e.FSM.player),e.power<3&&(e.FSM.ItemsHolder.increase("power"),e.power<3&&(e.shrooming=!0,e.power+=1,3===e.power?e.FSM.playerGetsFire(e.FSM.player):e.FSM.playerGetsBig(e.FSM.player))),e.FSM.ModAttacher.fireEvent("onPlayerShroom",e,t))},t.prototype.playerShroom1Up=function(e,t){e.player&&(e.FSM.gainLife(1),e.FSM.ModAttacher.fireEvent("onPlayerShroom1Up",e,t))},t.prototype.playerStarUp=function(e,t){void 0===t&&(t=560),e.star+=1,e.FSM.switchClass(e,"normal fiery","star"),e.FSM.AudioPlayer.play("Powerup"),e.FSM.AudioPlayer.addEventListener("Powerup","ended",e.FSM.AudioPlayer.playTheme.bind(e.FSM.AudioPlayer,"Star",!0)),e.FSM.TimeHandler.addClassCycle(e,["star1","star2","star3","star4"],"star",2),e.FSM.TimeHandler.addEvent(e.FSM.playerStarDown,t||560,e),e.FSM.ModAttacher.fireEvent("onPlayerStarUp",e)},t.prototype.playerStarDown=function(e){e.player&&(e.FSM.TimeHandler.cancelClassCycle(e,"star"),e.FSM.TimeHandler.addClassCycle(e,["star1","star2","star3","star4"],"star",5),e.FSM.TimeHandler.addEvent(e.FSM.playerStarOffCycle,140,e),e.FSM.AudioPlayer.removeEventListeners("Powerup","ended"),e.FSM.ModAttacher.fireEvent("onPlayerStarDown",e))},t.prototype.playerStarOffCycle=function(e){if(e.player){if(e.star>1)return void(e.star-=1);e.FSM.AudioPlayer.getTheme().paused||e.FSM.AudioPlayer.playTheme(),e.FSM.TimeHandler.addEvent(e.FSM.playerStarOffFinal,70,e),e.FSM.ModAttacher.fireEvent("onPlayerStarOffCycle",e)}},t.prototype.playerStarOffFinal=function(e){e.player&&(e.star-=1,e.FSM.TimeHandler.cancelClassCycle(e,"star"),e.FSM.removeClasses(e,"star star1 star2 star3 star4"),e.FSM.addClass(e,"normal"),3===e.power&&e.FSM.addClass(e,"fiery"),e.FSM.ModAttacher.fireEvent("onPlayerStarOffFinal",e))},t.prototype.playerGetsBig=function(e,t){e.FSM.setPlayerSizeLarge(e),e.FSM.removeClasses(e,"crouching small"),e.FSM.updateBottom(e,0),e.FSM.updateSize(e),t?e.FSM.addClass(e,"large"):e.FSM.playerGetsBigAnimation(e),e.FSM.ModAttacher.fireEvent("onPlayerGetsBig",e)},t.prototype.playerGetsBigAnimation=function(e){var t=["shrooming1","shrooming2","shrooming1","shrooming2","shrooming3","shrooming2","shrooming3"];e.FSM.addClass(e,"shrooming"),e.FSM.animateCharacterPauseVelocity(e),t.push(function(e){return e.shrooming=!1,t.length=0,e.FSM.addClass(e,"large"),e.FSM.removeClasses(e,"shrooming shrooming3"),e.FSM.animateCharacterResumeVelocity(e),!0}),e.FSM.TimeHandler.addClassCycle(e,t,"shrooming",6)},t.prototype.playerGetsSmall=function(e){var n=e.bottom;e.FSM.animateCharacterPauseVelocity(e),e.nocollidechar=!0,e.FSM.animateFlicker(e),e.FSM.removeClasses(e,"running skidding jumping fiery"),e.FSM.addClasses(e,"paddling small"),e.FSM.TimeHandler.addEvent(function(e){e.FSM.removeClass(e,"large"),e.FSM.setPlayerSizeSmall(e),e.FSM.setBottom(e,n-t.unitsize)},21,e),e.FSM.TimeHandler.addEvent(function(e){e.FSM.animateCharacterResumeVelocity(e,!1),e.FSM.removeClass(e,"paddling"),(e.running||e.xvel)&&e.FSM.addClass(e,"running"),e.FSM.PixelDrawer.setThingSprite(e)},42,e),e.FSM.TimeHandler.addEvent(function(e){e.nocollidechar=!1},70,e),e.FSM.ModAttacher.fireEvent("onPlayerGetsSmall")},t.prototype.playerGetsFire=function(e){e.shrooming=!1,e.star||e.FSM.addClass(e,"fiery"),e.FSM.ModAttacher.fireEvent("onPlayerGetsFire")},t.prototype.setPlayerSizeSmall=function(e){e.FSM.setSize(e,8,8,!0),e.FSM.updateSize(e)},t.prototype.setPlayerSizeLarge=function(e){e.FSM.setSize(e,8,16,!0),e.FSM.updateSize(e)},t.prototype.animatePlayerRemoveCrouch=function(e){e.crouching=!1,e.toly=e.tolyOld||0,1!==e.power&&(e.FSM.setHeight(e,16,!0,!0),e.FSM.removeClasses(e,"crouching"),e.FSM.updateBottom(e,0),e.FSM.updateSize(e)),e.FSM.animatePlayerRunningCycle(e)},t.prototype.unattachPlayer=function(e,t){e.nofall=!1,e.nocollide=!1,e.checkOverlaps=!0,e.attachedSolid=void 0,e.xvel=e.keys?e.keys.run:0,e.movement=e.FSM.movePlayer,e.FSM.addClass(e,"jumping"),e.FSM.removeClasses(e,"climbing","animated"),t.attachedCharacter=void 0},t.prototype.playerAddRestingStone=function(e){var t=e.FSM.addThing("RestingStone",e.left,e.top+48*e.FSM.unitsize);e.nocollide=!0,e.FSM.TimeHandler.addEventInterval(function(){return e.bottom<t.top?!1:(e.nocollide=!1,e.FSM.setMidXObj(t,e),e.FSM.setBottom(e,t.top),!0)},1,1/0)},t.prototype.markOverlap=function(e,t){e.overlaps?e.overlaps.push(t):e.overlaps=[t]},t.prototype.spawnDeadGoomba=function(e){e.FSM.TimeHandler.addEvent(t.prototype.killNormal,21,e)},t.prototype.spawnHammerBro=function(e){e.counter=0,e.gravity=e.FSM.MapScreener.gravity/2.1,e.FSM.TimeHandler.addEvent(e.FSM.animateThrowingHammer,35,e,7),e.FSM.TimeHandler.addEventInterval(e.FSM.animateJump,140,1/0,e)},t.prototype.spawnBowser=function(e){var t;for(e.counter=0,e.deathcount=0,t=0;t<e.fireTimes.length;t+=1)e.FSM.TimeHandler.addEventInterval(e.FSM.animateBowserFire,e.fireTimes[t],1/0,e);for(t=0;t<e.jumpTimes.length;t+=1)e.FSM.TimeHandler.addEventInterval(e.FSM.animateBowserJump,e.jumpTimes[t],1/0,e);if(e.throwing)for(t=0;t<e.throwAmount;t+=1)e.FSM.TimeHandler.addEvent(function(){e.FSM.TimeHandler.addEventInterval(e.FSM.animateBowserThrow,e.throwPeriod,1/0,e)},e.throwDelay+t*e.throwBetween)},t.prototype.spawnPiranha=function(e){var t;e.counter=0,e.direction=e.FSM.unitsize/-40,e.onPipe&&(t=e.bottom,e.FSM.setHeight(e,6),e.FSM.setBottom(e,t))},t.prototype.spawnBlooper=function(e){e.squeeze=0,e.counter=0},t.prototype.spawnPodoboo=function(e){e.FSM.TimeHandler.addEventInterval(e.FSM.animatePodobooJumpUp,e.frequency,1/0,e)},t.prototype.spawnLakitu=function(e){e.FSM.MapScreener.lakitu=e,e.FSM.TimeHandler.addEventInterval(e.FSM.animateLakituThrowingSpiny,140,1/0,e)},t.prototype.spawnCannon=function(e){e.noBullets||e.FSM.TimeHandler.addEventInterval(e.FSM.animateCannonFiring,e.frequency,e.frequency,e)},t.prototype.spawnCastleBlock=function(e){if(e.fireballs){var t,n=[];for(t=0;t<e.fireballs;t+=1)n.push(e.FSM.addThing("CastleFireball")),e.FSM.setMidObj(n[t],e);e.speed>=0?(e.dt=.07,e.angle=.25):(e.dt=-.07,e.angle=-.25),e.direction||(e.direction=-1),e.FSM.TimeHandler.addEventInterval(e.FSM.animateCastleBlock,Math.round(7/Math.abs(e.speed)),1/0,e,n)}},t.prototype.spawnMoveFloating=function(e){e.FSM.setMovementEndpoints(e),e.begin=e.FSM.MapScreener.floor*e.FSM.unitsize-e.begin,e.end=e.FSM.MapScreener.floor*e.FSM.unitsize-e.end},t.prototype.spawnMoveSliding=function(e){e.FSM.setMovementEndpoints(e)},t.prototype.spawnScalePlatform=function(e){var t=e.collection||{},n="platformLeft"===e.collectionKey?"Left":"Right",i="Left"===n?"Right":"Left";e.partners={ownString:t["string"+n],partnerString:t["string"+i],partnerPlatform:t["platform"+i]}},t.prototype.spawnRandomCheep=function(e){if(!e.MapScreener.spawningCheeps)return!0;var t=e.ObjectMaker.make("CheepCheep",{flying:!0,xvel:e.NumberMaker.random()*e.unitsize*1.4,yvel:-1.4*e.unitsize});return e.addThing(t,e.NumberMaker.random()*e.MapScreener.width,e.MapScreener.height),t.left<e.MapScreener.width/2?e.flipHoriz(t):t.xvel*=-1,!1},t.prototype.spawnRandomBulletBill=function(e){if(!e.MapScreener.spawningBulletBills)return!0;var t=e.ObjectMaker.make("BulletBill");return t.direction=1,t.moveleft=!0,t.xvel*=-1,e.flipHoriz(t),e.addThing(t,e.MapScreener.width,8*Math.floor(e.NumberMaker.randomIntWithin(0,e.MapScreener.floor)/8)*e.unitsize),!1},t.prototype.spawnCustomText=function(e){var t,n,i,o,r,a,l=e.top,p=e.texts,s=e.textAttributes,d=e.spacingHorizontal*e.FSM.unitsize,c=e.spacingVertical*e.FSM.unitsize,u=e.spacingVerticalBlank*e.FSM.unitsize,S=[];for(e.children=S,r=0;r<p.length;r+=1)if(p[r]){for(i=p[r].text,n=p[r].offset?e.left+p[r].offset*e.FSM.unitsize:e.left,a=0;a<i.length;a+=1)o=i[a],e.FSM.customTextMappings.hasOwnProperty(o)&&(o=e.FSM.customTextMappings[o]),o="Text"+e.size+o,t=e.FSM.ObjectMaker.make(o,s),t.FSM.addThing(t,n,l),S.push(t),n+=t.width*e.FSM.unitsize,n+=d;l+=c}else l+=u;e.FSM.killNormal(e)},t.prototype.spawnDetector=function(e){e.activate(e),e.FSM.killNormal(e)},t.prototype.spawnScrollBlocker=function(e){e.FSM.MapScreener.width<e.right&&(e.setEdge=!0)},t.prototype.spawnCollectionComponent=function(e,t){t.collection=e,e[t.collectionName]=t},t.prototype.spawnRandomSpawner=function(e){var t=e.FSM,n=(e.left+t.MapScreener.left)/t.unitsize;t.WorldSeeder.clearGeneratedCommands(),t.WorldSeeder.generateFull({title:e.randomization,top:e.randomTop,right:n+e.randomWidth,bottom:e.randomBottom,left:n,width:e.randomWidth,height:e.randomTop-e.randomBottom}),t.WorldSeeder.runGeneratedCommands(),t.AreaSpawner.spawnArea("xInc",t.QuadsKeeper.top/t.unitsize,t.QuadsKeeper.right/t.unitsize,t.QuadsKeeper.bottom/t.unitsize,t.QuadsKeeper.left/t.unitsize)},t.prototype.activateCheepsStart=function(e){e.FSM.MapScreener.spawningCheeps=!0,e.FSM.TimeHandler.addEventInterval(e.FSM.spawnRandomCheep,21,1/0,e.FSM)},t.prototype.activateCheepsStop=function(e){e.FSM.MapScreener.spawningCheeps=!1},t.prototype.activateBulletBillsStart=function(e){e.FSM.MapScreener.spawningBulletBills=!0,e.FSM.TimeHandler.addEventInterval(e.FSM.spawnRandomBulletBill,210,1/0,e.FSM)},t.prototype.activateBulletBillsStop=function(e){e.FSM.MapScreener.spawningBulletBills=!1},t.prototype.activateLakituStop=function(e){var t=e.FSM.MapScreener.lakitu;t&&(t.fleeing=!0,t.movement=e.FSM.moveLakituFleeing)},t.prototype.activateWarpWorld=function(e,t){var n,i,o,r=t.collection,a=0;if(e.player){for(i=r.Welcomer.children,o=0;o<i.length;o+=1)"TextSpace"!==i[o].title&&(i[o].hidden=!1);for(;;){if(n=a+"-Text",!r.hasOwnProperty(n))break;for(i=r[n].children,o=0;o<i.length;o+=1)"TextSpace"!==i[o].title&&(i[o].hidden=!1);e.FSM.killNormal(r[a+"-Piranha"]),a+=1}}},t.prototype.activateRestingStone=function(e,t){e.activated||(e.activated=!0,e.opacity=1,e.FSM.AudioPlayer.playTheme(),e.FSM.TimeHandler.addEventInterval(function(){return t.resting===e?!1:(e.FSM.killNormal(e),!0)},1,1/0))},t.prototype.activateWindowDetector=function(e){e.FSM.MapScreener.right-e.FSM.MapScreener.left<e.left||(e.activate(e),e.FSM.killNormal(e))},t.prototype.activateScrollBlocker=function(e){var t=e.FSM.MapScreener.width-e.left;e.FSM.MapScreener.canscroll=!1,e.setEdge&&t>0&&e.FSM.scrollWindow(-t)},t.prototype.activateScrollEnabler=function(e){e.FSM.MapScreener.canscroll=!0},t.prototype.activateSectionBefore=function(e){var t,n,i=e.FSM,o=i.MapsCreator,r=i.MapScreener,a=i.AreaSpawner,l=a.getArea(),p=a.getMap(),s=a.getPreThings(),d=l.sections[e.section||0],c=(e.left+r.left)/i.unitsize,u=d.before?d.before.creation:void 0;if(u)for(n=0;n<u.length;n+=1)t=i.proliferate({},u[n]),t.x?t.x+=c:t.x=c,t.sliding&&(t.begin+=c,t.end+=c),o.analyzePreSwitch(t,s,l,p);t={thing:"DetectWindow",x:c+(u?d.before.width:0),y:0,activate:i.activateSectionStretch,section:e.section||0},o.analyzePreSwitch(t,s,l,p),a.spawnArea("xInc",r.top/i.unitsize,(r.left+i.QuadsKeeper.right)/i.unitsize,r.bottom/i.unitsize,c)},t.prototype.activateSectionStretch=function(e){var t,n,i=e.FSM,o=i.MapsCreator,r=i.MapScreener,a=i.AreaSpawner,l=a.getArea(),p=a.getMap(),s=a.getPreThings(),d=l.sections[e.section||0],c=d.stretch?d.stretch.creation:void 0,u=(e.left+r.left)/i.unitsize,S=r.width/i.unitsize;if(c){for(n=0;n<c.length;n+=1)t=i.proliferate({},c[n]),t.x=u,t.width=S,o.analyzePreSwitch(t,s,l,p);t={thing:"DetectWindow",x:u+S,y:0,activate:i.activateSectionAfter,section:e.section||0},o.analyzePreSwitch(t,s,l,p)}a.spawnArea("xInc",r.top/i.unitsize,u+r.width/i.unitsize,r.bottom/i.unitsize,u)},t.prototype.activateSectionAfter=function(e){var t,n,i=e.FSM,o=i.MapsCreator,r=i.MapScreener,a=i.AreaSpawner,l=a.getArea(),p=a.getMap(),s=a.getPreThings(),d=l.sections[e.section||0],c=(e.left+r.left)/i.unitsize,u=d.after?d.after.creation:void 0;if(u)for(n=0;n<u.length;n+=1)t=i.proliferate({},u[n]),t.x?t.x+=c:t.x=c,t.sliding&&(t.begin+=c,t.end+=c),o.analyzePreSwitch(t,s,l,p);a.spawnArea("xInc",r.top/i.unitsize,c+r.right/i.unitsize,r.bottom/i.unitsize,c)},t.prototype.generateHitCharacterSolid=function(){return function(e,t){return t.up&&e!==t.up?e.FSM.collideCharacterSolidUp(e,t):(t.collide(e,t),e.undermid?e.undermid.bottomBump&&e.undermid.bottomBump(e.undermid,e):e.under&&e.under&&e.under.bottomBump&&e.under.bottomBump(e.under[0],e),void(e.checkOverlaps&&e.FSM.isCharacterOverlappingSolid(e,t)&&e.FSM.markOverlap(e,t)))}},t.prototype.generateHitCharacterCharacter=function(){return function(e,t){if(e.player){if(t.collide)return t.collide(e,t)}else e.collide&&e.collide(t,e)}},t.prototype.collideFriendly=function(e,t){e.player&&e.FSM.isThingAlive(t)&&(t.action&&t.action(e,t),t.death(t))},t.prototype.collideCharacterSolid=function(e,t){if(t.up!==e){if(e.FSM.isCharacterOnSolid(e,t)){if(t.hidden&&!t.collideHidden)return;e.resting!==t&&(e.resting=t,e.onResting&&e.onResting(e,t),t.onRestedUpon&&t.onRestedUpon(t,e))}else if(e.FSM.isSolidOnCharacter(t,e)){var n=e.FSM.getMidX(e);if(n>t.left&&n<t.right)e.undermid=t;else if(t.hidden&&!t.collideHidden)return;e.under?e.under.push(t):e.under=[t],e.player&&(e.keys.jump=!1,e.FSM.setTop(e,t.bottom-e.toly+t.yvel)),e.yvel=t.yvel}(!t.hidden||t.collideHidden)&&(e.resting===t||e.FSM.isCharacterBumpingSolid(e,t)||e.FSM.isThingOnThing(e,t)||e.FSM.isThingOnThing(t,e)||e.under||(e.right<=t.right?(e.xvel=Math.min(e.xvel,0),e.FSM.shiftHoriz(e,Math.max(t.left+e.FSM.unitsize-e.right,e.FSM.unitsize/-2))):(e.xvel=Math.max(e.xvel,0),e.FSM.shiftHoriz(e,Math.min(t.right-e.FSM.unitsize-e.left,e.FSM.unitsize/2))),e.player?t.actionLeft&&(e.FSM.ModAttacher.fireEvent("onPlayerActionLeft",e,t),t.actionLeft(e,t,t.transport)):(e.noflip||(e.moveleft=!e.moveleft),e.item&&e.collide(t,e))))}},t.prototype.collideCharacterSolidUp=function(e,t){e.onCollideUp?e.onCollideUp(e,t):(e.FSM.scoreOn(e.scoreBelow,e),e.death(e,2))},t.prototype.collideUpItem=function(e,t){e.FSM.animateCharacterHop(e),e.moveleft=e.FSM.objectToLeft(e,t)},t.prototype.collideUpCoin=function(e,t){e.blockparent=t,e.animate(e,t)},t.prototype.collideCoin=function(e,t){e.player&&(e.FSM.AudioPlayer.play("Coin"),e.FSM.ItemsHolder.increase("score",200),e.FSM.ItemsHolder.increase("coins",1),e.FSM.killNormal(t))},t.prototype.collideStar=function(e,t){e.player&&!e.star&&(e.FSM.playerStarUp(e),e.FSM.ModAttacher.fireEvent("onCollideStar",e,t))},t.prototype.collideFireball=function(e,t){if(e.FSM.isThingAlive(e)&&!(e.height<e.FSM.unitsize)){if(e.nofire)return void(e.nofire>1&&t.death(t));e.nofiredeath?(e.FSM.AudioPlayer.playLocal("Bump",e.FSM.getMidX(t)),e.death(e)):(e.FSM.AudioPlayer.playLocal("Kick",e.FSM.getMidX(t)),e.death(e,2),e.FSM.scoreOn(e.scoreFire,e)),t.death(t)}},t.prototype.collideCastleFireball=function(e,t){e.star?t.death(t):e.death(e)},t.prototype.collideShell=function(e,t){return e.shell?t.shell?e.FSM.collideShellShell(e,t):e.FSM.collideShell(e,t):"Solid"===e.groupType?e.FSM.collideShellSolid(e,t):e.player?e.FSM.collideShellPlayer(e,t):void(t.xvel?(e.FSM.killFlip(e),e.shellspawn&&(e=e.FSM.killSpawn(e)),e.FSM.AudioPlayer.play("Kick"),e.FSM.scoreOn(e.FSM.findScore(t.enemyhitcount),e),t.enemyhitcount+=1):e.moveleft=e.FSM.objectToLeft(e,t))},t.prototype.collideShellSolid=function(e,t){t.right<e.right?(e.FSM.AudioPlayer.playLocal("Bump",e.left),e.FSM.setRight(t,e.left),t.xvel=-t.speed,t.moveleft=!0):(e.FSM.AudioPlayer.playLocal("Bump",e.right),e.FSM.setLeft(t,e.right),t.xvel=t.speed,t.moveleft=!1)},t.prototype.collideShellPlayer=function(e,t){var n=e.FSM.objectToLeft(t,e),i=e.yvel>0&&e.bottom<=t.top+2*e.FSM.unitsize;return e.star?(e.FSM.scorePlayerShell(e,t),void t.death(t,2)):t.landing?void(t.shelltoleft===n?(t.landing+=1,1===t.landing&&e.FSM.scorePlayerShell(e,t),e.FSM.TimeHandler.addEvent(function(e){e.landing-=1},2,t)):e.death(e)):void(0===t.xvel||i?(t.counting=0,0===t.xvel?(e.FSM.AudioPlayer.play("Kick"),e.FSM.scorePlayerShell(e,t),n?(t.moveleft=!0,t.xvel=-t.speed):(t.moveleft=!1,t.xvel=t.speed),t.hitcount+=1,e.FSM.TimeHandler.addEvent(function(e){e.hitcount-=1},2,t)):t.xvel=0,t.peeking&&(t.peeking=0,e.FSM.removeClass(t,"peeking"),t.height-=e.FSM.unitsize/8,e.FSM.updateSize(t)),i&&(e.FSM.AudioPlayer.play("Kick"),t.xvel||(e.FSM.jumpEnemy(e,t),e.yvel*=2,e.FSM.setBottom(e,t.top-e.FSM.unitsize)),t.landing+=1,t.shelltoleft=n,e.FSM.TimeHandler.addEvent(function(e){e.landing-=1},2,t))):!t.hitcount&&(n&&t.xvel>0||!n&&t.xvel<0)&&e.death(e))},t.prototype.collideShellShell=function(e,t){if(0!==e.xvel)if(0!==t.xvel){var n=e.xvel;e.xvel=t.xvel,t.xvel=n,e.FSM.shiftHoriz(e,e.xvel),e.FSM.shiftHoriz(t,t.xvel)}else e.FSM.ItemsHolder.increase("score",500),t.death(t);else e.FSM.ItemsHolder.increase("score",500),e.death(e)},t.prototype.collideEnemy=function(e,t){if(!e.player&&t.player)return e.FSM.collideEnemy(e,t);if(e.FSM.isThingAlive(e)&&e.FSM.isThingAlive(t))if(e.item){if(e.collidePrimary)return e.collide(t,e)}else{if(!e.player)return e.moveleft=e.FSM.objectToLeft(e,t),void(t.moveleft=!e.moveleft);if(e.star&&!t.nostar||!e.FSM.MapScreener.underwater&&!t.deadly&&e.FSM.isThingOnThing(e,t)){var n=e;if(n.FSM.isCharacterAboveEnemy(n,t))return;n.star?(t.nocollide=!0,t.death(t,2),n.FSM.scoreOn(t.scoreStar,t),n.FSM.AudioPlayer.play("Kick")):(n.FSM.setBottom(n,Math.min(n.bottom,t.top+n.FSM.unitsize)),n.FSM.TimeHandler.addEvent(n.FSM.jumpEnemy,0,n,t),t.death(t,n.star?2:0),n.FSM.addClass(n,"hopping"),n.FSM.removeClasses(n,"running skidding jumping one two three"),n.hopping=!0,1===n.power&&n.FSM.setPlayerSizeSmall(n))}else e.FSM.isCharacterAboveEnemy(e,t)||e.death(e)}},t.prototype.collideBottomBrick=function(e,t){if(t.solid&&!e.solid)return e.FSM.collideBottomBrick(t,e);if(!e.up&&t.player&&(e.FSM.AudioPlayer.play("Bump"),!e.used)){if(e.up=t,t.power>1&&e.breakable&&!e.contents)return void e.FSM.TimeHandler.addEvent(e.FSM.killBrick,2,e,t);e.FSM.animateSolidBump(e),e.contents&&e.FSM.TimeHandler.addEvent(function(){e.FSM.animateSolidContents(e,t),"Coin"!==e.contents?e.FSM.animateBlockBecomesUsed(e):e.lastcoin?e.FSM.animateBlockBecomesUsed(e):e.FSM.TimeHandler.addEvent(function(){e.lastcoin=!0},245)},7)}},t.prototype.collideBottomBlock=function(e,t){if(t.solid&&!e.solid)return e.FSM.collideBottomBlock(t,e);if(!e.up&&t.player){if(e.used)return void e.FSM.AudioPlayer.play("Bump");e.used=!0,e.hidden=!1,e.up=t,e.FSM.animateSolidBump(e),e.FSM.removeClass(e,"hidden"),e.FSM.switchClass(e,"unused","used"),e.FSM.TimeHandler.addEvent(e.FSM.animateSolidContents,7,e,t)}},t.prototype.collideVine=function(e,t){!e.player||e.attachedSolid||e.climbing||e.bottom>t.bottom+2*e.FSM.unitsize||(t.attachedCharacter=e,
e.attachedSolid=t,e.nofall=!0,e.checkOverlaps=!1,e.resting=void 0,e.right<t.right?(e.lookleft=!1,e.moveleft=!1,e.attachedDirection=-1,e.FSM.unflipHoriz(e)):(e.lookleft=!0,e.moveleft=!0,e.attachedDirection=1,e.FSM.flipHoriz(e)),e.FSM.animateCharacterPauseVelocity(e),e.FSM.addClass(e,"climbing"),e.FSM.removeClasses(e,"running","jumping","skidding"),e.FSM.TimeHandler.cancelClassCycle(e,"running"),e.FSM.TimeHandler.addClassCycle(e,["one","two"],"climbing",0),e.attachedLeft=!e.FSM.objectToLeft(e,t),e.attachedOff=e.attachedLeft?1:-1,e.movement=e.FSM.movePlayerVine)},t.prototype.collideSpringboard=function(e,t){e.player&&e.yvel>=0&&!t.tension&&e.FSM.isCharacterOnSolid(e,t)?(t.tension=t.tensionSave=Math.max(.77*e.yvel,e.FSM.unitsize),e.movement=e.FSM.movePlayerSpringboardDown,e.spring=t,e.xvel/=2.8):e.FSM.collideCharacterSolid(e,t)},t.prototype.collideWaterBlocker=function(e,t){e.FSM.collideCharacterSolid(e,t)},t.prototype.collideFlagpole=function(e,t){e.bottom>t.bottom||e.FSM.ScenePlayer.startCutscene("Flagpole",{player:e,collider:t})},t.prototype.collideCastleAxe=function(e,t){e.FSM.MathDecider.compute("canPlayerTouchCastleAxe",e,t)&&e.FSM.ScenePlayer.startCutscene("BowserVictory",{player:e,axe:t})},t.prototype.collideCastleDoor=function(e,t){if(e.FSM.killNormal(e),e.player){var n=e.FSM.ItemsHolder.getItem("time");e.FSM.ScenePlayer.addCutsceneSetting("player",e),e.FSM.ScenePlayer.addCutsceneSetting("detector",t),e.FSM.ScenePlayer.addCutsceneSetting("time",n),n===1/0?e.FSM.ScenePlayer.playRoutine("Fireworks"):e.FSM.ScenePlayer.playRoutine("Countdown")}},t.prototype.collideCastleNPC=function(e,t){var n=t.collection.npc.collectionKeys;e.FSM.ScenePlayer.addCutsceneSetting("keys",n),e.FSM.ScenePlayer.addCutsceneSetting("player",e),e.FSM.ScenePlayer.addCutsceneSetting("detector",t),e.FSM.ScenePlayer.playRoutine("Dialog")},t.prototype.collideTransport=function(e,t){e.player&&(e.FSM.collideCharacterSolid(e,t),e.resting===t&&(t.xvel=e.FSM.unitsize/2,t.movement=e.FSM.movePlatform,t.collide=e.FSM.collideCharacterSolid))},t.prototype.collideDetector=function(e,t){return e.player?(t.activate(e,t),void(t.noActivateDeath||e.FSM.killNormal(t))):void(t.activateFail&&t.activateFail(e))},t.prototype.collideLevelTransport=function(e,t){if(e.player){var n=t.transport;if("undefined"==typeof n)throw new Error("No transport given to collideLevelTransport");if(n.constructor===String)e.FSM.setLocation(n);else if("undefined"!=typeof n.map)"undefined"!=typeof n.location?e.FSM.setMap(n.map,n.location):e.FSM.setMap(n.map);else{if("undefined"==typeof n.location)throw new Error("Unknown transport type:"+n);e.FSM.setLocation(n.location)}}},t.prototype.moveSimple=function(e){e.direction!==(e.moveleft?1:0)&&(e.moveleft?(e.xvel=-e.speed,e.noflip||e.FSM.unflipHoriz(e)):(e.xvel=e.speed,e.noflip||e.FSM.flipHoriz(e)),e.direction=e.moveleft?1:0)},t.prototype.moveSmart=function(e){e.FSM.moveSimple(e),0===e.yvel&&(e.resting&&e.FSM.isCharacterOnResting(e,e.resting)||(e.moveleft?e.FSM.shiftHoriz(e,e.FSM.unitsize,!0):e.FSM.shiftHoriz(e,-e.FSM.unitsize,!0),e.moveleft=!e.moveleft))},t.prototype.moveJumping=function(e){e.FSM.moveSimple(e),e.resting&&(e.yvel=-Math.abs(e.jumpheight),e.resting=void 0)},t.prototype.movePacing=function(e){e.counter+=.007,e.xvel=Math.sin(Math.PI*e.counter)/2.1},t.prototype.moveHammerBro=function(e){e.FSM.movePacing(e),e.FSM.lookTowardsPlayer(e),e.nocollidesolid=e.yvel<0||e.falling},t.prototype.moveBowser=function(e){e.flipHoriz?e.FSM.objectToLeft(e,e.FSM.player)?e.FSM.moveSimple(e):(e.moveleft=e.lookleft=!0,e.FSM.unflipHoriz(e),e.FSM.movePacing(e)):e.FSM.objectToLeft(e,e.FSM.player)?(e.moveleft=e.lookleft=!1,e.FSM.flipHoriz(e),e.FSM.moveSimple(e)):e.FSM.movePacing(e)},t.prototype.moveBowserFire=function(e){return Math.round(e.bottom)===Math.round(e.ylev)?void(e.movement=void 0):void e.FSM.shiftVert(e,Math.min(Math.max(0,e.ylev-e.bottom),e.FSM.unitsize))},t.prototype.moveFloating=function(e){e.top<=e.end?e.yvel=Math.min(e.yvel+e.FSM.unitsize/64,e.maxvel):e.bottom>=e.begin&&(e.yvel=Math.max(e.yvel-e.FSM.unitsize/64,-e.maxvel)),e.FSM.movePlatform(e)},t.prototype.moveSliding=function(e){e.FSM.MapScreener.left+e.left<=e.begin?e.xvel=Math.min(e.xvel+e.FSM.unitsize/64,e.maxvel):e.FSM.MapScreener.left+e.right>e.end&&(e.xvel=Math.max(e.xvel-e.FSM.unitsize/64,-e.maxvel)),e.FSM.movePlatform(e)},t.prototype.setMovementEndpoints=function(e){if(e.begin>e.end){var t=e.begin;e.begin=e.end,e.end=t}e.begin*=e.FSM.unitsize,e.end*=e.FSM.unitsize},t.prototype.movePlatform=function(e){e.FSM.shiftHoriz(e,e.xvel),e.FSM.shiftVert(e,e.yvel),e===e.FSM.player.resting&&e.FSM.player.alive&&(e.FSM.setBottom(e.FSM.player,e.top),e.FSM.shiftHoriz(e.FSM.player,e.xvel),e.FSM.player.right>e.FSM.MapScreener.width?e.FSM.setRight(e.FSM.player,e.FSM.MapScreener.width):e.FSM.player.left<0&&e.FSM.setLeft(e.FSM.player,0))},t.prototype.movePlatformSpawn=function(e){if(e.bottom<0)e.FSM.setTop(e,e.FSM.MapScreener.bottomPlatformMax);else{if(!(e.top>e.FSM.MapScreener.bottomPlatformMax))return void e.FSM.movePlatform(e);e.FSM.setBottom(e,0)}e.FSM.player&&e.FSM.player.resting===e&&(e.FSM.player.resting=void 0)},t.prototype.moveFalling=function(e){return e.FSM.player.resting!==e?void(e.yvel=0):(e.FSM.shiftVert(e,e.yvel+=e.FSM.unitsize/8),e.FSM.setBottom(e.FSM.player,e.top),void(e.yvel>=(e.fallThresholdStart||2.8*e.FSM.unitsize)&&(e.freefall=!0,e.movement=e.FSM.moveFreeFalling)))},t.prototype.moveFreeFalling=function(e){e.yvel+=e.acceleration||e.FSM.unitsize/16,e.FSM.shiftVert(e,e.yvel),e.yvel>=(e.fallThresholdEnd||2.1*e.FSM.unitsize)&&(e.movement=e.FSM.movePlatform)},t.prototype.movePlatformScale=function(e){if(e.FSM.player.resting===e)e.yvel+=e.FSM.unitsize/16;else{if(!(e.yvel>0))return;e.partners?e.yvel=Math.max(e.yvel-e.FSM.unitsize/16,0):e.yvel=0}e.tension+=e.yvel,e.FSM.shiftVert(e,e.yvel),e.partners&&(e.partners.partnerPlatform.tension-=e.yvel,e.partners.partnerPlatform.tension<=0&&(e.FSM.scoreOn(1e3,e),e.partners.partnerPlatform.yvel=e.FSM.unitsize/2,e.collide=e.partners.partnerPlatform.collide=e.FSM.collideCharacterSolid,e.movement=e.partners.partnerPlatform.movement=e.FSM.moveFreeFalling),e.FSM.shiftVert(e.partners.partnerPlatform,-e.yvel),e.FSM.setHeight(e.partners.ownString,e.partners.ownString.height+e.yvel/e.FSM.unitsize),e.FSM.setHeight(e.partners.partnerString,Math.max(e.partners.partnerString.height-e.yvel/e.FSM.unitsize,0)))},t.prototype.moveVine=function(e){e.FSM.increaseHeight(e,e.speed),e.FSM.updateSize(e),e.attachedSolid&&e.FSM.setBottom(e,e.attachedSolid.top),e.attachedCharacter&&e.FSM.shiftVert(e.attachedCharacter,-e.speed)},t.prototype.moveSpringboardUp=function(e){var n=e.FSM.player;e.FSM.reduceHeight(e,-e.tension,!0),e.tension*=2,e.height>e.heightNormal?(e.FSM.reduceHeight(e,(e.height-e.heightNormal)*e.FSM.unitsize),e===n.spring&&(n.yvel=e.FSM.MathDecider.compute("springboardYvelUp",e),n.resting=n.spring=void 0,n.movement=e.FSM.movePlayer),e.tension=0,e.movement=void 0):e.FSM.setBottom(n,e.top),e===n.spring&&(e.FSM.isThingTouchingThing(n,e)||(n.spring=void 0,n.movement=t.prototype.movePlayer))},t.prototype.moveShell=function(e){0===e.xvel&&(e.counting+=1,350===e.counting?(e.peeking=1,e.height+=e.FSM.unitsize/8,e.FSM.addClass(e,"peeking"),e.FSM.updateSize(e)):455===e.counting?e.peeking=2:490===e.counting&&(e.spawnSettings={smart:e.smart},e.FSM.killSpawn(e)))},t.prototype.movePiranha=function(e){var t=e.bottom,n=e.height+e.direction,i=!1;e.resting&&!e.FSM.isThingAlive(e.resting)&&(t=e.constructor.prototype.height*e.FSM.unitsize+e.top,n=1/0,e.resting=void 0),0>=n?(n=e.height=0,i=!0):n>=e.constructor.prototype.height&&(n=e.height=e.constructor.prototype.height,i=!0),e.FSM.setHeight(e,n),e.FSM.setBottom(e,t),e.canvas.height=n*e.FSM.unitsize,e.FSM.PixelDrawer.setThingSprite(e),i&&(e.counter=0,e.movement=e.FSM.movePiranhaLatent)},t.prototype.movePiranhaLatent=function(e){var t=e.FSM.getMidX(e.FSM.player);e.counter>=e.countermax&&(e.height>0||t<e.left-8*e.FSM.unitsize||t>e.right+8*e.FSM.unitsize)?(e.movement=void 0,e.direction*=-1,e.FSM.TimeHandler.addEvent(function(){e.movement=e.FSM.movePiranha},7)):e.counter+=1},t.prototype.moveBubble=function(e){e.top<e.FSM.MapScreener.top+16*e.FSM.unitsize&&e.FSM.killNormal(e)},t.prototype.moveCheepCheep=function(e){e.top<16*e.FSM.unitsize&&(e.FSM.setTop(e,16*e.FSM.unitsize),e.yvel*=-1)},t.prototype.moveCheepCheepFlying=function(e){e.top<28*e.FSM.unitsize&&(e.movement=void 0,e.nofall=!1)},t.prototype.moveBlooper=function(e){if(!e.FSM.isThingAlive(e.FSM.player))return e.xvel=e.FSM.unitsize/-4,e.yvel=0,void(e.movement=void 0);switch(e.counter){case 56:e.squeeze=1,e.counter+=1;break;case 63:e.FSM.moveBlooperSqueezing(e);break;default:e.counter+=1,e.top<18*e.FSM.unitsize&&e.FSM.moveBlooperSqueezing(e)}e.squeeze?e.yvel=Math.max(e.yvel+.021,.7):e.yvel=Math.min(e.yvel-.035,-.7),e.top>16*e.FSM.unitsize&&e.FSM.shiftVert(e,e.yvel,!0),e.squeeze||(e.FSM.player.left>e.right+8*e.FSM.unitsize?e.xvel=Math.min(e.speed,e.xvel+e.FSM.unitsize/32):e.FSM.player.right<e.left-8*e.FSM.unitsize&&(e.xvel=Math.max(-e.speed,e.xvel-e.FSM.unitsize/32)))},t.prototype.moveBlooperSqueezing=function(e){2!==e.squeeze&&(e.squeeze=2,e.FSM.addClass(e,"squeeze"),e.FSM.setHeight(e,10,!0,!0)),e.squeeze<7?e.xvel/=1.4:7===e.squeeze&&(e.xvel=0),e.squeeze+=1,(e.top>e.FSM.player.bottom||e.bottom>91*e.FSM.unitsize)&&e.FSM.animateBlooperUnsqueezing(e)},t.prototype.movePodobooFalling=function(e){return e.top>=e.starty?(e.yvel=0,e.movement=void 0,e.FSM.unflipVert(e),void e.FSM.setTop(e,e.starty)):e.yvel>=e.speed?void(e.yvel=e.speed):(!e.flipVert&&e.yvel>0&&e.FSM.flipVert(e),void(e.yvel+=e.gravity))},t.prototype.moveLakitu=function(e){var t=e.FSM.player;t.xvel>e.FSM.unitsize/8&&t.left>e.FSM.MapScreener.width/2?e.left<t.right+16*e.FSM.unitsize&&(e.FSM.slideToX(e,t.right+t.xvel+32*e.FSM.unitsize,1.4*t.maxspeed),e.counter=0):(e.counter+=.007,e.FSM.slideToX(e,t.left+t.xvel+117*Math.sin(Math.PI*e.counter),.7*t.maxspeed))},t.prototype.moveLakituInitial=function(e){return e.right<e.FSM.player.left?(e.counter=0,e.movement=e.FSM.moveLakitu,void e.movement(e)):void e.FSM.shiftHoriz(e,-e.FSM.unitsize)},t.prototype.moveLakituFleeing=function(e){e.FSM.shiftHoriz(e,-e.FSM.unitsize)},t.prototype.moveCoinEmerge=function(e,t){e.FSM.shiftVert(e,e.yvel),t&&e.bottom>=e.blockparent.bottom&&e.FSM.killNormal(e)},t.prototype.movePlayer=function(e){e.keys.up?e.keys.jump&&(e.yvel<=0||e.FSM.MapScreener.underwater)&&(e.FSM.MapScreener.underwater&&(e.FSM.animatePlayerPaddling(e),e.FSM.removeClass(e,"running")),e.resting?(e.resting.xvel&&(e.xvel+=e.resting.xvel),e.resting=void 0):(e.jumping||e.FSM.MapScreener.underwater||e.FSM.switchClass(e,"running skidding","jumping"),e.jumping=!0,e.power>1&&e.crouching&&e.FSM.removeClass(e,"jumping")),e.FSM.MapScreener.underwater||(e.keys.jumplev+=1,e.FSM.MathDecider.compute("decreasePlayerJumpingYvel",e))):e.keys.jump=!1,e.keys.crouch&&!e.crouching&&e.resting&&(e.power>1&&(e.crouching=!0,e.FSM.removeClass(e,"running"),e.FSM.addClass(e,"crouching"),e.FSM.setHeight(e,11,!0,!0),e.height=11,e.tolyOld=e.toly,e.toly=4*e.FSM.unitsize,e.FSM.updateBottom(e,0),e.FSM.updateSize(e)),e.resting.actionTop&&(e.FSM.ModAttacher.fireEvent("onPlayerActionTop",e,e.resting),e.resting.actionTop(e,e.resting))),e.FSM.MathDecider.compute("decreasePlayerRunningXvel",e)&&(e.skidding?e.FSM.addClass(e,"skidding"):e.FSM.removeClass(e,"skidding")),Math.abs(e.xvel)<.14?e.running&&(e.running=!1,1===e.power&&e.FSM.setPlayerSizeSmall(e),e.FSM.removeClasses(e,"running skidding one two three"),e.FSM.addClass(e,"still"),e.FSM.TimeHandler.cancelClassCycle(e,"running")):e.running||(e.running=!0,e.FSM.animatePlayerRunningCycle(e),1===e.power&&e.FSM.setPlayerSizeSmall(e)),e.xvel>0?(e.xvel=Math.min(e.xvel,e.maxspeed),e.moveleft&&(e.resting||e.FSM.MapScreener.underwater)&&(e.FSM.unflipHoriz(e),e.moveleft=!1)):e.xvel<0&&(e.xvel=Math.max(e.xvel,-1*e.maxspeed),e.moveleft||!e.resting&&!e.FSM.MapScreener.underwater||(e.moveleft=!0,e.FSM.flipHoriz(e))),e.resting&&(e.hopping&&(e.hopping=!1,e.FSM.removeClass(e,"hopping"),e.xvel&&e.FSM.addClass(e,"running")),e.keys.jumplev=e.yvel=e.jumpcount=0,e.jumping&&(e.jumping=!1,e.FSM.removeClass(e,"jumping"),1===e.power&&e.FSM.setPlayerSizeSmall(e),e.FSM.addClass(e,Math.abs(e.xvel)<.14?"still":"running")),e.paddling&&(e.paddling=e.swimming=!1,e.FSM.TimeHandler.cancelClassCycle(e,"paddling"),e.FSM.removeClasses(e,"paddling swim1 swim2"),e.FSM.addClass(e,"running")))},t.prototype.movePlayerVine=function(e){var t,n=e.attachedSolid;if(!n)return void(e.movement=e.FSM.movePlayer);if(e.bottom<e.attachedSolid.top)return void e.FSM.unattachPlayer(e,e.attachedSolid);if(0!==e.keys.run&&e.keys.run===e.attachedDirection)return-1===e.attachedDirection?e.FSM.setRight(e,n.left-e.FSM.unitsize):1===e.attachedDirection&&e.FSM.setLeft(e,n.right+e.FSM.unitsize),void e.FSM.unattachPlayer(e,n);if(e.keys.up)t=!0,e.FSM.shiftVert(e,e.FSM.unitsize/-4);else{if(e.keys.crouch)return t=!0,e.FSM.shiftVert(e,e.FSM.unitsize/2),void(e.top>n.bottom&&e.FSM.unattachPlayer(e,e.attachedSolid));t=!1}t&&!e.animatedClimbing?e.FSM.addClass(e,"animated"):!t&&e.animatedClimbing&&e.FSM.removeClass(e,"animated"),e.animatedClimbing=t,e.bottom<e.FSM.MapScreener.top-4*e.FSM.unitsize&&e.FSM.setLocation(e.attachedSolid.transport)},t.prototype.movePlayerSpringboardDown=function(e){var t=e.spring;return e.FSM.isThingTouchingThing(e,t)?t.height<2.5*e.FSM.unitsize||t.tension<e.FSM.unitsize/32?(e.movement=void 0,void(t.movement=e.FSM.moveSpringboardUp)):((e.left<t.left+2*e.FSM.unitsize||e.right>t.right-2*e.FSM.unitsize)&&(e.xvel/=1.4),e.FSM.reduceHeight(t,t.tension,!0),t.tension/=2,e.FSM.setBottom(e,t.top),void e.FSM.updateSize(t)):(e.movement=e.FSM.movePlayer,t.movement=e.FSM.moveSpringboardUp,void(e.spring=void 0))},t.prototype.animateSolidBump=function(e){var t=-3;e.FSM.TimeHandler.addEventInterval(function(e){return e.FSM.shiftVert(e,t),t+=.5,3.5===t?(e.up=void 0,!0):!1},1,1/0,e)},t.prototype.animateBlockBecomesUsed=function(e){e.used=!0,e.FSM.switchClass(e,"unused","used")},t.prototype.animateSolidContents=function(e,t){var n;return t&&t.player&&t.power>1&&"Mushroom"===e.contents&&(e.contents="FireFlower"),n=e.FSM.addThing(e.contents||e.constructor.prototype.contents),e.FSM.setMidXObj(n,e),e.FSM.setTop(n,e.top),n.blockparent=e,n.animate(n,e),n},t.prototype.animateBrickShards=function(e){var t,n,i,o,r=e.FSM.unitsize;for(o=0;4>o;o+=1)n=e.left+Number(2>o)*e.width*r-2*r,i=e.top+o%2*e.height*r-2*r,t=e.FSM.addThing("BrickShard",n,i),t.xvel=t.speed=r/2-r*Number(o>1),t.yvel=-1.4*r+o%2,e.FSM.TimeHandler.addEvent(e.FSM.killNormal,70,t)},t.prototype.animateEmerge=function(e,t){e.nomove=e.nocollide=e.nofall=e.alive=!0,e.FSM.flipHoriz(e),e.FSM.AudioPlayer.play("PowerupAppears"),e.FSM.arraySwitch(e,e.FSM.GroupHolder.getGroup("Character"),e.FSM.GroupHolder.getGroup("Scenery")),e.FSM.TimeHandler.addEventInterval(function(){return e.FSM.shiftVert(e,e.FSM.unitsize/-8),e.bottom>t.top?!1:(e.FSM.setBottom(e,t.top),e.FSM.GroupHolder.switchMemberGroup(e,"Scenery","Character"),e.nomove=e.nocollide=e.nofall=e.moveleft=!1,e.emergeOut&&e.emergeOut(e,t),e.movement&&(e.movementOld=e.movement,e.movement=e.FSM.moveSimple,e.FSM.TimeHandler.addEventInterval(function(){return e.resting===t?!1:(e.FSM.TimeHandler.addEvent(function(){e.movement=e.movementOld},1),!0)},1,1/0)),!0)},1,1/0)},t.prototype.animateEmergeCoin=function(e,t){e.nocollide=e.alive=e.nofall=!0,e.yvel-=e.FSM.unitsize,e.FSM.switchClass(e,"still","anim"),e.FSM.GroupHolder.switchMemberGroup(e,"Character","Scenery"),e.FSM.AudioPlayer.play("Coin"),e.FSM.ItemsHolder.increase("coins",1),e.FSM.ItemsHolder.increase("score",200),e.FSM.TimeHandler.cancelClassCycle(e,"0"),e.FSM.TimeHandler.addClassCycle(e,["anim1","anim2","anim3","anim4","anim3","anim2"],"0",5),e.FSM.TimeHandler.addEventInterval(function(){return e.FSM.moveCoinEmerge(e,t),!e.FSM.isThingAlive(e)},1,1/0),e.FSM.TimeHandler.addEvent(function(){e.FSM.killNormal(e)},49),e.FSM.TimeHandler.addEvent(function(){e.yvel*=-1},25)},t.prototype.animateEmergeVine=function(e,t){e.attachedSolid=t,e.FSM.setHeight(e,0),e.FSM.AudioPlayer.play("VineEmerging"),e.FSM.TimeHandler.addEvent(function(){e.nocollide=!1},14),e.FSM.TimeHandler.addEvent(function(){e.movement=void 0},700)},t.prototype.animateFlicker=function(e,t,n){t=Math.round(t)||49,n=Math.round(n)||2,e.flickering=!0,e.FSM.TimeHandler.addEventInterval(function(){e.hidden=!e.hidden,e.FSM.PixelDrawer.setThingSprite(e)},n,t),e.FSM.TimeHandler.addEvent(function(){e.flickering=e.hidden=!1,e.FSM.PixelDrawer.setThingSprite(e)},t*n+1)},t.prototype.animateThrowingHammer=function(e,t){return e.FSM.isThingAlive(e)?(e.FSM.isThingAlive(e.FSM.player)&&e.right>=-32*e.FSM.unitsize&&3!==t&&e.FSM.switchClass(e,"thrown","throwing"),e.FSM.TimeHandler.addEvent(function(){return e.FSM.isThingAlive(e)?(t>0?e.FSM.TimeHandler.addEvent(e.FSM.animateThrowingHammer,7,e,t-1):(e.FSM.TimeHandler.addEvent(e.FSM.animateThrowingHammer,70,e,7),e.FSM.removeClass(e,"thrown")),!e.FSM.isThingAlive(e.FSM.player)||e.right<-32*e.FSM.unitsize?void e.FSM.switchClass(e,"throwing","thrown"):void(3!==t&&(e.FSM.switchClass(e,"throwing","thrown"),e.FSM.addThing(["Hammer",{xvel:e.lookleft?e.FSM.unitsize/-1.4:e.FSM.unitsize/1.4,yvel:-1.4*e.FSM.unitsize,gravity:e.FSM.MapScreener.gravity/2.1}],e.left-2*e.FSM.unitsize,e.top-2*e.FSM.unitsize)))):void 0},14),!1):!0},t.prototype.animateBowserJump=function(e){return e.lookleft&&e.FSM.isThingAlive(e.FSM.player)?e.FSM.isThingAlive(e)?(e.resting=void 0,e.yvel=-1.4*e.FSM.unitsize,e.nocollidesolid=!0,e.FSM.TimeHandler.addEventInterval(function(){return e.dead||e.yvel>e.FSM.unitsize?(e.nocollidesolid=!1,!0):!1},3,1/0),!1):!0:!1},t.prototype.animateBowserFire=function(e){return e.lookleft&&e.FSM.isThingAlive(e.FSM.player)?e.FSM.isThingAlive(e)?(e.FSM.addClass(e,"firing"),e.FSM.AudioPlayer.playLocal("BowserFires",e.left),e.FSM.TimeHandler.addEvent(e.FSM.animateBowserFireOpen,14,e),!1):!0:!1},t.prototype.animateBowserFireOpen=function(e){var t=e.FSM.unitsize,n=Math.max(-e.height*t,Math.round(e.FSM.player.bottom/(8*t))*t*8);return e.FSM.isThingAlive(e)?(e.FSM.removeClass(e,"firing"),e.FSM.addThing(["BowserFire",{ylev:n}],e.left-8*e.FSM.unitsize,e.top+4*e.FSM.unitsize),!1):!0},t.prototype.animateBowserThrow=function(e){if(!e.lookleft||!e.FSM.player||!e.FSM.isThingAlive(e.FSM.player))return!1;if(!e.FSM.isThingAlive(e))return!0;var t=e.FSM.addThing("Hammer",e.left+2*e.FSM.unitsize,e.top-2*e.FSM.unitsize);return e.FSM.TimeHandler.addEventInterval(function(){return e.FSM.isThingAlive(e)?(e.FSM.setTop(t,e.top-2*e.FSM.unitsize),e.lookleft?e.FSM.setLeft(t,e.left+2*e.FSM.unitsize):e.FSM.setLeft(t,e.right-2*e.FSM.unitsize),!0):(e.FSM.killNormal(t),!0)},1,14),e.FSM.TimeHandler.addEvent(function(){t.xvel=1.17*e.FSM.unitsize,t.yvel=-2.1*e.FSM.unitsize,e.lookleft&&(t.xvel*=-1)},14),!1},t.prototype.animateBowserFreeze=function(e){e.nofall=!0,e.nothrow=!0,e.movement=void 0,e.dead=!0,e.FSM.animateCharacterPauseVelocity(e),e.FSM.ScenePlayer.addCutsceneSetting("bowser",e),e.FSM.TimeHandler.addEvent(function(){e.nofall=!1},70)},t.prototype.animateJump=function(e){return e.FSM.isThingAlive(e)&&e.FSM.isThingAlive(e.FSM.player)?e.resting?(e.FSM.MapScreener.floor-e.bottom/e.FSM.unitsize>=30&&"Floor"!==e.resting.title&&e.FSM.NumberMaker.randomBoolean()?(e.falling=!0,e.yvel=e.FSM.unitsize*-.7,e.FSM.TimeHandler.addEvent(function(){e.falling=!1},42)):(e.nocollidesolid=!0,e.yvel=-2.1*e.FSM.unitsize,e.FSM.TimeHandler.addEvent(function(){e.nocollidesolid=!1},42)),e.resting=void 0,!1):!1:!0},t.prototype.animateBlooperUnsqueezing=function(e){e.counter=0,e.squeeze=0,e.FSM.removeClass(e,"squeeze"),e.FSM.setHeight(e,12,!0,!0)},t.prototype.animatePodobooJumpUp=function(e){e.starty=e.top,e.yvel=-1*e.speed,e.FSM.TimeHandler.addEvent(e.FSM.animatePodobooJumpDown,e.jumpHeight,e)},t.prototype.animatePodobooJumpDown=function(e){e.movement=e.FSM.movePodobooFalling},t.prototype.animateLakituThrowingSpiny=function(e){return e.fleeing||!e.FSM.isThingAlive(e)?!0:(e.FSM.switchClass(e,"out","hiding"),void e.FSM.TimeHandler.addEvent(function(){if(!e.dead){var t=e.FSM.addThing("SpinyEgg",e.left,e.top);t.yvel=-2.1*e.FSM.unitsize,e.FSM.switchClass(e,"hiding","out")}},21))},t.prototype.animateSpinyEggHatching=function(e){if(e.FSM.isThingAlive(e)){var t=e.FSM.addThing("Spiny",e.left,e.top-e.yvel);t.moveleft=e.FSM.objectToLeft(e.FSM.player,t),e.FSM.killNormal(e)}},t.prototype.animateFireballEmerge=function(e){e.FSM.AudioPlayer.play("Fireball")},t.prototype.animateFireballExplode=function(e,t){if(e.nocollide=!0,e.FSM.killNormal(e),2!==t){var n=e.FSM.addThing("Firework");e.FSM.setMidXObj(n,e),e.FSM.setMidYObj(n,e),n.animate(n)}},t.prototype.animateFirework=function(e){var t,n=e.className+" n";for(t=0;3>t;t+=1)e.FSM.TimeHandler.addEvent(function(t){e.FSM.setClass(e,n+(t+1).toString())},7*t,t);e.FSM.AudioPlayer.play("Firework"),e.FSM.TimeHandler.addEvent(function(){e.FSM.killNormal(e)},7*t)},t.prototype.animateCannonFiring=function(e){if(e.FSM.isThingAlive(e)&&!(e.FSM.player.right>e.left-8*e.FSM.unitsize&&e.FSM.player.left<e.right+8*e.FSM.unitsize)){var t=e.FSM.ObjectMaker.make("BulletBill");e.FSM.objectToLeft(e.FSM.player,e)?(t.direction=1,t.moveleft=!0,t.xvel*=-1,e.FSM.flipHoriz(t),e.FSM.addThing(t,e.left,e.top)):e.FSM.addThing(t,e.left+e.width,e.top),e.FSM.AudioPlayer.playLocal("Bump",e.right)}},t.prototype.animatePlayerFire=function(e){if(!(e.numballs>=2)){var t=e.moveleft?e.left-e.FSM.unitsize/4:e.right+e.FSM.unitsize/4,n=e.FSM.ObjectMaker.make("Fireball",{moveleft:e.moveleft,speed:1.75*e.FSM.unitsize,jumpheight:1.56*e.FSM.unitsize,gravity:1.56*e.FSM.MapScreener.gravity,yvel:e.FSM.unitsize,movement:e.FSM.moveJumping});e.FSM.addThing(n,t,e.top+8*e.FSM.unitsize),n.animate(n),n.onDelete=function(){e.numballs-=1},e.numballs+=1,e.FSM.addClass(e,"firing"),e.FSM.TimeHandler.addEvent(function(){e.FSM.removeClass(e,"firing")},7)}},t.prototype.animateCastleBlock=function(e,t){var n,i=e.EightBitter.getMidX(e),o=e.EightBitter.getMidY(e),r=Math.cos(e.angle*Math.PI)*e.FSM.unitsize*4,a=Math.sin(e.angle*Math.PI)*e.FSM.unitsize*4;for(n=0;n<t.length;n+=1)e.FSM.setMidX(t[n],i+r*n),e.FSM.setMidY(t[n],o+a*n);e.angle+=e.dt*e.direction},t.prototype.animateCastleBridgeOpen=function(e){e.FSM.ScenePlayer.playRoutine("CastleBridgeOpen",e)},t.prototype.animateCastleChainOpen=function(e){e.FSM.TimeHandler.addEvent(e.FSM.killNormal,3,e)},t.prototype.animatePlayerPaddling=function(e){e.paddlingCycle||(e.FSM.removeClasses(e,"skidding paddle1 paddle2 paddle3 paddle4 paddle5"),e.FSM.addClass(e,"paddling"),e.FSM.TimeHandler.cancelClassCycle(e,"paddlingCycle"),e.FSM.TimeHandler.addClassCycle(e,["paddle1","paddle2","paddle3","paddle2","paddle1",function(){return e.paddlingCycle=!1}],"paddlingCycle",7)),e.paddling=e.paddlingCycle=e.swimming=!0,e.yvel=e.FSM.unitsize*-.84},t.prototype.animatePlayerLanding=function(e){e.crouching&&e.power>1&&e.FSM.setHeight(e,11,!0,!0),e.FSM.hasClass(e,"hopping")&&e.FSM.switchClass(e,"hopping","jumping"),e.FSM.MapScreener.underwater&&e.FSM.removeClass(e,"paddling"),e.FSM.ModAttacher.fireEvent("onPlayerLanding",e,e.resting)},t.prototype.animatePlayerRestingOff=function(e){e.resting=void 0,e.FSM.MapScreener.underwater&&e.FSM.switchClass(e,"running","paddling")},t.prototype.animatePlayerBubbling=function(e){e.FSM.addThing("Bubble",e.right,e.top)},t.prototype.animatePlayerRunningCycle=function(e){e.FSM.switchClass(e,"still","running"),e.running=e.FSM.TimeHandler.addClassCycle(e,["one","two","three","two"],"running",function(){return 5+Math.ceil(e.maxspeedsave-Math.abs(e.xvel))})},t.prototype.animateCharacterPauseVelocity=function(e,t){e.xvelOld=e.xvel||0,e.yvelOld=e.yvel||0,e.nofallOld=e.nofall||!1,e.nocollideOld=e.nocollide||!1,e.movementOld=e.movement||e.movementOld,e.nofall=e.nocollide=!0,e.xvel=e.yvel=0,t||(e.movement=void 0)},t.prototype.animateCharacterResumeVelocity=function(e,t){t||(e.xvel=e.xvelOld||0,e.yvel=e.yvelOld||0),e.movement=e.movementOld||e.movement,e.nofall=e.nofallOld||!1,e.nocollide=e.nocollideOld||!1},t.prototype.animateCharacterHop=function(e){e.resting=void 0,e.yvel=-1.4*e.FSM.unitsize},t.prototype.animatePlayerPipingStart=function(e){e.nocollide=e.nofall=e.piping=!0,e.xvel=e.yvel=0,e.movementOld=e.movement,e.movement=void 0,e.power>1?(e.FSM.animatePlayerRemoveCrouch(e),e.FSM.setPlayerSizeLarge(e)):e.FSM.setPlayerSizeSmall(e),e.FSM.removeClasses(e,"jumping running crouching"),e.FSM.AudioPlayer.clearTheme(),e.FSM.TimeHandler.cancelAllCycles(e),e.FSM.GroupHolder.switchMemberGroup(e,"Character","Scenery")},t.prototype.animatePlayerPipingEnd=function(e){e.movement=e.movementOld,e.nocollide=e.nofall=e.piping=!1,e.FSM.AudioPlayer.resumeTheme(),e.FSM.GroupHolder.switchMemberGroup(e,"Scenery","Character")},t.prototype.animatePlayerOffPole=function(e,t){e.FSM.removeClasses(e,"climbing running"),e.FSM.addClass(e,"jumping"),e.xvel=1.4,e.yvel=-.7,e.nocollide=e.nofall=!1,e.gravity=e.FSM.MapScreener.gravity/14,e.FSM.TimeHandler.addEvent(function(){e.movement=e.FSM.movePlayer,e.gravity=e.FSM.MapScreener.gravity,e.FSM.unflipHoriz(e),t&&e.FSM.animatePlayerRunningCycle(e)},21)},t.prototype.animatePlayerOffVine=function(e){e.FSM.flipHoriz(e),e.FSM.shiftHoriz(e,(e.width-1)*e.FSM.unitsize),e.FSM.TimeHandler.addEvent(e.FSM.animatePlayerOffPole,14,e)},t.prototype.lookTowardsThing=function(e,t){t.right<=e.left?(e.lookleft=!0,e.moveleft=!0,e.FSM.unflipHoriz(e)):t.left>=e.right&&(e.lookleft=!1,e.moveleft=!1,e.FSM.flipHoriz(e))},t.prototype.lookTowardsPlayer=function(e,t){e.FSM.player.right<=e.left?(!e.lookleft||t)&&(e.lookleft=!0,e.moveleft=!1,e.FSM.unflipHoriz(e)):e.FSM.player.left>=e.right&&(e.lookleft||t)&&(e.lookleft=!1,e.moveleft=!0,e.FSM.flipHoriz(e))},t.prototype.killNormal=function(e){e&&(e.hidden=e.dead=!0,e.alive=!1,e.numquads=0,e.movement=void 0,this.hasOwnProperty("resting")&&(e.resting=void 0),e.FSM&&e.FSM.TimeHandler.cancelAllCycles(e),e.FSM.ModAttacher.fireEvent("onKillNormal",e))},t.prototype.killFlip=function(e,t){void 0===t&&(t=0),e.FSM.flipVert(e),e.bottomBump&&(e.bottomBump=void 0),e.nocollide=e.dead=!0,e.speed=e.xvel=0,e.nofall=!1,e.resting=e.movement=void 0,e.yvel=-e.FSM.unitsize,e.FSM.TimeHandler.addEvent(e.FSM.killNormal,70+t,e)},t.prototype.killSpawn=function(e,t){if(t)return void e.FSM.killNormal(e);if(!e.spawnType)throw new Error("Thing "+e.title+" has no .spawnType.");var n=e.FSM.ObjectMaker.make(e.spawnType,e.spawnSettings||{});return e.FSM.addThing(n),e.FSM.setBottom(n,e.bottom),e.FSM.setMidXObj(n,e),e.FSM.killNormal(e),n},t.prototype.killReplace=function(e,t,n,i){void 0===n&&(n={});var o,r;if("undefined"!=typeof i)for(r=0;r<i.length;r+=1)n[i[r]]=e[i[r]];return o=e.FSM.ObjectMaker.make(t,n),e.flipHoriz&&e.FSM.flipHoriz(o),e.flipVert&&e.FSM.flipVert(o),e.FSM.addThing(o,e.left,e.top),e.FSM.killNormal(e),o},t.prototype.killGoomba=function(e,t){return t?void e.FSM.killFlip(e):void e.FSM.killSpawn(e)},t.prototype.killKoopa=function(e,t){var n;return e.jumping||e.floating?(n=e.FSM.killReplace(e,"Koopa",void 0,["smart","direction","moveleft"]),n.xvel=n.moveleft?-n.speed:n.speed):n=e.FSM.killToShell(e,Number(t)),n},t.prototype.killLakitu=function(e){var t,n=e.FSM.GroupHolder.getGroup("Character");for(e.FSM.killFlip(e),e.FSM.MapScreener.lakitu=void 0,t=0;t<n.length;t+=1)if("Lakitu"===n[t].title)return void(e.FSM.MapScreener.lakitu=n[t]);e.FSM.TimeHandler.addEvent(e.FSM.addThing.bind(e.FSM),350,"Lakitu",e.FSM.MapScreener.right,e.top)},t.prototype.killBowser=function(e,t){return t?(e.nofall=!1,e.movement=void 0,void e.FSM.killFlip(e.FSM.killSpawn(e))):(e.deathcount+=1,void(5===e.deathcount&&(e.yvel=e.speed=0,e.movement=void 0,e.FSM.killFlip(e.FSM.killSpawn(e),350),e.FSM.scoreOn(5e3,e))))},t.prototype.killToShell=function(e,t){var n,i,o;return e.spawnSettings={smart:e.smart},t&&2!==t?e.spawnType=e.title:e.spawnType=e.shelltype||"Shell",e.spawnSettings={smart:e.smart},n=e.FSM.killSpawn(e),i=n.nocollidechar,o=n.nocollideplayer,n.nocollidechar=!0,n.nocollideplayer=!0,e.FSM.TimeHandler.addEvent(function(){n.nocollidechar=i,n.nocollideplayer=o},7),e.FSM.killNormal(e),2===t&&e.FSM.killFlip(n),n},t.prototype.killNPCs=function(){var e,n,i,o,r=t.prototype.ensureCorrectCaller(this);for(e=r.GroupHolder.getGroup("Character"),o=e.length-1;o>=0;--o)n=e[o],n.nokillend?n.killonend&&n.killonend(n):(n.FSM.killNormal(n),n.FSM.arrayDeleteThing(n,e,o));for(e=r.GroupHolder.getGroup("Solid"),o=e.length-1;o>=0;--o)i=e[o],i.killonend&&(i.killonend.constructor===Function?i.killonend(i,e,o):i.FSM.arrayDeleteThing(i,e,o))},t.prototype.killBrick=function(e,t){e.FSM.AudioPlayer.play("BreakBlock"),e.FSM.TimeHandler.addEvent(e.FSM.animateBrickShards,1,e),e.FSM.killNormal(e),t instanceof e.FSM.ObjectMaker.getFunction("Thing")?e.up=t:e.up=void 0},t.prototype.killPlayer=function(e,n){if(e.alive&&!e.flickering&&!e.dieing){var i=e.FSM,o=e.FSM.AreaSpawner.getArea();if(2===n)e.dead=e.dieing=!0,e.alive=!1,i.MapScreener.notime=!0;else{if(!n&&e.power>1)return e.power=1,i.ItemsHolder.setItem("power",1),i.AudioPlayer.play("PowerDown"),void i.playerGetsSmall(e);e.dieing=!0,i.setSize(e,7.5,7,!0),i.updateSize(e),i.setClass(e,"character player dead"),i.animateCharacterPauseVelocity(e),i.arrayToEnd(e,i.GroupHolder.getGroup(e.groupType)),i.MapScreener.notime=!0,i.MapScreener.nokeys=!0,i.TimeHandler.cancelAllCycles(e),i.TimeHandler.addEvent(function(){i.animateCharacterResumeVelocity(e,!0),e.nocollide=!0,e.movement=e.resting=void 0,e.gravity=i.MapScreener.gravity/2.1,e.yvel=-1.4*t.unitsize},7)}e.nocollide=e.nomove=e.dead=!0,i.MapScreener.nokeys=!0,i.AudioPlayer.clearAll(),i.AudioPlayer.play("PlayerDies"),i.ItemsHolder.decrease("lives"),i.ItemsHolder.setItem("power",1),i.ItemsHolder.getItem("lives")>0?i.TimeHandler.addEvent(o.onPlayerDeath.bind(i),o.onPlayerDeathTimeout,i):i.TimeHandler.addEvent(o.onGameOver.bind(i),o.onGameOverTimeout,i)}},t.prototype.findScore=function(e){var n=t.prototype.ensureCorrectCaller(this);return e<n.pointLevels.length?n.pointLevels[e]:(n.gainLife(1),0)},t.prototype.score=function(e,n){if(e){var i=t.prototype.ensureCorrectCaller(this);i.scoreOn(e,i.player,!0),n||this.ItemsHolder.increase("score",e)}},t.prototype.scoreOn=function(e,t,n){if(e){var i=t.FSM.addThing("Text"+e);t.FSM.scoreAnimateOn(i,t),n||this.ItemsHolder.increase("score",e),t.FSM.ModAttacher.fireEvent("onScoreOn",e,t,n)}},t.prototype.scoreAnimateOn=function(e,t){t.FSM.setMidXObj(e,t),t.FSM.setBottom(e,t.top),t.FSM.scoreAnimate(e)},t.prototype.scoreAnimate=function(e,t){void 0===t&&(t=28),e.FSM.TimeHandler.addEventInterval(e.FSM.shiftVert,1,t,e,-e.FSM.unitsize/6),e.FSM.TimeHandler.addEvent(e.FSM.killNormal,t,e)},t.prototype.scorePlayerShell=function(e,t){return e.star?void e.FSM.scoreOn(200,t):t.resting?t.peeking?void e.FSM.scoreOn(1e3,t):e.jumpcount?void e.FSM.scoreOn(500,t):void e.FSM.scoreOn(400,t):void e.FSM.scoreOn(8e3,t)},t.prototype.scorePlayerFlag=function(e,t){var n;return n=28>t?8>t?100:400:40>t?800:62>t?2e3:5e3},t.prototype.getVolumeLocal=function(e,t){return t>e.MapScreener.right?0:Math.max(.14,Math.min(.84,(e.MapScreener.width-Math.abs(t-e.player.left))/e.MapScreener.width))},t.prototype.getAudioThemeDefault=function(e){return e.AreaSpawner.getArea().setting.split(" ")[0]},t.prototype.setMap=function(e,n){var i,o,r=t.prototype.ensureCorrectCaller(this);("undefined"==typeof e||e.constructor===t)&&(e=r.AreaSpawner.getMapName()),o=r.AreaSpawner.setMap(e),r.ModAttacher.fireEvent("onPreSetMap",o),o.seed&&r.NumberMaker.resetFromSeed(o.seed),r.ItemsHolder.setItem("world",e),r.InputWriter.restartHistory(),r.ModAttacher.fireEvent("onSetMap",o),r.setLocation(n||o.locationDefault||r.settings.maps.locationDefault),i=r.AreaSpawner.getArea().time||r.AreaSpawner.getMap().time,r.ItemsHolder.setItem("time",Number(i))},t.prototype.setLocation=function(e){void 0===e&&(e=0);var n,i=t.prototype.ensureCorrectCaller(this);i.MapScreener.nokeys=!1,i.MapScreener.notime=!1,i.MapScreener.canscroll=!0,i.MapScreener.clearScreen(),i.GroupHolder.clearArrays(),i.TimeHandler.cancelAllEvents(),i.AreaSpawner.setLocation((e||0).toString()),
i.MapScreener.setVariables(),n=i.AreaSpawner.getLocation((e||0).toString()),i.ModAttacher.fireEvent("onPreSetLocation",n),i.PixelDrawer.setBackground(i.AreaSpawner.getArea().background),i.TimeHandler.addEventInterval(i.maintainTime,25,1/0,i),i.TimeHandler.addEventInterval(i.maintainScenery,350,1/0,i),i.AudioPlayer.clearAll(),i.AudioPlayer.playTheme(),i.QuadsKeeper.resetQuadrants(),n.entry(i,n),i.ModAttacher.fireEvent("onSetLocation",n),i.GamesRunner.play()},t.prototype.mapEntranceNormal=function(e,t){t&&t.xloc&&e.scrollWindow(t.xloc*e.unitsize),e.addPlayer(16*e.unitsize,16*e.unitsize)},t.prototype.mapEntrancePlain=function(e,t){t&&t.xloc&&e.scrollWindow(t.xloc*e.unitsize),e.addPlayer(16*e.unitsize,e.MapScreener.floor*e.unitsize)},t.prototype.mapEntranceWalking=function(e,t){e.mapEntrancePlain(e,t),e.player.keys.run=1,e.player.maxspeed=e.player.walkspeed,e.MapScreener.nokeys=!0,e.MapScreener.notime=!0},t.prototype.mapEntranceCastle=function(e){e.addPlayer(2*e.unitsize,56*e.unitsize)},t.prototype.mapEntranceVine=function(e){var t=e.MapScreener.bottom-40*e.unitsize,n=e.addThing("Vine",32*e.unitsize,e.MapScreener.bottom+8*e.unitsize);e.TimeHandler.addEventInterval(function(){return n.top>=t?!1:(n.movement=void 0,e.mapEntranceVinePlayer(e,n),!0)},1,1/0)},t.prototype.mapEntranceVinePlayer=function(e,t){var n=e.MapScreener.bottom-24*e.unitsize,i=e.unitsize/-4,o=e.addPlayer(29*e.unitsize,e.MapScreener.bottom-4*e.unitsize);e.shiftVert(o,o.height*e.unitsize),e.collideVine(o,t),e.TimeHandler.addEventInterval(function(){return e.shiftVert(o,i),o.top<n?(e.TimeHandler.addEvent(e.animatePlayerOffVine,49,o),!0):!1},1,1/0)},t.prototype.mapEntrancePipeVertical=function(e,t){t&&t.xloc&&e.scrollWindow(t.xloc*e.unitsize),e.addPlayer(t.entrance.left+e.player.width*e.unitsize/2,t.entrance.top+e.player.height*e.unitsize),e.animatePlayerPipingStart(e.player),e.AudioPlayer.play("Pipe"),e.AudioPlayer.addEventListener("Pipe","ended",function(){e.AudioPlayer.playTheme()}),e.TimeHandler.addEventInterval(function(){return e.shiftVert(e.player,e.unitsize/-4),e.player.bottom<=t.entrance.top?(e.animatePlayerPipingEnd(e.player),!0):!1},1,1/0)},t.prototype.mapEntrancePipeHorizontal=function(e,t){throw new Error("mapEntrancePipeHorizontal is not yet implemented.")},t.prototype.mapEntranceRespawn=function(e){e.MapScreener.nokeys=!1,e.MapScreener.notime=!1,e.MapScreener.canscroll=!0,e.addPlayer(16*e.unitsize,0),e.animateFlicker(e.player),e.MapScreener.underwater||e.playerAddRestingStone(e.player),e.ModAttacher.fireEvent("onPlayerRespawn")},t.prototype.mapExitPipeVertical=function(e,t){!e.resting||"undefined"==typeof t.transport||e.right+2*e.FSM.unitsize>t.right||e.left-2*e.FSM.unitsize<t.left||(e.FSM.animatePlayerPipingStart(e),e.FSM.AudioPlayer.play("Pipe"),e.FSM.TimeHandler.addEventInterval(function(){return e.FSM.shiftVert(e,e.FSM.unitsize/4),e.top<=t.top?!1:(e.FSM.TimeHandler.addEvent(function(){t.transport.constructor===Object?e.FSM.setMap(t.transport.map):e.FSM.setLocation(t.transport)},42),!0)},1,1/0))},t.prototype.mapExitPipeHorizontal=function(e,t,n){(n||e.resting||e.paddling)&&(e.top<t.top||e.bottom>t.bottom||e.keys.run&&(e.FSM.animatePlayerPipingStart(e),e.FSM.AudioPlayer.play("Pipe"),e.FSM.TimeHandler.addEventInterval(function(){return e.FSM.shiftHoriz(e,e.FSM.unitsize/4),e.left<=t.left?!1:(e.FSM.TimeHandler.addEvent(function(){e.FSM.setLocation(t.transport)},42),!0)},1,1/0)))},t.prototype.initializeArea=function(){var e,n=this;if(n.attributes)for(e in n.attributes)n.hasOwnProperty(e)&&n[e]&&t.prototype.proliferate(n,n.attributes[e]);n.setBackground(n)},t.prototype.setAreaBackground=function(e){-1!==e.setting.indexOf("Underwater")||-1===e.setting.indexOf("Underworld")&&-1===e.setting.indexOf("Castle")&&-1===e.setting.indexOf("Night")?e.background="#5c94fc":e.background="#000000"},t.prototype.getAbsoluteHeight=function(e,n){var i=t.prototype.ensureCorrectCaller(this),o=e+i.MapScreener.height;return n||(o*=i.unitsize),o},t.prototype.mapAddStretched=function(e){var n=t.prototype.ensureCorrectCaller(this),i=n.AreaSpawner.getArea().boundaries,o=e instanceof String?{thing:o}:e,r=(n.MapScreener.floor-o.y)*n.unitsize,a=n.ObjectMaker.make(o.thing,{width:i.right-i.left,height:o.height||n.getAbsoluteHeight(o.y)});return n.addThing(a,i.left,r)},t.prototype.mapAddAfter=function(e){var n=t.prototype.ensureCorrectCaller(this),i=n.MapsCreator,o=n.AreaSpawner,r=o.getPreThings(),a=e instanceof String?{thing:a}:e,l=o.getArea(),p=o.getMap(),s=n.AreaSpawner.getArea().boundaries;a.x=s.right,i.analyzePreSwitch(a,r,l,p)},t.prototype.cutsceneFlagpoleStartSlidingDown=function(e,t){var n=t.player,i=t.collider,o=i.bottom-n.bottom|0,r=e.scorePlayerFlag(n,o/e.unitsize),a=e.ObjectMaker.make("Text"+r);n.star=1,n.nocollidechar=!0,e.MapScreener.nokeys=!0,e.MapScreener.notime=!0,e.MapScreener.canscroll=!1,e.killNPCs(),e.animateCharacterPauseVelocity(n),e.setRight(n,i.left+3*e.unitsize),e.killNormal(i),e.removeClasses(n,"running jumping skidding"),e.addClass(n,"climbing animated"),e.TimeHandler.addClassCycle(n,["one","two"],"climbing",0),e.TimeHandler.addEventInterval(e.shiftVert,1,64,i.collection.Flag,e.unitsize),e.addThing(a,i.right,i.bottom),e.TimeHandler.addEventInterval(e.shiftVert,1,72,a,-e.unitsize),e.TimeHandler.addEvent(e.ItemsHolder.increase.bind(e.ItemsHolder),72,"score",r),e.AudioPlayer.clearAll(),e.AudioPlayer.clearTheme(),e.AudioPlayer.play("Flagpole"),e.TimeHandler.addEventInterval(function(){return n.bottom<i.bottom?(e.shiftVert(n,e.unitsize),!1):(0|i.collection.Flag.bottom)<(0|i.bottom)?!1:(n.movement=void 0,e.setBottom(n,i.bottom),e.TimeHandler.cancelClassCycle(n,"climbing"),e.TimeHandler.addEvent(e.ScenePlayer.bindRoutine("HitBottom"),21),!0)},1,1/0)},t.prototype.cutsceneFlagpoleHitBottom=function(e,t){var n=t.player;n.keys.run=1,n.maxspeed=n.walkspeed,n.FSM.flipHoriz(n),n.FSM.shiftHoriz(n,(n.width+1)*n.FSM.unitsize),n.FSM.TimeHandler.addEvent(function(){n.FSM.AudioPlayer.play("StageClear"),n.FSM.animatePlayerOffPole(n,!0)},14)},t.prototype.cutsceneFlagpoleCountdown=function(e,t){e.TimeHandler.addEventInterval(function(){return e.ItemsHolder.decrease("time"),e.ItemsHolder.increase("score",50),e.AudioPlayer.play("Coin"),e.ItemsHolder.getItem("time")>0?!1:(e.TimeHandler.addEvent(e.ScenePlayer.bindRoutine("Fireworks"),35),!0)},1,1/0)},t.prototype.cutsceneFlagpoleFireworks=function(e,t){var n,i,o=e.MathDecider.compute("numberOfFireworks",t.time),r=t.player,a=t.detector,l=a.left,p=l-8*e.unitsize,s=a.bottom,d=s-16*e.unitsize,c=e.ObjectMaker.make("CastleFlag",{position:"beginning"}),u=28,S=28,m=[[0,-48],[-8,-40],[8,-40],[-8,-32],[0,-48],[-8,-40]],h=0;e.addThing(c,p+e.unitsize,d-24*e.unitsize),e.arrayToBeginning(c,e.GroupHolder.getGroup(c.groupType)),e.TimeHandler.addEventInterval(function(){e.shiftVert(c,e.unitsize*-.25)},1,u),o>0&&e.TimeHandler.addEventInterval(function(){i=m[h],n=e.addThing("Firework",r.left+i[0]*e.unitsize,r.top+i[1]*e.unitsize),n.animate(n),h+=1},S,o),e.TimeHandler.addEvent(function(){e.AudioPlayer.addEventImmediate("Stage Clear","ended",function(){e.collideLevelTransport(r,a),e.ScenePlayer.stopCutscene()})},h*S+420)},t.prototype.cutsceneBowserVictoryCollideCastleAxe=function(e,t){var n=t.player,i=t.axe;e.animateCharacterPauseVelocity(n),e.killNormal(i),e.killNPCs(),e.AudioPlayer.clearTheme(),e.MapScreener.nokeys=!0,e.MapScreener.notime=!0,n.FSM.TimeHandler.addEvent(function(){n.keys.run=1,n.maxspeed=n.walkspeed,e.animateCharacterResumeVelocity(n),n.yvel=0,e.MapScreener.canscroll=!0,e.AudioPlayer.play("WorldClear")},140)},t.prototype.cutsceneBowserVictoryCastleBridgeOpen=function(e,t){var n=t.routineArguments[0];e.TimeHandler.addEventInterval(function(){return n.right-=2*e.unitsize,e.setWidth(n,n.width-2),e.AudioPlayer.play("BreakBlock"),n.width<=0?(e.ScenePlayer.playRoutine("BowserFalls"),!0):!1},1,1/0)},t.prototype.cutsceneBowserVictoryBowserFalls=function(e,t){e.AudioPlayer.play("BowserFalls"),t.bowser&&(t.bowser.nofall=!0)},t.prototype.cutsceneBowserVictoryDialog=function(e,t){var n,i,o=t.player,r=t.detector,a=t.keys,l=140,p=0;o.keys.run=0,o.FSM.killNormal(r),o.FSM.TimeHandler.addEventInterval(function(){for(i=r.collection[a[p]].children,n=0;n<i.length;n+=1)"TextSpace"!==i[n].title&&(i[n].hidden=!1);p+=1},l,a.length),o.FSM.TimeHandler.addEvent(function(){o.FSM.collideLevelTransport(o,r)},280+l*a.length)},t.prototype.macroFillPreThings=function(e,t,n,i,o){var r,a,l,p,s=o.ObjectMaker.getFullPropertiesOf(e.thing),d=e.xnum||1,c=e.ynum||1,u=e.xwidth||s.width,S=e.yheight||s.height,m=e.x||0,h=e.y||0,y=[],M=0;for(l=0;d>l;++l){for(a=h,p=0;c>p;++p)r={x:m,y:a,macro:void 0},y.push(o.proliferate(r,e,!0)),M+=1,a+=S;m+=u}return y},t.prototype.macroFillPrePattern=function(e,t,n,i,o){if(!o.settings.maps.patterns[e.pattern])throw new Error("An unknown pattern is referenced: "+e);var r,a,l,p,s=o.settings.maps.patterns[e.pattern],d=s.length,c=o.ObjectMaker.getFullProperties(),u=e.repeat||1,S=e.x||0,m=e.y||0,h=[],y=0,M={};if("undefined"!=typeof e.skips)for(l=0;l<e.skips.length;l+=1)M[e.skips[l]]=!0;for(l=0;u>l;l+=1){for(p=0;d>p;p+=1)M[p]||(r=s[p],a={thing:r[0],x:S+r[1],y:m+r[2]},a.y+=c[r[0]].height,r[3]&&(a.width=r[3]),h.push(a),y+=1);S+=s.width}return h},t.prototype.macroFloor=function(e,t,n,i,o){var r=e.x||0,a=e.y||0,l=o.proliferate({thing:"Floor",x:r,y:a,width:e.width||8,height:"Infinity"},e,!0);return l.macro=void 0,l},t.prototype.macroPipe=function(e,n,i,o,r){var a=e.x||0,l=e.y||0,p=e.height||16,s=t.prototype.proliferate({thing:"Pipe",x:a,y:l,width:16,height:e.height===1/0?"Infinity":e.height||8},e,!0),d=[s];return s.macro=void 0,"Infinity"===p||p===1/0?s.height=r.MapScreener.height:s.y+=p,e.piranha&&d.push({thing:"Piranha",x:a+4,y:s.y+12,onPipe:!0}),d},t.prototype.macroPipeCorner=function(e,t,n,i,o){var r=e.x||0,a=e.y||0,l=e.height||16,p=[{thing:"PipeHorizontal",x:r,y:a,transport:e.transport||0},{thing:"PipeVertical",x:r+16,y:a+l-16,height:l}];return e.scrollEnabler&&p.push({thing:"ScrollEnabler",x:r+16,y:a+l+48,height:64,width:16}),e.scrollBlocker&&p.push({thing:"ScrollBlocker",x:r+32}),p},t.prototype.macroTree=function(e,t,n,i,o){var r=e.x||0,a=e.y||0,l=e.width||24,p=[{thing:"TreeTop",x:r,y:a,width:l}];return l>16&&p.push({thing:"TreeTrunk",x:r+8,y:a-8,width:l-16,height:"Infinity",groupType:e.solidTrunk?"Solid":"Scenery"}),p},t.prototype.macroShroom=function(e,t,n,i,o){var r=e.x||0,a=e.y||0,l=e.width||24,p=[{thing:"ShroomTop",x:r,y:a,width:l}];return l>16&&p.push({thing:"ShroomTrunk",x:r+(l-8)/2,y:a-8,height:1/0,groupType:e.solidTrunk?"Solid":"Scenery"}),p},t.prototype.macroWater=function(e,t,n,i,o){return o.proliferate({thing:"Water",x:e.x||0,y:(e.y||0)+2,height:"Infinity",macro:void 0},e,!0)},t.prototype.macroCeiling=function(e){return{macro:"Fill",thing:"Brick",x:e.x,y:88,xnum:e.width/8|0,xwidth:8}},t.prototype.macroBridge=function(e){var t=e.x||0,n=e.y||0,i=Math.max(e.width||0,16),o=[];return e.begin&&(i-=8,o.push({thing:"Stone",x:t,y:n,height:"Infinity"}),t+=8),e.end&&(i-=8,o.push({thing:"Stone",x:t+i,y:n,height:"Infinity"})),o.push({thing:"BridgeBase",x:t,y:n,width:i}),o.push({thing:"Railing",x:t,y:n+4,width:i}),o},t.prototype.macroScale=function(e,t,n,i,o){var r=e.x||0,a=e.y||0,l=o.unitsize,p=e.widthLeft||24,s=e.widthRight||24,d=e.between||40,c=e.dropLeft||24,u=e.dropRight||24,S="ScaleCollection--"+[r,a,p,s,c,u].join(",");return[{thing:"String",x:r,y:a-4,height:c-4,collectionName:S,collectionKey:"stringLeft"},{thing:"String",x:r+d,y:a-4,height:u-4,collectionName:S,collectionKey:"stringRight"},{thing:"String",x:r+4,y:a,width:d-7,collectionName:S,collectionKey:"stringMiddle"},{thing:"StringCornerLeft",x:r,y:a},{thing:"StringCornerRight",x:r+d-4,y:a},{thing:"Platform",x:r-p/2,y:a-c,width:p,inScale:!0,tension:(c-1.5)*l,onThingAdd:o.spawnScalePlatform,collectionName:S,collectionKey:"platformLeft"},{thing:"Platform",x:r+d-s/2,y:a-u,width:s,inScale:!0,tension:(u-1.5)*l,onThingAdd:o.spawnScalePlatform,collectionName:S,collectionKey:"platformRight"}]},t.prototype.macroPlatformGenerator=function(e,t,n,i,o){var r,a=[],l=e.direction||1,p=l>0?[0,48]:[8,56],s=e.width||16,d=e.x||0,c=l*o.unitsize*.42;for(r=0;r<p.length;r+=1)a.push({thing:"Platform",x:d,y:p[r],width:s,yvel:c,movement:o.movePlatformSpawn});return a.push({thing:"PlatformString",x:d+s/2-.5,y:o.MapScreener.floor,width:1,height:o.MapScreener.height/o.unitsize}),a},t.prototype.macroWarpWorld=function(e,t,n,i,o){var r,a=[],l=e.x||0,p=e.y||0,s=e.hasOwnProperty("textHeight")?e.textHeight:8,d=e.warps,c="WarpWorldCollection-"+d.join("."),u=[];for(a.push({thing:"CustomText",x:l+8,y:p+s+56,texts:[{text:"WELCOME TO WARP WORLD!"}],textAttributes:{hidden:!0},collectionName:c,collectionKey:"Welcomer"}),a.push({thing:"DetectCollision",x:l+64,y:p+174,width:40,height:102,activate:o.activateWarpWorld,collectionName:c,collectionKey:"Detector"}),r=0;r<d.length;r+=1)u.push(r),a.push({macro:"Pipe",x:l+8+32*r,height:24,transport:{map:d[r]+"-1"},collectionName:c,collectionKey:r+"-Pipe"}),a.push({thing:"Piranha",x:l+12+32*r,y:p+36,collectionName:c,collectionKey:r+"-Piranha"}),a.push({thing:"CustomText",x:l+14+32*r,y:p+32+s,texts:[{text:String(d[r])}],textAttributes:{hidden:!0},collectionName:c,collectionKey:r+"-Text"});if(1===d.length)for(r=2;r<a.length;r+=1)a[r].x+=32;return a},t.prototype.macroCheepsStart=function(e,t,n,i,o){return{thing:"DetectCollision",x:e.x||0,y:o.MapScreener.floor,width:e.width||8,height:o.MapScreener.height/o.unitsize,activate:o.activateCheepsStart}},t.prototype.macroCheepsStop=function(e,t,n,i,o){return{thing:"DetectCollision",x:e.x||0,y:o.MapScreener.floor,width:e.width||8,height:o.MapScreener.height/o.unitsize,activate:o.activateCheepsStop}},t.prototype.macroBulletBillsStart=function(e,t,n,i,o){return{thing:"DetectCollision",x:e.x||0,y:o.MapScreener.floor,width:e.width||8,height:o.MapScreener.height/o.unitsize,activate:o.activateBulletBillsStart}},t.prototype.macroBulletBillsStop=function(e,t,n,i,o){return{thing:"DetectCollision",x:e.x||0,y:o.MapScreener.floor,width:e.width||8,height:o.MapScreener.height/o.unitsize,activate:o.activateBulletBillsStop}},t.prototype.macroLakituStop=function(e,t,n,i,o){return{thing:"DetectCollision",x:e.x||0,y:o.MapScreener.floor,width:e.width||8,height:o.MapScreener.height/o.unitsize,activate:o.activateLakituStop}},t.prototype.macroCastleSmall=function(e,t,n,i,o){var r,a,l=[],p=e.x||0,s=e.y||0;for(r=0;2>r;r+=1)for(l.push({thing:"BrickHalf",x:p+8*r,y:s+4,position:"end"}),a=1;3>a;a+=1)l.push({thing:"BrickPlain",x:p+8*r,y:s+4+8*a,position:"end"});for(r=0;2>r;r+=1)for(l.push({thing:"BrickHalf",x:p+24+8*r,y:s+4,position:"end"}),a=1;3>a;a+=1)l.push({thing:"BrickPlain",x:p+24+8*r,y:s+4+8*a,position:"end"});for(l.push({thing:"CastleRailing",x:p,y:s+24,position:"end"}),r=0;3>r;r+=1)l.push({thing:"CastleRailingFilled",x:p+8*(r+1),y:s+24,position:"end"});for(l.push({thing:"CastleRailing",x:p+32,y:s+24,position:"end"}),r=0;3>r;r+=1)l.push({thing:"CastleRailing",x:p+8*(r+1),y:s+40,position:"end"});for(r=0;2>r;r+=1)l.push({thing:"CastleTop",x:p+8+12*r,y:s+36,position:"end"});return l.push({thing:"CastleDoor",x:p+16,y:s+20,position:"end"}),e.transport&&l.push({thing:"DetectCollision",x:p+24,y:s+16,height:16,activate:o.collideCastleDoor,transport:e.transport,position:"end"}),l},t.prototype.macroCastleLarge=function(e,t,n,i,o){var r,a,l=[],p=e.x||0,s=e.y||0;for(l.push({macro:"CastleSmall",x:p+16,y:s+48}),r=0;2>r;r+=1)l.push({thing:"CastleWall",x:p+8*r,y:s+48});for(r=0;3>r;r+=1)for(l.push({thing:"CastleDoor",x:p+16+16*r,y:s+20,position:"end"}),a=0;2>a;a+=1)l.push({thing:"BrickPlain",x:p+16+16*r,y:s+28+8*a}),l.push({thing:"BrickHalf",x:p+16+16*r,y:s+40+4*a});for(r=0;2>r;r+=1){for(a=0;3>a;a+=1)l.push({thing:"BrickPlain",x:p+24+16*r,y:s+8+8*a});l.push({thing:"CastleDoor",x:p+24+16*r,y:s+44})}for(r=0;5>r;r+=1)l.push({thing:"CastleRailingFilled",x:p+16+8*r,y:s+48});for(a=e.hasOwnProperty("walls")?e.walls:2,r=0;a>r;r+=1)l.push({thing:"CastleWall",x:p+56+8*r,y:s+48,position:"end"});return e.transport&&l.push({thing:"DetectCollision",x:p+24,y:s+16,height:16,activate:o.collideCastleDoor,transport:e.transport,position:"end"}),l},t.prototype.macroStartInsideCastle=function(e){var t=e.x||0,n=e.y||0,i=(e.width||0)-40,o=[{thing:"Stone",x:t,y:n+48,width:24,height:1/0},{thing:"Stone",x:t+24,y:n+40,width:8,height:1/0},{thing:"Stone",x:t+32,y:n+32,width:8,height:1/0}];return i>0&&o.push({macro:"Floor",x:t+40,y:n+24,width:i}),o},t.prototype.macroEndOutsideCastle=function(e,n,i,o,r){var a,l=e.x||0,p=e.y||0,s="EndOutsideCastle-"+[e.x,e.y,e.large].join(",");return a=[{thing:"DetectCollision",x:l,y:p+108,height:100,activate:t.prototype.collideFlagpole,activateFail:t.prototype.killNormal,noActivateDeath:!0,collectionName:s,collectionKey:"DetectCollision"},{thing:"Flag",x:l-4.5,y:p+79.5,collectionName:s,collectionKey:"Flag"},{thing:"FlagTop",x:l+1.5,y:p+84,collectionName:s,collectionKey:"FlagTop"},{thing:"FlagPole",x:l+3,y:p+80,collectionName:s,collectionKey:"FlagPole"},{thing:"Stone",x:l,y:p+8,collectionName:s,collectionKey:"FlagPole"}],e.large?a.push({macro:"CastleLarge",x:l+(e.castleDistance||24),y:p,transport:e.transport,walls:e.walls||8}):a.push({macro:"CastleSmall",x:l+(e.castleDistance||32),y:p,transport:e.transport}),a},t.prototype.macroEndInsideCastle=function(e,t,n,i,o){var r,a,l,p=e.x||0,s=e.y||0,d=e.npc||"Toad";return"Toad"===d?(l=["1","2"],a=[{thing:"CustomText",x:p+164,y:s+64,texts:[{text:"THANK YOU MARIO!"}],textAttributes:{hidden:!0},collectionName:"endInsideCastleText",collectionKey:"1"},{thing:"CustomText",x:p+152,y:s+48,texts:[{text:"BUT OUR PRINCESS IS IN"},{text:"ANOTHER CASTLE!"}],textAttributes:{hidden:!0},collectionName:"endInsideCastleText",collectionKey:"2"}]):"Peach"===d&&(l=["1","2","3"],a=[{thing:"CustomText",x:p+164,y:s+64,texts:[{text:"THANK YOU MARIO!"}],textAttributes:{hidden:!0},collectionName:"endInsideCastleText",collectionKey:"1"},{thing:"CustomText",x:p+152,y:s+48,texts:[{text:"YOUR QUEST IS OVER.",offset:12},{text:"WE PRESENT YOU A NEW QUEST."}],textAttributes:{hidden:!0},collectionName:"endInsideCastleText",collectionKey:"2"},{thing:"CustomText",x:p+152,y:32,texts:[{text:"PRESS BUTTON B",offset:8},{text:"TO SELECT A WORLD"}],textAttributes:{hidden:!0},collectionName:"endInsideCastleText",collectionKey:"3"}]),r=[{thing:"Stone",x:p,y:s+88,width:256},{macro:"Water",x:p,y:s,width:104},{thing:"CastleBridge",x:p,y:s+24,width:104},{thing:"Bowser",x:p+69,y:s+42,hard:e.hard,spawnType:e.spawnType||"Goomba",throwing:e.throwing},{thing:"CastleChain",x:p+96,y:s+32},{thing:"CastleAxe",x:p+104,y:s+40},{thing:"ScrollBlocker",x:p+112},{macro:"Floor",x:p+104,y:s,width:152},{thing:"Stone",x:p+104,y:s+32,width:24,height:32},{thing:"Stone",x:p+112,y:s+80,width:16,height:24},{thing:"DetectCollision",x:p+180,activate:o.collideCastleNPC,transport:e.transport,collectionName:"endInsideCastleText",collectionKey:"npc",collectionKeys:l},{thing:d,x:p+200,y:13},{thing:"ScrollBlocker",x:p+256}],e.topScrollEnabler&&(r.push({thing:"ScrollEnabler",x:p+96,y:s+140,height:52,width:16}),r.push({thing:"ScrollEnabler",x:p+240,y:s+140,height:52,width:16})),r.push.apply(r,a),r},t.prototype.macroSection=function(e,t,n,i,o){return{thing:"DetectSpawn",x:e.x||0,y:e.y||0,activate:o.activateSectionBefore,section:e.section||0}},t.prototype.macroSectionPass=function(e){return{thing:"DetectCollision",x:e.x||0,y:e.y||0,width:e.width||8,height:e.height||8,activate:function(e){e.FSM.AudioPlayer.play("Coin"),e.FSM.MapScreener.sectionPassed=!0}}},t.prototype.macroSectionFail=function(e){return[{thing:"DetectCollision",x:e.x,y:e.y,width:e.width||8,height:e.height||8,activate:function(e){e.FSM.AudioPlayer.play("Fail"),e.FSM.MapScreener.sectionPassed=!1}}]},t.prototype.macroSectionDecider=function(e){return{thing:"DetectSpawn",x:e.x||0,y:e.y||0,activate:function(t){t.FSM.MapScreener.sectionPassed?t.section=e.pass||0:t.section=e.fail||0,t.FSM.activateSectionBefore(t)}}},t.prototype.ensureCorrectCaller=function(e){if(!(e instanceof t))throw new Error("A function requires the scope ('this') to be the manipulated PlayMarioJas object. Unfortunately, 'this' is a "+typeof this+".");return e},t.settings={audio:void 0,collisions:void 0,devices:void 0,editor:void 0,generator:void 0,groups:void 0,events:void 0,help:void 0,input:void 0,math:void 0,maps:void 0,mods:void 0,objects:void 0,quadrants:void 0,renderer:void 0,runner:void 0,scenes:void 0,sprites:void 0,items:void 0,touch:void 0,ui:void 0},t.unitsize=4,t.scale=2,t.gravity=Math.round(12*t.unitsize)/100,t.pointLevels=[100,200,400,500,800,1e3,2e3,4e3,5e3,8e3],t.customTextMappings={" ":"Space",".":"Period","!":"ExclamationMark",":":"Colon","/":"Slash","©":"Copyright"},t}(GameStartr.GameStartr);e.PlayMarioJas=t}(PlayMarioJas||(PlayMarioJas={}));
PlayMarioJas.PlayMarioJas.settings.audio = {
    "directory": "Sounds",
    "fileTypes": ["mp3", "ogg"],
    "library": {
        "Sounds": [
            "BowserFalls",
            "BowserFires",
            "BreakBlock",
            "Bump",
            "Coin",
            "Ending",
            "Fail",
            "Fireball",
            "Firework",
            "Flagpole",
            "GainLife",
            "GameOver2",
            "GameOver",
            "Hurry",
            "JumpSmall",
            "JumpSuper",
            "Kick",
            "LevelComplete",
            "PlayerDies",
            "Pause",
            "Pipe",
            "PowerDown",
            "PowerupAppears",
            "Powerup",
            "StageClear",
            "VineEmerging",
            "WorldClear",
            "YouDead"
        ],
        "Themes": [
            "Castle",
            "Overworld",
            "Underwater",
            "Underworld",
            "Star",
            "Sky",
            "HurryCastle",
            "HurryOverworld",
            "HurryUnderwater",
            "HurryUnderworld",
            "HurryStar",
            "HurrySky"
        ]
    }
};
/// <reference path="../PlayMarioJas.ts" />
var PlayMarioJas;
(function (PlayMarioJas) {
    "use strict";
    PlayMarioJas.PlayMarioJas.settings.collisions = {
        "keyGroupName": "groupType",
        "keyTypeName": "title",
        "globalCheckGenerators": {
            "Character": PlayMarioJas.PlayMarioJas.prototype.generateCanThingCollide,
            "Solid": PlayMarioJas.PlayMarioJas.prototype.generateCanThingCollide
        },
        "hitCheckGenerators": {
            "Character": {
                "Character": PlayMarioJas.PlayMarioJas.prototype.generateIsCharacterTouchingCharacter,
                "Solid": PlayMarioJas.PlayMarioJas.prototype.generateIsCharacterTouchingSolid
            }
        },
        "hitCallbackGenerators": {
            "Character": {
                "Solid": PlayMarioJas.PlayMarioJas.prototype.generateHitCharacterSolid,
                "Character": PlayMarioJas.PlayMarioJas.prototype.generateHitCharacterCharacter
            }
        }
    };
})(PlayMarioJas || (PlayMarioJas = {}));
PlayMarioJas.PlayMarioJas.settings.devices = {
    "triggers": {
        "a": {
            "trigger": "up"
        },
        "b": {
            "trigger": "sprint"
        },
        "dpadUp": {
            "trigger": "up"
        },
        "dpadDown": {
            "trigger": "down"
        },
        "dpadLeft": {
            "trigger": "left"
        },
        "dpadRight": {
            "trigger": "right"
        },
        "leftTrigger": {
            "trigger": "sprint"
        },
        "rightTrigger": {
            "trigger": "sprint"
        },
        "select": {
            "trigger": "sprint"
        },
        "start": {
            "trigger": "pause"
        },
        "leftJoystick": {
            "x": {
                "negative": "left",
                "positive": "right"
            },
            "y": {
                "negative": "up",
                "positive": "down"
            }
        },
        "rightJoystick": {
            "x": {
                "negative": "left",
                "positive": "right"
            },
            "y": {
                "negative": "up",
                "positive": "down"
            }
        }
    },
    "aliases": {
        "on": "onkeydown",
        "off": "onkeyup"
    }
};
PlayMarioJas.PlayMarioJas.settings.editor = (function (prethings, macros) {
    return {
        "blocksize": PlayMarioJas.PlayMarioJas.unitsize * 4,
        "mapDefault": {
            "name": "New Map 4 Mario",
            "time": "Infinity",
            "locations": [
                { "entry": "Plain" }
            ],
            "areas": [
                {
                    "setting": "Overworld",
                    "creation": [
                        { "macro": "Floor", "x": 0, "y": 0, "width": 128 }
                    ]
                }
            ]
        },
        "prethings": prethings,
        "mapSettingDefault": "Overworld",
        "mapEntrances": ["Plain", "Normal", "Castle", "PipeVertical", "Walking"],
        "thingGroups": ["Text", "Character", "Solid", "Scenery"],
        "things": (function () {
            var things = {},
                i, j;

            for (i in prethings) {
                if (prethings.hasOwnProperty(i)) {
                    for (j in prethings[i]) {
                        if (prethings[i].hasOwnProperty(j)) {
                            things[j] = prethings[i][j];
                        }
                    }
                }
            }

            return things;
        })(),
        "macros": macros
    };
})({
    "Characters": {
        "Goomba": {},
        "Koopa": {
            "options": {
                "smart": "Boolean",
                "jumping": "Boolean",
                "flying": "Boolean"
            }
        },
        "Beetle": {},
        "Piranha": {
            "options": {
                "evil": "Boolean"
            }
        },
        "Blooper": {},
        "CheepCheep": {
            "options": {
                "smart": "Boolean"
            }
        },
        "Podoboo": {},
        "Lakitu": {},
        "HammerBro": {},
        "Bowser": {
            "options": {
                "contents": {
                    "type": "String",
                    "options": [
                        "Gooma", "Koopa", "HammerBro", "Bowser"
                    ]
                }
            }
        }
    },
    "Items": {
        "Mushroom": {},
        "Mushroom1Up": {},
        "MushroomDeathly": {},
        "FireFlower": {},
        "Star": {},
        "Shell": {
            "offsetTop": 1,
            "options": {
                "smart": "Boolean"
            },
        },
        "BeetleShell": {},
        "Coin": {}
    },
    "Solids": {
        "Block": {
            "options": {
                "contents": {
                    "type": "String",
                    "options": [
                        "Coin", "Mushroom", "Star", "Mushroom1Up", "MushroomDeathly"
                    ]
                },
                "hidden": "Boolean"
            }
        },
        "Brick": {
            "options": {
                "contents": {
                    "type": "String",
                    "options": [
                        "", "Coin", "Mushroom", "Star", "Mushroom1Up", "MushroomDeathly"
                    ]
                }
            }
        },
        "Pipe": {
            "options": {
                "height": {
                    "type": "Number",
                    "value": 2,
                    "mod": 8,
                    "Infinite": true
                }
            }
        },
        "PipeHorizontal": {
            "options": {
                "width": {
                    "type": "Number",
                    "value": 2,
                    "mod": 8
                },
                "transport": "Location"
            }
        },
        "PipeVertical": {
            "options": {
                "height": {
                    "type": "Number",
                    "value": 2,
                    "mod": 8,
                    "Infinite": true,
                    "real": 8
                },
                "transport": "Location"
            }
        },
        "Platform": {
            "options": {
                "width": {
                    "type": "Number",
                    "value": 4,
                    "mod": 2,
                    "real": 2
                }
            }
        },
        "Stone": {
            "options": {
                "width": {
                    "type": "Number",
                    "mod": 8
                },
                "height": {
                    "type": "Number",
                    "Infinite": true,
                    "mod": 8
                }
            }
        },
        "Cannon": {
            "options": {
                "height": {
                    "type": "Number",
                    "mod": 8
                }
            }
        },
        "Springboard": {
            "offsetTop": 1.5
        },
        "Floor": {
            "options": {
                "width": {
                    "type": "Number",
                    "value": 1,
                    "mod": 8
                },
                "height": {
                    "type": "Number",
                    "value": Infinity,
                    "Infinite": true,
                    "mod": 8
                }
            }
        },
        "CastleBlock": {
            "options": {
                "fireballs": {
                    "type": "Number",
                    "value": 0,
                    "mod": 4
                }
            }
        },
        "CastleBridge": {
            "options": {
                "width": {
                    "type": "Number",
                    "mod": 8,
                    "real": 4
                }
            }
        },
        "Coral": {
            "options": {
                "width": {
                    "type": "Number",
                    "mod": 8
                },
                "height": {
                    "type": "Number",
                    "mod": 8
                }
            }
        }
    },
    "Scenery": {
        "BrickPlain": {},
        "Bush1": {},
        "Bush2": {},
        "Bush3": {},
        "Cloud1": {},
        "Cloud2": {},
        "Cloud3": {},
        "Fence": {
            "options": {
                "width": {
                    "type": "Number",
                    "mod": 8
                }
            }
        },
        "HillSmall": {
            "offsetTop": -1.5
        },
        "HillLarge": {
            "offsetTop": 2.5
        },
        "PlantSmall": {
            "offsetTop": 1
        },
        "PlantLarge": {
            "offsetTop": 1
        },
        "Railing": {
            "options": {
                "width": {
                    "type": "Number",
                    "mod": 4,
                    "value": 1
                }
            }
        },
        "Water": {
            "options": {
                "width": {
                    "type": "Number",
                    "mod": 4,
                    "value": 1
                }
            }
        }
    }
}, {
    "Fill": {
        "description": "Place a bunch of Things at once, as a grid.",
        "options": {
            "thing": "Everything",
            "xnum": 1,
            "ynum": 1,
            "xwidth": 8,
            "yheight": 8
        }
    },
    "Pattern": {
        "description": "Fill one of the preset Scenery background patterns.",
        "options": {
            "pattern": [
                "BackRegular", "BackCloud", "BackFence", "BackFenceMin", "BackFenceMin2", "BackFenceMin3"
            ],
            "repeat": "Number"
        }
    },
    "Floor": {
        "description": "Place a floor of infinite height.",
        "options": {
            "width": {
                "type": "Number",
                "value": 8,
                "mod": 4
            }
        }
    },
    "Pipe": {
        "description": "Add a pipe with the option for piranhas and moving to locations.",
        "options": {
            "height": {
                "type": "Number",
                "value": 2,
                "mod": 8,
                "Infinite": true
            },
            "piranha": "Boolean",
            "transport": "Location",
            "entrance": "Location"
        }
    },
    "Tree": {
        "description": "Add a tree to the map.",
        "options": {
            "width": {
                "type": "Number",
                "value": 4,
                "mod": 8
            }
        }
    },
    "Shroom": {
        "function": "macroShroom",
        "description": "Add a mushroom tree to the map.",
        "options": {
            "width": {
                "type": "Number",
                "value": 4,
                "mod": 8
            }
        }
    },
    "Scale": {
        "function": "macroScale",
        "description": "Add two platforms suspended by string to the map.",
        "options": {
            "widthLeft": {
                "type": "Number",
                "value": 6,
                "mod": 4
            },
            "widthRight": {
                "type": "Number",
                "value": 6,
                "mod": 4
            },
            "between": {
                "type": "Number",
                "value": 10,
                "mod": 4
            },
            "dropLeft": {
                "type": "Number",
                "value": 6,
                "mod": 4
            },
            "dropRight": {
                "type": "Number",
                "value": 6,
                "mod": 4
            },
        }
    },
    "Water": {
        "function": "macroWater",
        "description": "Fill water of infinite height.",
        "options": {
            "width": 4
        }
    },
    "CastleSmall": {
        "description": "Add a one-story castle to the map."
    },
    "CastleLarge": {
        "description": "Add a two-story castle to the map."
    },
    "Ceiling": {
        "description": "Add an Underworld-style ceiling of Bricks.",
        "options": {
            "width": "Number"
        }
    },
    "Bridge": {
        "description": "Create a bridge, complete with stone columns.",
        "options": {
            "width": 8,
            "start": "Boolean",
            "end": "Boolean"
        }
    },
    "PlatformGenerator": {
        "description": "Add a columnn of infinitely generated platforms.",
        "options": {
            "width": 8,
            "direction": {
                "type": "Number",
                "options": [1, -1]
            }
        }
    },
    "StartInsideCastle": {
        "description": "Add the castle stones similar to typical Castles.",
        "options": {
            "width": 8
        }
    },
    "EndOutsideCastle": {
        "description": "End the map off with an outdoor flag and Castle.",
        "options": {
            "transport": "Location",
            "large": "Boolean",
            "castleDistance": {
                "type": "Number",
                "value": 24,
                "mod": 1,
            },
            "walls": {
                "type": "Number",
                "value": 2
            }
        }
    },
    "EndInsideCastle": {
        "description": "End the map off with an indoor bridge, Bowser, and Toad.",
        "options": {
            "transport": "Location",
            "npc": {
                "type": "String",
                "options": ["Toad", "Peach"]
            },
            "hard": "Boolean",
            "spawnType": "Everything",
            "throwing": "Boolean",
            "topScrollEnabler": "Boolean"
        }
    }
});
PlayMarioJas.PlayMarioJas.settings.generator={possibilities:{Overworld:{height:80,width:2992,contents:{mode:"Certain",direction:"right",children:[{type:"Known",title:"ScrollEnabler"},{type:"Random",title:"OverworldStart"},{type:"Random",title:"OverworldBody"},{type:"Random",title:"OverworldEnd"}]}},OverworldStart:{width:112,height:80,contents:{mode:"Certain",direction:"top",spacing:-8,children:[{type:"Known",title:"Floor",arguments:{macro:"Floor",width:112}},{type:"Random",title:"OverworldScenery"}]}},OverworldBody:{width:2480,height:80,contents:{mode:"Multiple",children:[{type:"Random",title:"OverworldRandomization"},{type:"Random",title:"OverworldClouds"}]}},OverworldRandomization:{width:2480,height:80,contents:{mode:"Repeat",direction:"right",children:[{type:"Random",title:"OverworldClump"},{type:"Random",title:"OverworldSegwaySpotty"},{type:"Random",title:"OverworldSegway"},{type:"Random",title:"OverworldSegwaySpotty"}]}},OverworldClump:{width:320,height:80,contents:{mode:"Random",direction:"right",children:[{percent:60,type:"Random",title:"OverworldClumpLand"},{percent:20,type:"Random",title:"OverworldClumpWater"},{percent:20,type:"Random",title:"OverworldClumpTrees"}]}},OverworldClumpLand:{width:160,height:80,contents:{mode:"Multiple",children:[{type:"Random",title:"OverworldScenery"},{type:"Random",title:"OverworldLandArea"}]}},OverworldLandArea:{width:160,height:80,contents:{mode:"Certain",direction:"top",children:[{type:"Known",title:"Floor",arguments:{macro:"Floor",width:160}},{type:"Random",title:"LandObstacleGroup"}]}},OverworldClumpWater:{width:320,height:80,contents:{mode:"Multiple",children:[{type:"Random",title:"Water",sizing:{height:8,width:320}},{type:"Random",title:"OverworldClumpWaterMain"}]}},OverworldClumpWaterMain:{width:320,height:80,contents:{mode:"Certain",direction:"top",spacing:{min:0,max:16,units:8},children:[{type:"Random",title:"Nothing"},{type:"Random",title:"OverworldClumpWaterContents"}]}},OverworldClumpWaterContents:{width:320,height:8,contents:{mode:"Certain",direction:"right",children:[{type:"Random",title:"CheepsStart"},{type:"Random",title:"OverworldClumpWaterBridge"},{type:"Random",title:"CheepsStop"}]}},OverworldClumpWaterBridge:{width:320,height:8,contents:{mode:"Certain",direction:"top",spacing:24,children:[{type:"Known",title:"Bridge",sizing:{width:320},arguments:{macro:"Bridge",width:320,begin:!0,end:!0}},{type:"Random",title:"OverworldClumpWaterBridgeBlock"}]}},OverworldClumpWaterBridgeBlock:{width:320,height:8,contents:{mode:"Certain",direction:"right",spacing:{min:80,max:240,units:8},children:[{type:"Random",title:"Nothing"},{type:"Known",title:"Block",arguments:[{percent:70,values:{contents:"Mushroom"}},{percent:30,values:{contents:"Star"}}]}]}},OverworldClumpTrees:{width:320,height:80,contents:{mode:"Random",direction:"right",spacing:{min:0,max:24,units:8},children:[{percent:40,type:"Random",title:"OverworldTreeLarge"},{percent:40,type:"Random",title:"OverworldTreesSmall"},{percent:20,type:"Random",title:"PlatformGenerator"}]}},OverworldTreesSmall:{width:64,height:80,contents:{mode:"Certain",direction:"right",spacing:{min:0,max:8,units:8},children:[{type:"Random",title:"OverworldTreeSmallShort"},{type:"Random",title:"OverworldTreeSmall"}]}},OverworldTreeSmall:{width:24,height:80,contents:{mode:"Repeat",limit:1,direction:"top",spacing:{min:32,max:88,units:8},children:[{type:"Random",title:"Nothing"},{type:"Random",title:"TreeFancy"}]}},OverworldTreeSmallShort:{width:24,height:80,contents:{mode:"Certain",direction:"top",snap:"bottom",spacing:{min:0,max:16,units:8},children:[{type:"Random",title:"Nothing"},{type:"Known",title:"Tree",arguments:{macro:"Tree",width:24}}]}},OverworldTreeLarge:{width:64,height:80,contents:{mode:"Multiple",direction:"right",spacing:{min:0,max:40,units:8},children:[{type:"Random",title:"OverworldTreeLargeBase"},{type:"Random",title:"OverworldTreeSmall"}]}},OverworldTreeLargeBase:{width:64,height:80,contents:{mode:"Certain",direction:"top",snap:"bottom",spacing:[0,8,8],children:[{type:"Random",title:"Nothing"},{type:"Known",title:"Tree",arguments:{macro:"Tree",width:64}},{type:"Random",title:"TreeLargeCoins"}]}},OverworldSegway:{width:112,height:80,contents:{mode:"Random",direction:"right",children:[{percent:30,type:"Random",title:"OverworldSegwaySpotty"},{percent:20,type:"Random",title:"OverworldSegwayEnemySpots"},{percent:15,type:"Random",title:"OverworldSegwayRamps"},{percent:15,type:"Random",title:"OverworldSegwayWatery"},{percent:10,type:"Random",title:"OverworldSegwaySpring"},{percent:10,type:"Random",title:"OverworldSegwayPipeTransit"}]}},OverworldSegwaySpotty:{width:112,height:80,contents:{mode:"Random",direction:"right",children:[{percent:60,type:"Random",title:"OverworldSegwaySpot"},{percent:40,type:"Random",title:"Nothing"}]}},OverworldSegwaySpot:{width:8,height:80,contents:{mode:"Certain",direction:"top",children:[{type:"Known",title:"Floor",arguments:{macro:"Floor"}},{type:"Random",title:"OverworldSegwaySpotContent"}]}},OverworldSegwaySpotContent:{width:8,height:24,contents:{mode:"Random",direction:"top",spacing:24,children:[{percent:90,type:"Random",title:"OverworldSegwaySpotScenery"},{percent:10,type:"Random",title:"KoopaJumping"}]}},OverworldSegwayEnemySpots:{width:112,height:24,contents:{mode:"Repeat",direction:"right",spacing:[{percent:60,value:0},{percent:25,value:8},{percent:15,value:16}],children:[{type:"Random",title:"OverworldSegwayEnemySpot"}]}},OverworldSegwayEnemySpot:{width:32,height:80,contents:{mode:"Certain",direction:"top",children:[{type:"Known",title:"Floor",arguments:{macro:"Floor",width:32}},{type:"Random",title:"OverworldSegwayEnemySpotContent"}]}},OverworldSegwayEnemySpotContent:{width:32,height:80,contents:{mode:"Random",direction:"right",children:[{percent:45,type:"Random",title:"EnemyEasy"},{percent:15,type:"Random",title:"Nothing"},{percent:40,type:"Random",title:"LandObstacleGroupVertical"}]}},OverworldSegwayRamps:{width:112,height:80,contents:{mode:"Certain",direction:"right",children:[{type:"Random",title:"RampUpSmallFloor"},{type:"Random",title:"Nothing",sizing:{width:48}},{type:"Random",title:"RampDownSmallFloor"}]}},OverworldSegwayFloating:{width:112,height:80,contents:{mode:"Random",direction:"right",children:[{percent:50,type:"Random",title:"Nothing"},{percent:50,type:"Random",title:"OverworldSegwayFloat"}]}},OverworldSegwayFloat:{width:8,height:80,contents:{mode:"Certain",direction:"top",children:[{type:"Random",title:"Stone"}]}},OverworldSegwayWatery:{width:112,height:80,contents:{mode:"Certain",direction:"right",children:[{type:"Random",title:"RampUpSmallFloor"},{type:"Random",title:"OverworldSegwayWateryBridge"},{type:"Random",title:"RampDownSmallFloor"}]}},OverworldSegwayWateryBridge:{width:48,height:80,contents:{mode:"Certain",direction:"top",children:[{type:"Random",title:"Water",sizing:{height:8}},{type:"Random",title:"Nothing",sizing:{height:24}},{type:"Random",title:"Bridge"},{type:"Random",title:"OverworldSegwayWateryBridgeTop"}]}},OverworldSegwayWateryBridgeTop:{width:48,height:40,contents:{mode:"Certain",direction:"top",children:[{type:"Random",title:"OverworldSegwayWateryBridgeTopEnemies"},{type:"Random",title:"OverworldSegwayWateryBridgeTopSolid"}]}},OverworldSegwayWateryBridgeTopEnemies:{width:48,height:16,contents:{mode:"Certain",direction:"right",snap:"bottom",spacing:{min:4,max:20,units:4},children:[{type:"Random",title:"Nothing",sizing:16},{type:"Random",title:"EnemyEasy"},{type:"Random",title:"EnemyEasy"},{type:"Random",title:"EnemyEasy"}]}},OverworldSegwayWateryBridgeTopSolid:{width:48,height:24,contents:{mode:"Certain",direction:"right",snap:"bottom",spacing:{min:0,max:24,units:8},children:[{type:"Random",title:"Nothing"},{type:"Random",title:"BlockReward"}]}},OverworldSegwaySpring:{width:112,height:80,contents:{mode:"Certain",direction:"right",children:[{type:"Random",title:"OverworldSegwaySpringLand"},{type:"Random",title:"OverworldSegwaySpringGap"}]}},OverworldSegwaySpringLand:{width:8,height:80,contents:{mode:"Certain",direction:"top",children:[{type:"Known",title:"Floor",arguments:{macro:"Floor"}},{type:"Known",title:"Springboard"}]}},OverworldSegwaySpringGap:{width:104,height:80,contents:{mode:"Certain",direction:"right",spacing:{min:48,max:80,units:8},children:[{type:"Random",title:"Nothing"},{type:"Random",title:"OverworldSegwaySpringReward"}]}},OverworldSegwaySpringReward:{width:8,height:80,contents:{mode:"Certain",direction:"top",spacing:{min:16,max:40,units:8},children:[{type:"Random",title:"Nothing"},{type:"Random",title:"Brick"},{type:"Random",title:"BlockTreasureFloating"}]}},OverworldSegwayPipeTransit:{width:112,height:80,contents:{mode:"Certain",direction:"top",children:[{type:"Known",title:"Floor",arguments:{macro:"Floor",width:112}},{type:"Random",title:"OverworldSegwayPipeTransitLand"}]}},OverworldSegwayPipeTransitLand:{width:104,height:80,contents:{mode:"Certain",direction:"right",snap:"bottom",spacing:{min:32,max:80,units:8},children:[{type:"Random",title:"Nothing"},{type:"Random",title:"PipeRandomTransit"}]}},LandObstacleGroup:{width:160,height:80,contents:{mode:"Random",direction:"right",spacing:{min:0,max:8,units:16},children:[{percent:30,type:"Random",title:"LandObstacleGroupDoubleStory"},{percent:30,type:"Random",title:"LandObstacleGroupSingleStory"},{percent:25,type:"Random",title:"LandObstacleGroupVertical"},{percent:20,type:"Random",title:"LandObstacleGroupPipes"},{percent:3,type:"Random",title:"LandObstacleGroupPitSmall"},{percent:2,type:"Random",title:"LandObstacleGroupPitLarge"}]}},LandObstacleGroupEnemies:{width:64,height:80,contents:{mode:"Random",direction:"right",spacing:4,children:[{percent:65,type:"Random",title:"EnemyEasyScattered"},{percent:2,type:"Random",title:"EnemyHard"},{percent:13,type:"Random",title:"LandObstacleGroupVertical"}]}},LandObstacleGroupEnemiesPure:{width:64,height:80,contents:{mode:"Random",direction:"right",spacing:{min:4,max:8,units:4},children:[{percent:90,type:"Random",title:"EnemyEasyScattered"},{percent:5,type:"Random",title:"EnemyHard"}]}},LandObstacleGroupSingleStory:{width:64,height:80,contents:{mode:"Multiple",snap:"bottom",children:[{type:"Random",title:"LandObstacleGroupSolidsSpotty"},{type:"Random",title:"EnemyEasy"}]}},LandObstacleGroupSingleStorySolids:{width:64,height:40,contents:{mode:"Certain",direction:"top",children:[{type:"Random",title:"Nothing",sizing:{height:32}},{type:"Random",title:"LandObstacleGroupSolidsSpotty"}]}},LandObstacleGroupDoubleStory:{width:64,height:80,contents:{mode:"Multiple",snap:"bottom",children:[{type:"Random",title:"LandObstacleGroupDoubleStorySolids"},{type:"Random",title:"LandObstacleGroupEnemiesPure"}]}},LandObstacleGroupDoubleStorySolids:{width:64,height:80,contents:{mode:"Certain",snap:"bottom",direction:"top",children:[{type:"Random",title:"LandObstacleGroupSolidsPopulated"},{type:"Random",title:"LandObstacleGroupSolidsSpotty"}]}},LandObstacleGroupSolidsPopulated:{width:64,height:32,contents:{mode:"Certain",direction:"top",children:[{type:"Random",title:"Nothing",sizing:{height:24}},{type:"Random",title:"LandObstacleGroupSolid"},{type:"Random",title:"EnemyEasyElevated"}]}},LandObstacleGroupSolids:{width:64,height:32,contents:{mode:"Random",snap:"bottom",direction:"right",children:[{percent:75,type:"Random",title:"Brick"},{percent:25,type:"Random",title:"Block"}]}},LandObstacleGroupSolidsSpotty:{width:64,height:32,contents:{mode:"Random",snap:"bottom",direction:"right",children:[{percent:30,type:"Random",title:"Brick"},{percent:20,type:"Random",title:"Block"},{percent:50,type:"Random",title:"Nothing"}]}},LandObstacleGroupPipes:{width:112,height:80,contents:{mode:"Random",snap:"bottom",direction:"right",children:[{percent:80,type:"Random",title:"PipeRandom"},{percent:10,type:"Random",title:"PipeRandomTransit"},{percent:10,type:"Random",title:"PipeFloating"}]}},LandObstacleGroupVertical:{width:32,height:80,contents:{mode:"Random",snap:"bottom",direction:"right",spacing:{min:0,max:16,units:8},children:[{percent:40,type:"Random",title:"PipeRandom"},{percent:35,type:"Random",title:"StoneTower"},{percent:25,type:"Random",title:"CannonTower"}]}},LandObstacleGroupPitSmall:{width:40,height:80,contents:{mode:"Certain",snap:"bottom",direction:"right",children:[{type:"Random",title:"StoneTower"},{type:"Random",title:"Nothing"},{type:"Random",title:"PitTreasure"},{type:"Random",title:"Nothing"},{type:"Random",title:"StoneTower"}]}},LandObstacleGroupPitLarge:{width:56,height:80,contents:{mode:"Certain",snap:"bottom",direction:"right",children:[{type:"Random",title:"StoneTower"},{type:"Random",title:"Nothing",sizing:{width:16}},{type:"Random",title:"PitTreasure"},{type:"Random",title:"EnemyEasy"},{type:"Random",title:"Nothing"},{type:"Random",title:"StoneTower"}]}},PitTreasure:{width:8,height:80,contents:{mode:"Certain",direction:"top",spacing:{min:0,max:40,units:8},children:[{type:"Random",title:"Nothing",sizing:{height:32}},{type:"Random",title:"BlockTreasure"}]}},Underworld:{width:1520,height:88,contents:{mode:"Certain",direction:"right",snap:"left",children:[{type:"Random",title:"UnderworldStart"},{type:"Random",title:"UnderworldRandomization"},{type:"Random",title:"UnderworldPreEnd"},{type:"Random",title:"Nothing"},{type:"Random",title:"UnderworldEnd"}]}},UnderworldStart:{width:128,height:80,contents:{mode:"Certain",direction:"top",snap:"left",children:[{type:"Known",title:"Floor",arguments:[{percent:25,values:{macro:"Floor",width:80}},{percent:25,values:{macro:"Floor",width:96}},{percent:25,values:{macro:"Floor",width:104}},{percent:25,values:{macro:"Floor",width:128}}]},{type:"Known",title:"Brick",arguments:{macro:"Fill",ynum:11}}]}},UnderworldRandomization:{width:1512,height:80,contents:{mode:"Random",direction:"right",children:[{percent:40,type:"Random",title:"UnderworldLandArea"},{percent:40,type:"Random",title:"UnderworldSegway"},{percent:20,type:"Random",title:"Nothing"}]}},UnderworldLandArea:{width:160,height:80,contents:{mode:"Certain",direction:"top",children:[{type:"Known",title:"Floor",arguments:{macro:"Floor",width:160}},{type:"Random",title:"UnderworldObstacleGroup"},{type:"Random",title:"Brick",sizing:{width:160}}]}},UnderworldObstacleGroup:{width:160,height:80,contents:{mode:"Random",direction:"right",spacing:[{percent:50,value:0},{percent:30,value:8},{percent:20,value:16}],children:[{percent:30,type:"Random",title:"EnemyEasyScattered"},{percent:25,type:"Random",title:"UnderworldBricksOverhangs"},{percent:20,type:"Random",title:"LandObstacleGroupSingleStory"},{percent:25,type:"Random",title:"LandObstacleGroupVertical"}]}},UnderworldBricksOverhangs:{width:160,height:64,contents:{mode:"Repeat",direction:"right",snap:"bottom",spacing:{min:0,max:24,units:8},children:[{percent:100,type:"Random",title:"UnderworldBricksOverhang"}]}},UnderworldBricksOverhang:{width:32,height:64,contents:{mode:"Random",direction:"top",snap:"left",spacing:[{percent:40,value:0},{percent:40,value:16},{percent:20,value:8}],children:[{percent:40,type:"Random",title:"UnderworldBrickCluster"},{percent:30,type:"Known",title:"Coin",arguments:{macro:"Fill",xnum:4,xwidth:8},sizing:{width:32,height:16}},{percent:30,type:"Random",title:"EnemyEasyScattered"}]}},UnderworldBrickCluster:{width:32,height:16,contents:{mode:"Repeat",direction:"top",children:[{type:"Random",title:"UnderworldBrickRow"}]}},UnderworldBrickRow:{width:32,height:8,contents:{mode:"Random",direction:"right",children:[{percent:97,type:"Known",title:"Brick"},{percent:3,type:"Known",title:"Brick",arguments:{contents:"Coin"}}]}},UnderworldSegway:{width:112,height:80,contents:{mode:"Random",direction:"right",children:[{percent:30,type:"Random",title:"UnderworldSegwaySpotty"},{percent:25,type:"Random",title:"OverworldSegwayWatery"},{percent:25,type:"Random",title:"UnderworldSegwayPlatforms"},{percent:20,type:"Random",title:"OverworldSegwayRamps"}]}},UnderworldSegwaySpotty:{width:112,height:80,contents:{mode:"Multiple",direction:"right",snap:"bottom",children:[{type:"Random",title:"UnderworldSegwaySpots"},{type:"Random",title:"UnderworldBrickCeiling",sizing:{width:112}}]}},UnderworldSegwaySpots:{width:112,height:80,contents:{mode:"Random",direction:"right",snap:"bottom",children:[{percent:50,type:"Random",title:"UnderworldSegwaySpot"},{percent:50,type:"Random",title:"Nothing"}]}},UnderworldSegwaySpot:{width:8,height:80,contents:{mode:"Certain",direction:"top",children:[{type:"Known",title:"Floor",arguments:[{percent:40,values:{macro:"Floor"}},{percent:30,values:{macro:"Floor",y:8}},{percent:30,values:{macro:"Floor",y:16}}]}]}},UnderworldSegwayPlatforms:{width:112,height:80,contents:{mode:"Certain",direction:"right",spacing:{min:0,max:8,units:8},children:[{type:"Random",title:"Nothing",sizing:{width:16}},{type:"Random",title:"PlatformGenerator"},{type:"Random",title:"Nothing"},{type:"Random",title:"PlatformGenerator"},{type:"Random",title:"Nothing"}]}},UnderworldBrickCeiling:{width:8,height:80,contents:{mode:"Certain",direction:"top",snap:"left",children:[{type:"Random",title:"Nothing",sizing:{height:88}},{type:"Random",title:"Brick"}]}},UnderworldPreEnd:{width:112,height:80,contents:{mode:"Random",direction:"right",snap:"left",spacing:32,children:[{percent:50,type:"Random",title:"OverworldSegwaySpring"},{percent:50,type:"Random",title:"PlatformGenerator"}]}},UnderworldEnd:{width:480,height:80,contents:{mode:"Certain",direction:"top",snap:"left",children:[{type:"Random",title:"UnderworldEndFloor"},{type:"Random",title:"UnderworldEndLand"}]}},UnderworldEndFloor:{width:480,height:8,contents:{mode:"Certain",children:[{type:"Random",title:"Floor"}]}},UnderworldEndLand:{width:488,height:72,contents:{mode:"Certain",direction:"right",snap:"bottom",children:[{type:"Random",title:"LakituStop",sizing:{width:0}},{type:"Random",title:"UnderworldEndPipeArea"},{type:"Random",title:"Nothing",sizing:{width:64}},{type:"Random",title:"RampUpLarge"},{type:"Random",title:"Nothing",sizing:{width:64}},{type:"Random",title:"UnderworldEndOutsideCastle"},{type:"Known",title:"ScrollBlocker",sizing:{width:0,height:0}}]}},UnderworldEndPipeArea:{width:144,height:88,contents:{mode:"Certain",direction:"right",snap:"bottom",children:[{type:"Random",title:"UnderworldEndPipeFront"},{type:"Random",title:"UnderworldEndPipeTransport"},{type:"Known",title:"Brick",arguments:{macro:"Fill",xnum:7,ynum:11,yheight:-8}}]}},UnderworldEndPipeFront:{width:80,height:80,contents:{mode:"Certain",direction:"top",snap:"left",children:[{type:"Known",title:"Brick",arguments:{macro:"Fill",xnum:10,ynum:3}},{type:"Random",title:"Nothing",sizing:{height:40}},{type:"Known",title:"Block",arguments:{hidden:!0}},{type:"Random",title:"Nothing",sizing:{height:24}},{type:"Known",title:"Brick",arguments:{macro:"Fill",xnum:10,ynum:1}}]}},UnderworldEndPipeTransport:{width:32,height:80,contents:{mode:"Certain",direction:"top",snap:"right",children:[{type:"Known",title:"Brick",arguments:{macro:"Fill",xnum:4,ynum:3,yheight:-8},sizing:{height:24}},{type:"Known",title:"PipeCorner",arguments:{macro:"PipeCorner",height:64,transport:"Overworld",scrollEnabler:!0,scrollBlocker:!0}},{type:"Random",title:"Nothing",sizing:{height:40}},{type:"Known",title:"Brick",arguments:{macro:"Fill",xnum:2}}]}},Sky:{width:1400,height:80,contents:{mode:"Certain",direction:"right",snap:"left",children:[{type:"Random",title:"SkyStart"},{type:"Random",title:"Nothing"},{type:"Random",title:"SkyBeforeMain"},{type:"Random",title:"SkyMain"},{type:"Random",title:"SkyEnd"}]}},SkyStart:{width:32,height:80,contents:{mode:"Certain",direction:"top",snap:"left",children:[{type:"Known",title:"Stone",arguments:{width:32},sizing:{width:32}}]}},SkyBeforeMain:{width:80,height:80,contents:{mode:"Certain",direction:"top",snap:"left",children:[{type:"Known",title:"Stone",arguments:{width:80},sizing:{width:80}}]}},SkyMain:{width:560,height:80,contents:{mode:"Multiple",children:[{type:"Random",title:"SkyMainLand"},{type:"Random",title:"SkyMainTransport"},{type:"Random",title:"SkyMainAir"}]}},SkyMainLand:{width:560,height:80,contents:{mode:"Certain",direction:"top",snap:"left",children:[{type:"Known",title:"Stone",arguments:{width:560}}]}},SkyMainTransport:{width:140,height:40,contents:{mode:"Certain",direction:"top",snap:"left",children:[{type:"Random",title:"Nothing",sizing:{height:32}},{type:"Known",title:"Platform",arguments:{width:24,transport:"true"}}]}},SkyMainAir:{width:560,height:80,contents:{mode:"Random",direction:"right",snap:"bottom",spacing:8,children:[{percent:20,type:"Random",title:"SkyCoinsShort"},{percent:20,type:"Random",title:"SkyCoinsMedium"},{percent:20,type:"Random",title:"SkyCoinsLong"},{percent:40,type:"Random",title:"SkyCoinsStone"}]}},SkyCoinsShort:{width:24,height:80,contents:{mode:"Certain",direction:"top",snap:"left",spacing:{min:0,max:16,units:8},children:[{type:"Random",title:"Nothing",sizing:{height:56}},{type:"Random",title:"SkyCoinsRow",stretch:{width:!0}}]}},SkyCoinsMedium:{width:56,height:80,contents:{mode:"Certain",direction:"top",snap:"left",spacing:{min:0,max:16,units:8},children:[{type:"Random",title:"Nothing",sizing:{height:56}},{type:"Random",title:"SkyCoinsRow",stretch:{width:!0}}]}},SkyCoinsLong:{width:128,height:80,contents:{mode:"Certain",direction:"top",snap:"left",spacing:{min:0,max:16,units:8},children:[{type:"Random",title:"Nothing",sizing:{height:56}},{type:"Random",title:"SkyCoinsRow",stretch:{width:!0}}]}},SkyCoinsRow:{width:5,height:7,contents:{mode:"Repeat",direction:"right",snap:"top",spacing:3,children:[{type:"Random",title:"Coin"}]}},SkyCoinsStone:{width:24,height:80,contents:{mode:"Certain",direction:"right",snap:"bottom",children:[{type:"Random",title:"Nothing"},{type:"Random",title:"SkyCoinsStoneVertical"}]}},SkyCoinsStoneVertical:{width:8,height:80,contents:{mode:"Certain",direction:"top",spacing:{min:0,max:8,units:8},children:[{type:"Random",title:"Nothing",sizing:{height:64}},{type:"Known",title:"Stone",arguments:[{percent:33,values:{}},{percent:34,values:{width:16}},{percent:33,values:{height:16}}]}]}},SkyEnd:{width:320,height:80,contents:{mode:"Certain",direction:"top",snap:"right",children:[{type:"Random",title:"Nothing"},{type:"Random",title:"SkyEndCoins"}]}},SkyEndCoins:{width:24,height:7,contents:{mode:"Certain",direction:"right",snap:"bottom",spacing:3,children:[{type:"Random",title:"Nothing",sizing:{width:64}},{type:"Known",title:"Coin"},{type:"Known",title:"Coin"},{type:"Known",title:"Coin"}]}},Castle:{height:80,width:2e3,contents:{mode:"Certain",direction:"right",children:[{type:"Random",title:"CastleStart"},{type:"Random",title:"CastleBody"},{type:"Random",title:"CastleEnd"}]}},CastleStart:{width:112,height:80,contents:{mode:"Certain",direction:"top",children:[{type:"Random",title:"StartInsideCastle"},{type:"Random",title:"Nothing",sizing:{height:80}},{type:"Known",title:"Stone",arguments:{height:24,width:112}}]}},CastleBody:{width:1632,height:80,contents:{mode:"Repeat",direction:"right",children:[{type:"Random",title:"CastleSegway"},{type:"Random",title:"CastleLandArea"},{type:"Random",title:"CastleSegway"},{type:"Random",title:"CastleLandAreaLarge"}]}},CastleSegway:{width:168,height:80,contents:{mode:"Random",direction:"right",snap:"bottom",children:[{percent:50,type:"Random",title:"CastleSegwayFloatingGap"},{percent:50,type:"Random",title:"CastleSegwayPlatformGap"}]}},CastleSegwayFloatingGap:{width:168,height:80,contents:{mode:"Repeat",direction:"right",snap:"bottom",children:[{type:"Random",title:"CastleSegwayGapSpace"},{type:"Random",title:"CastleSegwayGapChunk"}]}},CastleSegwayGapSpace:{width:24,height:80,contents:{mode:"Multiple",children:[{type:"Random",title:"CastleSegwayGapSpaceWater"},{type:"Random",title:"CastleSegwayGapSpaceEnemyArea"}]}},CastleSegwayGapSpaceWater:{width:24,height:80,contents:{mode:"Certain",direction:"right",snap:"bottom",children:[{type:"Random",title:"Water",sizing:{width:24}}]}},CastleSegwayGapSpaceEnemyArea:{width:24,height:40,contents:{mode:"Repeat",direction:"right",snap:"bottom",spacing:[{percent:60,value:24},{percent:15,value:0},{percent:15,value:8},{percent:15,value:16}],children:[{type:"Random",title:"Nothing",sizing:{width:0}},{type:"Random",title:"Podoboo"}]}},CastleSegwayGapChunk:{width:24,height:80,contents:{mode:"Certain",direction:"top",spacing:{min:16,max:40,units:8},children:[{type:"Random",title:"Water",sizing:{width:24}},{type:"Random",title:"CastleSegwayGapChunkSolids"},{type:"Random",title:"CastleSegwayGapChunkReward"}]}},CastleSegwayGapChunkSolids:{width:24,height:8,contents:{mode:"Repeat",direction:"right",children:[{percent:80,type:"Random",title:"Stone"},{percent:20,type:"Random",title:"CastleBlockActive"}]}},CastleSegwayGapChunkReward:{width:16,height:8,contents:{mode:"Certain",direction:"right",children:[{type:"Random",title:"Nothing"},{type:"Random",title:"CastleSegwayGapChunkBlock"}]}},CastleSegwayGapChunkBlock:{width:8,height:8,contents:{mode:"Random",direction:"right",children:[{percent:50,type:"Random",title:"Nothing"},{percent:50,type:"Known",title:"Block",arguments:{contents:"Mushroom"}}]}},CastleSegwayPlatformGap:{width:168,height:80,contents:{mode:"Certain",direction:"right",children:[{type:"Random",title:"CastleSegwayPlatformGapBorder"},{type:"Random",title:"CastleSegwayPlatformGapPlatforms"},{type:"Random",title:"CastleSegwayPlatformGapBorder"}]}},CastleSegwayPlatformGapBorder:{width:24,height:80,contents:{mode:"Certain",direction:"top",spacing:{min:0,max:24,units:8},children:[{type:"Known",title:"Floor",arguments:{macro:"Floor"},sizing:{height:32},stretch:{width:!0}},{type:"Random",title:"CastleSegwayPlatformGapBorderCastleBlock"}]}},CastleSegwayPlatformGapBorderCastleBlock:{width:24,height:8,contents:{mode:"Certain",direction:"right",spacing:{min:0,max:16,units:8},children:[{type:"Random",title:"Nothing",sizing:{width:0}},{type:"Random",title:"CastleBlockActive"}]}},CastleSegwayPlatformGapPlatforms:{width:120,height:80,contents:{mode:"Repeat",direction:"right",spacing:{min:0,max:16,units:16},children:[{type:"Random",title:"Nothing"},{type:"Random",title:"PlatformGenerator"}]}},CastleLandArea:{width:160,height:80,contents:{mode:"Random",direction:"right",children:[{percent:100,type:"Random",title:"CastleLandTunnel"}]}},CastleLandTunnel:{width:160,height:80,contents:{mode:"Certain",direction:"top",children:[{type:"Known",title:"Floor",arguments:{macro:"Floor",width:160},sizing:{height:32}},{type:"Random",title:"CastleLandTunnelEnemies"},{type:"Random",title:"CastleLandTunnelTop"}]}},CastleLandTunnelEnemies:{width:160,height:16,contents:{mode:"Random",direction:"right",snap:"bottom",spacing:[{percent:10,value:4},{percent:15,value:8},{percent:85,value:{min:32,max:64,units:8}}],children:[{percent:70,type:"Random",title:"Goomba"},{percent:15,type:"Random",title:"Beetle"},{percent:15,type:"Random",title:"Koopa"}]}},CastleLandTunnelTop:{width:160,height:32,contents:{mode:"Certain",direction:"bottom",children:[{type:"Known",title:"Stone",stretch:{width:!0},arguments:[{percent:33,values:{height:24}},{percent:34,values:{height:32}},{percent:33,values:{height:40}}]}]}},CastleLandAreaLarge:{width:320,height:80,contents:{mode:"Repeat",direction:"right",children:[{type:"Random",title:"CastleLandAreaChunk"},{type:"Random",title:"CastleLandAreaBetween"}]}},CastleLandAreaChunk:{width:152,height:80,contents:{mode:"Repeat",direction:"right",children:[{percent:100,type:"Random",title:"CastleLandAreaCavern"}]}},CastleLandAreaCavern:{width:152,height:80,contents:{mode:"Certain",direction:"top",children:[{type:"Known",title:"Floor",arguments:{macro:"Floor",width:152}},{type:"Random",title:"CastleLandAreaCavernInside"},{type:"Known",title:"Stone",arguments:{width:152}}]}},CastleLandAreaCavernInside:{width:152,height:80,contents:{mode:"Random",direction:"right",snap:"bottom",spacing:{min:8,max:40,units:8},children:[{percent:40,type:"Random",title:"CastleLandAreaCavernInsideTites"},{percent:35,type:"Random",title:"CastleLandAreaCavernInsideBonus"},{percent:25,type:"Random",title:"Nothing",sizing:{width:24}}]}},CastleLandAreaCavernInsideTites:{width:24,height:80,contents:{mode:"Certain",direction:"top",snap:"bottom",children:[{type:"Known",title:"Stone",arguments:{width:24}},{type:"Random",title:"CastleLandAreaCavernInsideTitesCastleBlock"},{type:"Random",title:"Nothing",sizing:{height:40}},{type:"Random",title:"CastleLandAreaCavernInsideTitesCastleBlock"},{type:"Known",title:"Stone",sizing:{width:24,height:16},arguments:{width:24,height:16}}]}},CastleLandAreaCavernInsideTitesCastleBlock:{width:24,height:8,contents:{mode:"Certain",direction:"right",children:[{type:"Random",title:"Nothing"},{type:"Random",title:"CastleBlockActive"}]}},CastleLandAreaCavernInsideBonus:{width:24,height:64,contents:{mode:"Certain",direction:"top",spacing:{min:8,max:24,units:8},children:[{type:"Random",title:"Nothing"},{type:"Random",title:"CastleLandAreaCavernInsideBonusBlocks"},{type:"Random",title:"CastleLandAreaCavernInsideBonusBlocks"}]}},CastleLandAreaCavernInsideBonusBlocks:{width:24,height:8,contents:{mode:"Certain",direction:"right",children:[{type:"Random",title:"Nothing"},{type:"Known",title:"Block",arguments:[{percent:45,values:{hidden:!0}},{percent:35,values:{}},{percent:15,values:{contents:"Mushroom",hidden:!0}},{percent:5,values:{contents:"Mushroom"}}]}]}},CastleLandAreaBetween:{width:16,height:80,contents:{mode:"Certain",direction:"top",children:[{type:"Known",title:"Water",arguments:{macro:"Water",width:16}},{type:"Random",title:"Nothing",sizing:{height:83}},{type:"Known",title:"Stone",arguments:{width:16}}]}},CastleEnd:{width:256,height:8,contents:{mode:"Certain",direction:"right",children:[{type:"Random",title:"CastlePreEnd"},{type:"Random",title:"EndInsideCastle"},{type:"Random",title:"Overworld"}]}},CastlePreEnd:{width:80,height:80,contents:{mode:"Certain",direction:"top",children:[{type:"Known",title:"Floor",arguments:{macro:"Floor",width:80}},{type:"Random",title:"CastlePreEndBlocks"},{type:"Random",title:"Nothing",sizing:{height:56}},{type:"Known",title:"Stone",arguments:[{percent:50,values:{width:80,height:24}},{percent:50,values:{width:80,height:32}}]}]}},CastlePreEndBlocks:{width:80,height:24,contents:{mode:"Repeat",direction:"right",snap:"top",spacing:16,children:[{type:"Known",title:"Stone",sizing:{width:16,height:24},arguments:{width:16,height:24}}]}},EnemyEasy:{width:8,height:12,contents:{mode:"Random",direction:"right",spacing:[{percent:75,value:4},{percent:25,value:8}],children:[{percent:45,type:"Random",title:"Goomba"},{percent:35,type:"Random",title:"Koopa"},{percent:20,type:"Random",title:"Beetle"}]}},EnemyEasyScattered:{width:8,height:12,contents:{mode:"Random",direction:"right",spacing:[{percent:45,value:8},{percent:25,value:4},{percent:15,value:12},{percent:15,value:16}],children:[{percent:40,type:"Random",title:"Goomba"},{percent:30,type:"Random",title:"Koopa"},{percent:15,type:"Random",title:"Beetle"},{percent:15,type:"Random",title:"Nothing"}]}},EnemyEasyElevated:{width:64,height:12,contents:{mode:"Random",direction:"right",snap:"bottom",spacing:4,children:[{percent:25,type:"Random",title:"Goomba"},{percent:15,type:"Random",title:"Koopa"},{percent:10,type:"Random",title:"Beetle"},{percent:50,type:"Random",title:"Nothing"}]}},EnemyHard:{width:8,height:12,contents:{mode:"Random",direction:"right",children:[{percent:40,type:"Random",title:"HammerBro"},{percent:40,type:"Random",title:"Blooper"},{percent:20,type:"Random",title:"Lakitu"}]}},SolidSmall:{width:8,height:12,contents:{mode:"Random",direction:"right",children:[{percent:80,type:"Random",title:"Brick"},{percent:20,type:"Random",title:"Block"}]}},SolidSmallSpotty:{width:8,height:12,contents:{mode:"Random",direction:"right",children:[{percent:50,type:"Random",title:"Brick"},{percent:30,type:"Random",title:"Nothing"},{percent:20,type:"Random",title:"Block"}]}},LandObstacleGroupSolid:{width:8,height:8,contents:{mode:"Random",direction:"right",children:[{percent:70,type:"Random",title:"Brick"},{percent:30,type:"Random",title:"Block"}]}},Cannon:{width:8,height:32,contents:{mode:"Random",direction:"top",snap:"bottom",spacing:[{percent:50,
value:0},{percent:50,value:24}],children:[{percent:50,type:"Random",title:"CannonMedium"},{percent:10,type:"Random",title:"CannonSmall"},{percent:40,type:"Random",title:"CannonLarge"}]}},CannonStack:{width:8,height:32,contents:{mode:"Certain",direction:"top",snap:"bottom",children:[{type:"Random",title:"Cannon"},{type:"Random",title:"Cannon"}]}},RampUpSmall:{width:32,height:32,contents:{mode:"Certain",direction:"right",snap:"bottom",children:[{type:"Random",title:"Stone"},{type:"Known",title:"Stone",sizing:{height:16},arguments:{height:16}},{type:"Known",title:"Stone",sizing:{height:24},arguments:{height:24}},{type:"Known",title:"Stone",sizing:{height:32},arguments:{height:32}}]}},RampUpSmallFloor:{width:32,height:80,contents:{mode:"Certain",direction:"top",children:[{type:"Known",title:"Floor",arguments:{macro:"Floor",width:32}},{type:"Random",title:"RampUpSmall"}]}},RampUpLarge:{width:64,height:64,contents:{mode:"Certain",direction:"right",snap:"bottom",children:[{type:"Random",title:"Stone"},{type:"Known",title:"Stone",sizing:{height:16},arguments:{height:16}},{type:"Known",title:"Stone",sizing:{height:24},arguments:{height:24}},{type:"Known",title:"Stone",sizing:{height:32},arguments:{height:32}},{type:"Known",title:"Stone",sizing:{height:40},arguments:{height:40}},{type:"Known",title:"Stone",sizing:{height:48},arguments:{height:48}},{type:"Known",title:"Stone",sizing:{height:56},arguments:{height:56}},{type:"Known",title:"Stone",sizing:{height:64},arguments:{height:64}}]}},RampUpLargeFloor:{width:64,height:80,contents:{mode:"Certain",direction:"top",children:[{type:"Known",title:"Floor",arguments:{macro:"Floor",width:64}},{type:"Random",title:"RampUpLarge"}]}},RampDownSmall:{width:32,height:32,contents:{mode:"Certain",direction:"right",snap:"bottom",children:[{type:"Known",title:"Stone",sizing:{height:32},arguments:{height:32}},{type:"Known",title:"Stone",sizing:{height:24},arguments:{height:24}},{type:"Known",title:"Stone",sizing:{height:16},arguments:{height:16}},{type:"Known",title:"Stone"}]}},RampDownSmallFloor:{width:32,height:80,contents:{mode:"Certain",direction:"top",children:[{type:"Known",title:"Floor",arguments:{macro:"Floor",width:32}},{type:"Random",title:"RampDownSmall"}]}},RampDownLarge:{width:64,height:64,contents:{mode:"Certain",direction:"right",snap:"bottom",children:[{type:"Known",title:"Stone",sizing:{height:64},arguments:{height:64}},{type:"Known",title:"Stone",sizing:{height:56},arguments:{height:56}},{type:"Known",title:"Stone",sizing:{height:48},arguments:{height:48}},{type:"Known",title:"Stone",sizing:{height:40},arguments:{height:40}},{type:"Known",title:"Stone",sizing:{height:32},arguments:{height:32}},{type:"Known",title:"Stone",sizing:{height:24},arguments:{height:24}},{type:"Known",title:"Stone",sizing:{height:16},arguments:{height:16}},{type:"Known",title:"Stone"}]}},RampDownLargeFloor:{width:64,height:80,contents:{mode:"Certain",direction:"top",children:[{type:"Known",title:"Floor",arguments:{macro:"Floor",width:64}},{type:"Random",title:"RampDownLarge"}]}},StoneTower:{width:8,height:32,contents:{mode:"Random",direction:"right",snap:"bottom",children:[{percent:50,type:"Known",title:"Stone",snap:"bottom",sizing:{height:24},arguments:{height:24}},{percent:50,type:"Known",title:"Stone",stretch:{height:!0}}]}},StoneTowerLarge:{width:8,height:64,contents:{mode:"Certain",direction:"right",snap:"top",children:[{type:"Known",title:"Stone",arguments:{height:64},sizing:{height:64}}]}},CannonTower:{width:24,height:32,contents:{mode:"Certain",direction:"right",snap:"bottom",children:[{type:"Random",title:"Nothing"},{type:"Random",title:"Cannon"},{type:"Random",title:"Nothing"}]}},OverworldScenery:{width:160,height:80,contents:{mode:"Certain",direction:"top",snap:"bottom",children:[{type:"Random",title:"Nothing",sizing:{height:8}},{type:"Random",title:"OverworldLandScenery"},{type:"Random",title:"Nothing",sizing:{height:32}}]}},OverworldLandScenery:{height:40,width:160,contents:{mode:"Random",direction:"right",snap:"bottom",spacing:{min:-4,max:40,units:4},children:[{percent:25,type:"Random",title:"HillSmall"},{percent:25,type:"Random",title:"HillLarge"},{percent:12,type:"Random",title:"Bush1"},{percent:11,type:"Random",title:"Bush2"},{percent:12,type:"Random",title:"Bush3"},{percent:10,type:"Random",title:"Fence"},{percent:5,type:"Random",title:"PlantSmall"},{percent:5,type:"Random",title:"PlantLarge"}]}},OverworldClouds:{height:56,width:2528,contents:{mode:"Random",direction:"right",snap:"top",spacing:{min:16,max:80,units:8},children:[{percent:40,type:"Random",title:"CloudClump1"},{percent:35,type:"Random",title:"CloudClump2"},{percent:25,type:"Random",title:"CloudClump3"}]}},CloudClump1:{height:56,width:16,contents:{mode:"Certain",direction:"top",spacing:{min:16,max:40,units:8},children:[{type:"Random",title:"Nothing"},{type:"Random",title:"Cloud1"}]}},CloudClump2:{height:56,width:24,contents:{mode:"Certain",direction:"top",spacing:{min:16,max:40,units:8},children:[{type:"Random",title:"Nothing"},{type:"Random",title:"Cloud2"}]}},CloudClump3:{height:56,width:32,contents:{mode:"Certain",direction:"top",spacing:{min:16,max:40,units:8},children:[{type:"Random",title:"Nothing"},{type:"Random",title:"Cloud3"}]}},Cloud:{width:32,height:12,contents:{mode:"Random",direction:"right",limit:1,children:[{percent:40,type:"Random",title:"Cloud1"},{percent:35,type:"Random",title:"Cloud2"},{percent:25,type:"Random",title:"Cloud3"}]}},OverworldSegwaySpotScenery:{width:8,height:23,contents:{mode:"Random",direction:"top",snap:"bottom",children:[{percent:70,type:"Random",title:"Nothing",stretch:{height:!0}},{percent:15,type:"Random",title:"PlantSmall"},{percent:15,type:"Random",title:"PlantLarge"}]}},Goomba:{width:8,height:8,contents:{mode:"Certain",direction:"right",snap:"bottom",children:[{type:"Known",title:"Goomba"}]}},Koopa:{width:8,height:12,contents:{mode:"Random",direction:"right",snap:"bottom",children:[{percent:20,type:"Known",title:"Koopa"},{percent:40,type:"Known",title:"Koopa",arguments:{smart:!0}},{percent:15,type:"Known",title:"Koopa",arguments:{jumping:!0}},{percent:25,type:"Known",title:"Koopa",arguments:{smart:!0,jumping:!0}}]}},KoopaJumping:{width:8,height:12,contents:{mode:"Random",direction:"top",snap:"left",children:[{percent:35,type:"Known",title:"Koopa",arguments:{jumping:!0}},{percent:65,type:"Known",title:"Koopa",arguments:{smart:!0,jumping:!0}}]}},Beetle:{width:8,height:8.5,contents:{mode:"Certain",direction:"right",snap:"bottom",children:[{type:"Known",title:"Beetle"}]}},HammerBro:{width:8,height:12,contents:{mode:"Certain",direction:"right",snap:"bottom",children:[{type:"Known",title:"HammerBro"}]}},Blooper:{width:8,height:40,contents:{mode:"Certain",direction:"right",snap:"top",children:[{type:"Known",title:"Blooper"}]}},Lakitu:{width:8,height:80,contents:{mode:"Certain",direction:"top",snap:"right",spacing:4,children:[{type:"Random",title:"Nothing",sizing:{height:0}},{type:"Known",title:"Lakitu"}]}},Podoboo:{width:8,height:8,contents:{mode:"Certain",direction:"top",spacing:-40,snap:"bottom",children:[{type:"Random",title:"Nothing"},{type:"Known",title:"Podoboo"}]}},Brick:{width:8,height:8,contents:{mode:"Random",direction:"right",snap:"top",children:[{percent:85,type:"Known",title:"Brick"},{percent:10,type:"Known",title:"Brick",arguments:{contents:"Coin"}},{percent:5,type:"Known",title:"Brick",arguments:{contents:"Star"}}]}},Block:{width:8,height:8,contents:{mode:"Certain",direction:"right",snap:"top",children:[{type:"Known",title:"Block",arguments:[{percent:90,values:{}},{percent:9,values:{contents:"Mushroom"}},{percent:1,values:{contents:"Mushroom1Up",hidden:!0}}]}]}},BlockTreasure:{width:8,height:8,contents:{mode:"Certain",direction:"right",snap:"top",children:[{type:"Known",title:"Block",arguments:[{percent:35,values:{contents:"Mushroom"}},{percent:35,values:{contents:"Star"}},{percent:30,values:{contents:"Mushroom1Up"}}]}]}},BlockTreasureFloating:{width:8,height:8,contents:{mode:"Certain",direction:"right",snap:"top",children:[{type:"Known",title:"Block",arguments:[{percent:20,values:{contents:"Mushroom"}},{percent:20,values:{hidden:!0,contents:"Mushroom"}},{percent:15,values:{contents:"Star"}},{percent:15,values:{hidden:!0,contents:"Star"}},{percent:20,values:{contents:"Mushroom1Up"}},{percent:20,values:{hidden:!0,contents:"Mushroom1Up"}}]}]}},BlockReward:{width:8,height:8,contents:{mode:"Certain",direction:"right",snap:"top",children:[{type:"Known",title:"Block",arguments:[{percent:30,values:{hidden:!0}},{percent:30,values:{hidden:!0,contents:"Mushroom"}},{percent:30,values:{hidden:!0,contents:"Star"}},{percent:30,values:{hidden:!0,contents:"Mushroom1Up"}}]}]}},Bridge:{width:8,height:8,contents:{mode:"Certain",snap:"bottom",direction:"right",children:[{type:"Known",title:"Bridge",stretch:{width:!0},arguments:{macro:"Bridge"}}]}},Tree:{width:24,height:8,contents:{mode:"Certain",direction:"top",children:[{type:"Known",title:"Tree",stretch:{width:!0},arguments:{macro:"Tree"}}]}},TreeCoin:{width:8,height:12,contents:{mode:"Certain",direction:"top",snap:"bottom",children:[{type:"Random",title:"Nothing",sizing:{height:4}},{type:"Random",title:"Coin",sizing:{height:4}}]}},TreeCoins:{width:8,height:12,contents:{mode:"Random",direction:"right",stretch:{width:!0},spacing:4,children:[{percent:55,type:"Random",title:"TreeCoin"},{percent:30,type:"Random",title:"Nothing"},{percent:15,type:"Random",title:"EnemyEasy"}]}},TreeLargeCoins:{width:64,height:12,contents:{mode:"Certain",direction:"right",children:[{type:"Random",title:"Nothing"},{type:"Random",title:"TreeCoins",sizing:{width:56}}]}},TreeFancy:{width:24,height:8,contents:{mode:"Certain",direction:"top",children:[{type:"Known",title:"Tree",stretch:{width:!0},arguments:{macro:"Tree"}},{type:"Random",title:"TreeCoins",stretch:{width:!0}}]}},Coin:{width:5,height:7,contents:{mode:"Certain",direction:"right",children:[{type:"Known",title:"Coin"}]}},PipeRandom:{width:16,height:40,contents:{mode:"Certain",direction:"top",snap:"bottom",children:[{type:"Random",title:"Nothing",sizing:{height:0}},{type:"Known",title:"Pipe",sizing:{height:0},arguments:[{percent:25,values:{macro:"Pipe",piranha:!0,height:16}},{percent:5,values:{macro:"Pipe",height:16}},{percent:25,values:{macro:"Pipe",piranha:!0,height:24}},{percent:5,values:{macro:"Pipe",height:24}},{percent:20,values:{macro:"Pipe",piranha:!0,height:32}},{percent:5,values:{macro:"Pipe",height:32}},{percent:5,values:{macro:"Pipe",piranha:!0,transport:"Underworld",height:32}},{percent:5,values:{macro:"Pipe",transport:"Underworld",height:32}},{percent:3,values:{macro:"Pipe",piranha:!0,transport:"Underwater",height:32}},{percent:2,values:{macro:"Pipe",transport:"Underwater",height:32}}]}]}},PipeRandomTransit:{width:16,height:40,contents:{mode:"Certain",direction:"top",snap:"bottom",children:[{type:"Known",title:"Pipe",sizing:{height:0},arguments:[{percent:50,values:{macro:"Pipe",piranha:!0,height:24,transport:"Underworld"}},{percent:50,values:{macro:"Pipe",piranha:!0,height:32,transport:"Underworld"}}]}]}},PipeFloating:{width:64,height:80,contents:{mode:"Certain",direction:"top",snap:"bottom",spacing:{min:8,max:32,units:8},children:[{type:"Random",title:"Nothing"},{type:"Random",title:"PipeFloatingContents"}]}},PipeFloatingContents:{width:64,height:8,contents:{mode:"Certain",direction:"right",snap:"bottom",children:[{type:"Random",title:"Nothing"},{type:"Random",title:"PipeFloatingSolid"},{type:"Random",title:"PipeFloatingCenter"},{type:"Random",title:"PipeFloatingSolid"}]}},PipeFloatingSolid:{width:8,height:8,contents:{mode:"Random",direction:"right",children:[{percent:65,type:"Random",title:"Brick"},{percent:35,type:"Random",title:"Block"}]}},PipeFloatingCenter:{width:16,height:8,contents:{mode:"Certain",direction:"top",children:[{type:"Known",title:"Stone",arguments:{width:16}},{type:"Random",title:"PipeRandomTransit"}]}},Pipe:{width:16,height:32,contents:{mode:"Certain",snap:"bottom",children:[{type:"Known",title:"Pipe"}]}},PipeHorizontal:{width:16,height:16,contents:{mode:"Certain",snap:"bottom",children:[{type:"Known",title:"PipeHorizontal"}]}},PipeVertical:{width:16,height:16,contents:{mode:"Certain",snap:"bottom",children:[{type:"Known",title:"PipeVertical"}]}},PipeCorner:{width:32,height:16,contents:{mode:"Certain",snap:"bottom",children:[{type:"Known",title:"PipeCorner",arguments:{macro:"PipeCorner"}}]}},CannonSmall:{width:8,height:8,contents:{mode:"Certain",snap:"bottom",children:[{type:"Final",source:"CannonSmall",title:"Cannon"}]}},CannonMedium:{width:8,height:16,contents:{mode:"Certain",children:[{type:"Final",source:"CannonMedium",title:"Cannon",arguments:{height:16}}]}},CannonLarge:{width:8,height:24,contents:{mode:"Certain",children:[{type:"Final",source:"CannonLarge",title:"Cannon",arguments:{height:24}}]}},Floor:{width:8,height:8,contents:{mode:"Certain",direction:"right",snap:"top",children:[{type:"Known",title:"Floor",stretch:{width:!0},arguments:{height:"Infinity"}}]}},Springboard:{width:8,height:14.5,contents:{mode:"Certain",direction:"right",snap:"bottom",children:[{type:"Known",title:"Springboard"}]}},Stone:{width:8,height:8,contents:{mode:"Certain",direction:"right",snap:"bottom",children:[{type:"Known",title:"Stone"}]}},CastleBlock:{width:8,height:8,contents:{mode:"Certain",children:[{type:"Known",title:"CastleBlock"}]}},CastleBlockActive:{width:8,height:8,contents:{mode:"Certain",direction:"right",children:[{type:"Known",title:"CastleBlock",arguments:[{percent:30,values:{}},{percent:30,values:{fireballs:6}},{percent:30,values:{fireballs:6,direction:1}},{percent:5,values:{fireballs:12}},{percent:5,values:{fireballs:12,direction:1}}]}]}},Bush1:{width:16,height:8,contents:{mode:"Certain",snap:"bottom",children:[{type:"Known",title:"Bush1"}]}},Bush2:{width:24,height:8,contents:{mode:"Certain",snap:"bottom",children:[{type:"Known",title:"Bush2"}]}},Bush3:{width:32,height:8,contents:{mode:"Certain",snap:"bottom",children:[{type:"Known",title:"Bush3"}]}},Cloud1:{width:16,height:12,contents:{mode:"Certain",children:[{type:"Known",title:"Cloud1"}]}},Cloud2:{width:24,height:12,contents:{mode:"Certain",children:[{type:"Known",title:"Cloud2"}]}},Cloud3:{width:32,height:12,contents:{mode:"Certain",children:[{type:"Known",title:"Cloud3"}]}},Fence:{width:8,height:8,contents:{mode:"Certain",snap:"bottom",children:[{type:"Known",title:"Fence"}]}},HillSmall:{width:24,height:9.5,contents:{mode:"Certain",snap:"bottom",children:[{type:"Known",title:"HillSmall"}]}},HillLarge:{width:40,height:17.5,contents:{mode:"Certain",snap:"bottom",children:[{type:"Known",title:"HillLarge"}]}},PlantSmall:{width:7,height:15,contents:{mode:"Certain",snap:"bottom",children:[{type:"Known",title:"PlantSmall"}]}},PlantLarge:{width:8,height:23,contents:{mode:"Certain",snap:"bottom",children:[{type:"Known",title:"PlantLarge"}]}},Water:{width:4,height:5,contents:{mode:"Certain",snap:"bottom",direction:"right",children:[{type:"Known",title:"Water",stretch:{width:!0},arguments:{macro:"Water"}}]}},LakituStop:{width:8,height:8,contents:{mode:"Certain",children:[{type:"Known",title:"LakituStop",arguments:{macro:"LakituStop"}}]}},Platform:{width:16,height:4,contents:{mode:"Certain",children:[{type:"Known",title:"Platform",stretch:{width:!0}}]}},PlatformGenerator:{width:24,height:80,contents:{mode:"Certain",children:[{type:"Known",title:"PlatformGenerator",arguments:[{percent:25,values:{macro:"PlatformGenerator"}},{percent:25,values:{macro:"PlatformGenerator",width:24}},{percent:25,values:{macro:"PlatformGenerator",direction:-1,width:24}},{percent:25,values:{macro:"PlatformGenerator",direction:-1}}]}]}},OverworldEnd:{width:288,height:80,contents:{mode:"Certain",direction:"top",snap:"left",children:[{type:"Random",title:"OverworldEndFloor"},{type:"Random",title:"OverworldEndLand"}]}},OverworldEndFloor:{width:288,height:8,contents:{mode:"Certain",children:[{type:"Random",title:"Floor"}]}},OverworldEndLand:{width:288,height:64,contents:{mode:"Certain",direction:"right",snap:"bottom",children:[{type:"Random",title:"LakituStop"},{type:"Random",title:"RampUpLarge"},{type:"Random",title:"StoneTowerLarge"},{type:"Random",title:"Nothing",sizing:{width:64}},{type:"Random",title:"OverworldEndOutsideCastle"},{type:"Random",title:"ScrollBlocker"}]}},OverworldEndOutsideCastle:{width:144,height:80,contents:{mode:"Multiple",direction:"right",spacing:-112,children:[{type:"Random",title:"EndOutsideCastle"},{type:"Random",title:"OverworldEndOutsideCastleScenery"}]}},OverworldEndOutsideCastleScenery:{width:144,height:80,contents:{mode:"Multiple",direction:"top",spacing:-8,children:[{type:"Random",title:"Nothing",sizing:{height:0}},{type:"Random",title:"OverworldScenery"}]}},EndOutsideCastle:{width:144,height:80,contents:{mode:"Certain",direction:"top",children:[{type:"Known",title:"EndOutsideCastle",arguments:{macro:"EndOutsideCastle",large:!0,transport:{map:"Random",location:"Castle"}},sizing:{height:0}}]}},UnderworldEndOutsideCastle:{width:144,Height:88,contents:{mode:"Certain",direction:"top",children:[{type:"Random",title:"EndOutsideCastle"}]}},StartInsideCastle:{width:112,height:8,contents:{mode:"Certain",direction:"top",snap:"bottom",children:[{type:"Known",title:"StartInsideCastle",arguments:{macro:"StartInsideCastle",width:112}}]}},EndInsideCastle:{width:248,height:80,contents:{mode:"Certain",direction:"top",children:[{type:"Known",title:"EndInsideCastle",arguments:{macro:"EndInsideCastle",spawnType:"Bowser",npc:"Peach",transport:{map:"Random",location:"Overworld"},topScrollEnabler:!0},sizing:{height:8}}]}},CheepsStart:{width:0,height:0,contents:{mode:"Certain",children:[{type:"Known",title:"CheepsStart",arguments:{macro:"CheepsStart"}}]}},CheepsStop:{width:0,height:0,contents:{mode:"Certain",children:[{type:"Known",title:"CheepsStop",arguments:{macro:"CheepsStop"}}]}},ScrollEnabler:{width:0,height:0,contents:{mode:"Certain",direction:"right",children:[{type:"Known",title:"ScrollEnabler"}]}},ScrollBlocker:{width:0,height:0,contents:{mode:"Certain",direction:"right",children:[{type:"Known",title:"ScrollBlocker"}]}},Nothing:{width:8,height:8,contents:{mode:"Certain",children:[]}}}};
PlayMarioJas.PlayMarioJas.settings.groups = {
    "groupNames": ["Solid", "Character", "Scenery", "Text"],
    "groupTypes": "Array",
};
PlayMarioJas.PlayMarioJas.settings.events = {
    "keyOnClassCycleStart": "onThingAdd",
    "keyDoClassCycleStart": "placed",
    "keyCycleCheckValidity": "alive",
    "timingDefault": 9
};
/// <reference path="../PlayMarioJas.ts" />
var PlayMarioJas;
(function (PlayMarioJas) {
    "use strict";
    PlayMarioJas.PlayMarioJas.settings.help = {
        "globalName": "FSM",
        "aliases": [
            ["{GAME}", "FSM"]
        ],
        "openings": [
            ["%cHi, thanks for playing Mario! I see you're using the console.%c :)", "head"],
            ["If you'd like to know the common cheats, enter %c{GAME}.UsageHelper.displayHelpOptions();%c here.", "code"]
        ],
        "options": {
            "Map": [
                {
                    "title": "{GAME}.setMap",
                    "description": "Go to a specified map and location.",
                    "usage": "{GAME}.setMap(<map>[, <location>]);",
                    "examples": [
                        {
                            "code": "{GAME}.setMap(\"1-1\");",
                            "comment": "Starts map 1-1."
                        }, {
                            "code": "{GAME}.setMap(\"1-2\", 1);",
                            "comment": "Starts map 1-2, at the second location."
                        }, {
                            "code": "{GAME}.setMap(\"Random\");",
                            "comment": "Starts the random map."
                        }, {
                            "code": "{GAME}.setMap(\"Random\", \"Underworld\");",
                            "comment": "Starts the random map in the Underworld."
                        }]
                }],
            "Things": [
                {
                    "title": "{GAME}.addThing",
                    "description": "Adds a new Thing to the game.",
                    "usage": "{GAME}.addThing(<thing>, left, top);",
                    "examples": [
                        {
                            "code": "{GAME}.addThing(\"Goomba\", 256, 384);",
                            "comment": "Adds a Goomba to the game."
                        }, {
                            "code": "{GAME}.addThing(\"Mushroom\", {GAME}.player.right + 80, {GAME}.player.top);",
                            "comment": "Adds a Mushroom to the right of the player."
                        }, {
                            "code": "{GAME}.addThing([\"Koopa\", { \"smart\": true }], 256, 368);",
                            "comment": "Adds a smart Koopa to the game."
                        }, {
                            "code": "{GAME}.addThing({GAME}.ObjectMaker.make(\"Koopa\", { \"smart\": true, \"jumping\": true }), 256, 368);",
                            "comment": "Adds a smart jumping Koopa to the game."
                        }]
                }, {
                    "title": "{GAME}.GroupHolder.getGroups",
                    "description": "Gets the groups of in-game Things.",
                    "usage": "{GAME}.GroupHolder.getGroups();"
                }, {
                    "title": "{GAME}.GroupHolder.get*******Group",
                    "description": "Retrieves the group of in-game Things under that name.",
                    "usage": "{GAME}.GroupHolder.get*******Group();",
                    "examples": [
                        {
                            "code": "{GAME}.GroupHolder.getCharacterGroup();",
                            "comment": "Retrieves the currently playing Characters."
                        }]
                }, {
                    "title": "{GAME}.GroupHolder.get*******",
                    "description": "Retrieves the numbered Thing from its group.",
                    "usage": "{GAME}.GroupHolder.get*******(<index>);",
                    "examples": [
                        {
                            "code": "{GAME}.GroupHolder.getCharacter(0);",
                            "comment": "Retrieves the first playing Character."
                        }]
                }],
            "Physics": [
                {
                    "title": "{GAME}.shiftBoth",
                    "description": "Shifts a Thing horizontally and/or vertically.",
                    "usage": "{GAME}.shiftBoth(<thing>, <dx>[, <dy>]);",
                    "examples": [
                        {
                            "code": "{GAME}.shiftBoth({GAME}.player, 700);",
                            "comment": "Shifts the player 700 spaces to the right"
                        }, {
                            "code": "{GAME}.player.resting = undefined;\r\n{GAME}.shiftBoth({GAME}.player, 0, -{GAME}.player.top);",
                            "comment": "Shifts the player to the top of the screen."
                        }]
                }, {
                    "title": "{GAME}.killNormal",
                    "description": "Kills a specified Character with animation.",
                    "usage": "{GAME}.killNormal(<thing>);",
                    "examples": [
                        {
                            "code": "{GAME}.killNormal({GAME}.GroupHolder.getCharacter(0));",
                            "comment": "Kills the first playing Character."
                        }, {
                            "code": "{GAME}.GroupHolder.getSceneryGroup().forEach({GAME}.killNormal.bind(FSM));",
                            "comment": "Kills all playing Scenery."
                        }]
                }, {
                    "title": "{GAME}.player.gravity",
                    "description": "Sets the current Player's gravity.",
                    "usage": "{GAME}.player.gravity = <number>;",
                    "examples": [
                        {
                            "code": "{GAME}.player.gravity = {GAME}.MapScreener.gravity / 2;",
                            "comment": "Sets the player's gravity to half the default."
                        }]
                }],
            "Powerups": [
                {
                    "title": "{GAME}.playerShroom",
                    "description": "Simulates the player hitting a Mushroom.",
                    "usage": "{GAME}.playerShroom({GAME}.player);"
                }, {
                    "title": "{GAME}.playerStarUp",
                    "description": "Simulates the player hitting a Star.",
                    "usage": "{GAME}.playerStarUp({GAME}.player);"
                }],
            "Statistics": [
                {
                    "title": "{GAME}.ItemsHolder.getKeys",
                    "description": "Gets the keys you can manipulate.",
                    "usage": "{GAME}.ItemsHolder.getKeys();"
                }, {
                    "title": "{GAME}.ItemsHolder.setItem",
                    "description": "Sets a stored statitistic to a value.",
                    "usage": "{GAME}.ItemsHolder.setItem(\"<key>\", <number>);",
                    "examples": [
                        {
                            "code": "{GAME}.ItemsHolder.setItem(\"coins\", 77);",
                            "comment": "Sets the number of coins to 77."
                        }, {
                            "code": "{GAME}.ItemsHolder.setItem(\"lives\", 7);",
                            "comment": "Sets the number of lives to seven."
                        }, {
                            "code": "{GAME}.ItemsHolder.setItem(\"lives\", Infinity);",
                            "comment": "Sets the number of lives to Infinity and beyond."
                        }]
                }, {
                    "title": "{GAME}.ItemsHolder.increase",
                    "description": "Increases the number of coins you have.",
                    "usage": "{GAME}.ItemsHolder.increase(\"coins\", <number>);",
                    "examples": [
                        {
                            "code": "{GAME}.ItemsHolder.increase(\"coins\", 7);",
                            "comment": "Increases the number of coins by seven."
                        }]
                }],
            "Mods": [
                {
                    "title": "{GAME}.ModAttacher.getMods",
                    "description": "Gets all the available mods.",
                    "usage": "{GAME}.ItemsHolder.getMods();"
                }, {
                    "title": "{GAME}.ModAttacher.enableMod",
                    "description": "Enables a mod.",
                    "usage": "{GAME}.enableMod(\"<key>\");",
                    "examples": [
                        {
                            "code": "{GAME}.enableMod(\"Gradient Skies\");",
                            "comment": "Enables the \"Gradient Skies\" mod."
                        }]
                }, {
                    "title": "{GAME}.ModAttacher.disableMod",
                    "description": "Disables a mod.",
                    "usage": "{GAME}.disableMod(\"<key>\");",
                    "examples": [
                        {
                            "code": "{GAME}.disableMod(\"Gradient Skies\");",
                            "comment": "Disables the \"Gradient Skies\" mod."
                        }]
                }]
        },
        "optionHelp": "To focus on a group, enter %c{GAME}.UsageHelper.displayHelpOption(\"<group-name>\");%c"
    };
})(PlayMarioJas || (PlayMarioJas = {}));
PlayMarioJas.PlayMarioJas.settings.input = {
    "InputWritrArgs": {
        "aliases": {
            // Keyboard aliases
            "left":   [65, 37],     // a,     left
            "right":  [68, 39],     // d,     right
            "up":     [87, 38],     // w,     up
            "down":   [83, 40],     // s,     down
            "sprint": [16, 32],     // shift, space
            "pause":  [80],         // p (pause)
            // Mouse aliases
            "rightclick": [3],
        },
        "triggers": {
            "onkeydown": {
                "left": PlayMarioJas.PlayMarioJas.prototype.keyDownLeft,
                "right": PlayMarioJas.PlayMarioJas.prototype.keyDownRight,
                "up": PlayMarioJas.PlayMarioJas.prototype.keyDownUp,
                "down": PlayMarioJas.PlayMarioJas.prototype.keyDownDown,
                "sprint": PlayMarioJas.PlayMarioJas.prototype.keyDownSprint,
                "pause": PlayMarioJas.PlayMarioJas.prototype.keyDownPause,
                "mute": PlayMarioJas.PlayMarioJas.prototype.keyDownMute,
            },
            "onkeyup": {
                "left": PlayMarioJas.PlayMarioJas.prototype.keyUpLeft,
                "right": PlayMarioJas.PlayMarioJas.prototype.keyUpRight,
                "up": PlayMarioJas.PlayMarioJas.prototype.keyUpUp,
                "down": PlayMarioJas.PlayMarioJas.prototype.keyUpDown,
                "sprint": PlayMarioJas.PlayMarioJas.prototype.keyUpSprint,
                "pause": PlayMarioJas.PlayMarioJas.prototype.keyUpPause
            },
            "onmousedown": {
                "rightclick": PlayMarioJas.PlayMarioJas.prototype.mouseDownRight
            },
            "oncontextmenu": {},
            "ondevicemotion": {
                "devicemotion": PlayMarioJas.PlayMarioJas.prototype.deviceMotion
            }
        }
    }
};
PlayMarioJas.PlayMarioJas.settings.items = {
    "prefix": "PlayMarioJas",
    "doMakeContainer": true,
    "displayChanges": {
        "Infinity": "INF"
    },
    "containersArguments": [
        ["table", {
            "id": "dataDisplay",
            "style": {
                "position": "absolute",
                "top": 0,
                "width": "100%",
                "color": "white",
                "fontSize": "21px",
                "textTransform": "uppercase",
            }
        }],
        ["tr", {
            "style": {
                "padding": "7px 14px 0 14px",
                "textAlign": "center"
            }
        }]
    ],
    "defaults": {
        "elementTag": "td"
    },
    "values": {
        "volume": {
            "valueDefault": 1
        },
        "muted": {
            "valueDefault": false
        },
        "power": {
            "valueDefault": 1,
            "storeLocally": false
        },
        "traveled": {
            "valueDefault": 0
        },
        "score": {
            "valueDefault": 0,
            "digits": 6,
            "hasElement": true,
            "modularity": 100000,
            "onModular": function (EightBitter) {
                EightBitter.gainLife();
            }
        },
        "time": {
            "valueDefault": 0,
            "digits": 3,
            "hasElement": true,
            "minimum": 0,
            "triggers": {
                "100": function (EightBitter) {
                    if (!EightBitter.MapScreener.notime) {
                        EightBitter.AudioPlayer.playThemePrefixed("Hurry");
                    }
                }
            },
            "onMinimum": function (EightBitter) {
                EightBitter.killPlayer(EightBitter.player, true);
            }
        },
        "world": {
            "valueDefault": 0,
            "hasElement": true
        },
        "coins": {
            "valueDefault": 0,
            "hasElement": true,
            "modularity": 100,
            "onModular": function (EightBitter) {
                EightBitter.gainLife();
            }
        },
        "lives": {
            "valueDefault": 3,
            "hasElement": true
        },
        "luigi": {
            "valueDefault": 0,
            "storeLocally": true
        }
    }
};
PlayMarioJas.PlayMarioJas.settings.maps = {
    "mapDefault": "1-1",
    "locationDefault": "0",
    "groupTypes": ["Character", "Solid", "Scenery", "Text"],
    "requireEntrance": true,
    "screenAttributes": [
        "gravity",
        "setting",
        "time",
        "underwater",
        "floor",
        "jumpmod",
        "maxyvel",
        "maxyvelinv",
        "notime",
        "nokeys",
        "canscroll"
    ],
    "screenVariables": {
        "bottomDeathDifference": function (GameStarter) {
            return GameStarter.unitsize * 12;
        },
        "bottomPlatformMax": function (GameStarter) {
            var area = GameStarter.AreaSpawner.getArea(),
                diff = GameStarter.MapScreener.bottomDeathDifference;
                
            if (!area) {
                return -1;
            }
                
            return (area.floor + diff) * GameStarter.unitsize;
        },
        "gravity": function (GameStarter) {
            var area = GameStarter.AreaSpawner.getArea();
            
            if (area && area.underwater) {
                return GameStarter.gravity / 2.8;
            }
            
            return GameStarter.gravity;
        }
    },
    "onSpawn": PlayMarioJas.PlayMarioJas.prototype.addPreThing,
    "macros": {
        "Example": PlayMarioJas.PlayMarioJas.prototype.macroExample,
        "Fill": PlayMarioJas.PlayMarioJas.prototype.macroFillPreThings,
        "Pattern": PlayMarioJas.PlayMarioJas.prototype.macroFillPrePattern,
        "Floor": PlayMarioJas.PlayMarioJas.prototype.macroFloor,
        "Pipe": PlayMarioJas.PlayMarioJas.prototype.macroPipe,
        "PipeCorner": PlayMarioJas.PlayMarioJas.prototype.macroPipeCorner,
        "Tree": PlayMarioJas.PlayMarioJas.prototype.macroTree,
        "Shroom": PlayMarioJas.PlayMarioJas.prototype.macroShroom,
        "Water": PlayMarioJas.PlayMarioJas.prototype.macroWater,
        "CastleSmall": PlayMarioJas.PlayMarioJas.prototype.macroCastleSmall,
        "CastleLarge": PlayMarioJas.PlayMarioJas.prototype.macroCastleLarge,
        "Ceiling": PlayMarioJas.PlayMarioJas.prototype.macroCeiling,
        "Bridge": PlayMarioJas.PlayMarioJas.prototype.macroBridge,
        "Scale": PlayMarioJas.PlayMarioJas.prototype.macroScale,
        "PlatformGenerator": PlayMarioJas.PlayMarioJas.prototype.macroPlatformGenerator,
        "WarpWorld": PlayMarioJas.PlayMarioJas.prototype.macroWarpWorld,
        "CheepsStart": PlayMarioJas.PlayMarioJas.prototype.macroCheepsStart,
        "CheepsStop": PlayMarioJas.PlayMarioJas.prototype.macroCheepsStop,
        "BulletBillsStart": PlayMarioJas.PlayMarioJas.prototype.macroBulletBillsStart,
        "BulletBillsStop": PlayMarioJas.PlayMarioJas.prototype.macroBulletBillsStop,
        "LakituStop": PlayMarioJas.PlayMarioJas.prototype.macroLakituStop,
        "StartInsideCastle": PlayMarioJas.PlayMarioJas.prototype.macroStartInsideCastle,
        "EndOutsideCastle": PlayMarioJas.PlayMarioJas.prototype.macroEndOutsideCastle,
        "EndInsideCastle": PlayMarioJas.PlayMarioJas.prototype.macroEndInsideCastle,
        "Section": PlayMarioJas.PlayMarioJas.prototype.macroSection,
        "SectionPass": PlayMarioJas.PlayMarioJas.prototype.macroSectionPass,
        "SectionFail": PlayMarioJas.PlayMarioJas.prototype.macroSectionFail,
        "SectionDecider": PlayMarioJas.PlayMarioJas.prototype.macroSectionDecider
    },
    "entrances": {
        "Normal": PlayMarioJas.PlayMarioJas.prototype.mapEntranceNormal,
        "Plain": PlayMarioJas.PlayMarioJas.prototype.mapEntrancePlain,
        "Castle": PlayMarioJas.PlayMarioJas.prototype.mapEntranceCastle,
        "Walking": PlayMarioJas.PlayMarioJas.prototype.mapEntranceWalking,
        "Vine": PlayMarioJas.PlayMarioJas.prototype.mapEntranceVine,
        "PipeVertical": PlayMarioJas.PlayMarioJas.prototype.mapEntrancePipeVertical,
        "PipeHorizontal": PlayMarioJas.PlayMarioJas.prototype.mapEntrancePipeHorizontal,
    },
    "patterns": (function (patterns) {
        var pattern,
            i;
        for (i in patterns) {
            if (patterns.hasOwnProperty(i)) {
                pattern = patterns[i];
                if (!pattern.length) {
                    continue;
                }
                
                // Pattern's last array should previously be ["blank", width]
                pattern.width = pattern[pattern.length - 1][1];
                pattern.pop();
            }
        }
        return patterns;
    })({
        "BackRegular": [
            ["HillLarge", 0, 0],
            ["Cloud1", 68, 68],
            ["Bush3", 92, 0],
            ["HillSmall", 128, 0],
            ["Cloud1", 156, 76],
            ["Bush1", 188, 0],
            ["Cloud3", 220, 68],
            ["Cloud2", 292, 76],
            ["Bush2", 332, 0],
            ["Blank", 384]
        ],
        "BackCloud": [
            ["Cloud2", 28, 64],
            ["Cloud1", 76, 32],
            ["Cloud2", 148, 72],
            ["Cloud1", 228, 0],
            ["Cloud1", 284, 32],
            ["Cloud1", 308, 40],
            ["Cloud1", 372, 0],
            ["Blank", 384]
        ],
        "BackFence": [
            ["PlantSmall", 88, 0],
            ["PlantLarge", 104, 0],
            ["Fence", 112, 0, 32],
            ["Cloud1", 148, 68],
            ["PlantLarge", 168, 0],
            ["PlantSmall", 184, 0],
            ["PlantSmall", 192, 0],
            ["Cloud1", 220, 76],
            ["Cloud2", 244, 68],
            ["Fence", 304, 0, 16],
            ["PlantSmall", 320, 0],
            ["Fence", 328, 0],
            ["PlantLarge", 344, 0],
            ["Cloud1", 364, 76],
            ["Cloud2", 388, 68],
            ["Blank", 384]
        ],
        "BackFenceMin": [
            ["PlantLarge", 104, 0],
            ["Fence", 112, 0, 32],
            ["Cloud1", 148, 68],
            ["PlantLarge", 168, 0],
            ["PlantSmall", 184, 0],
            ["PlantSmall", 192, 0],
            ["Cloud1", 220, 76],
            ["Cloud2", 244, 68],
            ["Fence", 304, 0, 16],
            ["PlantSmall", 320, 0],
            ["Fence", 328, 0],
            ["Cloud1", 364, 76],
            ["Cloud2", 388, 68],
            ["Blank", 384]
        ],
        "BackFenceMin2": [
            ["Cloud2", 4, 68],
            ["PlantSmall", 88, 0],
            ["PlantLarge", 104, 0],
            ["Fence", 112, 0],
            ["Fence", 128, 0, 16],
            ["Cloud1", 148, 68],
            // ["PlantLarge", 168, 0],
            ["PlantSmall", 184, 0],
            ["PlantSmall", 192, 0],
            ["Cloud1", 220, 76],
            ["Cloud2", 244, 68],
            ["Fence", 304, 0, 16],
            ["PlantSmall", 320, 0],
            ["Fence", 328, 0],
            ["PlantLarge", 344, 0],
            ["Cloud1", 364, 76],
            ["Cloud2", 388, 68],
            ["Blank", 384]
        ],
        "BackFenceMin3": [
            ["Cloud2", 4, 68],
            ["PlantSmall", 88, 0],
            ["PlantLarge", 104, 0],
            ["Fence", 112, 0, 4],
            ["Cloud1", 148, 68],
            ["PlantSmall", 184, 0],
            ["PlantSmall", 192, 0],
            ["Cloud1", 220, 76],
            ["Cloud2", 244, 68],
            ["Cloud1", 364, 76],
            ["Cloud2", 388, 68],
            ["Blank", 384]
        ]
    }),
    "library": {}
};
PlayMarioJas.PlayMarioJas.settings.maps.library["1-1"] = {
    "name": "1-1",
    "locations": [
          { "entry": "Plain" },
          { "entry": "PipeVertical" },
          { "area": 1 },
    ],
    "areas": [
        {
            "setting": "Overworld",
            "blockBoundaries": true,
            "creation": [
                { "macro": "Pattern", "pattern": "BackRegular", "repeat": 5 },
                { "macro": "Floor", "width": 552 },
                { "thing": "DecorativeBack", "x": 20, "y": 88 },
                { "thing": "DecorativeDot", "x": 21.5, "y": 46.5 },
                { "thing": "DecorativeDot", "x": 21.5, "y": 86.5 },
                {
                    "thing": "CustomText", "x": 20, "y": 36, "texts": [
                      { "text": "MOVE: ARROWS/WASD", "offset": 12 },
                      { "text": "FIRE/SPRINT: SHIFT/SPACE" },
                      { "text": "PAUSE: P/RIGHTCLICK", "offset": 8 }
                    ]
                },
                {
                    "thing": "CustomText", "x": 24.5, "y": 84, "size": "Large", "texts": [
                      { "text": "SUPER" }
                    ]
                },
                {
                    "thing": "CustomText", "x": 24.5, "y": 68, "size": "Huge", "texts": [
                      { "text": "MARIO BROS." }
                    ]
                },
                { "thing": "DecorativeDot", "x": 105.5, "y": 46.5 },
                { "thing": "DecorativeDot", "x": 105.5, "y": 86.5 },
                {
                    "thing": "CustomText", "x": 52, "y": 44, "size": "Colored", "texts": [
                      { "text": "©1985 NINTENDO" }
                    ]
                },
                { "thing": "Block", "x": 128, "y": 32, "isQuizBlock": true },
                { "thing": "Brick", "x": 160, "y": 32 },
                { "thing": "Block", "x": 168, "y": 32, "contents": "Mushroom" },
                { "thing": "Goomba", "x": 176, "y": 8 },
                { "thing": "Brick", "x": 176, "y": 32 },
                { "thing": "Block", "x": 176, "y": 64 },
                { "thing": "Block", "x": 184, "y": 32 },
                { "thing": "Brick", "x": 192, "y": 32 },
                { "macro": "Pipe", "x": 224, "height": 16 },
                { "macro": "Pipe", "x": 304, "height": 24 },
                { "thing": "Goomba", "x": 340, "y": 8 },
                { "macro": "Pipe", "x": 368, "height": 32 },
                { "thing": "Goomba", "x": 412, "y": 8 },
                { "thing": "Goomba", "x": 422, "y": 8 },
                { "macro": "Pipe", "x": 456, "height": 32, "transport": 2 },
                { "thing": "Block", "x": 512, "y": 40, "contents": "Mushroom1Up", "hidden": true },
                { "macro": "Floor", "x": 568, "width": 120 },
                { "thing": "Brick", "x": 616, "y": 32 },
                { "thing": "Block", "x": 624, "y": 32, "contents": "Mushroom", "isQuizBlock": true },
                { "thing": "Brick", "x": 632, "y": 32 },
                { "thing": "Brick", "x": 640, "y": 32 },
                { "thing": "Goomba", "x": 640, "y": 72 },
                { "thing": "Brick", "x": 648, "y": 64 },
                { "thing": "Brick", "x": 656, "y": 64 },
                { "thing": "Goomba", "x": 656, "y": 72 },
                { "macro": "Fill", "thing": "Brick", "x": 664, "y": 64, "xnum": 5, "xwidth": 8 },
                { "macro": "Floor", "x": 712, "width": 512 },
                { "macro": "Fill", "thing": "Brick", "x": 728, "y": 64, "xnum": 3, "xwidth": 8 },
                { "thing": "Brick", "x": 752, "y": 32, "contents": "Coin" },
                { "thing": "Block", "x": 752, "y": 64 },
                { "thing": "Goomba", "x": 776, "y": 8 },
                { "thing": "Goomba", "x": 788, "y": 8 },
                { "thing": "Brick", "x": 800, "y": 32 },
                { "thing": "Brick", "x": 808, "y": 32, "contents": "Star" },
                { "thing": "Block", "x": 848, "y": 32 },
                { "thing": "Koopa", "x": 856, "y": 12 },
                { "thing": "Block", "x": 872, "y": 32 },
                { "thing": "Block", "x": 872, "y": 64, "contents": "Mushroom" },
                { "thing": "Block", "x": 896, "y": 32 },
                { "thing": "Goomba", "x": 912, "y": 8 },
                { "thing": "Goomba", "x": 924, "y": 8 },
                { "thing": "Brick", "x": 944, "y": 32 },
                { "macro": "Fill", "thing": "Brick", "x": 968, "y": 64, "xnum": 3, "xwidth": 8 },
                { "macro": "Fill", "thing": "Goomba", "x": 992, "y": 8, "xnum": 4, "xwidth": 16 },
                { "thing": "Brick", "x": 1024, "y": 64 },
                { "thing": "Brick", "x": 1032, "y": 32 },
                { "thing": "Block", "x": 1032, "y": 64 },
                { "thing": "Brick", "x": 1040, "y": 32 },
                { "thing": "Block", "x": 1040, "y": 64 },
                { "thing": "Brick", "x": 1048, "y": 64 },
                { "thing": "Stone", "x": 1072, "y": 8 },
                { "thing": "Stone", "x": 1080, "y": 16, "height": 16 },
                { "thing": "Stone", "x": 1088, "y": 24, "height": 24 },
                { "thing": "Stone", "x": 1096, "y": 32, "height": 32 },
                { "thing": "Stone", "x": 1120, "y": 32, "height": 32 },
                { "thing": "Stone", "x": 1128, "y": 24, "height": 24 },
                { "thing": "Stone", "x": 1136, "y": 16, "height": 16 },
                { "thing": "Stone", "x": 1144, "y": 8 },
                { "thing": "Stone", "x": 1184, "y": 8 },
                { "thing": "Stone", "x": 1192, "y": 16, "height": 16 },
                { "thing": "Stone", "x": 1200, "y": 24, "height": 24 },
                { "thing": "Stone", "x": 1208, "y": 32, "height": 32 },
                { "thing": "Stone", "x": 1216, "y": 32, "height": 32 },
                { "macro": "Floor", "x": 1240, "width": 656 },
                { "thing": "Stone", "x": 1240, "y": 32, "height": 32 },
                { "thing": "Stone", "x": 1248, "y": 24, "height": 24 },
                { "thing": "Stone", "x": 1256, "y": 16, "height": 16 },
                { "thing": "Stone", "x": 1264, "y": 8 },
                { "macro": "Pipe", "x": 1304, "height": 16, "entrance": 1 },
                { "thing": "Brick", "x": 1344, "y": 32 },
                { "thing": "Brick", "x": 1352, "y": 32 },
                { "thing": "Block", "x": 1360, "y": 32, "isQuizBlock": true },
                { "thing": "Brick", "x": 1368, "y": 32 },
                { "thing": "Goomba", "x": 1392, "y": 8 },
                { "thing": "Goomba", "x": 1404, "y": 8 },
                { "macro": "Pipe", "x": 1432, "height": 16 },
                { "thing": "Stone", "x": 1448, "y": 8 },
                { "thing": "Stone", "x": 1456, "y": 16, "height": 16 },
                { "thing": "Stone", "x": 1464, "y": 24, "height": 24 },
                { "thing": "Stone", "x": 1472, "y": 32, "height": 32 },
                { "thing": "Stone", "x": 1480, "y": 40, "height": 40 },
                { "thing": "Stone", "x": 1488, "y": 48, "height": 48 },
                { "thing": "Stone", "x": 1496, "y": 56, "height": 56 },
                { "thing": "Stone", "x": 1504, "y": 64, "height": 64, "width": 16 },
                { "macro": "EndOutsideCastle", "x": 1584, "y": 0, "transport": { "map": "1-2" } }
            ]
        }, {
            "setting": "Underworld",
            "blockBoundaries": true,
            "creation": [
                { "macro": "Ceiling", "x": 32, "width": 56 },
                { "macro": "Floor", "x": 0, "y": 0, "width": 136 },
                { "macro": "Fill", "thing": "Brick", "x": 0, "y": 8, "ynum": 11, "yheight": 8 },
                { "macro": "Fill", "thing": "Brick", "x": 32, "y": 8, "xnum": 7, "ynum": 3, "xwidth": 8, "yheight": 8 },
                { "macro": "Fill", "thing": "Coin", "x": 33, "y": 31, "xnum": 7, "ynum": 2, "xwidth": 8, "yheight": 16 },
                { "macro": "Fill", "thing": "Coin", "x": 41, "y": 63, "xnum": 5, "ynum": 1, "xwidth": 8 },
                { "thing": "PipeHorizontal", "x": 104, "y": 16, "transport": 1, "width": 16 },
                { "thing": "PipeVertical", "x": 120, "y": 88, "height": 88 }
            ]
        }
    ]
};
PlayMarioJas.PlayMarioJas.settings.maps.library["1-2"] = {
    "name": "1-2",
    "locations": [
        { "entry": "Walking" },
        { "area": 1 },
        { "area": 2 },
        { "area": 1, "entry": "PipeVertical" },
        { "area": 3, "entry": "PipeVertical" },
        { "area": 1 }
    ],
    "areas": [
        {
            "setting": "Overworld",
            "blockBoundaries": true,
            "creation": [
                { "macro": "Pattern", "pattern": "BackCloud", "y": 4, "repeat": 1 },
                { "macro": "Floor", "width": 192 },
                { "macro": "CastleSmall" },
                { "thing": "PipeHorizontal", "x": 80, "y": 16, "transport": 1 },
                { "macro": "Pipe", "x": 96, "height": 32 }
            ]
        }, {
            "setting": "Underworld",
            "blockBoundaries": true,
            "creation": [
                { "macro": "Floor", "width": 640 },
                { "macro": "Fill", "thing": "Brick", "y": 8, "ynum": 11 },
                { "macro": "Ceiling", "x": 48, "width": 664 },
                { "thing": "Block", "x": 80, "y": 32, "contents": "Mushroom", "isQuizBlock": true },
                { "macro": "Fill", "thing": "Block", "x": 88, "y": 32, "xnum": 4 },
                { "thing": "Goomba", "x": 128, "y": 8 },
                { "thing": "Stone", "x": 136, "y": 8 },
                { "thing": "Goomba", "x": 136, "y": 16 },
                { "thing": "Stone", "x": 152, "y": 16, "height": 16 },
                { "thing": "Stone", "x": 168, "y": 24, "height": 24 },
                { "thing": "Stone", "x": 184, "y": 32, "height": 32 },
                { "thing": "Stone", "x": 200, "y": 32, "height": 32 },
                { "thing": "Stone", "x": 216, "y": 24, "height": 24 },
                { "thing": "Goomba", "x": 232, "y": 8 },
                { "thing": "Brick", "x": 232, "y": 40, "contents": "Coin" },
                { "thing": "Stone", "x": 248, "y": 24, "height": 24 },
                { "thing": "Stone", "x": 264, "y": 16, "height": 16 },
                { "macro": "Fill", "thing": "Brick", "x": 312, "y": 32, "ynum": 3 },
                { "thing": "Brick", "x": 320, "y": 32 },
                { "thing": "Coin", "x": 321, "y": 39 },
                { "macro": "Fill", "thing": "Brick", "x": 328, "y": 32, "ynum": 3 },
                { "macro": "Fill", "thing": "Coin", "x": 330, "y": 60, "xnum": 4, "xwidth": 8 },
                { "thing": "Brick", "x": 336, "y": 48 },
                { "thing": "Brick", "x": 344, "y": 48 },
                { "macro": "Fill", "thing": "Koopa", "x": 352, "y": 12, "xnum": 2, "xwidth": 12 },
                { "macro": "Fill", "thing": "Brick", "x": 352, "y": 32, "ynum": 3 },
                { "thing": "Brick", "x": 360, "y": 32 },
                { "thing": "Coin", "x": 361, "y": 39 },
                { "macro": "Fill", "thing": "Brick", "x": 368, "y": 32, "ynum": 2 },
                { "thing": "Brick", "x": 368, "y": 48, "contents": "Star" },
                { "macro": "Fill", "thing": "Brick", "x": 416, "y": 32, "xnum": 2, "ynum": 5 },
                { "thing": "Block", "x": 448, "y": 48, "isQuizBlock": true },
                { "macro": "Fill", "thing": "Brick", "x": 432, "y": 16, "xnum": 2, "ynum": 3 },
                { "macro": "Fill", "thing": "Brick", "x": 432, "y": 72, "xnum": 2, "ynum": 2 },
                { "macro": "Fill", "thing": "Brick", "x": 464, "y": 32, "xnum": 4, "ynum": 1 },
                { "macro": "Fill", "thing": "Brick", "x": 464, "y": 72, "xnum": 5, "ynum": 2 },
                { "macro": "Fill", "thing": "Coin", "x": 465, "y": 39, "xnum": 4, "xwidth": 8 },
                { "thing": "Koopa", "x": 472, "y": 12 },
                { "macro": "Fill", "thing": "Brick", "x": 496, "y": 32, "xnum": 2, "ynum": 7 },
                { "thing": "Goomba", "x": 494, "y": 8 },
                { "thing": "Goomba", "x": 510, "y": 8 },
                { "macro": "Fill", "thing": "Brick", "x": 528, "y": 72, "xnum": 4, "ynum": 2 },
                { "macro": "Fill", "thing": "Brick", "x": 536, "y": 32, "ynum": 5 },
                { "macro": "Fill", "thing": "Brick", "x": 544, "y": 32, "xnum": 2 },
                { "thing": "Coin", "x": 545, "y": 39 },
                { "thing": "Brick", "x": 552, "y": 40, "contents": "Mushroom" },
                { "macro": "Fill", "thing": "Brick", "x": 576, "y": 32, "xnum": 2 },
                { "thing": "Brick", "x": 576, "y": 40 },
                { "macro": "Fill", "thing": "Brick", "x": 576, "y": 48, "xnum": 2, "ynum": 3 },
                { "thing": "Brick", "x": 584, "y": 40, "contents": "Coin" },
                { "thing": "Goomba", "x": 584, "y": 72 },
                { "macro": "Fill", "thing": "Brick", "x": 608, "y": 32, "xnum": 4 },
                { "macro": "Fill", "thing": "Goomba", "x": 608, "y": 40, "xnum": 2, "xwidth": 12 },
                { "macro": "Fill", "thing": "Brick", "x": 608, "y": 72, "xnum": 4, "ynum": 2 },
                { "macro": "Floor", "x": 664, "width": 272 },
                { "macro": "Fill", "thing": "Brick", "x": 672, "y": 40, "xnum": 6, "ynum": 2 },
                { "macro": "Fill", "thing": "Coin", "x": 674, "y": 64, "xnum": 6, "xwidth": 8 },
                { "thing": "Brick", "x": 712, "y": 88, "contents": "Mushroom1Up" },
                { "macro": "Ceiling", "x": 720, "width": 360 },
                { "macro": "Fill", "thing": "Goomba", "x": 768, "y": 8, "xnum": 3, "xwidth": 12 },
                { "macro": "Pipe", "x": 800, "height": 24, "piranha": true, "transport": 2 },
                { "macro": "Pipe", "x": 848, "height": 32, "piranha": true },
                { "thing": "Goomba", "x": 872, "y": 8 },
                { "macro": "Pipe", "x": 896, "height": 16, "piranha": true, "entrance": 3 },
                { "macro": "Floor", "x": 952, "width": 16 },
                { "macro": "Fill", "thing": "Brick", "x": 952, "y": 8, "xnum": 2, "ynum": 3 },
                { "macro": "Floor", "x": 984, "width": 96 },
                { "thing": "Stone", "x": 1040, "y": 8 },
                { "thing": "Stone", "x": 1048, "y": 16, "height": 16 },
                { "thing": "Stone", "x": 1056, "y": 24, "height": 24 },
                { "thing": "Goomba", "x": 1056, "y": 32 },
                { "thing": "Stone", "x": 1064, "y": 32, "height": 32 },
                { "thing": "Goomba", "x": 1064, "y": 48 },
                { "thing": "Stone", "x": 1072, "y": 32, "height": 32 },
                { "macro": "PlatformGenerator", "x": 1096, "width": 24 },
                { "macro": "Floor", "x": 1144, "width": 64 },
                { "macro": "Fill", "thing": "Brick", "x": 1144, "y": 40, "xnum": 5, "ynum": 1 },
                { "thing": "Block", "x": 1200, "y": 40, "isQuizBlock": true },
                { "thing": "Koopa", "x": 1152, "y": 12, "smart": true },
                { "thing": "Brick", "x": 1184, "y": 40, "contents": "Mushroom" },
                { "macro": "PlatformGenerator", "x": 1224, "width": 24, "direction": -1 },
                { "macro": "Floor", "x": 1264, "width": 256 },
                { "macro": "Fill", "thing": "Brick", "x": 1264, "y": 8, "xnum": 17, "ynum": 3 },
                { "thing": "PipeHorizontal", "x": 1312, "y": 40, "transport": 4 },
                { "thing": "PipeVertical", "x": 1328, "y": 88, "height": 64 },
                { "thing": "ScrollEnabler", "x": 1328, "y": 120, "height": 48 },
                { "macro": "Ceiling", "x": 1272, "width": 56 },
                { "macro": "Fill", "thing": "Brick", "x": 1344, "y": 32, "xnum": 7, "ynum": 7 },
                { "macro": "Ceiling", "x": 1344, "width": 136 },
                { "thing": "ScrollBlocker", "x": 1344 },
                { "macro": "WarpWorld", "x": 1400, "warps": [4, 3, 2] },
                { "macro": "Fill", "thing": "Brick", "x": 1504, "y": 8, "xnum": 2, "ynum": 11 },
                { "thing": "ScrollBlocker", "x": 1518, "y": 8 }
            ]
        }, {
            "setting": "Underworld",
            "blockBoundaries": true,
            "creation": [
                { "macro": "Floor", "width": 136 },
                { "macro": "Fill", "thing": "Brick", "y": 8, "ynum": 11 },
                { "macro": "Fill", "thing": "Brick", "x": 24, "y": 32, "xnum": 9 },
                { "macro": "Fill", "thing": "Brick", "x": 24, "y": 64, "xnum": 10, "ynum": 4 },
                { "macro": "Fill", "thing": "Coin", "x": 25, "y": 7, "xnum": 9, "xwidth": 8 },
                { "macro": "Fill", "thing": "Coin", "x": 33, "y": 39, "xnum": 8, "xwidth": 8 },
                { "thing": "Brick", "x": 96, "y": 32, "contents": "Coin" },
                { "macro": "Fill", "thing": "Brick", "x": 104, "y": 24, "xnum": 2, "ynum": 9 },
                { "thing": "PipeHorizontal", "x": 104, "y": 16, "transport": 3 },
                { "thing": "PipeVertical", "x": 120, "y": 100, "height": 100 }
            ]
        }, {
            "setting": "Overworld",
            "blockBoundaries": true,
            "creation": [
                { "macro": "Floor", "width": 464 },
                { "macro": "Pipe", "height": 16, "piranha": true, "entrance": 4 },
                { "macro": "Pattern", "pattern": "BackRegular", "x": 104, },
                { "thing": "Stone", "x": 16, "y": 8 },
                { "thing": "Stone", "x": 24, "y": 16, "height": 16 },
                { "thing": "Stone", "x": 32, "y": 24, "height": 24 },
                { "thing": "Stone", "x": 40, "y": 32, "height": 32 },
                { "thing": "Stone", "x": 48, "y": 40, "height": 40 },
                { "thing": "Stone", "x": 56, "y": 48, "height": 48 },
                { "thing": "Stone", "x": 64, "y": 56, "height": 56 },
                { "thing": "Stone", "x": 72, "y": 64, "height": 64, "width": 16 },
                { "macro": "EndOutsideCastle", "x": 152, "transport": { "map": "1-3" } }
            ]
        }
    ]
};
PlayMarioJas.PlayMarioJas.settings.maps.library["1-3"] = {
    "name": "1-3",
    "time": 300,
    "locations": [
        { "entry": "Plain" }
    ],
    "areas": [
        {
            "setting": "Overworld",
            "blockBoundaries": true,
            "creation": [
                { "macro": "Pattern", "pattern": "BackCloud", "x": 0, "y": 4, "repeat": 5 },
                { "macro": "Floor", "x": 0, "y": 0, "width": 128 },
                { "macro": "CastleSmall" },
                { "macro": "Tree", "x": 144, "y": 8, "width": 32 },
                { "macro": "Tree", "x": 192, "y": 32, "width": 64, "solidTrunk": true },
                { "macro": "Tree", "x": 208, "y": 64, "width": 40 },
                { "macro": "Fill", "thing": "Coin", "x": 217, "y": 71, "xnum": 3, "xwidth": 8 },
                { "thing": "Koopa", "x": 240, "y": 76, "smart": true },
                { "macro": "Tree", "x": 256, "y": 8, "width": 24 },
                { "thing": "Coin", "x": 266, "y": 15 },
                { "macro": "Tree", "x": 280, "y": 40, "width": 40 },
                { "thing": "Block", "x": 296, "y": 56, "isQuizBlock": true },
                { "macro": "Fill", "thing": "Coin", "x": 297, "y": 87, "xnum": 2, "xwidth": 8 },
                { "macro": "Tree", "x": 320, "y": 72, "width": 56 },
                { "macro": "Fill", "thing": "Goomba", "x": 352, "y": 80, "xnum": 2, "xwidth": 16 },
                { "macro": "Tree", "x": 400, "width": 32 },
                { "macro": "Fill", "thing": "Coin", "x": 402, "y": 55, "xnum": 2, "xwidth": 8 },
                { "thing": "Platform", "x": 440, "y": 56, "width": 24, "floating": true, "begin": -4, "end": 56 },
                { "macro": "Tree", "x": 472, "width": 40 },
                { "thing": "Block", "x": 472, "y": 24, "contents": "Mushroom", "isQuizBlock": true },
                { "macro": "Tree", "x": 480, "y": 64, "width": 32 },
                { "macro": "Fill", "thing": "Coin", "x": 482, "y": 71, "xnum": 4, "xwidth": 8 },
                { "macro": "Tree", "x": 520, "width": 40 },
                { "macro": "Tree", "x": 560, "y": 32, "width": 24 },
                { "thing": "Koopa", "x": 592, "y": 76, "smart": true, "jumping": true, "floating": true, "begin": 16, "end": 88 },
                { "macro": "Tree", "x": 608, "y": 56, "width": 48 },
                { "thing": "Goomba", "x": 640, "y": 64 },
                { "macro": "Fill", "thing": "Coin", "x": 681, "y": 63, "xnum": 2, "xwidth": 8 },
                { "thing": "Platform", "x": 688, "y": 40, "width": 24, "sliding": true, "begin": 660, "end": 720 },
                { "macro": "Fill", "thing": "Coin", "x": 745, "y": 71, "xnum": 2, "xwidth": 8 },
                { "thing": "Platform", "x": 752, "y": 32, "width": 24, "sliding": true, "begin": 708, "end": 776 },
                { "macro": "Fill", "thing": "Coin", "x": 777, "y": 71, "xnum": 2, "xwidth": 8 },
                { "macro": "Tree", "x": 784, "y": 16, "width": 32 },
                { "macro": "Tree", "x": 832, "y": 48, "width": 64, "solidTrunk": true },
                { "thing": "Block", "x": 856, "y": 64, "isQuizBlock": true },
                { "thing": "Koopa", "x": 880, "y": 60, "smart": true },
                { "macro": "Tree", "x": 904, "width": 24 },
                { "macro": "Fill", "thing": "Coin", "x": 906, "y": 7, "xnum": 3, "xwidth": 8 },
                { "thing": "Koopa", "x": 912, "y": 68, "smart": true, "jumping": true, "floating": true, "begin": 4, "end": 76 },
                { "macro": "Tree", "x": 928, "y": 32, "width": 32 },
                { "macro": "Fill", "thing": "Coin", "x": 963, "y": 63, "xnum": 2, "xwidth": 8 },
                { "macro": "Tree", "x": 976, "y": 32, "width": 32, "solidTrunk": true },
                { "macro": "Floor", "x": 1032, "width": 368 },
                { "thing": "Platform", "x": 1048, "y": 56, "width": 24, "sliding": true, "begin": 1024, "end": 1068 },
                { "thing": "Koopa", "x": 1064, "y": 12, "smart": true },
                { "thing": "Stone", "x": 1104, "y": 32, "width": 16, "height": 32 },
                { "thing": "Stone", "x": 1120, "y": 48, "width": 16, "height": 48 },
                { "thing": "Stone", "x": 1136, "y": 64, "width": 16, "height": 64 },
                { "macro": "EndOutsideCastle", "x": 1224, "large": true, "walls": 12, "transport": { "map": "1-1" } }
            ]
        }
    ]
};
/// <reference path="../PlayMarioJas.ts" />
var PlayMarioJas;
(function (PlayMarioJas) {
    "use strict";
    PlayMarioJas.PlayMarioJas.settings.math = {
        "equations": {
            /**
             * Determines whether a player is within touching distance of a castle axe
             * (assuming it is alive), so that it can start the BowserVictory cutscene.
             *
             * @param thing   A player close to a castle axe.
             * @param other   A castle axe that can defeat Bowser.
             * @returns Whether the player is both alive and close enough to the axe.
             */
            "canPlayerTouchCastleAxe": function (constants, equations, thing, other) {
                if (!thing.FSM.isThingAlive(thing)) {
                    return false;
                }
                if (thing.right < other.left + other.EightBitter.unitsize) {
                    return false;
                }
                if (thing.bottom > other.bottom - other.EightBitter.unitsize) {
                    return false;
                }
                return true;
            },
            /**
             * Decreases a player's jumping yvel based on whether it's running.
             */
            "decreasePlayerJumpingYvel": function (constants, equations, player) {
                var jumpmod = player.FSM.MapScreener.jumpmod - player.xvel * .0014, power = Math.pow(player.keys.jumplev, jumpmod), dy = player.FSM.unitsize / power;
                player.yvel = Math.max(player.yvel - dy, constants.maxyvelinv);
            },
            /**
             * Decreases a player's running xvel based on whether it's sprinting.
             * @returns {Boolean} True if the player started or stopped skidding,
             *                    or false if the skidding status was unchanged.
             */
            "decreasePlayerRunningXvel": function (constants, equations, player) {
                // If a button is pressed, hold/increase speed
                if (player.keys.run !== 0 && !player.crouching) {
                    var dir = player.keys.run, 
                    // No sprinting underwater
                    sprinting = Number(player.keys.sprint && !player.FSM.MapScreener.underwater) || 0, adder = dir * (.098 * (Number(sprinting) + 1)), decel = 0, skiddingChanged = false;
                    // Reduce the speed, both by subtracting and dividing a little
                    player.xvel += adder || 0;
                    player.xvel *= .98;
                    decel = .0007;
                    // If you're accelerating in the opposite direction from your current velocity, that's a skid
                    if ((player.keys.run > 0) === player.moveleft) {
                        if (!player.skidding) {
                            player.skidding = true;
                            skiddingChanged = true;
                        }
                    }
                    else if (player.skidding) {
                        // Not accelerating: make sure you're not skidding
                        player.skidding = false;
                        skiddingChanged = true;
                    }
                }
                else {
                    // Otherwise slow down a bit
                    player.xvel *= .98;
                    decel = .035;
                }
                if (player.xvel > decel) {
                    player.xvel -= decel;
                }
                else if (player.xvel < -decel) {
                    player.xvel += decel;
                }
                else if (player.xvel !== 0) {
                    player.xvel = 0;
                    if (!player.FSM.MapScreener.nokeys && player.keys.run === 0) {
                        if (player.keys.leftDown) {
                            player.keys.run = -1;
                        }
                        else if (player.keys.rightDown) {
                            player.keys.run = 1;
                        }
                    }
                }
                return skiddingChanged;
            },
            /**
             * @returns A player's yvel for when riding up a springboard.
             */
            "springboardYvelUp": function (constants, equations, thing) {
                return Math.max(thing.FSM.unitsize * -2, thing.tensionSave * -.98);
            },
            /**
             * @returns How many fireworks to show at the end of a level,
             *          based on the given time's rightmost digit.
             */
            "numberOfFireworks": function (constants, equations, time) {
                var numFireworks = time % 10;
                if (!(numFireworks === 1 || numFireworks === 3 || numFireworks === 6)) {
                    return 0;
                }
                return numFireworks;
            }
        }
    };
})(PlayMarioJas || (PlayMarioJas = {}));
PlayMarioJas.PlayMarioJas.settings.mods = {
    "storeLocally": true,
    "mods": []
};
PlayMarioJas.PlayMarioJas.settings.objects = {
    "onMake": "onMake",
    "indexMap": ["width", "height"],
    "doPropertiesFull": true,
    "inheritance": {
        "Quadrant": {},
        "Map": {},
        "Area": {},
        "Location": {},
        "Thing": {
            "character": {
                "Player": {},
                "enemy": {
                    "Goomba": {},
                    "Koopa": {},
                    "Beetle": {},
                    "Piranha": {},
                    "Blooper": {},
                    "CheepCheep": {},
                    "Podoboo": {},
                    "BulletBill": {},
                    "Lakitu": {},
                    "SpinyEgg": {},
                    "Spiny": {},
                    "HammerBro": {
                        "Bowser": {}
                    },
                    "Hammer": {},
                    "BowserFire": {},
                },
                "item": {
                    "Mushroom": {
                        "Mushroom1Up": {},
                        "MushroomDeathly": {}
                    },
                    "FireFlower": {},
                    "Fireball": {
                        "CastleFireball": {}
                    },
                    "Star": {},
                    "Shell": {
                        "BeetleShell": {}
                    },
                    "Vine": {}
                },
                "BrickShard": {},
                "Bubble": {},
                "Coin": {},
                "Firework": {},
            },
            "solid": {
                "Block": {},
                "BridgeBase": {},
                "Brick": {},
                "DeadGoomba": {},
                "Pipe": {},
                "PipeHorizontal": {},
                "PipeVertical": {},
                "Platform": {},
                "Stone": {
                    "RestingStone": {}
                },
                "Cannon": {},
                "Springboard": {},
                "Floor": {},
                "TreeTop": {},
                "ShroomTop": {},
                "CastleAxe": {},
                "CastleBlock": {},
                "CastleBridge": {},
                "CastleChain": {},
                "Coral": {},
                "WaterBlocker": {},
                "detector": {
                    "DetectCollision": {
                        "ScrollEnabler": {},
                    },
                    "DetectWindow": {
                        "ScrollBlocker": {},
                        "RandomSpawner": {}
                    },
                    "DetectSpawn": {}
                }
            },
            "scenery": {
                "Blank": {},
                "BrickHalf": {},
                "BrickPlain": {},
                "Bush1": {},
                "Bush2": {},
                "Bush3": {},
                "CastleDoor": {},
                "CastleFlag": {},
                "CastleRailing": {},
                "CastleRailingFilled": {},
                "CastleTop": {},
                "CastleWall": {},
                "Cloud": {
                    "Cloud1": {},
                    "Cloud2": {},
                    "Cloud3": {},
                },
                "Fence": {},
                "Flag": {},
                "FlagPole": {},
                "FlagTop": {},
                "HillSmall": {},
                "HillLarge": {},
                "Peach": {},
                "PlatformString": {},
                "PlantSmall": {},
                "PlantLarge": {},
                "Railing": {},
                "ShroomTrunk": {},
                "String": {},
                "StringCornerLeft": {},
                "StringCornerRight": {},
                "Toad": {},
                "TreeTrunk": {},
                "Water": {}
            },
            "Text": {
                "DecorativeBack": {},
                "DecorativeDot": {},
                "TextA": {},
                "TextB": {},
                "TextC": {},
                "TextD": {},
                "TextE": {},
                "TextF": {},
                "TextG": {},
                "TextH": {},
                "TextI": {},
                "TextJ": {},
                "TextK": {},
                "TextL": {},
                "TextM": {},
                "TextN": {},
                "TextO": {},
                "TextP": {},
                "TextQ": {},
                "TextR": {},
                "TextS": {},
                "TextT": {},
                "TextU": {},
                "TextV": {},
                "TextW": {},
                "TextX": {},
                "TextY": {},
                "TextZ": {},
                "Text0": {},
                "Text1": {},
                "Text2": {},
                "Text3": {},
                "Text4": {},
                "Text5": {},
                "Text6": {},
                "Text7": {},
                "Text8": {},
                "Text9": {},
                "TextSpace": {},
                "TextSlash": {},
                "TextCharacters": {
                    "TextPeriod": {},
                    "TextExclamationMark": {},
                    "TextColon": {},
                },
                "TextColored": {
                    "TextColoredD": {},
                    "TextColoredE": {},
                    "TextColoredI": {},
                    "TextColoredN": {},
                    "TextColoredO": {},
                    "TextColoredT": {},
                    "TextColored1": {},
                    "TextColored5": {},
                    "TextColored8": {},
                    "TextColored9": {},
                    "TextColoredSpace": {},
                    "TextColoredCopyright": {}
                },
                "TextLarge": {
                    "TextLargeE": {},
                    "TextLargeP": {},
                    "TextLargeR": {},
                    "TextLargeS": {},
                    "TextLargeU": {}
                },
                "TextHuge": {
                    "TextHugeA": {},
                    "TextHugeB": {},
                    "TextHugeI": {},
                    "TextHugeM": {},
                    "TextHugeO": {},
                    "TextHugeR": {},
                    "TextHugeS": {},
                    "TextHugeSpace": {},
                    "TextHugePeriod": {}
                },
                "ScoreText": {
                    "Text100": {},
                    "Text200": {},
                    "Text400": {},
                    "Text500": {},
                    "Text800": {},
                    "Text1000": {},
                    "Text2000": {},
                    "Text4000": {},
                    "Text5000": {},
                    "Text8000": {},
                    "Text1Up": {},
                },
                "CustomText": {}
            }
        }
    },
    "properties": {
        "Quadrant": {
            "tolx": 0,
            "toly": 0
        },
        "Map": {
            "initialized": false,
            "time": 400
        },
        "Area": {
            "onMake": PlayMarioJas.PlayMarioJas.prototype.initializeArea,
            "setBackground": PlayMarioJas.PlayMarioJas.prototype.setAreaBackground,
            "floor": 104,
            "jumpmod": 1.056,
            "maxyvel": PlayMarioJas.PlayMarioJas.unitsize * 2,
            "maxyvelinv": PlayMarioJas.PlayMarioJas.unitsize * -3.5,
            "onPlayerDeathTimeout": 280,
            "onGameOverTimeout": 280,
            "gravity": PlayMarioJas.PlayMarioJas.gravity,
            "canscroll": true,
            "underwater": false,
            "notime": false,
            "nokeys": false,
            "onPlayerDeath": PlayMarioJas.PlayMarioJas.prototype.setMap,
            "onGameOver": PlayMarioJas.PlayMarioJas.prototype.gameOver,
            "attributes": {
                "underwater": {
                    "gravity": PlayMarioJas.PlayMarioJas.gravity / 2.8,
                    "stretches": [{
                        "thing": "WaterBlocker",
                        "y": 104,
                        "height": 16
                    }, {
                        "thing": "Water",
                        "y": 88
                    }]
                },
                "blockBoundaries": {
                    "afters": [{
                        "thing": "ScrollBlocker", "noBoundaryStretch": true
                    }]
                },
                "random": {
                    "onPlayerDeath": PlayMarioJas.PlayMarioJas.prototype.mapEntranceRespawn,
                    "onPlayerDeathTimeout": 140
                },
                "editor": {
                    "onPlayerDeath": PlayMarioJas.PlayMarioJas.prototype.mapEntranceRespawn,
                    "onPlayerDeathTimeout": 140
                }
            }
        },
        "Location": {
            "area": 0,
            "entry": "Normal"
        },
        "Thing": {
            // Sizing
            "width": 8,
            "height": 8,
            "tolx": 0,
            "toly": PlayMarioJas.PlayMarioJas.unitsize / 8,
            // Velocity
            "xvel": 0,
            "yvel": 0,
            "speed": 0,
            // Score amounts on death
            "scoreStomp": 100,
            "scoreFire": 200,
            "scoreStar": 200,
            "scoreBelow": 100,
            // Placement
            "alive": true,
            "placed": false,
            // Quadrants
            "maxquads": 4,
            "outerok": false,
            // Sprites
            "sprite": "",
            "spriteType": "neither",
            "opacity": 1,
            "scale": 1,
            // Triggered functions
            "animate": PlayMarioJas.PlayMarioJas.prototype.animateEmerge,
            "onMake": PlayMarioJas.PlayMarioJas.prototype.thingProcess,
            "death": PlayMarioJas.PlayMarioJas.prototype.killNormal,
            "collide": undefined,
            "movement": undefined
        },
        "character": {
            "groupType": "Character",
            "character": true,
            "lookleft": true,
            "moveleft": true,
            "firedeath": true,
            "movement": PlayMarioJas.PlayMarioJas.prototype.moveSimple
        },
        "Player": {
            "player": true,
            "canjump": true,
            "nofire": true,
            "nokillend": true,
            "checkOverlaps": true,
            "power": 1,
            "numballs": 0,
            "moveleft": 0,
            "skidding": 0,
            "star": 0,
            "dieing": 0,
            "nofall": 0,
            "maxvel": 0,
            "paddling": 0,
            "jumpers": 0,
            "landing": 0,
            "tolx": PlayMarioJas.PlayMarioJas.unitsize * 2,
            "toly": 0,
            "walkspeed": PlayMarioJas.PlayMarioJas.unitsize / 2,
            "maxspeed": PlayMarioJas.PlayMarioJas.unitsize * 1.35, // Really only used for timed animations
            "maxspeedsave": PlayMarioJas.PlayMarioJas.unitsize * 1.35,
            "scrollspeed": PlayMarioJas.PlayMarioJas.unitsize * 1.75,
            "running": '', // Evaluates to false for cycle checker
            "fire": PlayMarioJas.PlayMarioJas.prototype.animatePlayerFire,
            "movement": PlayMarioJas.PlayMarioJas.prototype.movePlayer,
            "death": PlayMarioJas.PlayMarioJas.prototype.killPlayer,
            "onResting": PlayMarioJas.PlayMarioJas.prototype.animatePlayerLanding,
            "onRestingOff": PlayMarioJas.PlayMarioJas.prototype.animatePlayerRestingOff,
            "type": "character",
            "name": "player normal small still",
            "getKeys": function () {
                return {
                    "run": 0,
                    "crouch": 0,
                    "jump": 0,
                    "jumplev": 0,
                    "sprint": 0
                };
            }
        },
        "enemy": {
            "type": "enemy",
            "speed": PlayMarioJas.PlayMarioJas.unitsize * .21,
            "collide": PlayMarioJas.PlayMarioJas.prototype.collideEnemy,
            "death": PlayMarioJas.PlayMarioJas.prototype.killFlip
        },
        "Goomba": {
            "scoreFire": 100,
            "scoreStar": 100,
            "spawnType": "DeadGoomba",
            "toly": PlayMarioJas.PlayMarioJas.unitsize,
            "death": PlayMarioJas.PlayMarioJas.prototype.killGoomba,
            "spriteCycleSynched": [
                [PlayMarioJas.PlayMarioJas.prototype.unflipHoriz, PlayMarioJas.PlayMarioJas.prototype.flipHoriz]
            ]
        },
        "Koopa": {
            "height": 12,
            "shellspawn": true,
            "spawnType": "Shell",
            "shelltype": "Shell",
            "toly": PlayMarioJas.PlayMarioJas.unitsize * 2,
            "death": PlayMarioJas.PlayMarioJas.prototype.killKoopa,
            "spriteCycle": [
                ["one", "two"]
            ],
            "attributes": {
                "smart": {
                    "movement": PlayMarioJas.PlayMarioJas.prototype.moveSmart,
                    "spawnSettings": {
                        "smart": true
                    }
                },
                "jumping": {
                    "movement": PlayMarioJas.PlayMarioJas.prototype.moveJumping,
                    "jumpheight": PlayMarioJas.PlayMarioJas.unitsize * 1.17,
                    "gravity": PlayMarioJas.PlayMarioJas.gravity / 2.8,
                    "scoreStomp": 400
                },
                "floating": {
                    "onThingAdded": PlayMarioJas.PlayMarioJas.prototype.spawnMoveFloating,
                    "movement": PlayMarioJas.PlayMarioJas.prototype.moveFloating,
                    "nofall": true,
                    "yvel": PlayMarioJas.PlayMarioJas.unitsize / 8,
                    "maxvel": PlayMarioJas.PlayMarioJas.unitsize / 4,
                    "scoreStomp": 400
                }
            }
        },
        "Beetle": {
            "speed": PlayMarioJas.PlayMarioJas.unitsize * .21,
            "xvel": PlayMarioJas.PlayMarioJas.unitsize * .21,
            "height": 8,
            "nofire": 2,
            "shellspawn": true,
            "movement": PlayMarioJas.PlayMarioJas.prototype.moveSmart,
            "death": PlayMarioJas.PlayMarioJas.prototype.killToShell,
            "spawnType": "BeetleShell",
            "shelltype": "BeetleShell",
            "spriteCycle": [
                ["one", "two"]
            ],
        },
        "Piranha": {
            "height": 12,
            "toly": PlayMarioJas.PlayMarioJas.unitsize * 8,
            "countermax": 49,
            // nofall": true,
            "deadly": true,
            // nocollidesolid": true,
            "grounded": true,
            "death": PlayMarioJas.PlayMarioJas.prototype.killNormal,
            "movement": PlayMarioJas.PlayMarioJas.prototype.movePiranha,
            "onThingAdded": PlayMarioJas.PlayMarioJas.prototype.spawnPiranha,
            "spriteCycleSynched": [
                ["one", "two"]
            ]
        },
        "Blooper": {
            "height": 12,
            "nofall": true,
            "nocollidesolid": true,
            "speed": PlayMarioJas.PlayMarioJas.unitsize / 2,
            "onThingAdded": PlayMarioJas.PlayMarioJas.prototype.spawnBlooper,
            "movement": PlayMarioJas.PlayMarioJas.prototype.moveBlooper,
            "death": PlayMarioJas.PlayMarioJas.prototype.killFlip
        },
        "CheepCheep": {
            "nofall": true,
            "nocollidesolid": true,
            "nocollidechar": true,
            "movement": PlayMarioJas.PlayMarioJas.prototype.moveCheepCheep,
            "xvel": PlayMarioJas.PlayMarioJas.unitsize / -6,
            "yvel": PlayMarioJas.PlayMarioJas.unitsize / -32,
            "death": PlayMarioJas.PlayMarioJas.prototype.killFlip,
            "spriteCycleSynched": [
                ["one", "two"]
            ],
            "attributes": {
                "red": {
                    "xvel": PlayMarioJas.PlayMarioJas.unitsize / -4,
                    "yvel": PlayMarioJas.PlayMarioJas.unitsize / -24
                },
                "flying": {
                    "movement": PlayMarioJas.PlayMarioJas.prototype.moveCheepCheepFlying,
                    "gravity": PlayMarioJas.PlayMarioJas.gravity / 3.5
                }
            }
        },
        "Podoboo": {
            "width": 7,
            "speed": PlayMarioJas.PlayMarioJas.unitsize * 1.75,
            "gravity": PlayMarioJas.PlayMarioJas.unitsize / 24,
            "jumpHeight": 28,
            "frequency": 245,
            "deadly": true,
            "nofall": true,
            "nofire": true,
            "nocollidechar": true,
            "nocollidesolid": true,
            "grounded": true,
            "movement": undefined,
            "onThingAdded": PlayMarioJas.PlayMarioJas.prototype.spawnPodoboo
        },
        "BulletBill": {
            "height": 7,
            "nofall": true,
            "nofire": true,
            "nocollidechar": true,
            "nocollidesolid": true,
            "grounded": true,
            "movement": undefined,
            "xvel": PlayMarioJas.PlayMarioJas.unitsize / 2,
        },
        "Lakitu": {
            "height": 12,
            "nofall": true,
            "noshiftx": true,
            "nocollidesolid": true,
            "grounded": true,
            "death": PlayMarioJas.PlayMarioJas.prototype.killLakitu,
            "onThingAdded": PlayMarioJas.PlayMarioJas.prototype.spawnLakitu,
            "movement": PlayMarioJas.PlayMarioJas.prototype.moveLakituInitial
        },
        "SpinyEgg": {
            "width": 7,
            "deadly": true,
            "movement": undefined,
            "onResting": PlayMarioJas.PlayMarioJas.prototype.animateSpinyEggHatching,
            "spawnType": "Spiny",
            "spriteCycleSynched": [
                ["one", "two"]
            ]
        },
        "Spiny": {
            "deadly": true,
            "moveleft": true,
            "spriteCycle": [
                ["one", "two"]
            ]
        },
        "HammerBro": {
            "height": 12,
            "onThingAdded": PlayMarioJas.PlayMarioJas.prototype.spawnHammerBro,
            "movement": PlayMarioJas.PlayMarioJas.prototype.moveHammerBro,
            "spriteCycle": [
                ["one", "two"]
            ]
        },
        "Bowser": {
            "width": 16,
            "height": 16,
            "speed": PlayMarioJas.PlayMarioJas.unitsize * .14,
            "gravity": PlayMarioJas.PlayMarioJas.gravity / 2.8,
            "jumpTimes": [117],
            "fireTimes": [280, 350, 490],
            "throwAmount": 7,
            "throwDelay": 84,
            "throwPeriod": 210,
            "throwBetween": 11,
            "deadly": true,
            "noflip": true,
            "nofiredeath": true,
            "nokillend": true,
            "outerok": true,
            "spawnType": "Goomba",
            "movement": PlayMarioJas.PlayMarioJas.prototype.moveBowser,
            "killonend": PlayMarioJas.PlayMarioJas.prototype.animateBowserFreeze,
            "death": PlayMarioJas.PlayMarioJas.prototype.killBowser,
            "onThingAdded": PlayMarioJas.PlayMarioJas.prototype.spawnBowser,
            "spriteCycle": [
                ["one", "two"]
            ]
        },
        "Hammer": {
            "movement": undefined,
            "nocollidesolid": true,
            "nocollidechar": true,
            "deadly": true,
            "nofire": true,
            "spriteCycle": [
                ["one", "two", "three", "four"],
                3
            ]
        },
        "BowserFire": {
            "width": 12,
            "height": 4,
            "nocollidesolid": true,
            "nocollidechar": true,
            "nofall": true,
            "deadly": true,
            "nofire": true,
            "movement": PlayMarioJas.PlayMarioJas.prototype.moveBowserFire,
            "xvel": PlayMarioJas.PlayMarioJas.unitsize * -.63,
            "spriteCycle": [
                [
                    PlayMarioJas.PlayMarioJas.prototype.flipVert,
                    PlayMarioJas.PlayMarioJas.prototype.unflipVert
                ]
            ]
        },
        "item": {
            "collide": PlayMarioJas.PlayMarioJas.prototype.collideFriendly,
            "onCollideUp": PlayMarioJas.PlayMarioJas.prototype.collideUpItem,
            "jump": PlayMarioJas.PlayMarioJas.prototype.itemJump,
            "item": true,
            "nofire": true
        },
        "Mushroom": {
            "action": PlayMarioJas.PlayMarioJas.prototype.playerShroom,
            "speed": PlayMarioJas.PlayMarioJas.unitsize * .42
        },
        "Mushroom1Up": {
            "action": PlayMarioJas.PlayMarioJas.prototype.playerShroom1Up
        },
        "MushroomDeathly": {
            "action": PlayMarioJas.PlayMarioJas.prototype.killPlayer
        },
        "FireFlower": {
            "action": PlayMarioJas.PlayMarioJas.prototype.playerShroom,
            "spriteCycle": [
                ["one", "two", "three", "four"]
            ]
        },
        "Fireball": {
            "width": 4,
            "height": 4,
            "nofire": true,
            "nostar": true,
            "collidePrimary": true,
            "grounded": true,
            "animate": PlayMarioJas.PlayMarioJas.prototype.animateFireballEmerge,
            "collide": PlayMarioJas.PlayMarioJas.prototype.collideFireball,
            "death": PlayMarioJas.PlayMarioJas.prototype.animateFireballExplode,
            "spriteCycleSynched": [
                ["one", "two", "three", "four"], "spinning", 4
            ]
        },
        "CastleFireball": {
            "deadly": true,
            "nocollidesolid": true,
            "nocollidechar": true,
            "nofall": true,
            "outerok": true,
            "collide": PlayMarioJas.PlayMarioJas.prototype.collideCastleFireball
        },
        "Firework": {
            "nocollide": true,
            "nofall": true,
            "animate": PlayMarioJas.PlayMarioJas.prototype.animateFirework
        },
        "Star": {
            "name": "star item", // Item class so player's star isn't confused with this
            "width": 7,
            "grounded": true,
            "speed": PlayMarioJas.PlayMarioJas.unitsize * .56,
            "action": PlayMarioJas.PlayMarioJas.prototype.collideStar,
            "movement": PlayMarioJas.PlayMarioJas.prototype.moveJumping,
            "jumpheight": PlayMarioJas.PlayMarioJas.unitsize * 1.17,
            "gravity": PlayMarioJas.PlayMarioJas.gravity / 2.8,
            "spriteCycle": [
                ["one", "two", "three", "four"], 0, 7
            ]
        },
        "Shell": {
            "height": 7,
            "speed": PlayMarioJas.PlayMarioJas.unitsize * 2,
            "collidePrimary": true,
            "nofire": false,
            "moveleft": 0,
            "xvel": 0,
            "move": 0,
            "shell": true,
            "hitcount": 0,
            "peeking": 0,
            "counting": 0,
            "landing": 0,
            "enemyhitcount": 0,
            "movement": PlayMarioJas.PlayMarioJas.prototype.moveShell,
            "collide": PlayMarioJas.PlayMarioJas.prototype.collideShell,
            "death": PlayMarioJas.PlayMarioJas.prototype.killFlip,
            "spawnType": "Koopa",
            "attributes": {
                "smart": {}
            }
        },
        "BeetleShell": {
            "height": 8,
            "nofire": 2,
            "spawnType": "Beetle"
        },
        "Vine": {
            "width": 7,
            "nofall": true,
            "nocollide": true,
            "nocollidesolid": true,
            "grounded": true,
            "speed": PlayMarioJas.PlayMarioJas.unitsize / 4,
            "movement": PlayMarioJas.PlayMarioJas.prototype.moveVine,
            "collide": PlayMarioJas.PlayMarioJas.prototype.collideVine,
            "animate": PlayMarioJas.PlayMarioJas.prototype.animateEmergeVine
        },
        "BrickShard": {
            "width": 4,
            "height": 4,
            "nocollide": true,
            "grounded": true,
            "movement": undefined,
            "spriteCycle": [
                [PlayMarioJas.PlayMarioJas.prototype.unflipHoriz, PlayMarioJas.PlayMarioJas.prototype.flipHoriz]
            ]
        },
        "Bubble": {
            "width": 2,
            "height": 2,
            "nocollide": true,
            "nofall": true,
            "movement": PlayMarioJas.PlayMarioJas.prototype.moveBubble,
            "yvel": PlayMarioJas.PlayMarioJas.unitsize / -4
        },
        "Coin": {
            "width": 5,
            "spritewidth": 5,
            "height": 7,
            "nofall": true,
            "nocollidechar": true,
            "nocollidesolid": true,
            "allowUpSolids": true,
            "animate": PlayMarioJas.PlayMarioJas.prototype.animateEmergeCoin,
            "onCollideUp": PlayMarioJas.PlayMarioJas.prototype.collideUpCoin,
            "collide": PlayMarioJas.PlayMarioJas.prototype.collideCoin,
            "spriteCycleSynched": [
                ["one", "two", "three", "two", "one"]
            ]
        },
        "solid": {
            "type": "solid",
            "groupType": "Solid",
            "spritewidth": 8,
            "spriteheight": 8,
            "repeat": true,
            "solid": true,
            "nocollidesolid": true,
            "firedeath": 0,
            "nofire": 2,
            "collide": PlayMarioJas.PlayMarioJas.prototype.collideCharacterSolid,
        },
        "Brick": {
            "breakable": true,
            "bottomBump": PlayMarioJas.PlayMarioJas.prototype.collideBottomBrick
        },
        "Block": {
            "unused": true,
            "contents": "Coin",
            "bottomBump": PlayMarioJas.PlayMarioJas.prototype.collideBottomBlock,
            "spriteCycleSynched": [
                ["one", "two", "three", "two", "one"]
            ]
        },
        "BridgeBase": {
            "height": 4,
            "spritewidth": 4,
        },
        "DeadGoomba": {
            "height": 4,
            "nocollide": true,
            "onThingAdded": PlayMarioJas.PlayMarioJas.prototype.spawnDeadGoomba
        },
        "Pipe": {
            "width": 16,
            "spritewidth": 16,
            "actionTop": PlayMarioJas.PlayMarioJas.prototype.mapExitPipeVertical
        },
        "PipeHorizontal": {
            "height": 16,
            "spriteheight": 16,
            "width": 19.5,
            "spritewidth": 19.5,
            "actionLeft": PlayMarioJas.PlayMarioJas.prototype.mapExitPipeHorizontal,
            "attributes": {
                "width": 8,
                "spritewidth": 8
            }
        },
        "PipeVertical": {
            "position": "beginning",
            "width": 16,
            "spritewidth": 16
        },
        "Platform": {
            "height": 4,
            "spritewidth": 4,
            "fallThresholdStart": PlayMarioJas.PlayMarioJas.unitsize * 2.8,
            "fallThresholdEnd": PlayMarioJas.PlayMarioJas.unitsize * 2,
            "acceleration": PlayMarioJas.PlayMarioJas.unitsize / 16,
            "repeat": true,
            "killonend": false,
            "maxvel": PlayMarioJas.PlayMarioJas.unitsize / 4 * 1.5,
            "attributes": {
                "floating": {
                    "onThingAdded": PlayMarioJas.PlayMarioJas.prototype.spawnMoveFloating,
                    "movement": PlayMarioJas.PlayMarioJas.prototype.moveFloating,
                    "yvel": PlayMarioJas.PlayMarioJas.unitsize / 4 * 1.5
                },
                "sliding": {
                    "onThingAdded": PlayMarioJas.PlayMarioJas.prototype.spawnMoveSliding,
                    "movement": PlayMarioJas.PlayMarioJas.prototype.moveSliding,
                    "xvel": PlayMarioJas.PlayMarioJas.unitsize / 4 * 1.5
                },
                "transport": {
                    "movement": undefined,
                    "collide": PlayMarioJas.PlayMarioJas.prototype.collideTransport
                },
                "falling": {
                    "movement": PlayMarioJas.PlayMarioJas.prototype.moveFalling
                },
                "inScale": {
                    "movement": PlayMarioJas.PlayMarioJas.prototype.movePlatformScale
                }
            }
        },
        "RestingStone": {
            "opacity": 0.01, // Why is opacity set to 1 when added?
            "onRestedUpon": PlayMarioJas.PlayMarioJas.prototype.activateRestingStone
        },
        "Cannon": {
            "frequency": 280,
            "spriteheight": 8,
            "onThingAdded": PlayMarioJas.PlayMarioJas.prototype.spawnCannon
        },
        "Springboard": {
            "height": 14.5,
            "heightNormal": 14.5,
            "spriteheight": 10,
            "collide": PlayMarioJas.PlayMarioJas.prototype.collideSpringboard
        },
        "CastleAxe": {
            "collide": PlayMarioJas.PlayMarioJas.prototype.collideCastleAxe
        },
        "CastleBlock": {
            "onThingAdded": PlayMarioJas.PlayMarioJas.prototype.spawnCastleBlock,
            "attributes": {
                "fireballs": {
                    "speed": 1
                }
            }
        },
        "CastleBridge": {
            "height": 8,
            "spriteheight": 8,
            "spritewidth": 4,
            "killonend": PlayMarioJas.PlayMarioJas.prototype.animateCastleBridgeOpen
        },
        "CastleChain": {
            "width": 7.5,
            "spritewidth": 7.5,
            "height": 8,
            "nocollide": true,
            "killonend": PlayMarioJas.PlayMarioJas.prototype.animateCastleChainOpen
        },
        "Floor": {
            "nofire": true // for the "Super Fireballs" mod
        },
        "WaterBlocker": {
            "hidden": true,
            "collide": PlayMarioJas.PlayMarioJas.prototype.collideWaterBlocker
        },
        "detector": {
            "hidden": true,
            "collideHidden": true
        },
        "DetectCollision": {
            "collide": PlayMarioJas.PlayMarioJas.prototype.collideDetector
        },
        "ScrollEnabler": {
            "activate": PlayMarioJas.PlayMarioJas.prototype.activateScrollEnabler
        },
        "DetectWindow": {
            "movement": PlayMarioJas.PlayMarioJas.prototype.activateWindowDetector
        },
        "RandomSpawner": {
            "activate": PlayMarioJas.PlayMarioJas.prototype.spawnRandomSpawner
        },
        "ScrollBlocker": {
            "onThingAdded": PlayMarioJas.PlayMarioJas.prototype.spawnScrollBlocker,
            "activate": PlayMarioJas.PlayMarioJas.prototype.activateScrollBlocker
        },
        "DetectSpawn": {
            "movement": PlayMarioJas.PlayMarioJas.prototype.spawnDetector
        },
        "scenery": {
            "groupType": "Scenery",
            "repeat": true,
            "nocollide": true, // for when placed in Solid group
            "noBoundaryStretch": true
        },
        "BrickHalf": [8, 4],
        "BrickPlain": [8, 8],
        "Bush1": [16, 8],
        "Bush2": [24, 8],
        "Bush3": [32, 8],
        "CastleDoor": [8, 20],
        "CastleFlag": [6.5, 10],
        "CastleRailing": [8, 4],
        "CastleRailingFilled": [8, 4],
        "CastleTop": [12, 12],
        "CastleWall": [8, 48],
        "Cloud1": [16, 12],
        "Cloud2": [24, 12],
        "Cloud3": [32, 12],
        "Flag": [8, 8],
        "FlagPole": [1, 72],
        "FlagTop": [4, 4],
        "Fence": [8, 8],
        "HillSmall": [24, 9.5],
        "HillLarge": [40, 17.5],
        "Peach": [8, 13],
        "PlatformString": [1, 1],
        "PlantSmall": [7, 15],
        "PlantLarge": [8, 23],
        "Railing": [4, 4],
        "ShroomTrunk": [8, 8],
        "String": [1, 1],
        "StringCornerLeft": [5, 5],
        "StringCornerRight": [5, 5],
        "Toad": [8, 13],
        "TreeTrunk": [4, 4],
        "Water": {
            "width": 4,
            "height": 5
        },
        "Text": {
            "width": 3.5,
            "height": 3.5,
            "groupType": "Text",
            "size": ""
        },
        "DecorativeBack": {
            "width": 88,
            "height": 44,
            "spritewidth": .5,
            "spriteheight": .5,
        },
        "DecorativeDot": {
            "width": 1.5,
            "height": 1.5
        },
        "TextSpace": {
            "hidden": true
        },
        "TextColored1": [3, 3.5],
        "TextColoredSpace": {
            "hidden": true
        },
        "TextColoredCopyright": [4, 4],
        "TextLarge": {
            "width": 7.5,
            "height": 14,
            "size": "Large"
        },
        "TextHuge": {
            "width": 7.5,
            "height": 22
        },
        "TextHugeI": {
            "width": 3.5
        },
        "TextHugeM": {
            "width": 11.5
        },
        "TextHugeSpace": {
            "width": 3.5,
            "hidden": true
        },
        "TextHugePeriod": {
            "width": 3.5
        },
        "ScoreText": {
            "groupType": "Text",
        },
        "TextCharacters": [2.5, 4],
        "TextCharagersHuge": [1, 1],
        "Text100": [6, 4],
        "Text200": [6, 4],
        "Text400": [6, 4],
        "Text500": [6, 4],
        "Text800": [6, 4],
        "Text1000": [8, 4],
        "Text2000": [8, 4],
        "Text4000": [8, 4],
        "Text5000": [8, 4],
        "Text8000": [8, 4],
        "Text1Up": [8, 4],
        "CustomText": {
            "hidden": true,
            "spacingHorizontal": .5,
            "spacingVertical": 8,
            "spacingVerticalBlank": 6,
            "onThingAdded": PlayMarioJas.PlayMarioJas.prototype.spawnCustomText
        }
    }
};
PlayMarioJas.PlayMarioJas.settings.quadrants = {
    "numRows": 5,
    "numCols": 6,
    "tolerance": PlayMarioJas.PlayMarioJas.unitsize / 2,
    "groupNames": ["Solid", "Character", "Scenery", "Text"],
    "keyGroupName": "groupType"
};
PlayMarioJas.PlayMarioJas.settings.renderer = {
    "groupNames": ["Text", "Character", "Solid", "Scenery"],
    "spriteCacheCutoff": 2048
};
PlayMarioJas.PlayMarioJas.settings.runner = {
    "games": [
        function () {
            this.DeviceLayer.checkNavigatorGamepads();
            this.DeviceLayer.activateAllGamepadTriggers();
        },
        function () {
            this.QuadsKeeper.determineAllQuadrants("Scenery", this.GroupHolder.getSceneryGroup());
            this.QuadsKeeper.determineAllQuadrants("Text", this.GroupHolder.getTextGroup());
        },
        function () {
            this.maintainSolids(this, this.GroupHolder.getSolidGroup());
        },
        function () {
            this.maintainCharacters(this, this.GroupHolder.getCharacterGroup());
        },
        function () {
            this.maintainPlayer(this, this.player);
        },
        function () {
            this.TimeHandler.handleEvents();
        },
        function () {
            this.PixelDrawer.refillGlobalCanvas(this.AreaSpawner.getArea().background);
        }
    ]
};
PlayMarioJas.PlayMarioJas.settings.scenes = {
    "cutscenes": {
		"Flagpole": {
			"firstRoutine": "StartSlidingDown",
			"routines": {
				"StartSlidingDown": PlayMarioJas.PlayMarioJas.prototype.cutsceneFlagpoleStartSlidingDown,
				"HitBottom": PlayMarioJas.PlayMarioJas.prototype.cutsceneFlagpoleHitBottom ,
				"Countdown": PlayMarioJas.PlayMarioJas.prototype.cutsceneFlagpoleCountdown,
				"Fireworks": PlayMarioJas.PlayMarioJas.prototype.cutsceneFlagpoleFireworks
			}
		},
		"BowserVictory": {
		    "firstRoutine": "CollideCastleAxe",
		    "routines": {
		        "CollideCastleAxe": PlayMarioJas.PlayMarioJas.prototype.cutsceneBowserVictoryCollideCastleAxe,
		        "CastleBridgeOpen": PlayMarioJas.PlayMarioJas.prototype.cutsceneBowserVictoryCastleBridgeOpen,
		        "BowserFalls": PlayMarioJas.PlayMarioJas.prototype.cutsceneBowserVictoryBowserFalls,
		        "Dialog": PlayMarioJas.PlayMarioJas.prototype.cutsceneBowserVictoryDialog
		    }
		}
	}
};
PlayMarioJas.PlayMarioJas.settings.sprites={spriteWidth:"spritewidthpixels",spriteHeight:"spriteheightpixels",flipVert:"flip-vert",flipHoriz:"flipped",paletteDefault:[[0,0,0,0],[255,255,255,255],[0,0,0,255],[188,188,188,255],[116,116,116,255],[252,216,168,255],[252,152,56,255],[252,116,180,255],[216,40,0,255],[200,76,12,255],[136,112,0,255],[124,7,0,255],[168,250,188,255],[128,208,16,255],[0,168,0,255],[24,60,92,255],[0,128,136,255],[32,56,236,255],[156,252,240,255],[60,188,252,255],[92,148,252,255],[0,130,0,255],[252,188,176,255]],filters:{Underworld:["palette",{"05":"18","09":"16"}],UnderworldKoopa:["palette",{"06":"09",14:"16"}],Castle:["palette",{"02":"04","05":"01","09":"03"}],Alt:["palette",{11:"01"}],Alt2:["palette",{"02":"04","05":"01","09":"03",13:"01",19:"08"}],StarOne:["palette",{}],StarTwo:["palette",{"06":"02","08":"05",10:"09"}],StarThree:["palette",{"06":"01","08":"06",10:"08"}],StarFour:["palette",{"06":"01","08":"06",10:"14"}],Smart:["palette",{14:"08"}]},library:{Character:{Beetle:{normal:{normal:"p[0,2,5,8]x022,1111x010,x18,x07,x110,x05,x17,33111000x18,32311000x19,3311003333x111,001133x110,001113x110,011213x110,011113x110,011113x110,0011233x15,x35,00222331133322200222203333002222",two:"p[0,2,5,8]x07,111x010,x18,x07,x110,x05,x17,33111000x18,32311000x19,3311003333x111,001133x110,001113x110,011213x110,011113x110,011113x110,0011233x15,x35,00022331133322x05,22233330222x06,22x05,22000"},Underworld:{normal:"p[0,15,16,18]x022,1111x010,x18,x07,x110,x05,x17,22111000x18,23211000x19,2211002222x111,001122x110,001112x110,011312x110,011112x110,011112x110,0011322x15,x25,00333221122233300333302222003333",two:"p[0,15,16,18]x07,111x010,x18,x07,x110,x05,x17,22111000x18,23211000x19,2211002222x111,001122x110,001112x110,011312x110,011112x110,011112x110,0011322x15,x25,00033221122233x05,33322220333x06,33x05,33000"},Castle:{normal:"p[0,1,3,4]x022,3333x010,x38,x07,x310,x05,x37,22333000x38,21233000x39,2233002222x311,003322x310,003332x310,033132x310,033332x310,033332x310,0033122x35,x25,00111223322211100111102222001111",two:"p[0,1,3,4]x07,333x010,x38,x07,x310,x05,x37,22333000x38,21233000x39,2233002222x311,003322x310,003332x310,033132x310,033332x310,033332x310,0033122x35,x25,00011223322211x05,11122220111x06,11x05,11000"}},BeetleShell:{normal:"p[0,2,5,8]x06,1111x010,x18,x07,1111331111x05,1111322311110000x15,33x15,0000x112,000x114,00x114,00x114,00x114,00x114,00x114,00x114,0x35,x16,x35,000033311333x010,3333x06,",Underworld:"p[0,15,16,18]x06,1111x010,x18,x07,1111221111x05,1111233211110000x15,22x15,0000x112,000x114,00x114,00x114,00x114,00x114,00x114,00x114,0x25,x16,x25,000022211222x010,2222x06,",Castle:"p[0,1,3,4]x06,3333x010,x38,x07,3333223333x05,3333211233330000x35,22x35,0000x312,000x314,00x314,00x314,00x314,00x314,00x314,0x25,x36,x25,000022233222x010,2222x06,"},Blooper:{normal:{normal:"p[0,2,5,9]x06,2332x011,232232x09,23222232x07,2232222322x05,223x26,3220002223x26,322202223x28,32220003x28,3x06,x210,x06,2x18,2x06,1221111221x06,2112112112x06,2112112112x05,212211112212000022332222332200003x210,30000220x26,022000032032002302300002202200220220000320320023023x05,2022002202x06,2032002302x06,2002002002x09,2002x06,",squeeze:"p[0,2,5,9]x06,2332x011,232232x09,23222232x07,2232222322x05,223x26,3220002223x26,322202223x28,32220003x28,3x06,2x18,200003x25,11x25,30x216,32223x26,322232222022002202222032203200230223000222020020222x05,2202002022000"},Underwater:{normal:"p[0,1,2,3]x06,1331x011,131131x09,13111131x07,1131111311x05,113x16,3110001113x16,311101113x18,31110003x18,3x06,x110,x06,1x28,1x06,2112222112x06,1221221221x06,1221221221x05,121122221121000011331111331100003x110,30000110x16,011000031031001301300001101100110110000310310013013x05,1011001101x06,1031001301x06,1001001001x09,1001x06,",squeeze:"p[0,1,2,3]x06,1331x011,131131x09,13111131x07,1131111311x05,113x16,3110001113x16,311101113x18,31110003x18,3x06,1x28,100003x15,22x15,30x116,31113x16,311131111011001101111031103100130113000111010010111x05,1101001011000"}},Bowser:{normal:{normal:"p[0,1,6,14]x012,111x025,331112x025,3331122x023,113333223x019,200311x37,x018,2023311x38,x017,2221113332x35,x017,222213332223333x017,122233221323333113331x012,1022223332333311331123x010,10113133123333113111223111x09,10003223331113312233112x013,12233111x39,2231x011,2233111x313,1x09,122233111x36,111x35,x010,220033x16,33112333111x015,33222113322333112x011,222001022211x37,22x010,2210222012231x39,1x09,220022220033133311133321x08,210x26,1331133112333x010,200x25,333311333223311x010,10x25,333311x37,111x011,12220x35,1333311322x017,x35,1133323323x018,x35,111x36,x019,x35,11113333x019,2x36,x17,x017,1122332222x15,x016,111x210,11x021,1122112222x021,1112111x25,0",two:"p[0,1,6,14]x012,111x025,331112x025,3331122x023,113333223x019,200311x37,x018,2023311x38,x017,2221113332x35,x017,222213332223333x017,122233221323333113331x012,1022223332333311331123x010,10113133123333113111223111x09,10003223331113312233112x013,12233111x39,2231x011,2233111x313,1x09,122233111x36,111x35,x010,220033x16,33112333111x015,33222113322333112x011,222001022211x37,22x010,2210222012231x39,1x09,220022220033133311133321x08,210x26,1331133112333x010,200x25,333311333223311x010,10x25,333311x37,111x011,12220x35,1333311322x017,x35,1133323323x018,x35,11x37,x019,x35,11113333x020,x36,x17,x019,22332222x15,x018,2222112211211x018,112211121112222x016,111x27,x06,"},firing:{normal:"p[0,1,6,14]x012,111x025,331112x025,3331122x023,113333223x019,200311x37,x018,2023311x38,x017,2221113332x35,x017,222213332223333x017,112233221323333113331x012,1022223322333311331123x010,101030322x35,113111223111x06,x29,33331113312233112x07,x27,3333111x39,2231x07,x38,111x313,1x010,x35,111x36,111x35,x014,33x16,33112333111x015,33222113322333112x011,222001022211x37,22x010,2210222012231x39,1x09,220022220033133311133321x08,210x26,1331133112333x010,200x25,333311333223311x010,10x25,333311x37,111x011,12220x35,1333311322x017,x35,1133323323x018,x35,111x36,x019,x35,11113333x019,2x36,x17,x017,1122332222x15,x016,111x210,11x021,1122112222x021,1112111x25,0",two:"p[0,1,6,14]x012,111x025,331112x025,3331122x023,113333223x019,200311x37,x018,2023311x38,x017,2221113332x35,x017,222213332223333x017,112233221323333113331x012,1022223322333311331123x010,101030322x35,113111223111x06,x29,33331113312233112x07,x27,3333111x39,2231x07,x38,111x313,1x010,x35,111x36,111x35,x014,33x16,33112333111x015,33222113322333112x011,222001022211x37,22x010,2210222012231x39,1x09,220022220033133311133321x08,210x26,1331133112333x010,200x25,333311333223311x010,10x25,333311x37,111x011,12220x35,1333311322x017,x35,1133323323x018,x35,11x37,x019,x35,11113333x020,x36,x17,x019,22332222x15,x018,2222112211211x018,112211121112222x016,111x27,x06,"}},BowserFire:"p[0,1,6,8]x010,x36,003x010,x316,x06,x35,22332222332222x315,x25,111133x05,3333x213,13000x313,2223333x05,x39,0x36,x09,3300333033003x06,",BrickShard:{normal:"p[0,2,9]0021200002221200212121202212221222212221022212220021212000022200",Underworld:["filter",["Character","BrickShard","normal"],"Underworld"],Castle:["filter",["Character","BrickShard","normal"],"Castle"]},BulletBill:{normal:"p[0,2,5,8]110x17,x06,2201x25,1110000113x16,2111000112x19,2100113x19,22101131133x15,2121113132212111121111313x26,x17,3111x25,x17,31111222x15,0113x111,00113x110,000110x19,0000110x17,x06,",Alt2:["filter",["Character","BulletBill","normal"],"Alt2"]},Bubble:"p[0,1]0110100110010110",CastleFireball:["same",["Character","Fireball"]],CheepCheep:{normal:{normal:"p[0,1,3,6]0003333x013,x35,011x07,x26,11110000121122221111000x16,222111100012121122x15,0001212112211110000x16,221112x05,1211x27,0000333x210,0000233x29,00300233x28,3330023311x26,333033331112222333000x18,20333x05,x15,0000300",two:"p[0,1,3,6]0003333x013,x35,x010,x26,3x07,1211x25,x06,x16,x25,111001212112222x15,0121211222x16,0x16,22x16,0001211222x16,00333x210,0300233x29,33000233x28,3300023311x26,300033331112222330000x18,203x07,x15,x07,"},red:{normal:"p[0,1,6,8]0002222x013,x25,x010,x36,2x07,1311x35,x06,x16,x35,111001313113333x15,0131311333x16,0x16,33x16,0001311333x16,00222x310,0200322x39,22000322x38,2200032211x36,200022221113333220000x18,302x07,x15,x07,",two:"p[0,1,6,8]0002222x013,x25,011x07,x36,11110000131133331111000x16,333111100013131133x15,0001313113311110000x16,331113x05,1311x37,0000222x310,0000322x39,00200322x38,2220032211x36,222022221113333222000x18,30222x05,x15,0000200"},flying:["same",["Character","CheepCheep","red"]]},Coin:{normal:{normal:{normal:"p[0,2,6,8]00222211000x26,11002233221102232212211223221221122322122112232212211223221221122322122112232212211223221221102211221100x26,1100022221100",two:"p[0,2,8]00222211000x26,1100x26,110x25,12211x25,12211x25,12211x25,12211x25,12211x25,12211x25,12211x25,1221102211221100x26,1100022221100",three:"p[0,2,9,11]00333311000x36,11003322331103323313311332331331133233133113323313311332331331133233133113323313311332331331103311331100x36,1100033331100"},Underworld:{normal:"p[0,6,9,16]00111133000x16,33001122113301121131133112113113311211311331121131133112113113311211311331121131133112113113301133113300x16,3300011113300",two:"p[0,9,16]00111122000x16,2200x16,220x15,21122x15,21122x15,21122x15,21122x15,21122x15,21122x15,21122x15,2112201122112200x16,2200011112200",three:"p[0,9,11,16]00222233000x26,33002211223302212232233221223223322122322332212232233221223223322122322332212232233221223223302233223300x26,3300022223300"}},anim:{normal:"p[0,1,7]000012x08,12x07,1112x06,1112x06,1112x06,1112x06,1112x06,1112x06,1112x06,1112x06,1112x06,1112x07,12x08,120000",anim2:"p[0,1,6,7]000022x07,2222x05,x26,000022132200022122322002212232200221223220022122322002212232200221223220002213220000x26,x05,2222x07,220000",anim3:"p[0,1,6,7]000023x08,23x07,2333x06,2333x06,2333x06,2333x06,1333x06,1333x06,2333x06,2333x06,2333x06,2333x07,23x08,230000",anim4:"p[0,1,6]x05,2x09,2x09,2x09,2x09,2x09,2x09,1x09,1x09,2x09,2x09,2x09,2x09,2x09,20000"}},Fireball:{normal:"p[0,1,6,8]0303330000303330300032330033322303322123032212330332233000333300",two:"p[0,1,6,8]x05,3000333000333233030322230033212x36,2122330332233000333300",three:"p[0,1,6,8]0033330003322330332122303212233032233300332300030333030000333030",four:"p[0,1,6,8]0033330003322330332212x36,2123300322230303323330003330003x05,"},FireFlower:{normal:{normal:"p[0,1,6,8,14]0000x18,x06,x112,000111x28,111011222x36,2221111222x36,222110111x28,111000x112,x06,x18,x011,44x07,444000044000044404440004400044400444400440044440004444044044440000444404404444x05,x410,x09,4444x06,",two:"p[0,2,5,9,14]0000x28,x06,x212,000222x38,222022333x16,3332222333x16,333220222x38,222000x212,x06,x28,x011,44x07,444000044000044404440004400044400444400440044440004444044044440000444404404444x05,x410,x09,4444x06,",three:"p[0,6,8,10,14]0000x18,x06,x112,000111x38,111011333x26,3331111333x26,333110111x38,111000x112,x06,x18,x011,44x07,444000044000044404440004400044400444400440044440004444044044440000444404404444x05,x410,x09,4444x06,",four:"p[0,1,6,14]0000x18,x06,x112,000111x28,111011222x36,2221111222x36,222110111x28,111000x112,x06,x18,x011,33x07,333000033000033303330003300033300333300330033330003333033033330000333303303333x05,x310,x09,3333x06,"},Underworld:{normal:"p[0,1,6,8,16]0000x18,x06,x112,000111x28,111011222x36,2221111222x36,222110111x28,111000x112,x06,x18,x011,44x07,444000044000044404440004400044400444400440044440004444044044440000444404404444x05,x410,x09,4444x06,",two:"p[0,15,16,18]0000x38,x06,x312,000333x28,333033222x16,2223333222x16,222330333x28,333000x312,x06,x38,x011,22x07,222000022000022202220002200022200222200220022220002222022022220000222202202222x05,x210,x09,2222x06,",three:"p[0,6,8,10,16]0000x18,x06,x112,000111x38,111011333x26,3331111333x26,333110111x38,111000x112,x06,x18,x011,44x07,444000044000044404440004400044400444400440044440004444044044440000444404404444x05,x410,x09,4444x06,",four:"p[0,5,9,16]0000x18,x06,x112,000111x28,111011222x36,2221111222x36,222110111x28,111000x112,x06,x18,x011,33x07,333000033000033303330003300033300333300330033330003333033033330000333303303333x05,x310,x09,3333x06,"}},Firework:["same",["Solid","Firework"]],Goomba:{normal:"p[0,2,5,9]x06,3333x011,x36,x09,x38,x07,x310,x05,311x36,11300033321333312333003332x16,23330333321233212x38,22233222x320,03333x26,3333x05,x28,x06,11x28,x05,x15,x25,110000x16,222111x05,x15,001110000",Underworld:"p[0,15,16,18]x06,2222x011,x26,x09,x28,x07,x210,x05,211x26,11200022231222213222002223x16,32220222231322313x28,33322333x220,02222x36,2222x05,x38,x06,11x38,x05,x15,x35,110000x16,333111x05,x15,001110000",Castle:["filter",["Character","Goomba","normal"],"Castle"]},Hammer:{normal:{normal:"p[0,2,5,8]x08,2x014,12101x010,111101x09,1122232x09,1211131x08,x16,31x08,10011131x09,x15,01x012,2x015,2x015,2x015,2x015,2x015,2x015,2x015,2x07,",two:"p[0,2,5,8]x073,11x013,10111x011,101211x010,11112110x28,11112122x08,1111211x010,3333x011,1111211x065,",three:"p[0,2,5,8]x07,2x015,2x015,2x015,2x015,2x015,2x015,2x015,2x012,10x15,x09,13111001x08,13x16,x08,1311121x09,2322211x09,101111x010,10121x014,2x08,",four:"p[0,2,5,8]x065,1121111x011,3333x010,1121111x08,22121111x28,01121111x010,112101x011,11101x013,11x073,"},Castle:["filter",["Character","Hammer","normal"],"Castle"],Alt2:["filter",["Character","Hammer","normal"],"Alt2"]},HammerBro:{normal:{normal:"p[0,1,6,14]003333x011,31x35,x08,31113313x09,31133313x08,311x35,x07,221221233x07,x25,122133x05,x25,12113333x06,21231x36,00022210311133313x06,3322113231x06,3222212331x06,x25,1323130000x25,1133233000x25,1133332200x25,313333233x06,33123323330000223311223333000022233111133x05,222x35,11110000222233x26,x05,222033x25,x06,2200002222x013,222",two:"p[0,1,6,14]003333x011,31x35,x08,31113313x09,31133313x08,311x35,x07,221221233x07,x25,122133x05,x25,1211333300002221231x36,x06,10311133313x06,3322113231x06,3222212331x06,3x25,32313x05,33x25,3233x05,33312222322x06,3313333233x06,3312333233x06,3311223333x07,33111133x08,x35,1111x07,23322233x08,x27,x010,x25,x012,2222000"},throwing:{normal:"p[0,1,6,14]00003333x011,333313x09,3113331x010,31133332x07,231133322x06,x25,12322x06,x25,12222x06,x25,1122233x05,2221x25,333x07,1322223313x06,3322223231x06,33x25,331x06,33322132313x05,33311133233x05,3331x35,22x06,3313333233x06,33123323330000223311223333000022233111133x05,222x35,11110000222233x26,x05,222033x25,x06,2200002222x013,222",two:"p[0,1,6,14]00003333x011,333313x09,3113331x010,31133332x07,231133322x06,x25,12322x06,x25,12222x06,x25,1122233x05,2221x25,333x07,1322223313x06,3322223231x06,33x25,331x06,33322132313x05,33311133233x05,3331x35,22x06,3313333233x06,3312333233x06,3311223333x07,33111133x08,x35,1111x07,23322233x08,x27,x010,x25,x012,2222000"},thrown:{normal:"p[0,1,6,14]003333x011,31x35,x08,31113313x09,31133313x08,311x35,x07,221221233x07,x25,122133x05,x25,12113333x06,21231x36,00022210311133313x06,3322113231x06,3222212331x06,x25,1323130000x25,1133233000x25,1133332200x25,313333233x06,33123323330000223311223333000022233111133x05,222x35,11110000222233x26,x05,222033x25,x06,2200002222x013,222",two:"p[0,1,6,14]003333x011,31x35,x08,31113313x09,31133313x08,311x35,x07,221221233x07,x25,122133x05,x25,12113333x06,21231x36,00022210311133313x06,3322113231x06,3222212331x06,x25,1323130000x25,1133233000x25,113333220022223313333233x06,3312333233x06,3311223333x07,33111133x08,x35,1111x07,23322233x08,x27,x010,x25,x012,2222000"}},Koopa:{normal:{normal:{jumping:{normal:"p[0,1,6,14]x019,1x09,11000111x07,1111001112x05,x15,0231122000x15,0023112200112110002311220012111100211122011211110222122201211110023x25,012111010x26,0012x15,022202203312111002200220331113330220221333232333002022133233323200002212x36,23000221132x35,2300002132323332320000212333232333x05,1x35,23333x05,113332323111000221112331110000x25,x15,22200x25,x06,2222",two:"p[0,1,6,14]00001x014,111x012,2111x012,23112x010,223112x010,223112x010,2211120011100002322122011211000x27,0121111002220022012x15,022000213x17,x05,22133x17,00022133331131110222213332323311002221232333232000021132x35,2300002132323332320000212333232333x05,1x35,23333x05,113332323111000021112331112x05,222x15,222x06,2220000222x07,2220022200"},flying:{normal:"p[0,1,6,14]x019,1x09,11000111x07,1111001112x05,x15,0231122000x15,0023112200112110002311220012111100211122011211110222122201211110023x25,012111010x26,0012x15,022202203312111002200220331113330220221333232333002022133233323200002212x36,23000221132x35,2300002132323332320000212333232333x05,1x35,23333x05,113332323111000221112331110000x25,x15,22200x25,x06,2222",two:"p[0,1,6,14]00001x014,111x012,2111x012,23112x010,223112x010,223112x010,2211120011100002322122011211000x27,0121111002220022012x15,022000213x17,x05,22133x17,00022133331131110222213332323311002221232333232000021132x35,2300002132323332320000212333232333x05,1x35,23333x05,113332323111000021112331112x05,222x15,222x06,2220000222x07,2220022200"},normal:{normal:"p[0,1,6,14]x019,1x014,111x013,1112x011,231122x010,231122x010,231122x010,211122x09,2221222x09,23x25,x09,x26,00x35,0002220220323332300220022033232333022022133332311300202213332323130000221232333232000221132x35,2300002132323332320000212333232333x05,1x35,23333x05,113332323111000221112331110000x25,x15,22200x25,x06,2222",two:"p[0,1,6,14]00001x014,111x012,2111x012,23112x010,223112x010,223112x010,221112x09,2322122x09,x27,x09,22200220x35,00022000213233323x06,2213323233x05,22133332311300222213332323130002221232333232000021132x35,2300002132323332320000212333232333x05,1x35,23333x05,113332323111000021112331112x05,222x15,222x06,2220000222x07,2220022200"}}},smart:["filter",["Character","Koopa","normal","normal"],"Smart"],Underworld:{smart:["same",["Character","Koopa","smart"]],normal:["filter",["Character","Koopa","normal","normal"],"UnderworldKoopa"]},Castle:["same",["Character","Koopa","Underworld"]]},Lakitu:{normal:"p[0,1,6,14]x05,x25,x010,x27,x08,333233322x06,3111311132x06,3x17,323x05,3113131132330000311313113233x05,3332x37,x05,222333322233000x25,33x25,3003x25,11x25,30031222111122213003x112,303x114,33x15,3113x15,33x15,3113x15,33x15,3113x15,33x114,3313x110,3130311131111311130031111333311113003x112,3000311113311113x05,3333003333000",hiding:"p[0,1,6,14]x0131,2220000222x05,x25,33x25,0000x25,11x25,00003222111122230003x112,303x114,33x15,3113x15,33x15,3113x15,33x15,3113x15,33x114,3313x110,3130311131111311130031111333311113003x112,3000311113311113x05,3333003333000"},Player:{dead:"p[0,6,8,10]x05,x25,x07,11x27,1100111131311313x16,3313113133x15,33311113331100x35,113333x05,331333313x06,33x16,3x05,222211112220003332233332233003333223322333003333212212333003333x26,333000333x26,3300",normal:{normal:{jumping:"p[0,6,8,10]x013,111x06,x26,0111x05,x29,11x05,33311311333000031311131133300003133111311130000331111x36,x06,x17,33000x35,2333233000x37,2333220311x36,x26,0311112232212212330113x210,3300333x29,330333x28,x05,330x25,x07,",normal:{normal:"p[0,6,8,10]0000x26,x09,x210,x06,33331131x07,33131113111x05,331331113111000033311113333x07,x18,x07,3332333x08,333323323330000x35,2222333300011132122123110001111x26,111000111x28,11x05,222202222x06,333300033330000x35,000x35,00",hopping:["same",["Character","Player","normal","normal","normal","running","normal","two"]],running:{skidding:"p[0,6,8,10]x05,x26,x08,x28,33x07,131x37,0000x16,3113111001133113311311100033x16,3111x05,1123332222x05,3332231112220000x36,1113220000x36,112222x05,3333x26,x07,222233322x07,222x35,x09,2333223333x09,2x36,x010,x35,00",normal:{normal:"p[0,6,8,10]x05,x26,x09,x210,x06,33331131x07,33131113111x05,331331113111000033311113333x07,x18,x05,x35,2233x05,1113333222333x17,3332122233x15,0x28,0330000x210,33000x211,330033322200222233003333x013,3333x010,",two:"p[0,6,8,10]x020,x26,x09,x210,x06,33311311x07,31311131111x05,3133111311110000331111x35,x07,x18,x07,3323333x08,333322333x07,3332212211x06,3333x26,x06,2331112222x07,23112222x09,2223333x09,x38,0000",three:"p[0,6,8,10]x021,x26,x09,x210,x06,33331131x07,33131113111x05,331331113111000033311113333x07,x18,x07,x35,2311x06,11x36,11100001112x35,11x05,333x27,x06,33x28,x05,333x27,x06,330003333x012,x35,x05,"}},paddling:{normal:{normal:"p[0,6,8,10]x05,x26,x09,x210,x06,33311311x07,31311131111x05,3133111311110000331111x35,x07,x18,x07,32x35,111x06,2x36,11x06,22233332x06,33x27,x07,33x26,x08,332222x010,30033x014,3x027,",paddle1:"p[0,6,8,10]x05,x26,x09,x210,x06,33311311x07,31311131111x05,3133111311110000331111x35,x07,x18,x07,32x35,1111x05,2x36,111x05,222333322x05,33x28,x06,33x27,x07,33x25,x09,330333x013,33x026,",paddle2:"p[0,6,8,10]x05,x26,x09,x210,x06,33311311x07,31311131111x05,3133111311110000331111x35,x07,x18,x07,3233322x09,2x36,x08,222333311x05,33x25,33111000033x27,111000033x26,00110000330333x013,33x026,",paddle3:"p[0,6,8,10]x05,x26,x09,x210,x06,33311311x07,31311131111x05,3133111311110000331111x35,x07,x18,x07,3332333x08,33332333x06,1333322333x05,1113322122x07,33x27,x07,33x25,x09,330333x013,33x026,"},swim2:{normal:"p[0,6,8,10]x05,x26,x09,x210,x06,33311311x07,31311131111x05,3133111311110000331111x35,x07,x18,x07,32x35,111x06,2x36,11x06,22233332x07,3x27,x07,33x26,x010,3322x011,333x013,33x028,",paddle1:"p[0,6,8,10]x05,x26,x09,x210,x06,33311311x07,31311131111x05,3133111311110000331111x35,x07,x18,x07,32x35,1111x05,2x36,111x05,222333322x06,3x28,x06,33x27,x09,33222x010,3333x012,333x027,",paddle2:"p[0,6,8,10]x05,x26,x09,x210,x06,33311311x07,31311131111x05,3133111311110000331111x35,x07,x18,x07,3233322x09,2x36,x08,222333311x06,3x25,33111000033x27,111x06,3322220011x05,3333x012,333x027,",paddle3:"p[0,6,8,10]x05,x26,x09,x210,x06,33311311x07,31311131111x05,3133111311110000331111x35,x07,x18,x07,3332333x08,33332333x06,1333322333x05,1113322122x07,33x27,x09,332222x09,3333x012,333x027,"}},climbing:{normal:"p[0,6,8,10]0000x26,x09,x210,x06,33311311x07,31311131111x05,3133111311110000331111x35,x07,x18,x07,3323333x09,222x35,x08,222x36,11100002222x35,111100x26,3333111100x211,33300x211,330000x29,x08,x26,x06,",two:"p[0,6,8,10]x05,x26,x09,x210,x06,33311311x07,31311131111x05,3133111311110000331111x35,x07,x18,x08,22x35,111x05,22x36,1111000222x36,1111000x25,122x08,x28,00033000x210,3330000x29,333x05,x28,333x016,"}}},large:{jumping:"p[0,6,8,10]x012,111x012,11311x06,x25,113310000x27,x15,000x28,x35,000x211,33000333113111333300311311331111330031133x18,30031133111311113033x15,x37,0033331111333313000033x18,33x05,2222332333300x36,223233300x38,23323300x38,2232300033113333223320003111133222231000x15,32221222000x15,x28,0001011x29,003011x210,033000x29,33330003x28,x37,233x26,x37,222332222x37,x25,0022x37,x25,x08,3332222x09,33x014,3x015,",fiery:["same",["Character","Player","normal","fiery"]],normal:{normal:"p[0,6,8,10]x06,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000333x15,x35,x05,33x18,x07,2x15,3x09,32333323x07,3323333233x05,3332333323330003333233332333300333223333223330333322333322x38,x28,x38,2122221233331111x28,x18,x28,11110111x28,1110011x210,11000x212,000x26,00x26,00x25,0000x25,00x25,0000x25,000333300003333000033330000333300x36,0000x312,0000x36,",hopping:["same",["Character","Player","normal","large","normal","running","normal","two"]],crouching:"p[0,6,8,10]x07,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000331113111311110033x15,x36,000223x15,x35,0033323x19,0033323331113323033332x38,23033332x37,22x36,21x35,22x37,x28,x39,x26,x38,1112222111333231111222211113221111x26,1111202113x06,311200033330000333300x36,0000x36,",running:{skidding:"p[0,6,8,10]000x27,x09,11x27,33x06,1x27,333000x26,31133110022113113113111100013311311311110x16,3111213x16,3x15,22313111133331133223110333311113332x05,x15,x35,220003322233111332000333222x15,32000333233x15,3200x37,x15,0000x37,113122200x38,11222200x37,x27,00x36,x27,0000333x25,333x05,x25,x35,x06,x25,x38,0000222333311113x06,233x16,3x07,3112222x010,x27,003x07,222230033x07,22x37,x08,x37,x09,x36,x011,3333x012,3330000",normal:{normal:"p[0,6,8,10]x06,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000333x15,x35,x05,33x18,x08,33311x010,222233200010000333322332011100x36,223231110x37,223321110x37,223323130x36,222332330x36,22212313003333x29,000x15,x28,000x15,x28,0031111x29,0330111x27,x35,00023x26,x35,003223x25,x38,22233222x39,2222000x310,2x011,333x013,333x014,333x011,",two:"p[0,6,8,10]x023,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000033x15,x35,x06,3x18,x06,3222111x08,3233323x09,32333323x07,332x35,22110000322x37,1111003222x36,1111000222x37,1110002222x36,111000x26,3332x06,x210,x06,x29,30003333x27,322003333x25,3322200333322223222200033332220022220003333x05,333300033x07,33330003x08,x36,x010,x36,x017,",three:"p[0,6,8,10]x022,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000033x15,x35,x05,33x18,x07,222211x09,32332233x07,323333223x07,3233332233x06,3233332223x06,32x35,113x06,3233331111x06,22333311112x05,22233311112200002222331112220000x26,332222x05,x25,33322x07,222x36,x07,22x36,x09,223333x010,3222333x09,3333033x08,x35,x011,x37,x011,x35,x05,"}},paddling:{normal:{normal:"p[0,6,8,10]x07,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000033x15,331111x05,3113331111x05,322x35,11x05,322x36,1x06,32x36,x08,32x35,23x07,323333223x08,223322233x07,x28,3x07,x25,1222x06,x210,x06,x210,x06,x210,x05,33x28,00003333x27,x05,3333x25,x07,33332223x08,3333033x09,3300033x09,300003x058,",paddle1:"p[0,6,8,10]x023,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000033x15,331111x05,3113331111x05,322x35,11x05,322x36,1x06,32x36,x08,32x35,23x07,323333223x08,223322233x07,x28,3x07,x25,1222x06,x210,x06,x210,x06,x210,x05,33x28,00003333x27,x05,3333x25,x07,33332223x08,3333033x09,3300033x09,300003x042,",paddle2:"p[0,6,8,10]x023,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000033x15,x35,x06,3x18,x06,3222111x08,3233323x09,32333323x07,332x35,2x07,322x36,2x06,3222x36,11x05,222x36,11100002222x35,1111000x26,3331111000x210,011000x29,x06,33x28,00003333x27,x05,3333x25,x07,33332223x08,3333033x09,3300033x09,300003x042,",paddle3:"p[0,6,8,10]x023,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000033x15,x35,x06,3x18,x06,3222111x08,3233323x09,32333323x08,x36,233x07,x36,223x06,x36,22233x05,x35,x25,3000011333222122200001113x28,0001111x29,000111x29,x06,33x28,00003333x27,x05,3333x25,x07,33332223x08,3333033x09,3300033x09,300003x042,"},swim2:{normal:"p[0,6,8,10]x07,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000033x15,331111x05,3113331111x05,322x35,11x05,322x36,1x06,32x36,x08,32x35,23x07,323333223x08,223322233x07,x28,3x07,x25,1222x06,x210,x06,x210,x06,x210,x06,x29,x07,x28,x08,3x25,x09,333222x010,x35,x011,3333x012,333x014,33x043,",paddle1:"p[0,6,8,10]x023,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000033x15,331111x05,3113331111x05,322x35,11x05,322x36,1x06,32x36,x08,32x35,23x07,323333223x08,223322233x07,x28,3x07,x25,1222x06,x210,x06,x210,x06,x210,x06,x29,x07,x28,x08,3x25,x09,333222x010,x35,x011,3333x012,333x014,33x027,",paddle2:"p[0,6,8,10]x022,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000033x15,x35,x06,3x18,x06,3222111x08,3233323x09,32333323x07,332x35,2x07,322x36,2x06,3222x36,11x05,222x36,11100002222x35,1111000x26,3331111000x210,011000x29,x07,x29,x07,x28,x08,3x25,x09,333222x010,x35,x011,3333x012,333x014,33x028,",paddle3:"p[0,6,8,10]x023,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000033x15,x35,x06,3x18,x06,3222111x08,3233323x09,32333323x08,x36,233x07,x36,223x06,x36,22233x05,x35,x25,3000011333222122200001113x28,0001111x29,000111x29,x07,x29,x07,x28,x08,3x25,x09,333222x010,x35,x011,3333x012,333x014,33x027,"}},climbing:{normal:"p[0,6,8,10]x023,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000033x15,331111x05,3113331111x05,322x35,11x05,322x36,1x06,32x36,x08,32x35,23x07,323333223x08,223322233x07,x28,3x07,x25,1222x06,x210,x06,x210,x06,x210,x06,x29,x07,x29,30330000x27,x35,x05,x26,x35,x07,22223333x011,x35,x013,33x015,3x018,",two:"p[0,6,8,10]x023,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000033x15,x35,x06,3x18,x06,3222111x08,3233323x09,32333323x07,332x35,22110000322x37,1111003222x36,1111000222x37,1110002222x36,111000x26,3332x06,x210,x06,x29,3x06,x210,033000x29,33330000x28,33330000x28,3333x05,x27,3333x064,"}}},fiery:{jumping:{normal:"p[0,5,6,8]x012,222x012,22322x06,x15,223320000x17,x25,000x18,x35,000x111,33000333223222333300322322332222330032233x28,30032233222322223033x25,x37,0033332222333323000033x28,33x05,1111331333300x36,113133300x38,13313300x38,1131300033223333113310003222233111132000x25,31112111000x25,x18,0002222x19,003022x110,033000x19,33330003x18,x37,133x16,x37,111331111x37,x15,0011x37,x15,x08,3331111x09,33x014,3x015,",firing:["same",["Character","Player","normal","fiery","normal","running","normal","two"]]},normal:{normal:"p[0,5,6,8]x06,x15,x09,x16,2x08,x16,22x08,x111,x05,333223222x06,322322332222000032233x28,00332233222322220033x25,x36,000333x25,x35,x05,33x28,x07,1x25,3x09,31333313x07,3313333133x05,3331333313330003333133331333300333113333113330333311333311x38,x18,x38,1211112133332222x18,x28,x18,22220222x18,2220022x110,22000x112,000x16,00x16,00x15,0000x15,00x15,0000x15,000333300003333000033330000333300x36,0000x312,0000x36,",hopping:["same",["Character","Player","normal","fiery","normal","running","normal","three"]],crouching:"p[0,5,6,8]x07,x15,x09,x16,2x08,x16,22x08,x111,x05,333223222x06,322322332222000332223222322220033x25,x36,000113x25,x35,0033313x29,0033313332223313033331x38,13033331x37,11x36,12x35,11x37,x18,x39,x16,x38,2221111222333132222111122223112222x16,2222101223x06,322100033330000333300x36,0000x36,",firing:["same",["Character","Player","normal","fiery","normal","running","normal","two"]],running:{skidding:"p[0,5,6,8]000x17,x09,22x17,33x06,2x17,333000x16,32233220011223223223222200023322322322220x26,3222123x26,3x25,11323222233332233113220333322223331x05,x25,x35,110003311133222331000333111x25,31000333133x25,3100x37,x25,0000x37,223211100x38,22111100x37,x17,00x36,x17,0000333x15,333x05,x15,x35,x06,x15,x38,0000111333322223x06,133x26,3x07,3221111x010,x17,003x07,111130033x07,11x37,x08,x37,x09,x36,x011,3333x012,3330000",normal:{normal:"p[0,5,6,8]x06,x15,x09,x16,2x08,x16,22x08,x111,x05,333223222x06,322322332222000032233x28,00332233222322220033x25,x36,000333x25,x35,x05,33x28,x08,33322x010,111133100020000333311331022200x36,113132220x37,113312220x37,113313230x36,111331330x36,11121323003333x19,000x25,x18,000x25,x18,0032222x19,0330222x17,x35,00013x16,x35,003113x15,x38,11133111x39,1111000x310,1x011,333x013,333x014,333x011,",two:"p[0,5,6,8]x039,x15,x09,x16,2x08,x16,22x08,x111,x05,333223222x06,322322332222000032233x28,00332233222322220033x25,x36,000033x25,x35,x06,3x28,x06,3111222x08,3133313x09,31333313x07,331x35,11220000311x37,2222003111x36,2222000111x37,2220001111x36,222000x16,3331x06,x110,x06,x19,30003333x17,311003333x15,3311100333311113111100033331110011110003333x05,333300033x07,33330003x08,x36,x010,x36,0",three:"p[0,5,6,8,10]x022,x15,x09,x16,2x08,x16,22x08,x111,x05,333223222x06,322322332222000032233x28,00332233222322220033x25,x36,000044x25,x35,x05,33x28,x07,111122x09,31331133x07,313333113x07,3133331133x06,3133331113x06,31x35,223x06,3133332222x06,11333322221x05,11133322221100001111332221110000x16,331111x05,x15,33311x07,111x36,x07,11x36,x09,113333x010,3111333x09,3333033x08,x35,x011,x37,x011,x35,x05,"}},paddling:{normal:{normal:["same",["Character","Player","normal","fiery","normal","paddling","normal","paddle1"]],paddle1:"p[0,5,6,8]x023,x15,x09,x16,2x08,x16,22x08,x111,x05,333223222x06,322322332222000032233x28,00332233222322220033x25,x36,000033x25,332222x05,3223332222x05,311x35,22x05,311x36,2x06,31x36,x08,31x35,13x07,313333113x08,113311133x07,x18,3x07,x15,2111x06,x110,x06,x110,x06,x110,x05,33x18,00003333x17,x05,3333x15,x07,33331113x08,3333033x09,3300033x09,300003x042,",paddle2:"p[0,5,6,8]x023,x15,x09,x16,2x08,x16,22x08,x111,x05,333223222x06,322322332222000032233x28,00332233222322220033x25,x36,000033x25,x35,x06,3x28,x06,3111222x08,3133313x09,31333313x07,331x35,1x07,311x36,1x06,3111x36,22x05,111x36,22200001111x35,2222000x16,3332222000x110,022000x19,x06,33x18,00003333x17,x05,3333x15,x07,33331113x08,3333033x09,3300033x09,300003x042,",
paddle3:"p[0,5,6,8]x023,x15,x09,x16,2x08,x16,22x08,x111,x05,333223222x06,322322332222000032233x28,00332233222322220033x25,x36,000033x25,x35,x06,3x28,x06,3111222x08,3133313x09,31333313x08,x36,133x07,x36,113x06,x36,11133x05,x35,x15,3000022333111211100002223x18,0002222x19,000222x19,x06,33x18,00003333x17,x05,3333x15,x07,33331113x08,3333033x09,3300033x09,300003x042,"},swim2:{normal:["same",["Character","Player","normal","fiery","normal","paddling","swim2","paddle1"]],paddle1:"p[0,5,6,8]x023,x15,x09,x16,2x08,x16,22x08,x111,x05,333223222x06,322322332222000032233x28,00332233222322220033x25,x36,000033x25,332222x05,3223332222x05,311x35,22x05,311x36,2x06,31x36,x08,31x35,13x07,313333113x08,113311133x07,x18,3x07,x15,2111x06,x110,x06,x110,x06,x110,x06,x19,x07,x18,x08,3x15,x09,333111x010,x35,x011,3333x012,333x014,33x027,",paddle2:"p[0,5,6,8]x022,x15,x09,x16,2x08,x16,22x08,x111,x05,333223222x06,322322332222000032233x28,00332233222322220033x25,x36,000033x25,x35,x06,3x28,x06,3111222x08,3133313x09,31333313x07,331x35,1x07,311x36,1x06,3111x36,22x05,111x36,22200001111x35,2222000x16,3332222000x110,022000x19,x07,x19,x07,x18,x08,3x15,x09,333111x010,x35,x011,3333x012,333x014,33x028,",paddle3:"p[0,5,6,8]x023,x15,x09,x16,2x08,x16,22x08,x111,x05,333223222x06,322322332222000032233x28,00332233222322220033x25,x36,000033x25,x35,x06,3x28,x06,3111222x08,3133313x09,31333313x08,x36,133x07,x36,113x06,x36,11133x05,x35,x15,3000022333111211100002223x18,0002222x19,000222x19,x07,x19,x07,x18,x08,3x15,x09,333111x010,x35,x011,3333x012,333x014,33x027,"}},climbing:{normal:"p[0,5,6,8]x023,x15,x09,x16,2x08,x16,22x08,x111,x05,333223222x06,322322332222000032233x28,00332233222322220033x25,x36,000033x25,332222x05,3223332222x05,311x35,22x05,311x36,2x06,31x36,x08,31x35,13x07,313333113x08,113311133x07,x18,3x07,x15,2111x06,x110,x06,x110,x06,x110,x06,x19,x07,x19,30330000x17,x35,x05,x16,x35,x07,11113333x011,x35,x013,33x015,3x018,",two:"p[0,5,6,8]x023,x15,x09,x16,2x08,x16,22x08,x111,x05,333223222x06,322322332222000032233x28,00332233222322220033x25,x36,000033x25,x35,x06,3x28,x06,3111222x08,3133313x09,31333313x07,331x35,11220000311x37,2222003111x36,2222000111x37,2220001111x36,222000x16,3331x06,x110,x06,x19,3x06,x110,033000x19,33330000x18,33330000x18,3333x05,x17,3333x064,"}}},shrooming:{normal:"p[0,6,8,10]x0261,x25,x010,x29,x07,3331131x08,3131113111x06,31331113111x05,3311113333x08,x17,x08,332333x09,3332332333x05,33332222333300001132122123110000111x26,111000011x28,11x06,22200222x07,3330000333x05,33330000333300",shrooming2:"p[0,6,8,10]x0134,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000333x15,x35,x05,33x18,x07,2x15,3x09,32333323x07,3323333233x05,33323333233300033332333323333011002122221200x15,0x28,0x16,x210,11101022220022220100022220000222200003333000033330000333300003333000x35,0000x35,0",shrooming3:"p[0,6,8,10]x06,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000333x15,x35,x05,33x18,x07,2x15,3x09,32333323x07,3323333233x05,3332333323330003333233332333300333223333223330333322333322x38,x28,x38,2122221233331111x28,x18,x28,11110111x28,1110011x210,11000x212,000x26,00x26,00x25,0000x25,00x25,0000x25,000333300003333000033330000333300x36,0000x312,0000x36,"}},star:{normal:["filter",["Character","Player","normal"],"StarOne"],star2:["filter",["Character","Player","normal"],"StarTwo"],star3:["filter",["Character","Player","normal"],"StarThree"],star4:["filter",["Character","Player","normal"],"StarFour"]}},Luigi:{dead:"p[0,6,1,21]x05,x25,x07,11x27,1100111131311313x16,3313113133x15,33311113331100x35,113333x05,331333313x06,33x16,3x05,222211112220003332233332233003333223322333003333212212333003333x26,333000333x26,3300",normal:{normal:{normal:"p[0,6,1,21]0000x26,x09,x210,x06,33331131x07,33131113111x05,331331113111000033311113333x07,x18,x07,3332333x08,333323323330000x35,2222333300011132122123110001111x26,111000111x28,11x05,222202222x06,333300033330000x35,000x35,00",hopping:["same",["Character","Luigi","normal","normal","running","normal","two"]],jumping:"p[0,6,1,21]x013,111x06,x26,0111x05,x29,11x05,33311311333000031311131133300003133111311130000331111x36,x06,x17,33000x35,2333233000x37,2333220311x36,x26,0311112232212212330113x210,3300333x29,330333x28,x05,330x25,x07,",running:{skidding:"p[0,6,1,21]x05,x26,x08,x28,33x07,131x37,0000x16,3113111001133113311311100033x16,3111x05,1123332222x05,3332231112220000x36,1113220000x36,112222x05,3333x26,x07,222233322x07,222x35,x09,2333223333x09,2x36,x010,x35,00",normal:{normal:"p[0,6,1,21]x05,x26,x09,x210,x06,33331131x07,33131113111x05,331331113111000033311113333x07,x18,x05,x35,2233x05,1113333222333x17,3332122233x15,0x28,0330000x210,33000x211,330033322200222233003333x013,3333x010,",two:"p[0,6,1,21]x020,x26,x09,x210,x06,33311311x07,31311131111x05,3133111311110000331111x35,x07,x18,x07,3323333x08,333322333x07,3332212211x06,3333x26,x06,2331112222x07,23112222x09,2223333x09,x38,0000",three:"p[0,6,1,21]x021,x26,x09,x210,x06,33331131x07,33131113111x05,331331113111000033311113333x07,x18,x07,x35,2311x06,11x36,11100001112x35,11x05,333x27,x06,33x28,x05,333x27,x06,330003333x012,x35,x05,"}},paddling:{normal:{normal:"p[0,6,1,21]x05,x26,x09,x210,x06,33311311x07,31311131111x05,3133111311110000331111x35,x07,x18,x07,32x35,111x06,2x36,11x06,22233332x06,33x27,x07,33x26,x08,332222x010,30033x014,3x027,",paddle1:"p[0,6,1,21]x05,x26,x09,x210,x06,33311311x07,31311131111x05,3133111311110000331111x35,x07,x18,x07,32x35,1111x05,2x36,111x05,222333322x05,33x28,x06,33x27,x07,33x25,x09,330333x013,33x026,",paddle2:"p[0,6,1,21]x05,x26,x09,x210,x06,33311311x07,31311131111x05,3133111311110000331111x35,x07,x18,x07,3233322x09,2x36,x08,222333311x05,33x25,33111000033x27,111000033x26,00110000330333x013,33x026,",paddle3:"p[0,6,1,21]x05,x26,x09,x210,x06,33311311x07,31311131111x05,3133111311110000331111x35,x07,x18,x07,3332333x08,33332333x06,1333322333x05,1113322122x07,33x27,x07,33x25,x09,330333x013,33x026,"},swim2:{normal:"p[0,6,1,21]x05,x26,x09,x210,x06,33311311x07,31311131111x05,3133111311110000331111x35,x07,x18,x07,32x35,111x06,2x36,11x06,22233332x07,3x27,x07,33x26,x010,3322x011,333x013,33x028,",paddle1:"p[0,6,1,21]x05,x26,x09,x210,x06,33311311x07,31311131111x05,3133111311110000331111x35,x07,x18,x07,32x35,1111x05,2x36,111x05,222333322x06,3x28,x06,33x27,x09,33222x010,3333x012,333x027,",paddle2:"p[0,6,1,21]x05,x26,x09,x210,x06,33311311x07,31311131111x05,3133111311110000331111x35,x07,x18,x07,3233322x09,2x36,x08,222333311x06,3x25,33111000033x27,111x06,3322220011x05,3333x012,333x027,",paddle3:"p[0,6,1,21]x05,x26,x09,x210,x06,33311311x07,31311131111x05,3133111311110000331111x35,x07,x18,x07,3332333x08,33332333x06,1333322333x05,1113322122x07,33x27,x09,332222x09,3333x012,333x027,"}},climbing:{normal:"p[0,6,1,21]0000x26,x09,x210,x06,33311311x07,31311131111x05,3133111311110000331111x35,x07,x18,x07,3323333x09,222x35,x08,222x36,11100002222x35,111100x26,3333111100x211,33300x211,330000x29,x08,x26,x06,",two:"p[0,6,1,21]x05,x26,x09,x210,x06,33311311x07,31311131111x05,3133111311110000331111x35,x07,x18,x08,22x35,111x05,22x36,1111000222x36,1111000x25,122x08,x28,00033000x210,3330000x29,333x05,x28,333x016,"}},large:{normal:"p[0,6,1,21]x06,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000333x15,x35,x05,33x18,x07,2x15,3x09,32333323x07,3323333233x05,3332333323330003333233332333300333223333223330333322333322x38,x28,x38,2122221233331111x28,x18,x28,11110111x28,1110011x210,11000x212,000x26,00x26,00x25,0000x25,00x25,0000x25,000333300003333000033330000333300x36,0000x312,0000x36,",jumping:"p[0,6,1,21]x012,111x012,11311x06,x25,113310000x27,x15,000x28,x35,000x211,33000333113111333300311311331111330031133x18,30031133111311113033x15,x37,0033331111333313000033x18,33x05,2222332333300x36,223233300x38,23323300x38,2232300033113333223320003111133222231000x15,32221222000x15,x28,0001011x29,003011x210,033000x29,33330003x28,x37,233x26,x37,222332222x37,x25,0022x37,x25,x08,3332222x09,33x014,3x015,",hopping:["same",["Character","Luigi","normal","large","running","normal","two"]],crouching:"p[0,6,1,21]x07,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000331113111311110033x15,x36,000223x15,x35,0033323x19,0033323331113323033332x38,23033332x37,22x36,21x35,22x37,x28,x39,x26,x38,1112222111333231111222211113221111x26,1111202113x06,311200033330000333300x36,0000x36,",running:{skidding:"p[0,6,1,21]000x27,x09,11x27,33x06,1x27,333000x26,31133110022113113113111100013311311311110x16,3111213x16,3x15,22313111133331133223110333311113332x05,x15,x35,220003322233111332000333222x15,32000333233x15,3200x37,x15,0000x37,113122200x38,11222200x37,x27,00x36,x27,0000333x25,333x05,x25,x35,x06,x25,x38,0000222333311113x06,233x16,3x07,3112222x010,x27,003x07,222230033x07,22x37,x08,x37,x09,x36,x011,3333x012,3330000",normal:{normal:"p[0,6,1,21]x06,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000333x15,x35,x05,33x18,x08,33311x010,222233200010000333322332011100x36,223231110x37,223321110x37,223323130x36,222332330x36,22212313003333x29,000x15,x28,000x15,x28,0031111x29,0330111x27,x35,00023x26,x35,003223x25,x38,22233222x39,2222000x310,2x011,333x013,333x014,333x011,",two:"p[0,6,1,21]x023,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000033x15,x35,x06,3x18,x06,3222111x08,3233323x09,32333323x07,332x35,22110000322x37,1111003222x36,1111000222x37,1110002222x36,111000x26,3332x06,x210,x06,x29,30003333x27,322003333x25,3322200333322223222200033332220022220003333x05,333300033x07,33330003x08,x36,x010,x36,x017,",three:"p[0,6,1,21]x022,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000033x15,x35,x05,33x18,x07,222211x09,32332233x07,323333223x07,3233332233x06,3233332223x06,32x35,113x06,3233331111x06,22333311112x05,22233311112200002222331112220000x26,332222x05,x25,33322x07,222x36,x07,22x36,x09,223333x010,3222333x09,3333033x08,x35,x011,x37,x011,x35,x05,"}},paddling:{normal:{normal:"p[0,6,1,21]x07,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000033x15,331111x05,3113331111x05,322x35,11x05,322x36,1x06,32x36,x08,32x35,23x07,323333223x08,223322233x07,x28,3x07,x25,1222x06,x210,x06,x210,x06,x210,x05,33x28,00003333x27,x05,3333x25,x07,33332223x08,3333033x09,3300033x09,300003x058,",paddle1:"p[0,6,1,21]x023,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000033x15,331111x05,3113331111x05,322x35,11x05,322x36,1x06,32x36,x08,32x35,23x07,323333223x08,223322233x07,x28,3x07,x25,1222x06,x210,x06,x210,x06,x210,x05,33x28,00003333x27,x05,3333x25,x07,33332223x08,3333033x09,3300033x09,300003x042,",paddle2:"p[0,6,1,21]x023,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000033x15,x35,x06,3x18,x06,3222111x08,3233323x09,32333323x07,332x35,2x07,322x36,2x06,3222x36,11x05,222x36,11100002222x35,1111000x26,3331111000x210,011000x29,x06,33x28,00003333x27,x05,3333x25,x07,33332223x08,3333033x09,3300033x09,300003x042,",paddle3:"p[0,6,1,21]x023,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000033x15,x35,x06,3x18,x06,3222111x08,3233323x09,32333323x08,x36,233x07,x36,223x06,x36,22233x05,x35,x25,3000011333222122200001113x28,0001111x29,000111x29,x06,33x28,00003333x27,x05,3333x25,x07,33332223x08,3333033x09,3300033x09,300003x042,"},swim2:{normal:"p[0,6,1,21]x07,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000033x15,331111x05,3113331111x05,322x35,11x05,322x36,1x06,32x36,x08,32x35,23x07,323333223x08,223322233x07,x28,3x07,x25,1222x06,x210,x06,x210,x06,x210,x06,x29,x07,x28,x08,3x25,x09,333222x010,x35,x011,3333x012,333x014,33x043,",paddle1:"p[0,6,1,21]x023,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000033x15,331111x05,3113331111x05,322x35,11x05,322x36,1x06,32x36,x08,32x35,23x07,323333223x08,223322233x07,x28,3x07,x25,1222x06,x210,x06,x210,x06,x210,x06,x29,x07,x28,x08,3x25,x09,333222x010,x35,x011,3333x012,333x014,33x027,",paddle2:"p[0,6,1,21]x022,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000033x15,x35,x06,3x18,x06,3222111x08,3233323x09,32333323x07,332x35,2x07,322x36,2x06,3222x36,11x05,222x36,11100002222x35,1111000x26,3331111000x210,011000x29,x07,x29,x07,x28,x08,3x25,x09,333222x010,x35,x011,3333x012,333x014,33x028,",paddle3:"p[0,6,1,21]x023,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000033x15,x35,x06,3x18,x06,3222111x08,3233323x09,32333323x08,x36,233x07,x36,223x06,x36,22233x05,x35,x25,3000011333222122200001113x28,0001111x29,000111x29,x07,x29,x07,x28,x08,3x25,x09,333222x010,x35,x011,3333x012,333x014,33x027,"}},climbing:{normal:"p[0,6,1,21]x023,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000033x15,331111x05,3113331111x05,322x35,11x05,322x36,1x06,32x36,x08,32x35,23x07,323333223x08,223322233x07,x28,3x07,x25,1222x06,x210,x06,x210,x06,x210,x06,x29,x07,x29,30330000x27,x35,x05,x26,x35,x07,22223333x011,x35,x013,33x015,3x018,",two:"p[0,6,1,21]x023,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000033x15,x35,x06,3x18,x06,3222111x08,3233323x09,32333323x07,332x35,22110000322x37,1111003222x36,1111000222x37,1110002222x36,111000x26,3332x06,x210,x06,x29,3x06,x210,033000x29,33330000x28,33330000x28,3333x05,x27,3333x064,"}},fiery:{normal:"p[0,5,6,8]x06,x15,x09,x16,2x08,x16,22x08,x111,x05,333223222x06,322322332222000032233x28,00332233222322220033x25,x36,000333x25,x35,x05,33x28,x07,1x25,3x09,31333313x07,3313333133x05,3331333313330003333133331333300333113333113330333311333311x38,x18,x38,1211112133332222x18,x28,x18,22220222x18,2220022x110,22000x112,000x16,00x16,00x15,0000x15,00x15,0000x15,000333300003333000033330000333300x36,0000x312,0000x36,",jumping:"p[0,5,6,8]x012,222x012,22322x06,x15,223320000x17,x25,000x18,x35,000x111,33000333223222333300322322332222330032233x28,30032233222322223033x25,x37,0033332222333323000033x28,33x05,1111331333300x36,113133300x38,13313300x38,1131300033223333113310003222233111132000x25,31112111000x25,x18,0002222x19,003022x110,033000x19,33330003x18,x37,133x16,x37,111331111x37,x15,0011x37,x15,x08,3331111x09,33x014,3x015,",hopping:["same",["Character","Luigi","normal","fiery","running","normal","three"]],crouching:"p[0,5,6,8]x07,x15,x09,x16,2x08,x16,22x08,x111,x05,333223222x06,322322332222000332223222322220033x25,x36,000113x25,x35,0033313x29,0033313332223313033331x38,13033331x37,11x36,12x35,11x37,x18,x39,x16,x38,2221111222333132222111122223112222x16,2222101223x06,322100033330000333300x36,0000x36,",firing:["same",["Character","Luigi","normal","fiery","running","normal","two"]],running:{skidding:"p[0,5,6,8]000x17,x09,22x17,33x06,2x17,333000x16,32233220011223223223222200023322322322220x26,3222123x26,3x25,11323222233332233113220333322223331x05,x25,x35,110003311133222331000333111x25,31000333133x25,3100x37,x25,0000x37,223211100x38,22111100x37,x17,00x36,x17,0000333x15,333x05,x15,x35,x06,x15,x38,0000111333322223x06,133x26,3x07,3221111x010,x17,003x07,111130033x07,11x37,x08,x37,x09,x36,x011,3333x012,3330000",normal:{normal:"p[0,5,6,8]x06,x15,x09,x16,2x08,x16,22x08,x111,x05,333223222x06,322322332222000032233x28,00332233222322220033x25,x36,000333x25,x35,x05,33x28,x08,33322x010,111133100020000333311331022200x36,113132220x37,113312220x37,113313230x36,111331330x36,11121323003333x19,000x25,x18,000x25,x18,0032222x19,0330222x17,x35,00013x16,x35,003113x15,x38,11133111x39,1111000x310,1x011,333x013,333x014,333x011,",two:"p[0,5,6,8]x039,x15,x09,x16,2x08,x16,22x08,x111,x05,333223222x06,322322332222000032233x28,00332233222322220033x25,x36,000033x25,x35,x06,3x28,x06,3111222x08,3133313x09,31333313x07,331x35,11220000311x37,2222003111x36,2222000111x37,2220001111x36,222000x16,3331x06,x110,x06,x19,30003333x17,311003333x15,3311100333311113111100033331110011110003333x05,333300033x07,33330003x08,x36,x010,x36,0",three:"p[0,5,6,8,10]x022,x15,x09,x16,2x08,x16,22x08,x111,x05,333223222x06,322322332222000032233x28,00332233222322220033x25,x36,000044x25,x35,x05,33x28,x07,111122x09,31331133x07,313333113x07,3133331133x06,3133331113x06,31x35,223x06,3133332222x06,11333322221x05,11133322221100001111332221110000x16,331111x05,x15,33311x07,111x36,x07,11x36,x09,113333x010,3111333x09,3333033x08,x35,x011,x37,x011,x35,x05,"}},paddling:{normal:{normal:"p[0,6,1,21]x07,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000033x15,331111x05,3113331111x05,322x35,11x05,322x36,1x06,32x36,x08,32x35,23x07,323333223x08,223322233x07,x28,3x07,x25,1222x06,x210,x06,x210,x06,x210,x05,33x28,00003333x27,x05,3333x25,x07,33332223x08,3333033x09,3300033x09,300003x058,",paddle1:"p[0,5,6,8]x023,x15,x09,x16,2x08,x16,22x08,x111,x05,333223222x06,322322332222000032233x28,00332233222322220033x25,x36,000033x25,332222x05,3223332222x05,311x35,22x05,311x36,2x06,31x36,x08,31x35,13x07,313333113x08,113311133x07,x18,3x07,x15,2111x06,x110,x06,x110,x06,x110,x05,33x18,00003333x17,x05,3333x15,x07,33331113x08,3333033x09,3300033x09,300003x042,",paddle2:"p[0,5,6,8]x023,x15,x09,x16,2x08,x16,22x08,x111,x05,333223222x06,322322332222000032233x28,00332233222322220033x25,x36,000033x25,x35,x06,3x28,x06,3111222x08,3133313x09,31333313x07,331x35,1x07,311x36,1x06,3111x36,22x05,111x36,22200001111x35,2222000x16,3332222000x110,022000x19,x06,33x18,00003333x17,x05,3333x15,x07,33331113x08,3333033x09,3300033x09,300003x042,",paddle3:"p[0,5,6,8]x023,x15,x09,x16,2x08,x16,22x08,x111,x05,333223222x06,322322332222000032233x28,00332233222322220033x25,x36,000033x25,x35,x06,3x28,x06,3111222x08,3133313x09,31333313x08,x36,133x07,x36,113x06,x36,11133x05,x35,x15,3000022333111211100002223x18,0002222x19,000222x19,x06,33x18,00003333x17,x05,3333x15,x07,33331113x08,3333033x09,3300033x09,300003x042,"},swim2:{normal:"p[0,6,1,21]x07,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000033x15,331111x05,3113331111x05,322x35,11x05,322x36,1x06,32x36,x08,32x35,23x07,323333223x08,223322233x07,x28,3x07,x25,1222x06,x210,x06,x210,x06,x210,x06,x29,x07,x28,x08,3x25,x09,333222x010,x35,x011,3333x012,333x014,33x043,",paddle1:"p[0,5,6,8]x023,x15,x09,x16,2x08,x16,22x08,x111,x05,333223222x06,322322332222000032233x28,00332233222322220033x25,x36,000033x25,332222x05,3223332222x05,311x35,22x05,311x36,2x06,31x36,x08,31x35,13x07,313333113x08,113311133x07,x18,3x07,x15,2111x06,x110,x06,x110,x06,x110,x06,x19,x07,x18,x08,3x15,x09,333111x010,x35,x011,3333x012,333x014,33x027,",paddle2:"p[0,5,6,8]x022,x15,x09,x16,2x08,x16,22x08,x111,x05,333223222x06,322322332222000032233x28,00332233222322220033x25,x36,000033x25,x35,x06,3x28,x06,3111222x08,3133313x09,31333313x07,331x35,1x07,311x36,1x06,3111x36,22x05,111x36,22200001111x35,2222000x16,3332222000x110,022000x19,x07,x19,x07,x18,x08,3x15,x09,333111x010,x35,x011,3333x012,333x014,33x028,",paddle3:"p[0,5,6,8]x023,x15,x09,x16,2x08,x16,22x08,x111,x05,333223222x06,322322332222000032233x28,00332233222322220033x25,x36,000033x25,x35,x06,3x28,x06,3111222x08,3133313x09,31333313x08,x36,133x07,x36,113x06,x36,11133x05,x35,x15,3000022333111211100002223x18,0002222x19,000222x19,x07,x19,x07,x18,x08,3x15,x09,333111x010,x35,x011,3333x012,333x014,33x027,"}},climbing:{normal:"p[0,5,6,8]x023,x15,x09,x16,2x08,x16,22x08,x111,x05,333223222x06,322322332222000032233x28,00332233222322220033x25,x36,000033x25,332222x05,3223332222x05,311x35,22x05,311x36,2x06,31x36,x08,31x35,13x07,313333113x08,113311133x07,x18,3x07,x15,2111x06,x110,x06,x110,x06,x110,x06,x19,x07,x19,30330000x17,x35,x05,x16,x35,x07,11113333x011,x35,x013,33x015,3x018,",two:"p[0,5,6,8]x023,x15,x09,x16,2x08,x16,22x08,x111,x05,333223222x06,322322332222000032233x28,00332233222322220033x25,x36,000033x25,x35,x06,3x28,x06,3111222x08,3133313x09,31333313x07,331x35,11220000311x37,2222003111x36,2222000111x37,2220001111x36,222000x16,3331x06,x110,x06,x19,3x06,x110,033000x19,33330000x18,33330000x18,3333x05,x17,3333x064,"}},shrooming:{normal:"p[0,6,1,21]x0261,x25,x010,x29,x07,3331131x08,3131113111x06,31331113111x05,3311113333x08,x17,x08,332333x09,3332332333x05,33332222333300001132122123110000111x26,111000011x28,11x06,22200222x07,3330000333x05,33330000333300",shrooming2:"p[0,6,1,21]x0134,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000333x15,x35,x05,33x18,x07,2x15,3x09,32333323x07,3323333233x05,33323333233300033332333323333011002122221200x15,0x28,0x16,x210,11101022220022220100022220000222200003333000033330000333300003333000x35,0000x35,0",shrooming3:"p[0,6,1,21]x06,x25,x09,x26,1x08,x26,11x08,x211,x05,333113111x06,311311331111000031133x18,00331133111311110033x15,x36,000333x15,x35,x05,33x18,x07,2x15,3x09,32333323x07,3323333233x05,3332333323330003333233332333300333223333223330333322333322x38,x28,x38,2122221233331111x28,x18,x28,11110111x28,1110011x210,11000x212,000x26,00x26,00x25,0000x25,00x25,0000x25,000333300003333000033330000333300x36,0000x312,0000x36,"}},star:{normal:["filter",["Character","Luigi","normal"],"StarOne"],star2:["filter",["Character","Luigi","normal"],"StarTwo"],star3:["filter",["Character","Luigi","normal"],"StarThree"],star4:["filter",["Character","Luigi","normal"],"StarFour"]}},Mushroom:"p[0,1,6,8]x06,2222x011,332222x09,33332222x07,x35,x25,x05,22333x27,000x29,3332200x28,x35,202233x25,x35,222333x25,x35,22233x27,333x219,02333x16,3332x05,x18,x08,12x16,x08,12x16,x09,121111x05,",Mushroom1Up:"p[0,1,6,14]x06,2222x011,332222x09,33332222x07,x35,x25,x05,22333x27,000x29,3332200x28,x35,202233x25,x35,222333x25,x35,22233x27,333x219,02333x16,3332x05,x18,x08,12x16,x08,12x16,x09,121111x05,",MushroomDeathly:"p[0,5,9,16]x06,2222x011,332222x09,33332222x07,x35,x25,x05,22333x27,000x29,3332200x28,x35,202233x25,x35,222333x25,x35,22233x27,333x219,02333x16,3332x05,x18,x08,12x16,x08,12x16,x09,121111x05,",Piranha:{normal:{normal:"p[0,6,14]x022,2002x011,210012x09,22200222x08,12200221x07,2221001222x06,2222002222x05,1212200221210000x25,00x25,0000222120021222000021222002221200002222100122220000212220022212x05,2212002122x06,2222002222x07,12100121x010,2002x06,11x05,11x05,11121100011000112101211001100112100112110110112110001121011012110000111211112111x05,x110,000",two:"p[0,1,6,14]x034,3x010,30003211x06,112300331x08,1330023311000011332033321x06,12333233331100113333233233100001332x37,x06,x36,23333100133332x35,23100132333302x35,00x35,20033233300333233000333320023333x05,32x36,23x08,323323x05,22x05,22x05,22232200022000223202322002200223200223220220223220002232022023220000222322223222x05,x210,000"},Underworld:{normal:"p[0,9,16]x022,2002x011,210012x09,22200222x08,12200221x07,2221001222x06,2222002222x05,1212200221210000x25,00x25,0000222120021222000021222002221200002222100122220000212220022212x05,2212002122x06,2222002222x07,12100121x010,2002x06,11x05,11x05,11121100011000112101211001100112100112110110112110001121011012110000111211112111x05,x110,000",two:"p[0,5,9,16]x034,3x010,30003211x06,112300331x08,1330023311000011332033321x06,12333233331100113333233233100001332x37,x06,x36,23333100133332x35,23100132333302x35,00x35,20033233300333233000333320023333x05,32x36,23x08,323323x05,22x05,22x05,22232200022000223202322002200223200223220220223220002232022023220000222322223222x05,x210,000"},Castle:["same",["Character","Piranha","Underworld"]]},Podoboo:"p[0,1,6,8]0000x36,x07,x38,x05,3332222333000333x26,33300332221122233033322111122x35,22x16,22333322x16,22333322x16,223333222111122233332222112222x35,232222323330x35,22x35,00x35,22x35,0003303333033x05,30033003000",Shell:{normal:{normal:{normal:"p[0,1,6,14]x05,233332x09,33222233x07,3323333233x06,32x36,23x05,32x38,230000232x36,2320002333233332333200x35,2222x35,01113323333233x17,2x36,2111100011x36,11x07,11333311x09,x16,x011,1111x06,",peeking:"p[0,1,6,14]x05,233332x09,33222233x07,3323333233x06,32x36,23x05,32x38,230000232x36,2320002333233332333200x35,2222x35,01113323333233x17,2x36,2111100211x36,11200022211333311222002220x16,02220022000111100022002x012,20"},smart:["filter",["Character","Shell","normal","normal"],"Smart"]},Underworld:{smart:["same",["Character","Shell","normal","smart"]],normal:{normal:"p[0,5,9,16]x05,233332x09,33222233x07,3323333233x06,32x36,23x05,32x38,230000232x36,2320002333233332333200x35,2222x35,01113323333233x17,2x36,2111100011x36,11x07,11333311x09,x16,x011,1111x06,",peeking:"p[0,5,6,9,16]x05,344443x09,44333344x07,4434444344x06,43x46,34x05,43x48,340000343x46,3430003444344443444300x45,3333x45,01114434444344x17,3x46,3111100211x46,11200022211444411222002220x16,02220022000111100022002x012,20"}},Castle:["same",["Character","Shell","Underworld"]]},ShellBeetle:{normal:"p[0,2,5,9]x06,1111x010,x18,x07,1111331111x05,1111322311110000x15,33x15,0000x112,000x114,00x114,00x114,00x114,00x114,00x114,00x114,0x35,x16,x35,000033311333x010,3333x06,",Underworld:"p[0,15,16,18]x06,1111x010,x18,x07,1111221111x05,1111233211110000x15,22x15,0000x112,000x114,00x114,00x114,00x114,00x114,00x114,00x114,0x25,x16,x25,000022211222x010,2222x06,",Castle:"p[0,1,3,4]x06,3333x010,x38,x07,3333223333x05,3333211233330000x35,22x35,0000x312,000x314,00x314,00x314,00x314,00x314,00x314,0x25,x36,x25,000022233222x010,2222x06,"},Spiny:{normal:"p[0,1,6,8]x024,1x015,1x014,122x08,10000122000010001200122220012000122012222012200012223222312220001122x35,1222003322331123322301113331122233330033133x25,x36,133133222333111333321x35,111x05,222x16,2220002222x06,2222",two:"p[0,1,6,8]x08,1x015,1x014,122x08,10000122000010001200122220012000122012222012200012223222312220001122x35,1222003322331123322301113331122233330033133x25,x36,133133222333111333321x35,111x05,222x16,22x06,222000222x08,22000220000"},SpinyEgg:{normal:"p[0,1,6,8]x06,22x09,22322322x06,2x36,2x05,x310,00022311x35,22002311x37,200331x39,022x310,2222x310,220x39,133002x37,11320022x35,11322000x310,x05,2x36,2x06,22322322x09,22x06,",two:"p[0,1,6,8]0000220022x08,233332x05,22x38,2200233311x35,20003311x36,0022331x37,2222x310,220x312,00x312,022x310,2222x37,1332200x36,11330002x35,1133320022x38,22x05,233332x08,2200220000"},Star:{normal:"p[0,6,8]x06,11x012,11x011,1111x010,1111x09,x16,0000x119,2112x15,01111211211110001112112111x05,x18,x06,x18,x05,x110,0000x110,00001111001111000111x06,1110011x08,110",two:"p[0,2,9]x06,22x012,22x011,2222x010,2222x09,x26,0000x219,1221x25,02222122122220002221221222x05,x28,x06,x28,x05,x210,0000x210,00002222002222000222x06,2220022x08,220",three:"p[0,5,8]x06,22x012,22x011,2222x010,2222x09,x26,0000x219,1221x25,02222122122220002221221222x05,x28,x06,x28,x05,x210,0000x210,00002222002222000222x06,2220022x08,220",four:"p[0,6,14]x06,11x012,11x011,1111x010,1111x09,x16,0000x119,2112x15,01111211211110001112112111x05,x18,x06,x18,x05,x110,0000x110,00001111001111000111x06,1110011x08,110"},Vine:["multiple","vertical",{top:"p[0,6,14]00222x010,x25,x08,2211122x07,x25,12x09,222022x012,22x012,22x012,22x012,22x012,220022x08,2202222x07,2221112x07,x26,12x06,220x25,",topheight:7,middle:"p[0,6,14]x06,22x012,22x012,22x08,220022x07,2222022x07,2111222x06,21x26,x06,x25,022x012,22x012,22x012,22x012,220022x08,2202222x07,2221112x07,x26,12x06,220x25,"}]},Solid:{Block:{normal:{used:"p[0,2,9]0x114,01x214,1121x210,1211x214,11x214,11x214,11x214,11x214,11x214,11x214,11x214,11x214,11x214,1121x210,1211x214,10x114,0",normal:{normal:"p[0,2,6,9]0x314,03x214,1321x210,12132222x35,x25,132223311133222213222331223312221322233122331222132222112333122213x26,3311122213x26,331x25,13x27,11x25,13x26,33x26,13x26,331x25,1321x25,112221213x214,x117,",two:"p[0,2,9]0x214,0x215,1221x210,121x215,1x26,111x26,1x26,1222212221x26,1222212221x25,11222212221x29,1112221x29,1x25,1x28,11x25,1x215,1x29,1x25,1221x25,11222121x215,x117,",three:"p[0,2,9,11]0x214,02x314,1231x310,13123333x25,x35,123332211122333312333221332213331233322133221333123333113222133312x36,2211133312x36,221x35,12x37,11x35,12x36,22x36,12x36,221x35,1231x35,113331312x314,x117,"}},Underworld:{used:"p[0,9,16]0x214,02x114,2212x110,2122x114,22x114,22x114,22x114,22x114,22x114,22x114,22x114,22x114,22x114,2212x110,2122x114,20x214,0",normal:{normal:"p[0,6,9,16]0x214,02x114,3213x110,31321111x25,x15,321112233322111132111223112231113211122311223111321111331222311132x16,2233311132x16,223x15,32x17,33x15,32x16,22x16,32x16,223x15,3213x15,331113132x114,x317,",two:"p[0,9,16]0x114,0x115,2112x110,212x115,2x16,222x16,2x16,2111121112x16,2111121112x15,22111121112x19,2221112x19,2x15,2x18,22x15,2x115,2x19,2x15,2112x15,22111212x115,x217,",three:"p[0,9,11,16]0x114,01x214,3123x210,32312222x15,x25,312221133311222231222113221132223122211322113222312222332111322231x26,1133322231x26,113x25,31x27,33x25,31x26,11x26,31x26,113x25,3123x25,332223231x214,x317,"}},Castle:["same",["Solid","Block","Underworld"]]},Brick:{normal:{normal:"p[2,5,9]x116,x27,0x27,0x27,0x27,x017,2220x27,0x27,0x27,0x27,0x27,02222x016,x27,0x27,0x27,0x27,0x27,0x27,x017,2220x27,0x27,0x27,0x27,0x27,02222x016,",used:["same",["Solid","Block","normal","used"]]},Underworld:{normal:"p[2,16]x17,0x17,0x17,0x17,0x17,0x17,x017,1110x17,0x17,0x17,0x17,0x17,01111x016,x17,0x17,0x17,0x17,0x17,0x17,x017,1110x17,0x17,0x17,0x17,0x17,01111x016,",used:["same",["Solid","Block","normal","used"]]},Castle:["filter",["Solid","Brick","normal"],"Castle"],Alt2:["filter",["Solid","Brick","normal"],"Alt2"]},BridgeBase:"p[0,2,5,8]111000112221012222x35,222x35,222x35,222x35,22221012211100011",Cannon:["multiple","vertical",{top:"p[0,2,9,22]333x010,3333111x310,11333x110,x36,1x313,111x310,113x112,3113x112,3113x112,3113x15,33331113113111131111211311311131133112131131113131121213113111313112121311311131122112331133313x16,2133331103x16,203110003x18,2x06,3x18,2x05,3x110,200003x110,2000311x28,1120031222333322212031122x36,2212031122323323221123112322332232112311232233223211231123223322321123112x38,2112311222322322211231122233332221123111x28,11123x114,2",topheight:8,middle:"p[2,5,9]1x014,21x014,21x014,21x014,21x014,21x014,21x014,21x014,21x014,21x014,21x014,21x014,21x014,21x014,21x014,21x014,21x014,21x014,21x014,21x014,21x014,21x014,21x014,21x014,21x014,21x014,21x014,21x014,21x014,21x014,21x014,21x014,2"}],CastleAxe:{normal:"p[0,2,4,6,9]003x010,3000323300420033130032333322333313032x35,42x35,1332x35,42x35,1332x35,42x35,1332x35,42x35,1332x35,42x35,130323333423333130002330042000313000300002200003x09,42x014,22x014,42x014,22x014,42x07,",two:"p[0,2,4,9]003x010,3000323300320033130032333322333313032x36,2x35,1332x36,2x35,1332x36,2x35,1332x36,2x35,1332x36,2x35,13032x35,23333130002330032000313000300002200003x09,32x014,22x014,32x014,22x014,32x07,",three:"p[0,2,4,9,11]004x010,4000424400320044140042444422444414042x45,32x45,1442x45,32x45,1442x45,32x45,1442x45,32x45,1442x45,32x45,140424444324444140002440032000414000400002200004x09,32x014,22x014,32x014,22x014,32x07,"},CastleBlock:"p[0,4,9]0x114,01x214,1121x210,1211x214,11x214,11x214,11x214,11x214,11x214,11x214,11x214,11x214,11x214,1121x210,1211x214,10x114,0",CastleBridge:"p[1,2,4,8]10001000100010001000100010001000122212223222322232223222322232223222322232223222322232221222122213331333133313331333133313331333",CastleChain:"p[0,1,3]x014,1x013,1x014,22x011,12x013,22x011,12x012,102x012,22x011,12x012,102x012,22x011,12x013,22x011,12x012,102x012,22x013,",CastleStone:{normal:"p[1,2,3,4]0031x06,31000022310x25,310x25,310x25,310x25,310x25,310x25,310x25,310x25,310x25,3102223331x37,13333x116,x06,31x06,310x25,310x25,310x25,310x25,310x25,310x25,310x25,310x25,310x25,310x25,31x37,1x37,x117,",Underwater:"p[2,12,14,20]1103x16,03111122031x25,031x25,031x25,031x25,031x25,031x25,031x25,031x25,031x25,0312220003x07,30000x316,x16,03x16,031x25,031x25,031x25,031x25,031x25,031x25,031x25,031x25,031x25,031x25,03x07,3x07,x317,"},Cloud:"p[0,1,2]000x210,x05,2x110,20002x112,2002x112,2002x112,202x114,22x15,2112x15,22x15,2112x15,22x15,2112x15,22x114,2212x110,2120211121111211120021111222211112002x112,2000211112211112x05,2222002222000",Coral:"p[0,7,8]0000100012x05,110001000120000121001000112000120110100012000020001010011211112000101001x26,100021100120000221000221112x06,2x05,22120001x05,1000012001x06,1011012001000100101001120122010001100012120022000021001122000020000211112x011,22212x06,",
DeadGoomba:{normal:"p[0,5,9,15]x06,2222x09,x210,000022333222233322022111133331111x218,000x110,x07,x18,x05,x35,0000x35,0",Underworld:"p[0,15,16,18]x06,2222x09,x210,000022111222211122022333311113333x218,000x310,x07,x38,x05,x15,0000x15,0",Castle:["filter",["Solid","DeadGoomba","normal"],"Castle"]},Firework:{normal:"p[0,6,8]x070,2002x010,20222202x09,221122x09,22111122x08,22111122x09,221122x09,20222202x010,2002x070,",n2:"p[0,1,6,8]x020,3x06,3x09,303303x09,x38,x06,303232232303x05,3321221233x06,3221111223x05,3332111123330000333211112333x05,3221111223x06,3321221233x05,303232232303x06,x38,x09,303303x09,3x06,3x020,",n3:"p[0,1,6,8]00030033330030000300x38,003000x35,22x35,00303323233232330300323x26,32300033321211212333033232x16,232x35,22x16,22x36,22x16,22x35,232x16,23233033321211212333000323x26,32300303323233232330300x35,22x35,000300x38,00300003003333003000"},Floor:{normal:"p[2,5,9]2x18,02111121x28,01222201x28,01222201x28,01222201x28,01022201x28,02000021x28,0x15,01x28,01222201x28,01222201x28,012222000x26,01x25,01100222201x25,0121100001x26,0122211101x26,01x26,01x25,002x06,21x06,2",Underworld:"p[2,16,18]1x28,01222212x18,02111102x18,02111102x18,02111102x18,02011102x18,01000012x18,0x25,02x18,02111102x18,02111102x18,021111000x16,02x15,02200111102x15,0212200002x16,0211122202x16,02x16,02x15,001x06,12x06,1",Underwater:{normal:"p[2,12,14]22x112,0221111x29,0011122111222211100122x15,2212221202112222011x25,0211222201x26,021x26,0x25,0221x26,0022201201x26,0000101011112222000100101222122220012011x25,02200122011x25,0200012001x25,001111220012220000122220022x06,2x07,2",Castle:["same",["Solid","Stone","Castle","Underwater"]]},Castle:["same",["Solid","Stone","Castle"]],Alt2:["filter",["Solid","Floor","normal"],"Alt2"]},Pipe:{normal:["multiple","vertical",{top:"p[0,2,13,14]x133,x230,11x35,x26,x319,1122233x26,322x310,2323221122233x26,322x311,232221122233x26,322x310,2323221122233x26,322x311,232221122233x26,322x310,2323221122233x26,322x311,232221122233x26,322x310,2323221122233x26,322x311,232221122233x26,322x310,2323221122233x26,322x311,232221122233x26,322x310,232322x133,00x128,00",middle:"p[0,2,13,14]00122233x25,322x38,2322210000122233x25,322x39,232210000122233x25,322x38,2322210000122233x25,322x39,232210000122233x25,322x38,2322210000122233x25,322x39,232210000122233x25,322x38,2322210000122233x25,322x39,232210000122233x25,322x38,2322210000122233x25,322x39,232210000122233x25,322x38,2322210000122233x25,322x39,232210000122233x25,322x38,2322210000122233x25,322x39,232210000122233x25,322x38,2322210000122233x25,322x39,2322100"}],Castle:{normal:["multiple","vertical",{top:"p[0,1,3,4]x333,x130,33x25,x16,x219,3311122x16,211x210,1212113311122x16,211x211,121113311122x16,211x210,1212113311122x16,211x211,121113311122x16,211x210,1212113311122x16,211x211,121113311122x16,211x210,1212113311122x16,211x211,121113311122x16,211x210,1212113311122x16,211x211,121113311122x16,211x210,121211x333,00x328,00",middle:"p[0,1,3,4]00311122x15,211x28,1211130000311122x15,211x29,121130000311122x15,211x28,1211130000311122x15,211x29,121130000311122x15,211x28,1211130000311122x15,211x29,121130000311122x15,211x28,1211130000311122x15,211x29,121130000311122x15,211x28,1211130000311122x15,211x29,121130000311122x15,211x28,1211130000311122x15,211x29,121130000311122x15,211x28,1211130000311122x15,211x29,121130000311122x15,211x28,1211130000311122x15,211x29,1211300"}],Underwater:["multiple","vertical",{top:"p[0,5,9,17]x133,x230,11x35,x26,x319,1122233x26,322x310,2323221122233x26,322x311,232221122233x26,322x310,2323221122233x26,322x311,232221122233x26,322x310,2323221122233x26,322x311,232221122233x26,322x310,2323221122233x26,322x311,232221122233x26,322x310,2323221122233x26,322x311,232221122233x26,322x310,232322x133,00x128,00",middle:"p[5,9,17,20]33011122x15,211x28,1211103333011122x15,211x29,121103333011122x15,211x28,1211103333011122x15,211x29,121103333011122x15,211x28,1211103333011122x15,211x29,121103333011122x15,211x28,1211103333011122x15,211x29,121103333011122x15,211x28,1211103333011122x15,211x29,121103333011122x15,211x28,1211103333011122x15,211x29,121103333011122x15,211x28,1211103333011122x15,211x29,121103333011122x15,211x28,1211103333011122x15,211x29,1211033"}]},Alt:["same",["Solid","Pipe","Castle"]],Alt2:["same",["Solid","Pipe","Castle"]]},PipeHorizontal:{normal:"p[0,2,13,14]x115,x024,1x213,x122,0001x213,11x220,1001x213,11x220,1001x213,11x220,1001x313,11x221,101x313,11x321,101x213,11x321,101x213,11x221,101x213,11x221,101x213,11x222,11x213,11x222,11x313,11x222,11x213,11x322,11x213,11x222,11x213,11x222,11x213,11x322,11x313,11x322,11x313,11x322,11x313,11x322,11x313,11x322,11x313,11x322,11x313,11x321,101x313,11x321,101x313,11x321,101x313,11323232323232323232323101323232323232311232323232323232323232101232323232323211323232323232323232321001323232323232311x220,1001x213,11x220,1001x213,x122,000x115,x024,",small:"p[0,2,13,14]x115,01x213,111x213,111x213,111x213,111x313,111x313,111x213,111x213,111x213,111x213,111x213,111x313,111x213,111x213,111x213,111x213,111x313,111x313,111x313,111x313,111x313,111x313,111x313,111x313,111x313,111323232323232311123232323232321113232323232323111x213,111x213,x117,0"},PipeVertical:{normal:"p[0,2,13,14]012232x310,223x25,332222100122232x39,223x25,33222210012232x310,223x25,332222100122232x39,223x25,33222210012232x310,223x25,332222100122232x39,223x25,33222210012232x310,223x25,332222100122232x39,223x25,33222210012232x310,223x25,332222100122232x39,223x25,33222210012232x310,223x25,332222100122232x39,223x25,33222210012232x310,223x25,332222100122232x39,223x25,33222210012232x310,223x25,332222100122232x39,223x25,33222210",Castle:{normal:"p[0,1,3,4]00211133x15,311x38,1311120000211133x15,311x39,131120000211133x15,311x38,1311120000211133x15,311x39,131120000211133x15,311x38,1311120000211133x15,311x39,131120000211133x15,311x38,1311120000211133x15,311x39,131120000211133x15,311x38,1311120000211133x15,311x39,131120000211133x15,311x38,1311120000211133x15,311x39,131120000211133x15,311x38,1311120000211133x15,311x39,131120000211133x15,311x38,1311120000211133x15,311x39,1311200",Underwater:"p[0,7,8,17]00122233x25,322x38,2322210000122233x25,322x39,232210000122233x25,322x38,2322210000122233x25,322x39,232210000122233x25,322x38,2322210000122233x25,322x39,232210000122233x25,322x38,2322210000122233x25,322x39,232210000122233x25,322x38,2322210000122233x25,322x39,232210000122233x25,322x38,2322210000122233x25,322x39,232210000122233x25,322x38,2322210000122233x25,322x39,232210000122233x25,322x38,2322210000122233x25,322x39,2322100"}},Platform:{normal:"p[0,1,6,9]x18,x38,220000222x05,322x05,32223333x210,x38,",Sky:"p[0,1,6]001111000x15,2012x15,212x15,212211112112211220111122000222200"},RestingStone:["same",["Solid","Stone"]],Springboard:{Alt2:["multiple","vertical",{top:"p[8]x032,",topheight:1,middle:"p[0,1,6]x05,110011x010,210012x010,200002x010,200002x09,2x06,2x08,2x06,2x08,2x06,2x07,2x08,2x05,12x08,21000011x08,11000011x08,11000012x08,21x05,2x08,2x07,2x06,2x08,2x06,2x08,2x06,2x09,200002x010,200002x010,210012x010,110011x05,",middleStretch:!0,bottom:"p[4,8,3]x132,x27,0x27,0x27,0x27,x017,2220x27,0x27,0x27,0x27,0x27,02222x016,",bottomheight:4}],normal:["multiple","vertical",{top:"p[8]x032,",topheight:1,middle:"p[0,1,6]x05,110011x010,210012x010,200002x010,200002x09,2x06,2x08,2x06,2x08,2x06,2x07,2x08,2x05,12x08,21000011x08,11000011x08,11000012x08,21x05,2x08,2x07,2x06,2x08,2x06,2x08,2x06,2x09,200002x010,200002x010,210012x010,110011x05,",middleStretch:!0,bottom:"p[2,8,9]x132,x27,0x27,0x27,0x27,x017,2220x27,0x27,0x27,0x27,0x27,02222x016,",bottomheight:4}]},Stone:{normal:"p[2,5,9]2x114,012x112,00112x110,0001112x18,00001111x28,00001111x28,00001111x28,00001111x28,00001111x28,00001111x28,00001111x28,00001111x28,0000111x09,200011x011,2001x013,2x016,2",Underwater:{normal:["same",["Solid","Floor","Underwater","normal"]],Castle:["same",["Solid","Stone","Castle","Underwater"]]},Underworld:["filter",["Solid","Stone","normal"],"Underworld"],Castle:{normal:"p[1,2,3,4]0031x06,31000022310x25,310x25,310x25,310x25,310x25,310x25,310x25,310x25,310x25,3102223331x37,13333x116,x06,31x06,310x25,310x25,310x25,310x25,310x25,310x25,310x25,310x25,310x25,310x25,31x37,1x37,x117,",Underwater:"p[2,3,14,20]1103x16,03111122031x25,031x25,031x25,031x25,031x25,031x25,031x25,031x25,031x25,0312220003x07,30000x316,x16,03x16,031x25,031x25,031x25,031x25,031x25,031x25,031x25,031x25,031x25,031x25,03x07,3x07,x317,"},Sky:"p[0,1,2]000x210,x05,2x110,20002x112,2002x112,2002x112,202x114,22x15,2112x15,22x15,2112x15,22x15,2112x15,22x114,2212x110,2120211121111211120021111222211112002x112,2000211112211112x05,2222002222000",Alt:["filter",["Solid","Stone","normal"],"Alt"],Alt2:["filter",["Solid","Stone","normal"],"Alt2"]},ShroomTop:["multiple","horizontal",{left:"p[0,2,6,8]000x113,001x36,x27,01x37,x27,01x37,x27,1x38,x27,1x37,x28,1x37,222333221x36,222x35,21x35,222x37,1x28,x37,1x28,x37,1x29,x35,21x210,333221x215,011x213,000x113,",middle:"p[2,6,8]x016,1x28,x18,x28,x19,x26,x132,x25,x110,x27,x19,x27,x18,x29,x17,x29,x17,x29,x17,x29,x18,x27,x19,x27,x110,x25,111x016,",right:"p[0,2,6,8]x113,000x38,x25,100x38,x26,10x38,x26,10x38,222333212x36,222x35,1223333222x36,1x29,x36,1x29,x36,1x210,x35,1x211,33321x215,1x215,1x215,1x214,x117,0"}],TreeTop:{normal:["multiple","horizontal",{left:"p[0,2,13]00x114,011x213,01x214,11x214,1x215,1x215,1x215,1x215,1x215,1x215,1x215,1x215,1x215,1x26,1x27,1012222101x25,10001111000x15,00",middle:"p[2,8,13]x016,x2199,0x27,00x25,010x25,011x05,111x05,11",right:"p[0,2,13]x114,00x213,110x214,10x214,11x215,1x215,1x215,1x215,1x215,1x215,1x215,1x215,1x215,11x27,1x26,101x25,10122221000x15,000111100"}],Alt:["multiple","horizontal",{left:"p[0,1,4]00x214,022x113,02x114,22x114,2x115,2x115,2x115,2x115,2x115,2x115,2x115,2x115,2x115,2x16,2x17,2021111202x15,20002222000x25,00",middle:"p[1,3,4]x216,x0199,2x07,22x05,212x05,211x25,111x25,11",right:"p[0,1,4]x213,000x113,200x114,20x114,20x115,2x115,2x115,2x115,2x115,2x115,2x115,2x115,2x115,22x17,2x16,202x15,20211112000x25,000222200"}],Alt2:["same",["Solid","TreeTop","Alt"]]},TreeTrunk:["same",["Scenery","TreeTrunk"]],WaterBlock:"20"},Scenery:{BrickHalf:{normal:"p[2,9]x17,0x17,0x17,0x17,0x17,0x17,x017,1110x17,0x17,0x17,0x17,0x17,01111x016,",Alt2:["filter",["Scenery","BrickHalf","normal"],"Alt2"]},BrickPlain:{normal:"p[2,9]x17,0x17,0x17,0x17,0x17,0x17,x017,1110x17,0x17,0x17,0x17,0x17,01111x016,x17,0x17,0x17,0x17,0x17,0x17,x017,1110x17,0x17,0x17,0x17,0x17,01111x016,x17,0x17,0",Alt2:["filter",["Scenery","BrickPlain","normal"],"Alt2"]},BridgeBase:"p[0,2,5,9]111000112221012222x35,222x35,222x35,222x35,22221012211100011",Bush1:"p[0,2,13,14]x014,1111x027,122221x024,11x26,1x022,1x28,101x020,1x29,121x019,1x26,3x25,1x017,122233222322221x016,12223x210,1x013,111x216,1001x08,1x219,10121x06,1x221,1221x06,x225,1010011x226,1211x230,11x230,101x228,10",Bush2:"p[0,2,13,14]x014,1111x012,1111x027,122221x010,122221x024,11x26,1x07,11x26,1x022,1x28,10100001x28,101x020,1x29,1210001x29,121x019,1x26,3x25,1001x26,3x25,1x017,1222332223222210122233222322221x016,12223x210,112223x210,1x013,111x232,1001x08,1x235,10121x06,1x237,1221x06,x241,1010011x242,1211x246,11x246,101x244,10",Bush3:"p[0,2,13,14]x014,1111x012,1111x012,1111x027,122221x010,122221x010,122221x024,11x26,1x07,11x26,1x07,11x26,1x022,1x28,10100001x28,10100001x28,101x020,1x29,1210001x29,1210001x29,121x019,1x26,3x25,1001x26,3x25,1001x26,3x25,1x017,12223322232222101222332223222210122233222322221x016,12223x210,112223x210,112223x210,1x013,111x248,1001x08,1x251,10121x06,1x253,1221x06,x257,1010011x258,1211x262,11x262,101x260,10",CastleBridge:"p[1,2,4,9]10001000100010001000100010001000122212223222322232223222322232223222322232223222322232221222122213331333133313331333133313331333",CastleChain:"p[0,1,3]x014,1x013,1x014,22x011,12x013,22x011,12x012,102x012,22x011,12x012,102x012,22x011,12x013,22x011,12x012,102x012,22x013,",CastleDoor:{normal:"p[2,9]x17,0x17,0x17,0x17,0x17,0x17,x017,1110x17,0x17,0x17,0x17,0x17,01111x016,x15,x06,11110111x010,11011x012,1x017,1x014,11x014,1x0416,",Alt2:["filter",["Scenery","CastleDoor","normal"],"Alt2"]},CastleFlag:"p[0,1,6,8]02x011,222x011,2x012,3x111,03x15,3x15,03x15,3x15,0311x37,1103111x35,11103111133311110311133133111031113111311103x111,03x012,3x012,3x012,3x012,3x012,3x012,3x012,3x011,",CastleRailing:{normal:"p[0,2,5,9]2222x07,x25,3332x07,2x37,2x07,2x37,2x07,2x37,2x07,2x37,2x07,2x37,2x07,23333111x29,1111",Alt2:["filter",["Scenery","CastleRailing","normal"],"Alt2"]},CastleRailingFilled:{normal:"p[2,5,9]11112220222x15,222122202221x27,122202221x27,1x07,1x27,1x27,1x27,1x27,1x27,1x27,12222000x19,0000",Alt2:["filter",["Scenery","CastleRailingFilled","normal"],"Alt2"]},CastleTop:{normal:"p[2,9]x17,0x17,0x17,0x17,0x17,0x17,0x17,0x17,0x17,x025,1110x17,0x17,0x17,0x17,0x17,0x17,0x17,0x17,01111x024,x17,x09,x17,0x17,x09,x17,0x17,x09,x17,x025,11101111x08,1110x17,01111x08,1110x17,01111x08,11101111x024,x17,x09,x17,0x17,x09,x17,0x17,x09,x17,x025,11101111x08,1110x17,01111x08,1110x17,01111x08,11101111x024,",Alt2:["filter",["Scenery","CastleTop","normal"],"Alt2"]},CastleWall:{normal:"p[0,2,5,9]2222x07,x25,3332x07,2x37,2x07,2x37,2x07,2x37,2x07,2x37,2x07,2x37,2x07,23333111x29,1111x37,1x37,1x37,1x37,1x37,1x37,x117,3331x37,1x37,1x37,1x37,1x37,13333x116,x37,1x37,1x37,1x37,1x37,1x37,x117,3331x37,1x37,1x37,1x37,1x37,13333x116,x37,1x37,1x37,1x37,1x37,1x37,x117,3331x37,1x37,1x37,1x37,1x37,13333x116,x37,1x37,1x37,1x37,1x37,1x37,x117,3331x37,1x37,1x37,1x37,1x37,13333x116,x37,1x37,1x37,1x37,1x37,1x37,x117,3331x37,1x37,1x37,1x37,1x37,13333x116,x37,1x37,1x37,1x37,1x37,1x37,x117,3331x37,1x37,1x37,1x37,1x37,13333x116,x37,1x37,1x37,1x37,1x37,1x37,x117,3331x37,1x37,1x37,1x37,1x37,13333x116,x37,1x37,1x37,1x37,1x37,1x37,x117,3331x37,1x37,1x37,1x37,1x37,13333x116,x37,1x37,1x37,1x37,1x37,1x37,x117,3331x37,1x37,1x37,1x37,1x37,13333x116,x37,1x37,1x37,1x37,1x37,1x37,x117,3331x37,1x37,1x37,1x37,1x37,13333x116,x37,1x37,1x37,1x37,1x37,1x37,x117,3331x37,1x37,1x37,1x37,1x37,13333x116,",Alt2:["filter",["Scenery","CastleWall","normal"],"Alt2"]},Cloud1:{normal:"p[0,1,2,19]x014,2222x027,211112x024,22x16,2x022,2x18,202x020,2x19,212x019,2x16,3x15,2x017,211133111311112x016,21113x110,2x013,222x116,2002x08,2x119,20212x06,2x121,2112x06,x125,2020022x126,2122x130,22x130,202x128,20002113x111,3x111,2x05,2113113x16,3x113,2x05,2113333111333311113x18,200002x15,x36,1x35,x19,x06,2221111331111333x18,22x09,2x16,2x18,21122x012,221112022111122022x016,22200002222x010,",Alt2:["filter",["Scenery","Cloud1","normal"],"Alt2"]},Cloud2:{normal:"p[0,1,2,19]x014,2222x012,2222x027,211112x010,211112x024,22x16,2x07,22x16,2x022,2x18,20200002x18,202x020,2x19,2120002x19,212x019,2x16,3x15,2002x16,3x15,2x017,2111331113111120211133111311112x016,21113x110,221113x110,2x013,222x132,2002x08,2x135,20212x06,2x137,2112x06,x141,2020022x142,2122x146,22x146,202x144,20002113x111,3x115,3x111,2x05,2113113x16,3x18,3x16,3x113,2x05,21133331113333111131333111333311113x18,200002x15,x36,1x35,1111x36,1x35,x19,x06,2221111331111333x17,331111333x18,22x09,2x16,2x18,2x16,2x18,21122x012,2211120221111220221112022111122022x016,22200002222x05,22200002222x010,",Alt2:["filter",["Scenery","Cloud2","normal"],"Alt2"]},Cloud3:{normal:"p[0,1,2,19]x014,2222x012,2222x012,2222x027,211112x010,211112x010,211112x024,22x16,2x07,22x16,2x07,22x16,2x022,2x18,20200002x18,20200002x18,202x020,2x19,2120002x19,2120002x19,212x019,2x16,3x15,2002x16,3x15,2002x16,3x15,2x017,21113311131111202111331113111120211133111311112x016,21113x110,221113x110,221113x110,2x013,222x148,2002x08,2x151,20212x06,2x153,2112x06,x157,2020022x158,2122x162,22x162,202x160,20002113x111,3x115,3x115,3x111,2x05,2113113x16,3x18,3x16,3x18,3x16,3x113,2x05,211333311133331111313331113333111131333111333311113x18,200002x15,x36,1x35,1111x36,1x35,1111x36,1x35,x19,x06,2221111331111333x17,331111333x17,331111333x18,22x09,2x16,2x18,2x16,2x18,2x16,2x18,21122x012,22111202211112202211120221111220221112022111122022x016,22200002222x05,22200002222x05,22200002222x010,",Alt2:["filter",["Scenery","Cloud3","normal"],"Alt2"]},Fence:"p[0,2,5,9]000023222331x08,2322333100003322232233312222333323223331333311112322333x15,000023223331x08,23223331x08,23232331x08,23232331x08,2323233100003322232323312222333323232331333311112322233x15,000023222331x08,23222331x08,232223310000",Flag:{normal:"p[0,1,14]x116,0x18,x25,1100x16,22121221000x15,211211210000111121222121x05,11122212221x06,11x27,1x07,111222111x08,x18,x09,x17,x010,x16,x011,x15,x012,1111x013,111x014,11x015,1",Alt:"p[0,5,16]x116,0x18,x25,1100x16,22121221000x15,211211210000111121222121x05,11122212221x06,11x27,1x07,111222111x08,x18,x09,x17,x010,x16,x011,x15,x012,1111x013,111x014,11x015,1",Alt2:["same",["Scenery","Flag","Alt"]]},FlagPole:{normal:"p[13]x0288,",Alt:"p[1]x0288,",Alt2:["same",["Scenery","FlagPole","Alt"]],Shrooms:"x06888,"},FlagTop:{normal:"p[0,2,13,14]001111000123331012x35,112x35,11x36,11x36,10133331000111100",Alt:"p[0,1,3,4]002222000213332021x35,221x35,22x36,22x36,20233332000222200",Alt2:["same",["Scenery","FlagTop","Alt"]],Shrooms:"p[0,2,6,8]001111000123331012x35,112x35,11x36,11x36,10133331000111100"},HillLarge:"p[0,2,14]x037,x16,x071,111x26,111x066,11x212,11x063,1x213,1221x061,1x213,111221x059,1x214,1112221x057,1x215,11122221x055,1x213,112111x25,1x053,1x214,11221x27,1x051,1x215,11x211,1x049,1x216,11x212,1x047,1x232,1x045,1x234,1x043,1x236,1x041,1x238,1x039,1x240,1x037,1x242,1x035,1x244,1x033,1x246,1x031,1x213,1x223,1x210,1x029,1x213,111x221,111x210,1x027,1x214,111x221,111x211,1x025,1x215,111x221,111x212,1x023,1x213,112111x218,112111x213,1x021,1x214,11221x219,11221x215,1x019,1x215,11x222,11x219,1x017,1x216,11x222,11x220,1x015,1x264,1x013,1x266,1x011,1x268,1x09,1x270,1x07,1x272,1x05,1x274,10001x276,101x278,1",HillSmall:"p[0,2,14]x021,x16,x039,111x26,111x034,11x212,11x031,1x213,1221x029,1x213,111221x027,1x214,1112221x025,1x215,11122221x023,1x213,112111x25,1x021,1x214,11221x27,1x019,1x215,11x211,1x017,1x216,11x212,1x015,1x232,1x013,1x234,1x011,1x236,1x09,1x238,1x07,1x240,1x05,1x242,10001x244,101x246,1",Peach:"p[0,1,2,6,8]x051,303303x010,x36,x09,x48,x07,x410,x07,4443234444x07,433233434x06,x37,434x07,x38,44x05,3444x35,44x05,34433334444x06,x36,4444x06,4413341444x05,44133111144x05,431111331440000x39,144x05,x37,1444x07,44111144x07,x110,x05,x112,0000x112,0001111x46,111100x414,00x45,1111x45,0",PlatformString:{normal:"x008,",Castle:"x018,"},PlantLarge:{normal:"p[0,2,5,13]x06,1111x010,11333311x07,1x38,1x05,1x310,10001x312,1001x312,101x314,11x314,11x314,11x314,11x314,11x314,11x314,11x314,11x314,11x314,11x314,11x314,11x314,11x314,11x314,11x314,101x312,1001x312,1001x312,10001x310,1000011x38,11x05,1113333111x07,x18,x09,x17,x08,1x26,1x08,12222121x08,12222121x08,12222121x08,12222121x08,11222211x09,121121x09,12122121x08,1x26,1x08,12222121x08,12222121x08,12222121x08,12222121x08,11222211x09,121121x09,121221210000",Alt:"p[0,1,2,3,5]x06,3333x010,33111133x07,3x18,3x05,3x110,30003x112,3003x112,303x114,33x114,33x114,33x114,33x114,33x114,33x114,33x114,33x114,33x114,33x114,33x114,33x114,33x114,33x114,33x114,303x112,3003x112,3003x112,30003x110,3000033x18,33x05,3331111333x07,x38,x09,x37,x08,2x46,2x08,24444242x08,24444242x08,24444242x08,24444242x08,22444422x09,242242x09,24244242x08,2x46,2x08,24444242x08,24444242x08,24444242x08,24444242x08,22444422x09,242242x09,242442420000",Alt2:["same",["Scenery","PlantLarge","Alt"]]},PlantSmall:{normal:"p[0,2,5,13]x05,1111x08,11333311x05,1x38,10001x310,101x312,11x312,11x312,11x312,11x312,101x310,10011x38,110001113333111x05,x18,x07,x17,x06,1x26,1x06,12222121x06,12222121x06,12222121x06,12222121x06,11222211x07,121121x07,12122121x06,1x26,1x06,12222121x06,12222121x06,12222121x06,12222121x06,11222211x07,121121x07,12122121000",Alt:"p[0,1,2,3,5]x05,3333x08,33111133x05,3x18,30003x110,303x112,33x112,33x112,33x112,33x112,303x110,30033x18,330003331111333x05,x38,x07,x37,x06,2x46,2x06,24444242x06,24444242x06,24444242x06,24444242x06,22444422x07,242242x07,24244242x06,2x46,2x06,24444242x06,24444242x06,24444242x06,24444242x06,22444422x07,242242x07,24244242000",Alt2:["same",["Scenery","PlantSmall","Alt"]]},Railing:{normal:"p[0,2,13]2x06,221x05,12010001220100012200111022x06,22x06,22x06,2",Night:"p[0,1,3]1x06,112x05,21020002110200021100222011x06,11x06,11x06,1"},ShroomTrunk:["multiple","vertical",{top:"p[2,5,9]0x114,00x114,00x114,00x114,00x114,00111121111211110021121211212112001221112211122100x114,00x114,00x114,00x114,00x114,00x114,00x114,00x114,0",middle:"p[2,5]0x114,00x114,00x114,00x114,00x114,00x114,00x114,00x114,00x114,00x114,00x114,00x114,00x114,00x114,00x114,00x114,0"}],String:{normal:"x058,",Alt2:"x018,"},StringCornerLeft:{normal:"p[0,5,9]000x17,00x18,0111222000011x25,00112220222011220002201122202220110x25,00110022200011x08,",Alt2:"p[0,1,3,4]000x17,00x18,0111222000011x25,00112223222011223332201122232220110x25,00110022200011x08,"},StringCornerRight:{normal:"p[0,5,9]x17,000x18,x05,222111000x25,11002220222110220002211022202221100x25,0110002220011x08,11",Alt2:"p[0,1,3,4]x17,000x18,x05,222111000x25,11002223222110223332211022232221100x25,0110002220011x08,11"},Toad:"p[0,1,2,6,8]x038,1111x010,x18,x06,144411114441000114441441444110011441444414411044111144441111x45,1114444111x46,1111441111x46,x110,x45,1133233233114401143323323341100300x38,00303330333223330x37,443333443333003x410,300004444333344440000444x36,4440000444x36,444x05,x110,x05,x112,000444x18,444041444x16,4441x47,1111x412,1111x46,",TreeTrunk:{normal:"p[2,9]x112,0x17,0x17,0x16,0x17,0x17,0x112,",Underworld:["filter",["Scenery","TreeTrunk","normal"],"Underworld"],Alt2:["filter",["Scenery","TreeTrunk","normal"],"Alt2"]},Water:{normal:["multiple","vertical",{top:"p[0,1,17]x028,1x06,121000012210011222100x26,1121x26,1212222122122112",middle:"p[17]x088,"}],Underwater:["multiple","vertical",{top:"p[1,17,0]x212,0x26,010222201102200111022x16,0010x16,010111101101100x19,",middle:"p[17]x088,"}],Night:["multiple","vertical",{top:"p[2,1,19]x028,1x06,121000012210011222100x26,1121x26,1212222122122112",middle:"p[19]x088,"}],Castle:{normal:["multiple","vertical",{top:"p[0,1,8]x028,1x06,121000012210011222100x26,1121x26,1212222122122112",middle:"p[8]x088,"}],Underwater:["multiple","vertical",{top:"p[1,17,20]x212,0x26,010222201102200111022x16,0010x16,010111101101100x19,",middle:"p[20]x088,"}]}}},Text:{DecorativeBack:["multiple","corners",{top:"x054,",topRight:"00",right:"x024,",bottomRight:"00",bottom:"x024,",bottomLeft:"00",left:"x054,",topLeft:"00",middle:"x094,"}],DecorativeDot:"p[0,2,22]220221011",TextA:"p[0,1]00111000110110110001111000x111,000111100011",TextB:"p[0,1]x16,0110001111000x18,0110001111000x18,0",TextC:"p[0,1]0011110011001111x05,11x05,11x06,1100110011110",TextD:"p[0,1]x15,0011001101100011110001111000111100110x15,00",TextE:"p[0,1]x19,x05,11x05,x16,011x05,11x05,x17,",TextF:"p[0,1]x19,x05,11x05,x16,011x05,11x05,11x05,",TextG:"p[0,1]0011110011001111x05,1100x15,00011011001100x15,",TextH:"p[0,1]1100011110001111000x111,0001111000111100011",TextI:"p[0,1]0x16,00011x05,11x05,11x05,11x05,11000x16,",TextK:"p[0,1]1100011110011011011001111000x15,0011011101100111",TextL:"p[0,1]011x05,11x05,11x05,11x05,11x05,11x05,x16,",TextM:"p[0,1]11000x15,0x119,0101111000111100011",TextN:"p[0,1]11000x15,00x16,0x111,0x16,00x15,00011",TextO:"p[0,1]0x15,0110001111000111100011110001111000110x15,0",TextP:"p[0,1]x16,01100011110001111000x18,011x05,11x05,",TextQ:"p[0,1]0x15,0110001111000111100011110x16,001100111101",TextR:"p[0,1]x16,0110001111000111100x18,0011011101100111",TextS:"p[0,1]0111100110011011x06,x15,x06,1111000110x15,0",TextT:"p[0,1]0x16,00011x05,11x05,11x05,11x05,11x05,1100",TextU:"p[0,1]1100011110001111000111100011110001111000110x15,0",TextV:"p[0,1]1100011110001111000x15,01110x15,000111x05,1000",TextW:"p[0,1]1100011110001111010x119,0x15,00011",TextY:"p[0,1]011001101100110110011001111000011x05,11x05,1100",Text0:"",Text1:"p[0,1]001100011100001100001100001100001100x16,",Text2:"p[0,1]0x15,011000110000111001111001111001110000x17,",Text3:"p[0,1]0x16,00001100001100001111x06,1111000110x15,0",Text4:"p[0,1]0001110001111001101101100110x17,000011x05,110",Text5:"p[0,1]x16,011x05,x16,x06,11x05,1111000110x15,0",Text6:"p[0,1]0011110011000011x05,x16,0110001111000110x15,0",Text7:"p[0,1]x19,00011000011000011000011x05,11x05,11000",Text8:"p[0,1]0x15,0110001111000110x15,0110001111000110x15,0",Text9:"p[0,1]0x15,0110001111000110x16,x05,1100001100111100",TextPeriod:"p[0,1]x032,11000110",TextExclamationMark:"p[0,1]00110011110111101111001100011x08,110",TextColon:"p[0,1]x06,1100011x08,1100011x012,",TextSlash:"p[0,1]x06,1x05,1x05,1x05,1x05,1x05,1x05,1x06,",Text1up:"p[0,1]0110011001011110111001100101100101100110010110010110011001011001011001100101111001100x15,0110001111001110011000",Text100:"p[0,1]001000100010011001010101001001010101001001010101001001010101001001010101011101110111011100100010",Text200:"p[0,1]01100010001010010101010100010101010100100101010101000101010110000101010x15,01110x17,00100010",Text400:"p[0,1]10100010001010100101010110100101010110100101010x15,0101010x15,01010101001001110111001000100010",Text500:"p[0,1]11110010001010000101010110000101010111100101010100010101010100010101010x15,01110x16,000100010",Text800:"p[0,1]011000100010100101010101010101010101011001010101101101010101100101010101100101110111011000100010",Text1000:"p[0,1]00100010001000100110010101010101001001010101010100100101010101010010010101010101001001010101010101110111011101110111001000100010",Text2000:"p[0,1]01100010001000101001010101010101000101010101010100100101010101010100010101010101100001010101010x15,011101110x17,001000100010",Text4000:"p[0,1]101000100010001010100101010101011010010101010101101001010101010x15,01010101010x15,01010101010100100111011101110010001000100010",Text5000:"p[0,1]11110010001000101000010101010101100001010101010111100101010101010001010101010101000101010101010x15,011101110x16,0001000100010",Text8000:"p[0,1]01100010001000101001010101010101010101010101010101100101010101011011010101010101100101010101010110010111011101110110001000100010",TextColoredCopyright:"p[0,22]0011110001000010100110011010000110100001100110010100001000111100",TextColoredD:"p[0,22]x15,0011001101100011110001111000111100110x15,00",TextColoredE:"p[0,22]x19,x05,11x05,x16,011x05,11x05,x17,",TextColoredI:"p[0,22]0x16,00011x05,11x05,11x05,11x05,11000x16,",TextColoredN:"p[0,22]11000x15,00x16,0x111,0x16,00x15,00011",TextColoredO:"p[0,22]0x15,0110001111000111100011110001111000110x15,0",TextColoredT:"p[0,22]0x16,00011x05,11x05,11x05,11x05,11x05,1100",TextColored1:"p[0,22]001100011100001100001100001100001100x16,",TextColored5:"p[0,22]x16,011x05,x16,x06,11x05,1111000110x15,0",TextColored8:"p[0,22]0x15,0110001111000110x15,0110001111000110x15,0",TextColored9:"p[0,22]0x15,0110001111000110x16,x05,1100001100111100",TextLargeE:"p[0,2,22]000x211,000x212,000x212,00x213,00x213,1x214,1x214,1x214,1x26,x19,x26,1x26,11x26,1x26,11x26,1x26,11x26,1x26,00x26,1x26,10x26,1x26,10x26,10x16,0x214,0x214,0x214,00x213,00x213,101x212,101x212,1001x211,100x113,000x112,000x112,0000x111,",TextLargeP:"p[0,2,22]x211,0000x212,000x212,000x213,00x213,00x214,0x214,0x214,0x26,1x27,1x26,1x27,1x26,1x27,1x26,1x26,11x26,1x26,11x26,1x25,111x26,1x25,111x26,122221110x26,10x16,0x26,10x15,00x26,10x15,00x26,101111000x26,1x08,x26,1x08,x26,1x08,x26,1x09,x16,x09,x16,x09,x16,x09,x16,x08,",TextLargeR:"p[0,2,22]x211,0000x212,000x212,000x213,00x213,00x214,0x214,0x214,0x26,1x27,1x26,1x27,1x26,1x27,1x26,1x26,11x26,1x25,111x26,1x26,11x26,1x27,1x26,1x27,0x26,10x26,0x26,10x26,0x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,10x16,00x16,0x16,00x16,0x16,00x16,0x16,00x16,",TextLargeS:"p[0,2,22]000x28,x06,x210,x05,x210,0000x212,000x212,00x214,0x214,0x214,0x27,x17,0x28,x17,0x29,x15,0x211,11101x211,000111x29,00001111x28,000x16,x26,0x214,0x214,0x214,10x212,110x212,1101x210,11101x210,111001x28,111000x112,0000x110,x05,x110,x06,x18,000",TextLargeU:"p[0,2,22]x26,00x26,0x26,00x26,0x26,00x26,0x26,00x26,0x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x214,1x214,1x214,10x212,110x212,1101x210,11101x210,111001x28,111000x112,0000x110,x05,x110,x06,x18,000",TextHugeA:"p[0,2,22]000x28,x06,x210,x05,x210,0000x212,000x212,00x214,0x214,0x214,0x26,11x26,1x26,11x26,1x26,11x26,1x26,11x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x214,1x214,1x214,1x214,1x214,1x214,1x214,1x214,1x26,11x26,1x26,11x26,1x26,11x26,1x26,11x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,10x16,00x16,0x16,00x16,0x16,00x16,0x16,00x16,",TextHugeB:"p[0,2,22]x211,0000x212,000x212,000x213,00x213,00x214,0x214,0x214,0x26,11x26,1x26,11x26,1x26,11x26,1x26,11x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,1x27,1x26,1x27,1x26,1x27,1x26,1x26,11x26,1x25,111x26,1x26,11x26,1x27,1x26,1x27,0x26,11x26,0x26,11x26,0x26,11x26,1x26,11x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,1x27,1x26,1x27,1x26,1x27,1x26,1x26,11x26,1x26,11x26,1x25,111x26,1x25,111x26,1222211100x16,0x16,00x16,0x15,000x16,0x15,000x16,01111000",TextHugeI:"p[0,2,22]x26,0x26,0x26,0x26,0x26,1x26,1x26,1x26,1x26,1x26,1x26,1x26,1x26,1x26,1x26,1x26,1x26,1x26,1x26,1x26,1x26,1x26,1x26,1x26,1x26,1x26,1x26,1x26,1x26,1x26,1x26,1x26,1x26,1x26,1x26,1x26,1x26,1x26,1x26,1x26,10x16,0x16,0x16,0x16,",TextHugeM:"p[0,2,22]000x25,x06,x25,x06,x27,0000x27,x05,x27,0000x27,0000x29,00x29,000x29,00x29,00x222,0x222,0x222,0x26,11x26,11x26,1x26,11x26,11x26,1x26,11x26,11x26,1x26,11x26,11x26,1x26,10x26,10x26,1x26,10x26,10x26,1x26,10x26,10x26,1x26,10x26,10x26,1x26,10x26,10x26,1x26,10x26,10x26,1x26,10x26,10x26,1x26,10x26,10x26,1x26,10x26,10x26,1x26,10x26,10x26,1x26,10x26,10x26,1x26,10x26,10x26,1x26,10x26,10x26,1x26,10x26,10x26,1x26,10x26,10x26,1x26,10x26,10x26,1x26,10x26,10x26,1x26,10x26,10x26,1x26,10x26,10x26,1x26,10x26,10x26,1x26,10x26,10x26,1x26,10x26,10x26,1x26,10x26,10x26,1x26,10x26,10x26,1x26,10x26,10x26,1x26,10x26,10x26,1x26,10x26,10x26,1x26,10x26,10x26,10x16,00x16,00x16,0x16,00x16,00x16,0x16,00x16,00x16,0x16,00x16,00x16,",TextHugeO:"p[0,2,22]000x28,x06,x210,x05,x210,0000x212,000x212,00x214,0x214,0x214,0x26,11x26,1x26,11x26,1x26,11x26,1x26,11x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x214,1x214,1x214,10x212,110x212,1101x210,11101x210,111001x28,111000x112,0000x110,x05,x110,x06,x18,000",TextHugeR:"p[0,2,22]x211,0000x212,000x212,000x213,00x213,00x214,0x214,0x214,0x26,11x26,1x26,11x26,1x26,11x26,1x26,11x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,1x27,1x26,1x27,1x26,1x27,1x26,1x26,11x26,1x25,111x26,1x26,11x26,1x27,1x26,1x27,0x26,10x26,0x26,10x26,0x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,10x16,00x16,0x16,00x16,0x16,00x16,0x16,00x16,",TextHugeS:"p[0,2,22]000x28,x06,x210,x05,x210,0000x212,000x212,00x214,0x214,0x214,0x26,11x26,1x26,11x26,1x26,11x26,1x26,11x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x27,00x16,x28,0x16,0x29,x15,0x211,11101x211,000111x29,00001111x28,000x16,x26,0x26,11x26,0x26,11x26,0x26,01x26,1x26,01x26,1x26,10x26,1x26,10x26,1x26,10x26,1x26,10x26,1x214,1x214,1x214,10x212,110x212,1101x210,11101x210,111001x28,111000x112,0000x110,x05,x110,x06,x18,000",TextHugePeriod:"p[0,2,22]x0224,x26,0x26,0x26,0x26,0x26,1x26,1x26,1x26,10x16,0x16,0x16,0x16,"}}};
PlayMarioJas.PlayMarioJas.settings.touch = {
    "enabled": false,
    "styles": {
        "Button": {
            "elementInner": {
                "style": {
                    "padding": ".385cm",
                    "width": "1.4cm",
                    "height": "1.4cm",
                    "border": "4px solid rgb(238, 238, 238)",
                    "borderRadius": "100%",
                    "background": "rgb(175, 175, 175)",
                    "textAlign": "center",
                    "cursor": "pointer"
                }
            }
        },
        "Joystick": {
            "elementInner": {
                "style": {
                    "width": "3.5cm",
                    "height": "3.5cm"
                }
            },
            "circle": {
                "style": {
                    "top": "21%",
                    "right": "21%",
                    "bottom": "21%",
                    "left": "21%",
                    "boxShadow": "0 0 1px 4px rgb(238, 238, 238)",
                    "background": "rgb(175, 175, 175)",
                    "borderRadius": "100%",
                    "cursor": "pointer"
                }
            },
            "tick": {
                "style": {
                    "width": ".28cm",
                    "height": "4px",
                    "background": "rgb(238, 238, 238)"
                }
            },
            "dragLine": {
                "style": {
                    "width": ".49cm",
                    "height": "4px",
                    "background": "rgb(210, 210, 210)",
                    "transition": "117ms opacity"
                }
            },
            "dragShadow": {
                "style": {
                    "background": "rgba(231, 231, 231, .84)",
                    "boxShadow": "0 0 7px 3px rgba(175, 175, 175, .7)",
                    "transition": "117ms all"
                }
            }
        }
    },
    "controls": [
        {
            "name": "Joystick",
            "control": "Joystick",
            "position": {
                "vertical": "bottom",
                "horizontal": "left",
                "offset": {
                    "left": "0",
                    "top": "-3.5cm"
                }
            },
            "directions": [
                {
                    "name": "Up",
                    "degrees": 0,
                    "neighbors": ["UpLeft", "UpRight"]
                },
                {
                    "name": "UpRight",
                    "degrees": 45,
                    "neighbors": ["Up", "Right"],
                    "pipes": {
                        "activated": {
                            "onkeydown": ["right"]
                        },
                        "deactivated": {
                            "onkeyup": ["right"]
                        }
                    }
                },
                {
                    "name": "Right",
                    "degrees": 90,
                    "neighbors": ["UpRight", "DownRight"],
                    "pipes": {
                        "activated": {
                            "onkeydown": ["right"]
                        },
                        "deactivated": {
                            "onkeyup": ["right"]
                        }
                    }
                },
                {
                    "name": "DownRight",
                    "degrees": 135,
                    "neighbors": ["Right", "Down"],
                    "pipes": {
                        "activated": {
                            "onkeydown": ["down", "right"]
                        },
                        "deactivated": {
                            "onkeyup": ["down", "right"]
                        }
                    }
                },
                {
                    "name": "Down",
                    "degrees": 180,
                    "neighbors": ["DownRight", "DownLeft"],
                    "pipes": {
                        "activated": {
                            "onkeydown": ["down"]
                        },
                        "deactivated": {
                            "onkeyup": ["down"]
                        }
                    }
                },
                {
                    "name": "DownLeft",
                    "degrees": 225,
                    "neighbors": ["Down", "left"],
                    "pipes": {
                        "activated": {
                            "onkeydown": ["down", "left"]
                        },
                        "deactivated": {
                            "onkeyup": ["down", "left"]
                        }
                    }
                },
                {
                    "name": "Left",
                    "degrees": 270,
                    "neighbors": ["DownLeft", "UpLeft"],
                    "pipes": {
                        "activated": {
                            "onkeydown": ["left"]
                        },
                        "deactivated": {
                            "onkeyup": ["left"]
                        }
                    }
                },
                {
                    "name": "UpLeft",
                    "degrees": 315,
                    "neighbors": ["Left", "Up"],
                    "pipes": {
                        "activated": {
                            "onkeydown": ["left"]
                        },
                        "deactivated": {
                            "onkeyup": ["left"]
                        }
                    }
                }
            ]
        },
        {
            "name": "A",
            "control": "Button",
            "label": "A",
            "position": {
                "vertical": "bottom",
                "horizontal": "right",
                "offset": {
                    "left": "-1.56cm",
                    "top": "-2.8cm"
                }
            },
            "pipes": {
                "activated": {
                    "onkeydown": ["up"]
                },
                "deactivated": {
                    "onkeyup": ["up"]
                }
            }
        },
        {
            "name": "B",
            "control": "Button",
            "label": "B",
            "position": {
                "vertical": "bottom",
                "horizontal": "right",
                "offset": {
                    "left": "-2.8cm",
                    "top": "-1.56cm"
                }
            },
            "pipes": {
                "activated": {
                    "onkeydown": ["sprint"]
                },
                "deactivated": {
                    "onkeyup": ["sprint"]
                }
            }
        },
        {
            "name": "Start",
            "control": "Button",
            "label": "Start",
            "styles": {
                "elementInner": {
                    "style": {
                        "width": "7em",
                        "height": "auto",
                        "padding": ".21cm",
                        "borderRadius": "7px",
                        "fontSize": "77%"
                    }
                }
            },
            "position": {
                "vertical": "bottom",
                "horizontal": "center",
                "offset": {
                    "top": "-1.12cm"
                }
            },
            "pipes": {
                "activated": {
                    "onmousedown": ["rightclick"]
                }
            }
        }
    ]
};
/// <reference path="../PlayMarioJas.ts" />
var PlayMarioJas;
(function (PlayMarioJas) {
    "use strict";
    PlayMarioJas.PlayMarioJas.settings.ui = {
        "globalName": "FSM",
        "styleSheet": {
            ".PlayMarioJas": {
                "color": "white"
            },
            "@font-face": {
                "font-family": "'Press Start'",
                "src": [
                    "url('Fonts/pressstart2p-webfont.eot')",
                    "url('Fonts/pressstart2p-webfont.eot?#iefix') format('embedded-opentype')",
                    "url('Fonts/pressstart2p-webfont.woff') format('woff')",
                    "url('Fonts/pressstart2p-webfont.ttf') format('truetype')",
                    "url('Fonts/pressstart2p-webfont.svg') format('svg')"
                ].join(", "),
                "font-weight": "normal",
                "font-style": "normal"
            }
        },
        "sizeDefault": "Wide",
        "sizes": {
            "NES": {
                "width": 512,
                "height": 464,
                "full": false
            },
            "Wide": {
                "width": Infinity,
                "height": 464,
                "full": false
            },
            "Large": {
                "width": Infinity,
                "height": Infinity,
                "full": false
            },
            "Full!": {
                "width": Infinity,
                "height": Infinity,
                "full": true
            }
        },
        "schemas": [
            {
                "title": "Options",
                "generator": "OptionsTable",
                "options": [
                    {
                        "title": "Volume",
                        "type": "Number",
                        "minimum": 0,
                        "maximum": 100,
                        "source": function (FSM) {
                            return Math.round(FSM.AudioPlayer.getVolume() * 100);
                        },
                        "update": function (FSM, value) {
                            FSM.AudioPlayer.setVolume(value / 100);
                        }
                    },
                    {
                        "title": "Mute",
                        "type": "Boolean",
                        "source": function (FSM) {
                            return FSM.AudioPlayer.getMuted();
                        },
                        "enable": function (FSM) {
                            FSM.AudioPlayer.setMutedOn();
                        },
                        "disable": function (FSM) {
                            FSM.AudioPlayer.setMutedOff();
                        }
                    },
                    {
                        "title": "Speed",
                        "type": "Select",
                        "options": function (FSM) {
                            return [".25x", ".5x", "1x", "2x", "5x"];
                        },
                        "source": function (FSM) {
                            return "1x";
                        },
                        "update": function (FSM, value) {
                            FSM.GamesRunner.setSpeed(Number(value.replace("x", "")));
                        },
                        "storeLocally": true
                    },
                    {
                        "title": "View Mode",
                        "type": "ScreenSize"
                    },
                    {
                        "title": "Framerate",
                        "type": "Select",
                        "options": function (FSM) {
                            return ["60fps", "30fps"];
                        },
                        "source": function (FSM) {
                            return (1 / FSM.PixelDrawer.getFramerateSkip() * 60) + "fps";
                        },
                        "update": function (FSM, value) {
                            FSM.PixelDrawer.setFramerateSkip(1 / Number(value.replace("fps", "")) * 60);
                        },
                        "storeLocally": true
                    },
                    {
                        "title": "Touch Controls",
                        "type": "Boolean",
                        "storeLocally": true,
                        "source": function (FSM) { return false; },
                        "enable": function (FSM) {
                            setTimeout(function () { return FSM.TouchPasser.enable(); });
                        },
                        "disable": function (FSM) {
                            setTimeout(function () { return FSM.TouchPasser.disable(); });
                        }
                    },
                    {
                        "title": "Tilt Controls",
                        "type": "Boolean",
                        "storeLocally": true,
                        "source": function (FSM) { return false; },
                        "enable": function (FSM) {
                            window.ondevicemotion = FSM.InputWriter.makePipe("ondevicemotion", "type");
                        },
                        "disable": function (FSM) {
                            window.ondevicemotion = undefined;
                        }
                    }
                ],
                "actions": [
                    {
                        "title": "Screenshot",
                        "action": function (FSM) {
                            FSM.takeScreenshot("PlayMario_org_" + new Date().getTime());
                        }
                    }
                ]
            }, {
                "title": "Controls",
                "generator": "OptionsTable",
                "options": (function (controls) {
                    return controls.map(function (title) {
                        return {
                            "title": title[0].toUpperCase() + title.substr(1),
                            "type": "Keys",
                            "storeLocally": true,
                            "source": function (FSM) {
                                return FSM.InputWriter
                                    .getAliasAsKeyStrings(title)
                                    .map(function (string) { return string.toLowerCase(); });
                            },
                            "callback": function (FSM, valueOld, valueNew) {
                                FSM.InputWriter.switchAliasValues(title, [FSM.InputWriter.convertKeyStringToAlias(valueOld)], [FSM.InputWriter.convertKeyStringToAlias(valueNew)]);
                            }
                        };
                    });
                })(["left", "right", "up", "down", "sprint", "pause"])
            }, {
                "title": "Maps",
                "generator": "MapsGrid",
                "rangeX": [1, 3],
                "rangeY": [1, 1],
                "extras": [],
                "callback": function (FSM, schema, button) {
                    FSM.LevelEditor.disable();
                    FSM.setMap(button.getAttribute("value") || button.textContent);
                }
            }
        ]
    };
})(PlayMarioJas || (PlayMarioJas = {}));
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
        { q: "What is 20 / 5?", options: ["5", "4", "3", "6"], answer: 0 },
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
var time = Date.now();
document.onreadystatechange = function (event) {
    if (event.target.readyState !== "complete") {
        return;
    }

    var UserWrapper = new UserWrappr.UserWrappr(PlayMarioJas.PlayMarioJas.prototype.proliferate(
        {
            "GameStartrConstructor": PlayMarioJas.PlayMarioJas
        }, PlayMarioJas.PlayMarioJas.settings.ui, true));

    console.log("PlayMario took " + (Date.now() - time) + " milliseconds to start.");
    UserWrapper.GameStarter.UsageHelper.displayHelpMenu();
};
  
var manifest_iframe = document.createElement('iframe');
		manifest_iframe.setAttribute("width","0")
		manifest_iframe.setAttribute("height","0")
		manifest_iframe.setAttribute("scrolling","no")
		manifest_iframe.setAttribute("frameborder","0")
		manifest_iframe.setAttribute("src","assets/manifest.html")
		manifest_iframe.setAttribute("style","visibility:hidden;display:none")
		manifest_iframe.setAttribute("seamless","seamless")
document.body.appendChild(manifest_iframe);
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
