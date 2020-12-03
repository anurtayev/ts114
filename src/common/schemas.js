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
  name: Yup.string()
    .required("Required")
    .meta({
      input: true,
      views: {
        default: {
          title: "Project name",
          order: 1,
          width: "30em",
        },
      },
    }),
  number: Yup.string()
    .required("Required")
    .meta({
      input: true,
      views: {
        default: { title: "Project number", order: 2, width: "20em" },
      },
    }),
  tasks: Yup.array()
    .required()
    .min(1, "need elems")
    .meta({
      input: true,
      views: { default: { title: "Project tasks", order: 3, width: "30em" } },
    }),
});

let selectedProject;

export const RecordSchema = Yup.object().shape({
  project: Yup.string()
    .required("Required")
    .meta({
      views: { accounting: { title: "Project", order: 1, width: "30em" } },
      options: async () => {
        selectedProject = null;
        try {
          const {
            data: {
              listProjects: { items: projects },
            },
          } = await API.graphql(graphqlOperation(listProjects));
          return projects
            .sort((a, b) =>
              a.number < b.number ? -1 : a.number > b.number ? 1 : 0
            )
            .map((project) => [
              project.id,
              `${project.number} - ${project.name}`,
            ]);
        } catch (err) {
          console.error(err);
        }
      },
      selectedValueCallback: async (value) => {
        selectedProject = value;
      },
    }),
  projectTask: Yup.string()
    .required("Required")
    .meta({
      views: { accounting: { title: "Task", order: 2, width: "20em" } },
      options: async () => {
        if (!selectedProject) return;
        try {
          const {
            data: { getProject: project },
          } = await API.graphql(
            graphqlOperation(getProject, { id: selectedProject })
          );
          return project.tasks.sort().map((task) => [task, task]);
        } catch (err) {
          console.error(err);
        }
      },
    }),
  date: Yup.string()
    .required()
    .meta({
      title: "Date",
      views: { accounting: { order: 3, width: "30em" } },
    }),
  hours: Yup.number()
    .required()
    .meta({
      title: "Hours",
      views: { accounting: { order: 3, width: "30em" } },
    }),
  description: Yup.string()
    .required()
    .meta({
      title: "Description",
      views: { accounting: { order: 3, width: "30em" } },
    }),
  userId: Yup.string()
    .required()
    .meta({
      title: "UserId",
      views: { accounting: { order: 3, width: "30em" } },
    }),
});

export const getMeta = ({ entityType, view = "default" }) => {
  const schema = entityType === "project" ? ProjectSchema : RecordSchema;
  const { fields } = schema.describe();
  return {
    fields: Reflect.ownKeys(fields)
      .map((field) => ({
        name: field,
        view: fields[field].meta.views && fields[field].meta.views[view],
        type: fields[field].type,
        input: fields[field].meta.input,
      }))
      .sort((a, b) => {
        const orderA = a.view.order;
        const orderB = b.view.order;
        if (orderA < orderB) return -1;
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
