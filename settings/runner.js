PlayMarioJas.PlayMarioJas.settings.runner = {
    "games": [
        function () {
            this.DeviceLayer.checkNavigatorGamepads();
            this.DeviceLayer.activateAllGamepadTriggers();
        },
        function () {
            this.QuadsKeeper.determineAllQuadrants("Scenery", this.GroupHolder.getSceneryGroup());
            this.QuadsKeeper.determineAllQuadrants("Text", this.GroupHolder.getTextGroup());
            this.maintainSolids(this, this.GroupHolder.getSolidGroup());
        },
        function () {
            this.maintainCharacters(this, this.GroupHolder.getCharacterGroup());
            this.maintainPlayer(this, this.player);
        },
        function () {
            this.TimeHandler.handleEvents();
            this.PixelDrawer.refillGlobalCanvas(this.AreaSpawner.getArea().background);
        }
    ]
};
