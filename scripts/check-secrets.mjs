import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { validatePublicEnvironment } from "./public-env.mjs";
import nextEnvironment from "@next/env";
const { loadEnvConfig } = nextEnvironment;

export function secretIssues(name, content) {
  const file = name.replaceAll("\\", "/");
  const issues = [];
  if (/(^|\/)\.env(?:\..*)?$/.test(file) && !file.endsWith(".env.example"))
    issues.push("berkas environment aktif");
  if (/\.(dpapi|pem|key|pfx|p12)$/i.test(file))
    issues.push("berkas kredensial/vault");
  const patterns = [
    ["API key literal", /\bsb_(secret|publishable)_[A-Za-z0-9_-]{20,}\b/],
    [
      "token JWT literal",
      /\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,}\b/,
    ],
    [
      "connection string berisi password",
      /postgres(?:ql)?:\/\/[^:\s/]+:[^@\s]+@/i,
    ],
    ["private key", /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ];
  for (const [label, pattern] of patterns)
    if (pattern.test(content)) issues.push(label);
  return issues;
}

function git(args) {
  const result = spawnSync("git", args, {
    encoding: "buffer",
    maxBuffer: 32 * 1024 * 1024,
  });
  if (result.status !== 0)
    throw new Error(
      "Pemeriksaan Git gagal; isi keluaran disembunyikan untuk melindungi kredensial.",
    );
  return result.stdout;
}

export function checkSecrets(staged = false) {
  const list = git(
    staged
      ? ["diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z"]
      : ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
  );
  const files = [...new Set(list.toString("utf8").split("\0").filter(Boolean))];
  const findings = [];
  for (const file of files) {
    if (!staged && !existsSync(file)) continue;
    const body = staged ? git(["show", ":" + file]) : readFileSync(file);
    const content = body.includes(0) ? "" : body.toString("utf8");
    const issues = secretIssues(file, content);
    if (issues.length) findings.push({ file, issues });
  }
  return findings;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  try {
    loadEnvConfig(
      process.cwd(),
      process.argv.includes("--development"),
      {
        info() {},
        error() {
          throw new Error(
            "Environment gagal diproses. Nilai konfigurasi disembunyikan.",
          );
        },
      },
      true,
    );
    validatePublicEnvironment(process.env);
    const findings = checkSecrets(process.argv.includes("--staged"));
    for (const item of findings)
      console.error(item.file + ": " + item.issues.join(", "));
    if (findings.length) {
      console.error(
        "Pemeriksaan ditolak. Pindahkan kredensial ke environment/vault; nilainya tidak ditampilkan.",
      );
      process.exitCode = 1;
    } else
      console.log(
        "Pemeriksaan kredensial Git lulus; tidak ada nilai kredensial yang dicetak.",
      );
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
