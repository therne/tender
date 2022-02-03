export interface Config {
  port: number;
}

export function loadConfigFromEnvironment(): Config {
  return {
    port: Number(process.env['PORT']) || 8080,
  };
}
