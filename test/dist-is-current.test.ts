import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, sep } from "node:path";
import { afterAll, describe, expect, it } from "vitest";

/**
 * `dist/` is committed, and this is what makes that safe.
 *
 * The package has no `prepare` script on purpose. A consumer installing it from
 * a git URL would otherwise have to install every devDependency here and run
 * the compiler, which is how a browser bundle ended up pulling the AWS SDK,
 * mysql2 and a test runner to obtain a contract of a few dozen kilobytes.
 * Without that script npm installs nothing and builds nothing -- it takes what
 * is committed.
 *
 * The cost is the usual one for a checked-in build: it can fall behind the
 * source that produced it, and a consumer would never know. So it is checked
 * here rather than trusted. This is the difference between committing your own
 * build output and vendoring somebody else's: this can be verified.
 */
const root = join(import.meta.dirname, "..");
const built = mkdtempSync(join(tmpdir(), "dot-event-protocol-dist-"));

afterAll(() => {
  rmSync(built, { recursive: true, force: true });
});

function filesUnder(directory: string): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    if (statSync(path).isDirectory()) found.push(...filesUnder(path));
    else found.push(path);
  }
  return found.sort();
}

/** Source maps name their own location, so compare the code and the types. */
const COMPARED = /\.(js|d\.ts)$/u;

describe("committed dist", () => {
  const fresh = (): string => {
    execFileSync(
      process.execPath,
      [join(root, "node_modules", "typescript", "bin", "tsc"),
        "-p", join(root, "tsconfig.build.json"), "--outDir", built],
      { cwd: root, stdio: "pipe" },
    );
    return built;
  };

  it("matches what the source compiles to", () => {
    const directory = fresh();
    const expected = filesUnder(directory)
      .map((path) => relative(directory, path).split(sep).join("/"))
      .filter((path) => COMPARED.test(path));
    expect(expected.length).toBeGreaterThan(5);

    for (const name of expected) {
      const committed = join(root, "dist", name);
      // A missing file is the same failure as a stale one: what is published
      // would not be what the source says.
      expect(() => statSync(committed), `dist/${name} is missing`).not.toThrow();
      expect(
        readFileSync(committed, "utf8").replace(/\r\n/gu, "\n"),
        `dist/${name} is stale; run npm run build`,
      ).toBe(readFileSync(join(directory, name), "utf8").replace(/\r\n/gu, "\n"));
    }
  });

  it("has no prepare script, which is why the build has to be committed", () => {
    const manifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as {
      readonly scripts: Record<string, string>;
    };
    // Adding one would put every devDependency back into a consumer's install.
    expect(manifest.scripts).not.toHaveProperty("prepare");
  });
});
