import { runScriptOnRuntime } from '../../src/runtime';
import { PermissionError } from '../../src/runtime/errors';

describe('runScriptOnRuntime()', () => {
  describe('when the code is correct', () => {
    it('should run and return the render result correctly', async () => {
      const expectedMsg = 'Hello from Runtime!';
      const result = await runScriptOnRuntime(`
const outputPath: string = "./rendered_output";
Deno.writeTextFileSync(outputPath, "${expectedMsg}");
`);
      expect(result).toEqual(expectedMsg);
    });
  });

  describe('attempt to read file in system', () => {
    const code = `const content = Deno.readTextFileSync('script.ts');
    console.log(content);`;

    it('should throw permission error', async () => {
      await expect(runScriptOnRuntime(code)).rejects.toThrow(PermissionError);
    });
  });

  describe('attempt to write file in system', () => {
    const code = `Deno.writeTextFileSync('haha.out', 'abracadabra');`;

    it('should throw permission error', async () => {
      await expect(runScriptOnRuntime(code)).rejects.toThrow(PermissionError);
    });
  });
});
