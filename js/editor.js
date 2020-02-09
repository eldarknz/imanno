//
var LIST_SHAPES          = { RECT:'rect',
                           CIRCLE:'circle',
                           ELLIPSE:'ellipse',
                           POLYGON:'polygon',
                           POINT:'point',
                           POLYLINE:'polyline'
                         };
var LIST_COLOR           = { 'white' : '255,255,255',
                             'silver': '192,192,192',
                             'gray'  : '128,128,128',
                             'black' : '0,0,0',
                             'red'   : '255,0,0',
                             'orange': '255,165,0',
                             'yellow': '255,255,0',
                             'lime'  : '0,255,0',
                             'green' : '0,128,0',
                             'aqua'  : '0,255,255',
                             'blue'  : '0,0,255',
                             'purple': '128,0,128'
                         };
var LINE_WIDTH           = 2;
var SHAPE_POINT_RADIUS   = 3;
var DEFAULT_LABEL_SHAPE  = 'no selected';
var LIST_LABEL_SHAPE     = ['rectangle', 'circle', 'ellipse', 'point', 'polygon'];

// current image
var url_path               = '/Users/ek_dev/Projects/IA/imgs/';
var image_name_list        = ['screenshot_1.png','screenshot_2.png','screenshot_3.jpg','screenshot_4.png'];
var current_image_filename = url_path + image_name_list[0];
var current_image          = null;
var current_image_width    = null;
var current_image_height   = null;

// image canvas
var canvas_height = null;
var canvas_width  = null;
var canvas_panel  = document.getElementById('canvas_panel');
var image_canvas  = document.getElementById('image_canvas');
var brush_canvas  = document.getElementById('brush_canvas');
var shape_canvas  = document.getElementById('shape_canvas');
var image_ctx     = image_canvas.getContext('2d');
var brush_ctx     = brush_canvas.getContext('2d');
var shape_ctx     = shape_canvas.getContext('2d');

// select form
var select                = document.getElementById('labelSelect');
// list of shapes
//var list_shapes           = [];
var list_shapes           = [{color:"rgba(0,0,255,1.0)",isSelected:false,label:"rectangle",type:"rect",coordinates:[{x:201,y:96 },{x:416,y:96 },{x:416,y:289 },{x:201,y:289 }]},
                             {color:"rgba(255,0,0,1.0)",isSelected:false,label:null,type:"circle",x:562,y:193,r:93},
                             {color:"rgba(255,0,0,1.0)",isSelected:false,label:"circle",type:"circle",x:862,y:243,r:93},
                             {color:"rgba(255,0,0,1.0)",isSelected:false,label:"circle",type:"circle",x:662,y:443,r:93},
                             {color:"rgba(0,0,255,1.0)",isSelected:false,label:null,type:"rect",coordinates:[{x:1057,y:88},{x:1308,y:88},{x:1308,y:299},{x:1057,y:299}]},
                             {color:"rgba(0,128,0,1.0)",isSelected: false,label: null,type:"ellipse",x:303,x1:167,y:584,y1:94},
                             {color:"rgba(128,0,128,1.0)",isSelected: false,label: null, type: "polygon",coordinates:[{x:923,y:544 },{x:930,y:450 },{x:1029,y:390 },{x:1186,y:387 },{x:1254,y:467 },{x:1181,y:518 },{x:1232,y:597 },{x:1107,y:607 },{x:960,y:598 }]}
                           ];
// list of brush point
var list_brush            = {x:[],y:[],d:[],c:[]};
// editing status
var editing_status        = null;
// selected shape
var selected_shape        = null;
// previous focused shape
var focused_shape         = null;
// number selected shap from list_shapes
var num_selected_shape    = null;
// currently selected shape
var current_shape         = 'rect';
// shape colors
var current_color         = '0,0,0';
// shape colors
var current_color_opacity = '1.0';
// point color
var current_fillstyle     = 'rgba(0, 0, 0, 0.2)';
// selectors
var is_draw_shape   = false;
var is_draw_brush   = false;
var is_select_shape = false;
var is_drag_shape   = false;
var is_resize_shape = false;
// mouse cursor near border shape
var is_border       = false;
// new shape
var new_shape       = null;
// new brushpoint
var new_brush_point = null;
// polygon perimeter
var perimeter = [];

// coordinate
var startX      = 0;
var startY      = 0;
var currentX    = 0;
var currentY    = 0;
var deltaX      = 0;
var deltaY      = 0;
var deltaX1     = 0;
var deltaY1     = 0;
var deltaXYPoly = [];
var currentXY   = null;

//
// ------------- Clear handlers -------------
//
function clearBrush() {
    brush_ctx.clearRect(0, 0, canvas_width, canvas_height);
    list_brush = {x:[],y:[],d:[],c:[]};
}
function clearCanvas(shape) {
    shape.clearRect(0, 0, canvas_width, canvas_height);
}
function clearCanvasContent() {
    if (is_select_shape) {
        deleteShape();
    } else {
        if (list_shapes.length > 0) {
            var result = confirm("Want to delete?")
            if (result) {
                clearCanvas(shape_ctx);
                list_shapes = [];
                perimeter   = [];
            }
        }
    }
}

//
// ------------- Colors handler -------------
//
function getColor() {
    return 'rgba(' + current_color + ',' + current_color_opacity + ')';
}
/*function getPixel(x, y) {
    var p = image_ctx.getImageData(x, y, 1, 1).data;
    var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
    return hex;
}
function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}*/

//
// ------------- Label handler -------------
//
function drawLabel(n, x, y) {
  var label_num     = (n + 1).toString();
  var char_width    = shape_ctx.measureText('M').width;
  var char_height   = 1.8 * char_width;
  var bg_rect_width = shape_ctx.measureText(label_num).width + char_width;
  shape_ctx.beginPath();
  shape_ctx.fillStyle = 'black';
  shape_ctx.fillRect(Math.floor(x),
                      Math.floor(y - 1.1 * char_height),
                      Math.floor(bg_rect_width),
                      Math.floor(char_height));
  shape_ctx.font      = 'Arial';
  shape_ctx.fillStyle = 'white';
  shape_ctx.fillText(label_num, Math.floor(x + 0.4 * char_width), Math.floor(y - 0.35 * char_height));
}

//
// ------------- Control point handler -------------
//
function drawControlPoint(color, x, y) {
  shape_ctx.beginPath();
  shape_ctx.arc(x, y, SHAPE_POINT_RADIUS, 0, 2 * Math.PI, false);
  shape_ctx.closePath();
  shape_ctx.fillStyle   = color;
  shape_ctx.globalAlpha = 1.0;
  shape_ctx.fill();
}

//
// ------------- Polygon point handler -------------
//
function polygonPoint(x, y) {
    shape_ctx.fillStyle     = getColor();
    shape_ctx.strokeStyle   = getColor();
    shape_ctx.fillRect(x - 2, y - 2, 4, 4);
    shape_ctx.moveTo(x,y);
}

//
// ------------- Intersects handler -------------
//
function line_intersects(p0, p1, p2, p3) {
    var s1_x, s1_y, s2_x, s2_y;
    s1_x = p1['x'] - p0['x'];
    s1_y = p1['y'] - p0['y'];
    s2_x = p3['x'] - p2['x'];
    s2_y = p3['y'] - p2['y'];

    var s, t;
    s = (-s1_y * (p0['x'] - p2['x']) + s1_x * (p0['y'] - p2['y'])) / (-s2_x * s1_y + s1_x * s2_y);
    t = ( s2_x * (p0['y'] - p2['y']) - s2_y * (p0['x'] - p2['x'])) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
    {
        // Collision detected
        return true;
    }
    return false; // No collision
}
function check_intersect(x, y) {
    if (perimeter.length < 3) {
        return false;
    }
    var p0 = [];
    var p1 = [];
    var p2 = [];
    var p3 = [];

    p2['x'] = perimeter[perimeter.length-1]['x'];
    p2['y'] = perimeter[perimeter.length-1]['y'];
    p3['x'] = x;
    p3['y'] = y;

    for(var i=0; i<perimeter.length-1; i++) {
        p0['x'] = perimeter[i]['x'];
        p0['y'] = perimeter[i]['y'];
        p1['x'] = perimeter[i+1]['x'];
        p1['y'] = perimeter[i+1]['y'];
        if (p1['x'] == p2['x'] && p1['y'] == p2['y']) { continue; }
        if (p0['x'] == p3['x'] && p0['y'] == p3['y']) { continue; }
        if (line_intersects(p0,p1,p2,p3)==true) {
            return true;
        }
    }
    return false;
}

//
// ------------- Shape drawing handlers -------------
//
// redrawing shapes
function reDrawShape() {
    for (var i = 0; i < list_shapes.length; i++) {
        var drawing_shape = list_shapes[i];
        var shape_type    = drawing_shape.type;
        switch (shape_type) {
            case 'rect':
                drawRectangle(drawing_shape, i);
                break;
            case 'circle':
                drawCircle(drawing_shape, i);
                break;
            case 'ellipse':
                drawEllipse(drawing_shape, i);
                break;
            case 'point':
                drawPoint(drawing_shape, i);
                break;
            case 'polygon':
                drawPolygon(drawing_shape, i);
                break;
            default:
                msg = 'This type of shape cannot be drawn';
                er  = 'unsuccess';
                showMessage(msg, er)
        }
    }
    if (perimeter.length > 0) {
      drawPerimeter();
    }
}

// draw perimeter for polygon
function drawPerimeter() {
    shape_ctx.beginPath();
    for(var i = 0; i < perimeter.length; i++) {
        if (i == 0) {
            shape_ctx.moveTo(perimeter[i]['x'],perimeter[i]['y']);
            polygonPoint(perimeter[i]['x'],perimeter[i]['y']);
        } else {
            shape_ctx.lineTo(perimeter[i]['x'],perimeter[i]['y']);
            polygonPoint(perimeter[i]['x'],perimeter[i]['y']);
        }
    }
    shape_ctx.lineWidth = LINE_WIDTH;
    shape_ctx.strokeStyle = getColor();
    shape_ctx.lineCap = "square";
    shape_ctx.stroke();
}
function createNewPerimeter() {
    x = startX;
    y = startY;
    if (perimeter.length > 0 && x == perimeter[perimeter.length-1]['x'] && y == perimeter[perimeter.length-1]['y']) {
        // same point - double click
        return false;
    }
    if (check_intersect(x, y)) {
        alert('The line you are drawing intersect another line');
        return false;
    }
    perimeter.push({'x': x, 'y': y });
    drawPerimeter();
}
// drawing shapes
function drawRectangle(shape, n) {
    if (n != undefined) {
      var sX = []; var sY = [];
      for (var i = 0; i < shape.coordinates.length; i++) {
          sX.push(shape.coordinates[i]['x']);
          sY.push(shape.coordinates[i]['y']);
      };
      drawLabel(n, Math.max(...sX), Math.min(...sY));
    }
    var sc = shape.coordinates;
    shape_ctx.beginPath();
    for (var i = 0; i < sc.length; i++) {
      i == 0 ? shape_ctx.moveTo(sc[0]['x'],sc[0]['y']) : shape_ctx.lineTo(sc[i]['x'],sc[i]['y']);
    }
    shape_ctx.closePath();
    if (shape.isSelected) {
      shape_ctx.lineWidth = 3;
      shape_ctx.strokeStyle = 'black';
      point_color = 'rgb(255,0,0)';
    }
    else {
      shape_ctx.lineWidth = LINE_WIDTH;
      shape_ctx.strokeStyle = shape.color;
      point_color = shape.color;
    }
    shape_ctx.stroke();
    shape_ctx.fillStyle   = current_fillstyle;
    shape_ctx.fill();
    //------------------ contol points ------------------
    for (var j = 0; j < sc.length; j++) {
      drawControlPoint(point_color, sc[j]['x'],sc[j]['y']);
    }
    //center
  //drawControlPoint(shape.color, shape.x + shape.w / 2, shape.y + shape.h / 2);
    //left-right
    drawControlPoint(point_color, sc[0]['x'], sc[0]['y'] + ((sc[3]['y'] - sc[0]['y']) / 2));
    drawControlPoint(point_color, sc[1]['x'], sc[0]['y'] + ((sc[3]['y'] - sc[0]['y']) / 2));
    //top-bottom
    drawControlPoint(point_color, sc[0]['x'] + ((sc[1]['x'] - sc[0]['x']) / 2), sc[0]['y']);
    drawControlPoint(point_color, sc[0]['x'] + ((sc[1]['x'] - sc[0]['x']) / 2), sc[3]['y']);
}
function drawCircle(shape, n) {
    if (n != undefined) {
      drawLabel(n, shape.x, shape.y - shape.r);
    }
    shape_ctx.beginPath();
    shape_ctx.arc(shape.x, shape.y, shape.r, 0, Math.PI*2);
    shape_ctx.closePath(); //?????
    if (shape.isSelected) {
      shape_ctx.lineWidth = 3;
      shape_ctx.strokeStyle = 'black';
      point_color = 'rgb(255,0,0)';
    }
    else {
      shape_ctx.lineWidth = LINE_WIDTH;
      shape_ctx.strokeStyle = shape.color;
      point_color = shape.color;
    }
    shape_ctx.stroke();
    shape_ctx.fillStyle   = current_fillstyle;
    shape_ctx.fill();
    //------------------ contol points ------------------
    //drawControlPoint(shape.color, shape.x, shape.y); // center
    drawControlPoint(point_color, shape.x - shape.r, shape.y); //left
    drawControlPoint(point_color, shape.x, shape.y - shape.r); //top
    drawControlPoint(point_color, shape.x + shape.r, shape.y); //right
    drawControlPoint(point_color, shape.x, shape.y + shape.r); //bottom
}
function drawEllipse(shape, n) {
    if (n != undefined) {
      drawLabel(n, shape.x, shape.y - shape.y1);
    }
    shape_ctx.beginPath();
    shape_ctx.save();
    shape_ctx.translate(shape.x - shape.x1, shape.y - shape.y1);
    shape_ctx.scale(shape.x1, shape.y1);
    shape_ctx.arc(1, 1, 1, 0, 2 * Math.PI, false);
    shape_ctx.restore(); // restore to original state
    shape_ctx.closePath();
    if (shape.isSelected) {
      shape_ctx.lineWidth = 3;
      shape_ctx.strokeStyle = 'black';
      point_color = 'rgb(255,0,0)';
    }
    else {
      shape_ctx.lineWidth = LINE_WIDTH;
      shape_ctx.strokeStyle = shape.color;
      point_color = shape.color;
    }
    shape_ctx.stroke();
    shape_ctx.fillStyle   = current_fillstyle;
    shape_ctx.fill();
    //------------------ contol points ------------------
    //drawControlPoint(shape.color, shape.x, shape.y); // center
    drawControlPoint(point_color, shape.x + shape.x1, shape.y); // left
    drawControlPoint(point_color, shape.x, shape.y - shape.y1); //top
    drawControlPoint(point_color, shape.x - shape.x1, shape.y); //right
    drawControlPoint(point_color, shape.x, shape.y + shape.y1); //bottom
}
function drawPoint(shape, n) {
    if (n != undefined) {
      drawLabel(n, shape.x, shape.y);
    }
    var hp = wp = 8;
    if (shape.isSelected) {
      shape_ctx.fillStyle = 'rgb(255,0,0)';
      shape_ctx.strokeStyle = 'rgb(255,0,0)';
    }
    else {
      shape_ctx.fillStyle = shape.color;
      shape_ctx.strokeStyle = shape.color;
    }
    shape_ctx.fillRect(shape.x - wp / 2, shape.y - hp / 2, wp, hp);
    shape_ctx.moveTo(shape.x, shape.y);
}
function drawPolygon(shape, n) {
  if (n != undefined) {
    drawLabel(n, shape.coordinates[0]['x'], shape.coordinates[0]['y']);
  }
  var sc = shape.coordinates;
  shape_ctx.beginPath();
  for (var i = 0; i < sc.length; i++) {
    i == 0 ? shape_ctx.moveTo(sc[0]['x'],sc[0]['y']) : shape_ctx.lineTo(sc[i]['x'],sc[i]['y']);
  }
  shape_ctx.closePath();
  if (shape.isSelected) {
    shape_ctx.lineWidth = 3;
    shape_ctx.strokeStyle = 'rgb(0,0,0)';
    point_color = 'rgb(255,0,0)';
  }
  else {
    shape_ctx.lineWidth = LINE_WIDTH;
    shape_ctx.strokeStyle = shape.color;
    point_color = shape.color;
  }
  shape_ctx.lineCap     = "square";
  shape_ctx.stroke();
  shape_ctx.fillStyle   = current_fillstyle;
  shape_ctx.fill();
  for (var i = 0; i < sc.length; i++) {
    drawControlPoint(point_color, sc[i]['x'], sc[i]['y']);
  }
}
// classes shapes
function Rectangle(x0, y0, x1, y1, color) {
    this.coordinates  = [{'x':x0,'y':y0},{'x':x1,'y':y0},{'x':x1,'y':y1},{'x':x0,'y':y1}];
    this.color        = color;
    this.type         = LIST_SHAPES.RECT;
    this.isSelected   = false;
    this.label        = null;
}
function Circle(x0, y0, x1, y1, color) {
    this.x          = x0;
    this.y          = y0;
    this.r          = parseInt(Math.sqrt(x1 * x1 + y1 * y1));
    this.color      = color;
    this.type       = LIST_SHAPES.CIRCLE;
    this.isSelected = false;
    this.label      = null;
}
function Ellipse(x0, y0, x1, y1, color) {
    this.x          = x0;
    this.y          = y0;
    this.x1         = x1;
    this.y1         = y1;
    this.color      = color;
    this.type       = LIST_SHAPES.ELLIPSE;
    this.isSelected = false;
    this.label      = null;
}
function Polygon(coordinates, color) {
    this.coordinates  = coordinates;
    this.color        = color;
    this.type         = LIST_SHAPES.POLYGON;
    this.isSelected   = false;
    this.label      = null;
}
function Point(x0, y0, color) {
    this.x          = x0;
    this.y          = y0;
    this.color      = color;
    this.type       = LIST_SHAPES.POINT;
    this.isSelected = false;
    this.label      = null;
}
// creating new shapes
function createNewRectangle() {
  new_shape = new Rectangle(startX, startY, currentX, currentY, getColor());
  drawRectangle(new_shape);
}
function createNewCircle() {
    new_shape = new Circle(startX, startY, deltaX, deltaY, getColor());
    drawCircle(new_shape);
}
function createNewEllipse() {
    new_shape = new Ellipse(startX, startY, deltaX, deltaY, getColor());
    drawEllipse(new_shape);
}
function createNewPoint() {
    new_shape = new Point (startX, startY, getColor());
    drawPoint(new_shape);
}
function createNewPolygon() {
    new_shape = new Polygon (perimeter, getColor());
    drawPolygon(new_shape);
}
// draw new shapes
function drawShape(event) {
    if (event.type == 'mousedown') {
      switch (current_shape) {
        case 'point':
          createNewPoint();
          break;
        case 'polygon':
          if (event.which == '1') {
            createNewPerimeter();
          }
          if (event.which == '3' || event.button == '2') {
            if (perimeter.length <= 2) {
                alert('You need at least three points for a polygon');
                //shape_canvas.oncontextmenu = function (e) { e.preventDefault(); };
                return false;
            }
            if (check_intersect(perimeter[0]['x'], perimeter[0]['y'])) {
                alert('The line you are drowing intersect another line');
                //shape_canvas.oncontextmenu = function (e) { e.preventDefault(); };
                return false;
            }
            createNewPolygon();
            perimeter = [];
          }
          shape_canvas.oncontextmenu = function (event) { event.preventDefault(); };
          break;
      }
    }
    if (current_shape != 'polygon' && current_shape != 'point') {
      if (event.type == 'mousemove') {
        clearCanvas(shape_ctx);
        switch (current_shape) {
          case 'rect':
            createNewRectangle();
            break;
          case 'circle':
            createNewCircle();
            break;
          case 'ellipse':
            createNewEllipse();
            break;
        }
        reDrawShape();
        //drawBrush();
      }
    }
}
// create new brushpoint
function createNewBrushPoint(x, y, dragging) {
  list_brush.x.push(x);
  list_brush.y.push(y);
  list_brush.d.push(dragging);
  list_brush.c.push(getColor());
}
// draw brushstroke
function drawBrush(){
  clearCanvas(brush_ctx);
  var x = list_brush.x;
  var y = list_brush.y;
  var dragging = list_brush.d;
  var color = list_brush.c;
  for(var i = 0; i < x.length; i++) {
    brush_ctx.beginPath();
    if (dragging[i] && i) {
        brush_ctx.moveTo(x[i-1], y[i-1]);
    } else {
        brush_ctx.moveTo(x[i]-1, y[i]);
    }
    brush_ctx.lineTo(x[i], y[i]);
    brush_ctx.closePath();
    brush_ctx.lineWidth = 10;
    brush_ctx.lineJoin = brush_ctx.lineCap = 'round';
    brush_ctx.strokeStyle = color[i];
    brush_ctx.stroke();
  }
}

//
// ------------- View or select shape handlers -------------
//
function removeSelection() {
  list_shapes.forEach(function(shape) { shape.isSelected = false; });
  selected_rectangle = null;
}

function distanceFromCenter(x, x1, y, y1) {
  return (Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2)));
}
function inRect(x, y, xp, yp) {
  npol = xp.length;
  j = npol - 1;
  var c = 0;
  for (i = 0; i < npol; i++){
      if ((((yp[i]<=y) && (y<yp[j])) || ((yp[j]<=y) && (y<yp[i]))) &&
      (x > (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i])) {
          c = !c
      }
      j = i;
  }
  if (c) {
    shape_canvas.style.cursor = 'move';
    //is_border = false;
    /*var msg = [];
    var x1 = Math.min(...xp);
    var x2 = Math.max(...xp);
    var y1 = Math.min(...yp);
    var y2 = Math.max(...yp);
    //---
    if (x >= x1, x <= x1 + 5) {
      is_border = true;
      shape_canvas.style.cursor = 'col-resize';
    }
    if (x <= x2, x >= x2 - 5) {
      is_border = true;
      shape_canvas.style.cursor = 'col-resize';
    }
    if (y >= y1 && y <= y1 + 5) {
      is_border = true;
      shape_canvas.style.cursor = 'ns-resize';
    }
    if (y <= y2, y >= y2 - 5) {
      is_border = true;
      shape_canvas.style.cursor = 'ns-resize';
    }*/
    if (distanceFromCenter(xp[0], currentX, yp[0], currentY) <= 100) {
      is_border = true;
      shape_canvas.style.cursor = 'nwse-resize';
    }
    if (distanceFromCenter(xp[2], currentX, yp[2], currentY) <= 100) {
      is_border = true;
      shape_canvas.style.cursor = 'nwse-resize';
    }
    if (distanceFromCenter(xp[1], currentX, yp[1], currentY) <= 100) {
      is_border = true;
      shape_canvas.style.cursor = 'nesw-resize';
    }
    if (distanceFromCenter(xp[3], currentX, yp[3], currentY) <= 100) {
      is_border = true;
      shape_canvas.style.cursor = 'nesw-resize';
    }
    /*if (msg.length != 0) {
      console.log('near the border rect: ' + msg.join('-'));
    }*/
  }
  return c;
}
function inPolygon(x, y, xp, yp){
  npol = xp.length;
  j = npol - 1;
  var c = 0;
  for (i = 0; i < npol; i++){
      if ((((yp[i]<=y) && (y<yp[j])) || ((yp[j]<=y) && (y<yp[i]))) &&
      (x > (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i])) {
          c = !c
      }
      j = i;
  }
  if (c) {
    shape_canvas.style.cursor = 'move';
  }
  return c;
}
function inCircle(x, y, r, x1, y1) {
  var dsc = distanceFromCenter(x, x1, y, y1);
  if (dsc <= r) {
    shape_canvas.style.cursor = 'move';
    is_border = false;
    if (dsc >= r - 10 && dsc <= r) {
      if ((x1 > (x + 10) && y1 > (y + 10)) || (x1 < (x - 10) && y1 < (y - 10))) {
          shape_canvas.style.cursor = 'nwse-resize';
      }
      if ((x1 > (x + 10) && y1 < (y - 10)) || (x1 < (x - 10) && y1 > (y + 10))) {
          shape_canvas.style.cursor = 'nesw-resize';
      }
      if (x1 > (x - 10) && x1 < (x + 10)) {
          shape_canvas.style.cursor = 'ns-resize';
      }
      if (y1 > (y - 10) && y1 < (y + 10)) {
          shape_canvas.style.cursor = 'col-resize';
      }
      is_border = true;
    }
    return true;
  }
  return false;
}
function inEllipse(h, k, x, y, a, b) {
  var ext_area = ((Math.pow((x - h), 2) / Math.pow(a, 2)) + (Math.pow((y - k), 2) / Math.pow(b, 2)))
  var int_area = ((Math.pow((x - h), 2) / Math.pow(a - 5, 2)) + (Math.pow((y - k), 2) / Math.pow(b - 5, 2)))
  if (ext_area < 1) {
    shape_canvas.style.cursor = 'move';
    is_border = false;
    if (int_area > 1) {
      if (h >= (x - a) && h <= (x + a) && k <= (y + 5) && k >= (y - 5) ) {
          shape_canvas.style.cursor = 'col-resize';
      }
      if (k >= (y - b) && k <= (y + b) && h <= (x + 5) && h >= (x - 5) ) {
          shape_canvas.style.cursor = 'ns-resize';
      }
      is_border = true;
    }
    return true;
  }
  return false;
}
function inPoint(x, y, xp, yp) {
  npol = xp.length;
  j = npol - 1;
  var c = 0;
  for (i = 0; i < npol; i++){
      if ((((yp[i]<=y) && (y<yp[j])) || ((yp[j]<=y) && (y<yp[i]))) &&
      (x > (xp[j] - xp[i]) * (y - yp[i]) / (yp[j] - yp[i]) + xp[i])) {
          c = !c
      }
      j = i;
  }
  if (c) {
    shape_canvas.style.cursor = 'move';
  }
  return c;
}
function inShape(shape, x, y) {
  var xp = []; // X-coordinate array of the shape
  var yp = []; // X-coordinate array of the shape
  var in_shape;
  switch (shape.type) {
    case 'rect':
      //selected_rectangle = shape;
      for (var i = 0; i < shape.coordinates.length; i++) {
        xp.push(shape.coordinates[i]['x']);
        yp.push(shape.coordinates[i]['y']);
      }
      in_shape = inRect(x, y, xp, yp);
      break;
    case 'polygon':
      for (var i = 0; i < shape.coordinates.length; i++) {
        xp.push(shape.coordinates[i]['x']);
        yp.push(shape.coordinates[i]['y']);
      }
      in_shape = inPolygon(x, y, xp, yp);
      break;
    case 'circle':
      in_shape = inCircle(shape.x, shape.y, shape.r, x, y);
      break;
    case 'ellipse':
      in_shape = inEllipse(x, y, shape.x, shape.y, shape.x1, shape.y1);
      break;
    case 'point':
      var x0 = shape.x - 4; var x1 = shape.x - 4 + 8;
      var y0 = shape.y - 4; var y1 = shape.y - 4 + 8;
      xp = [x0, x1, x1, x0];
      yp = [y0, y0, y1, y1];
      in_shape = inPoint(x, y, xp, yp);
      break;
    default:
        msg = 'This type of shape cannot be checked';
        er  = 'unsuccess';
        showMessage(msg, er)
  }
  return in_shape;
}

function deleteShape() {
  var result = confirm("Want to delete?")
  if (result) {
    list_shapes.splice(num_selected_shape,1);
    selected_shape      = null;
    num_selected_shape  = null;
    is_drag_shape       = false;
    is_select_shape     = false;
    shape_canvas.style.cursor = 'crosshair';
    removeSelection();
    clearCanvas(shape_ctx);
    reDrawShape();
    //drawBrush();
  }
}
function transformShape() {
  if (is_resize_shape == true) {
    switch (selected_shape.type) {
      case 'rect':
        var dfc0 = distanceFromCenter(selected_shape.coordinates[0]['x'], currentX, selected_shape.coordinates[0]['y'], currentY);
        var dfc1 = distanceFromCenter(selected_shape.coordinates[1]['x'], currentX, selected_shape.coordinates[1]['y'], currentY);
        var dfc2 = distanceFromCenter(selected_shape.coordinates[2]['x'], currentX, selected_shape.coordinates[2]['y'], currentY);
        var dfc3 = distanceFromCenter(selected_shape.coordinates[3]['x'], currentX, selected_shape.coordinates[3]['y'], currentY);
        if (dfc0 <= 20) {
          selected_shape.coordinates[0]['x'] = currentX; selected_shape.coordinates[0]['y'] = currentY;
          selected_shape.coordinates[1]['y'] = currentY; selected_shape.coordinates[3]['x'] = currentX;
        }
        if (dfc1 <= 20) {
          selected_shape.coordinates[1]['x'] = currentX; selected_shape.coordinates[1]['y'] = currentY;
          selected_shape.coordinates[0]['y'] = currentY; selected_shape.coordinates[2]['x'] = currentX;
        }
        if (dfc2 <= 20) {
          selected_shape.coordinates[2]['x'] = currentX; selected_shape.coordinates[2]['y'] = currentY;
          selected_shape.coordinates[1]['x'] = currentX; selected_shape.coordinates[3]['y'] = currentY;
        }
        if (dfc3 <= 20) {
          selected_shape.coordinates[3]['x'] = currentX; selected_shape.coordinates[3]['y'] = currentY;
          selected_shape.coordinates[0]['x'] = currentX; selected_shape.coordinates[2]['y'] = currentY;
        }
        break;
      case 'circle':
        selected_shape.r = Math.sqrt(Math.pow(selected_shape.x - currentX, 2) + Math.pow(selected_shape.y - currentY, 2))
        break;
      case 'ellipse':
        var inX0 = distanceFromCenter((selected_shape.x + selected_shape.x1), currentX, selected_shape.y, currentY);
        var inY0 = distanceFromCenter(selected_shape.x, currentX, (selected_shape.y + selected_shape.y1), currentY);
        var inX1 = distanceFromCenter((selected_shape.x - selected_shape.x1), currentX, selected_shape.y, currentY);
        var inY1 = distanceFromCenter(selected_shape.x, currentX, (selected_shape.y - selected_shape.y1), currentY);
        if ((inX0 <= 10) || (inX1 <= 10) && (currentXY == null)) { currentXY = 'x'; }
        if ((inY0 <= 10) || (inY1 <= 10) && (currentXY == null)) { currentXY = 'y'; }
        if (currentXY == 'x') { selected_shape.x1 = Math.abs(currentX - selected_shape.x + 2); }
        if (currentXY == 'y') { selected_shape.y1 = Math.abs(currentY - selected_shape.y + 2); }
        break;
      /*case 'polygon':
        console.log('polygon');
        break;*/
    }
  }
  if (is_drag_shape == true) {
    if (selected_shape != null) {
      // move the shape to a new position
      if (selected_shape.type == 'rect') {
        for (var i = 0; i < selected_shape.coordinates.length; i++) {
          selected_shape.coordinates[i].x = currentX - deltaXYPoly[i].dx;
          selected_shape.coordinates[i].y = currentY - deltaXYPoly[i].dy;
        }
      } else if (selected_shape.type == 'polygon') {
        for (var i = 0; i < selected_shape.coordinates.length; i++) {
          selected_shape.coordinates[i].x = currentX - deltaXYPoly[i].dx;
          selected_shape.coordinates[i].y = currentY - deltaXYPoly[i].dy;
        }
      } else {
          selected_shape.x = currentX - deltaX1;
          selected_shape.y = currentY - deltaY1;
      }
    }
  }
  clearCanvas(shape_ctx);
  reDrawShape();
}

function selectShape(x, y) {
  // Проверяем, щелкнули ли no фигуре
  if(list_shapes.length > 0) {
    for (var i = 0; i < list_shapes.length; i++) {
      var shape   = list_shapes[i];
      if (inShape(shape, x, y)) {
        var sc = shape.coordinates;
        switch (shape.type) {
          case 'rect':
            for (var j = 0; j < sc.length; j++) {
              deltaXYPoly.push({dx: x - sc[j]['x'], dy: y - sc[j]['y']});
            }
            break;
          case 'circle':
            deltaX1 = x - shape.x;
            deltaY1 = y - shape.y;
            break;
          case 'ellipse':
            deltaX1 = x - shape.x;
            deltaY1 = y - shape.y;
            break;
          case 'point':
            deltaX1 = 0;
            deltaY1 = 0;
            break;
          case 'polygon':
            /*shape.coordinates.forEach(function(xy) {
              deltaXYPoly.push({dx: x - xy['x'], dy: y - xy['y']});
            });*/
            for (var j = 0; j < sc.length; j++) {
              deltaXYPoly.push({dx: x - sc[j]['x'], dy: y - sc[j]['y']});
            }
            break;
        }
        if (selected_shape != null) {
          selected_shape.isSelected = false;
        }
        selected_shape            = shape;
        selected_shape.isSelected = false;
        num_selected_shape        = i;
        shape.isSelected          = true;
        is_select_shape           = true;
        if (!is_border) {
          is_drag_shape           = true;
        } else {
          is_resize_shape         = true;
        }
        return;
      } else {
        shape.isSelected   = false;
        selected_shape     = null;
        num_selected_shape = null;
        is_select_shape    = false;
        is_drag_shape      = false;
        is_resize_shape    = false;
        removeSelection();
      }
    }
    //for (var j = 0; j < list_shapes.length; j++) {
    //  console.log(list_shapes[j]);
    //}
  }
}
function viewShape(x, y) {
  // Проверяем, курсор внтури фигуры или нет
  if(list_shapes.length > 0) {
    for (var i = 0; i < list_shapes.length; i++) {
      var shape = list_shapes[i];
      var result = inShape(shape, x, y);
      if (result) {
        /*console.log(inShape(shape, x, y));*/
        //shape_canvas.style.cursor = 'move'
        focused_shape = shape;
        return;
      } else {
        shape_canvas.style.cursor = 'crosshair'
        focused_shape = null;
      }
    }
  }
}

//
// ------------- Mouse on canvas handlers -------------
//
shape_canvas.addEventListener('mousedown', function(event) {
    startX = parseInt(event.offsetX);
    startY = parseInt(event.offsetY);
    console.log(startX);
    console.log(startY);
    switch (editing_status) {
      case 'shape':
        is_draw_shape = true;
        if (is_draw_shape) {
            drawShape(event);
        }
        break;
      case 'brush':
        is_draw_brush = true;
        if (is_draw_brush) {
          createNewBrushPoint(startX, startY);
          drawBrush();
        }
        break;
      //case 'erase':
      //  break;
      default:
        selectShape(startX, startY);
    }
}, false);
shape_canvas.addEventListener('mouseup', function(event) {
    if (editing_status == 'shape') {
        if (new_shape != null) {
          list_shapes.push(new_shape);
        }
    }
    currentXY       = null;
    is_border       = false;
    is_draw_shape   = false;
    is_draw_brush   = false;
    is_drag_shape   = false;
    is_resize_shape = false;
    new_shape       = null;
    deltaXYPoly     = [];
    var set_select_label = selected_shape != null ? selected_shape.label : null;
    setSelectActiveLabel(set_select_label);
    clearCanvas(shape_ctx);
    reDrawShape();
    //drawBrush();
    //list_shapes.forEach(function(shape) { if(shape.type == 'polygon') console.log(shape); });
}, false);
shape_canvas.addEventListener('mouseout', function(event) {
    if (editing_status == 'shape') {
      if (new_shape != null) {
        list_shapes.push(new_shape);
      }
    }
    is_draw_shape   = false;
    is_draw_brush   = false;
    is_drag_shape   = false;
    is_resize_shape = false;
    new_shape       = null;
    deltaXYPoly     = [];
    clearCanvas(shape_ctx);
    reDrawShape();
    //drawBrush();
}, false);
shape_canvas.addEventListener('mousemove', function(event) {
    currentX = parseInt(event.offsetX);
    currentY = parseInt(event.offsetY);
    deltaX   = parseInt(Math.abs(startX - currentX));
    deltaY   = parseInt(Math.abs(startY - currentY));
    switch (editing_status) {
      case 'shape':
        if (is_draw_shape) {
            drawShape(event);
        }
        break;
      case 'brush':
        if (is_draw_brush) {
            createNewBrushPoint(currentX, currentY, true);
            drawBrush();
        }
        break;
      //case 'erase':
      //  break;
      default:
        viewShape(currentX, currentY);
        transformShape();
        clearCanvas(shape_ctx);
        reDrawShape();
        //drawBrush();
    }
}, false);

//
// ------------- Key handlers -------------
//
document.onkeydown = function(evt) {
    evt = evt || window.event;
    var isEscape    = false;
    var isBackspace = false;
    if (event.keyCode == 8) {
        if (is_select_shape) {
          deleteShape();
        }
        //console.log('BACKSPACE was pressed');
        // Call event.preventDefault() to stop the character before the cursor
        // from being deleted. Remove this line if you don't want to do that.
        event.preventDefault();
    }
    if (event.keyCode == 46) {
        //console.log('DELETE was pressed');
        if (is_select_shape) {
          deleteShape();
        }
        // Call event.preventDefault() to stop the character after the cursor
        // from being deleted. Remove this line if you don't want to do that.
        event.preventDefault();
    }
    if ("key" in evt) {
        isEscape = (evt.key === "Escape" || evt.key === "Esc");
    } else {
        isEscape = (evt.keyCode === 27);
    }
    if (isEscape) {
        if (is_select_shape) {
          selected_shape = null;
          is_drag_shape  = false;
          removeSelection();
        }
        perimeter  = [];
        is_drawing_shape = false;
        clearCanvas(shape_ctx);
        reDrawShape();
        //drawBrush();
    }
    if (isBackspace) {
        console.log(isBackspace);
        console.log('Backspace');
    }
};

//
// ------------- Admission to drawing on canvas -------------
//
function startDrawing(type) {
  var btn;
  shape_canvas.style.cursor = 'crosshair'
  if (type == 'brush')
    btn =  document.getElementById('startDrawingBrush');
  if (type == 'shape')
    btn = document.getElementById('startDrawingShape');
  //if (type == 'erase')
  //  btn = document.getElementById('startDrawingErase');
  var btns = document.getElementsByName('drawing');
  for (var i = 0; i < btns.length; i++) {
    var current = document.getElementsByClassName("active");
  }
  if (current.length == 0) {
    btn.className = 'active';
    editing_status = type;
  } else {
    if (current[0] == btn) {
      btn.className = btn.className.replace('active', '');
      editing_status = null;
    } else {
      current[0].className = current[0].className.replace('active', '');
      btn.className = 'active';
      editing_status = type;
    }
  }
  //console.log(editing_status);
  if (is_select_shape) {
    selected_shape  = null;
    is_drag_shape   = false;
    is_select_shape = false;
    removeSelection();
    clearCanvas(shape_ctx);
    reDrawShape();
    //drawBrush();
  }
}

//
// ------------- Handlers for load image -------------
//
function set_canvas_style() {
  image_canvas.style.border  = '1px solid white';
  shape_canvas.style.cursor = 'crosshair';
  shape_canvas.style.border = '1px dashed black';
}
function set_canvas_size(h, w) {
  canvas_panel.style.height = (h + 20) + 'px';
  canvas_panel.style.width  = (w + 20) + 'px';
  image_canvas.height       = h;
  image_canvas.width        = w;
  brush_canvas.height       = h;
  brush_canvas.width        = w;
  shape_canvas.height       = h;
  shape_canvas.width        = w;
}
function change_bw_colors() {
  var imageData = image_ctx.getImageData(0, 0, image_canvas.width, image_canvas.height);
  var pixels = imageData.data;
  var numPixels = imageData.width * imageData.height;
  for (var i = 0; i < numPixels; i++) {
    if (pixels[i*4] == 255 && pixels[i*4+1] == 255 && pixels[i*4+2] == 255) {
      pixels[i*4]   = 254; // Red
      pixels[i*4+1] = 254; // Green
      pixels[i*4+2] = 254; // Blue
    }
    if (pixels[i*4] == 0 && pixels[i*4+1] == 0 && pixels[i*4+2] == 0) {
      pixels[i*4]   = 1; // Red
      pixels[i*4+1] = 1; // Green
      pixels[i*4+2] = 1; // Blue
    }
  };
  image_ctx.clearRect(0, 0, image_canvas.width, image_canvas.height);
  image_ctx.putImageData(imageData, 0, 0);
}
function load_image() {
  return new Promise(function(resolve, reject) {
    current_image = new Image();
    current_image.onload = function() {
      current_image_height = current_image.naturalHeight;
      current_image_width  = current_image.naturalWidth;
      canvas_height        = Math.round(current_image_height);
      canvas_width         = Math.round(current_image_width);
      set_canvas_size(canvas_height, canvas_width);
      set_canvas_style();
      image_ctx.clearRect(0, 0, canvas_width, canvas_height);
      image_ctx.drawImage(current_image, 0, 0, canvas_width, canvas_height);
      current_image_loaded = true;
      resolve(current_image_filename);
    }
    current_image.onerror = function() {
      reject(current_image_filename);
      //reject(new Error("Error"));
    };
    current_image.src = current_image_filename;
  });
}

//
// ------------- Handlers for top navigation bar -------------
//
// zoom
function zoom_in() {
    if (!current_image_loaded) {
      alert('First upload the image!');
      return;
    }
}
function zoom_out() {
    if (!current_image_loaded) {
      alert('First upload the image!');
      return;
    } else {
      var scw = shape_canvas.width * 0.9;
      var sch = shape_canvas.height * 0.9;
      var icw = image_canvas.width * 0.9;
      var ich = image_canvas.height * 0.9;
      image_canvas.width   = icw;
      image_canvas.height  = ich;
      shape_canvas.width  = scw;
      shape_canvas.height = sch;
      image_ctx.drawImage(current_image, 0,0, icw, ich);
      shape_ctx.drawImage(current_image, 0,0, scw, sch);
    }
}
function zoom_fit() {
    if (!current_image_loaded) {
      alert('First upload the image!');
      return;
    }
}
function zoom_real() {
    if (!current_image_loaded) {
      alert('First upload the image!');
      return;
    }
}
// color pallete
function setActiveBtnColorPallete() {
  // Add active class to the current button (highlight it)
  var color_palette = document.getElementById("color_palette");
  var btns = document.getElementsByClassName("cell_color");
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
      var current = document.getElementsByClassName("cell_color_active");
      current[0].className = current[0].className.replace(" cell_color_active", "");
      current_color = LIST_COLOR[this.style.backgroundColor];
      //console.log(current_color);
      this.className += " cell_color_active"
    })
  }
}
// shapes
function setActiveBtnSelectedShape() {
  // Add active class to the current button (highlight it)
  var active_shape = document.getElementById('active_shape');
  var set_shapes = document.getElementById("set_shapes");
  var btns = set_shapes.getElementsByClassName("cell_shape");
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
      var current = document.getElementsByClassName("shape_active");
      current[0].className = current[0].className.replace(" shape_active", "");
      active_shape.className = this.childNodes[0].className;
      current_shape = this.id;
      this.className += " shape_active"
    })
  }
}
//labels
function setSelectActiveLabel(label) {
  //var option = select.options;
  if (label == null) {
    select.selectedIndex = 0;
  } else {
    if (LIST_LABEL_SHAPE.indexOf(label) != -1) {
      var index = LIST_LABEL_SHAPE.indexOf(label) + 1;
      select.selectedIndex = index;
    }
  }
}
function setLabelList() {
  for (var i = 0; i < LIST_LABEL_SHAPE.length; i++) {
    var option = document.createElement('option');
    option.innerHTML = LIST_LABEL_SHAPE[i];
    select.appendChild(option);
  }
  setSelectActiveLabel(null)
}
select.addEventListener('change', function() {
  var index = select.selectedIndex;
  var label = select.options[index].value;
  if (selected_shape != null) {
    selected_shape.label = index != 0 ? label : null;
  } else {
    label = null;
  }
  setSelectActiveLabel(label);
})

//
// ------------- Get image handler -------------
//
function downloadImage() {
  /*var image = new Image();
  image.id = "pic"
  image.src = image_canvas.toDataURL();
  document.getElementById('image_for_crop').appendChild(image);*/
  var btn_download = document.getElementById('downloadImage');
  var image = image_canvas.toDataURL("image/jpg");
  btn_download.download = "ia_image.jpg";
  btn_download.href = image;
  btn_download.click();
}

//
// ------------- Save annotation handler -------------
//
function save_annotation() {
  var sa = JSON.stringify(list_shapes);
  console.log(sa);
  var restoredSession = JSON.parse(sa);
  console.log(restoredSession);
}

//
// ------------- Show message handler -------------
//
function showMessage(msg, er) {
  var parent         = document.getElementById('navbar');
  var div            = document.createElement('div');
  var span           = document.createElement('span');
  div.id             = 'message';
  switch (er) {
    case 'success':
      div.style.backgroundColor = '#2eb82e';
      span.style.color          = '#fff';
      break;
    case 'unsuccess':
      div.style.backgroundColor = '#ff5050';
      span.style.color          = '#fff';
      break;
    default:
      div.style.backgroundColor = '#fff';
      span.style.color          = '#000';
  }
  span.style.fontSize    = '14px';
  span.style.wordWrap    = 'break-word';
  span.innerHTML         = msg;
  div.appendChild(span);
  parent.appendChild(div);
  setTimeout(function () {
    div.className = 'fade';
  }, 1000);
  setTimeout(function () {
    var del = document.getElementById('message');
    parent.removeChild(del);
  }, 1500);
}

//
// ------------- Init function -------------
//
function init() {
  var msg;
  console.log(navigator.userAgent);
  setActiveBtnColorPallete();
  setActiveBtnSelectedShape();
  setLabelList();
  load_image()
  .then(function(url) {
    msg = 'Image uploaded successfully';
    er  = 'success';
    showMessage(msg, er)
  })
  .then(function() {
    change_bw_colors();
  })
  .then(function() {
    reDrawShape();
  })
  .catch(function(e)
  {
    msg = 'Error: ' + e;
    er  = 'unsuccess';
    showMessage(msg, er)
  });
}

//----------------------------------------------------------
document.addEventListener('DOMContentLoaded', init());

window.onbeforeunload = function() {
  return "Вы точно хойтите уйти?";
};
