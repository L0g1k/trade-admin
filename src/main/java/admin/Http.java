package admin;

import java.io.IOException;
import java.net.InetAddress;

import org.apache.commons.io.IOUtils;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;

public class Http {

	private static CloseableHttpClient httpclient = HttpClients.createDefault();

	public static String get(String url) throws IllegalStateException, IOException {
		CloseableHttpResponse response = httpclient.execute(new HttpGet(url));
		try {
			return IOUtils.toString(response.getEntity().getContent());
		} finally {
			response.close();
		}
	}
	
	public static boolean isReachable(String host) {
		try {
			InetAddress byName = InetAddress.getByName(host);
			return byName.isReachable(2000);
		} catch (Exception e) {
			return false;
		} 
	}
	public static String post(String url, String content) throws IllegalStateException, IOException {
		return Http.post(url, content, -1);
	}
	
	public static String post(String url, String content, int timeout) throws IllegalStateException, IOException {
		url = _checkUrl(url);
		HttpPost post = new HttpPost(url);
		post.setEntity(new StringEntity(content));
		System.out.println("Posting " + content + " to " + url);
		if(timeout != -1)
			post.setConfig(RequestConfig.custom().setSocketTimeout(1000).build());
		CloseableHttpResponse response = httpclient.execute(post);
		try {
			return IOUtils.toString(response.getEntity().getContent());
		} finally {
			response.close();
		}
	}
	
	private static String _checkUrl(String url) {
		String http = "http://";
		if(url.startsWith(http) == false) {
			return http + url;
		} else 
			return url;
	}

	public static void main(String[] args) {
		try {
			//boolean reachable = Http.isReachable("localhost:9001");
			//System.out.println(reachable);
			String post = Http.post("10.0.1.3:9001", "plus500page.debug()");
			System.out.println(post);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
