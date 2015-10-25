var res = {
    //saveScore: "http://localhost:3000/api/save",
    //fetchScores: "http://localhost:3000/api/scores",
    saveScore: "https://frozen-reaches-9921.herokuapp.com/api/save",
    fetchScores: "https://frozen-reaches-9921.herokuapp.com/api/scores",

    hello_bg : "res/hello_bg2.png",
    help_bg : "res/help_instructions.png",
    start_n : "res/start.png",
    start_s : "res/start.png",
    help_s : "res/help.png",
    highscores_s : "res/highscores.png",
    gameover_s : "res/gameover.png",
    post_score_s : "res/post_score.png",
    s_projectile:"res/horlicks_bottle.png",
    back_big: "res/back_big.png",
    back_small: "res/back_small.png",
    analyse_small: "res/analyse.png",
    cow1 : "res/cow_1.png",
    cow2 : "res/cow_2.png",
    cow3 : "res/cow_3.png",
    cow4 : "res/cow_4.png",
    cow5 : "res/cow_5.png",
    con1 : "res/cow_1_con.png",
    con2 : "res/cow_2_con.png",
    con3 : "res/cow_3_con.png",
    con4 : "res/cow_4_con.png",
    con5 : "res/cow_5_con.png",

};

var g_resources = [
    //image
    res.hello_bg,
    res.help_bg,
    res.start_n,
    res.start_s,
    res.help_s,
    res.highscores_s,
    res.gameover_s,
    res.post_score_s,
    res.s_projectile,
    res.back_big,
    res.back_small,
    res.analyse_small,
    res.cow1,
    res.cow2,
    res.cow3,
    res.cow4,
    res.cow5,
    res.con1,
    res.con2,
    res.con3,
    res.con4,
    res.con5,

];
for (var i in res) {
    g_resources.push(res[i]);
}
