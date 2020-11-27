/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateProject = /* GraphQL */ `
  subscription OnCreateProject {
    onCreateProject {
      id
      name
      number
      tasks
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateProject = /* GraphQL */ `
  subscription OnUpdateProject {
    onUpdateProject {
      id
      name
      number
      tasks
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteProject = /* GraphQL */ `
  subscription OnDeleteProject {
    onDeleteProject {
      id
      name
      number
      tasks
      createdAt
      updatedAt
    }
  }
`;
export const onCreateRecord = /* GraphQL */ `
  subscription OnCreateRecord {
    onCreateRecord {
      id
      project {
        id
        name
        number
        tasks
        createdAt
        updatedAt
      }
      projectTask
      date
      hours
      description
      submitted
      invoiced
      userId
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateRecord = /* GraphQL */ `
  subscription OnUpdateRecord {
    onUpdateRecord {
      id
      project {
        id
        name
        number
        tasks
        createdAt
        updatedAt
      }
      projectTask
      date
      hours
      description
      submitted
      invoiced
      userId
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteRecord = /* GraphQL */ `
  subscription OnDeleteRecord {
    onDeleteRecord {
      id
      project {
        id
        name
        number
        tasks
        createdAt
        updatedAt
      }
      projectTask
      date
      hours
      description
      submitted
      invoiced
      userId
      createdAt
      updatedAt
    }
  }
`;
