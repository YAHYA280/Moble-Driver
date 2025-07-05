import { Redirect } from "expo-router";

export default function InnerApplicationIndex() {
  // Redirection automatique vers la page d'accueil
  return <Redirect href="/innerApplication/home" />;
}
