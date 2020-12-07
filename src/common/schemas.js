import { API, graphqlOperation } from "aws-amplify";
import * as Yup from "yup";

import {
  listProjects,
  getProject,
  listRecords,
  getRecord,
} from "graphql/queries";
import {
  createProject,
  updateProject,
  deleteProject,
  createRecord,
  deleteRecord,
  updateRecord,
} from "graphql/mutations";

export const ProjectSchema = Yup.object().shape({
  id: Yup.string().meta({
    input: true,
  }),
  name: Yup.string()
    .required()
    .meta({
      input: true,
      title: "Project name",
      views: {
        default: {
          order: 1,
          width: "30em",
        },
        edit: {
          order: 1,
        },
      },
    }),
  number: Yup.string()
    .required()
    .meta({
      input: true,
      title: "Project number",
      views: {
        default: { order: 2, width: "20em" },
        edit: {
          order: 2,
        },
      },
    }),
  tasks: Yup.array()
    .required()
    .min(1, "need elems")
    .meta({
      input: true,
      title: "Project tasks",
      views: {
        edit: {
          order: 3,
        },
        default: { order: 3, width: "30em" },
      },
    }),
});

const RecordSchema = Yup.object().shape({
  id: Yup.string().meta({
    input: true,
  }),
  recordProjectId: Yup.string()
    .required()
    .meta({
      input: true,
      title: "Project",
      views: {
        edit: { order: 1 },
      },
      optionsPromise: () =>
        API.graphql(graphqlOperation(listProjects)).then(
          ({
            data: {
              listProjects: { items },
            },
          }) =>
            items
              .sort((a, b) =>
                a.number < b.number ? -1 : a.number > b.number ? 1 : 0
              )
              .map((project) => [
                project.id,
                `${project.number} - ${project.name}`,
              ])
        ),
    }),
  "project.number": Yup.string().meta({
    views: {
      timesheets: { order: 3, width: "5em" },
      accounting: { title: "Project", order: 1, width: "30em" },
    },
  }),
  "project.name": Yup.string().meta({
    views: { timesheets: { order: 4, width: "15em" } },
  }),
  projectTask: Yup.string()
    .required()
    .meta({
      input: true,
      title: "Project Task",
      views: {
        edit: { order: 2 },
        timesheets: { order: 5, width: "15em" },
        accounting: { title: "Task", order: 2, width: "20em" },
      },
      optionsPromise: (formObject) =>
        API.graphql(
          graphqlOperation(getProject, {
            id: formObject.recordProjectId,
          })
        ).then(({ data: { getProject } }) =>
          getProject.tasks.sort().map((task) => [task, task])
        ),
    }),
  date: Yup.string()
    .required()
    .meta({
      input: true,
      title: "Date",
      views: {
        edit: { order: 3, type: "date" },
        accounting: { order: 0.5, width: "30em" },
        timesheets: { order: 2, width: "7em" },
      },
    }),
  hours: Yup.number()
    .required()
    .meta({
      input: true,
      title: "Hours",
      views: {
        edit: { order: 4 },
        timesheets: { order: 6, width: "3em" },
        accounting: { order: 3, width: "3em" },
      },
    }),
  description: Yup.string()
    .required()
    .meta({
      input: true,
      title: "Description",
      views: {
        edit: { order: 5 },
        timesheets: { order: 7, width: "30em" },
        accounting: { order: 4, width: "30em" },
      },
    }),
  userId: Yup.string()
    .required()
    .meta({
      input: true,
      title: "UserId",
      views: { accounting: { order: 5, width: "30em" } },
    }),
  invoiced: Yup.boolean()
    .required()
    .meta({
      input: true,
      title: "Invoiced",
      views: { accounting: { order: 0.25, width: "3em" } },
    }),
  submitted: Yup.boolean()
    .required()
    .meta({
      input: true,
      title: "Submitted",
      views: { timesheets: { order: 1, width: "4em" } },
    }),
});

export const getMeta = ({ entityType, view = "default" }) => {
  const schema = entityType === "project" ? ProjectSchema : RecordSchema;
  const { fields } = schema.describe();
  return {
    fields: Reflect.ownKeys(fields)
      .map((field) => ({
        name: field,
        view: fields[field].meta?.views?.[view],
        type: fields[field].type,
        input: fields[field].meta?.input,
        title: fields[field].meta?.title,
        optionsPromise: fields[field].meta.optionsPromise,
      }))
      .sort((a, b) => {
        const orderA = a.view && a.view.order;
        const orderB = b.view && b.view.order;
        if (orderA === undefined && orderB === undefined) {
          return 0;
        } else if (orderA === undefined && orderB !== undefined) {
          return 1;
        } else if (orderA !== undefined && orderB === undefined) {
          return -1;
        } else if (orderA < orderB) return -1;
        else if (orderA > orderB) return 1;
        else return 0;
      }),
    getOp: entityType === "project" ? getProject : getRecord,
    listOp: entityType === "project" ? listProjects : listRecords,
    createOp: entityType === "project" ? createProject : createRecord,
    updateOp: entityType === "project" ? updateProject : updateRecord,
    deleteOp: entityType === "project" ? deleteProject : deleteRecord,
    schema,
    entityType,
  };
};
