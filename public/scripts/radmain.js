jQuery(document).ready(function ($) {
  // All jQuery-tastic things go here.

	$('a[href!=\"' + bootstrap.nextPage + '\"]').bind("click", function(e) {
		e.preventDefault();
		$.post('/events', { 
			clicks: 'bad',
			target: $(e.target).attr('href'),
			time: Date.now()
		});
    alert('You clicked on the wrong link.');						
	});

	$('a[href=\"' + bootstrap.nextPage + '\"]').bind("click", function(e) {
		e.preventDefault();
		$.post('/events', { 
			clicks: 'good',
			target: $(e.target).attr('href'),
			time: Date.now()
		});
		setTimeout(function(){ window.location = bootstrap.nextPage; }, 50);
	});
		
//the problem is that as soon as the page loads, it posts the good click. I need to tie that to an event. look up if/then in jquery?
/*
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
*/
	console.log(bootstrap.nextPage)
});
