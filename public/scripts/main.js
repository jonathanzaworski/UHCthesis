jQuery(document).ready(function ($) {
  // All jQuery-tastic things go here.
  
  $('.error').fadeIn('slow');
	
	$('#nav li').hover(
		function () {
			//show its submenu
			$('ul', this).stop().slideDown(100);

		}, 
		function () {
			//hide its submenu
			$('ul', this).stop().slideUp(100);			
		}
	);

	$(document).ready(function() {
		var testString = 'a[href!=\"' + bootstrap.nextPage + '\"]';
    $(testString).click(function(e) {
        e.preventDefault();
				$.post('/events', { 
					clicks: 'bad',
					target: $(e.target).attr('href'),
					time: Date.now()
				});
        alert('You clicked on the wrong link.');				
    });
		$.post('/events', {
			clicks: 'good' ,
			target: bootstrap.nextPage,
			time: Date.now()
			});		
	});
	console.log(bootstrap.nextPage)
});
