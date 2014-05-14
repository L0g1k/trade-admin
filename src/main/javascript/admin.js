var Button = javafx.scene.control.Button;
var StackPane = javafx.scene.layout.StackPane;
var Scene = javafx.scene.Scene;
var Canvas = javafx.scene.canvas.Canvas;
var GraphicsContext = javafx.scene.canvas.GraphicsContext;
var Color = javafx.scene.paint.Color;
var Http = Java.type("admin.Http");
var CommandSender = Java.type("admin.CommandSender");
var host = "10.0.1.3";
var port = 9001;
var commandSender = new CommandSender("ubuntu@" + host)

with (new JavaImporter(javafx.scene.layout, javafx.scene.control)) {
	function start(primaryStage) {
		primaryStage.title = "Trade server administration";

		var rows = new VBox();
		var root = new BorderPane();
		root.center = rows;

		var button = new Button();
		var label = new Label();
		label.text = "Data collector status  ";
		var dataCollectorHealthy = dataCollectorIsLogging();
		var dataCollectorStatus = statusLight(dataCollectorHealthy ? Color.GREEN
				: Color.RED);

		var label2 = new Label();
		label2.text = "Trade server status  ";
		var tradeServerStatus = statusLight(tradeServerRunning() ? Color.GREEN
				: Color.RED);

		button.text = "Start trade server";
		button.onAction = function() {
			try {
				var running = tradeServerRunning();
				var message = running ? "running" : "not running";
				print("Trade server is " + message);
			} catch (e) {
				print(e.message);
			}
		};
		var dataCollector = new HBox();
		dataCollector.children.add(label);
		dataCollector.children.add(dataCollectorStatus);

		var dataCollectorRam = new HBox();
		dataCollectorRam.children.add(new Label("Data collector RAM:"));
		dataCollectorRam.children.add(new Label(dataCollectorMemory() + " MB"));

		var dataCollectorTimeRow = new HBox();
		dataCollectorTimeRow.children.add(new Label("Data collector time:"));
		dataCollectorTimeRow.children.add(new Label(dataCollectorTime()));

		var tradeServer = new HBox();
		tradeServer.children.add(label2);
		tradeServer.children.add(tradeServerStatus);

		rows.children.add(dataCollector);
		rows.children.add(dataCollectorRam);
		rows.children.add(dataCollectorTimeRow);
		rows.children.add(tradeServer);
		rows.children.add(button);
		primaryStage.scene = new Scene(root, 400, 250);
		primaryStage.show();
	}

	function dataCollectorRunning() {
		print("Checking data collector")
		try {
			return commandSender
					.ssh("/home/ubuntu/plus500/bin/datacollector.sh status") == "1";
		} catch (e) {
			print(e.message);
			return false;
		}
	}

	function dataCollectorMemory() {
		try {
			var kb = commandSender
					.ssh("/home/ubuntu/plus500/bin/datacollector.sh meminfo");
			var mb = kb.split(" ")[0] / 1000;
			return Math.round(mb);
		} catch (e) {
			return "N/A";
		}
	}

	function tradeServerRunning() {
		try {
			var commandServer = host + ":" + port;
			return Http.isReachable(host)
					&& Http.post(commandServer, "plus500page.debug()", 1000);
		} catch (e) {
			print(e.message);
			return false;
		}
	}

	function dataCollectorTime() {

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
	}

	function statusLight(color) {
		var status = new Canvas(25, 25);
		var gc = status.getGraphicsContext2D();
		gc.setFill(color);
		gc.fillOval(0, 0, 25, 25);
		return status;
	}

	function dataCollectorIsLogging() {
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
