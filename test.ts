const RENDER_OUTPUT_PATH_ON_HOST = './rendered_output';

export const render = (content: string | Record<string, unknown>) => {
  const data: string = content instanceof Object ? JSON.stringify(content) : content;
  Deno.writeTextFileSync(RENDER_OUTPUT_PATH_ON_HOST, data);
}

render({
  body: 'Hello world from Deno',
});
