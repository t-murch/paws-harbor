module.exports = {
  extends: ["eslint:recommended"],
  env: {
    node: true,
    es6: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  overrides: [
    {
      files: ["**/__tests__/**/*"],
      env: {
        jest: true,
      },
    },
    {
      files: ["*.ts"],
      rules: {
        "sort-keys": [
          "error",
          "asc",
          { allowLineSeparatedGroups: true, minKeys: 4, natural: true },
        ],
      },
    },
  ],
};
