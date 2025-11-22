// HTTP and URL patterns
export const HTTP_REQUEST_PATTERN = /^(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)\s+([^\s]+)\s+HTTP/i;
export const HOST_HEADER_PATTERN = /Host:\s*([^\r\n]+)/i;
export const HTTP_HEADER_LINE_PATTERN = /^([^:]+):\s*(.+)$/;

// cURL patterns
export const CURL_URL_PATTERN = /curl\s+(?:-X\s+\w+\s+)?['"]?([^'"\s]+)['"]?/;
export const CURL_URL_FALLBACK_PATTERN = /['"]?(https?:\/\/[^'"\s]+)['"]?/;
export const CURL_METHOD_PATTERN = /-X\s+(\w+)/i;
export const CURL_HEADER_PATTERN = /-H\s+['"]([^:]+):\s*([^'"]+)['"]/g;
// Match -d with either single quotes or double quotes, capturing everything until the matching closing quote
export const CURL_DATA_PATTERN = /-d\s+'([\s\S]*?)'(?:\s|$)|-d\s+"([\s\S]*?)"(?:\s|$)/;
export const CURL_DATA_RAW_PATTERN = /(?:--data(?:-raw)?)\s+'([\s\S]*?)'(?:\s|$)|(?:--data(?:-raw)?)\s+"([\s\S]*?)"(?:\s|$)/;

// SlideShare URL validation
export const SLIDESHARE_URL_PATTERN = /^https?:\/\/(www\.)?(slideshare\.net|linkedin\.com\/posts)\/.+/i;
