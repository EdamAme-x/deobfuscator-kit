import { parseArgs } from "@std/cli/parse-args";
import { replaceArray, replaceObject } from "./subcommands/replace.ts";

const args = parseArgs(Deno.args);

const subcommand = args._[0];

switch (subcommand) {
  case "synchrony": {
    const command = new Deno.Command(Deno.execPath(), {
        args: ["run", "-A", "npm:deobfuscator", "deobfuscate", ...Deno.args.slice(1)],
    })
    const output = await command.output();
    if (output.success) {
        console.log(new TextDecoder().decode(output.stdout));
    }else {
        console.error(new TextDecoder().decode(output.stderr));
    }
    break;
  }

  case "deobfio": {
    const command = new Deno.Command(Deno.execPath(), {
        args: ["run", "-A", "npm:obfuscator-io-deobfuscator", ...Deno.args.slice(1)],
    })
    const output = await command.output();
    if (output.success) {
        console.log(new TextDecoder().decode(output.stdout));
    }else {
        console.error(new TextDecoder().decode(output.stderr));
    }
    break;
  }

  case "replace-array": {
    const filepath = String(args._[1]);
    const name = args.name;

    if (!name) {
      throw new Error("Name is required");
    }

    const output = args.output;
    const override = args.override;
    const ignoreSideEffects = args["ignore-side-effects"];

    replaceArray(filepath, name, output, override, ignoreSideEffects);
    break;
  }

  case "replace-object": {
    const filepath = String(args._[1]);
    const name = args.name;

    if (!name) {
      throw new Error("Name is required");
    }

    const output = args.output;
    const override = args.override;
    const ignoreSideEffects = args["ignore-side-effects"];

    replaceObject(filepath, name, output, override, ignoreSideEffects);
    break;
  }

  default: {
    throw new Error(`Unknown subcommand: ${subcommand}`);
  }
}
