var LIST_SHAPES          = { RECT:"rect",
                           CIRCLE:"circle",
                           ELLIPSE:"ellipse",
                           POLYGON:"polygon",
                           POINT:"point",
                           POLYLINE:"polyline"
                         };
var LIST_COLOR           = { "white" : "255,255,255",
                             "silver": "192,192,192",
                             "gray"  : "128,128,128",
                             "black" : "0,0,0",
                             "red"   : "255,0,0",
                             "orange": "255,165,0",
                             "yellow": "255,255,0",
                             "lime"  : "0,255,0",
                             "green" : "0,128,0",
                             "aqua"  : "0,255,255",
                             "blue"  : "0,0,255",
                             "purple": "128,0,128"
                         };
var LINE_WIDTH           = 2;
var SHAPE_POINT_RADIUS   = 2;
var LINE_OFFSET          = 5;
var DEFAULT_LABEL_SHAPE  = "no selected";
var LIST_LABEL_SHAPE     = ["rectangle", "circle", "ellipse", "point", "polygon"];

//var strng = JSON.stringify(LIST_LABEL_SHAPE);
//var strng_1 = {a:'1', b:'2', c:'3', d:'4'};
//console.log(strng);
//console.log(JSON.parse(strng));
//console.log(JSON.stringify(strng_1));
//console.log(JSON.parse(strng).length);
//console.log(strng_1.length);

// current image
var url_path               = "/Users/ek_dev/Projects/IA/imgs/";
var image_name_list        = ["screenshot_1.png","screenshot_2.png","screenshot_3.jpg","screenshot_4.png"];
var current_image_filename = url_path + image_name_list[3];
var current_image          = null;
var current_image_width    = null;
var current_image_height   = null;

// image canvas
var canvas_height = null;
var canvas_width  = null;
var canvas_panel  = document.getElementById("canvas_panel");
var image_canvas  = document.getElementById("image_canvas");
var brush_canvas  = document.getElementById("brush_canvas");
var shape_canvas  = document.getElementById("shape_canvas");
var image_ctx     = image_canvas.getContext("2d");
var brush_ctx     = brush_canvas.getContext("2d");
var shape_ctx     = shape_canvas.getContext("2d");

// select form
var select                = document.getElementById("labelSelect");

// received list of shapes
var list_shapes                = [{"x0":129,"y0":19,"x1":340,"y1":55,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},
{"x0":649,"y0":410,"x1":791,"y1":457,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},
{"x0":1012,"y0":19,"x1":1101,"y1":58,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},
{"x0":1115,"y0":30,"x1":1179,"y1":49,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},
{"x0":1261,"y0":30,"x1":1304,"y1":48,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},
{"x0":1247,"y0":20,"x1":1257,"y1":54,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},
{"x0":1194,"y0":23,"x1":1221,"y1":50,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},
{"x0":356,"y0":29,"x1":442,"y1":47,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},
{"x0":465,"y0":28,"x1":558,"y1":48,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},
{"x0":581,"y0":28,"x1":663,"y1":48,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},
{"x0":388,"y0":907,"x1":1057,"y1":947,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":387,"y0":974,"x1":1054,"y1":1002,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":645,"y0":1044,"x1":795,"y1":1057,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":931,"y0":1116,"x1":1046,"y1":1134,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":929,"y0":1153,"x1":1108,"y1":1184,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":929,"y0":1195,"x1":1298,"y1":1269,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":930,"y0":1287,"x1":1044,"y1":1313,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":530,"y0":1117,"x1":689,"y1":1135,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":531,"y0":1153,"x1":689,"y1":1184,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":530,"y0":1195,"x1":876,"y1":1269,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":527,"y0":1287,"x1":643,"y1":1312,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":129,"y0":1288,"x1":244,"y1":1314,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":128,"y0":1197,"x1":501,"y1":1271,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":128,"y0":1152,"x1":322,"y1":1185,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":128,"y0":1113,"x1":328,"y1":1138,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":520,"y0":211,"x1":919,"y1":266,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":651,"y0":271,"x1":787,"y1":300,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":341,"y0":327,"x1":1099,"y1":353,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":444,"y0":356,"x1":998,"y1":384,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":616,"y0":162,"x1":823,"y1":199,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":2,"y0":71,"x1":1439,"y1":564,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":493,"y0":763,"x1":601,"y1":800,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":492,"y0":675,"x1":1168,"y1":743,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":492,"y0":626,"x1":691,"y1":660,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":492,"y0":594,"x1":589,"y1":611,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":0,"y0":566,"x1":1439,"y1":820,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":130,"y0":1395,"x1":273,"y1":1426,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":532,"y0":1393,"x1":698,"y1":1428,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":932,"y0":1394,"x1":1038,"y1":1428,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":931,"y0":1438,"x1":1295,"y1":1510,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":532,"y0":1442,"x1":894,"y1":1486,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":132,"y0":1444,"x1":506,"y1":1491,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":131,"y0":1509,"x1":243,"y1":1535,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":532,"y0":1507,"x1":645,"y1":1533,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":930,"y0":1529,"x1":1044,"y1":1554,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":529,"y0":1637,"x1":670,"y1":1668,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":530,"y0":1680,"x1":852,"y1":1730,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":529,"y0":1747,"x1":648,"y1":1776,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":129,"y0":1747,"x1":241,"y1":1773,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":128,"y0":1638,"x1":352,"y1":1668,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":132,"y0":1683,"x1":504,"y1":1729,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":130,"y0":1877,"x1":271,"y1":1911,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":129,"y0":1923,"x1":478,"y1":1994,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":130,"y0":2014,"x1":244,"y1":2041,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":128,"y0":2118,"x1":303,"y1":2153,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":129,"y0":2164,"x1":504,"y1":2236,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":128,"y0":2255,"x1":246,"y1":2287,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":130,"y0":2369,"x1":261,"y1":2395,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":128,"y0":2412,"x1":954,"y1":2438,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":426,"y0":2601,"x1":1016,"y1":2641,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":414,"y0":2670,"x1":1026,"y1":2692,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":628,"y0":2712,"x1":814,"y1":2759,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":177,"y0":2849,"x1":368,"y1":3019,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":429,"y0":2854,"x1":878,"y1":2883,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":430,"y0":2898,"x1":1198,"y1":2949,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":430,"y0":2969,"x1":544,"y1":2992,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":132,"y0":3077,"x1":1309,"y1":3090,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":343,"y0":4211,"x1":554,"y1":4240,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":342,"y0":4259,"x1":658,"y1":4357,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":193,"y0":4223,"x1":304,"y1":4344,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":134,"y0":4152,"x1":707,"y1":4414,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":798,"y0":4217,"x1":895,"y1":4348,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":941,"y0":4209,"x1":1177,"y1":4239,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":941,"y0":4258,"x1":1250,"y1":4357,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":733,"y0":4151,"x1":1309,"y1":4414,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":571,"y0":3720,"x1":702,"y1":3764,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":971,"y0":3703,"x1":1134,"y1":3773,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":168,"y0":3720,"x1":374,"y1":3761,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":169,"y0":3783,"x1":456,"y1":3857,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":172,"y0":3877,"x1":319,"y1":3902,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":571,"y0":3789,"x1":837,"y1":3882,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":571,"y0":3901,"x1":735,"y1":3937,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":972,"y0":3899,"x1":1118,"y1":3926,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":971,"y0":3784,"x1":1246,"y1":3877,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":935,"y0":3460,"x1":1305,"y1":3693,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":534,"y0":3460,"x1":906,"y1":3693,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":134,"y0":3461,"x1":505,"y1":3694,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":130,"y0":3457,"x1":509,"y1":3976,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":528,"y0":3456,"x1":912,"y1":3975,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":932,"y0":3456,"x1":1309,"y1":3976,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":147,"y0":3295,"x1":302,"y1":3356,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":364,"y0":3284,"x1":451,"y1":3362,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":510,"y0":3294,"x1":611,"y1":3353,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":669,"y0":3300,"x1":759,"y1":3346,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":822,"y0":3305,"x1":934,"y1":3343,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":990,"y0":3292,"x1":1073,"y1":3358,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":1128,"y0":3294,"x1":1298,"y1":3347,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":285,"y0":3173,"x1":1157,"y1":3212,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":582,"y0":4023,"x1":855,"y1":4052,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":529,"y0":4479,"x1":909,"y1":4526,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":347,"y0":4546,"x1":1090,"y1":4576,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":551,"y0":4578,"x1":889,"y1":4605,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":130,"y0":4648,"x1":182,"y1":4693,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":189,"y0":4656,"x1":381,"y1":4683,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":185,"y0":4700,"x1":390,"y1":4727,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":184,"y0":4747,"x1":343,"y1":4773,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":181,"y0":4794,"x1":289,"y1":4823,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":185,"y0":4845,"x1":357,"y1":4869,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":183,"y0":4891,"x1":351,"y1":4921,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":121,"y0":4640,"x1":397,"y1":4930,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":533,"y0":4646,"x1":582,"y1":4693,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":591,"y0":4655,"x1":742,"y1":4685,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":588,"y0":4702,"x1":899,"y1":4722,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":589,"y0":4727,"x1":713,"y1":4749,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":588,"y0":4773,"x1":893,"y1":4796,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":590,"y0":4800,"x1":757,"y1":4819,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":591,"y0":4845,"x1":881,"y1":4867,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":589,"y0":4870,"x1":729,"y1":4892,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":586,"y0":4919,"x1":893,"y1":4939,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":589,"y0":4942,"x1":766,"y1":4963,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":527,"y0":4640,"x1":899,"y1":4970,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":989,"y0":4702,"x1":1295,"y1":4724,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":989,"y0":4727,"x1":1072,"y1":4747,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":988,"y0":4772,"x1":1244,"y1":4794,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":988,"y0":4799,"x1":1299,"y1":4820,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":987,"y0":4845,"x1":1303,"y1":4868,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":990,"y0":4871,"x1":1265,"y1":4888,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":930,"y0":4642,"x1":982,"y1":4691,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":989,"y0":4654,"x1":1121,"y1":4683,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":926,"y0":4637,"x1":1309,"y1":4893,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":544,"y0":1888,"x1":1313,"y1":2333,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":1098,"y0":5339,"x1":1135,"y1":5377,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":1149,"y0":5339,"x1":1187,"y1":5377,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":1202,"y0":5340,"x1":1239,"y1":5377,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":1255,"y0":5339,"x1":1290,"y1":5377,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":370,"y0":5073,"x1":458,"y1":5096,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":611,"y0":5074,"x1":708,"y1":5095,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":849,"y0":5071,"x1":988,"y1":5097,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":1090,"y0":5074,"x1":1234,"y1":5096,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":129,"y0":5072,"x1":267,"y1":5096,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":105,"y0":5350,"x1":130,"y1":5373,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":135,"y0":5351,"x1":200,"y1":5373,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":272,"y0":5355,"x1":370,"y1":5374,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":392,"y0":5354,"x1":440,"y1":5372,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":460,"y0":5356,"x1":597,"y1":5374,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":617,"y0":5354,"x1":807,"y1":5372,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":370,"y0":5118,"x1":466,"y1":5134,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":368,"y0":5141,"x1":441,"y1":5160,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":370,"y0":5169,"x1":495,"y1":5185,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":371,"y0":5190,"x1":455,"y1":5211,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":371,"y0":5217,"x1":422,"y1":5235,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":371,"y0":5239,"x1":444,"y1":5260,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":1,"y0":2547,"x1":1439,"y1":2803,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":370,"y0":5274,"x1":494,"y1":5297,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":610,"y0":5115,"x1":739,"y1":5134,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":611,"y0":5141,"x1":770,"y1":5162,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":612,"y0":5167,"x1":762,"y1":5185,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":611,"y0":5191,"x1":733,"y1":5210,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":610,"y0":5216,"x1":706,"y1":5236,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":610,"y0":5242,"x1":702,"y1":5259,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":610,"y0":5274,"x1":761,"y1":5297,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":851,"y0":5114,"x1":916,"y1":5136,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":855,"y0":5142,"x1":1013,"y1":5160,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":851,"y0":5165,"x1":965,"y1":5186,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":851,"y0":5191,"x1":997,"y1":5209,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":851,"y0":5215,"x1":973,"y1":5236,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":850,"y0":5243,"x1":985,"y1":5261,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":849,"y0":5275,"x1":982,"y1":5298,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":1089,"y0":5115,"x1":1165,"y1":5135,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":1087,"y0":5139,"x1":1154,"y1":5158,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":1091,"y0":5168,"x1":1145,"y1":5185,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":1088,"y0":5190,"x1":1141,"y1":5211,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":1089,"y0":5216,"x1":1226,"y1":5236,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":1089,"y0":5240,"x1":1205,"y1":5260,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":1090,"y0":5277,"x1":1171,"y1":5297,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":1,"y0":5319,"x1":1437,"y1":5332,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":1,"y0":5045,"x1":1439,"y1":5394,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":120,"y0":1869,"x1":486,"y1":2051,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":121,"y0":2111,"x1":512,"y1":2294,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":522,"y0":1631,"x1":860,"y1":1784,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":122,"y0":1631,"x1":512,"y1":1783,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":124,"y0":1389,"x1":514,"y1":1542,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":526,"y0":1389,"x1":902,"y1":1540,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":926,"y0":1387,"x1":1304,"y1":1561,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":921,"y0":1145,"x1":1307,"y1":1320,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":521,"y0":1147,"x1":883,"y1":1319,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":118,"y0":1146,"x1":509,"y1":1322,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null},{"x0":169,"y0":2838,"x1":1211,"y1":3032,"color":"rgba(0,0,0,1.0)","type":"rect","isSelected":false,"label":null}]

// list of shapes
//var list_shapes           = [];

// list of brush point
var list_brush            = {x:[],y:[],d:[],c:[]};
// editing status
var editing_status        = null;
// selected shape
var selected_shape        = null;
// selected rect for grabcut
var selected_rectangle    = null;
// number selected shap from list_shapes
var num_selected_shape    = null;
// currently selected shape
var current_shape         = "rect";
// shape colors
var current_color         = "0,0,0";
// shape colors
var current_color_opacity = "1.0";
// point color
var current_fillstyle     = "rgba(0, 0, 0, 0.2)";
// selectors
var is_draw_shape         = false;
var is_draw_brush         = false;
var is_transform_shape    = false;
var is_select_shape       = false;
var is_draw_num_label     = true;
var is_visible_shape      = true;

// coordinates
var startX        = null;
var startY        = null;
var currentX      = null;
var currentY      = null;
var dX0           = null;
var dY0           = null;
var dX1           = null;
var dY1           = null;

var new_shape     = null;
var currentXY     = null;
var dsc           = null;
var clickedArea   = {shape: -1, pos:"o"};
var perimeter     = [];
var deltaXYPoly   = [];

//
// ------------- Clear handlers -------------
//
function clearBrush() {
    if (list_brush.x.length > 0) {
        var result = confirm("Want to delete?");
        if (result) {
            clearCanvas(brush_ctx);
            list_brush = {x:[],y:[],d:[],c:[]};
        }
    }
}
function clearCanvas(shape) {
    shape.clearRect(0, 0, canvas_width, canvas_height);
}
function clearCanvasContent() {
    if (is_select_shape) {
        deleteShape();
    } else {
        if (list_shapes.length > 0) {
            var result = confirm("Want to delete?");
            if (result) {
                clearCanvas(shape_ctx);
                list_shapes = [];
                perimeter   = [];
            }
        }
    }
}
function deleteShape() {
  var result = confirm("Want to delete?");
  if (result) {
    list_shapes.splice(num_selected_shape,1);
    selected_shape            = null;
    num_selected_shape        = null;
    is_transform_shape        = false;
    is_select_shape           = false;
    shape_canvas.style.cursor = "crosshair";
    removeSelection();
    clearCanvas(shape_ctx);
    reDrawShape();
    drawBrush();
  }
}

//
// ------------- Colors handler -------------
//
function getColor() {
    return "rgba(" + current_color + "," + current_color_opacity + ")";
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
  var num           = n + 1;
  var label_num     = num.toString();
  var char_width    = shape_ctx.measureText("M").width;
  var char_height   = 1.8 * char_width;
  var bg_rect_width = shape_ctx.measureText(label_num).width + char_width;
  shape_ctx.beginPath();
  shape_ctx.fillStyle = "black";
  shape_ctx.fillRect(Math.floor(x),
                      Math.floor(y - 1.1 * char_height),
                      Math.floor(bg_rect_width),
                      Math.floor(char_height));
  shape_ctx.font      = "Arial";
  shape_ctx.fillStyle = "white";
  shape_ctx.fillText(label_num, Math.floor(x + 0.4 * char_width), Math.floor(y - 0.35 * char_height));
}
function labelSwitch() {
  if(is_draw_num_label) {
    is_draw_num_label = false;
  } else {
    is_draw_num_label = true;
  }
  clearCanvas(shape_ctx);
  reDrawShape();
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
  shape_ctx.fillStyle   = getColor();
  shape_ctx.strokeStyle = getColor();
    shape_ctx.fillRect(x - 2, y - 2, 4, 4);
    shape_ctx.moveTo(x,y);
}

//
// ------------- Get smallest area shape handler -------------
//
function getMinSquare(shapes, num) {
  var smallest_figure = null;
  var min_square      = null;
  var square          = null;
  for (var i = 0; i < shapes.length; i++) {
    if(shapes[i].type == 'rect') {
        square = (shapes[i].x1 - shapes[i].x0) * (shapes[i].y1 - shapes[i].y0)
    }
    if(shapes[i].type == 'polygon') {
        var sc = shapes[i].coordinates;
        var area = 0;  // Accumulates area in the loop
        k = sc.length - 1;  // The last vertex is the 'previous' one to the first
        for (l = 0; l < sc.length; l++) {
            area += ((sc[k]['x'] + sc[l]['x']) * (sc[k]['y'] - sc[l]['y']));
            k = l;  //j is previous vertex to i
        }
        square = Math.abs(area/2);
    }
    if(shapes[i].type == 'point') {
        var x0 = shapes[i].x0 - 4; var x1 = shapes[i].x0 - 4 + 8;
        var y0 = shapes[i].y0 - 4; var y1 = shapes[i].y0 - 4 + 8;
        square = (x1 - x0) * (y1 - y0)
    }
    if(shapes[i].type == 'circle') {
        square = Math.PI * Math.pow(shapes[i].r, 2);
    }
    if(shapes[i].type == 'ellipse') {
        square = Math.PI * shapes[i].x1 * shapes[i].y1;
    }
    if (min_square == null) {
      min_square = square;
      smallest_figure = num[i]
    } else {
      if (square < min_square) {
        min_square = square
        smallest_figure = num[i]
      }
    }
  }
  return smallest_figure;
}

//
// ------------- Drawing handler -------------
//
 // check shape and line intersects
function inPolygon(x, y, xp, yp) {
  var npol = xp.length;
  var j = npol - 1;
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
function inCircle(sx, sy, sr, cx, cy) {
  var dsc = distanceFromCenter(sx, cx, sy, cy);
  if (dsc <= sr) {
    return true;
  }
  return false;
}
function inEllipse(sx, sy, sa, sb, cx, cy) {
  var ext_area = ((Math.pow((sx - cx), 2) / Math.pow(sa, 2)) + (Math.pow((sy - cy), 2) / Math.pow(sb, 2)))
  var int_area = ((Math.pow((sx - cx), 2) / Math.pow(sa - 5, 2)) + (Math.pow((sy - cy), 2) / Math.pow(sb - 5, 2)))
  if (ext_area < 1) {
    return true;
  }
  return false;
}
function lineIntersects(p0, p1, p2, p3) {
    var s1_x; var s1_y; var s2_x; var s2_y;
    s1_x = p1.x - p0.x;
    s1_y = p1.y - p0.y;
    s2_x = p3.x - p2.x;
    s2_y = p3.y - p2.y;

    var s; var t;
    s = (-s1_y * (p0.x - p2.x) + s1_x * (p0.y - p2.y)) / (-s2_x * s1_y + s1_x * s2_y);
    t = ( s2_x * (p0.y - p2.y) - s2_y * (p0.x - p2.x)) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1)
    {
        // Collision detected
        return true;
    }
    return false; // No collision
}
function checkLineIntersect(x, y) {
    if (perimeter.length < 3) {
        return false;
    }
    var p0 = [];
    var p1 = [];
    var p2 = [];
    var p3 = [];

    p2.x = perimeter[perimeter.length-1].x;
    p2.y = perimeter[perimeter.length-1].y;
    p3.x = x;
    p3.y = y;

    for (var i = 0; i < perimeter.length - 1; i++) {
        p0.x = perimeter[i].x;
        p0.y = perimeter[i].y;
        p1.x = perimeter[i+1].x;
        p1.y = perimeter[i+1].y;
        if (p1.x == p2.x && p1.y == p2.y) { continue; }
        if (p0.x == p3.x && p0.y == p3.y) { continue; }
        if (lineIntersects(p0,p1,p2,p3)==true) {
            return true;
        }
    }
    return false;
}
function shapeIntersect(x, y, shape) {
  var xp = []
  var yp = []
  if(shape.type == 'rect') {
    xp = [shape.x0, shape.x1, shape.x1, shape.x0]
    yp = [shape.y0, shape.y0, shape.y1, shape.y1]
    if (inPolygon(x, y, xp, yp)) {
      return shape;
    }
  }
  if(shape.type == 'polygon') {
    for (var i = 0; i < shape.coordinates.length; i++) {
      xp.push(shape.coordinates[i]['x']);
      yp.push(shape.coordinates[i]['y']);
    }
    if (inPolygon(x, y, xp, yp)) {
      return shape;
    }
  }
  if(shape.type == 'point') {
    var x0 = shape.x0 - 4; var x1 = shape.x0 - 4 + 8;
    var y0 = shape.y0 - 4; var y1 = shape.y0 - 4 + 8;
    xp = [x0, x1, x1, x0]
    yp = [y0, y0, y1, y1]
    if (inPolygon(x, y, xp, yp)) {
      return shape;
    }
  }
  if(shape.type == 'circle') {
    if (inCircle(shape.x0, shape.y0, shape.r, x, y)) {
      return shape;
    }
  }
  if(shape.type == 'ellipse') {
    if (inEllipse(shape.x0, shape.y0, shape.x1, shape.y1, x, y)) {
      return shape;
    }
  }
  return null
}
function checkInnerShapes(a, b) {
  return a.x0 <= b.x0 && a.x1 >= b.x1 && a.y0 <= b.y0 && a.y1 >= b.y1;
}

// draw perimeter for polygon
function drawPerimeter() {
    shape_ctx.beginPath();
    for(var i = 0; i < perimeter.length; i++) {
        if (i == 0) {
            shape_ctx.moveTo(perimeter[i].x,perimeter[i].y);
            polygonPoint(perimeter[i].x,perimeter[i].y);
        } else {
            shape_ctx.lineTo(perimeter[i].x,perimeter[i].y);
            polygonPoint(perimeter[i].x,perimeter[i].y);
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
    if (perimeter.length > 0 && x == perimeter[perimeter.length-1].x && y == perimeter[perimeter.length-1].y) {
        // same point - double click
        return false;
    }
    if (checkLineIntersect(x, y)) {
        alert("The line you are drawing intersect another line");
        return false;
    }
    perimeter.push({"x": x, "y": y });
    drawPerimeter();
}

// shape classes
function Rectangle(x0, y0, x1, y1, color) {
    this.x0         = x0;
    this.y0         = y0;
    this.x1         = x1;
    this.y1         = y1;
    this.color      = color;
    this.type       = LIST_SHAPES.RECT;
    this.isSelected = false;
    this.label      = null;
}
function Circle(x0, y0, x1, y1, color) {
    this.x0         = x0;
    this.y0         = y0;
    this.r          = parseInt(Math.sqrt(x1 * x1 + y1 * y1));
    this.color      = color;
    this.type       = LIST_SHAPES.CIRCLE;
    this.isSelected = false;
    this.label      = null;
}
function Ellipse(x0, y0, x1, y1, color) {
    this.x0         = x0;
    this.y0         = y0;
    this.x1         = x1;
    this.y1         = y1;
    this.color      = color;
    this.type       = LIST_SHAPES.ELLIPSE;
    this.isSelected = false;
    this.label      = null;
}
function Polygon(coordinates, color) {
    this.coordinates  = coordinates;
    this.type         = "polygon";
    this.color        = color;
    this.type         = LIST_SHAPES.POLYGON;
    this.isSelected   = false;
    this.label        = null;
}
function Point(x0, y0, color) {
    this.x0    = x0;
    this.y0    = y0;
    this.type  = "point";
    this.color = color;
    this.type       = LIST_SHAPES.POINT;
    this.isSelected = false;
    this.label      = null;
}

// drawing shapes
function drawRect(shape, n) {
    var x0 = shape.x0; var x1 = shape.x1;
    var y0 = shape.y0; var y1 = shape.y1;
    if (is_draw_num_label && n != undefined) {
      drawLabel(n, Math.max(x0, x1), Math.min(y0, y1));
    }
    shape_ctx.beginPath();
    shape_ctx.moveTo(x0, y0)
    shape_ctx.lineTo(x0, y1)
    shape_ctx.lineTo(x1, y1)
    shape_ctx.lineTo(x1, y0)
    shape_ctx.closePath();
    if (shape.isSelected) {
      shape_ctx.lineWidth = 3;
      shape_ctx.strokeStyle = "rgb(0,0,0)";
      point_color = "rgb(255,0,0)";
      shape_ctx.fillStyle   = current_fillstyle;
      shape_ctx.fill();
    }
    else {
      shape_ctx.lineWidth = LINE_WIDTH;
      shape_ctx.strokeStyle = shape.color;
      point_color = shape.color;
    }
    shape_ctx.stroke();
    drawControlPoint(point_color, x0, y0);
    drawControlPoint(point_color, x0, y1);
    drawControlPoint(point_color, x1, y1);
    drawControlPoint(point_color, x1, y0);
    drawControlPoint(point_color, x0, y0 + ((y1 - y0) / 2));
    drawControlPoint(point_color, x1, y0 + ((y1 - y0) / 2));
    drawControlPoint(point_color, x0 + ((x1 - x0) / 2), y0);
    drawControlPoint(point_color, x0 + ((x1 - x0) / 2), y1);
    //drawControlPoint(point_color, x0 + ((x1 - x0) / 2), y0 + ((y1 - y0) / 2));
}
function drawCircle(shape, n) {
    var x = shape.x0; var y = shape.y0; var r = shape.r;
    if (is_draw_num_label && n != undefined) {
      drawLabel(n, x, y - r);
    }
    shape_ctx.beginPath();
    shape_ctx.arc(x, y, r, 0, Math.PI*2);
    shape_ctx.closePath();
    if (shape.isSelected) {
      shape_ctx.lineWidth = 3;
      shape_ctx.strokeStyle = "rgb(0,0,0)";
      point_color = "rgb(255,0,0)";
      shape_ctx.fillStyle   = current_fillstyle;
      shape_ctx.fill();
    }
    else {
      shape_ctx.lineWidth = LINE_WIDTH;
      shape_ctx.strokeStyle = shape.color;
      point_color = shape.color;
    }
    shape_ctx.stroke();
    //drawControlPoint(point_color, x, y);
    drawControlPoint(point_color, x + r, y);
    drawControlPoint(point_color, x - r, y);
    drawControlPoint(point_color, x, y + r);
    drawControlPoint(point_color, x, y - r);
}
function drawEllipse(shape, n) {
    var x0 = shape.x0; var x1 = shape.x1;
    var y0 = shape.y0; var y1 = shape.y1;
    if (is_draw_num_label && n != undefined) {
      drawLabel(n, x0, y0 - y1);
    }
    shape_ctx.beginPath();
    shape_ctx.save();
    shape_ctx.translate(x0 - x1, y0 - y1);
    shape_ctx.scale(x1, y1);
    shape_ctx.arc(1, 1, 1, 0, 2 * Math.PI, false);
    shape_ctx.restore(); // restore to original state
    shape_ctx.closePath();
    if (shape.isSelected) {
      shape_ctx.lineWidth = 3;
      shape_ctx.strokeStyle = "rgb(0,0,0)";
      point_color = "rgb(255,0,0)";
      shape_ctx.fillStyle   = current_fillstyle;
      shape_ctx.fill();
    }
    else {
      shape_ctx.lineWidth = LINE_WIDTH;
      shape_ctx.strokeStyle = shape.color;
      point_color = shape.color;
    }
    shape_ctx.stroke();
    //------------------ contol points ------------------
    //drawControlPoint(point_color, x0, y0); // center
    drawControlPoint(point_color, x0 + x1, y0);
    drawControlPoint(point_color, x0, y0 - y1);
    drawControlPoint(point_color, x0 - x1, y0);
    drawControlPoint(point_color, x0, y0 + y1);
}
function drawPoint(shape, n) {
  if (is_draw_num_label && n != undefined) {
    drawLabel(n, shape.x0, shape.y0);
  }
  var hp = wp = 8;
  if (shape.isSelected) {
    shape_ctx.fillStyle = "rgb(255,0,0)";
    shape_ctx.strokeStyle = "rgb(255,0,0)";
  }
  else {
    shape_ctx.fillStyle = shape.color;
    shape_ctx.strokeStyle = shape.color;
  }
  shape_ctx.fillRect(shape.x0 - wp / 2, shape.y0 - hp / 2, wp, hp);
  shape_ctx.moveTo(shape.x0, shape.y0);
}
function drawPolygon(shape, n) {
  var sc = shape.coordinates;
  if (is_draw_num_label && n != undefined) {
    drawLabel(n, sc[0].x, sc[0].y);
  }
  shape_ctx.beginPath();
  for (var i = 0; i < sc.length; i++) {
    i == 0 ? shape_ctx.moveTo(sc[0].x,sc[0].y) : shape_ctx.lineTo(sc[i].x,sc[i].y);
  }
  shape_ctx.closePath();
  if (shape.isSelected) {
    shape_ctx.lineWidth = 3;
    shape_ctx.strokeStyle = "rgb(0,0,0)";
    point_color = "rgb(255,0,0)";
    shape_ctx.fillStyle = current_fillstyle;
    shape_ctx.fill();
  }
  else {
    shape_ctx.lineWidth = LINE_WIDTH;
    shape_ctx.strokeStyle = shape.color;
    point_color = shape.color;
  }
  shape_ctx.lineCap   = "square";
  shape_ctx.stroke();
  for (var i = 0; i < sc.length; i++) {
    drawControlPoint(point_color, sc[i].x, sc[i].y);
  }
}

function distanceFromCenter(x, x1, y, y1) {
  return (Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2)));
}

function removeSelection() {
  list_shapes.forEach(function(shape) { shape.isSelected = false; });
  selected_rectangle = null;
}
function transformShape() {
    var tr_shape   = list_shapes[clickedArea.shape];
    var shape_type = tr_shape.type;
    if (shape_type == "rect") {
      if (clickedArea.pos == "rect_top_left_resize" ||
          clickedArea.pos == "rect_left_resize"  ||
          clickedArea.pos == "rect_bottom_left_resize") {
        tr_shape.x0 = currentX;
      }
      if (clickedArea.pos == "rect_top_left_resize" ||
          clickedArea.pos == "rect_top_resize"  ||
          clickedArea.pos == "rect_top_right_resize") {
        tr_shape.y0 = currentY;
      }
      if (clickedArea.pos == "rect_top_right_resize" ||
          clickedArea.pos == "rect_right_resize"  ||
          clickedArea.pos == "rect_bottom_right_resize") {
        tr_shape.x1 = currentX;
      }
      if (clickedArea.pos == "rect_bottom_left_resize" ||
          clickedArea.pos == "rect_bottom_resize"  ||
          clickedArea.pos == "rect_bottom_right_resize") {
        tr_shape.y1 = currentY;
      }
      if (clickedArea.pos == "drag") {
        tr_shape.x0 = currentX - dX0;
        tr_shape.y0 = currentY - dY0;
        tr_shape.x1 = currentX - dX1;
        tr_shape.y1 = currentY - dY1;
      }
    }
    if (shape_type == "circle") {
      if (clickedArea.pos == "circle_resize") {
        tr_shape.r = Math.sqrt(Math.pow(tr_shape.x0 - currentX, 2) + Math.pow(tr_shape.y0 - currentY, 2))
      }
      if (clickedArea.pos == "drag") {
        tr_shape.x0 = currentX - dX0;
        tr_shape.y0 = currentY - dY0;
      }
    }
    if (shape_type == "ellipse") {
      if (clickedArea.pos == "ellipse_top_bottom_resize") {
          tr_shape.x1 = Math.abs(currentX - tr_shape.x0 + 2);
      }
      if (clickedArea.pos == "ellipse_left_right_resize") {
          tr_shape.y1 = Math.abs(currentY - tr_shape.y0 + 2);
      }
      if (clickedArea.pos == "drag") {
          tr_shape.x0 = currentX - dX0;
          tr_shape.y0 = currentY - dY0;
      }
    }
    if (shape_type == "point") {
        if (clickedArea.pos == "drag") {
            tr_shape.x0 = currentX;
            tr_shape.y0 = currentY;
        }
    }
    if (shape_type == "polygon") {
        if (clickedArea.pos == "polygon_resize") {
            tr_shape.coordinates[clickedArea.point].x = currentX;
            tr_shape.coordinates[clickedArea.point].y = currentY;
        }
        if (clickedArea.pos == "drag") {
            for (var i = 0; i < tr_shape.coordinates.length; i++) {
                tr_shape.coordinates[i].x = currentX - deltaXYPoly[i].dx;
                tr_shape.coordinates[i].y = currentY - deltaXYPoly[i].dy;
            }
        }
    }
}
function findCurrentArea(x, y) {
    var listShapesIntersect = []
    var numbersShapesIntersect = []
    for (var i = 0; i < list_shapes.length; i++) {
        var shape_intersect = shapeIntersect(x, y, list_shapes[i]);
        if (shape_intersect != null) {
          listShapesIntersect.push(shape_intersect)
          numbersShapesIntersect.push(i)
        }
    }
    var small_shape_num = getMinSquare(listShapesIntersect, numbersShapesIntersect)
    if(small_shape_num != null) {
      //for (var i = 0; i < list_shapes.length; i++) {
      var shape = list_shapes[small_shape_num];
          //console.log(shape);
      if (shape.type == "rect") {
          var x0 = shape.x0; var x1 = shape.x1;
          var y0 = shape.y0; var y1 = shape.y1;
          var xCenter = x0 + (x1 - x0) / 2;
          var yCenter = y0 + (y1 - y0) / 2;
          dX0 = x - shape.x0;
          dY0 = y - shape.y0;
          dX1 = x - shape.x1;
          dY1 = y - shape.y1;
          if (x < x0 + LINE_OFFSET && x > x0 - LINE_OFFSET) {
              if (y < y0 + LINE_OFFSET && y > y0 - LINE_OFFSET) {
                return {shape: small_shape_num, pos:"rect_top_left_resize"};
              } else if (y < y1 + LINE_OFFSET && y > y1 - LINE_OFFSET) {
                return {shape: small_shape_num, pos:"rect_bottom_left_resize"};
              } else if (y < yCenter + LINE_OFFSET && y > yCenter - LINE_OFFSET) {
                return {shape: small_shape_num, pos:"rect_left_resize"};
              }
          } else if (x < x1 + LINE_OFFSET && x > x1 - LINE_OFFSET) {
              if (y < y0 + LINE_OFFSET && y > y0 - LINE_OFFSET) {
                return {shape: small_shape_num, pos:"rect_top_right_resize"};
              } else if (y < y1 + LINE_OFFSET && y > y1 - LINE_OFFSET) {
                return {shape: small_shape_num, pos:"rect_bottom_right_resize"};
              } else if (y < yCenter + LINE_OFFSET && y > yCenter - LINE_OFFSET) {
                return {shape: small_shape_num, pos:"rect_right_resize"};
              }
          } else if (x < xCenter + LINE_OFFSET && x > xCenter - LINE_OFFSET) {
              if (y < y0 + LINE_OFFSET && y > y0 - LINE_OFFSET) {
                return {shape: small_shape_num, pos:"rect_top_resize"};
              } else if (y < y1 + LINE_OFFSET && y > y1 - LINE_OFFSET) {
                return {shape: small_shape_num, pos:"rect_bottom_resize"};
              } else if (y < y1 + LINE_OFFSET && y > y0 - LINE_OFFSET) {
                return {shape: small_shape_num, pos:"drag"};
              }

          } else if (x < x1 + LINE_OFFSET && x > x0 - LINE_OFFSET) {
              if (y < y1 + LINE_OFFSET && y > y0 - LINE_OFFSET) {
                return {shape: small_shape_num, pos:"drag"};
              }
          }
      }
      if (shape.type == "circle") {
          dsc = parseInt(distanceFromCenter(shape.x0, x, shape.y0, y));
          dX0 = x - shape.x0;
          dY0 = y - shape.y0;
          if (dsc < shape.r - LINE_OFFSET) {
              return {shape: small_shape_num, pos:"drag"};
          }
          if (dsc > shape.r - LINE_OFFSET && dsc < shape.r) {
              return {shape: small_shape_num, pos:"circle_resize"};
          }
      }
      if (shape.type == "ellipse") {
          console.log(shape);
          var ext_area = ((Math.pow((shape.x0 - x), 2) / Math.pow(shape.x1, 2)) +
                          (Math.pow((shape.y0 - y), 2) / Math.pow(shape.y1, 2)));
          var int_area = ((Math.pow((shape.x0 - x), 2) / Math.pow(shape.x1 - LINE_OFFSET, 2)) +
                          (Math.pow((shape.y0 - y), 2) / Math.pow(shape.y1 - LINE_OFFSET, 2)));
          dX0 = x - shape.x0;
          dY0 = y - shape.y0;
          if (int_area < 1) {
              return {shape: small_shape_num, pos:"drag"};
          }
          if (int_area > 1 && ext_area < 1) {
              var inX0 = parseInt(distanceFromCenter((shape.x0 + shape.x1), x, shape.y0, y));
              var inY0 = parseInt(distanceFromCenter(shape.x0, x, (shape.y0 + shape.y1), y));
              var inX1 = parseInt(distanceFromCenter((shape.x0 - shape.x1), x, shape.y0, y));
              var inY1 = parseInt(distanceFromCenter(shape.x0, x, (shape.y0 - shape.y1), y));
              //console.log(inX0, inY0, inX1, inY1);
              if ((inX0 <= LINE_OFFSET) || (inX1 <= LINE_OFFSET) && (currentXY == null)) {
                  return {shape: small_shape_num, pos:"ellipse_top_bottom_resize"};
              }
              if ((inY0 <= LINE_OFFSET) || (inY1 <= LINE_OFFSET) && (currentXY == null)) {
                  return {shape: small_shape_num, pos:"ellipse_left_right_resize"};
              }
          }
      }
      if (shape.type == "point") {
          var x0 = shape.x0 - 4; var x1 = shape.x0 - 4 + 8;
          var y0 = shape.y0 - 4; var y1 = shape.y0 - 4 + 8;
          if (x > x0 && x < x1 && y > y0 && y < y1) {
                return {shape: small_shape_num, pos:"drag"};
          }
      }
      if (shape.type == "polygon") {
        var sc      = shape.coordinates;
        var xp      = [];
        var yp      = [];
        deltaXYPoly = [];
        for (var j = 0; j < sc.length; j++) {
          xp.push(sc[j].x);
          yp.push(sc[j].y);
          deltaXYPoly.push({dx: x - sc[j].x, dy: y - sc[j].y});
        }
        var l = xp.length - 1;
        var c = 0;
        for (var m = 0; m < xp.length; m++){
            if ((((yp[m]<=y) && (y<yp[l])) || ((yp[l]<=y) && (y<yp[m]))) &&
            (x > (xp[l] - xp[m]) * (y - yp[m]) / (yp[l] - yp[m]) + xp[m])) {
                c = !c
            }
            l = m;
        }
        if (c) {
            for (var k = 0; k < sc.length; k++) {
              if (distanceFromCenter(sc[k].x, x, sc[k].y, y) < (LINE_OFFSET * 2)) {
                return {shape: small_shape_num, pos:"polygon_resize", point: k};
              }
            }
            return {shape: small_shape_num, pos:"drag"};
        }
      }
      //}
    }
    return {shape: -1, pos:"o"};
}

function collapseShapes() {
    if(selected_shape != null && selected_shape.type == 'rect') {
        console.log(typeof selected_shape);
        //var listInnerShapes = []
        var numbersInnerShapes = []
        var numberRemovedShapes = 0
        for (var i = 0; i < list_shapes.length; i++) {
            if (list_shapes[i].type = 'rect') {
                var shape_intersect = checkInnerShapes(selected_shape, list_shapes[i]);
                console.log(shape_intersect);
                if (shape_intersect && list_shapes[i] != selected_shape) {
                  numbersInnerShapes.push(i)
                  numberRemovedShapes += 1
                }
            }
        }
        console.log(numbersInnerShapes);
        numbersInnerShapes.sort()
        for (var j = numberRemovedShapes - 1; j >= 0; j--) {
          list_shapes.splice(numbersInnerShapes[j],1);
        }
        if (numberRemovedShapes > 0) {
            removeSelection();
            clearCanvas(shape_ctx);
            reDrawShape();
            showMessage('Removed ' + numberRemovedShapes  + ' shapes.');
        }
    } else {
      alert('Select a shape to perform the merge!')
    }
}
function drawShape(event) {
    if (event.type == "mousedown") {
        if (current_shape == "point") {
            new_shape = new Point(startX, startY, getColor());
            drawPoint(new_shape);
        }
        if (current_shape == "polygon") {
          if (event.which == "1") {
            createNewPerimeter();
            shape_canvas.oncontextmenu = function (event) { event.preventDefault(); };
          }
          if (event.which == "3" || event.button == "2") {
            if (perimeter.length <= 2) {
                alert("You need at least three points for a polygon");
                shape_canvas.oncontextmenu = function (event) { event.preventDefault(); };
                return false;
            }
            if (checkLineIntersect(perimeter[0].x, perimeter[0].y)) {
                alert("The line you are drowing intersect another line");
                shape_canvas.oncontextmenu = function (event) { event.preventDefault(); };
                return false;
            }
            new_shape = new Polygon(perimeter, getColor());
            drawPolygon(new_shape);
            perimeter = [];
          }
          shape_canvas.oncontextmenu = function (event) { event.preventDefault(); };
        }
    }
    if (current_shape != "polygon" && current_shape != "point") {
        if (event.type == "mousemove") {
            if (current_shape == "rect") {
              var rX0 = Math.min(startX, currentX);
              var rY0 = Math.min(startY, currentY);
              var rX1 = Math.max(startX, currentX);
              var rY1 = Math.max(startY, currentY);
              if (rX1 - rX0 > LINE_OFFSET && rY1 - rY0 > LINE_OFFSET) {
                new_shape = new Rectangle(rX0, rY0, rX1, rY1, getColor());
                drawRect(new_shape);
              }
            }
            if (current_shape == "circle") {
              if (parseInt(Math.sqrt(deltaX * deltaX + deltaY * deltaY)) > LINE_OFFSET) {
                new_shape = new Circle(startX, startY, deltaX, deltaY, getColor());
                drawCircle(new_shape);
              }
            }
            if (current_shape == "ellipse") {
              new_shape = new Ellipse(startX, startY, deltaX, deltaY, getColor());
              drawEllipse(new_shape);
            }
        }
    }
}
function reDrawShape() {
  if(is_visible_shape) {
    if (list_shapes.length != 0) {
        for (var i = 0; i < list_shapes.length; i++) {
            switch (list_shapes[i].type) {
              case "rect":
                if (list_shapes[i].x1 - list_shapes[i].x0 > LINE_OFFSET &&
                    list_shapes[i].y1 - list_shapes[i].y0 > LINE_OFFSET) {
                  drawRect(list_shapes[i], i);
                }
                break;
              case "circle":
                  if (list_shapes[i].r > LINE_OFFSET) {
                    drawCircle(list_shapes[i], i);
                  }
                break;
              case "ellipse":
                drawEllipse(list_shapes[i], i);
                break;
              case "polygon":
                drawPolygon(list_shapes[i], i);
                break;
              case "point":
                drawPoint(list_shapes[i], i);
                break;
            }
        }
    }
    if (perimeter.length > 0) {
      drawPerimeter();
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
  if (is_visible_shape) {
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
      brush_ctx.lineJoin = brush_ctx.lineCap = "round";
      brush_ctx.strokeStyle = color[i];
      brush_ctx.stroke();
    }
  }
}

//
// ------------- Mouse event handler -------------
//
shape_canvas.addEventListener("mousedown", function(event) {
  startX  = parseInt(event.offsetX);
  startY  = parseInt(event.offsetY);
  if(is_visible_shape) {
    switch (editing_status) {
      case "shape":
        is_draw_shape = true;
        if (is_draw_shape) {
            drawShape(event);
        }
        break;
      case "brush":
        is_draw_brush = true;
        if (is_draw_brush) {
          createNewBrushPoint(startX, startY);
          drawBrush();
        }
        break;
      default:
          clickedArea = findCurrentArea(startX, startY);
          if (clickedArea.shape != -1) {
            if (selected_shape != null) {
              selected_shape.isSelected = false;
            }
            if (list_shapes[clickedArea.shape].type == 'rect') {
              selected_rectangle = list_shapes[clickedArea.shape];
            }
            selected_shape                            = list_shapes[clickedArea.shape];
            selected_shape.isSelected                 = false;
            num_selected_shape                        = clickedArea.shape;
            list_shapes[clickedArea.shape].isSelected = true;
            is_select_shape                           = true;
            is_transform_shape                        = true;
          } else {
            selected_shape     = null;
            num_selected_shape = null;
            is_select_shape    = false;
            is_transform_shape = false;
            removeSelection();
          }
    }
  }
  console.log(selected_shape);
}, false);
shape_canvas.addEventListener("mouseup", function(event) {
  if (new_shape != null) {
    list_shapes.push(new_shape)
  }
  is_draw_shape      = false;
  is_draw_brush      = false;
  is_transform_shape = false;
  new_shape          = null;
  deltaXYPoly        = [];
  var set_select_label = selected_shape != null ? selected_shape.label : null;
  setSelectActiveLabel(set_select_label);
  clearCanvas(shape_ctx);
  reDrawShape();
}, false);
shape_canvas.addEventListener("mouseout", function(event) {
  if (new_shape != null) {
    list_shapes.push(new_shape)
  }
  is_draw_shape      = false;
  is_draw_brush      = false;
  is_transform_shape = false;
  new_shape          = null;
  deltaXYPoly        = [];
  clearCanvas(shape_ctx);
  reDrawShape();
}, false);
shape_canvas.addEventListener("mousemove", function(event) {
  currentX = parseInt(event.offsetX);
  currentY = parseInt(event.offsetY);
  deltaX   = parseInt(Math.abs(startX - currentX));
  deltaY   = parseInt(Math.abs(startY - currentY));
  if(is_visible_shape) {
    switch (editing_status) {
      case "shape":
        if (is_draw_shape) {
            clearCanvas(shape_ctx);
            drawShape(event);
            reDrawShape();
        }
        break;
      case "brush":
        if (is_draw_brush) {
            createNewBrushPoint(currentX, currentY, true);
            drawBrush();
        }
        break;
      default:
        if (is_transform_shape && clickedArea.shape != -1) {
          transformShape();
          clearCanvas(shape_ctx);
          reDrawShape();
        }
    }
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
        //console.log("BACKSPACE was pressed");
        // Call event.preventDefault() to stop the character before the cursor
        // from being deleted. Remove this line if you don"t want to do that.
        event.preventDefault();
    }
    if (event.keyCode == 46) {
        //console.log("DELETE was pressed");
        if (is_select_shape) {
          deleteShape();
        }
        // Call event.preventDefault() to stop the character after the cursor
        // from being deleted. Remove this line if you don"t want to do that.
        event.preventDefault();
    }
    if ("key" in evt) {
        isEscape = (evt.key === "Escape" || evt.key === "Esc");
    } else {
        isEscape = (evt.keyCode === 27);
    }
    if (isEscape) {
        console.log(is_select_shape);
        if (is_select_shape) {
          selected_shape = null;
          is_transform_shape  = false;
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
        console.log("Backspace");
    }
};
/*var btns = document.getElementsByClassName("btn");
for (var i = 0; i < btns.length; i++) {
    var current = document.getElementsByClassName("active");
    current_shape = current[0].id;
    btns[i].addEventListener("click", function() {
      current[0].className = current[0].className.replace(" active", "");
      this.className += " active";
      current_shape = this.id;
    });
}*/

//
// ------------- Visibility shapes switcher  -------------
//
function visibilitySwitch() {
  if(is_visible_shape) {
    is_visible_shape = false;
  } else {
    is_visible_shape = true;
  }
  removeSelection();
  clearCanvas(brush_ctx);
  drawBrush();
  clearCanvas(shape_ctx);
  reDrawShape();
}

//
// ------------- Admission to drawing on canvas -------------
//
function startDrawing(type) {
  var btn;
  shape_canvas.style.cursor = "crosshair"
  if (type == "brush")
    btn =  document.getElementById("startDrawingBrush");
  if (type == "shape")
    btn = document.getElementById("startDrawingShape");
  //if (type == "erase")
  //  btn = document.getElementById("startDrawingErase");
  var btns = document.getElementsByName("drawing");
  for (var i = 0; i < btns.length; i++) {
    var current = document.getElementsByClassName("active");
  }
  if (current.length == 0) {
    btn.className = "active";
    editing_status = type;
    is_visible_shape = true;
  } else {
    if (current[0] == btn) {
      btn.className = btn.className.replace("active", "");
      editing_status = null;
    } else {
      current[0].className = current[0].className.replace("active", "");
      btn.className = "active";
      editing_status = type;
      is_visible_shape = true;
    }
  }
  if (is_select_shape) {
    selected_shape     = null;
    is_transform_shape = false;
    is_select_shape    = false;
  }
  removeSelection();
  clearCanvas(brush_ctx);
  drawBrush();
  clearCanvas(shape_ctx);
  reDrawShape();
}

//
// ------------- Handlers for load image -------------
//
function set_canvas_style() {
  image_canvas.style.border  = "1px solid white";
  shape_canvas.style.cursor = "crosshair";
  shape_canvas.style.border = "1px dashed black";
}
function set_canvas_size(h, w) {
  canvas_panel.style.height = (h + 20) + "px";
  canvas_panel.style.width  = (w + 20) + "px";
  image_canvas.height       = h;
  image_canvas.width        = w;
  brush_canvas.height       = h;
  brush_canvas.width        = w;
  shape_canvas.height       = h;
  shape_canvas.width        = w;
}
function change_bw_colors() {
  /*var imageData = image_ctx.getImageData(0, 0, image_canvas.width, image_canvas.height);
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
  image_ctx.putImageData(imageData, 0, 0);*/
}
function load_image() {
  return new Promise(function(resolve, reject) {
    current_image             = new Image();
    current_image.onload      = function() {
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
    current_image.onerror     = function() {
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
      alert("First upload the image!");
      return;
    }
}
function zoom_out() {
    if (!current_image_loaded) {
      alert("First upload the image!");
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
      alert("First upload the image!");
      return;
    }
}
function zoom_real() {
    if (!current_image_loaded) {
      alert("First upload the image!");
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
  var active_shape = document.getElementById("active_shape");
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
  if (LIST_LABEL_SHAPE.length == 0) {
      var children = select.childNodes;
      while (select.lastChild.id !== 'defaultLabel') {
          select.removeChild(select.lastChild);
      }
  } else {
      for (var i = 0; i < LIST_LABEL_SHAPE.length; i++) {
        var option = document.createElement("option");
        option.innerHTML = LIST_LABEL_SHAPE[i];
        select.appendChild(option);
      }
  }
  setSelectActiveLabel(null)
}
select.addEventListener("change", function() {
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
  var sx = shape.x0;
  var sy = shape.y0;
  var sw = shape.x1 - shape.x0;
  var sh = shape.y1 - shape.y0;
  /*if (shape.w < 0) {
    sw = Math.abs(shape.w)
    sx -= sw;
  }
  if (shape.h < 0) {
    sh = Math.abs(shape.h)
    sy -= sh;
  }*/
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
  var btn_download = document.getElementById("downloadImage");
  var image = image_canvas.toDataURL("image/jpg");
  btn_download.download = "ia_image.jpg";
  btn_download.href = image;
  btn_download.click();
}

//
//
//
function downloadAnnotation(type) {
  var btn_download = document.getElementById("downloadImage");
  var image = image_canvas.toDataURL("image/jpg");
  btn_download.download = "ia_image.jpg";
  btn_download.href = image;
  btn_download.click();
}

//
// ------------- Save annotation handler -------------
//
function saveAnnotation() {
  var sa = JSON.stringify(list_shapes);
  console.log(sa);
  var restoredSession = JSON.parse(sa);
  console.log(restoredSession);
}

//
// ------------- Upload object labels handler -------------
//

function isTextEmpty(text) {
  for (var i = 0; i < text.length; i++) {
    if (text[i] != ' ' && text[i] != '\t' && text[i] != '\r' && text[i] != '\n') {
      return true;
    }
  }
  return false;
}

function importLabelsFromCsv(data) {
    if ( data === '' || typeof(data) === 'undefined') {
        return;
    }
    var line_split_regex = new RegExp('\n|\r|\r\n', 'g');
    var csvdata = data.split(line_split_regex);
    LIST_LABEL_SHAPE = [];
    setLabelList();
    for(var r = 0; r < csvdata.length; r++){
      if(isTextEmpty(csvdata[r])) {
        LIST_LABEL_SHAPE.push(csvdata[r])
      }
    }
    LIST_LABEL_SHAPE.sort();
    setLabelList();
}
function importAnnotationsFromJson(data) {
    if ( data === '' || typeof(data) === 'undefined') {
        return;
    }
    var d = JSON.parse(data);
    console.log(d);
}

function loadTextFile(text_file, callback_function) {
    if (text_file) {
        var text_reader = new FileReader();
        text_reader.addEventListener( 'progress', function(e) {
          showMessage('Loading data from text file : ' + text_file.name + ' ... ');
        }, false);

        text_reader.addEventListener( 'error', function() {
          showMessage('Error loading data from text file :  ' + text_file.name + ' !', 'unsuccess');
          callback_function('');
        }, false);

        text_reader.addEventListener( 'load', function() {
          callback_function(text_reader.result);
        }, false);
        text_reader.readAsText(text_file, 'utf-8');
    }
}

function importData(files, id) {
    var selected_files = files;
    for (var i = 0; i < selected_files.length; ++i ) {
        var file = selected_files[i];
        switch(file.type) {
          case '': // Fall-through // Windows 10: Firefox and Chrome do not report filetype
              showMessage('File type for ' + file.name + ' cannot be determined! Assuming text/plain.', 'unsuccess');
          case 'text/plain': // Fall-through
          case 'application/vnd.ms-excel': // Fall-through // @todo: filetype of VIA csv annotations in Windows 10 , fix this (reported by @Eli Walker)
          case 'text/csv':
              if (id == "importLabels") {
                  loadTextFile(file, importLabelsFromCsv);
              } else {
                  showMessage('Labels cannot be imported from file of type ' + file.type, 'unsuccess');
              }
              break;

          case 'text/json': // Fall-through
          case 'application/json':
              if (id == "importAnnotions") {
                  loadTextFile(file, importAnnotationsFromJson);
              } else {
                  showMessage('Annotations cannot be imported from file of type ' + file.type, 'unsuccess');
              }
              break;

          default:
              showMessage('Data cannot be imported from file of type ' + file.type, 'unsuccess');
              break;
        }
    }
}

//
// ------------- Sorting numbers handler -------------
//
function compareNumeric(a, b) {
  return a - b;
}
function sortListShapes(a, b) {
  var result = compareNumeric(a.y0, b.y0);
  //console.log('y => ' + result);
  if (result == 0) {
    result = compareNumeric(a.x0, b.x0);
    //console.log('x => ' + result);
  }
  return result;
}

//
// ------------- Show message handler -------------
//
function showMessage(msg, er = null) {
  var parent         = document.getElementById("navbar");
  var div            = document.createElement("div");
  var span           = document.createElement("span");
  div.id             = "message";
  switch (er) {
    case "success":
      div.style.backgroundColor = "#2eb82e";
      span.style.color          = "#fff";
      break;
    case "unsuccess":
      div.style.backgroundColor = "#ff5050";
      span.style.color          = "#fff";
      break;
    default:
      div.style.backgroundColor = "#fff";
      span.style.color          = "#000";
  }
  span.style.fontSize    = "14px";
  span.style.wordWrap    = "break-word";
  span.innerHTML         = msg;
  div.appendChild(span);
  parent.appendChild(div);
  setTimeout(function () {
    div.className = "fade";
  }, 1000);
  setTimeout(function () {
    var del = document.getElementById("message");
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
    msg = "Image uploaded successfully";
    er  = "success";
    showMessage(msg, er)
  })
  .then(function() {
    change_bw_colors();
  })
  .then(function() {
    list_shapes.sort(sortListShapes);
  })
  .then(function() {
    reDrawShape();
  })
  .catch(function(e)
  {
    msg = "Error: " + e;
    er  = "unsuccess";
    showMessage(msg, er)
  });
}

//----------------------------------------------------------
document.addEventListener("DOMContentLoaded", init());

window.onbeforeunload = function() {
  return "Вы точно хойтите уйти?";
};
