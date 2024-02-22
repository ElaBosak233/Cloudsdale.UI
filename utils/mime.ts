export function getMimeTypeFromFilename(filename: string) {
	const extension = (filename.split(".").pop() as string).toLowerCase();
	switch (extension) {
		case "txt":
			return "text/plain";
		case "html":
			return "text/html";
		case "css":
			return "text/css";
		case "js":
			return "text/javascript";
		case "json":
			return "application/json";
		case "xml":
			return "application/xml";
		case "pdf":
			return "application/pdf";
		case "jpg":
		case "jpeg":
			return "image/jpeg";
		case "png":
			return "image/png";
		case "gif":
			return "image/gif";
		case "bmp":
			return "image/bmp";
		case "svg":
			return "image/svg+xml";
		case "mp3":
			return "audio/mpeg";
		case "wav":
			return "audio/wav";
		case "mp4":
			return "video/mp4";
		case "ogg":
			return "video/ogg";
		case "webm":
			return "video/webm";
		default:
			return "application/octet-stream"; // 默认为二进制流
	}
}
