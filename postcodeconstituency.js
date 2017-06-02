// postcodetocons calls TheyWorkForYou to map postcodes to constituency IDs
// then looks up the names used by infacts

function postcodetocons(event) {	
    var postcodefield = document.getElementById("postcode");
    var rawpostcode = postcodefield.value;
    if (rawpostcode) {
        postcodefield.value="";
        postcodefield.placeholder = rawpostcode;
    }
    var postcode = encodeURIComponent(rawpostcode);
	if (postcode) {
        var url = "https://www.theyworkforyou.com/api/getConstituency?key=FfbEvUCaGDY3FwXYhsCyWU8i&output=js&postcode=" + postcode;
        output = jQuery.getJSON( url, function(data) {
            var constituency;
            var const_data;
            if(data.hasOwnProperty('error')){ 
                alert('unknown postcode');
            } else {
                constituency = panotoname[data.pa_id];
                document.getElementById("constituency").value=constituency;
                document.getElementById("constituency2").value = constituency;
                updatePage();
            }	
        });
    }
}

// listfromrecommendations should be called from ready() loading the json recommendations
// populates the global decisions; maps them into the popup selectors
// ID "constituency" will become an awesomplete list
// ID "oldconstituency" will be populated as a classic select
// calls updatePage() when either changes

function listfromrecommendations(recomms) {
        decisions = recomms;

        var listitems = "";
        var awesomelist=[];
        jQuery.each(decisions, function(key, value) {
            listitems += '<option>' + value.Constituency + '</option>';
            awesomelist.push(value.Constituency);
        });
        var conslist = document.getElementById("constituency");
        var awesomplete = new Awesomplete(conslist);
        awesomplete.list = awesomelist;
        jQuery('#constituency').on('awesomplete-selectcomplete', updatePage);        
        jQuery('#constituency').on('change', updatePage);

        jQuery(document).on('keypress', '#postcode', function(e) {
            if ( e.keyCode == 13 ) {  // detect the enter key
                jQuery('#postcodebutton').click(); // click lookup
            }
        });
        jQuery(document).on('keypress', '#constituency', function(e) {
            if ( e.keyCode == 13 ) {  // detect the enter key
                updatePage(); // show constituency result
            }
        });
        jQuery('#postcodebutton').on('click', postcodetocons);
        
        jQuery("#constituency2").append(listitems);
        jQuery('#constituency2').on('change', updatePage);
        if(window.location.href.indexOf("?") > -1) {
            updatePage();
        }


    }