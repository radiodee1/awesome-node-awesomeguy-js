

var settings = 0;
function flip_settings() {
    if (settings === 0) {
        show_settings();
        settings = 1;
    }
    else if (settings === 1) {
        hide_settings();
        settings = 0;
    }
}
function show_settings() {
    $("#page_settings").show();
    //$("#page_readme").show()
}
function hide_settings() {
    $("#page_settings").hide();
    //$("#page_readme").hide()
}
function change_level() {
    var obj = document.getElementById("level_select");
    level = obj.selectedIndex - 1;
    if (level === -1) level = 0;
}

function restart_game() {
    clearInterval(loop_handle);

    change_level();
    //var obj = document.getElementById("level_select");
    //level = obj.selectedIndex - 1;
    //if (level === -1) level = 0;
    
    play_again = true;
    is_end_level = true;
    lives = 3;
    score = 10;
    is_game_running = true;
    
    
    var obj2 = document.getElementById("collision_checkbox");
    preferences_collision = obj2.checked;
    click_large();
    click_small();
    click_sound();
    click_graph();
    
    
    testDrawLoop();
    
    //console.log (level + " " + preferences_collision + " " + obj2.checked);
}
function click_sound() {
    var obj = document.getElementById("sound_checkbox");
    preferences_sound = obj.checked;
}
function click_monsters() {
    var obj2 = document.getElementById("collision_checkbox");
    preferences_collision = obj2.checked;
}
function click_graph() {
    var obj2 = document.getElementById("graph_checkbox");
    preferences_graph_control = obj2.checked;
}

/*
function click_large() {
    var obj = document.getElementById("screen_checkbox");
    preferences_larger_screen = obj.checked;
    if (!preferences_larger_screen) {
        hide_large_screen();
    }
    else {
        //show_large_screen();
        hide_large_screen();
    }
}
function click_small() {
    var obj = document.getElementById("small_screen_checkbox");
    //preferences_larger_screen = obj3.checked;
    if (!obj.checked) {
        hide_small_screen();
    }
    else {
        show_small_screen();
    }
}

function hide_large_screen() {
    $("#my_large_canvas").hide();
    
}
function show_large_screen() {
    $("#my_large_canvas").show();

}
function hide_small_screen() {
    $("#my_canvas").hide();
    
}
function show_small_screen() {
    $("#my_canvas").show();
    
}
*/