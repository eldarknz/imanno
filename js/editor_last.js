console.log(navigator.userAgent);

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
var current_image_filename = '/Users/ek_dev/Projects/IA/imgs/screenshot_4.png';
var current_image;
var current_image_width;
var current_image_height;

// image canvas
var canvas_height;
var canvas_width;
var canvas_panel  = document.getElementById('canvas_panel');
var image_canvas  = document.getElementById('image_canvas');
var shapes_canvas = document.getElementById('shapes_canvas');
var image_ctx     = image_canvas.getContext('2d');
var shapes_ctx    = shapes_canvas.getContext('2d');

var select        = document.getElementById('labelSelect');
// editing status
var editing_status         = null;
// drawing shape status
var is_drawing_shape       = false;
// drawing brushstroke status
var is_drawing_brushstroke = false;
// status loaded image
var current_image_loaded   = false;
// status selected shape
var is_selected            = false;
// dragging or resizing status
var is_transforming        = null;
// list of shapes
var list_shapes            = [{color:"rgba(0,0,255,1.0)",isSelected:false,label:"rectangle",type:"rect",  x:155,y:281,w:162,h:-143},
                              {color:"rgba(255,0,0,1.0)",isSelected:false,label:null,type:"circle",x:562,y:193,r:93},
                              {color:"rgba(255,0,0,1.0)",isSelected:false,label:"circle",type:"circle",x:862,y:243,r:93},
                              {color:"rgba(255,0,0,1.0)",isSelected:false,label:"circle",type:"circle",x:662,y:443,r:93},
                              {color:"rgba(0,0,255,1.0)",isSelected:false,label:null,type:"rect",  x:255,y:481,w:162,h:-143}];
// current shape properties
var new_shape              = null;
// shapes
var current_shape          = 'rect';
// shape colors
var current_color          = '0,0,0';
// shape colors
var current_color_opacity  = '1.0';
// point color
var current_fillstyle      = 'rgba(0, 0, 0, 0.2)';
// point color
var point_color            = null;
// polygon perimeter
var perimeter              = [];
// selected shape
var selected_shape    = null;
// focused shape
var focused_shape     = null;
// selected rect
var selected_rectangle     = null;
//
var pos_cursor_in_shape    = 1;
// number selected shap from list_shapes
var num_selected_shape     = null;
// current zoom
var current_zoom           = null;
// current label
var current_label          = null;

// coordinate
var startX   = 0;
var startY   = 0;
var currentX = 0;
var currentY = 0;
var deltaX   = 0;
var deltaY   = 0;
var deltaX1  = 0;
var deltaY1  = 0;
var deltaXYPoly = [];

// class shapes
function Rectangle(x0, y0, x1, y1, color) {
    this.x          = x0;
    this.y          = y0;
    this.w          = parseInt(x1 - x0);
    this.h          = parseInt(y1 - y0);
    this.color      = color;
    this.type       = LIST_SHAPES.RECT;
    this.isSelected = false;
    this.label      = null;
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

//
// ------------- Clear handlers -------------
//
function clearCanvas() {
  shapes_ctx.clearRect(0, 0, shapes_canvas.width, shapes_canvas.height);
}
function clearCanvasContent() {
  if (is_selected) {
    deleteShape();
  } else {
    if (list_shapes.length > 0) {
      var result = confirm("Want to delete?")
      if (result) {
        clearCanvas();
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
    var p = ctx.getImageData(x, y, 1, 1).data;
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
  var char_width    = shapes_ctx.measureText('M').width;
  var char_height   = 1.8 * char_width;
  var bg_rect_width = shapes_ctx.measureText(label_num).width + char_width;
  shapes_ctx.beginPath();
  shapes_ctx.fillStyle = 'black';
  shapes_ctx.fillRect(Math.floor(x),
                      Math.floor(y - 1.1 * char_height),
                      Math.floor(bg_rect_width),
                      Math.floor(char_height));
  shapes_ctx.font      = 'Arial';
  shapes_ctx.fillStyle = 'white';
  shapes_ctx.fillText(label_num, Math.floor(x + 0.4 * char_width), Math.floor(y - 0.35 * char_height));
}

//
// ------------- Conrol point handler -------------
//
function drawControlPoint(color, x, y) {
  shapes_ctx.beginPath();
  shapes_ctx.arc(x, y, SHAPE_POINT_RADIUS, 0, 2 * Math.PI, false);
  shapes_ctx.closePath();
  shapes_ctx.fillStyle   = color;
  shapes_ctx.globalAlpha = 1.0;
  shapes_ctx.fill();
}

//
// ------------- Polygon point handler -------------
//
function polygonPoint(x, y) {
    shapes_ctx.fillStyle     = getColor();
    shapes_ctx.strokeStyle   = getColor();
    shapes_ctx.fillRect(x - 2, y - 2, 4, 4);
    shapes_ctx.moveTo(x,y);
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
// ------------- Redraw handler -------------
//
function reDrawShape() {
  for (var i = 0; i < list_shapes.length; i++) {
    var drawing_shape = list_shapes[i];
    var shape_type    = drawing_shape.type;
    switch (shape_type) {
      case 'rect':
        drawRectShape(drawing_shape, i);
        break;
      case 'circle':
        drawCircleShape(drawing_shape, i);
        break;
      case 'ellipse':
        drawEllipseShape(drawing_shape, i);
        break;
      case 'polygon':
        drawPolygonShape(drawing_shape, i);
        break;
      case 'point':
        drawPointShape(drawing_shape, i);
        break;
      default:
        alert('Error');
    }
  }
  if (perimeter.length > 0) {
    drawPerimeter();
  }
}

//
// ------------- Drawing shape handlers -------------
//
// draw perimeter for polygon
function drawPerimeter() {
  shapes_ctx.lineWidth = LINE_WIDTH;
  shapes_ctx.strokeStyle = getColor();; //shape.color;
  shapes_ctx.lineCap = "square";
  shapes_ctx.beginPath();
  for(var i = 0; i < perimeter.length; i++) {
      if (i==0) {
          shapes_ctx.moveTo(perimeter[i]['x'],perimeter[i]['y']);
          polygonPoint(perimeter[i]['x'],perimeter[i]['y']);
      } else {
          shapes_ctx.lineTo(perimeter[i]['x'],perimeter[i]['y']);
          polygonPoint(perimeter[i]['x'],perimeter[i]['y']);
      }
  }
  shapes_ctx.stroke();
}
function drawPerimeterParams() {
  x = parseInt(event.offsetX);
  y = parseInt(event.offsetY);
  if (perimeter.length > 0 && x == perimeter[perimeter.length-1]['x'] && y == perimeter[perimeter.length-1]['y']) {
      // same point - double click
      return false;
  }
  if (check_intersect(x, y)) {
      alert('The line you are drowing intersect another line');
      return false;
  }
  perimeter.push({'x': x, 'y': y });
  drawPerimeter();
}

// draw shapes
function drawRectShape(shape, n) {
  if (n != undefined) {
    lX = shape.x < (shape.x + shape.w) ? (shape.x + shape.w) : shape.x;
    lY = shape.y < (shape.y + shape.h) ? shape.y : (shape.y + shape.h);
    drawLabel(n, lX, lY);
  }
  shapes_ctx.beginPath();
  if (shape.isSelected) {
    shapes_ctx.lineWidth = 3;
    shapes_ctx.strokeStyle = 'black';
    point_color = 'rgb(255,0,0)';
  }
  else {
    shapes_ctx.lineWidth = LINE_WIDTH;
    shapes_ctx.strokeStyle = shape.color;
    point_color = shape.color;
  }
  shapes_ctx.rect(shape.x, shape.y, shape.w, shape.h);
  shapes_ctx.fillStyle = current_fillstyle;
  shapes_ctx.fill();
  shapes_ctx.stroke();
  //drawControlPoint(shape.color, shape.x + shape.w / 2, shape.y + shape.h / 2); // center
  drawControlPoint(point_color, shape.x, shape.y + shape.h / 2);               // left
  drawControlPoint(point_color, shape.x + shape.w / 2, shape.y);               // top
  drawControlPoint(point_color, shape.x + shape.w, shape.y + shape.h / 2);     // right
  drawControlPoint(point_color, shape.x + shape.w / 2, shape.y + shape.h);     // bottom
  drawControlPoint(point_color, shape.x, shape.y);                             // left-top
  drawControlPoint(point_color, shape.x + shape.w, shape.y);                   // right-top
  drawControlPoint(point_color, shape.x + shape.w, shape.y + shape.h);         // right-bottom
  drawControlPoint(point_color, shape.x, shape.y + shape.h);                   // left-bottom
}
function drawCircleShape(shape, n) {
  if (n != undefined) {
    drawLabel(n, shape.x, shape.y - shape.r);
  }
  shapes_ctx.beginPath();
  shapes_ctx.arc(shape.x, shape.y, shape.r, 0, Math.PI*2);
  if (shape.isSelected) {
    shapes_ctx.lineWidth = 3;
    shapes_ctx.strokeStyle = 'black';
    point_color = 'rgb(255,0,0)';
  }
  else {
    shapes_ctx.lineWidth = LINE_WIDTH;
    shapes_ctx.strokeStyle = shape.color;
    point_color = shape.color;
  }
  shapes_ctx.fillStyle = current_fillstyle;
  shapes_ctx.fill();
  shapes_ctx.stroke();
  //drawControlPoint(shape.color, shape.x, shape.y); // center
  drawControlPoint(point_color, shape.x - shape.r, shape.y); //left
  drawControlPoint(point_color, shape.x, shape.y - shape.r); //top
  drawControlPoint(point_color, shape.x + shape.r, shape.y); //right
  drawControlPoint(point_color, shape.x, shape.y + shape.r); //bottom

}
function drawEllipseShape(shape, n) {
  if (n != undefined) {
    drawLabel(n, shape.x, shape.y - shape.y1);
  }
  shapes_ctx.save();
  shapes_ctx.beginPath();
  shapes_ctx.translate(shape.x - shape.x1, shape.y - shape.y1);
  shapes_ctx.scale(shape.x1, shape.y1);
  shapes_ctx.arc(1, 1, 1, 0, 2 * Math.PI, false);
  shapes_ctx.restore(); // restore to original state
  shapes_ctx.closePath();
  shapes_ctx.fillStyle = current_fillstyle;
  shapes_ctx.fill();
  if (shape.isSelected) {
    shapes_ctx.lineWidth = 3;
    shapes_ctx.strokeStyle = 'black';
    point_color = 'rgb(255,0,0)';
  }
  else {
    shapes_ctx.lineWidth = LINE_WIDTH;
    shapes_ctx.strokeStyle = shape.color;
    point_color = shape.color;
  }
  shapes_ctx.stroke();
  //drawControlPoint(shape.color, shape.x, shape.y); // center
  drawControlPoint(point_color, shape.x + shape.x1, shape.y); // left
  drawControlPoint(point_color, shape.x, shape.y - shape.y1); //top
  drawControlPoint(point_color, shape.x - shape.x1, shape.y); //right
  drawControlPoint(point_color, shape.x, shape.y + shape.y1); //bottom
}
function drawPointShape(shape, n) {
  if (n != undefined) {
    drawLabel(n, shape.x, shape.y);
  }
  if (shape.isSelected) {
    shapes_ctx.fillStyle = 'rgb(255,0,0)';
    shapes_ctx.strokeStyle = 'rgb(255,0,0)';
  } else {
    shapes_ctx.fillStyle = shape.color;
    shapes_ctx.strokeStyle = shape.color;
  }
  shapes_ctx.fillRect(shape.x - 4, shape.y - 4, 8, 8);
  shapes_ctx.moveTo(shape.x, shape.y);
}
function drawPolygonShape(shape, n) {
  if (n != undefined) {
    drawLabel(n, shape.coordinates[0]['x'], shape.coordinates[0]['y']);
  }
  if (shape.isSelected) {
    shapes_ctx.lineWidth = 3;
    shapes_ctx.strokeStyle = 'rgb(0,0,0)';
    point_color = 'rgb(255,0,0)';
  }
  else {
    shapes_ctx.lineWidth = LINE_WIDTH;
    shapes_ctx.strokeStyle = shape.color;
    point_color = shape.color;
  }
  shapes_ctx.lineCap = "square";
  shapes_ctx.beginPath();
  for(var i = 0; i < shape.coordinates.length; i++) {
    if (i==0) {
      shapes_ctx.moveTo(shape.coordinates[i]['x'],shape.coordinates[i]['y']);
    } else {
      shapes_ctx.lineTo(shape.coordinates[i]['x'],shape.coordinates[i]['y']);
    }
  }
  shapes_ctx.lineTo(shape.coordinates[0]['x'], shape.coordinates[0]['y']);
  shapes_ctx.closePath();
  shapes_ctx.fillStyle = current_fillstyle;
  shapes_ctx.fill();
  shapes_ctx.stroke();
  for (var i = 0; i < shape.coordinates.length; i++) {
    drawControlPoint(point_color, shape.coordinates[i]['x'], shape.coordinates[i]['y']);
  }
}

// draw params for shapes
function drawRectParams() {
  new_shape = new Rectangle(startX, startY, currentX, currentY, getColor());
  drawRectShape(new_shape)
}
function drawCircleParams() {
  new_shape = new Circle(startX, startY, deltaX, deltaY, getColor());
  drawCircleShape(new_shape)
}
function drawEllipseParams() {
  new_shape = new Ellipse(startX, startY, deltaX, deltaY, getColor());
  drawEllipseShape(new_shape)
}
function drawPointParams() {
  new_shape = new Point (startX, startY, getColor());
  drawPointShape(new_shape);
}
function drawPolygonParams() {
  new_shape = new Polygon (perimeter, getColor());
  drawPolygonShape(new_shape);
}

// draw brushstroke
function drawBrush(e, x, y) {
    /*if (e.type == 'mousedown') {
      image_ctx.moveTo(x, y);
    }
    if (e.type == 'mousemove') {
      image_ctx.lineWidth = 10;
      image_ctx.lineJoin = image_ctx.lineCap = 'round';
      image_ctx.strokeStyle = getColor();
      image_ctx.lineTo(x, y);
      image_ctx.stroke();
    }*/

    var id = image_ctx.createImageData(5,5); // only do this once per page
    var d  = id.data;                        // only do this once per page
    var np = id.width * id.height;
    var brushstroke_color = current_color.split(',');
    for (var i = 0; i < np; i++) {
      d[i * 4]       = brushstroke_color[0];
      d[i * 4 + 1]   = brushstroke_color[1];
      d[i * 4 + 2]   = brushstroke_color[2];
      d[i * 4 + 3]   = 255;
    };
    image_ctx.putImageData(id, x, y);
}

//
// ------------- Mouse on canvas handlers -------------
//
shapes_canvas.addEventListener('mousedown', function(event) {
  startX = parseInt(event.offsetX);
  startY = parseInt(event.offsetY);
  switch (editing_status) {
    case 'draw_shape':
      is_drawing_shape = true;
      if (current_shape == 'polygon') {
        if (event.which == '1') {
          drawPerimeterParams();
        }
        if (event.which == '3' || event.button == '2') {
          if (perimeter.length <= 2) {
              alert('You need at least three points for a polygon');
              shapes_canvas.oncontextmenu = function (e) { e.preventDefault(); };
              return false;
          }
          if (check_intersect(perimeter[0]['x'], perimeter[0]['y'])) {
              alert('The line you are drowing intersect another line');
              shapes_canvas.oncontextmenu = function (e) { e.preventDefault(); };
              return false;
          }
          drawPolygonParams();
          perimeter = [];
        }
      }
      if (current_shape == 'point') {
        drawPointParams();
      }
      shapes_canvas.oncontextmenu = function (event) { event.preventDefault(); };
      break;
    case 'draw_brush':
      is_drawing_brushstroke = true;
      drawBrush(event, startX, startY);
      break;
    default:
      selectShape(startX, startY);
  }
  console.log('editing_status => ' + editing_status);
  console.log('is_drawing_shape => ' + is_drawing_shape);
  console.log('is_drawing_brushstroke => ' + is_drawing_brushstroke);
  console.log('is_selected => ' + is_selected);
  console.log('is_transforming => ' + is_transforming);
}, false);
shapes_canvas.addEventListener('mouseup', function(event) {
  if (editing_status == 'draw_shape') {
    if (new_shape != null) {
      list_shapes.push(new_shape);
    }
  }
  new_shape              = null;
  deltaXYPoly            = [];
  is_drawing_shape       = false;
  is_drawing_brushstroke = false;
  is_transforming        = null;
  var set_select_label = selected_shape != null ? selected_shape.label : null;
  setSelectActiveLabel(set_select_label);
  clearCanvas();
  reDrawShape();
}, false)
shapes_canvas.addEventListener('mouseout', function(event) {
  if (editing_status == 'draw_shape') {
    if (new_shape != null) {
      list_shapes.push(new_shape);
    }
  }
  new_shape              = null;
  deltaXYPoly            = [];
  is_drawing_shape       = false;
  is_drawing_brushstroke = false;
  is_transforming        = null;
  clearCanvas();
  reDrawShape();
}, false)
shapes_canvas.addEventListener('mousemove', function(event) {
  currentX   = parseInt(event.offsetX);
  currentY   = parseInt(event.offsetY);
  deltaX     = parseInt(Math.abs(startX - currentX));
  deltaY     = parseInt(Math.abs(startY - currentY));
  switch (editing_status) {
    case 'draw_shape':
      if (is_drawing_shape) {
        if (current_shape != 'polygon' && current_shape != 'point') {
          clearCanvas();
          switch (current_shape) {
            case 'rect':
              drawRectParams();
              break;
            case 'circle':
              drawCircleParams();
              break;
            case 'ellipse':
              drawEllipseParams();
              break;
          }
          reDrawShape()
        }
      }
      break;
    case 'draw_brush':
      if (is_drawing_brushstroke) {
        drawBrush(event, currentX, currentY);
      }
      break;
    default:
      console.log(viewInShape(currentX, currentY));
      transformShape();
      clearCanvas();
      reDrawShape();
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
        if (is_selected) {
          deleteShape();
        }
        //console.log('BACKSPACE was pressed');
        // Call event.preventDefault() to stop the character before the cursor
        // from being deleted. Remove this line if you don't want to do that.
        event.preventDefault();
    }
    if (event.keyCode == 46) {
        //console.log('DELETE was pressed');
        if (is_selected) {
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
        if (is_selected) {
          selected_shape  = null;
          is_transforming = null;
          removeSelection();
        }
        perimeter  = [];
        is_drawing_shape = false;
        clearCanvas();
        reDrawShape();
    }
    if (isBackspace) {
        console.log(isBackspace);
        console.log('Backspace');
    }
};

//
// ------------- Zoom handlers -------------
//
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
      var scw = shapes_canvas.width * 0.9;
      var sch = shapes_canvas.height * 0.9;
      var icw = image_canvas.width * 0.9;
      var ich = image_canvas.height * 0.9;
      image_canvas.width   = icw;
      image_canvas.height  = ich;
      shapes_canvas.width  = scw;
      shapes_canvas.height = sch;
      image_ctx.drawImage(current_image, 0,0, icw, ich);
      shapes_ctx.drawImage(current_image, 0,0, scw, sch);
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

//
// ------------- Select shape handlers -------------
//
function removeSelection() {
  list_shapes.forEach(function(shape) { shape.isSelected = false; });
  selected_rectangle = null;
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
    var msg = [];
    pos_cursor_in_shape = 2;
    //---
    var x1; var x2; var y1; var y2;
    if (xp[0] < xp[1]) {
      x1 = xp[0]; x2 = xp[1];
    } else {
      x1 = xp[1]; x2 = xp[0];
    }
    if (yp[0] < yp[2]) {
      y1 = yp[0]; y2 = yp[2];
    } else {
      y1 = yp[2]; y2 = yp[0];
    }
    //---
    if (x >= x1, x <= x1 + 5) {
      msg.push('left');
    }
    if (x <= x2, x >= x2 - 5) {
      msg.push('right');
    }
    if (y >= y1 && y <= y1 + 5) {
      msg.push('top');
    }
    if (y <= y2, y >= y2 - 5) {
      msg.push('bottom');
    }
    if (msg.length != 0) {
      /*console.log('near the border rect: ' + msg.join('-'));*/
      pos_cursor_in_shape = 1;
    }
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
  return c;
}
function inCircle(x, y, r, x1, y1) {
  var distanceFromCenter = Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2))
  if (distanceFromCenter <= r) {
    pos_cursor_in_shape = 2;
    if (distanceFromCenter >= r - 5 && distanceFromCenter <= r) {
      pos_cursor_in_shape = 1;
    }
    return true;
  }
  return false;
}
function inEllipse(h, k, x, y, a, b) {
  var ext_area = ((Math.pow((x - h), 2) / Math.pow(a, 2)) + (Math.pow((y - k), 2) / Math.pow(b, 2)))
  var int_area = ((Math.pow((x - h), 2) / Math.pow(a - 3, 2)) + (Math.pow((y - k), 2) / Math.pow(b - 3, 2)))
  if (ext_area < 1) {
    if (int_area > 1) {
      /*console.log('near the border ellipse');*/
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
  return c;
}
function inShape(shape, x, y) {
  var xp      = []; // X-coordinate array of the shape
  var yp      = []; // X-coordinate array of the shape
  var in_shape;
  switch (shape.type) {
    case 'rect':
      selected_rectangle = shape;
      var x0 = shape.x; var x1 = shape.x + shape.w;
      var y0 = shape.y; var y1 = shape.y + shape.h;
      xp = [x0, x1, x1, x0];
      yp = [y0, y0, y1, y1];
      in_shape = inRect(x, y, xp, yp);
      break;
    case 'polygon':
      shape.coordinates.forEach(function(xy) {
        xp.push(xy['x']);
        yp.push(xy['y']);
      });
      in_shape = inPolygon(x, y, xp, yp);
      break;
    case 'circle':
      in_shape = inCircle(shape.x, shape.y, shape.r, x, y);
      break;
    case 'ellipse':
      in_shape = inEllipse(x, y, shape.x, shape.y, shape.x1, shape.y1);
      break;
    case 'point':
      selected_rectangle = shape;
      var x0 = shape.x - 4; var x1 = shape.x - 4 + 8;
      var y0 = shape.y - 4; var y1 = shape.y - 4 + 8;
      xp = [x0, x1, x1, x0];
      yp = [y0, y0, y1, y1];
      in_shape = inPoint(x, y, xp, yp);
      break;
    default:
      console.log('Change figure');
  }
  console.log(in_shape);
  return in_shape;
}

function deleteShape() {
  var result = confirm("Want to delete?")
  if (result) {
    list_shapes.splice(num_selected_shape,1);
    selected_shape = null;
    num_selected_shape  = null;
    is_transforming     = null;
    is_selected         = false;
    shapes_canvas.style.cursor = 'crosshair';
    removeSelection();
    clearCanvas();
    reDrawShape();
  }
}
function transformShape() {
  // check dragging
  switch (is_transforming) {
    case 'resize':
      console.log('resize');
      switch (selected_shape.type) {
        case 'rect':
          selected_shape.h = currentY - selected_shape.y;
          selected_shape.w = currentX - selected_shape.x;
          break;
        case 'circle':
          selected_shape.r = Math.sqrt(Math.pow(selected_shape.x - currentX, 2) +
                                            Math.pow(selected_shape.y - currentY, 2))
          break;
        case 'ellipse':
          console.log('ellipse');
          break;
        case 'polygon':
          console.log('polygon');
          break;
      }
      break;
    case 'drag':
      console.log('drag');
      // check in shape
      if (selected_shape != null) {
        // move the shape to a new position
        if (selected_shape.type == 'polygon') {
          for (var i = 0; i < selected_shape.coordinates.length; i++) {
            selected_shape.coordinates[i].x = currentX - deltaXYPoly[i].dx;
            selected_shape.coordinates[i].y = currentY - deltaXYPoly[i].dy;
          }
        } else {
            selected_shape.x = currentX - deltaX1;
            selected_shape.y = currentY - deltaY1;
        }
      }
      break;
  }
  clearCanvas();
  reDrawShape();
}

function selectShape(x, y) {
  // Проверяем, щелкнули ли no фигуре
  if(list_shapes.length > 0) {
    for (var i = 0; i < list_shapes.length; i++) {
      var shape   = list_shapes[i];
      if (inShape(shape, x, y)) {
        switch (pos_cursor_in_shape) {
          case 1:
            is_transforming = 'resize';
            break;
          case 2:
            is_transforming = 'drag';
            break;
        }
        switch (shape.type) {
          case 'rect':
            deltaX1 = x - shape.x;
            deltaY1 = y - shape.y;
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
            shape.coordinates.forEach(function(xy) {
              deltaXYPoly.push({dx: x - xy['x'], dy: y - xy['y']});
            });
            break;
        }
        if (selected_shape != null) {
          selected_shape.isSelected = false;
        }
        selected_shape            = shape;
        num_selected_shape        = i;
        selected_shape.isSelected = false;
        shape.isSelected          = true;
        is_selected = true;
        return;
      } else {
        shape.isSelected = false;
        selected_shape   = null;
        is_transforming  = null;
        is_selected      = false;
        removeSelection();
      }
    }
    //for (var j = 0; j < list_shapes.length; j++) {
    //  console.log(list_shapes[j]);
    //}
  }
}
function viewInShape(x, y) {
  // Проверяем, курсор внтури фигуры или нет
  if(list_shapes.length > 0) {
    for (var i = 0; i < list_shapes.length; i++) {
      var shape = list_shapes[i];
      if (inShape(shape, x, y)) {
        console.log(inShape(shape, x, y));
        shapes_canvas.style.cursor = 'move'
        focused_shape = shape;
      } else {
        shapes_canvas.style.cursor = 'crosshair'
        focused_shape = null;
        is_transforming  = null;
      }
    }
  }
}

//
// ------------- Admission to drawing on canvas -------------
//
function startDrawing(type) {
  var btn_brushstroke = document.getElementById('startDrawingBrush');
  var btn_shape       = document.getElementById('startDrawingShape');
  var btn_erase       = document.getElementById('startDrawingEraser');
  shapes_canvas.style.cursor = 'crosshair'
  if (type == 'brushstroke') {
    btn_brushstroke.classList.toggle('active');
    if (btn_brushstroke.classList.contains('active')) {
      if (btn_shape.classList.contains('active')) {
        btn_shape.classList.toggle('active');
      }
      editing_status = 'draw_brush';
      if (is_selected) {
        selected_shape = null;
        is_transforming = null;
        removeSelection();
        clearCanvas();
        reDrawShape();
      }
      return
    }
    editing_status = null;
  }
  if (type == 'shape') {
    btn_shape.classList.toggle('active');
    if (btn_shape.classList.contains('active')) {
      if (btn_brushstroke.classList.contains('active')) {
        btn_brushstroke.classList.toggle('active');
      }
      editing_status = 'draw_shape';
      if (is_selected) {
        selected_shape = null;
        is_transforming = null;
        removeSelection();
        clearCanvas();
        reDrawShape();
      }
      return
    }
    editing_status = null;
  }
  if (type == 'erase') {
    alert('Eraser')
  }
}

//
// ------------- Handlers for load image -------------
//
function set_canvas_style() {
  image_canvas.style.border  = '1px solid white';
  shapes_canvas.style.cursor = 'crosshair';
  shapes_canvas.style.border = '1px dashed black';
}
function set_canvas_size(h, w) {
    canvas_panel.style.height = (h + 20) + 'px';
    canvas_panel.style.width  = (w + 20) + 'px';
    image_canvas.height       = h;
    image_canvas.width        = w;
    shapes_canvas.height      = h;
    shapes_canvas.width       = w;
}
function change_bw_colors() {
  var imageData = image_ctx.getImageData(0, 0, canvas_width, canvas_height);
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
      setTimeout(function() {
            change_bw_colors();
      }, 1)
      current_image_loaded = true;
      resolve("result");
    }
    current_image.src    = current_image_filename;
    current_image.onerror = function() {
      reject(new Error("Error"));
    };
  });
}

//
// ------------- Handlers for top navigation bar -------------
//
function setActiveBtnColorPallete() {
  // Add active class to the current button (highlight it)
  var color_palette = document.getElementById("color_palette");
  var btns = document.getElementsByClassName("cell_color");
  for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function() {
      var current = document.getElementsByClassName("cell_color_active");
      current[0].className = current[0].className.replace(" cell_color_active", "");
      current_color = LIST_COLOR[this.style.backgroundColor];
      this.className += " cell_color_active"
    })
  }
}
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

//
// ------------- Handlers for set and get labels -------------
//
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
  }
  setSelectActiveLabel(label);
})

//
// ------------- Grabcut handlers -------------
//
function closeGrabcut() {
  var canvas_output = document.getElementById('canvasOutput')
  var button_close  = document.getElementById('buttonCanvasClose')
  canvas_panel.removeChild(canvas_output);
  canvas_panel.removeChild(button_close);
}
function startGrabcut(shape) {
  let src = cv.imread('image_canvas');
  cv.cvtColor(src, src, cv.COLOR_RGBA2RGB, 0);
  let mask = new cv.Mat();
  let bgdModel = new cv.Mat();
  let fgdModel = new cv.Mat();
  var sx = shape.x;
  var sy = shape.y;
  var sw = shape.w;
  var sh = shape.h;
  if (shape.w < 0) {
    sw = Math.abs(shape.w)
    sx -= sw;
  }
  if (shape.h < 0) {
    sh = Math.abs(shape.h)
    sy -= sh;
  }
  let rect = new cv.Rect(sx, sy, sw, sh);
  cv.grabCut(src, mask, rect, bgdModel, fgdModel, 1, cv.GC_INIT_WITH_RECT);
  // draw foreground
  for (let i = 0; i < src.rows; i++) {
      for (let j = 0; j < src.cols; j++) {
          if (mask.ucharPtr(i, j)[0] == 0 || mask.ucharPtr(i, j)[0] == 2) {
              src.ucharPtr(i, j)[0] = 0;
              src.ucharPtr(i, j)[1] = 0;
              src.ucharPtr(i, j)[2] = 0;
          }
      }
  }
  // draw grab rect
  let color = new cv.Scalar(0, 0, 255);
  let point1 = new cv.Point(rect.x, rect.y);
  let point2 = new cv.Point(rect.x + rect.width, rect.y + rect.height);
  cv.rectangle(src, point1, point2, color);
  cv.imshow('canvasOutput', src);
  src.delete(); mask.delete(); bgdModel.delete(); fgdModel.delete();
}
function createResultGrabcutCanvas() {
  var canvas_output            = document.createElement('canvas');
  var button_close             = document.createElement('button');
  canvas_output.id             = 'canvasOutput';
  canvas_output.width          = canvas_width;
  canvas_output.height         = canvas_height;
  canvas_output.style.border   = '1px solid white';
  canvas_output.style.backgroundColor = '#000';
  canvas_output.style.position = 'absolute';
  canvas_output.style.top      = '10px';
  canvas_output.style.left     = '10px';
  canvas_output.style.zIndex   = '4';
  canvas_panel.appendChild(canvas_output);
  button_close.id = 'buttonCanvasClose';
  button_close.style.position = 'absolute';
  button_close.style.top      = '10px';
  button_close.style.left     = '10px';
  button_close.style.backgroundColor = '';
  button_close.style.fontSize = '16px';
  button_close.backgroundColor = '#333';
  button_close.style.color = '#fff';
  button_close.style.textAlign = 'center';
  button_close.style.padding = '5px 5px';
  button_close.style.cursor = 'pointer';
  button_close.style.zIndex   = '4';
  button_close.onclick = function() { closeGrabcut(); };
  button_close.innerHTML = '<i class="fas fa-times"></i>';
  canvas_panel.appendChild(button_close);
}
function grabcut() {
  console.log(selected_rectangle);
  if (selected_rectangle != null) {
    createResultGrabcutCanvas();
    startGrabcut(selected_rectangle);
  } else {
    alert('Change rectangle for grabcut!')
  }
}

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
// ------------- Init function -------------
//
function init() {
  setActiveBtnColorPallete();
  setActiveBtnSelectedShape();
  setLabelList();
  /*load_image();*/
  load_image()
  .then(
    response => reDrawShape(),
    error => alert('Image failed to upload')
  );
  /*setTimeout(function() {
    reDrawShape();
  }, 100)*/
}

//----------------------------------------------------------
document.addEventListener('DOMContentLoaded', init())

/*window.onbeforeunload = function() {
  return "Вы точно хойтите уйти?";
};*/
