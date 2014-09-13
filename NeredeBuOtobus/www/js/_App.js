
var App = {
	startApplication: function () {

		//check if the internet is offline
		ConnectionStatus.check();

		// load the first screen here
		bb.pushScreen('home.html', 'homeScr');

	},

	getValues: function () {
		var durakNo = $("#txtDurakNo").val();
		if (durakNo === "") {
			var message = "Lütfen bir durak numarası giriniz";
			blackberry.ui.dialog.standardAskAsync(message, blackberry.ui.dialog.D_OK, function () { }, { title: "Durak No" })
			return null;
		}

		var hatNo = $("#txtHatNo").val();

		localStorage.setItem("lastDurakNo", durakNo);
		localStorage.setItem("lastHatNo", hatNo);

		var dataObject = { durakNo: durakNo, hatNo: hatNo };
		this.values = dataObject;
		return dataObject;
	},
	values: null,
	getBusInfo: function () {

		//empty datalist
		var dataList = document.getElementById('dataList');
		dataList.clear();

		//show loading
		Spinner.on();

		var dataObject = App.getValues();
		Connection.doAjaxReq(dataObject);
	},

	showBusInfo: function (data) {

	    var i,
		listItem,
		items = [],
		detay,
		kalanDk,
		dataList = document.getElementById('dataList');

		//hatNo girilmişse
		if (this.values != null && this.values.hatNo != "") {

			var hatNo = this.values.hatNo;


			for (var i = 0; i < data.Row; i++) {
				var record = data.Tbl[i];
				if (record.kodu === hatNo) {
					createListItem(record);
					items.push(listItem);
					break;
				}
			}
		}

			//hatNo girilmemişse
		else {
			data.Tbl.forEach(function (o) {
				createListItem(o);
				items.push(listItem);
			});
		}

		//helper functions record=data.Tbl bir tablo objesi yani
		function findKalanDk(record) {
			var detay = record.detay;
			var firstPos;
			var lastPos;

			if (detay.indexOf("<br />") != -1) {
				firstPos = detay.indexOf("<br />") + 6;
				lastPos = detay.lastIndexOf("<br />");
			}
			else if (detay.indexOf("<br/>") != -1) {
				firstPos = detay.indexOf("<br/>") + 5;
				lastPos = detay.lastIndexOf("<br/>");
			}
			else {
				console.error("hata!! api de 'detay' parametresi değişmiş olabilir");
			}

			kalanDk = detay.substring(firstPos, lastPos);
			return kalanDk;
		};
		function createListItem(record) {

			listItem = document.createElement('div');
			listItem.setAttribute('data-bb-type', 'item');
			listItem.setAttribute('data-bb-title', 'Hat No: '+ record.kodu);
			listItem.setAttribute('data-bb-accent-text', '');//sağdaki text

			var kalanDk = findKalanDk(record);
			listItem.innerHTML = kalanDk;
		};

		// Remove our waiting and refresh the list
		Spinner.off();

		dataList.refresh(items);

		Timer.start();
	},


};