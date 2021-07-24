/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var level_w_local = 96;

function graphNode(x,y ) {
    return {'x': parseInt(x),'y': parseInt(y), 'sort': y * level_w_local + x};
}

function graphEdge(startx, starty, stopx, stopy, name="none") {
    return {'x1': startx, 'y1': starty, 
        'x2': stopx, 'y2':stopy, 
        'cost': Math.pow(startx - stopx,2) + Math.pow(starty - stopy, 2),
        'sort': starty * level_w_local + startx,
        'from': starty * level_w_local + startx,
        'to': stopy * level_w_local + stopx,
        'prev': 0,
        'dist': 0,
        'visited': 0,
        'name': name
    };
}

/*

function graphMove( edge ) {
    var startx = edge.x1;
    var starty = edge.y1;
    var stopx = edge.x2;
    var stopy = edge.y2;
    var name = edge.name;
    
    return {
        'x1': startx, 
        'y1': starty, 
        'x2': stopx, 
        'y2':stopy, 
        'cost': Math.pow(startx - stopx,2) + Math.pow(starty - stopy, 2),
        'sort': starty * level_w_local + startx,
        'from': starty * level_w_local + startx,
        'to': stopy * level_w_local + stopx,
        'prev': 0,
        'dist': 0,
        'visited': 0,
        'name': name,
        'move':0
    };
}
*/