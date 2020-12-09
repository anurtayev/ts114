const Papa = require("papaparse");
const { readFileSync, writeFileSync } = require("fs");
const { v4 } = require("uuid");
const tableName = "Project-jqpbq4sqxjespmvcx2e7xedi4y-dev";
const AWS = require("aws-sdk");

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8000",
});

const phasesAll = {
  Vacation: ["Vacation"],
  "Business Development": ["Business Development"],
  "KWA Non Billable Improvements": ["KWA Non Billable Improvements"],
  Standard: Papa.parse(readFileSync("./projects/Standard-Table 1.csv", "utf-8"))
    .data.filter((element) => element.length > 1)
    .map((element) => `${element[0]} - ${element[1]}`),
  Lowes: Papa.parse(
    readFileSync("./projects/Lowes-Table 1.csv", "utf-8")
  ).data.map((element) => element[0]),
  WalCovid: Papa.parse(
    readFileSync("./projects/WalCovid-Table 1.csv", "utf-8")
  ).data.map((element) => element[0]),
  20538: Papa.parse(
    readFileSync("./projects/20538-Table 1.csv", "utf-8")
  ).data.map((element) => element[0] + " " + element[1]),
  20539: Papa.parse(readFileSync("./projects/20539-Table 1.csv", "utf-8"))
    .data.filter((element) => element.length > 1)
    .map((element) => element[0] + " " + element[1]),
  20540: Papa.parse(readFileSync("./projects/20540-Table 1.csv", "utf-8"))
    .data.filter((element) => element.length > 1)
    .map((element) => element[0] + " " + element[1]),
  19449: Papa.parse(readFileSync("./projects/19449-Table 1.csv", "utf-8"))
    .data.filter((element) => element.length > 1)
    .map((element) => element[0] + " " + element[1]),
  20522: Papa.parse(readFileSync("./projects/20522-Table 1.csv", "utf-8"))
    .data.filter((element) => element.length > 1)
    .map((element) => element[0] + " " + element[1])
    .filter((element) => element.trim().length),
  17298: Papa.parse(readFileSync("./projects/17298-Table 1.csv", "utf-8"))
    .data.filter((element) => element.length > 1)
    .map((element) => element[0] + " " + element[1])
    .filter((element) => element.trim().length),
  20481: Papa.parse(readFileSync("./projects/20481-Table 1.csv", "utf-8"))
    .data.filter((element) => element.length > 1)
    .map((element) => element[0] + " " + element[1])
    .filter((element) => element.trim().length),
  20495: Papa.parse(readFileSync("./projects/20495-Table 1.csv", "utf-8"))
    .data.filter((element) => element.length > 1)
    .map((element) => element[0] + " " + element[1])
    .filter((element) => element.trim().length),
  20497: Papa.parse(readFileSync("./projects/20497-Table 1.csv", "utf-8"))
    .data.filter((element) => element.length > 1)
    .map((element) => element[0] + " " + element[1])
    .filter((element) => element.trim().length),
  20489: Papa.parse(readFileSync("./projects/20489-Table 1.csv", "utf-8"))
    .data.filter((element) => element.length > 1)
    .map((element) => element[0] + " " + element[1])
    .filter((element) => element.trim().length),
};

let accumulator = [];
let accumulatorIndex = 0;
Papa.parse(readFileSync("./projects/projects-list-Table 1.csv", "utf-8"))
  .data.slice(1)
  .forEach((project, index) => {
    accumulator.push(project);
    if (++index % 25 === 0) {
      writeFileSync(
        `projects-import-${accumulatorIndex++}.json`,
        JSON.stringify({
          [tableName]: accumulator.map(([number, name, phases]) => {
            return {
              PutRequest: {
                Item: {
                  __typename: { S: "Project" },
                  name: { S: name },
                  number: { S: number },
                  tasks: { L: phasesAll[phases].map((task) => ({ S: task })) },
                  id: { S: v4() },
                  createdAt: { S: new Date().toISOString() },
                  updatedAt: { S: new Date().toISOString() },
                },
              },
            };
          }),
        })
      );

      accumulator = [];
    }
  });
