package admin;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.exec.CommandLine;
import org.apache.commons.exec.DefaultExecutor;
import org.apache.commons.exec.ExecuteException;
import org.apache.commons.exec.PumpStreamHandler;


public class CommandSender {

	public String host;

	public CommandSender(String host) {
		this.host = host;
	}
	
	public String[] execute(String command) throws ExecuteException, IOException {
	    CollectingLogOutputStream stdout = new CollectingLogOutputStream();
		PumpStreamHandler psh = new PumpStreamHandler(stdout);
	    CommandLine cl = CommandLine.parse(command);
	    DefaultExecutor exec = new DefaultExecutor();
	    exec.setStreamHandler(psh);
	    exec.execute(cl);
	    List<String> lines = stdout.getLines();
	    /*for (String string : lines) {
			System.out.println(string);
		}*/
	    return lines.toArray(new String[]{});
	}
	
	public Object ssh(String command) {
		ProcessBuilder pBuilder = new ProcessBuilder("ssh", host, command);
		List<String> lines = new ArrayList<>();
		try {
			Process start = pBuilder.start();
			BufferedReader br = new BufferedReader(
					new InputStreamReader(start.getInputStream()));
			StringBuilder builder = new StringBuilder();
			String line = null;
			while ( (line = br.readLine()) != null) {
				lines.add(line);
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	    return lines.get(0);
	}		
}