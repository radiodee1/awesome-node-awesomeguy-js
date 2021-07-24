/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var PAINT_SOLID = 0;
var PAINT_TRANSPARENT = 1;
 
var tiles_a;//[128][224];
var tiles_b;//[128][224];
var tiles_c;//[128][224];
var tiles_d;//[128][224];
 
var guy_a;//[16][16];
var guy_b;//[16][16];
var guy_c;//[16][16];
var guy_d;//[16][16];
 
var monster_a;//[16][16];
var monster_b;//[16][16];
var monster_c;//[16][16];
var monster_d;//[16][16];
var monster_u;
 
var platform_a;//[8][40];

var screen;// = getScreenPointer(0);

var map_level = [] ; //[96][96];
var map_objects = [] ; //[96][96];
 


//var screen_0 [TEX_DIMENSION][TEX_DIMENSION];
//var screen_1 [TEX_DIMENSION][TEX_DIMENSION];
// this array is used as the basis for the opengl texture 
// which prints the screen contents to the opengl window.
// it must have dimenstions of powers of 2.
var screencounter = 0;
 
var tilesWidthMeasurement = 32;
var tilesHeightMeasurement = 24;//32;

var newBG = 0;
var newGuy = 0;
var animate_var = 0;
////////////////////////////////////

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
 
//Sprite sprite[100];
var sprite = [];
for(i = 0; i < 100; i ++){
    sprite.push(Object.assign({},Sprite));
}

var guy = Object.assign({},Sprite); 
var keySprite = Object.assign({},Sprite);

///////////////////////////////////

var BoundingBox = {
	left:0, 
        right:0, 
        top:0, 
        bottom:0
};

///////////////////////////////////

var level_h, level_w, lives, scrollx, scrolly, animate ;
var score , level;

level = 0;

level_h = 0;
level_w = 0;
//lives = 3;

scrollx = 0;
scrolly = 0;
animate = 0;

//score = 10;

var exitblocked = false;
var keysonlevel = false;

var endlevel = false;

var sound_ow = false;
var sound_prize = false;
var sound_boom = false;

var preferences_monsters = false;
var preferences_collision = false;
var preferences_larger_screen = true;
var preferences_sound = false;
var preferences_graph = false; // do not touch this!!
var preferences_graph_control = true;

var animate_only = false;



// some declarations that are used only in this c file...
var number_alpha = 0;

var sprite_num = 0;
var monster_num = 0;
var monster_offset = 0;
var platform_num = -1;
var platform_offset = 0;

var loop_handle = 0;
var play_again = true;

//////////////////////////////////////////////////////
// function definitions
//////////////////////////////////////////////////////
function clearMapList() {
    map_list = [];
    for (i = 0; i < AG.NUM_LEVELS; i ++) {
        map_list.push(Object.assign({}, MapInfo));
    }
}

function clearSpriteList() {
    
    sprite = [];
    for(i = 0; i < 100; i ++){
        sprite.push(Object.assign({},Sprite));
    }
    addSprite(0,0,4,10,2,16);// the guy
    guy = sprite[0];
    guy.type = "guy";
    sprite[0].type = "guy";
    //console.log("clearSpriteList");
}

function clearMap() {
    
    map_level = [] ; //[96][96];
    map_objects = [] ; //[96][96];

    for (i = 0; i < AG.MAP_HEIGHT; i ++) {
        var temp1 = [];
        var temp2 = [];
        for (j = 0; j < AG.MAP_WIDTH; j ++) {
            temp1.push(0);
            temp2.push(0);
        }
        map_level.push(temp1);
        map_objects.push(temp2);
    }
}

function setSoundOw() {
    sound_ow = true;
    startSound("snd_ow");
}


function setSoundPrize() {
    sound_prize = true;
    startSound("snd_prize");
}


function setSoundBoom() {
    sound_boom = true;
    startSound("snd_boom");
}

function setSoundGoal() {
    startSound("snd_goal");
}

function startSound(id) {
    if (! preferences_sound) return;
    var snd = document.getElementById(id);
    if (snd.paused) {
        snd.currentTime = 0.0;
    }
    else {
        snd.load();
    }
    snd.play();
}

/*
function getSoundOw() {
	var temp = sound_ow;
	sound_ow = false;
	return temp;
}


function getSoundPrize() {
	var temp = sound_prize;
	sound_prize = false;
	return temp;
}


function getSoundBoom() {
	var temp = sound_boom;
	sound_boom = false;
	return temp;
}
*/

/* NEED INTERFACE WITH JAVA */

/**
 *	Collects 1D arrays representing the four tile maps and passes them 
 *	individually to the functions that store them in 2D arrays for the later
 *	use of the library. Used to basically initializes tilemap arrays when Panel
 *	is created.
 *
 *	@param	a	1D integer array of tile map data
 *	@param	b	1D integer array of tile map data
 *	@param	c	1D integer array of tile map data
 *	@param	d	1D integer array of tile map data
 */
function setTileMapData( ) {


	tiles_a = copyArraysExpand_tileset("tiles1", AG.TILEMAP_WIDTH, AG.TILEMAP_HEIGHT);
	tiles_b = copyArraysExpand_tileset("tiles2", AG.TILEMAP_WIDTH, AG.TILEMAP_HEIGHT);
	tiles_c = copyArraysExpand_tileset("tiles3", AG.TILEMAP_WIDTH, AG.TILEMAP_HEIGHT);
	tiles_d = copyArraysExpand_tileset("tiles4", AG.TILEMAP_WIDTH, AG.TILEMAP_HEIGHT);
	
}
 
/**
 *	Collects 1D arrays representing the four guy sprites and passes them 
 *	individually to the functions that store them in 2D arrays for the later
 *	use of the library. Used to basically initializes guy sprite arrays when 
 *	Panel is created.
 *
 *	@param	a	1D integer array of guy sprite data
 *	@param	b	1D integer array of guy sprite data
 *	@param	c	1D integer array of guy sprite data
 *	@param	d	1D integer array of guy sprite data
 */
function setGuyData() {
            
	guy_a = copyArraysExpand_tileset("guy0", AG.GUY_WIDTH, AG.GUY_HEIGHT);
	guy_b = copyArraysExpand_tileset("guy1", AG.GUY_WIDTH, AG.GUY_HEIGHT);
	guy_c = copyArraysExpand_tileset("guy2", AG.GUY_WIDTH, AG.GUY_HEIGHT);
	guy_d = copyArraysExpand_tileset("guy3", AG.GUY_WIDTH, AG.GUY_HEIGHT);
	
	guy.topBB = 2; 
	guy.bottomBB = 16;
	guy.leftBB = 4;
	guy.rightBB = 10;
        guy.type = "guy";
}
 
/**
 *	Collects 1D arrays representing the four monster sprites and passes them 
 *	individually to the functions that store them in 2D arrays for the later
 *	use of the library. Used to basically initializes monster sprite arrays 
 *	when Panel is created.
 *
 *	@param	a	1D integer array of monster sprite data
 *	@param	b	1D integer array of monster sprite data
 *	@param	c	1D integer array of monster sprite data
 *	@param	d	1D integer array of monster sprite data
 */ 
 
function setMonsterData() {


	monster_a = copyArraysExpand_tileset("monster_r0", AG.MONSTER_WIDTH, AG.MONSTER_HEIGHT);
	monster_b = copyArraysExpand_tileset("monster_r1", AG.MONSTER_WIDTH, AG.MONSTER_HEIGHT);
	monster_c = copyArraysExpand_tileset("monster_l0", AG.MONSTER_WIDTH, AG.MONSTER_HEIGHT);
	monster_d = copyArraysExpand_tileset("monster_l1", AG.MONSTER_WIDTH, AG.MONSTER_HEIGHT);
	monster_ud1 = copyArraysExpand_tileset("monster_ud1", AG.MONSTER_WIDTH, AG.MONSTER_HEIGHT);
	monster_ud2 = copyArraysExpand_tileset("monster_ud2", AG.MONSTER_WIDTH, AG.MONSTER_HEIGHT);

}
 
 
/**
 *	Collects 1D array representing the floating platform sprite and passes it 
 *	individually to the function that stores it in 2D arrays for the later
 *	use of the library. Used to basically initialize platform sprite arrays 
 *	when Panel is created.
 *
 *	@param	a	1D integer array of monster sprite data
 */ 
function setMovingPlatformData() {
	platform_a = copyArraysExpand_tileset("concrete",40,8);
}

/**
 *	Collects 1D arrays representing the two level definition arrays and converts 
 *	them individually to 2D arrays for the later use of the library. Used to 
 *	basically initializes the two background arrays when the Panel is created.
 *
 *	@param	a	1D integer array of background definition level data
 *	@param	b	1D integer array of background definition objects data
 */ 
function setLevelData(a,  b, horizontal, vertical) {


	var i,j;
	keysonlevel = false;
        exitblocked = false;
        
	// FIRST PASS ///////////////
	for (i = 0 ; i < vertical ; i ++ ) {
		for (j = 0; j < horizontal ; j ++ ) {
			map_level[j][i] = parseInt(a[ (i * horizontal ) + j]) ;
			map_objects[j][i] = parseInt(b[ (i * horizontal ) + j]) ;
			//LOGE("level data %i ", map_level[i][j]);

            //detect presence of one or more keys!!
            if (map_objects[j][i]   === AG.B_KEY) {
                exitblocked = true;
                keysonlevel = true;
            }

		}
	}

    // SECOND PASS /////////////////
    for (i = 0 ; i < vertical ; i ++ ) {
        for (j = 0; j < horizontal ; j ++ ) {
            //LOGE("level data %i ", map_level[i][j]);

            if (map_objects[j][i] == AG.B_GOAL && keysonlevel) {
                map_objects[j][i] = AG.B_INITIAL_GOAL;
            }
        }
    }
	
	for (i = 0; i< 100; i ++) {
		sprite[i].x = 0;
		sprite[i].y = 0;
		sprite[i].animate = 0;
		sprite[i].facingRight = false;
		sprite[i].active = false;
		sprite[i].visible = false;
		sprite[i].leftBB = 0;
		sprite[i].rightBB = 0;
		sprite[i].topBB = 0;
		sprite[i].bottomBB = 0;
                sprite[i].type = "none";
	}
	monster_num = 0;
	sprite_num = 0;
	platform_num = -1;
	
	
	
	return;
}

function addSprite(x,y,left,right,top,bottom) {
    
    var i = sprite_num;
    if (i >= 100) return i;
    
    sprite[i].x = x;
    sprite[i].y = y;
    sprite[i].animate = 1;
    sprite[i].facingRight = false;
    sprite[i].active = true;
    sprite[i].visible = false;
    sprite[i].leftBB = left;
    sprite[i].rightBB = right;
    sprite[i].topBB = top;
    sprite[i].bottomBB = bottom;
    sprite[i].type = "sprite";
    sprite_num ++;
    //monster_num ++;
    return i;
}
 
/**
 *	Used repeatedly by the Panel to set the position of the guy sprite and to
 *	set the scrollx and scrolly values for the background. The value of the
 *	guy sprite's animation index is also set.
 *
 *	@param	guy_x		x position of the guy sprite in pixels
 *	@param	guy_y		y position of the guy sprite in pixels
 *	@param	scroll_x	x scroll position of the background in pixels
 *	@param	scroll_y	y scroll position of the background in pixels
 *	@param	guy_animate	guy sprite animation index
 */ 
function setGuyPosition(guy_x, guy_y, scroll_x, scroll_y, guy_animate) {


	guy.x = guy_x;
	guy.y = guy_y;
	guy.animate = guy_animate;
	animate = guy_animate;
	scrollx = scroll_x;
	scrolly = scroll_y;
}
 
/**
 *	Used repeatedly by the Panel to set the score and number of lives to be 
 *	displayed on the screen
 *
 *	@param	a_score	score to be displayed on screen
 *	@param	a_lives	lives to be displayed on screen
 */ 
function setScoreLives(a_score, a_lives) {



    score = a_score;
    lives = a_lives;
}


/**
 *	Used repeatedly by the Panel to set a single background objects cell to a 
 *	desired value. Used to remove objects from level when the character takes 
 *	them
 *
 *	@param	map_x	x position of the cell to change
 *	@param	map_y	y position of the cell to change
 *	@param	value	value to assign to cell
 */ 
function setObjectsDisplay(map_x, map_y, value) {
	map_objects[map_x][ map_y ] = value;
} 

function getObjectsCell(map_x, map_y) {
    //console.log(map_x+" "+ map_y);
    if (map_x >= level_w || map_y >= level_h) return 0;
    return map_objects[map_x][map_y];
}


/**
 *	Used by the Panel to initialize a monster's sprite object in a list
 *	of sprites at the beginning of each level. All sprites for monsters 
 *	must be added together before sprites for moving platforms.
 *
 *	@param	monster_x		x position of the monster sprite in pixels
 *	@param	monster_y		y position of the monster sprite in pixels
 *	@param	monster_animate	monster sprite animation index
 */ 
function addMonster(monster_x, monster_y, monster_animate) {

    if (sprite_num >= 100) return;

    sprite[sprite_num].x = monster_x ;
    sprite[sprite_num].y = monster_y ;
    sprite[sprite_num].animate = monster_animate;
    sprite[sprite_num].facingRight = true;
    sprite[sprite_num].active = true;
    sprite[sprite_num].visible = true;
      
    sprite[sprite_num].topBB = 3; 
    sprite[sprite_num].bottomBB = 8;
    sprite[sprite_num].leftBB = 0;
    sprite[sprite_num].rightBB = 16;
    
    sprite[sprite_num].type = "monster";
      
    //sprite[sprite_num].node = 1;
      
    sprite_num ++;
    monster_num = sprite_num;
    platform_num = 0;
}
 
 
/**
 *	Used repeatedly by the Panel to inactivate a monster sprite object.
 *
 *	@param	num	index for the monster to inactivate
 */  
function inactivateMonster(num) {
	if (num < sprite_num) {
		sprite[num].active = false;
	}
} 

/**

 *	Used by the Panel to initialize a platform's sprite object in a list
 *	of sprites at the beginning of each level. All sprites for monsters 
 *	must be added together before sprites for moving platforms.
 *
 *	@param	platform_x		x position of the monster sprite in pixels
 *	@param	platform_y		y position of the monster sprite in pixels
 */ 
function addPlatform(platform_x, platform_y) {

    if (sprite_num >= 100) return;


    sprite[sprite_num].x = platform_x ;
    sprite[sprite_num].y = platform_y ;
    sprite[sprite_num].animate = 0;
    sprite[sprite_num].facingRight = true;
    sprite[sprite_num].active = true;
    sprite[sprite_num].visible = true;
      
    sprite[sprite_num].topBB = 0; 
    sprite[sprite_num].bottomBB = 8;
    sprite[sprite_num].leftBB = 0;
    sprite[sprite_num].rightBB = 40;
    
    sprite[sprite_num].type = "platform";
      
    sprite_num ++;
    platform_num = sprite_num;
}

/* INTERNAL USE ONLY */

/**
 *	Used by monster code to make monsters at once visible, but not active.
 *
 *	@param	number 	index for the monster to make invisible
 */
function inactivateMonsterView(num) {
	if (num < sprite_num) {
		sprite[num].visible = false;
	}
}

/**
 *	Used for monster collision function
 *
 *	@param	sprite	a sprite struct
 *	@param	x		an x offset
 *	@param	y		a y offset
 *	@return			the bounding box for the sprite
 */
function makeSpriteBox(sprite, x,  y) {
  //BoundingBox temp;
  temp = Object.assign({},BoundingBox);
  temp.left = sprite.leftBB + sprite.x + x;
  temp.right = sprite.rightBB + sprite.x + x;
  temp.top = sprite.topBB + sprite.y + y;
  temp.bottom = sprite.bottomBB + sprite.y + y;
  return temp;
}

function makeBlockBox( x,  y) {
  //BoundingBox temp;
  temp = Object.assign({},BoundingBox);
  
  temp.left =  8 * x;
  temp.right = 8 * x + 8;
  temp.top = 8 * y;
  temp.bottom = 8 * y + 8;
  return temp;
}

/**
 *	Used for overall collision testing
 */

function collisionSimple(boxA, boxB) {
  //var x[4], y[4];
  var x = [0,0,0,0];
  var y = [0,0,0,0];
  var i, j;
  var test = false;
  var outsideTest, insideTest;
  
  x[0] = boxA.left;
  y[0] = boxA.top;
  
  x[1] = boxA.right;
  y[1] = boxA.top;
  
  x[2] = boxA.left;
  y[2] = boxA.bottom;
  
  x[3] = boxA.right;
  y[3] = boxA.bottom;
  for (i = 0; i < 4; i ++) {
    // is one povar inside the other bounding box??
    if (x[i] <= boxB.right && x[i] >= boxB.left && y[i] <= boxB.bottom && y[i] >= boxB.top ) {
      // are all other points outside the other bounding box??
      outsideTest = false;
      
      for (j = 0; j < 4 ; j ++) {
        if (j != i ) {
          if (!(x[j] <= boxB.right && x[j] >= boxB.left && y[j] <= boxB.bottom && y[j] >= boxB.top) ) {
            outsideTest = true;
            
          }
        }
      }
      if(outsideTest) {
        test = true;
       
      }
      // is a second povar inside the bounding box??
      insideTest = false;
      for (j = 0; j < 4 ; j ++) {
        if (j != i ) {
          if ((x[j] <= boxB.right && x[j] >= boxB.left && y[j] <= boxB.bottom && y[j] >= boxB.top) ) {
            insideTest = true;

          }
        }
      }
      if(insideTest) {
        test = true;
       
      }
      
      /////////////////////////
    }
  }
  if (!test) return collisionHelper(boxA, boxB);
  else return true;
}

/**
 *	Used for overall collision testing.
 */

function collisionHelper(boxA, boxB) {
  //var x[4], y[4];
  var x = [0,0,0,0];
  var y = [0,0,0,0];
  var i,j;
  var test = false;
  var outsideTest, insideTest;
  
  x[0] = boxB.left;
  y[0] = boxB.top;
  
  x[1] = boxB.right;
  y[1] = boxB.top;
  
  x[2] = boxB.left;
  y[2] = boxB.bottom;
  
  x[3] = boxB.right;
  y[3] = boxB.bottom;
  for (i = 0; i < 4; i ++) {
    // is one povar inside the other bounding box??
    if (x[i] <= boxA.right && x[i] >= boxA.left && y[i] <= boxA.bottom && y[i] >= boxA.top ) {
    
    
      // are all other points outside the other bounding box??
      outsideTest = false;
      
      for (j = 0; j < 4 ; j ++) {
        if (j != i ) {
          if (!(x[j] <= boxA.right && x[j] >= boxA.left && y[j] <= boxA.bottom && y[j] >= boxA.top) ) {
            outsideTest = true;
            
          }
        }
      }
      if(outsideTest) {
        test = true;
      
      }
      // is a second povar inside the bounding box??
      insideTest = false;
      for (j = 0; j < 4 ; j ++) {
        if (j != i ) {
          if ((x[j] <= boxA.right && x[j] >= boxA.left && y[j] <= boxA.bottom && y[j] >= boxA.top) ) {
            insideTest = true;

          }
        }
      }
      if(insideTest) {
        test = true;

      }
      
      
      //////////////////////////
    }
  }
  
  return test;
}



function changeImageData(from, x , y,  scroll_x, scroll_y) {
    //var p = from;
    
    var paint_all = 0;
    var extra = 0;
    //var screen = getScreenPointer(0);
    var width = from.width;
    var height = from.height;

    var i,j,k,l,m;
    k = ( x - scroll_x) * 4;
    l = y - scroll_y;
    //screen.putImageData(from, k, l);
    var screenz = getScreenImageData();
    
    
    for (i = 0; i < height; i ++ ) {
    	for (j = 0; j < width * 4 ; j += 4) {
            var index = i * width *4  + j;
            var r = from.data[index + 0];
            var g = from.data[index + 1];
            var b = from.data[index + 2];
            var a = from.data[index + 3];
            
            if (r < 5 && g < 5 && b < 5) {
                //do nothing
            }
            else {
                var newy = l + i;
                var newx = j + k;
                if (newx >= 0 && newy >= 0 && newx < AG.SCREEN_WIDTH * 4 && newy < AG.SCREEN_HEIGHT) {
                    screenz.data[((l + i) * AG.SCREEN_WIDTH * 4)  +(j +k +0) ] = r;
                    screenz.data[((l + i) * AG.SCREEN_WIDTH * 4)  +(j +k +1) ] = g;
                    screenz.data[((l + i) * AG.SCREEN_WIDTH * 4)  +(j +k +2) ] = b;
                    screenz.data[((l + i) * AG.SCREEN_WIDTH * 4)  +(j +k +3) ] = a;
                }
            }
            
            
    	}
    }
    return screenz;
}


/**
 *	Used to copy tilesheet pixel information from the 1D representation that
 *	is used by the java app to the 2D representation that is used by this 
 *	library
 *
 *	@param	from	1D array of tilesheet data pixels
 *	@param	size_l	size in pixels of 'from' array
 *	@param	to		2D array of tilesheet data used by library
 */
function copyArraysExpand_tileset (from, width, height) {
    
    var id = from.split(".");
    
    var img_id = document.getElementById(id[0]);
    
    var canvas = $("<canvas id='canvas_" + id[0] + "' width="+ width +" height=" + height +" >" );
    canvas.appendTo("head");
    var canvas_id = document.getElementById("canvas_"+ id[0]);
    var ctx = canvas_id.getContext("2d");
    ctx.drawImage(img_id,0,0);
    
    var ctx = canvas_id.getContext("2d");
    
    
    
    var z = ctx.getImageData(0,0, width, height);

    return z;
}

/**
 *	Used to draw a 16x16 sprite on the library's 2D screen array at a certian
 *	position, given a certian scroll adjustment. If 'paint_all' is used, the 
 *	color in 'extra' is skipped during drawing.
 *
 *	@param	from		16x16, 2D sprite pixel data to be drawn
 *	@param	x			x position of the 2D sprite on the screen array
 *	@param	y			y position of the 2D sprite on the screen array
 *	@param	scroll_x	x scroll adjustment for the 2D screen array
 *	@param	scroll_y	y scroll adjustment for the 2D screen array
 *	@param	paint_all	integer constant to determine if entire sprite should be
 *						painted
 *	@param	extra		color value to skip if 'paint_all' function is used
 */
function drawSprite_16( from,  x,  y,  scroll_x,  scroll_y,  paint_all,  extra) {

    var draw = true;
    var screen = getScreenPointer(0);
    if (x - scroll_x <  0) {
        //x = scroll_x; // do this in 'changeImageData()' instead
        draw = false;
    }
    if (y - scroll_y < 0) {
        //y = scroll_y;
        draw= false;
    }
    
    var p = changeImageData(from,x,y,scroll_x,scroll_y);

    var i,j,k,l;
    k = x - scroll_x;
    l = y - scroll_y;
    //screen.putImageData(from, k, l);
    if (draw || true) screen.putImageData(p, 0,0);
    
    
    return;
}
 
 
/**
 *	Used to draw a 40x8 sprite on the library's 2D screen array at a certian
 *	position, given a certian scroll adjustment. If 'paint_all' is used, the 
 *	color in 'extra' is skipped during drawing.
 *
 *	@param	from		40x8, 2D sprite pixel data to be drawn
 *	@param	x			x position of the 2D sprite on the screen array
 *	@param	y			y position of the 2D sprite on the screen array
 *	@param	scroll_x	x scroll adjustment for the 2D screen array
 *	@param	scroll_y	y scroll adjustment for the 2D screen array
 *	@param	paint_all	integer constant to determine if entire sprite should be
 *						painted
 *	@param	extra		color value to skip if 'paint_all' function is used
 */
function drawSprite_40_8(from,  x,  y, scroll_x,  scroll_y,  paint_all,  extra) {
	
    var i,j,k,l;
    //var screen = getScreenPointer(0);
	
    k = x - scroll_x;
    l = y - scroll_y;
    screen.putImageData(from, k, l);

    /*
    for (i = 0; i < AG.PLATFORM_HEIGHT; i ++ ) {
    	for (j = 0; j < AG.PLATFORM_WIDTH; j ++) {
    		if ( (i + l) >= 0 && (j + k) >= 0 && (j+k) < AG.SCREEN_WIDTH && (i+l) < AG.SCREEN_HEIGHT ) {
    			
    			if (paint_all == 1 && from[i][j] == extra ) {
    				
    			}
    			else {
	    			//screen[i + l][j + k] =color_pixel( from[i][j]);
				screen[((l + i) * AG.SCREEN_WIDTH )  +(j +k ) ] = color_pixel(from[i][j]);
	    		}

    		}
    	}
    }
    */
    return;
}
 
/**
 *	Used to draw a 8x8 tile on the library's 2D screen array at a certian
 *	position, given a certian scroll adjustment. If 'paint_all' is used, the 
 *	color in 'extra' is skipped during drawing.
 *
 *	@param	tile		8x8, 2D sprite pixel data to be drawn
 *	@param	x			x position of the 2D sprite on the screen array
 *	@param	y			y position of the 2D sprite on the screen array
 *	@param	scroll_x	x scroll adjustment for the 2D screen array
 *	@param	scroll_y	y scroll adjustment for the 2D screen array
 *	@param	paint_all	integer constant to determine if entire tile should be
 *						painted
 *	@param	extra		color value to skip if 'paint_all' function is used
 */
function drawTile_8( tile,  screen_x, screen_y,  scroll_x,  scroll_y,  paint_all,  extra) {
   
    var i,j,m,n;
    //var screen = (getScreenPointer(0));
    
	m = screen_x  - scroll_x;

	n = screen_y  - scroll_y;

    //var offscreen_data = offscreen_context.getImageData(x, y, width, height);
    //alert(scroll_x + " " + screen_x);
    screen.putImageData(tile, m,n);//n * AG.SCREEN_WIDTH, m);
    
    /*
    for (i = 0; i < AG.TILE_HEIGHT; i ++ ) {
    	for (j = 0; j < AG.TILE_WIDTH; j ++) {
    		if ( (i + n) >= 0 && (j + m) >= 0 && (i+n) < AG.SCREEN_HEIGHT  && (j+m) <  AG.SCREEN_WIDTH ) {
    			if ( paint_all == 1 && tile[i][j] == extra ) {
    				//
    			}
    			else {
    			
	    			//screen[i + n ][j + m] = tile[i][j];
	    			//screen[i + n ][j + m] = color_pixel( tile[i][j]);
				    screen[((n + i) * AG.SCREEN_WIDTH )  +(j +m ) ] = color_pixel(tile[i][j]);
	    			//LOGE("drawing tile %i", tile[i][j]);
	    		}
    		} 
    	}
    }
    */
    return;
}
/**
 *	Used to isolate a specific 8x8 tile from the tileset array so that it can
 *	be printed on the screen as part of the game's background.
 *
 *	@param	tileset	2D array of tileset pixels
 *	@param	tile	2D array to use as the destination for the 8x8 tile that was
 *					copied
 *	@param	num		the number that indicates which tile to copy from the 
 *					tileset image
 */
function cutTile( tileset, tile_ignore ,  num) {


    var i,j,k,l,m,n, p;

    //m = parseInt(AG.TILEMAP_HEIGHT / AG.TILE_HEIGHT); // 128/8 = 16
    n = (AG.TILEMAP_WIDTH / AG.TILE_HEIGHT); // 224/8 = 28
    
    
    k = Math.floor(num / n); // y pos 
    l = (num - (k * n)); // x pos
    //console.log(k + " "+l);
    
    var canvas_id = document.getElementById("canvas_"+ tileset);
    var ctx = canvas_id.getContext("2d");
    //ctx.drawImage(img_id,0,0);//width,height);
    //
    //var z;
    //var image = new Image(width, height);
    //image.src = "img/"+ from;
    
    //var ctx = canvas_id.getContext("2d");
    //if (l !== l || k !== k) {
    //    l = 0;
    //    k = 0;
    //}
    if ( l !== l ) l = 0;
    if ( k !== k ) k = 0;
    var z = ctx.getImageData(Math.floor(l * AG.TILE_WIDTH),Math.floor(k * AG.TILE_WIDTH), 8, 8);
        
    //var offscreen_data = tileset.getImageData(l, k, 8, 8);

    return z;
}





/**
 *	Used to draw the words 'score' and 'lives' on the library's screen array.
 */
function drawScoreWords() {


	var i;
    	var topScore = [374,375,376,377,378,383];

    	var topLives = [379,380,381,378,382,383];

    	var scorePos, livesPos;
    	scorePos = 2 ;
    	livesPos = 16  ;
        //var square[TILE_HEIGHT][TILE_WIDTH];
    	//mTiles = new TileCutter(bMapNum);
	
        
		
    	if (guy.y > 16) {
    			//print SCORE:
    			for (i = 0; i < 6; i ++) {
       				var square = cutTile("tiles1", square, topScore[i]);
                                
    				drawTile_8(square, (scorePos + i) * AG.TILE_WIDTH + scrollx, (1) * AG.TILE_HEIGHT + scrolly, 
    					scrollx , scrolly, PAINT_TRANSPARENT, number_alpha);

       				var square = cutTile("tiles1", square, topScore[i] +28);

    				drawTile_8(square, (scorePos + i) * AG.TILE_WIDTH  + scrollx, (2) * AG.TILE_HEIGHT + scrolly, 
    					scrollx , scrolly, PAINT_TRANSPARENT, number_alpha);
    				

    			}
    			//print LEVEL:
    			for (i = 0; i < 6; i ++) {
    				
    				var square = cutTile("tiles1", square, topLives[i]);

    				drawTile_8(square, (livesPos + i) * AG.TILE_WIDTH + scrollx, (1) * AG.TILE_HEIGHT + scrolly, 
    					scrollx , scrolly, PAINT_TRANSPARENT, number_alpha);

       				var square = cutTile("tiles1", square, topLives[i] +28);

    				drawTile_8(square, (livesPos + i) * AG.TILE_WIDTH +scrollx , (2) * AG.TILE_HEIGHT + scrolly , 
    					scrollx , scrolly, PAINT_TRANSPARENT, number_alpha);
    				
    				
    			}

    			//print numbers:
    			drawScoreNumbers( scorePos + 6, score  , 7); // score
    			drawScoreNumbers( livesPos + 6, lives , 7); // lives
    	}
    }
 
/**
 *	Used to draw the numbers that represent the player's score and lives next to
 *	the words 'score' and 'lives' on the game's graphics screen.
 *
 *	@param	pos	position of the number on the screen with relation to the word
 *				'lives' or the word 'score'
 *	@param	num	actual numerical value to be used as the score or lives number
 *	@param	p	maximum number of decimal places of 'num'	
 */
function drawScoreNumbers( pos,  num,  p) {

    var i, a, b, c, placesValue;
    placesValue = 0;
    	var places = [0,0,0,0,0,0,0,0,0,0];//ten spots
    	var topNumbers = [364,365,366, 367, 368, 369, 370, 371, 372, 373];
    	var showZeros = 0;
        //var square[TILE_HEIGHT][TILE_WIDTH];
    	//mTiles = new TileCutter(bMapNum);

    	for (i = 0; i < 10; i ++) {
    		a = num - Math.floor(num / 10) * 10;
    		places[9 - i] = a;
    		b = Math.floor(num / 10) * 10;
    		num = Math.floor(b / 10);
    	}
    	c = 0;
    	for(i = 0; i < p; i ++) {
    		placesValue = places[i + (10 - p)];
    		if (showZeros === 1 || placesValue !== 0) {
    			if(placesValue !== 0) showZeros = 1;
    			if(showZeros === 1 && c === 0) {
    				c = p - i;
    			}
    			
				var square = cutTile("tiles1", 0, topNumbers[placesValue]);

    				drawTile_8(square, (pos + i - p + c) * AG.TILE_WIDTH + scrollx, (1) * AG.TILE_HEIGHT +
    					scrolly, scrollx , scrolly, PAINT_TRANSPARENT, number_alpha);

       				var square = cutTile("tiles1", 0, topNumbers[placesValue] +28);

    				drawTile_8(square, (pos + i - p + c) * AG.TILE_WIDTH +scrollx , (2) * AG.TILE_HEIGHT +
    					scrolly , scrollx , scrolly, PAINT_TRANSPARENT, number_alpha);
    				
    		}

    	}
}

/**
 * Used to draw monsters on screen.
 */
function drawMonsters() {
	//draw all monsters
	var anim_speed = 5;
	var i;
	var xx,yy,z;
	var move = 3;//3
	var markerTest = false;
	var hide = true;
	var show = false;
	var visibility = false;
        var length = 16;// 16

        var is_up_down = false;
	//var index_num = 0;
	
	
	//for each monster...
	if(monster_num > 0) {
		for (i =  monster_offset ; i < monster_num   ; i++) {   
			markerTest = false; 
                        is_up_down = false;
                        if (sprite[i].type !== "monster" && sprite[i].type !== "super_monster") continue;
			
			if (sprite[i].active === true && sprite[i].move === 0 ){// && ! preferences_graph_control ) {
				xx = Math.floor(sprite[i].x / 8);
				yy = Math.floor(sprite[i].y / 8);
                                //console.log(xx + " " + yy);
				// Must move and stop monsters when they hit bricks or
				// markers or the end of the screen/room/level.
                                //if (xx < 0 || yy < 0 || xx >= level_w || yy >= level_h) return;
                                //console.log("monsters " + xx + " " + yy + " "+ map_objects.length);
				if(sprite[i].facingRight === true) {

					sprite[i].x = sprite[i].x + move;
					// marker test
                                        if (xx + 3 >= level_w - 3 || typeof map_objects[xx+2] === "undefined") {
                                            xx = level_w - 3;
                                            //sprite[i].x -= 8 * 2;
                                            continue;
                                        }
					if( map_objects[xx+2][yy] === AG.B_BLOCK  ) markerTest = true;
					if( map_objects[xx+2][yy] === AG.B_MARKER ) markerTest = true;
					if( map_objects[ xx+2][yy+1] === 0) markerTest = true;
					//if(map_objects[xx+2][yy+1] !== AG.B_BLOCK && map_objects[ xx-1][yy] === AG.B_LADDER) {
                                            //sprite[i].x += move;
                                            //markerTest = true;
                                        //}

                                        // turn monster

                                        if (sprite[i].x > level_w * 8  - length || markerTest === true) {
                                                //sprite[i].x = sprite[i].x - move;
						sprite[i].facingRight=false;
					}
				}
				else {

					sprite[i].x = sprite[i].x - move;
					// marker test
                                        if (xx  < 0) xx = 2;
                                        if (xx >= level_w) xx = level_w -1;
                                        //console.log("xx,yy "+xx + " " + yy);

                                        if(map_objects[xx][yy] === AG.B_BLOCK) markerTest = true;
					if(map_objects[xx][yy] === AG.B_MARKER) markerTest = true;
					if(map_objects[xx-1][yy+1] === 0) markerTest = true;
					//if(map_objects[xx-1][yy+1] !== AG.B_BLOCK && map_objects[ xx -1][yy] === AG.B_LADDER) {
                                            //sprite[i].x -= move;
                                            //markerTest = true;
                                        //}

                                        // turn monster
					if (sprite[i].x < 8 || markerTest === true) {
                                                //sprite[i].x = sprite[i].x + move;
						sprite[i].facingRight=true;
					}
				}

                                
				//Only show monsters that are on the screen properly
                                
                                
                                
			}
                        
                        move = 2;
                        
                        //if (sprite[i].move === 0) sprite[i].node = -1;

                        if (sprite[i].move !== 0) {
                            xx = Math.floor((sprite[i].x + 0) / 8);
                            yy = Math.floor((sprite[i].y + 0) / 8) ;
        	    	    if (yy + 1 >= level_h) continue;
                            if (xx  >= level_w) continue;
                            //console.log(" ----- here ----- " + JSON.stringify(sprite[i]));
                            if (sprite[i].move === AG.LEFT && (  
                                    map_objects[xx][yy +1] === AG.B_BLOCK ||map_objects[xx][yy+2 ] === AG.B_BLOCK ||
                                    map_objects[xx][yy+1 ] === AG.B_LADDER  || map_objects[xx -1][yy + 1] === AG.B_BLOCK) 
                                    ) {
                                if (  sprite[i].x > (sprite[i].barrierx ) * 8 ) {
                                    //console.log("move left");
                                    sprite[i].x -= move;
                                }
                                else {
                                    //console.log("barrier x -- left");
                                    shiftSpriteDirections(i);
                                }
                                
                                sprite[i].facingRight = false;
                            }
                            if (sprite[i].move === AG.RIGHT && ( 
                                    map_objects[xx][yy +1] === AG.B_BLOCK ||map_objects[xx][yy+2 ] === AG.B_BLOCK ||
                                    map_objects[xx][yy+1 ] === AG.B_LADDER || map_objects[xx + 1][yy + 1] === AG.B_BLOCK ) 
                                    ) {
                                //console.log("right?");
                                if (  sprite[i].x < (sprite[i].barrierx + 0) * 8) {
                                    //console.log("move right");
                                    sprite[i].x += move;
                                }
                                else {
                                    //console.log("barrier x -- right");
                                    shiftSpriteDirections(i);

                                }
                                sprite[i].facingRight = true;

                            }
                            if (sprite[i].move === AG.UP &&  yy + 3 < level_h && (  // map_objects[xx][yy] === AG.B_SPACE   ||
                                    map_objects[xx][yy+1] === AG.B_BLOCK ||  map_objects[xx][yy+2] === AG.B_BLOCK ||  
                                    map_objects[xx][yy] === AG.B_LADDER   || map_objects[xx ][yy+1] === AG.B_LADDER  || true
                                    //map_objects[xx][yy+2] === AG.B_LADDER //|| map_objects[xx][yy+3] === AG.B_LADDER
                                    )) {
                                if (   sprite[i].y > sprite[i].barriery * 8  ) {
                                    //console.log("up ladder! "+ sprite[i].y + " " + sprite[i].barriery * 8 );
                                    sprite[i].y -= move;
                                    is_up_down = true;
                                    
                                }
                                else {
                                    shiftSpriteDirections(i);

                                }

                            }
                            if (sprite[i].move === AG.DOWN  && ( map_objects[xx][yy+1] !== AG.B_BLOCK || 
                                    map_objects[xx][yy] === AG.B_LADDER ||map_objects[xx][yy+1 ] === AG.B_LADDER 
                                    || map_objects[xx][yy+1 ] === AG.B_SPACE  )) {
                                if (  sprite[i].y < sprite[i].barriery * 8 ) {
                                    sprite[i].y += move;
                                    //console.log("down:");
                                    is_up_down = true;
                                }
                                else {
                                    shiftSpriteDirections(i);

                                }

                            }
                        }
                        
                        if (yy + 1 >= level_h) continue;
                        if (xx  >= level_w) continue;
                        
                        ////// like gravity for monsters ////////
                        if ( yy + 2 < level_h &&  (sprite[i].move !==  AG.UP || sprite[i].move === AG.DOWN) && false && // sprite[i].move !==  AG.RIGHT && sprite[i].move !==  AG.LEFT &&  
                                map_objects[xx][yy+1] !== AG.B_BLOCK 
                                && map_objects[xx][yy] !== AG.B_LADDER 
                                && map_objects[xx][yy+1] !== AG.B_LADDER
                                && map_objects[xx][yy+2] !== AG.B_LADDER
                                ) {
                            
                            if (   sprite[i].y < level_h * 8) {
                                is_up_down = true;
                                //console.log("also down:");
                                sprite[i].y += move;
                            }

                        }
                        else {
                            shiftSpriteDirections(i);
                        }
                        
                        ////// change image of monster when hanging /////
                        if (yy + 2 < level_h && map_objects[xx][yy+1] === AG.B_SPACE 
                                && map_objects[xx][yy+2] === AG.B_SPACE) {
                            is_up_down = true;
                        }
                
                        //default is to show monster
                        visibility = show;
                        //hide monster if...
                        if(sprite[i].x > scrollx + 32 * 8 + length ) {
                                visibility = hide;
                        }
                        if (sprite[i].x < scrollx - length) {
                                visibility = hide;
                        }
                        if (sprite[i].y > scrolly + 24 * 8 + 0){// length) {
                                visibility = hide;
                        }
                        if ( sprite[i].y < scrolly  - length) {
                                visibility = hide;
                        }
                
			//swap monsters
			if (is_up_down) anim_speed = 1; // helicopter speed!!
			sprite[i].animate ++;
			if (sprite[i].animate > anim_speed * 4) sprite[i].animate=0;
			if (sprite[i].animate > anim_speed * 2) z = 1;
			else z = 0;

			
			if(sprite[i].visible === true && visibility === show) {
				
                                if (is_up_down === true) {
                                    moveSpriteToLadder(i);
                                    
                                    //drawSprite_16(monster_u, sprite[i].x, sprite[i].y, 
                                    //		scrollx, scrolly, PAINT_TRANSPARENT, 0);
                                    
                                    
                                    if(z === 0) {
                                        //(R.drawable.monster_r0);
                                        drawSprite_16(monster_ud1, sprite[i].x, sprite[i].y,
                                                      scrollx, scrolly, PAINT_TRANSPARENT, 0);

                                    }
                                    else if (z === 1) {
                                        //(R.drawable.monster_r1);
                                        drawSprite_16(monster_ud2, sprite[i].x, sprite[i].y,
                                                      scrollx, scrolly, PAINT_TRANSPARENT, 0);
                                    }
                                    
                                    
                                }
                                
                                else if(sprite[i].facingRight === true) {
                                        moveSpriteToBox(i);
					if(z === 0) {
						//(R.drawable.monster_r0);
						drawSprite_16(monster_a, sprite[i].x, sprite[i].y, 
							scrollx, scrolly, PAINT_TRANSPARENT, 0);

					}
					else if (z === 1) {
						//(R.drawable.monster_r1);
						drawSprite_16(monster_b, sprite[i].x, sprite[i].y, 
							scrollx, scrolly, PAINT_TRANSPARENT, 0);
					}
				}
				else if (!sprite[i].facingRight === true) {
                                        moveSpriteToBox(i);
					if(z === 0) {
						//(R.drawable.monster_l0);
						drawSprite_16(monster_c, sprite[i].x, sprite[i].y, 
							scrollx, scrolly, PAINT_TRANSPARENT, 0);
					}
					else if (z === 1) {
						//(R.drawable.monster_l1);
						drawSprite_16(monster_d, sprite[i].x, sprite[i].y, 
							scrollx, scrolly, PAINT_TRANSPARENT, 0);
					}
				}
	    		
			}

		}

	}
	return;
	
	
}

function shiftSpriteDirections( num ) {
    //console.log("<----- shift sprite directions " + num + " " + sprite[num].directions.length);
    //sprite[num].node = -1;
    //sprite[num].move = 0;
    return;
    
    
    if (typeof sprite[num] !== "undefined" && sprite[num].move !== 0) {
        if (sprite[num].directions.length > 0) {
            ///////////////
            var edge2 = sprite[num].directions.shift();
            //sprite[num].move = 0;
            //describe.move = 0;
            if (sprite[num].barrierx === edge2.x1) {
                if ((sprite[num].y ) > edge2.y1 * 8) {
                    sprite[num].move = AG.UP;
                    sprite[num].barrierx = edge2.x1;
                    sprite[num].barriery = edge2.y1;
                    //describe.move = AG.UP;
                }
                else if ((sprite[num].y ) < edge2.y1 * 8) {
                    sprite[num].move = AG.DOWN;
                    sprite[num].barrierx = edge2.x1;
                    sprite[num].barriery = edge2.y1;
                    //describe.move = AG.DOWN;
                }
            }
            else if (sprite[num].barriery === edge2.y1) {
                if ((sprite[num].x ) > edge2.x1 * 8) {
                    sprite[num].move = AG.LEFT;
                    sprite[num].barrierx = edge2.x1;
                    sprite[num].barriery = edge2.y1;
                    //describe.move = AG.LEFT;
                }
                else if ((sprite[num].x ) < edge2.x1 * 8) {
                    sprite[num].move = AG.RIGHT;
                    sprite[num].barrierx = edge2.x1;
                    sprite[num].barriery = edge2.y1;
                    //describe.move = AG.RIGHT;
                }
            }
            else {
                //sprite[num].move = 0;// AG.RIGHT;
                //sprite[num].barrierx = 0;//edge2.x1;
                //sprite[num].barriery = 0;//edge2.y1;
                //sprite[num].node = -1;
            }
            ///////////////
            
            
        }
        //else sprite[num].node = -1;
        
    }
    
    
}

/* only call this during monster up/down movements */
function moveSpriteToLadder(index) {
    var move = 2;
    if (sprite[index].type === "monster" ) {
        var xx = sprite[index].x % 8;
        var x = Math.floor(sprite[index].x / 8);
        var y = Math.floor(sprite[index].y / 8);
        
        if (xx > 3 && map_objects[x][y ] === AG.B_LADDER && 
                (sprite[index].move === AG.UP || sprite[index].move === AG.DOWN)) {
            sprite[index].x -= move;
        }
    }
}

function moveSpriteToBox(index) {
    var move = 2;
    if (sprite[index].type === "monster" ) {
        var yy = sprite[index].y % 8;
        var x = Math.floor(sprite[index].x / 8);
        var y = Math.floor(sprite[index].y / 8);
        
        if (yy > 3 && map_objects[x][y ] === AG.B_SPACE && 
                (sprite[index].move === AG.LEFT || sprite[index].move === AG.RIGHT)) {
            sprite[index].y -= move;
        }
    }
}

/**
 *	Used to draw moving platforms on screen
 */
function drawMovingPlatform() {
	var i;
  var x,y;
  var width = 5;
  var cheat = 0;// - 5
  var markerTest = false;
  var hide = true;
  var show = false;
  var visibility = false;
  var x_right, x_left, y_right, y_left;
    
  if(platform_num === -1 || platform_num > sprite_num) return;
    
  for (i = platform_offset ; i < platform_num ; i++) {
    markerTest = false; 
        //console.log("i: "+ i);
        
        if (i >= sprite_num || i >= sprite.length || i < 0 || sprite[i].type !== "platform") continue;
      //x = sprite[i].x / 8;
      y = Math.floor(sprite[i].y / 8);
      /* Must move and stop platforms when they hit bricks or
       * markers or the end of the screen/room/level.
       */
      if(sprite[i].facingRight === true) {
        sprite[i].x ++;
        x = Math.floor(sprite[i].x / 8);
        markerTest = false; 
        // marker test
        y_right = y;
        x_right = x + width + cheat ;
        if (x_right >= level_w) x_right = level_w - 1;
        
        if(map_objects[x_right][y_right] === AG.B_BLOCK) markerTest = true;
        if(map_objects[x_right][y_right] === AG.B_MARKER) markerTest = true;

        // turn platform
        if (sprite[i].x > level_w   * 8   - AG.PLATFORM_WIDTH || markerTest == true) {
          sprite[i].facingRight = false;
        }
      }
      else {
        sprite[i].x --;
        x = Math.floor(sprite[i].x / 8);
        markerTest = false; 
        // marker test
        y_left = y;
        x_left = x + cheat ;
        if (x_left < 0) x_left = 0;

        if(map_objects[x_left][y_left ] === AG.B_BLOCK) markerTest = true;
        if(map_objects[x_left][y_left ] === AG.B_MARKER) markerTest = true;

        // turn platform
        if (sprite[i].x <= 0 || markerTest === true) {
          sprite[i].facingRight = true;
        }
      } 
    
      visibility = show;
      //hide platform
      if(sprite[i].x > scrollx + 32 * 8 + (8 * width) ) {
        visibility = hide;
      }
      if (sprite[i].x < scrollx - (8 * width)) {
        visibility = hide;
      }
      //hide platform
      if(sprite[i].y > scrolly + 24 * 8 + (8 * width)) {
        visibility = hide;
      }
      if ( sprite[i].y < scrolly - (8 * width)) {
        visibility = hide;
      }
    
      if(visibility === show) {
      		drawSprite_40_8(platform_a, sprite[i].x, sprite[i].y, scrollx, scrolly, PAINT_TRANSPARENT, 0);
	  }
    
  }

  return;
}

/**
 *	Used to detect collision with monsters
 */
function collisionWithMonsters() {

	var i;
	//var index_num = 0;
	
	//if (sprite_num > monster_num) index_num = sprite_num;
	//else index_num = monster_num;
	
	
		  var guyBox = makeSpriteBox( guy , 0, 0 );

		  //console.log("monster " + monster_offset + " " + monster_num + " " + sprite_num);
		  for (i = monster_offset  ; i < monster_num ; i++) {   
		    var monsterBox = makeSpriteBox(sprite[i] , 0, 0 );
		    var test =  collisionSimple(guyBox, monsterBox);
		    if (test && sprite[i].active   === true) {
		    
		      if (guyBox.bottom  < monsterBox.bottom ) {
		    	//mGameV.getSprite(i).setActive(false);
		    	//mPanel.inactivateMonster(i );
		    	//sprite[i].active = false;
		    	score = score + 10;
		    	
		    	if (preferences_collision === true) {
		    		inactivateMonsterView(i);
		    		inactivateMonster(i);
		    	}

				setSoundBoom();
		        
		        
		      }
		      else {
				endlevel = true;
                                is_end_level = true;
                                is_game_death = true;
                                level --;
                                if (lives === 1) { // soon will be lowered to zero!!
                                    is_game_running = false;
                                    play_again = false;
                                }
                                
				if (preferences_collision === true) inactivateMonster(i);
		    	//level.endLevel = true;
                                lives --;
				//mSounds.playSound(SoundPoolManager.SOUND_OW);
				setSoundOw();
		      }
		    }
		  }

}

/**
 *  Used to detect collision with keys.
 */

function collisionWithObjects( j,  i,  num) {
    //if (!keysonlevel) return;

    keySprite.x = j * 8;
    keySprite.y = i * 8;
    keySprite.leftBB = 0;
    keySprite.rightBB = 8;
    keySprite.topBB = 0;
    keySprite.bottomBB = 8;

    var guyBox = makeSpriteBox( guy , 0, 0 );
    var keyBox = makeSpriteBox( keySprite , 0, 0 );
    if (num === AG.B_KEY) {
        var test = collisionSimple(guyBox,keyBox);
        if (test === true ) {
            exitblocked = false;
            setObjectsDisplay(j,i,0);
            setSoundPrize();
        }
    }
    if (num === AG.B_GOAL || num === AG.B_INITIAL_GOAL) {
        var test = collisionSimple(guyBox,keyBox);
        if (test === true && !exitblocked) {
            //
            setObjectsDisplay(j,i,AG.B_GOAL);
        }
    }
    

}

function checkBottom() {
    var numx = Math.floor((guy.x )/ 8);
    var numy = Math.floor((guy.y + guy.bottomBB)/ 8);
    if(numy >= level_h) numy = level_h -1;
    if(numx >= level_w) numx = level_w -1;
    
    var num = map_objects[numx][numy];
    var vis = map_level[numx][numy];
    
    if (num === AG.B_SPACE && vis === AG.B_SPACE && numy >= level_h -1 ) {
        // guy dies at bottom of map.
        //console.log("hit bottom");
        endlevel = true;
        is_end_level = true;
        is_game_death = true;
        level --;
        if (lives === 1) { // soon will be lowered to zero!!
            is_game_running = false;
            play_again = false;
        }

        lives --;
        
        setSoundOw();
    }
}


/**
 *	Used to set animation vars in JNI code.
 */
function animate_vars() {

	var ANIMATE_SPEED = 3;
	
	animate_var ++;
	if (true) {

		if (animate_var >= ANIMATE_SPEED) {
			newGuy ++;
			newBG ++;
			animate_var = 0;
		}
		if(newGuy > 3) newGuy = -1;
		if(newBG > 7) newBG = -1;
		
	}
        guy.animate = newGuy;
	//LOGE("animate %d -- %d", newGuy, newBG);
}


/**
 *	Used to draw all the components of the level on the screen.
 *
 *	@param	unused	formerly a number used to decide which version of the tileset
 *							is used, providing animated appearance of rings
 */
function drawLevel( unused) {
    
    var i,j,k,l;
    var xx = 0;
    var baseX, baseY;//, startX, startY;
    var mapcheat = 1;
    var levelcheat = 1;
    //var square[TILE_HEIGHT][TILE_WIDTH];
    
    //var  screen = (getScreenPointer(0));
    
    //animate = animate_level;
    animate = newBG + 1;
    
    /* clear screen */
    var c = document.getElementById("my_canvas");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.rect(0,0,AG.SCREEN_WIDTH, AG.SCREEN_HEIGHT);
    ctx.fillStyle = "black";
    ctx.fill();
    
    /* draw background */
    baseX = Math.floor(scrollx / AG.TILE_WIDTH);
    baseY = Math.floor(scrolly / AG.TILE_HEIGHT);
    
	for ( j = baseX - 1; j <  baseX + tilesWidthMeasurement + 3; j++) { //32
    	for ( i = baseY - 1 ; i < baseY + tilesHeightMeasurement + 3; i ++ ) { //24
    		
    		
    		if (i >= 0 && j >= 0  && i < AG.MAP_HEIGHT && j < AG.MAP_WIDTH) { 
    			if(  map_level[j][i] !== 0 ) { //is tile blank??
    				var square = cutTile("tiles1", square, map_level[j][i] - levelcheat);
    				drawTile_8(square, j * AG.TILE_WIDTH, i * AG.TILE_HEIGHT , 
    					scrollx , scrolly, PAINT_SOLID, 0);
			}
			
				// special animated tiles
				k = map_objects[j][i];
				if ( k !== AG.B_START && k !== AG.B_MONSTER && k !== AG.B_DEATH
    				&& k !== AG.B_PLATFORM && k !== AG.B_MARKER && k !== AG.B_BLOCK
    				&& k !== AG.B_LADDER  && k !== AG.B_SPACE) {

                    collisionWithObjects(j,i,k);

                    xx = k;
                    if (k === AG.B_INITIAL_GOAL && !exitblocked) {
                        //xx = AG.B_INITIAL_GOAL;
                        xx = AG.B_GOAL;
                    }
                    if (k === AG.B_GOAL) {
                        xx = AG.B_GOAL;
                    }

                    if (animate === 0 || animate === 1 || animate === 8) {

    		    		var square = cutTile("tiles1", square, xx - mapcheat);
    				}
    				else if (animate === 2 || animate === 4 || animate === 6) {

    		    		var square = cutTile("tiles2", square, xx - mapcheat);
    				}
    				else if (animate === 3 || animate === 7) {

    		    		var square = cutTile("tiles3", square, xx - mapcheat);
    				}
    				else if (animate === 5 || true) {

    		    		var square = cutTile("tiles4", square, xx - mapcheat);
    				}

                    drawTile_8(square, j * AG.TILE_WIDTH, i * AG.TILE_HEIGHT ,
    					scrollx , scrolly, PAINT_TRANSPARENT, number_alpha);
    			
    			}
			}
			
    	}
    }
    
    /* draw moving platform */
    drawMovingPlatform();
    
    /* draw score and level */
    drawScoreWords();
    
    /* draw monsters */
    if (preferences_monsters === true) {
        drawMonsters();
    }
    
    if (preferences_monsters === true && preferences_collision === true && animate_only === false) {
        collisionWithMonsters();
    }
    
    checkBottom();

    /* draw guy with animation */
    if (guy.animate === 0) {
	    drawSprite_16(guy_a, guy.x, guy.y, scrollx, scrolly, PAINT_TRANSPARENT, 0);
	}
	else if (guy.animate === 1) {
	    drawSprite_16(guy_b, guy.x, guy.y, scrollx, scrolly, PAINT_TRANSPARENT, 0);
	}
	else if (guy.animate === 2) {
	    drawSprite_16(guy_c, guy.x, guy.y, scrollx, scrolly, PAINT_TRANSPARENT, 0);	
	}
	else { // if (guy.animate == 3) {
	    drawSprite_16(guy_d, guy.x, guy.y, scrollx, scrolly, PAINT_TRANSPARENT, 0);	
	}

	//LOGE("level_w / h %d -- %d", level_w, level_h);
}

/**
 * test out this pointer returning function
 */
 
function getScreenPointer( screen_enum) {
	//return (var **)screen;
	//return  (var **)screen;
        //
        var screen1 = (document.getElementById("my_canvas")).getContext("2d");
        //var screen = ($("#my_canvas")).getContext("2d");
        //alert(screen)
        return screen1;
        /*
	///////////////////////////
	var local_index = 0;
	if (screen_enum == MY_SCREEN_FRONT) {
		local_index = screencounter;
	}
	else if (screen_enum == MY_SCREEN_BACK) {
		local_index = (screencounter + 1) &1;
	}
	//////////////////////////
	if (local_index) {
		return (var **) screen_0;
	}
	else {
		return (var **) screen_1;
	}
        */
}

function getScreenImageData() {
    var ctx = getScreenPointer(0);
    var image = ctx.getImageData(0,0,AG.SCREEN_WIDTH,AG.SCREEN_HEIGHT);
    return image;
}

function incrementScreenCounter() {
	screencounter = (screencounter + 1)& 1;
	//LOGE("screencounter %d",screencounter);
}


function initLevel( ) {
		var i,j;
		var num = 0;

		
		clearSpriteList();
		//mGameV.setSpriteStart();
                
                monster_offset = sprite_num ;
                //monster_num = 0;
                platform_num = -1;
                platform_offset = 0;
		
		//mGameV.setMonsterOffset(1);
		//mGameV.setMonsterNum(0);
		//mGameV.setPlatformNum(-1);
		//mGameV.setPlatformOffset(0);
                
                
		//find starting guy position
		for(i = 0; i< level_h ; i ++) { //y
			for (j = 0; j <  level_w ; j ++) { //x
				if( map_objects[j][ i] === AG.B_START ) { //32,64

                                        sprite[0].x = j * 8;
                                        sprite[0].y = i * 8;
                                        guy.x = j * 8;
                                        guy.y = i * 8;
                                        
					//mGameV.getSprite(0).setMapPosX(j*8);
					//mGameV.getSprite(0).setMapPosY(i*8);

				}
				//add monster here
				if(map_objects[j][i] === AG.B_MONSTER ) { //32,64
					if (AG.MONSTER_TOTAL >= num) {
                                                /*
						//put monster object in ArrayList here...
						//temp = new SpriteInfo(R.drawable.monster_l0, 3, 8, 0, 16);
                                                var i = addSprite(j*8,i*8,0,16,3,8);
                                                sprite[i].active = true;
                                                sprite[i].visible = true;
                                                sprite[i].facingRight = true;
                                                
						//temp.setMapPosX(j * 8);
						//temp.setMapPosY(i * 8);
						//temp.setActive(true);
						//temp.setVisible(true);
						//temp.setFacingRight(true);
						//temp.setResourceId(R.drawable.monster_l0);
						//mGameV.addSprite(temp);
						     
						num ++;
                                                monster_num = num;
                                                */
                                                num ++;
						//mGameV.setMonsterNum(num);
                                                addMonster(j*8, i * 8, 0);
					}
				}


			}
		}
		
                
		//mGameV.setPlatformOffset(num );
                platform_offset = num -1;
		
		for(i = 0; i< level_h ; i ++) { //y
			for (j = 0; j <  level_w ; j ++) { //x
				if( map_objects[j][i] === AG.B_PLATFORM ) { //32,64
					if(AG.PLATFORM_TOTAL > num - platform_offset) {
						//put platform object in ArrayList here...
                                                /*
                                                var i = addSprite(j*8,i*8,0,40,0,8);
                                                sprite[i].active = true;
                                                sprite[i].visible = true;
                                                sprite[i].facingRight = true;
                                                
						//SpriteInfo temp = new SpriteInfo(R.drawable.concrete, 0, 8, 0, 40);
						//temp.setMapPosX(j * 8);
						//temp.setMapPosY(i * 8);
						//temp.setActive(true);
						//temp.setVisible(true);
						//temp.setFacingRight(true);
	
						//mGameV.addSprite(temp);
						     
						num ++;
                                                platform_num = num;
                                                */
                                                num ++;
                                               
                                                addPlatform(j * 8, i * 8);
						//mGameV.setPlatformNum(num);
					}
				}
				
			}
		}
		
		this.setStartingScrollPosition();
				
	

}

function setStartingScrollPosition() {
		//set starting scroll position
		
		var i,j;
		
		//mMovementV.setScrollX(0);
		//mMovementV.setScrollY(0);
                scrollx = 0;
                scrolly = 0;

		var flag = false;

		i = guy.x;//mGameV.getSprite(0).getMapPosX(); 
		j = guy.y;//mGameV.getSprite(0).getMapPosY();

		//scroll screen to starting location of guy...
		while(i >  ( AG.SCREEN_TILES_H /2 )* 8 && flag === false) {

			if ( scrollx + (( AG.SCREEN_TILES_H  ) * 8) <  level_w  * 8) {
				//mMovementV.incrementScrollX(8);
                                scrollx += 8;
				i = i - 8; // X
			}
			else flag = true;

		}
		flag = false;
		while( j >  (AG.SCREEN_TILES_V /2) * 8 && flag === false) {


			if ( scrolly  + ((AG.SCREEN_TILES_V  ) * 8) <  level_h  * 8) {
				//mMovementV.incrementScrollY(8);
                                scrolly += 8;
				j = j - 8; // Y
			}
			else flag = true;
		}
                
            //console.log(scrollx + " " + scrolly + " w:" + level_w + " h:" + level_h);
	}

function checkValues() {
    var a = map_list[0].visible;
    var len = map_list[0].xdim * map_list[0].ydim;
    /*
    for(i = 0; i < len; i ++) {
        $("#page_footer").append(" "+ a[i]);

    }
    
   for (i = 0; i < 96; i ++) {
       for(j = 0; j < 96; j ++) {
        $("#page_footer").append(" "+ map_level[i][j]);   
       }
   }
   */
}


function setupDrawFunctionsA() {
    
    screen = getScreenPointer(0);
    setGuyData();

    setTileMapData();
    setMonsterData();
    setMovingPlatformData();
    
    clearMapList();
    level = 1;
    //score = 10;
    //lives = 3;
    
}

function setupDrawFunctionsB(){
    // do xml setup here

    $.ajax({
        type: "GET",
        url: "xml/awesomeguy.xml",
        dataType: "xml",
        timeout: 0,
        //async: true,
        //context: document,
        //success:
        success: function(xml){
            //console.log("look for xml");
            var level_in = 1;
            for(level_in = 1; level_in <=10; level_in ++) {
                
                $(xml).find('game level[number="'+ level_in +'"]').each(function(){
                    //var a, b, dim_horizontal, dim_vertical;
                    //console.log("xml found");
                    var dim_horizontal = parseInt( $(this).find('horizontal').text());
                    var dim_vertical = parseInt($(this).find('vertical').text());
                    level_h = dim_vertical;
                    level_w = dim_horizontal;
                    var tiles_level = ($(this).find('tiles_level').text()).replace(" ",""); // a
                    var tiles_objects = ($(this).find('tiles_objects').text()).replace(" ",""); // b
                    var a = tiles_level.split(",");
                    var b = tiles_objects.split(",");
                    map_list[level_in - 1 ].xdim = dim_horizontal;
                    map_list[level_in - 1 ].ydim = dim_vertical;
                    map_list[level_in - 1 ].hidden = b;
                    map_list[level_in - 1 ].visible = a;

                    
                });
            }         
            level = 0;
            preferences_collision = true;
            
            testDrawLoop();
        },
        error: function() {
            console.log("An error occurred while processing XML file.");
        }
    });
}
////////////////////////////////////////
// Java interfaces here
////////////////////////////////////////
