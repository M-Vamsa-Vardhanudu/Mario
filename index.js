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
  
// manifest iframe removed - appcache is deprecated and this was causing
// unnecessary network requests and DOM overhead on every page load