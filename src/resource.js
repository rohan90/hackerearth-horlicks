var res = {
    hello_bg : "res/hello_bg2.png",
    start_n : "res/start.png",
    start_s : "res/start.png",
    help_s : "res/help.png",
    highscores_s : "res/highscores.png",
    gameover_s : "res/gameover.png",
    post_score_s : "res/post_score.png",
    cow1 : "res/cow_1.png",
    s_projectile:"res/horlicks_bottle.png"
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
    res.cow1
];
for (var i in res) {
    g_resources.push(res[i]);
}
