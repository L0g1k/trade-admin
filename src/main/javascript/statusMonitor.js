function StatusMonitor() {

}

StatusMonitor.prototype = {
	dataCollectorRunning : function() {
		print("Checking data collector")
		try {
			return commandSender
					.ssh("/home/ubuntu/plus500/bin/datacollector.sh status") == "1";
		} catch (e) {
			print(e.message);
			return false;
		}
	},

	dataCollectorMemory : function() {
		try {
			var kb = commandSender
					.ssh("/home/ubuntu/plus500/bin/datacollector.sh meminfo");
			var mb = kb.split(" ")[0] / 1000;
			return Math.round(mb);
		} catch (e) {
			return "N/A";
		}
	},

	tradeServerRunning : function() {
		try {
			var commandServer = host + ":" + port;
			return Http.isReachable(host)
					&& Http.post(commandServer, "plus500page.debug()", 1000);
		} catch (e) {
			print(e.message);
			return false;
		}
	},

	dataCollectorTime : function() {

		function getTimeString(input) {
			var values = input.split(":");
			if (values.length == 2) {
				values.unshift(0);
			}
			return values[0] + " hours, " + values[1] + " minutes";
		}
		try {
			var time = commandSender
					.ssh('ps -o etime="" -p $(pidof phantomjs)').trim();
			if (time.indexOf("-") != -1) {
				// eg "1-08:38:53"
				var tokens = time.split("-");

				var days = parseInt(tokens[0])
				var dayString = days > 1 ? "days" : "day"
				return days + " " + dayString + " " + getTimeString(tokens[1]);
			} else {
				return getTimeString(time);
			}
			return time;
		} catch (e) {
			return e.message;
		}
	},

	dataCollectorIsLogging : function() {
		print("Checking data collector actual data")
		var kairos = "http://" + host + ":8080/api/v1/datapoints/query";
		var query = {
			"metrics" : [ {
				"tags" : {},
				"name" : "instrument-2270-buy",
				"aggregators" : [ {
					"name" : "avg",
					"align_sampling" : true,
					"sampling" : {
						"value" : "10",
						"unit" : "seconds"
					}
				} ]
			} ],
			"cache_time" : 0,
			"start_relative" : {
				"value" : "5",
				"unit" : "minutes"
			}
		}
		var response = Http.post(kairos, JSON.stringify(query), 10000);
		try {
			var object = JSON.parse(response);
			return object.queries[0].results[0].values.length > 1;
		} catch (e) {
			return false
		}

	}
}

var statusMonitor = new StatusMonitor();