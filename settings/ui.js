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
                "height": 1080,
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
