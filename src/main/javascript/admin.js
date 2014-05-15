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

load("src/main/javascript/StatusLight.js");
load("src/main/javascript/statusMonitor.js");

with (new JavaImporter(javafx.scene.layout, javafx.scene.control)) {
	function start(primaryStage) {
		primaryStage.title = "Trade server administration";

		var rows = new VBox();
		var root = new BorderPane();
		root.center = rows;

		var button = new Button();
		var label = new Label();
		label.text = "Data collector status  ";
		var dataCollectorStatus = statusLight();

		var label2 = new Label();
		label2.text = "Trade server status  ";
		var tradeServerStatus = statusLight();

		button.text = "Start trade server";
		button.onAction = function() {
			try {
				var running = statusMonitor.tradeServerRunning();
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
		var memoryLabel = new Label();
		dataCollectorRam.children.add(memoryLabel);

		var dataCollectorTimeRow = new HBox();
		dataCollectorTimeRow.children.add(new Label("Data collector time:"));
		var timeLabel = new Label();
		dataCollectorTimeRow.children.add(timeLabel);

		var tradeServer = new HBox();
		tradeServer.children.add(label2);
		tradeServer.children.add(tradeServerStatus);

		rows.children.add(dataCollector);
		rows.children.add(dataCollectorRam);
		rows.children.add(dataCollectorTimeRow);
		rows.children.add(tradeServer);
		// rows.children.add(button);
		primaryStage.scene = new Scene(root, 400, 250);
		primaryStage.show();
		statusMonitor.debug();
		statusMonitor.init(function(results) {

			dataCollectorStatus
					.setColour(results.dataCollectorIsLogging ? Color.GREEN
							: Color.RED())
			memoryLabel.text = dataCollectorMemory;
			timeLabel.text = dataCollectorTime;

		})
	}

	function statusLight() {
		var light = new StatusLight(25, 25);
		return light.toNode();
	}

}
