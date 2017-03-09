$(document).ready(function(){

	$('span.isGoing').each(function(i, d){
		$.ajax({
		  url: "https://api.mlab.com/api/1/databases/place_api/collections/clubs?apiKey=Ppkby39JMRc1gI9rKVkAqoa7vM7j7Tye",
		  contentType: "application/json",
		  type: "GET"
		}).done(function(data) {
			for(let i = 0; i < data.length; i++){
				if(data[i].placeid == d.id){
					document.getElementById(d.id).innerHTML = data[i].peopleid.length;
				}
			}
		});
	})


    $('button.gg').click(function() {
		let $id = $(this).children('span').attr('id');
		let $total = $(this).children('span').text();
		let $changeHTML = $(this).children('span');

		$.ajax({
		  url: "https://protected-brook-14915.herokuapp.com/going",
		  data: JSON.stringify({id: $id}),
		  contentType: "application/json",
		  type: "POST"
		}).done(function(data) {
			if(data == null){
				$changeHTML.html(parseInt($total) - 1)
			}
			if(data !== null){
				$changeHTML.html(parseInt($total) + 1)
			}
		});
		
        
    });


});
