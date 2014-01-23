;(function( $, w, d ) {

	zoom = function(args){
		
		defaults = {
			listParent : 'zoomList',
			zoomContainer : 'zoomContainer',
			relatedData : 'data-img',
			showPosData : false,
			largeImgContainerWidth : 300,
			largeImgContainerHeight : 300
		};

		this.opts = $.extend(defaults, args);
		this.init(this.opts);

		this.imgRelation = [];
	};

	zoom.prototype = {
		init: function( options ){
			this.imgListContainer = $('#'+this.opts.listParent+'');



			this.imgThumbs = this.getThumbArray();
			this.getRelatedData();
			this.events();
			this.createLargeImgContainer();

			if(this.opts.showPosData){
				this.showXAndYValues();
			}
		},
		events : function(){
			var self = this;
			this.imgThumbs.each(function(i){
				var el = $(this);
				el.hover(function(e){
					self.onImgOver( el, e );
				},function(e){
					self.onImgOut();
				});
			});
		},
		getThumbArray : function(){
			return this.imgListContainer.find('img');
		},
		getRelatedData : function(){
			var self = this;
			this.imgThumbs.each(function(i){
				var el = $(this);
				if(!el.attr(self.opts.relatedData)){
					el.attr(self.opts.relatedData , i);
				}
			});
		},
		onImgOver : function( img, event ){
			var self = this;

			this.displayLargeImg(img);
			this.displaySmallImgZoomBox(img);

			this.largeImgHeight 		= this.largeImgSrc.outerHeight();
			this.largeImgWidth 			= this.largeImgSrc.outerWidth();
			this.smallImgParentHeight 	= img.parent().outerHeight();
			this.smallImgParentWidth 	= img.parent().outerWidth();

			img.mousemove(function(e){
				var offset = img.offset();

				this.mouseX = Math.round((e.clientX - offset.left) / self.smallImgParentWidth * 100);
				this.mouseY = Math.round((e.clientY - offset.top) / self.smallImgParentHeight * 100);

				self.updateLargeImgPosition( this.mouseX, this.mouseY );
				self.updateSmallImgPosition( this.mouseX, this.mouseY );
			});
		},
		onImgOut : function( img, event ){
			this.hideLargeImg(img);
			this.largeImgContainer.html('');
		},
		displayLargeImg : function(img){
			var imgSrc = img.attr('src');
			this.largeImgSrc = $('<img/>')
				.attr('src', imgSrc)
				.css('position', 'absolute')
				.appendTo(this.largeImgContainer);

			

			this.largeImgContainer.css({
				display : 'block'
			});
		},
		displaySmallImgZoomBox : function(img){
			var parentEl = img.parent();
			parentEl.css({'position' : 'relative'});
			this.smallZoomBox = $('<div>')
									.attr('id', 'smallZoomBox')
									.css({
										'position' 	: 'absolute',
										'border'	: '1px solid #ccc',
										'background-color' : 'rgba(255,255,255,0.4)',
										'width' 	: parseInt(this.smallImgParentWidth * 0.2)+'px',
										'height' 	: parseInt(this.smallImgParentHeight * 0.2)+'px',
										'z-index'	: '99'
									}).appendTo(parentEl);
		},
		updateLargeImgPosition : function( posX, posY ){
			
			var perHeightDif = Math.round((posY / 100 * this.largeImgHeight) - (this.opts.largeImgContainerHeight * 0.5 ));
			if(perHeightDif <= 0)
				perHeightDif = 0;

			if(perHeightDif >= (this.largeImgHeight-this.opts.largeImgContainerHeight))
				perHeightDif = this.largeImgHeight-this.opts.largeImgContainerHeight;

			var perWidthDif = Math.round((posX / 100 * this.largeImgWidth) - (this.opts.largeImgContainerWidth * 0.5));
			if(perWidthDif <= 0)
				perWidthDif = 0;

			if(perWidthDif >= (this.largeImgWidth-this.opts.largeImgContainerWidth))
				perWidthDif = this.largeImgWidth-this.opts.largeImgContainerWidth;

			this.largeImgSrc.css({
				'top'	: -parseInt(perHeightDif)+'px',
				'left'	: -parseInt(perWidthDif)+'px'
			});

			if(this.opts.showPosData){
				this.showSmallPosDataContainerX.html('X: '+posX+'%');
				this.showSmallPosDataContainerY.html('Y: '+posY+'%');

				this.showLargePosDataContainerX.html('top: '+perHeightDif+'px');
				this.showLargePosDataContainerY.html('left: '+perWidthDif+'px');
			}
		},
		updateSmallImgPosition : function( posX, posY ){
			var width = this.smallZoomBox.outerWidth();
			var height = this.smallZoomBox.outerHeight();
			this.smallZoomBox.css({
				'top'	: parseInt(posY - (height * 0.5))+'%',
				'left'	: parseInt(posX - (width * 0.5))+'%'
			});
		},
		hideLargeImg : function(img){
			this.largeImgContainer.css({
				display : 'none'
			});

			this.smallZoomBox.remove();
		},
		showXAndYValues : function() {
			this.showSmallPosDataContainer = $('<div>')
				.attr('id', 'zoomPosDataSmall')
				.css({
					'position'	: 'fixed',
					'top'		: '10px',
					'right'		: '10px',
					'padding' 	: '10px',
					'background-color' : '#fff'
				})
				.appendTo('body');

			var posDataCss = {
					'font-size' : '9pt',
					'font-family' : 'sans-serif',
					'padding' : '5px'
				}

			this.showSmallPosDataContainerX = $('<span>')
				.attr('id', 'zoomSmallPosX')
				.css(posDataCss)
				.appendTo(this.showSmallPosDataContainer);

			this.showSmallPosDataContainerY = $('<span>')
				.attr('id', 'zoomSmallPosY')
				.css(posDataCss)
				.appendTo(this.showSmallPosDataContainer);


			this.showLargePosDataContainer = $('<div>')
				.attr('id', 'zoomPosDataLarge')
				.css({
					'position'	: 'fixed',
					'top'		: '50px',
					'right'		: '10px',
					'padding' 	: '10px',
					'background-color' : '#eee'
				})
				.appendTo('body');

			var posDataCss = {
					'font-size' : '9pt',
					'font-family' : 'sans-serif',
					'padding' : '5px'
				}

			this.showLargePosDataContainerX = $('<span>')
				.attr('id', 'zoomLargePosX')
				.css(posDataCss)
				.appendTo(this.showLargePosDataContainer);

			this.showLargePosDataContainerY = $('<span>')
				.attr('id', 'zoomLargePosY')
				.css(posDataCss)
				.appendTo(this.showLargePosDataContainer);
		},
		createLargeImgContainer : function(){
			this.largeImgContainer = $('<div>')
				.attr('id', this.opts.zoomContainer)
				.css({
					'width' 			: this.opts.largeImgContainerWidth+'px',
					'height'			: this.opts.largeImgContainerHeight+'px',
					'background-color' 	: '#ccc',
					'display' 			: 'none',
					'position'			: 'relative',
					'overflow'			: 'hidden'
				}).appendTo('body');
		}
	};


}( jQuery, window, document, undefined ));