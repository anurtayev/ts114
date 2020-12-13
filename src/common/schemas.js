import React from "react";
import { API, graphqlOperation } from "aws-amplify";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import { useLocation } from "react-router-dom";

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
import { Utilities } from "components/Utilities";
import { StyledSpan } from "components/StyledSpan";
import { routes } from "common";

export const ProjectSchema = Yup.object()
  .shape({
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
            visible: true,
          },
          edit: {
            order: 1,
            visible: true,
          },
        },
      }),
    number: Yup.string()
      .required()
      .meta({
        input: true,
        title: "Project number",
        views: {
          default: { order: 0.5, width: "20em", visible: true },
          edit: {
            order: 2,
            visible: true,
          },
        },
      }),
    tasks: Yup.array()
      .required()
      .min(1, "need elements")
      .meta({
        input: true,
        title: "Project tasks",
        views: {
          edit: {
            order: 3,
            visible: true,
          },
        },
      }),
  })
  .meta({
    entityType: "project",
    getObjectCopy: (formObject) => ({
      ...formObject,
      id: uuidv4(),
      submitted: false,
      invoiced: false,
    }),
    getOp: getProject,
    listOp: listProjects,
    createOp: createProject,
    updateOp: updateProject,
    deleteOp: deleteProject,
    UtilityElement: ({ entry, meta, editFormReturnUrl }) => (
      <Utilities
        entry={entry}
        meta={meta}
        editFormReturnUrl={editFormReturnUrl}
      />
    ),
    UtilityElementHeader: () => (
      <StyledSpan width={"5.96rem"}>&#x25b8;</StyledSpan>
    ),
  });

export const RecordSchema = Yup.object()
  .shape({
    id: Yup.string().meta({
      input: true,
    }),
    recordProjectId: Yup.string()
      .required()
      .meta({
        input: true,
        title: "Project",
        views: {
          edit: { order: 1, visible: true },
        },
        optionsPromise: () =>
          API.graphql(graphqlOperation(listProjects, { limit: 1000 })).then(
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
      title: "Project",
      views: {
        timesheets: { order: 3, width: "5em", visible: true },
        accounting: {
          order: 1,
          width: "30em",
          visible: true,
        },
      },
    }),
    "project.name": Yup.string().meta({
      title: "Project Name",
      views: { timesheets: { order: 4, width: "15em", visible: true } },
    }),
    projectTask: Yup.string()
      .required()
      .meta({
        input: true,
        title: "Project Task",
        views: {
          edit: { order: 2, visible: true },
          timesheets: { order: 5, width: "15em", visible: true },
          accounting: { title: "Task", order: 2, width: "20em", visible: true },
        },
        optionsPromise: (formObject) =>
          formObject.recordProjectId
            ? API.graphql(
                graphqlOperation(getProject, {
                  id: formObject.recordProjectId,
                })
              )
                .then(({ data: { getProject } }) =>
                  getProject.tasks.sort().map((task) => [task, task])
                )
                .catch((err) => console.error(err))
            : Promise.resolve(),
      }),
    date: Yup.string()
      .required()
      .meta({
        input: true,
        title: "Date",
        views: {
          edit: { order: 3, type: "date", visible: true, width: "15rem" },
          accounting: { order: 0.5, width: "30em", visible: true },
          timesheets: { order: 2, width: "7em", visible: true },
        },
      }),
    hours: Yup.number()
      .required()
      .notOneOf([""])
      .moreThan(0)
      .max(8)
      .meta({
        input: true,
        title: "Hours",
        views: {
          edit: { order: 4, visible: true, width: "5rem" },
          timesheets: { order: 6, width: "3em", visible: true },
          accounting: { order: 3, width: "3em", visible: true },
        },
      }),
    description: Yup.string()
      .required()
      .meta({
        input: true,
        title: "Description",
        views: {
          edit: { order: 5, visible: true },
          timesheets: { order: 7, width: "30em", visible: true },
          accounting: { order: 4, width: "30em", visible: true },
        },
      }),
    userId: Yup.string()
      .required()
      .meta({
        input: true,
        title: "UserId",
        views: {
          timesheets: { width: "14em", visible: true },
          accounting: { order: 5, width: "30em", visible: true },
        },
      }),
    invoiced: Yup.boolean().required().meta({
      input: true,
      title: "Invoiced",
    }),
    submitted: Yup.boolean()
      .required()
      .meta({
        input: true,
        title: "Submitted",
        views: {
          timesheets: {
            order: 1,
            width: "4em",
            format: (value) => (value ? "Submitted" : ""),
          },
        },
      }),
  })
  .meta({
    entityType: "record",
    getObjectCopy: (formObject) => ({
      ...formObject,
      id: uuidv4(),
    }),
    getOp: getRecord,
    listOp: listRecords,
    createOp: createRecord,
    updateOp: updateRecord,
    deleteOp: deleteRecord,
    UtilityElement: ({ entry, meta, editFormReturnUrl }) => {
      const location = useLocation();

      if (!location) return null;
      else if (location.pathname === routes.accounting)
        return (
          <StyledSpan width={"6.797rem"}>
            {entry.invoiced ? "Invoiced" : ""}
          </StyledSpan>
        );
      else
        return entry.submitted ? (
          <StyledSpan width={"5.84rem"}>Submitted</StyledSpan>
        ) : (
          <Utilities
            entry={entry}
            meta={meta}
            editFormReturnUrl={editFormReturnUrl}
          />
        );
    },
    UtilityElementHeader: () => {
      const location = useLocation();

      if (!location) return null;

      return (
        <StyledSpan
          width={
            location.pathname === routes.accounting ? "6.797rem" : "5.84rem"
          }
        >
          &#x25b8;
        </StyledSpan>
      );
    },
  });

export const getFields = ({ schemaDescriptor: { fields }, view }) =>
  Reflect.ownKeys(fields)
    .map((field) => ({
      name: field,
      type: fields[field].type,
      input: fields[field]?.meta?.input,
      title: fields[field]?.meta?.title,
      optionsPromise: fields[field].meta?.optionsPromise,
      ...fields[field]?.meta?.views?.[view],
    }))
    .sort((a, b) => {
      const orderA = a.order;
      const orderB = b.order;
      if (orderA === undefined && orderB === undefined) {
        return 0;
      } else if (orderA === undefined && orderB !== undefined) {
        return 1;
      } else if (orderA !== undefined && orderB === undefined) {
        return -1;
      } else if (orderA < orderB) return -1;
      else if (orderA > orderB) return 1;
      else return 0;
    });

export const entityMap = {
  project: ProjectSchema,
  record: RecordSchema,
};

export const getSchema = (entityType) => entityMap[entityType];
export const getSchemaDescriptor = (schema) => schema.describe();
