<!DOCTYPE html>
<html lang="de-DE">
<head>
	<meta charset="utf-8" />
	<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css">
</head>
<body>
<?php 
setlocale(LC_TIME, "de_DE");
$fields="id,name,description,place,timezone,start_time,end_time,cover,ticket";
 
// $json_link = "https://graph.facebook.com/912637648777417/events?fields={$fields}&access_token=CAACEdEose0cBAFWqBeZCWsqiDmpGimCG0mXw7hmm303RbARQln7r3QEwC6idHBCPUc1JfGDoTFwH6yDMkSgPlZBZACrW0Knk6RUrmhwOjtYEoY27vjwk42ZB9bHZAMK5tdoccAGkTNPnDBS1qLsjmS7PTlYZA1EVkvbEL7ZCTbIgHPcf9sq7WznnHpOq38llzyDAKwViT021gZDZD&locale=de_DE";
$json_link = "https://graph.facebook.com/912637648777417/events?fields={$fields}&access_token=CAAOONgaVQfQBABsto2mGKhf3Wu9xBs64xZCu0afTfzo0o6ZC1d11lIig66t1raDXLXqQfYfY9SWMFZBiyrpwXB6pCXEokJYQl2whe5DDpP2Df8FqsqOCZAbI585yuAZCm3p8Y5XItgoZBS0AwkC49wZBlqFayFJg6UnKI41RVuY7mdnNaG8Cmtepf3fa7WCizsZD&locale=de_DE";
 
$json = file_get_contents($json_link);

$obj = json_decode($json, true, 512, JSON_BIGINT_AS_STRING);

// print_r($obj);
 
    // count the number of events
    $event_count = count($obj['data']);


 
    for($x=$event_count; $x>=0; $x--){

// echo "<p>".strftime( '%A, %e. %B, %H:%M Uhr', strtotime($obj['data'][$x]['start_time'])) ." - ". strftime( '%A, %e. %B', time())."</p>";

		if(strtotime($obj['data'][$x]['start_time']) > time()) {
			$start_date = strftime( '%A, %e. %B', strtotime($obj['data'][$x]['start_time']));
			  
			// in my case, I had to subtract 9 hours to sync the time set in facebook
			$start_time = strftime( '%H:%M Uhr', strtotime($obj['data'][$x]['start_time']));
			  
			$pic_big = isset($obj['data'][$x]['cover']['source']) ? $obj['data'][$x]['cover']['source'] : "https://graph.facebook.com/{$fb_page_id}/picture?type=large";
			 
			$eid = $obj['data'][$x]['id'];
			$name = $obj['data'][$x]['name'];
			$description = isset($obj['data'][$x]['description']) ? $obj['data'][$x]['description'] : "";
			 
			// place
			$place_name = isset($obj['data'][$x]['place']['name']) ? $obj['data'][$x]['place']['name'] : "";
			$city = isset($obj['data'][$x]['place']['location']['city']) ? $obj['data'][$x]['place']['location']['city'] : "";
			$country = isset($obj['data'][$x]['place']['location']['country']) ? $obj['data'][$x]['place']['location']['country'] : "";
			$zip = isset($obj['data'][$x]['place']['location']['zip']) ? $obj['data'][$x]['place']['location']['zip'] : "";
			 
			$location="";
			 
			if($place_name && $city && $country && $zip){
			    $location="{$place_name}, {$city}, {$country}";
			    // $location="{$place_name}, {$city}, {$country}, {$zip}";
			} else{
			    $location="&nbsp;";
			}

			echo		"	<article itemscope itemtype='http://schema.org/MusicEvent'>";
			// echo		"		<a target='_blank' class='pic' itemprop='url' href='//facebook.com/events/{$eid}' style='background-image:url({$pic_big});' title='Konzert mit {$name}'>";
			echo		"		<a target='_blank' class='pic' itemprop='url' href='//facebook.com/events/{$eid}' title='Konzert mit {$name}'>";
			echo		"			<h3 itemprop='name'>{$name}</h3>";
			echo		"			<address itemprop='location' itemscope itemtype='http://schema.org/PostalAddress'>";
			echo		"				<p itemprop='streetAddress'>{$location}</p>";
			echo		"			</address>";
			echo		"		</a>";

			echo		"		<meta itemprop='startDate' content='".strftime( '%Y-%m-%dT%H:%M', strtotime($obj['data'][$x]['start_time']))."'>";
			echo 		"		<time><p class='date'><big>".strftime( '%e', strtotime($obj['data'][$x]['start_time'])).".</big>".utf8_encode(strftime( '%B %Y', strtotime($obj['data'][$x]['start_time'])))."</p>".strftime( '%A', strtotime($obj['data'][$x]['start_time'])).", {$start_time}</time>";

			echo		"		<a target='_blank' class='invite btn small' href='//facebook.com/events/{$eid}/' title='Konzert mit {$name} auf Facebook öffnen'>Freunde einladen</a>";
			echo		"	</article>";

			}
	    }
?>

<div id="social">
	<div class="social-feed-container"></div>
</div>

	<script src="social.js"></script>

<script>
$(document).ready(function(){
	$('.social-feed-container').socialfeed({

				// Twitter
				twitter:{
	// accounts: ['@flozzamusic','#floriandonderer','#fdonderer'],
	accounts: ['#fldo'],
	limit: 6,
	consumer_key: '3wDXFXDjug2a7I6lJ2OrzcfLj', // make sure to have your app read-only
	consumer_secret: 'C5hUjGMkPDMhCCvKECbr7tWwI5D7MXhRKYlHnpdtt7TOlc075B', // make sure to have your app read-only
	},
				// INSTAGRAM
				instagram:{
accounts: ['@flozzamusic'],
limit:6,
client_id: 'c91d8deda38b483f9fdc75c48e921973'
},
				// FACEBOOK
				facebook:{
	accounts: ['@donderer.violin','@kuul.io','#floriandonderer'],
	limit: 5,
	access_token: 'CAACEdEose0cBAAabHghleEYNGYMGdvdAVLCL4phheans4Ew2ZB7wRs5nBFZCtr0TB6JEF8DlUeWAfxXeIymZAq308RLM4h1fQEgtcwI4pVfYQn39X0ShMCnjWfToCC9DZCzOoXGqhVY5qaWK9XmepKKOwOsdH7vpMA6pF5aKQWuWIvss2ukUSOHoMsWqFcWHAS3DT2yNSgZDZD' // APP_ID|APP_SECRET
	},
				// GOOGLEPLUS
				google:{ 
					accounts: ['#flozzamusic'],
					limit: 1,
					access_token: 'AIzaSyDpNQcIwQf5TcKmI8B0rh3e4OodIywJP14'
				},
				// VKONTAKTE
				vk:{
				    accounts:['#flozzamusic'],
				    limit:2,
				    source:'all'
				},
				// BLOGSPOT
				/*blogspot:{
					accounts:['@iman-khaghanifar']
				},*/
				// GENERAL SETTINGS
				length:400,
				show_media:true,
				// Moderation function - if returns false, template will have class hidden
				moderation: function(content){
					return  (content.text) ? content.text.indexOf('fuck') == -1 : true;
				},
				//update_period: 5000,
				// When all the posts are collected and displayed - this function is evoked
				callback: function(){
					console.log('all posts are collected');
				}
			});
});
</script>
<style>
	#social .social-feed-container article{display:inline-block;vertical-align:middle;width:28%;margin:0 8% 2em 0;overflow:hidden}#social .social-feed-container article:nth-of-type(3n){margin-right:0}#social .social-feed-container article cite a{display:inline-block;padding-right:.5em}#social .social-feed-container article cite .more{float:right}#social .social-feed-container article header{display:block;margin-bottom:1em;opacity:0.6}#social .social-feed-container article header img{float:left;border-radius:50%;max-width:44px;max-height:44px;margin-right:1em}#social .social-feed-container article header a{display:inline-block;line-height:44px}#social .social-feed-container article header a i{margin-right:.4em}#social .social-feed-container article header time{float:right;line-height:44px;font-size:.6em;color:silver}
</style>
</body>
</html>