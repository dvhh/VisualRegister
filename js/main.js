function isPercentage(n) {
    return typeof n === "string" && n.indexOf('%') != -1;
}
function isOnePointZero(n) {
    return typeof n == "string" && n.indexOf('.') != -1 && parseFloat(n) === 1;
}
function bound01(n, max) {
    if (isOnePointZero(n)) { n = "100%"; }

    var processPercent = isPercentage(n);
    n = Math.min(max, Math.max(0, parseFloat(n)));

    // Automatically convert percentage into number
    if (processPercent) {
        n = parseInt(n * max, 10) / 100;
    }

    // Handle floating point rounding errors
    if ((Math.abs(n - max) < 0.000001)) {
        return 1;
    }

    // Convert into [0, 1] range if it isn't already
    return (n % max) / parseFloat(max);
}
function pad2(c) {
    return c.length == 1 ? '0' + c : '' + c;
}

function rgbToHex(r, g, b, allow3Char) {

    var hex = [
        pad2(Math.round(r).toString(16)),
        pad2(Math.round(g).toString(16)),
        pad2(Math.round(b).toString(16))
    ];
    if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
        return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
    }

    return hex.join("");
}
 function hsvToRgb(h, s, v) {

    h = bound01(h, 360) * 6;
    s = bound01(s, 100);
    v = bound01(v, 100);

    var i = Math.floor(h),
        f = h - i,
        p = v * (1 - s),
        q = v * (1 - f * s),
        t = v * (1 - (1 - f) * s),
        mod = i % 6,
        r = [v, q, p, p, t, v][mod],
        g = [t, v, v, q, p, p][mod],
        b = [p, p, t, v, v, q][mod];

    return { r: r * 255, g: g * 255, b: b * 255 };
}
function hsvToHex(h,s,v) {
  var rgb=hsvToRgb(h,s,v);
  return rgbToHex(rgb.r,rgb.g,rgb.b,false);
}
var template = $("div.register");
for (var i = 1; i < 32; i++) {
  var tmp = template.clone();
  tmp.find(".name").text("d" + i);
  tmp.attr("id","d" + i);
  tmp.offset({top:Math.floor(i/4)*40,left:i%4*280});
  tmp.appendTo("#grid");
}
for (var i = 0; i < 32; i++) {
  var tmp = $("#d"+i);
  var color="#"+hsvToHex(i*360/32,50,90);
  //console.log(color);
  tmp.css("background-color",color);
  // random victim
}
for(var j=0;j<1000;j++) {
    var i=Math.floor(Math.random()*32);
    var color="#"+hsvToHex(i*360/32,50,90);
    var r=Math.floor(Math.random()*32);
    while(r==i) {
      r=Math.floor(Math.random()*32);
    }
    var p=Math.floor(Math.random()*16);
    var b = $("div#d"+r+" span:eq("+p+")");
    b.attr("title","from d"+i);
    //console.log(b);
    b.css("background-color",color);
  }
var regMouseHandler=function(ev) {
  console.log(ev);
  //var pos=$(this).offset();
  var ox=ev.pageX;
  var oy=ev.pageY;
  var that=this;
  $(document).on("mousemove",function(ev) {
    var parent=$(that).parent();
    //console.log(parent);
    var offset=$(that).parent().offset();
    var dx = ev.pageX - ox;
    var dy = ev.pageY - oy;
    ox=ev.pageX;
    oy=ev.pageY;
    offset.top += dy;
    offset.left += dx;
    //console.log(dx,dy);
    
    $(that).parent().offset(offset);
  })
  $(document).on("mouseup",function() {
    $(document).off("mousemove");$(this).off("mouseup");
    console.log("up");
  })
  ev.preventDefault();
  return false;
}
$("#grid").on("mousedown",".register .name",regMouseHandler);

