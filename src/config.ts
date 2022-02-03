export interface Config {
  port: number;
  pinataApiKey: string;
  pinataApiSecret: string;
}

export function loadAndValidateConfigFromEnvironment(): Config {
  const config: Partial<Config> = {
    port: Number(process.env['PORT']) || 8080,
    pinataApiKey: process.env['PINATA_API_KEY'],
    pinataApiSecret: process.env['PINATA_API_SECRET'],
  };

  if (!config.pinataApiKey || !config.pinataApiSecret) {
    throw new Error('Pinata API key is missing on environment! (PINATA_API_KEY, PINATA_API_SECRET)');
  }
  return config as Config;
}
