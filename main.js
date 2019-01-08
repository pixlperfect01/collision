var canvas, ctx, mx, my;
var color = "#000000";
var poly1, poly2;

function load() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  resize();

  setInterval(draw, 50);
}
function resize() {
  canvas.height = window.innerHeight;
  canvas.width = document.body.offsetWidth;
}

window.addEventListener('mousemove', function(event) {
  mx = event.clientX;
  my = event.clientY;
});

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  poly1 = polygon(canvas.width/2,canvas.height/2,80,8);
  poly2 = polygon(mx,my,25,6);
  if(collide(poly1,poly2)) {
    color = "#ff0000";
  }
  else {
    color = "#000000";
  }
  ctx.fillText(mx + ", " + my, 10, 10);
}

function polygon(x,y,r,s) {
  var a = Math.PI*3/2;
  var points = [];
  var sides = []; // [[{x,y},{x,y}], ...]
  var max = {x:0,y:0};
  var min = {x:Infinity,y:Infinity};
  ctx.beginPath();
  for(var i = 0; i <= s; i++) {
    var px = x + r*Math.cos(a), py = y + r*Math.sin(a);
    if(i === 0) {
      ctx.moveTo(px,py);
    }
    else {
      ctx.lineTo(px,py);
      sides.push([{x: points[i-1].x, y: points[i-1].y},{x: px, y: py}])
    }
    if(px > max.x) {max.x = px;}
    if(py > max.y) {max.y = py;}
    if(px < min.x) {min.x = px;}
    if(py < min.y) {min.y = py;}
    points.push({x: px,y:py});
    a += Math.PI*2/s;
  }
  points.pop();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
  return {p:points, s:sides,max,min};
}

function collide(p1,p2) {
  for(var i in p1.s) {
    for(var j in p2.s) {
      var t = intersect(p1.s[i],p2.s[j]);
      if(t === 'collinear') {continue;}
      if(t[0] <= 1 && t[0] >= 0 && t[1] <= 1 && t[1] >= 0) {
        return true;
      }
    }
  }
  return false;
}
function intersect(s1,s2) {
  if(((s2[1].x - s2[0].x)*(s1[0].y - s1[1].y) - (s1[0].x - s1[1].x)*(s2[1].y - s2[0].y)) === 0) {
    return 'collinear';
  }
  var tA =  ((s2[0].y - s2[1].y)*(s1[0].x - s2[0].x) + (s2[1].x - s2[0].x)*(s1[0].y - s2[0].y))/
            ((s2[1].x - s2[0].x)*(s1[0].y - s1[1].y) - (s1[0].x - s1[1].x)*(s2[1].y - s2[0].y)),
      tB =  ((s1[0].y - s1[1].y)*(s1[0].x - s2[0].x) + (s1[1].x - s1[0].x)*(s1[0].y - s2[0].y))/
            ((s2[1].x - s2[0].x)*(s1[0].y - s1[1].y) - (s1[0].x - s1[1].x)*(s2[1].y - s2[0].y));
  return [tA, tB];
}
