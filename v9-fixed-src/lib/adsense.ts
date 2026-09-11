const ADSENSE_CLIENT_PATTERN = /^ca-pub-\d{10,}$/;

export function getAdSenseClient() {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || "";
  return ADSENSE_CLIENT_PATTERN.test(client) ? client : "";
}

export function getAdSensePublisherId() {
  const client = getAdSenseClient();
  return client ? client.replace(/^ca-/, "") : "";
}
