/*global define*/

define(function(){
    'use strict';

    var tweets = [
        'If I ever become a dad my thing is gonna be sayin "spoiler alert" to my kid and then pointing at cars w/ spoilers. Thats gonna be my dadphrase.',
        'I want to apologize to the person who followed me at 2:21am and unfollowed me by 6:45am. It was a wild ride, and I will miss you.',
        'Besides tweeting during this job interview, what would you say is your biggest weakness?',
        'Whoever named the seesaw probably didn\'t get another chance to name stuff.',
        'The reason we’re moving is because it’s haunted. We probably wouldn’t mind a normal ghost but this guy died while quoting Borat was popular.',
        'My fake ID\'s finally ready. Can\'t wait to order off the kids menu!!',
        'Just bought a sandwich at the airport so gonna have to put off buying a house for a while.',

        '<script>alert(\'Malicious script. You\'ve been had.);</script>',

    ];

    function getRandomTweet() {
        var random = (Math.random()*100) % tweets.length;
        return tweets[Math.floor(random)];
    }

    return {
        getRandom: getRandomTweet,
    };
});
