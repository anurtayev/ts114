import * as Yup from "yup";

export const getDescriptors = (schema) => schema.describe().fields;

export const getView = ({ descriptors, view = "default" }) =>
  Reflect.ownKeys(descriptors)
    .sort((a, b) => {
      const orderA = descriptors[a].meta.view[view].order;
      const orderB = descriptors[b].meta.view[view].order;
      if (orderA < orderB) return -1;
      else if (orderA > orderB) return 1;
      else return 0;
    })
    .map((field) => ({
      name: field,
      ...descriptors[field].meta.view[view],
      title: descriptors[field].meta.title,
      type: descriptors[field].type,
    }));

export const ProjectSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required")
    .meta({
      title: "Project name",
      view: { default: { order: 1, width: "30em" } },
    }),
  number: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required")
    .meta({
      title: "Project number",
      view: { default: { order: 2, width: "20em" } },
    }),
  tasks: Yup.array()
    .of(Yup.string().min(1).required())
    .min(1)
    .required()
    .meta({
      title: "Project tasks",
      view: { default: { order: 3, width: "30em" } },
    }),
});
