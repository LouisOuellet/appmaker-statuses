API.Plugins.statuses = {
	element:{
		table:{
			index:{},
		},
	},
	init:function(){
		API.GUI.Sidebar.Nav.add('Statuses', 'development');
	},
	load:{
		index:function(){
			API.Builder.card($('#pagecontent'),{ title: 'Statuses', icon: 'statuses'}, function(card){
				API.request('statuses','read',{
					data:{options:{ link_to:'StatusesIndex',plugin:'status',view:'index' }},
				},function(result) {
					var dataset = JSON.parse(result);
					if(dataset.success != undefined){
						for(const [key, value] of Object.entries(dataset.output.dom)){ API.Helper.set(API.Contents,['data','dom','statuses',value.name],value); }
						for(const [key, value] of Object.entries(dataset.output.raw)){ API.Helper.set(API.Contents,['data','raw','statuses',value.name],value); }
						API.Builder.table(card.children('.card-body'), dataset.output.dom, {
							headers:dataset.output.headers,
							id:'StatusesIndex',
							modal:true,
							key:'id',
							clickable:{ enable:true, view:'details'},
							controls:{ toolbar:true},
							import:{ key:'id', },
						},function(response){
							API.Plugins.status.element.table.index = response.table;
						});
					}
				});
			});
		},
		details:function(){
			var url = new URL(window.location.href);
			var id = url.searchParams.get("id"), values = '';
			setTimeout(function() {
				$("[data-plugin="+url.searchParams.get("p")+"][data-key]").each(function(){
					values += $(this).html();
				});
				if(values == ''){
					API.request('statuses','read',{data:{id:id}},function(result){
						var dataset = JSON.parse(result);
						if(dataset.success != undefined){
							API.GUI.insert(dataset.output.dom);
						}
					});
				}
			}, 1000);
		},
	},
	Timeline:{
		icon:"info",
		object:function(dataset,layout,options = {},callback = null){
			if(options instanceof Function){ callback = options; options = {}; }
			var defaults = {icon: API.Plugins.statuses.Timeline.icon,color: "secondary"};
			if(API.Helper.isSet(options,['icon'])){ defaults.icon = options.icon; }
			if(API.Helper.isSet(options,['color'])){ defaults.color = options.color; }
			if(typeof dataset.id !== 'undefined'){
				var dateItem = new Date(dataset.created);
				var dateUS = dateItem.toLocaleDateString('en-US', {day: 'numeric', month: 'short', year: 'numeric'}).replace(/ /g, '-').replace(/,/g, '');
				API.Builder.Timeline.add.date(layout.timeline,dataset.created);
				var checkExist = setInterval(function() {
					if(layout.timeline.find('div.time-label[data-dateus="'+dateUS+'"]').length > 0){
						clearInterval(checkExist);
						API.Builder.Timeline.add.filter(layout,'statuses','Status');
						var html = '';
						html += '<div data-plugin="statuses" data-id="'+dataset.id+'" data-name="'+dataset.name+'" data-date="'+dateItem.getTime()+'">';
							html += '<i class="fas fa-'+defaults.icon+' bg-'+defaults.color+'"></i>';
							html += '<div class="timeline-item">';
								html += '<span class="time"><i class="fas fa-clock mr-2"></i><time class="timeago" datetime="'+dataset.created.replace(/ /g, "T")+'">'+dataset.created+'</time></span>';
								html += '<h3 class="timeline-header border-0">Status set to <span class="badge bg-'+dataset.color+'"><i class="'+dataset.icon+' mr-1" aria-hidden="true"></i>'+API.Contents.Language[dataset.name]+'</span></h3>';
							html += '</div>';
						html += '</div>';
						layout.timeline.find('div.time-label[data-dateus="'+dateUS+'"]').after(html);
						var element = layout.timeline.find('[data-plugin="statuses"][data-id="'+dataset.id+'"]');
						element.find('time').timeago();
						var items = layout.timeline.children('div').detach().get();
						items.sort(function(a, b){
							return new Date($(b).data("date")) - new Date($(a).data("date"));
						});
						layout.timeline.append(items);
						if(callback != null){ callback(element); }
					}
				}, 100);
			}
		},
	},
	update:function(data,layout,options = {},callback = null){
		if(API.Helper.isSet(layout,['details','status'])){
			if(options instanceof Function){ callback = options; options = {}; }
			var url = new URL(window.location.href);
			var defaults = {field: "status"};
			for(var [key, option] of Object.entries(options)){ if(API.Helper.isSet(defaults,[key])){ defaults[key] = option; } }
			var html = '<span class="badge bg-'+API.Contents.Statuses[url.searchParams.get("p")][data.this.raw.status].color+'">';
			html += '<i class="'+API.Contents.Statuses[url.searchParams.get("p")][data.this.raw.status].icon+' mr-1" aria-hidden="true"></i>'+API.Contents.Language[API.Contents.Statuses[url.searchParams.get("p")][data.this.raw.status].name]+'</span>';
			layout.details.status.find('td').last().html(html);
			if(callback != null){ callback(data,layout,layout.details.status); }
		}
	},
	Layouts:{
		details:{
			detail:function(data,layout,options = {},callback = null){
				if(options instanceof Function){ callback = options; options = {}; }
				var url = new URL(window.location.href);
				var defaults = {field: "status"};
				for(var [key, option] of Object.entries(options)){ if(API.Helper.isSet(defaults,[key])){ defaults[key] = option; } }
				defaults.td = '<td data-plugin="'+url.searchParams.get("p")+'" data-key="'+defaults.field+'">';
					if(API.Helper.isSet(API.Contents.Statuses,[url.searchParams.get("p"),data.this.raw.status])){
						defaults.td += '<span class="badge bg-'+API.Contents.Statuses[url.searchParams.get("p")][data.this.raw.status].color+'">';
							defaults.td += '<i class="'+API.Contents.Statuses[url.searchParams.get("p")][data.this.raw.status].icon+' mr-1" aria-hidden="true"></i>'+API.Contents.Language[API.Contents.Statuses[url.searchParams.get("p")][data.this.raw.status].name]+'';
						defaults.td += '</span>';
					}
				defaults.td += '</td>';
				for(var [key, option] of Object.entries(options)){ if(API.Helper.isSet(defaults,[key])){ defaults[key] = option; } }
				API.Builder.Timeline.add.filter(layout,'statuses','Status');
				API.GUI.Layouts.details.data(data,layout,defaults,function(data,layout,tr){
					if(callback != null){ callback(data,layout,tr); }
				});
			},
			GUI:{},
			Events:function(dataset,layout,options = {},callback = null){
				var url = new URL(window.location.href);
				if(options instanceof Function){ callback = options; options = {}; }
				var defaults = {field: "name"};
				for(var [key, option] of Object.entries(options)){ if(API.Helper.isSet(defaults,[key])){ defaults[key] = option; } }
				if(callback != null){ callback(dataset,layout); }
			},
		},
	},
}

API.Plugins.statuses.init();
