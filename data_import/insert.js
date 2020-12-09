const Amplify = require("aws-amplify");

Amplify.default.configure({
  aws_project_region: "us-east-1",
  aws_appsync_graphqlEndpoint:
    "https://ikhys5ya4ffujjdjshu2ukrbdm.appsync-api.us-east-1.amazonaws.com/graphql",
  aws_appsync_region: "us-east-1",
  aws_appsync_authenticationType: "API_KEY",
  aws_appsync_apiKey: "da2-rznbtyanengolm456hjc5vgv4e",
  aws_cognito_region: "us-east-1",
  aws_user_pools_id: "us-east-1_UwqWc56Fy",
  aws_user_pools_web_client_id: "7d9p4mts9pl2k84n37r1hm6rvv",
  oauth: {},
});
const { API, graphqlOperation } = require("aws-amplify");

const createProject = /* GraphQL */ `
  mutation CreateProject(
    $input: CreateProjectInput!
    $condition: ModelProjectConditionInput
  ) {
    createProject(input: $input, condition: $condition) {
      id
      name
      number
      tasks
      createdAt
      updatedAt
    }
  }
`;

const { v4 } = require("uuid");
const projects = require("../projects-import.json");
Promise.all(
  projects.map((project) =>
    API.graphql(
      graphqlOperation(createProject, {
        input: { ...project, id: v4() },
      })
    )
  )
).catch((error) => console.error(error));
