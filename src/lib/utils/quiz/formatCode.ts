type PrettierModules = {
  prettier: typeof import('prettier/standalone');
  babel: any;
  estree: any;
};

let modulesPromise: Promise<PrettierModules> | null = null;

async function loadPrettier(): Promise<PrettierModules> {
  if (!modulesPromise) {
    modulesPromise = (async () => {
      const [prettier, babel, estree] = await Promise.all([
        import('prettier/standalone'),
        import('prettier/plugins/babel'),
        import('prettier/plugins/estree'),
      ]);
      return { prettier, babel, estree };
    })();
  }
  return modulesPromise;
}

export async function formatCode(
  code: string,
  printWidth = 80
): Promise<string> {
  try {
    const { prettier, babel, estree } = await loadPrettier();

    return await prettier.format(code, {
      parser: 'babel',
      plugins: [babel, estree],
      tabWidth: 2,
      semi: true,
      singleQuote: false,
      printWidth,
    });
  } catch (error) {
    console.warn('[formatCode] Prettier failed, returning raw code:', error);
    return code;
  }
}