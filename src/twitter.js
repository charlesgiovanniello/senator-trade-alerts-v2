const {TwitterApi} = require('twitter-api-v2');

const twitterClient = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});


const sendTweet = async (tweet) => {
    // First, post all your images to Twitter
    const mediaIds = await Promise.all([
    // file path
    twitterClient.v1.uploadMedia('./download/images/pngtemp.1.png'),
    ]);
    // mediaIds is a string[], can be given to .tweet
    await twitterClient.v1.tweet(tweet, { media_ids: mediaIds });
}

module.exports={
    sendTweet
}