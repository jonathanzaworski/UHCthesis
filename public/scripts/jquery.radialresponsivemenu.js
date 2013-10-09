/** @author Gyl */
(function($){
	$.fn.radialResponsiveMenu = function(options) {
	options = $.extend({}, $.fn.radialResponsiveMenu.defaults, options);			
		
		return this.each(function(){
			/* ------------------------ Function for Radial Responsive menu  ------------------------ */
			var radLevelOneShown = false, 	radLevelTwoShown = false, 	radLevelThreeShown = false,
				$radFirstLevel, $radSecondLevel,
				$radLevelOneItems, $radLevelTwoItems,
				$level1, $level2, $level3,
				$menuItems,
				
				angleDegree, angleRad,
				outerAngleIncrease = 180/(options.outerRing_items-1),
				innerAngleIncrease = 180/(options.innerRing_items-1),
				toRadians = Math.PI / 180,
			
				xCoord, yCoord,
				xPosMod, yPosMod, yAdjustMod,
				positionOne, positionTwo,
				togglePosition;
				
				togglePosition = $('#toggle-radial').offset();
				
				$('<style type="text/css">' +
					'.radial-menu-items { height:'+ options.circleRadius +'px; width:'+ options.circleRadius +'px; border-radius: '+ options.circleRadius +'px }'+
					'.radial-first-items { top: -'+ ($('#toggle-radial').outerHeight() + 2) +'px; left: -2px }'+
					'.radial-upper-items { top: -2px; left: -1px; }'+ 
					'.radial-menu-links { height:'+ options.circleRadius +'px; width:'+ options.circleRadius +'px; border-radius: '+ options.circleRadius +'px; }' +
				'</style>').appendTo('head');
				
				switch(options.togglePosition){		
				case 'top-right':
					xPosMod = -1;
					yPosMod = 1;
					yAdjustMod = 1;
					break;
				case 'top-center':
					xPosMod = -0.5;
					yPosMod = 1;
					yAdjustMod = 1;
					break;
				case 'bottom-right':
					xPosMod = -1;
					yPosMod = -1;
					yAdjustMod = -1;
					break;
				case 'bottom-left':
					xPosMod = 1;
					yPosMod = -1;
					yAdjustMod = -1;
					break;
				default:
					xPosMod = 1;
					yPosMod = 1;
					yAdjustMod = 1;
				}
				
				$('#radial-menu > ul li').addClass('radial-menu-items');
				$('#radial-menu ul li > a').addClass('radial-menu-links');
				
				$('#radial-menu ul.level-1').addClass('hide');
				$('#radial-menu ul.level-1').addClass('radial-first-items');
				$('#radial-menu ul.level-2').addClass('hide');
				$('#radial-menu ul.level-2').addClass('radial-upper-items')
				$('#radial-menu ul.level-3').addClass('hide');
				$('#radial-menu ul.level-3').addClass('radial-upper-items')
					
				$('#radial-menu li > ul').parent().addClass('have-subs');
				// $('#radial-menu ul li > a').wrap('<div class="radial-label" />')
				$('#radial-menu #toggle-radial').click(RadLevelOneToggle);
				$('#radial-menu ul.level-1 > li.have-subs > a').click(RadLevelTwoToggle);
				$('#radial-menu ul.level-2 > li.have-subs > a').click(RadLevelThreeToggle);
				$menuItems = $('#radial-menu ul li');
	
			/* ------------ Radial toggle button related behavior: Toggling level-1 Menu ------------*/		
			function RadLevelOneToggle(){
				if(!radLevelOneShown){
					$(this).addClass('active');
					
					$level1 = $('ul.level-1');
					toggleMenuItems.call(this, $level1, options.lv1_outerRing );
			
					$('#radial-menu ul.level-1').removeClass('hide');
					$('#radial-menu ul.level-1').addClass('show');
					radLevelOneShown = true;		
				} else {
					radLevelOneShown = false;	
					$(this).removeClass('active');
					$('#radial-menu ul.level-1 > li').animate({ left: '0px', top: '0px' }, 150);
					$('#radial-menu ul.level-1').fadeOut(200, function(){
						$('#radial-menu ul.level-1 > li.have-subs').removeClass('active');
						$('#radial-menu ul.level-1').removeClass('show');
						$('#radial-menu ul.level-1').addClass('hide');			
						if(radLevelTwoShown){
							$radFirstLevel.fadeTo(200, 1);
							$radLevelOneItems.bind('click', RadLevelTwoToggle);
							$('#radial-menu ul.level-2 > li').animate({ top: positionOne.top, left: positionOne.left }, 200);
							$('#radial-menu ul.level-2 > li.have-subs').removeClass('active');
							$('#radial-menu ul.level-2').removeClass('show');
							$('#radial-menu ul.level-2').addClass('hide');
							radLevelTwoShown = false;
						}
						if(radLevelThreeShown){
							$radSecondLevel.fadeTo(200, 1);
							$radLevelTwoItems.bind('click', RadLevelThreeToggle);
							$('#radial-menu ul.level-3 > li').animate({ top: positionTwo.top, left: positionTwo.left }, 200);
							$('#radial-menu ul.level-3').removeClass('show');
							$('#radial-menu ul.level-3').addClass('hide');
							radLevelThreeShown = false;
						}
					});	
				}
			}

			/* ------------ Radial toggle button related behavior: Toggling level-2 Menu ------------*/	
			function RadLevelTwoToggle(){
				$radFirstLevel = $(this).parent().siblings();
				$radLevelOneItems = $(this).parent().siblings('.have-subs').children('a');
				positionOne = $(this).position();
				if(!radLevelTwoShown){
					$(this).parent().addClass('active');
					$radFirstLevel.fadeTo(200, 0.1);
					$radLevelOneItems.unbind('click');
					
					$level2 = ('ul.level-2');
					toggleMenuItems.call(this, $level2, options.lv2_outerRing );

					$(this).parent().children('ul.level-2').removeClass('hide');
					$(this).parent().children('ul.level-2').addClass('show');
					radLevelTwoShown = true;
				} else {
					radLevelTwoShown = false;	
					$(this).parent().removeClass('active');
					$radFirstLevel.fadeTo(200, 1);
					$radLevelOneItems.bind('click', RadLevelTwoToggle);
					$('#radial-menu ul.level-2 > li').animate({ top: positionOne.top, left: positionOne.left }, 200);		
					$('#radial-menu ul.level-2').fadeOut(200, function(){	
						$('#radial-menu ul.level-2 > li.have-subs').removeClass('active');	
						$('#radial-menu ul.level-2').removeClass('show');
						$('#radial-menu ul.level-2').addClass('hide');
						if(radLevelThreeShown){
							$radSecondLevel.fadeTo(200, 1);
							$radLevelTwoItems.bind('click', RadLevelThreeToggle);
							$('#radial-menu ul.level-3 > li').animate({ top: positionTwo.top, left: positionTwo.left }, 200);
							$('#radial-menu ul.level-3').removeClass('show');
							$('#radial-menu ul.level-3').addClass('hide');
							radLevelThreeShown = false;
						}
					});	
				}
			}

			/* ------------ Radial toggle button related behavior: Toggling level-3 Menu ------------*/
			function RadLevelThreeToggle(){
				$radSecondLevel = $(this).parent().siblings();
				$radLevelTwoItems = $(this).parent().siblings('.have-subs').children('a');
				positionTwo = $(this).position();
				if(!radLevelThreeShown){
					$(this).parent().addClass('active');
					$radSecondLevel.fadeTo(200, 0.1);
					$radLevelTwoItems.unbind('click');
					
					$level3 = ('ul.level-3');
					toggleMenuItems.call(this, $level3, options.lv3_outerRing );
		
					$(this).parent().children('ul.level-3').removeClass('hide');
					$(this).parent().children('ul.level-3').addClass('show');
					radLevelThreeShown = true;
				} else {
					radLevelThreeShown = false;	
					$(this).parent().removeClass('active');
					$radSecondLevel.fadeTo(200, 1);
					$radLevelTwoItems.bind('click', RadLevelThreeToggle);
					$('#radial-menu ul.level-3 > li').animate({ top: positionTwo.top, left: positionTwo.left }, 200);		
					$('#radial-menu ul.level-3').fadeOut(200, function(){				
						$('#radial-menu ul.level-3').removeClass('show');
						$('#radial-menu ul.level-3').addClass('hide');
					});	
				}
			}	
		
			function toggleMenuItems(selectParent, isOuterRing){
				var yPositionAdjust, xPositionAdjust;
					
				yPositionAdjust = (options.circleRadius - $(this).outerHeight())/2;
				xPositionAdjust = (options.circleRadius - $(this).outerHeight())/2;			
	
				angleDegree = 0;
				/* ------------ Looping for INNER Ring - Sub-Menu level toggle and animation ------------*/		
				for( var index = 0; index < options.innerRing_items; index++ ){
				    angleRad = angleDegree * toRadians;
					xCoord = - options.innerRing_radius * Math.cos( angleRad );
					yCoord = options.innerRing_radius * Math.sin( angleRad );	
					$(this).parent().children(selectParent).children(' li:nth-child('+ (index+1) +')').animate({ left: xCoord*xPosMod-xPositionAdjust , top: yCoord*yPosMod-yPositionAdjust}, 200);
					angleDegree += innerAngleIncrease;
				}

				angleDegree = 0;
				if(isOuterRing){
					for( var index = options.innerRing_items; index < options.innerRing_items + options.outerRing_items; index++ ){
						$(this).parent().children(selectParent).children('li:nth-child('+ (index+1) +')').removeClass('hide');		    				
					}
					/* ------------ Looping for OUTER Ring (if enabled) - Sub-Menu level toggle and animation ------------*/				
					for( var index = options.innerRing_items; index < options.innerRing_items + options.outerRing_items; index++ ){
			    		angleRad = angleDegree * toRadians;
						xCoord = - options.outerRing_radius * Math.cos( angleRad );
						yCoord = options.outerRing_radius * Math.sin( angleRad );			
						$(this).parent().children(selectParent).children(' li:nth-child('+ (index+1) +')').animate({ left: xCoord*xPosMod-xPositionAdjust, top: yCoord*yPosMod-yPositionAdjust }, 200);
						angleDegree += outerAngleIncrease;
					}
				} else {
					for( var index = options.innerRing_items; index < options.innerRing_items + options.outerRing_items; index++ ){		    				
						$(this).parent().children(selectParent).children('li:nth-child('+ (index+1) +')').addClass('hide');
					}
				}					
			}
		});	
	};
	
	$.fn.radialResponsiveMenu.defaults = {
		'circleRadius': 60,
		'lv1_outerRing': true,
		'lv2_outerRing': true,
		'lv3_outerRing': true,
		'innerRing_items': 3,
		'outerRing_items': 5,
		'innerRing_radius': 85,
		'outerRing_radius': 170,
		'togglePosition': 'top-left'
	};
	
})( jQuery );
