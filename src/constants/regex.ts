// HTTP and URL patterns
export const HTTP_REQUEST_PATTERN = /^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)\s+([^\s]+)\s+HTTP/i;
export const HOST_HEADER_PATTERN = /Host:\s*([^\r\n]+)/i;
export const HTTP_HEADER_LINE_PATTERN = /^([^:]+):\s*(.+)$/;

// cURL patterns
export const CURL_URL_PATTERN = /curl\s+(?:-X\s+\w+\s+)?['"]?([^'"\s]+)['"]?/;
export const CURL_URL_FALLBACK_PATTERN = /['"]?(https?:\/\/[^'"\s]+)['"]?/;
export const CURL_METHOD_PATTERN = /-X\s+(\w+)/i;
export const CURL_HEADER_PATTERN = /-H\s+['"]([^:]+):\s*([^'"]+)['"]/g;
export const CURL_DATA_PATTERN = /(?:-d|--data|--data-raw)\s+['"]([\s\S]+?)['"]/;

// SlideShare URL validation
export const SLIDESHARE_URL_PATTERN = /^https?:\/\/(www\.)?(slideshare\.net|linkedin\.com\/posts)\/.+/i;
