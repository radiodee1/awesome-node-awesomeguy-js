/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*  worker thread */

class AG {};
    
AG.UP = 38;
AG.DOWN = 40;
AG.LEFT = 37;
AG.RIGHT = 39;
AG.JUMP = 90;


AG.B_START = 5;
AG.B_SPACE = 0;
AG.B_LADDER = 444;
AG.B_BLOCK = 442;
AG.B_GOAL = 1;//446;
AG.B_KEY = 445; 
AG.B_PRIZE =  447;
AG.B_MONSTER = 443;
AG.B_MARKER = 441; 
AG.B_DEATH = 439 ;
AG.B_ONEUP = 438 ;
AG.B_BIBPRIZE = 440 ;
AG.B_PLATFORM = 437 ;
AG.B_INITIAL_GOAL = 446;// 500;
 
AG.TILEMAP_WIDTH = 224;
AG.TILEMAP_HEIGHT = 128;
 
AG.TILE_WIDTH = 8;
AG.TILE_HEIGHT = 8;
 
AG.GUY_WIDTH = 16;
AG.GUY_HEIGHT = 16;
AG.GUY_CHEAT = 3;
 
AG.MONSTER_WIDTH = 16;
AG.MONSTER_HEIGHT = 16;
 
AG.PLATFORM_WIDTH = 40;
AG.PLATFORM_HEIGHT = 8;
 
AG.MAP_WIDTH = 96;
AG.MAP_HEIGHT = 96;
 
AG.SCREEN_WIDTH = 256;
AG.SCREEN_HEIGHT = 192;
    
AG.MONSTER_TOTAL = 50;
AG.PLATFORM_TOTAL = 20;

AG.SCREEN_TILES_H = 32;
AG.SCREEN_TILES_V = 24;

AG.NUM_LEVELS = 10;

AG.FRAMES_PER_SECOND = 3;
	


var Sprite = {
	x:0, 
        y:0, 
        animate:0,
	facingRight:0, 
        active:0, 
        visible:0,
	leftBB:0, 
        rightBB:0, 
        topBB:0, 
        bottomBB:0,
        type:"none",
        move:0,
        barrierx:0,
        barriery:0,
        node:-1,
        directions:[]
};

var HIGH = 99999;
var VISITED = 1;
var DONE = 2;
var UNVISITED = -1;

var graph = [];
var sprite_edges = [];
var sprite = [];
var destination_nodes = [];
var directions = [];
var map = [];

var startx = 0;
var starty = 0;
var start_sort = 0;

//var rx = -1;
//var ry = -1;

var active_monster_string = "super_monster";
var count_set_dist = 0;
var cancel_flag = false;
//var change_direction = false;

importScripts("ag_graph_extra.js");



self.onmessage = function(e) {
    switch (e.data.cmd ) {
        case 'test':
            test(e.data.value);
            break;
        case "graphSet":
        case 'set':
            graphSet(e.data.value);
            break;
        case "graphCancel":
        case 'cancel':
            graphCancel(e.data.value);
            break;
        case "monsterName":
        case 'monster':
            active_monster_string = e.data.value;
    }
  
}

function test(val) {
    self.postMessage({'cmd':'test','value':val});
}


/* THE CALL TO GRAPH SET IS FOUND IN AG_LOOP_TEST.JS NEXT TO THE DRAW FUNCTIONS */
function graphSet(val) {
    cancel_flag = false;
    
    //graph = val.graph;
    //sprite = val.sprite;
    
    var sprite_in = val.sprite;
    sprite_edges = [];
    sprite = [];
    
    for(var i = 0; i < sprite_in.length; i ++) {
        
        sprite.push(Object.assign({},Sprite));
        
        sprite[i].x = sprite_in[i].x;
        sprite[i].y = sprite_in[i].y ;
        sprite[i].leftBB = sprite_in[i].leftBB;
        sprite[i].rightBB = sprite_in[i].rightBB;
        sprite[i].topBB = sprite_in[i].topBB;
        sprite[i].bottomBB = sprite_in[i].bottomBB;
        sprite[i].type = sprite_in[i].type;
        
        sprite[i].facingRight = sprite_in[i].facingRight;
        sprite[i].visible = sprite_in[i].visible;
        sprite[i].active = sprite_in[i].active;
        sprite[i].animate = sprite_in[i].animate;
        sprite[i].node = sprite_in[i].node;
        sprite[i].directions = [];
        for (var j = 0; j < sprite_in[i].directions.length; j ++) {
            sprite[i].directions.push(sprite_in[i].directions[j]);
        }

    }
    
    
    var graph_in = val.graph;
    graph = [];
    
    for(var i = 0; i < graph_in.length; i ++ ) {
        graph.push( graphEdge (graph_in[i].x1, graph_in[i].y1, graph_in[i].x2 ,graph_in[i].y2 , name = graph_in[i].name  ) );
    }
    
    
    map = val.map;
    
    graphExtraEdges();
    graphInit();
    
    graphSolve();
    graphModifySprite();
    
    if (cancel_flag) return;
    
    self.postMessage({'cmd':'log', 'value': "END sprites " + val.sprite.length + " graph "+ val.graph.length +" END" });
    self.postMessage({'cmd':'sprites', 'value': sprite });

}

function graphExtraEdges() {
    //test("new edges");
    var count = 0;
    var position = 0;
    destination_nodes = [];
    
    var tot = checkEdges(0, type="guy");
    
    var i = 1;
    for (i = 1; i < sprite.length; i ++ ) {
        
        if (sprite[i].type === active_monster_string && (sprite[i].move <= 0 )){ 
            count ++;
            //position = i;
            var tot = checkEdges(i);
            
        }
    }
}

function checkEdges(index, type="super_monster") {
    var s = sprite[index];
    var xloc = Math.floor((s.x ) / 8) ;
    var yloc = Math.floor((s.y ) / 8)  + 0;
    
    var tot = 0;
    var dist = HIGH;
    var old_dist = HIGH;
    var dist_index = 0;
        
    var i = 0;
    for (i = 0; i < graph.length; i ++) {
        var x1 = graph[i].x1;
        var y1 = graph[i].y1;
        var x2 = graph[i].x2;
        var y2 = graph[i].y2;
        var t = graph[i].name;
        var s = graph[i].sort;
        
        
        ////////////////////////////
        
        if (type === "guy") {
            startx = xloc;
            starty = yloc ;
            start_sort = yloc * level_w_local + xloc;
            //test("guy "+ xloc +" "+ yloc);
        }
        else {
            //yloc = Math.ciel((s.y + 0 )/ 8 ) +2 ;
            //xloc += 1;
            destination_nodes.push( graphNode(xloc, yloc) );
            sprite[index].node = yloc * level_w_local + xloc;
            //test("monster " + xloc + " " + yloc);
        }
        
        ////////////////////////////
        if (x1 === xloc && y1 === yloc) {
            // duplicate existing node?
            tot ++;
            //test("dup "+s +" "+ x1 + " " + y1 + " " + x2 + " " + y2 + " " + type);
            if (type === "guy") {
                startx = xloc;
                starty = yloc ;
                start_sort = yloc * level_w_local + xloc;
            }
            else {
                sprite[index].node = yloc * level_w_local + xloc;
                //destination_nodes.push( graphNode(xloc, yloc) );
            }
        }
        //test("graph " + x1 + " " + y1 + " " + x2 + " " + y2 + " " + type);
        else if ( ((x1 >= xloc && xloc >= x2) || (x1 <= xloc && xloc <= x2) ) && y1 === y2){// && yloc === y1) {
            // make a new horizontal edge
            //test("horizontal "+ x1 + " " + y1 + " " + x2 + " " + y2 + " " + type);
            dist = y1 - yloc ;// - y1;
            if (dist < old_dist && dist >= 0) {
                old_dist = dist;
                dist_index = i;
            }
            
            if ( yloc === y1 ) {
                if (type !== "guy") {
                    sprite_edges.push( graphEdge( x1, y1, xloc, yloc, type) ); // one way...!
                    //sprite_edges.push( graphEdge( x2, y2, xloc, yloc, type) ); // one way...!

                    //sprite_edges.push( graphEdge( xloc, yloc,x1, y1,  type) ); // one way...!
                    sprite_edges.push( graphEdge(  xloc, yloc,x2, y2, type) ); // one way...!
                }
                else {
                    sprite_edges.push( graphEdge( xloc, yloc, x1, y1, type) ); // one way...!
                    sprite_edges.push( graphEdge( x2, y2, xloc, yloc, type) ); // one way...!
                }
                tot += 2;
            }
        }
        else if ( ((y1 > yloc && yloc > y2) || (y1 < yloc && yloc < y2) ) && x1 === x2 ) { // && xloc === x1) {
            // make a new vertical edge
            if (xloc === x1 ) {
                //test("vertical "+ x1 + " " + y1 + " " + x2 + " " + y2 + " " + i + " " +type);
                
                
                if (type !== "guy") {
                    sprite_edges.push( graphEdge( xloc, yloc, x1, y1, type) ); // one way...!
                    //sprite_edges.push( graphEdge( x1, y1, xloc, yloc, type) ); // one way...!

                    
                    //if ( true ) { // used to test for ladder...
                    sprite_edges.push( graphEdge( x1, y1, xloc, yloc, type) );
                        //sprite_edges.push( graphEdge( x1, y1, xloc, yloc, type) );

                    tot += 2;
                    //} 
                    
                }
                else if (false) {
                    sprite_edges.push( graphEdge( xloc, yloc, x1, y1, type) ); // one way...!
                    sprite_edges.push( graphEdge( x1, y1, xloc, yloc, type) ); // one way...!
                    tot += 2;
                }
            }
        }
        
        
    }
    if (tot === 0){// && type === "guy") {
        var i = dist_index;
        //test (type + " " + i);
        sprite_edges.push( graphEdge( xloc, graph[i].y1, graph[i].x1, graph[i].y1, type) ); // one way...!
        sprite_edges.push( graphEdge( graph[i].x2, graph[i].y2, xloc, graph[i].y1, type) ); // one way...!
        
        sprite_edges.push( graphEdge( xloc, graph[i].y1, graph[i].x2, graph[i].y1, type) ); // one way...!
        sprite_edges.push( graphEdge( graph[i].x1, graph[i].y2, xloc, graph[i].y1, type) ); // one way...!
        yloc = graph[i].y1;
        
        if (type === "guy") {
            startx = xloc;
            starty = yloc ;
            start_sort = yloc * level_w_local + xloc;
        }
        else {
            sprite[index].node = yloc * level_w_local + xloc;
            //destination_nodes.push( graphNode(xloc, yloc) );
        }
        tot += 4;
    }
    
    return tot;
}

function extendedCheckEdges(index, direction="vertical") {
    if (false) {
        if (direction === "horizontal") {
            var xx = Math.floor((sprite[index].x + 0) / 8);
            var yy = Math.floor((sprite[index].y + 0) / 8) ;
            //var ladderx = -1;
            //var move = 2;
            //xx --;
            sprite[index].x = xx * 8;


            
        }
    
        if (direction === "vertical") {
            var xx = Math.floor((sprite[index].x + 0) / 8);
            var yy = Math.floor((sprite[index].y + 0) / 8) ;
            //var laddery = -1;
            //var move = 2;
            //yy --;
            sprite[index].y = yy * 8;
            
            //test("vertical!!");
        }
    }
}

function graphInit() {
    test("zero out prev and dist");
    var i = 0;
    for (i = 0; i < graph.length; i ++) {
        graph[i].prev = UNVISITED;
        graph[i].dist = HIGH;
        graph[i].visited = UNVISITED;
    }
    var i = 0;
    for (i = 0; i < sprite_edges.length; i ++) {
        sprite_edges[i].prev = UNVISITED;
        sprite_edges[i].dist = HIGH;
        sprite_edges[i].visited = UNVISITED;
        
        //test("edges " +JSON.stringify(sprite_edges[i]));
    }
    sprite_edges.sort(function(a, b) {
        return (a.sort) - (b.sort);
    });
}

function graphSolve() {
    //test("solve " + start_sort + " new-edges:" + sprite_edges.length);
    count_set_dist = 0;
    var loop = true;
    var count = 0;
    var sort = start_sort;
    setVisited(sort, VISITED);
    setDist(sort, 0);
    setPrev(sort,0);
    while(loop) {
        // start going over graph.
        
        var visited = listVisited();
        var j = 0;
        //var list = [];
        for ( j = 0; j < visited.length; j ++) {
            
            sort = visited[j];
            var list = [];
            var i = 0;
            for (i = 0; i < graph.length; i ++) {
                if (graph[i].sort === sort) list.push(graph[i]);
            }
            var i = 0;
            for (i = 0; i < sprite_edges.length; i ++) {            
                if (sprite_edges[i].sort === sort) list.push(sprite_edges[i]);
            }
            
            followGraph(list);
        }
        
        count ++;
        if (count > graph.length  * 2 || cancel_flag) loop = false;
        if (visited.length === 0) loop = false;
    }
    test("count_set_dist:" + count_set_dist);
}

function followGraph(list) {
    
    
    if (true ) { // while
        var new_sort = list[0].sort;
        var min = HIGH;//level_w_local;
        var i = 0;
        var index = 0;
        
        var len = list.length;
        
        for (i = 0; i < len; i ++) {
            

            if (  getVisited(list[i].to) !== DONE || true ) {


                if(list[i].cost < min || true){
                    min = list[i].cost;
                    new_sort = list[i].to;
                    index = i;
                    
                    if (getDist(new_sort) > list[index].cost + list[index].dist ){
                        // 
                        if (list[index].dist === HIGH) {
                            setDist(list[index].sort, 0);
                            test("should be start node " + list[0].sort + " " + start_sort);
                        }
                        setPrev(new_sort, list[index].sort);
                        setDist(new_sort, list[index].dist + list[index].cost);
                        
                        setVisited(list[index].sort, DONE);

                        
                        //test(" ------ prev and dist ------ " +JSON.stringify(list[index]) + " -> "  );//+ JSON.stringify(getEdge(new_sort)));

                        count_set_dist ++;
                        

                    }    
                    
                }
                setVisited( list[i].to, VISITED);
                
            }

        }
        //list.splice(index, 1);
        //count ++;
    }
    //return new_sort;
    
}

function listVisited() {
    var i =0;
    var list = [];
    for(i = 0; i < graph.length; i ++) {
        if (graph[i].visited === VISITED && list.indexOf(graph[i].sort) === -1) {
            list.push(graph[i].sort);
        }
    }
    for (i = 0; i < sprite_edges.length; i ++ ) {
        if (sprite_edges[i].visited === VISITED  && list.indexOf(sprite_edges[i].sort) === -1) {
            
            list.push(sprite_edges[i].sort);
            //test("examine new edges " + sprite_edges[i].sort);
        }
    }
    if ( false ) { // turn off listing fn
        var string = "";
        for (i = 0; i < list.length; i ++) {
            string = string + list[i] + " ";
        } 
        //test("list "+ list.length + " : " + string);
    }
    return list;
}

function graphModifySprite() {
    test("modify sprite for return " + active_monster_string + " " + sprite.length);
    var i = 0;
    for (i = 0; i < sprite.length; i ++ ) {
        
        if (sprite[i].type === active_monster_string) {
            
            
            if (true ) { 
                if ( sprite[i].node >= 0 ) { 
                    
                    // check four directions... look in prev
                    var edge = getEdge(sprite[i].node);
                    //var describe = graphMove(edge, i);
                    //test("follow 1 " + JSON.stringify(edge));
                    
                    //test(JSON.stringify(edge));
                    if (typeof edge !== 'undefined' && edge.prev !== -1) {
                        
                        var edge2 = getEdge(edge.prev);
                        
                        if (typeof edge2 === "undefined") continue;
                        
                        var old_move = sprite[i].move;
                        //sprite[i].move = 0;
                        
                        if (edge.x1 === edge2.x1 ){
                            
                            if ((sprite[i].y ) > edge2.y1 * 8) {
                                //if (Math.floor(sprite[i].y/8) !== edge2.y1) test("here");
                                sprite[i].move = AG.UP;
                                sprite[i].barrierx = edge2.x1;
                                sprite[i].barriery = edge2.y1 ;
                                //describe.move = AG.UP;
                                //test("up " + i);
                                //sprite[i].node = 0;

                            }
                            else if ((sprite[i].y ) < edge2.y1 * 8) {
                                sprite[i].move = AG.DOWN;
                                sprite[i].barrierx = edge2.x1;
                                sprite[i].barriery = edge2.y1;
                                //describe.move = AG.DOWN;
                                //test("down "+ i);
                                //sprite[i].node = 0;

                            }
                            
                            //else sprite[i].node = 0;

                        }
                        else if (edge.y1 === edge2.y1) {
                            if ((sprite[i].x  ) > edge2.x1 * 8 ) {
                                sprite[i].move = AG.LEFT;
                                sprite[i].barrierx = edge2.x1;
                                sprite[i].barriery = edge2.y1;
                                //describe.move = AG.LEFT;
                                //test("left " + i);
                            }
                            else if ((sprite[i].x  ) < edge2.x1 * 8) {
                                sprite[i].move = AG.RIGHT;
                                sprite[i].barrierx = edge2.x1;
                                sprite[i].barriery = edge2.y1;
                                
                                //test("right " + i)
                            }
                            //else sprite[i].node = 0;

                        }
                        else {
                            
                            
                            //sprite[i].move = 0;//AG.RIGHT;
                            //sprite[i].barrierx = 0;//edge2.x1;
                            //sprite[i].barriery = 0;//edge2.y1;
                        }
                        
                        if(sprite[i].move === 0 ){ //|| old_move !== sprite[i].move) {
                            //sprite[i].node = -1;
                            //spriteReset(i);
                        }
                        
                        
                    }
                    //////
                    sprite[i].directions = [];
                    saved = edge2;
                    var count = 0;
                    
                    while (typeof saved !== "undefined" && count < 5) {
                        var saved = getEdge(saved.prev);
                        if (typeof saved !== "undefined") {
                            sprite[i].directions.push(saved);
                        }
                        count ++;
                    }
                    //////
                }
                
            }
        }
    }
}

function spriteReset(i) {
    sprite[i].move = 0;//AG.RIGHT;
    sprite[i].barrierx = 0;//edge2.x1;
    sprite[i].barriery = 0;//edge2.y1;
    sprite[i].node = -1;
    //test("reset here");
}

function graphCancel(val) {
    cancel_flag = val;
    test("graph cancel!!");
}

function getEdgeByPrev(node, prev){
    var i = 0;
    for (i = 0; i < sprite_edges.length; i ++ ) {
        if (sprite_edges[i].sort === node && sprite_edges[i].to === prev) return sprite_edges[i];
    }
    var i = 0;
    for (i = 0; i < graph.length; i ++ ) {
        if (graph[i].sort === node && graph[i].to === prev) return graph[i];
    }
}

function setPrev(label, val) {
    var i = 0;
    for (i = 0; i < graph.length; i ++) {
        if (label === graph[i].sort ) graph[i].prev = val;
    }
    var i = 0;
    for (i = 0; i < sprite_edges.length; i ++) {
        if (label === sprite_edges[i].sort) sprite_edges[i].prev = val;
    }
}

function setDist(label, val) {
    var i = 0;
    for (i = 0; i < graph.length; i ++) {
        if (label === graph[i].sort ) graph[i].dist = val;
    }
    var i = 0;
    for (i = 0; i < sprite_edges.length; i ++) {
        if (label === sprite_edges[i].sort) sprite_edges[i].dist = val;
    }
}

function getDist(label) {
    var i = 0;
    for (i = 0; i < graph.length; i ++) {
        if (label === graph[i].sort ) {
            return graph[i].dist;
        }
    }
    var i = 0;
    for (i = 0; i < sprite_edges.length; i ++) {
        if (label === sprite_edges[i].sort) {
            return sprite_edges[i].dist;
        }
    }
    
}

function getPrev(label) {
    var i = 0;
    for (i = 0; i < graph.length; i ++) {
        if (label === graph[i].sort ) {
            return graph[i].prev;
        }
    }
    var i = 0;
    for (i = 0; i < sprite_edges.length; i ++) {
        if (label === sprite_edges[i].sort) {
            return sprite_edges[i].prev;
        }
    }
    
}

function setVisited(label, val) {
    var i = 0;
    for (i = 0; i < graph.length; i ++) {
        if (label === graph[i].sort ) graph[i].visited = val;
    }
    var i = 0;
    for (i = 0; i < sprite_edges.length; i ++) {
        if (label === sprite_edges[i].sort) sprite_edges[i].visited = val;
    }
}

function getVisited(label) {
    var i = 0;
    for (i = 0; i < graph.length; i ++) {
        if (label === graph[i].sort ) {
            return graph[i].visited;
        }
    }
    var i = 0;
    for (i = 0; i < sprite_edges.length; i ++) {
        if (label === sprite_edges[i].sort) {
            return sprite_edges[i].visited;
        }
    }
    
}

function setVisitedEdge( from, to, val) {
   var i = 0;
    for (i = 0; i < graph.length; i ++) {
        if (from === graph[i].sort && to === graph[i].to ) graph[i].visited = val;
    }
    var i = 0;
    for (i = 0; i < sprite_edges.length; i ++) {
        if (from === sprite_edges[i].sort && to === sprite_edges[i].to) sprite_edges[i].visited = val;
    } 
}

function getEdge(label) {
    var i = 0;
    for (i = 0; i < graph.length; i ++) {
        if (label === graph[i].sort ) {
            return graph[i];
        }
    }
    var i = 0;
    for (i = 0; i < sprite_edges.length; i ++) {
        if (label === sprite_edges[i].sort) {
            return sprite_edges[i];
        }
    }
    
}

function getAllEdges(label) {
    var i = 0;
    var list = [];
    for (i = 0; i < graph.length; i ++) {
        if (label === graph[i].sort ) {
            list.push( graph[i]);
        }
    }
    var i = 0;
    for (i = 0; i < sprite_edges.length; i ++) {
        if (label === sprite_edges[i].sort) {
            list.push( sprite_edges[i]);
        }
    }
    return list;
    
}

/*
function isInDestinationNodes(node) {
    for(var i = 0; i < destination_nodes.length; i ++ ) {
        if (destination_nodes[i].node === node) {
            test(" here " + i);
            return true;
        }
    }
    return false;
}
*/