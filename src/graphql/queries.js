/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getProject = /* GraphQL */ `
  query GetProject($id: ID!) {
    getProject(id: $id) {
      id
      name
      number
      tasks
      createdAt
      updatedAt
    }
  }
`;
export const listProjects = /* GraphQL */ `
  query ListProjects(
    $filter: ModelProjectFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProjects(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        number
        tasks
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getRecord = /* GraphQL */ `
  query GetRecord($id: ID!) {
    getRecord(id: $id) {
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
export const listRecords = /* GraphQL */ `
  query ListRecords(
    $filter: ModelRecordFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRecords(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
