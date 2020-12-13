const Papa = require("papaparse");
const { readFileSync, writeFileSync } = require("fs");
const { v4 } = require("uuid");
const tableName = "Project-jqpbq4sqxjespmvcx2e7xedi4y-dev";

const getTasks = (file) =>
  Papa.parse(readFileSync(`./projects/${file}-Table 1.csv`, "utf-8")).data;

const tasksAll = {
  Vacation: [["Vacation"]],
  "Business Development": [["Business Development"]],
  "KWA Non Billable Improvements": [["KWA Non Billable Improvements"]],
  Standard: getTasks("Standard"),
  Lowes: getTasks("Lowes"),
  WalCovid: getTasks("WalCovid"),
  20538: getTasks("20538"),
  20539: getTasks("20539"),
  20540: getTasks("20540"),
  19449: getTasks("19449"),
  20522: getTasks("20522"),
  17298: getTasks("17298"),
  20481: getTasks("20481"),
  20495: getTasks("20495"),
  20497: getTasks("20497"),
  20489: getTasks("20489"),
};

const dumpImportFile = ({ accumulator, accumulatorIndex }) =>
  writeFileSync(
    `projects-import-${accumulatorIndex}.json`,
    JSON.stringify({
      [tableName]: accumulator.map(([number, name, phases]) => {
        return {
          PutRequest: {
            Item: {
              __typename: { S: "Project" },
              name: { S: name },
              number: { S: number },
              tasks: {
                L: tasksAll[phases].map((task) => ({ S: task[0] })),
              },
              id: { S: v4() },
              createdAt: { S: new Date().toISOString() },
              updatedAt: { S: new Date().toISOString() },
            },
          },
        };
      }),
    })
  );

let accumulator = [];
let accumulatorIndex = 0;
let totalProjects = 0;
Papa.parse(readFileSync("./projects/projects-Table 1.csv", "utf-8"))
  .data.slice(1)
  .forEach((project, index) => {
    accumulator.push(project);
    totalProjects++;
    if (++index % 25 === 0) {
      dumpImportFile({ accumulator, accumulatorIndex });
      accumulator = [];
      accumulatorIndex++;
    }
  });

if (accumulator.length > 0) {
  dumpImportFile({ accumulator, accumulatorIndex });
}

console.log("prjects processed", totalProjects);
