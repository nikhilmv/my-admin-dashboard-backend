const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const axios = require('axios');


exports.getYoutubeDetail = asyncErrorHandler(async (req, res, next) => {
    
    // const product = await Product.findById(req.params.id);
    // if (!product) { 
    //     res.status(404).json({
    //         success: false,
    //         message: "Product Not Found", 
    //     });
    // }

    const youtubedl = require('youtube-dl-exec')

    const videoUrl = req.body.videoUrl;
    if (!videoUrl) {
        return res.status(400).json({
            success: false,
            message: "Video URL is required",
        });
    }
    const options = {
        dumpSingleJson: true,
        noWarnings: true,
        preferFreeFormats: true,
        noCheckCertificates: true,
    };
    const result = await youtubedl(videoUrl, options)
        .then(output => {
            return output;
        })
        .catch(error => {
            console.error('Error fetching video details:', error);
            throw new Error('Failed to fetch video details');
        });
 
    if (!result || !result.title) {
        return res.status(404).json({
            success: false,
            message: "Video details not found",
        });
    }
    // Assuming result contains the video details
    // You can structure the response as needed


    res.status(200).json({
        success: true,
        data: result,

    });
});


exports.getInstaDetail = asyncErrorHandler(async (req, res, next) => {
    const link = req.body.link;

      // Extract shortcode from URL
  const path = new URL(link).pathname;
  const segments = path.split('/').filter(Boolean);
  const identifier = segments[1]; // assuming /reel/{shortcode}/
  const shortcode = identifier;


   // Setup headers
   const headers = {
    'authority': 'www.instagram.com',
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'content-type': 'application/x-www-form-urlencoded',
    'dpr': '1.25',
    'origin': 'https://www.instagram.com',
    'referer': 'https://www.instagram.com/reel/',
    'sec-ch-prefers-color-scheme': 'light',
    'sec-ch-ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
    'sec-ch-ua-full-version-list': '"Not A(Brand";v="99.0.0.0", "Google Chrome";v="121.0.6167.85", "Chromium";v="121.0.6167.85"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-model': '""',
    'sec-ch-ua-platform': '"Windows"',
    'sec-ch-ua-platform-version': '"15.0.0"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'viewport-width': '1536',
    'x-asbd-id': '129477',
    'x-csrftoken': 't3e1g4dNDh7FgFWsG7Mk_b',
    'x-fb-friendly-name': 'PolarisPostActionLoadPostQueryQuery',
    'x-fb-lsd': 'AVprzzL2A3o',
    'x-ig-app-id': '936619743392459',
    'accept-encoding': 'identity',
    'cookie': 'YOUR COOKIE HERE'
  };

  // POST data payload
  const payload = new URLSearchParams({
    av: '0',
    __d: 'www',
    __user: '0',
    __a: '1',
    __req: '2',
    __hs: '19750.HYP:instagram_web_pkg.2.1..0.0',
    dpr: '1',
    __ccg: 'UNKNOWN',
    __rev: '1011069798',
    __s: 'ux76qb:pubtm3:c9o7p1',
    __hsi: '7329082171152797718',
    __dyn: '7xeUjG1mxu1syUbFp60DU98nwgU29zEdEc8co2qwJw5ux609vCwjE1xoswIwuo2awlU-cw5Mx62G3i1ywOwv89k2C1Fwc60AEC7U2czXwae4UaEW2G1NwwwNwKwHw8Xxm16wUwtEvw4JwJCwLyES1Twoob82ZwrUdUbGwmk1xwmo6O1FwlE6PhA6bxy4UjK5V8',
    __csr: 'gtneJ9lGF4HlRX-VHjmiWppWF4qDKKh7G8KUCgwDy8gDzVoO4emqFeLrW8EKFEhJ5zGmiiiUFpRum8zeQXx3y9pnCAgyiGHG6pbyoiwCKEsxx004LRG440qh00Nmw1jC0S8364i0bvw1aGt2p61rxK0a3CDgCl0c-0hW4Zw9y00FPE',
    __comet_req: '7',
    lsd: 'AVprzzL2A3o',
    jazoest: '2974',
    __spin_r: '1011069798',
    __spin_b: 'trunk',
    __spin_t: '1706434919',
    fb_api_caller_class: 'RelayModern',
    fb_api_req_friendly_name: 'PolarisPostActionLoadPostQueryQuery',
    variables: JSON.stringify({
      shortcode,
      fetch_comment_count: 40,
      fetch_related_profile_media_count: 3,
      parent_comment_count: 24,
      child_comment_count: 3,
      fetch_like_count: 10,
      fetch_tagged_user_count: null,
      fetch_preview_comment_count: 2,
      has_threaded_comments: true,
      hoisted_comment_id: null,
      hoisted_reply_id: null
    }),
    server_timestamps: 'true',
    doc_id: '10015901848480474'
  });

  try {
    const response = await axios.post('https://www.instagram.com/api/graphql', payload, {
      headers,
      // Optional proxy settings:
      // proxy: {
      //   host: 'PROXY_IP',
      //   port: PROXY_PORT,
      //   auth: {
      //     username: 'PROXY_USER',
      //     password: 'PROXY_PASS'
      //   }
      // }
    });

    const data = response.data;
    const media = data.data.xdt_shortcode_media;

    res.json({
      download_url: media.video_url,
      thumbnail_src: media.thumbnail_src,
      title: media.edge_media_to_caption.edges[0]?.node?.text || '',
      code: media.shortcode
    });

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch data from Instagram',
      details: error.message
    });
  }
 

});



exports.getfacebookDetail = asyncErrorHandler(async (req, res, next) => {
    
    // const youtubedl = require('youtube-dl-exec')
    const youtubedl = require('yt-dlp-exec');

    const videoUrl = req.body.videoUrl;
    
    const options = {
        dumpSingleJson: true,
        noWarnings: true,
        preferFreeFormats: true,
        noCheckCertificates: true,
        noCallHome: true,
        addHeader: [
            "user-agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "accept-language: en-US,en;q=0.9",
            "sec-fetch-mode: navigate",
            "sec-fetch-site: none"
          ],
  
    };
    
    const result = await youtubedl(videoUrl, options)
    
    .then(output => {
        return output;
    })
    .catch(error => {
        console.error('Error fetching video details:', error);
        throw new Error('Failed to fetch video details');
    });  

    const formats = result?.formats || [];
 
        // Try to find HD format, otherwise fallback to SD
        const preferredFormat = formats.find(f => f.format_id === "hd") 
                            || formats.find(f => f.format_id === "sd");

        const ress = [];

        if (preferredFormat) {
        ress.push({ 
            thumbnail: result.thumbnail,
            title: result.title,
            id: result.id,
            url: preferredFormat.url
        });
        } else {
        console.log("No HD or SD format available.");
        } 

    res.status(200).json({
        success: true,
        data: ress,

    });
});
