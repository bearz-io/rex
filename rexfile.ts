import { WINDOWS } from "@bearz/runtime-info/os";
import { cmd, deploy, job, scriptTask, task } from "jsr:@rex/rexfile@0.0.0-alpha.0";

console.log("Test");
task("test", (_) => console.log("Hello, world!"));

// a tasks to dependents on other tasks
// the other tasks will run before this task.
task("default", ["test"], async (_) => {
    await cmd("echo", ["Hello, world!"]).run();
})
    // only run on non-windows
    .if((_) => !WINDOWS);

scriptTask("test:bash", "bash", "echo 'Hello, world!' \n ls -la");

task("secrets", (ctx) => {
    ctx.secrets.set("secret", "super secret");
});

task("print:secrets", ["secrets"], (ctx) => {
    console.log(ctx.secrets.get("secret"));
    console.log(ctx.env.get("SECRET"));
    ctx.writer.maskLine("My secret is super secret");

    for (const [key, value] of ctx.secrets) {
        console.log(`${key}=${value}`);
    }
});

task("print:env", (ctx) => {
    for (const [key, value] of ctx.env) {
        console.log(`${key}=${value}`);
    }
})
    .description("Prints the environment variables");

// a job is a collection of tasks that are
// executed in order of declaration
job("build").tasks((map, add) => {
    // adds a top level task to the job. enables reuse.
    add("test");

    // adds a task that is unique to the job.
    // this is added to the job's task map.
    task("test:2", () => console.log("test 2"), map).if((_) => WINDOWS);
});

// deploy is a special task/job hybrid where
// the deploy delegate is the primary task.
// before and after are events that will run
// one or more tasks in sequential order, similar
// to job.

// the delegate deploy tasks has a 'before:delpoy'
// and 'after:deploy' event.
// other deploy implementations can implement additional
// custom events that run other sets of tasks.

deploy("deploy", (ctx) => {
    console.log("deploying..");
    console.log(ctx.writer.level);
    ctx.writer.warn("Deploying to the moon");
    ctx.writer.error("Deploying to the moon");
    ctx.writer.debug("Deploying to the moon");
    ctx.writer.info("Deploying to the moon");
})
    .before((map) => {
        task("before:deploy", () => console.log("before deploy"), map);
    })
    .after((map) => {
        task("after:deploy", () => console.log("after deploy"), map);
    });
