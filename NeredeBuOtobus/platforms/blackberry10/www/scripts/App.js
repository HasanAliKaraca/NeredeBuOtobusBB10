
var App = {
	startApplication: function () {

		//check if the internet is offline
		ConnectionStatus.check();

		// load the first screen here
		bb.pushScreen('home.html', 'homeScr');

	},

	getValues: function () {
		var durakNo = $("#txtDurakNo").val();
		var hatNo = $("#txtHatNo").val();


		var dataObject = { durakNo: durakNo, hatNo: hatNo };

		return dataObject;
	},

	getBusInfo: function () {

	    //empty datalist
		var dataList = document.getElementById('dataList');
		dataList.clear();

	    //show loading
		Spinner.on();

		var dataObject = this.getValues();
		Connection.doAjaxReq(dataObject);
	},

	showBusInfo: function (data) {
	    console.log(data);
	    console.log(data.Row);

		var i,
		listItem,
		items = [],
		dataList = document.getElementById('dataList');

		for (i = 0; i < data.Row; i++) {
			// Create our list item
			listItem = document.createElement('div');
			listItem.setAttribute('data-bb-type', 'item');
			listItem.setAttribute('data-bb-title', 'Title ');
			listItem.setAttribute('data-bb-accent-text', 'accent text');
			listItem.innerHTML = 'Inner html';
			items.push(listItem);
		}
		// Remove our waiting and refresh the list
		Spinner.off();

		dataList.refresh(items);
	}
};