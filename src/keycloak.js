import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
  url: "http://localhost:8080",
  realm: "task_project",
  clientId: "task-manager-frontend",
});

export default keycloak;
