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
});
