// extend VarienGrid
varienGrid.prototype.initGridAjaxParent = varienGrid.prototype.initGridAjax; 
varienGrid.prototype.initGridAjax = function() {
	// create event
	varienGrid.prototype.initGridAjaxParent.apply(this);
	Event.fire(window, 'varienGrid:ajaxUpdate');
}

var gridHeaderToggle = {

	widthUpdated  : false,
	grid : null,
	header : null,
	floating : false,
	container : null,
	widthUpdate:true,
	massaction:null,
	actiom:null,
	
	setWidth: function(prepare) {
		var gridTds = this.grid.select('tbody>tr:first>td');
		var topTds  = this.header.select('tr.headings>th');
		var padding = parseInt(gridTds[0].getStyle('paddingLeft')) + parseInt(gridTds[0].getStyle('paddingRight'));
 		for(var i = 0; i < gridTds.length; i++ ) {
 			width = gridTds[i].getWidth() - padding;
			topTds[i] .setStyle({'min-width':(width-1) +'px', 'width' : (width-1) +'px'});
			gridTds[i].setStyle({'min-width':width +'px', 'width' : width +'px'});
		} 	

		this.widthUpdated = true;		
	},

	moveToToolbar:function() {

		// reassign values, can be updated throws ajax
		this.grid = $$('.middle .grid')[0];

		if (this.grid.previous(0).hasClassName('actions')) {
			this.actions = this.grid.previous(0);		
		}else{
			this.massaction = this.grid.previous(0);
			this.actions = this.grid.previous(1);
		}
		this.header = this.grid.down('table thead');

		// only for ajax
		this.widthUpdate && this.setWidth();		
		this.widthUpdate = false;

		this.container = new Element('div', {'class': 'content-header','id':'grid-header' });
		//this.container.setStyle({padding:'0 25px 0 25px'});
		
		$$('.content-header-floating')
			.first()
			.insert(this.container);
		
		this.container.insert( this.actions )
			 .insert( 
			 	(new Element('div', {'class':'toggle-header'}))
			 		.insert(this.massaction)
			 		.insert(this.header
			 				.wrap('table',{'cellspacing':0})
					 		.wrap('div',{'class':'grid'}))
			 		);

	},

	moveToGrid : function() {

		this.grid = $$('.middle .grid')[0];
		var div = this.grid.up();

		!this.massaction || div.down('#'+this.massaction.id) || div.insert({'top':this.massaction});
		div.down('.actions') 			 || div.insert({'top':this.actions});
		this.grid.down('thead')			 || this.grid.down('table').insert(this.header);

		if (this.container) this.container.remove();

	},

	showFloatingToolbar: function() {
		if (this.floating){
			return ;
		}

		this.moveToToolbar();		
		this.floating = true;
	},

	showNormalToolbar: function(){
		if (!this.floating){
			return ;
		}

		this.moveToGrid();
		
		this.floating = false;	
	},

	update: function(e) {		
		if (!toolbarToggle.ready) 
			return false;

		var s = document.viewport.getScrollOffsets().top;

		if (s > toolbarToggle.headerOffset) {
            this.showFloatingToolbar();
        } else {
            this.showNormalToolbar();
        }
	},

	scroll: function(e) {
		
		$$('.content-header-floating').first().down('.grid').scrollLeft = Element.cumulativeScrollOffset(e.target).left ;
	},

	startListening: function () {     
		this.grid = $$('.middle .grid')[0];
 		if (!this.grid || !this.grid.getWidth()) {
 			return false;
 		}

        Event.observe(window, 'scroll', this.update.bind(this));
        Event.observe(window, 'resize', function() {
        	this.moveToToolbar();
        	
        	this.widthUpdate = true; 
         	this.moveToGrid();
         	
        }.bind(this));

        Event.observe(window, 'varienGrid:ajaxUpdate', function(){
        	this.widthUpdate = true;
        	this.container.remove();
        	this.moveToToolbar();	
        }.bind(this));	

        Event.observe($$('.hor-scroll')[0], 'scroll',this.scroll.bind(this));
    },

 	startOnLoad: function () {       
        Event.observe(window, 'load', this.startListening.bind(this));
    } 
}

gridHeaderToggle.startOnLoad();