type PrettierModules = {
  prettier: typeof import('prettier/standalone');
  babel: any;
  estree: any;
  typescript: any;
};

let modulesPromise: Promise<PrettierModules> | null = null;

async function loadPrettier(): Promise<PrettierModules> {
  if (!modulesPromise) {
    modulesPromise = (async () => {
      const [prettier, babel, estree, typescript] = await Promise.all([
        import('prettier/standalone'),
        import('prettier/plugins/babel'),
        import('prettier/plugins/estree'),
        import('prettier/plugins/typescript'),
      ]);
      return { prettier, babel, estree, typescript };
    })();
  }
  return modulesPromise;
}

function resolveParser(lang: string | null | undefined): 'babel' | 'typescript' {
  switch (lang) {
    case 'ts':
    case 'typescript':
    case 'tsx':
      return 'typescript';
    default:
      return 'babel';
  }
}

export async function formatCode(
  code: string,
  lang: string | null | undefined,
  printWidth = 80
): Promise<string> {
  try {
    const { prettier, babel, estree, typescript } = await loadPrettier();

    return await prettier.format(code, {
      parser: resolveParser(lang),
      plugins: [babel, estree, typescript],
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
