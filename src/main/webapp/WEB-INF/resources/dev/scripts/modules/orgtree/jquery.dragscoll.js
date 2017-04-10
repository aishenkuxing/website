(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports);
    } else {
        factory((root.dragscroll = {}));
    }
}(this, function (exports) {
    var lastClientX = 0;
    var lastClientY = 0
    $(document).on("mousedown", '.dragscroll', function (e) {
        pushed = 1;
        $(".container").css("cursor", "url('/Areas/Theme/default/org/img/palm16x16.ico'),auto");
        lastClientX = e.clientX;
        lastClientY = e.clientY;
    });
    $(document).on("mouseup", function (e) {
        pushed = 0;
        $(".container").css("cursor", "url('/Areas/Theme/default/org/img/fist16x16.ico'),auto");
    });
    $(document).on("mousemove", function (e) {
        var dragged = $('.dragscroll');
        scroller = dragged[0];
        if (pushed) {
            scroller.scrollLeft -=
                (-lastClientX + (lastClientX = e.clientX));
            scroller.scrollTop -=
                (-lastClientY + (lastClientY = e.clientY));
        }
    });
}));