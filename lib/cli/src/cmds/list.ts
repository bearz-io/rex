import { Command } from "@cliffy/command";
import { Runner, type RunnerOptions } from "@rex/pipelines/runner";
import { VERSION } from "../version.ts";

export const listCommand = new Command()
    .name("rex-list")

    .option("-f, --file <file:string>", "The rexfile to run")
    .action(async ({ file  }) => {
        const runner = new Runner();

        const options: RunnerOptions = {
            file: file,
            targets: ["default"],
            command: "list"
        };
        await runner.run(options);
    });