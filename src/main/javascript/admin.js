var Button = javafx.scene.control.Button;
var StackPane = javafx.scene.layout.StackPane;
var Scene = javafx.scene.Scene;
var Canvas = javafx.scene.canvas.Canvas;
var GraphicsContext = javafx.scene.canvas.GraphicsContext;
var Color = javafx.scene.paint.Color;

var CommandSender = Java.type("admin.CommandSender");
var commandSender = new CommandSender("ubuntu@10.0.1.3")

with (new JavaImporter(javafx.scene.layout, javafx.scene.control)) {
	function start(primaryStage) {
		primaryStage.title = "Trade server administration";

		var rows = new VBox();
		var root = new BorderPane();
		root.center = rows;

		var button = new Button();
		var label = new Label();
		label.text = "Data collector status  ";
		var status = new Canvas(25, 25);
		var gc = status.getGraphicsContext2D();
		gc.setFill(dataCollectorRunning() ? Color.GREEN : Color.RED);
		gc.fillOval(0, 0, 25, 25);

		button.text = "Start trade server";
		button.onAction = function() {
			try {
				var running = dataCollectorRunning();
				var message = running ? "running" : "not running";
				print("Data collector is " + message);
			} catch (e) {
				print(e.message)
			}
		};
		var dataCollector = new HBox();
		dataCollector.children.add(label);
		dataCollector.children.add(status);

		var dataCollectorRam = new HBox();
		dataCollectorRam.children.add(new Label("Data collector RAM:"));
		dataCollectorRam.children.add(new Label(dataCollectorMemory() + " MB"));

		rows.children.add(dataCollector);
		rows.children.add(dataCollectorRam);

		primaryStage.scene = new Scene(root, 300, 250);
		primaryStage.show();
	}

	function dataCollectorRunning() {
		return commandSender
				.ssh("/home/ubuntu/plus500/bin/datacollector.sh status") == "1";
	}

	function dataCollectorMemory() {
		var kb = commandSender
				.ssh("/home/ubuntu/plus500/bin/datacollector.sh meminfo");
		var mb = kb.split(" ")[0] / 1000
		return Math.round(mb);
	}
}
