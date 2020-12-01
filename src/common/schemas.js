import * as Yup from "yup";
import { listProjects, getProject } from "graphql/queries";
import { API, graphqlOperation } from "aws-amplify";

export const getView = ({ schema, view = "default" }) => {
  const { fields } = schema.describe();
  return Reflect.ownKeys(fields)
    .map((field) => ({
      name: field,
      view: fields[field].meta.views[view],
      type: fields[field].type,
    }))
    .sort((a, b) => {
      const orderA = a.view.order;
      const orderB = b.view.order;
      if (orderA < orderB) return -1;
      else if (orderA > orderB) return 1;
      else return 0;
    });
};

export const ProjectSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required")
    .meta({
      views: {
        default: {
          title: "Project name",
          order: 1,
          width: "30em",
        },
      },
    }),
  number: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required")
    .meta({
      views: {
        default: { title: "Project number", order: 2, width: "20em" },
      },
    }),
  tasks: Yup.array()
    .of(Yup.string().min(1).required())
    .min(1)
    .required()
    .meta({
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
      views: { default: { title: "Task", order: 2, width: "20em" } },
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
      views: { default: { order: 3, width: "30em" } },
    }),
  hours: Yup.number()
    .required()
    .meta({
      title: "Hours",
      views: { default: { order: 3, width: "30em" } },
    }),
  description: Yup.string()
    .required()
    .meta({
      title: "Description",
      views: { default: { order: 3, width: "30em" } },
    }),
  userId: Yup.string()
    .required()
    .meta({
      title: "UserId",
      views: { default: { order: 3, width: "30em" } },
    }),
});

/**
 *         <TableHeaderColumn style={{width: '1rem'}}>Date</TableHeaderColumn>
        <TableHeaderColumn style={{width: '2rem'}}>Project#</TableHeaderColumn>
        <TableHeaderColumn style={{width: '8rem'}}>Task</TableHeaderColumn>
        <TableHeaderColumn style={{width: '1rem'}}>Hours</TableHeaderColumn>
        <TableHeaderColumn style={{width: '5rem'}}>Description</TableHeaderColumn>
        <TableHeaderColumn style={{width: '2rem'}}>User</TableHeaderColumn>

 */

/**
 *
 */
