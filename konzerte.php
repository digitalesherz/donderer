<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"><meta content="width=device-width, initial-scale=1, maximum-scale=1.0" name="viewport"><meta name="apple-mobile-web-app-capable" content="yes"><link rel="stylesheet" href="app.css"><link media="none" onload="if(media!='all')media='all'" rel="stylesheet" href="//fonts.googleapis.com/icon?family=Material+Icons"><link media="none" onload="if(media!='all')media='all'" rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css"><title>Aktuelle Konzerte | Florian Donderer</title><script src="//code.jquery.com/jquery-2.1.1.min.js"></script><script src="//cdnjs.cloudflare.com/ajax/libs/materialize/0.97.3/js/materialize.min.js"></script><script>(function($){
  $(function(){

    $('.button-collapse').sideNav({
      edge: 'right'
    });

  }); // end of document ready
})(jQuery); // end of jQuery name space
</script>
</head>
<body class="konzerte"></body></html><div class="navbar-fixed"><nav role="navigation" class="header"><div class="nav-wrapper"><a id="logo-container" href="index.html" class="left brand-logo">Florian Donderer</a><ul class="right hide-on-med-and-down"><li><a href="index.html">Home</a></li><li><a href="vita.html">Vita</a></li><li><a href="presse.html">Presse</a></li><li class="active"><a href="konzerte.php">Konzerte</a></li><li><a href="projekte.html">Projekte</a></li><li><a href="medien.html">Medien</a></li></ul><ul id="nav-mobile" class="side-nav right"><li><a href="index.html">Home</a></li><li><a href="vita.html">Vita</a></li><li><a href="presse.html">Presse</a></li><li class="active"><a href="konzerte.php">Konzerte</a></li><li><a href="projekte.html">Projekte</a></li><li><a href="medien.html">Medien</a></li></ul><a href="#" data-activates="nav-mobile" class="button-collapse right"><i class="material-icons">menu</i></a></div></nav></div><div class="row"><div class="col s12 center"><h1>Konzerte</h1></div></div><div class="calendar row"><div class="col s10 push-s1">



<?php 
setlocale(LC_TIME, "de_DE");
$fields="id,name,description,place,timezone,start_time,end_time,cover,ticket";
 
// $json_link = "https://graph.facebook.com/912637648777417/events?fields={$fields}&access_token=CAACEdEose0cBAFWqBeZCWsqiDmpGimCG0mXw7hmm303RbARQln7r3QEwC6idHBCPUc1JfGDoTFwH6yDMkSgPlZBZACrW0Knk6RUrmhwOjtYEoY27vjwk42ZB9bHZAMK5tdoccAGkTNPnDBS1qLsjmS7PTlYZA1EVkvbEL7ZCTbIgHPcf9sq7WznnHpOq38llzyDAKwViT021gZDZD&locale=de_DE";
$json_link = "https://graph.facebook.com/v2.5/912637648777417/events?fields={$fields}&access_token=CAACEdEose0cBADlZBa1WuYJIR85j2KIEgqRm09JxW6AAb5iNHJ41zoV6Yd2wZAZB1ISX3Lz0YFmR3g6Db5JGeBjilOrZAcS9rsna28WlCm7ZBf2ZCcjp8uWmpEWthLbOfeI0YEqxC185HF3Dt8ZCunIqF5lKnQDrpM83GRJFIKR1gBDlaJpGc8a7fzLvvQzo1sZD&locale=de_DE";
 
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



</div>


</div><div id="social"></div><div class="row"><h3 class="col s12 center-align"><i class="fa fa-twitter"> </i> Twitter</h3></div><div class="row social-feed-container"></div><footer class="page-footer grey lighten-4"><div class="container"><div class="row"><div class="col s10 push-s1 m6 l6"><h5 class="grey-text text-lighten-1">Übersicht</h5><ul class="grey-text"><li><a href="index.html">Home</a></li><li><a href="vita.html">Vita</a></li><li><a href="presse.html">Presse</a></li><li><a href="konzerte.php">Konzerte</a></li><li><a href="projekte.html">Projekte</a></li><li><a href="medien.html">Medien</a></li></ul></div><div class="col s10 push-s1 m6 l3 offset-l3 socialmedia"><h5 class="grey-text text-lighten-1">Social media</h5><ul><li><a target="floSocial" href="//hellostage.com/Florian-Donderer/biography"><img src="fotos/hellostage.png"></a></li><li><a target="floTwitter" href="//twitter.com/intent/follow?screen_name=flozzamusic"><i class="fa fa-twitter"></i></a></li><li><a target="floSocial" href="//facebook.com/donderer.violin"><i class="fa fa-facebook"></i></a></li><li><a target="floSocial" href="//soundcloud.com/flozzamusic"><i class="fa fa-soundcloud"></i></a></li><li><a target="floSocial" href="//youtube.com/channel/UC_N2Hz63EvNRDmWHNVhRqUw/featured"><i class="fa fa-youtube"></i></a></li></ul></div></div></div><div class="footer-copyright grey-text"><div class="container"> <small>Handmade 🔧 von Digitales Herz</small><a href="index.html" class="grey-text right">Florian Donderer, Violine.</a></div></div></footer><script>;( function ( document, window, index )
{
  'use strict';

  var elSelector  = '.header',
    element   = document.querySelector( elSelector );

  if( !element ) return true;

  var elHeight    = 0,
    elTop     = 0,
    dHeight     = 0,
    wHeight     = 0,
    wScrollCurrent  = 0,
    wScrollBefore = 0,
    wScrollDiff   = 0;

  window.addEventListener( 'scroll', function()
  {
    elHeight    = element.offsetHeight;
    dHeight     = document.body.offsetHeight;
    wHeight     = window.innerHeight;
    wScrollCurrent  = window.pageYOffset;
    wScrollDiff   = wScrollBefore - wScrollCurrent;
    elTop     = parseInt( window.getComputedStyle( element ).getPropertyValue( 'top' ) ) + wScrollDiff;

    if( wScrollCurrent <= 0 ) // scrolled to the very top; element sticks to the top
      element.style.top = '0px';

    else if( wScrollDiff > 0 ) // scrolled up; element slides in
      element.style.top = ( elTop > 0 ? 0 : elTop ) + 'px';

    else if( wScrollDiff < 0 ) // scrolled down
    {
      if( wScrollCurrent + wHeight >= dHeight - elHeight )  // scrolled to the very bottom; element slides in
        element.style.top = ( ( elTop = wScrollCurrent + wHeight - dHeight ) < 0 ? elTop : 0 ) + 'px';

      else // scrolled down; element slides out
        element.style.top = ( Math.abs( elTop ) > elHeight ? -elHeight : elTop ) + 'px';
    }

    wScrollBefore = wScrollCurrent;
  });

}( document, window, 0 ));</script><script src="social.js"></script><script>$(document).ready(function(){
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
});</script>