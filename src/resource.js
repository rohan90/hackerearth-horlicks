var res = {
    //saveScore: "http://localhost:3000/api/save",
    //fetchScores: "http://localhost:3000/api/scores",
    saveScore: "https://frozen-reaches-9921.herokuapp.com/api/save",
    fetchScores: "https://frozen-reaches-9921.herokuapp.com/api/scores",

    hello_bg : "res/hello_bg2.png",
    start_n : "res/start.png",
    start_s : "res/start.png",
    help_s : "res/help.png",
    highscores_s : "res/highscores.png",
    gameover_s : "res/gameover.png",
    post_score_s : "res/post_score.png",
    s_projectile:"res/horlicks_bottle.png",
    back_big: "res/back_big.png",
    back_small: "res/back_small.png",
    cow1 : "res/cow_1.png",
    cow2 : "res/cow_2.png",
    cow3 : "res/cow_3.png",
    cow4 : "res/cow_4.png",
    cow5 : "res/cow_5.png"
};

var g_resources = [
    //image
    res.hello_bg,
    res.start_n,
    res.start_s,
    res.help_s,
    res.highscores_s,
    res.gameover_s,
    res.post_score_s,
    res.s_projectile,
    res.back_big,
    res.back_small,
    res.cow1,
    res.cow2,
    res.cow3,
    res.cow4,
    res.cow5
];
for (var i in res) {
    g_resources.push(res[i]);
}
