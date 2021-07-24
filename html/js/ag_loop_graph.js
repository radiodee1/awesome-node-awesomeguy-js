/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* helper functions for worker thread */

var worker ;

var graph_running = false;
var graph = [];

var directions = [];
//var drop = [];


function graphCheckForWorkers() {
    if (typeof(Worker) !== "undefined") {
        preferences_graph = true;
    } else {
        preferences_graph = false;
        console.log("no worker support");
    }
}

function graphInit() {
    if (! preferences_graph || ! preferences_graph_control ) return;
    if (typeof worker !== 'undefined') worker.terminate();
    
    worker = new Worker("js/ag_graph.js");
    
    worker.onmessage = function(e) {
        graph_running = false;
        var data = e.data;
        switch( data.cmd) {
            case 'log':
            case 'test':
                console.log(data.value);
                break;
            case 'sprites':
                
                graphSprites(data.value);
                break;
        }
    };
    worker.onerror = function(e) {
        console.log('Error: Line ' + e.lineno + ' in ' + e.filename + ': ' + e.message);
    };
    graphTest();
    
}

function graphSprites(val) {
    for (var i = 0; i < val.length; i ++ ) {
        sprite[i].barrierx = val[i].barrierx;
        sprite[i].barriery = val[i].barriery;
        sprite[i].move = val[i].move;
        sprite[i].node = val[i].node;
        sprite[i].directions = [];
        for(var j = 0; j < val[i].directions.length; j ++) {
            sprite[i].directions.push(val[i].directions[j]);
        }

    }
    //sprite = val;
    graph_running = false;
}

function graphTest() {
    worker.postMessage({'cmd': 'test', 'value': 'hello'});
    // include test methods here
    // delete later...
    worker.postMessage({'cmd':'monsterName', 'value':'monster'});
}

function graphSet() {
    
    if (graph_running || ! preferences_graph || ! preferences_graph_control ) return;
    //console.log("coords " + sprite[0].x + " " + sprite[0].y);

    sprite[0].x = guy.x;
    sprite[0].y = guy.y;
    worker.postMessage({'cmd':'set', 'value' : {'sprite': sprite ,'graph': graph  } });
    
    graph_running = true; 
}

function graphCancel() {
    worker.postMessage({'cmd':'cancel', 'value': true});
}

function graphFromMap() {
    if (! preferences_graph || ! preferences_graph_control ) return;
    var m = map_objects;
    var floor = [];
    var ladder = [];
    var drop = [];
    var string_ladder = [];
    var string_floor = [];
    var string_drop = [];
    graph = [];
    
    // floor first //
    for (j = 0; j < level_h; j ++) {
        for (i = 0; i < level_w; i ++) {
            /////////////////////// conditions //////////////////
            if ( j + 1 < level_h && (m[i][j + 1] === AG.B_BLOCK || m[i][j+1] === AG.B_LADDER )&& 
                    (m[i][j] === AG.B_SPACE || m[i][j] === AG.B_PRIZE || m[i][j] === AG.B_BIBPRIZE || // m[i][j] === AG.B_LADDER ||
                    m[i][j] === AG.B_ONEUP || m[i][j] === AG.B_KEY || m[i][j] === AG.B_INITIAL_GOAL || m[i][j] === AG.B_GOAL ||
                    m[i][j] === AG.B_MARKER || m[i][j] === AG.B_MONSTER)) {
                floor.push( graphNode(i,j) );
                string_floor.push( JSON.stringify(graphNode(i,j)) );
            }
            else if ( j + 1 < level_h && (m[i][j + 1] === AG.B_BLOCK )&& //|| m[i][j+1] === AG.B_LADDER )&& 
                    (m[i][j] === AG.B_SPACE || m[i][j] === AG.B_PRIZE || m[i][j] === AG.B_BIBPRIZE || m[i][j] === AG.B_LADDER ||
                    m[i][j] === AG.B_ONEUP || m[i][j] === AG.B_KEY || m[i][j] === AG.B_INITIAL_GOAL || m[i][j] === AG.B_GOAL ||
                    m[i][j] === AG.B_MARKER || m[i][j] === AG.B_MONSTER)) {
                floor.push( graphNode(i,j) );
                string_floor.push( JSON.stringify(graphNode(i,j)) );
            }
            if (  j + 1 < level_h && i - 1 >= 0 && isLikeSpace(m[i][j])  && m[i-1][j+1] === AG.B_BLOCK && isLikeSpace(m[i-1][j])  && isLikeSpace(m[i][j+1]) ) {
                
                floor.push( graphNode(i,j) ); // overhang on right
                string_floor.push( JSON.stringify(graphNode(i,j)) );
                
                if( m[i][j+1] !== AG.B_LADDER && ! isInList( JSON.stringify(graphNode(i,j)), string_drop )) {
                    drop.push(graphNode(i,j) );
                    string_drop.push( JSON.stringify(graphNode(i,j)) );
                }
                else {
                    console.log("right " + i + " " + j);
                }

            }
            if ( j + 1 < level_h && i + 1 < level_w  && isLikeSpace(m[i][j]) &&  m[i+ 1][j+1] === AG.B_BLOCK && isLikeSpace(m[i+1][j])  && isLikeSpace(m[i][j+1]) ) {
                
                floor.push( graphNode(i,j) ); // overhang on left
                string_floor.push( JSON.stringify(graphNode(i,j)) );
                
                if( m[i][j+1] !== AG.B_LADDER &&  ! isInList( JSON.stringify(graphNode(i,j)), string_drop )) {
                    drop.push( graphNode(i,j) );
                    string_drop.push( JSON.stringify(graphNode(i,j)) );
                }
                else {
                    console.log("left " + i + " " + j);
                }
            }
        }
    }
    
    // ladder next //
    for (i = 0; i < level_w; i ++) {
        for(j = 0; j < level_h; j ++) { // level_h abd j
            if (m[i][j] === AG.B_LADDER) {
                ladder.push( graphNode(i,j) );
                string_ladder.push( JSON.stringify(graphNode(i,j)) );

            }
            if (j + 1 < level_h &&  isLikeSpace(m[i][j])  && m[i][j+1] === AG.B_LADDER) {
                ladder.push( graphNode(i,j) );
                string_ladder.push( JSON.stringify(graphNode(i,j)) );

            }
        }
    }
    
    ////////// further processing ////////////
    // detect skip from drop //
    var len = drop.length;
    //console.log("drop " + len);
    for (z = 0; z < len; z++ ) {
        //var obj = string_drop[z];
        var j = drop[z];
        //console.log(  "j " + j.x + " " + j.y);
        //graphLog(drop);
        
        if (j.y + 2 < level_h && isLikeSpace(m[j.x][j.y + 1])  && m[j.x][j.y+2] === AG.B_BLOCK) {
            graph.push( graphEdge(j.x,j.y, j.x, j.y+1,"drop") );
            graph.push( graphEdge(j.x, j.y+1, j.x, j.y, "drop") );
            
        }
        else if (j.y + 1 < level_h) {
            var a = 0;
            for (a = j.y +1 ; a < level_h; a ++ ) {
                if (a+1 < level_h  && (m[j.x][a+1] === AG.B_BLOCK)){
                    var b = a - 0;
                    var temp = graphEdge(j.x, j.y, j.x, b, "drop");
                    if (temp.cost !== 0 && temp.cost !== 1) {
                        graph.push( graphEdge( j.x, b, j.x, j.y, "drop") ); // one way... falling!
                        
                        graph.push( graphEdge( j.x, j.y, j.x, b, "drop") ); // one way... helicopter??
                        //console.log( JSON.stringify(graphEdge(j.x, j.y, j.x, a)) +" drop");
                        //break;
                        string_drop.push( JSON.stringify( graphNode(j.x, b)));
                    }
                    break;
                }
            }
        }
    }
    
    
    var len = ladder.length  ;
    var start = graphNode(0,0);
    var stop = graphNode(0,0);
    var z = 0;
    var sample = graphNode(0,0);
    var step = 1; // 2
    var flag = false;
    
    while ( z < len) {
        
        if(z === 0 ) {
            //if (2 < len); 
            stop = ladder[z];
            start = ladder[z];
            sample = ladder[z];
            
        }
        if ( isInList( JSON.stringify(graphNode(stop.x, stop.y + 1)), string_ladder) ) {
            stop = graphNode(stop.x, stop.y + 1);
            z ++;
            //console.log(stop.y + 1);
            //sample = ladder[z];
        }
        else {
            // push two edges...
            var temp = graphEdge(start.x ,start.y, stop.x, stop.y,"ladder");
            if ( temp.cost !== 0 && temp.cost !== 1 &&  start.x === stop.x ) {
                //console.log(z + " ladder "+ JSON.stringify(temp));
                
                graph.push( graphEdge(start.x, start.y, stop.x, stop.y, "ladder") );
                graph.push( graphEdge(stop.x, stop.y, start.x, start.y, "ladder" ) );
            }
            z++;
            
            stop = start = ladder[z];
            
            
        }
        
        
    }
    //graphLog(graph);
    var z = 0;
    var len = floor.length ;//- 1;
    var start = graphNode(0,0);
    var stop = graphNode(0,0);
    while ( z < len) {
        
        if (z === 0) {
            var j = floor[z];
            start = j;
            stop = floor[z];
            
        }
        
        
        if  ( ( z + 1 < floor.length //&& start.x !== floor[z+1].x 
                && floor[z].x +1 !== floor[z+1].x) || 
                isInList(JSON.stringify(floor[z]), string_ladder )  ||
                isInList(JSON.stringify(floor[z]), string_drop )  ||
                z >= floor.length -1 ){  
            // push two edges
            if (z-1 >= 0) stop = floor[z]; // temporarily!
            
            
            if (z +1< floor.length &&  floor[z].x +1 !== floor[z+1].x) {
                
                z++;
                
            }
            
            var temp = graphEdge(start.x,start.y, stop.x, stop.y, "floor");
            //console.log("line "+ JSON.stringify(temp) +" line");

            if (temp.cost !== 0 && (temp.y1 === temp.y2 )) {
                graph.push( graphEdge(start.x, start.y, stop.x, stop.y , "floor") );
                graph.push( graphEdge(stop.x, stop.y, start.x, start.y , "floor") );
            }
            if (    isInList(JSON.stringify(floor[z]), string_ladder ) ||
                    isInList(JSON.stringify(floor[z]), string_drop ) ) {
                start = floor[z];
                //console.log("-------split-------")
            }
            else {
                start = floor[z +0];//+1
            }
            
            if (z+2 < floor.length) stop = floor[z+2];
            j = floor[z + 1];
            z++;
        }
        else {
            
                          
            j = floor[z];
            if (z+1 < floor.length) stop = floor[z+1];
            else stop = floor[z];
            z++;
        }
        
    }
    
    //////////// sort graph //////////////////
    graph.sort(function(a, b) {
        return (a.sort) - (b.sort);
    });
    //graphLog(graph);
}

function graphLog(graph) {
    for(i = 0; i < graph.length; i ++) {
        console.log(JSON.stringify(graph[i]) + " graph " + i)
    }
}

function isInList(obj, list) {
    var temp = false;
    if (list.indexOf(obj) !== -1) temp = true;
    
    return temp;
}

function isLikeSpace( label ) {
    var temp = (label === AG.B_SPACE || label === AG.B_PRIZE || label === AG.B_BIBPRIZE ||  label === AG.B_LADDER ||
                    label === AG.B_ONEUP || label === AG.B_KEY || label === AG.B_INITIAL_GOAL || label === AG.B_GOAL ||
                    label === AG.B_MARKER || label === AG.B_MONSTER || label === AG.B_START);
    return temp;
}

function graphDraw() {
    var c = document.getElementById("my_canvas");
    
    var i = 0;
    for (i = 0; i < graph.length; i ++ ) {
        g = graph[i];
        var x1 = g.x1 * 8 - scrollx + 4;
        var x2 = g.x2 * 8 - scrollx + 4;
        var y1 = g.y1 * 8 - scrolly + 4;
        var y2 = g.y2 * 8 - scrolly + 4;
        
        var ctx = c.getContext("2d");
        ctx.lineWidth = 3;

        //if (x1 !== x2) continue;
         
        // lines
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        
        ctx.strokeStyle = '#00ff00';
        
        ctx.stroke();
        
        // nodes
        ctx.moveTo(x1-2,y1-2);
        ctx.lineTo(x1+2,y1+2);
        ctx.stroke();
    }
}

/*
function drawNodes(list) {
    var c = document.getElementById("my_canvas");
    
    var i = 0;
    for (i = 0; i < list.length; i ++ ) {
        g = list[i];
        var x1 = g.x * 8 - scrollx + 4;
        //var x2 = g.x2 * 8 - scrollx + 4;
        var y1 = g.y * 8 - scrolly + 4;
        //var y2 = g.y2 * 8 - scrolly + 4;
        var ctx = c.getContext("2d");
        ctx.lineWidth = 3;
        

        // lines
        //ctx.moveTo(x1,y1);
        //ctx.lineTo(x2,y2);
        //ctx.stroke();
        
        // nodes
        ctx.moveTo(x1-2,y1-2);
        ctx.lineTo(x1+2,y1+2);
        ctx.strokeStyle = '#00ff00';

        ctx.stroke();
    }
}
*/