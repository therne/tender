const runtimeConfig: { [key: string]: string } = JSON.parse(Deno.args[0]);

/**
 * Reads a value with corresponding key from config given to the runtime.
 * @param key
 */
export const readRuntimeConfig = (key: string): string | undefined => runtimeConfig[key];
